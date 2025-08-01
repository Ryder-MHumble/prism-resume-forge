import { ApiResponse } from '@/types';

// LLM服务相关类型定义
export interface LLMRequest {
  model?: string;
  systemPrompt: string;
  userQuery: string;
  sessionId?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  sessionId: string;
  requestId: string;
}

// 默认LLM API配置
const DEFAULT_API_CONFIG = {
  baseUrl: 'https://api.siliconflow.cn/v1',
  apiKey: 'sk-lemirlxnzimfmzpzgpnnmtbuzbjvyhnncccogoonkawomovf',
  model: 'Qwen/Qwen3-8B'
};

// 用于支持多用户并发的请求队列管理
class RequestManager {
  private activeRequests = new Map<string, AbortController>();
  private requestQueue: Array<() => Promise<any>> = [];
  private maxConcurrent = 10; // 最大并发数
  private currentConcurrent = 0;

  // 生成唯一请求ID
  generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 添加请求到队列
  async addRequest<T>(requestFn: () => Promise<T>, requestId: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const execute = async () => {
        if (this.currentConcurrent >= this.maxConcurrent) {
          // 如果超过最大并发数，等待
          setTimeout(() => this.addRequest(requestFn, requestId).then(resolve).catch(reject), 100);
          return;
        }

        this.currentConcurrent++;

        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.currentConcurrent--;
          this.activeRequests.delete(requestId);
        }
      };

      execute();
    });
  }

  // 取消请求
  cancelRequest(requestId: string): void {
    const controller = this.activeRequests.get(requestId);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(requestId);
    }
  }

  // 创建可取消的请求
  createCancellableRequest(requestId: string): AbortController {
    const controller = new AbortController();
    this.activeRequests.set(requestId, controller);
    return controller;
  }
}

const requestManager = new RequestManager();


// 调用LLM API的核心函数
const callLLMAPI = async (
  request: LLMRequest,
  requestId: string,
  signal?: AbortSignal,
  apiConfig = DEFAULT_API_CONFIG
): Promise<LLMResponse> => {
  const requestBody = {
    model: request.model || apiConfig.model,
    messages: [
      {
        role: 'system',
        content: request.systemPrompt
      },
      {
        role: 'user',
        content: request.userQuery
      }
    ],
    temperature: request.temperature || 0.7,
    max_tokens: request.maxTokens || 5120,
    stream: false,
    enable_thinking: false
  };

  const response = await fetch(`${apiConfig.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiConfig.apiKey}`
    },
    body: JSON.stringify(requestBody),
    signal
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API调用失败: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();

  return {
    content: data.choices[0].message.content,
    usage: {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens
    },
    sessionId: request.sessionId || requestId,
    requestId
  };
};

// 重试机制
const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      // 指数退避策略
      const backoffDelay = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }

  throw lastError!;
};

/**
 * 主要的LLM调用服务 - 通用接口
 * @param request LLM请求参数
 * @param apiConfig 可选的API配置，如不提供则使用默认配置
 * @returns Promise<ApiResponse<LLMResponse>>
 */
export const callLLM = async (
  request: LLMRequest,
  apiConfig?: typeof DEFAULT_API_CONFIG
): Promise<ApiResponse<LLMResponse>> => {
  const requestId = requestManager.generateRequestId();

  try {
    const result = await requestManager.addRequest(async () => {
      const controller = requestManager.createCancellableRequest(requestId);

      return await withRetry(async () => {
        const llmResponse = await callLLMAPI(
          request,
          requestId,
          controller.signal,
          apiConfig
        );

        return {
          success: true,
          data: llmResponse,
          message: 'LLM调用成功'
        };
      });
    }, requestId);

    return result;
  } catch (error) {
    console.error('LLM调用失败:', error);

    if (error.name === 'AbortError') {
      return {
        success: false,
        error: '请求已取消'
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'LLM调用失败，请重试'
    };
  }
};

// 取消请求
export const cancelAnalysis = (requestId: string): void => {
  requestManager.cancelRequest(requestId);
};

// 获取当前活跃请求数量
export const getActiveRequestsCount = (): number => {
  return requestManager['currentConcurrent'];
};

// 健康检查
export const healthCheck = async (): Promise<ApiResponse<{ status: string; timestamp: number }>> => {
  try {
    const response = await fetch(`${DEFAULT_API_CONFIG.baseUrl}/models`, {
      headers: {
        'Authorization': `Bearer ${DEFAULT_API_CONFIG.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error('API服务不可用');
    }

    return {
      success: true,
      data: {
        status: 'healthy',
        timestamp: Date.now()
      },
      message: 'LLM服务运行正常'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'LLM服务检查失败'
    };
  }
};
