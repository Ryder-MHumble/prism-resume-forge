import { ApiResponse } from '@/types';

// LLM服务相关类型定义
export interface LLMRequest {
  systemPrompt: string;
  userContent: string;
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

export interface ResumeAnalysisResult {
  overall_score: number;
  dimension_scores: Array<{
    dimension: string;
    score: number;
  }>;
  issues: Array<{
    id: number;
    title: string;
    description: string;
    impact: string;
    original: string;
    suggestion: string;
  }>;
}

// 硅基流动API配置
const API_BASE_URL = 'https://api.siliconflow.cn/v1';
const API_KEY = 'sk-lemirlxnzimfmzpzgpnnmtbuzbjvyhnncccogoonkawomovf';
const MODEL = 'Qwen/Qwen3-8B'; // 使用Qwen3-8B模型

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

// 获取系统提示词
const getSystemPrompt = async (): Promise<string> => {
  const response = await fetch('/Prompts/mean-resume-val.md');
  if (!response.ok) {
    throw new Error('获取系统提示词失败');
  }
  const content = await response.text();

  try {
    // 先尝试直接解析JSON
    const promptData = JSON.parse(content);
    return promptData.content;
  } catch (error) {
    console.warn('直接JSON解析失败，开始清理内容:', error);

    try {
      // 方法1: 智能清理转义字符
      let cleanedContent = content
        // 将文档中的转义引号\"还原为普通引号"
        .replace(/\\"/g, '"')
        // 将\\\\还原为\\
        .replace(/\\\\/g, '\\');

      const promptData = JSON.parse(cleanedContent);
      return promptData.content;
    } catch (secondError) {
      console.warn('第一种清理方法失败，尝试第二种方法:', secondError);

      try {
        // 方法2: 手动构建有效的JSON字符串
        // 找到content字段的值（从第一个"到最后一个"之间的内容）
        const contentMatch = content.match(/"content":\s*"([\s\S]*?)"\s*}/);
        if (contentMatch && contentMatch[1]) {
          let contentValue = contentMatch[1];

          // 处理内容中的转义字符
          contentValue = contentValue
            .replace(/\\"/g, '"')      // 转义引号
            .replace(/\\\\/g, '\\')    // 转义反斜杠
            .replace(/\\n/g, '\n')     // 转义换行符
            .replace(/\\t/g, '\t');    // 转义制表符

          return contentValue;
        }

        throw new Error('无法提取content字段');
      } catch (thirdError) {
        console.warn('第二种清理方法失败，尝试第三种方法:', thirdError);

        try {
          // 方法3: 正则表达式提取content部分
          const match = content.match(/"content":\s*"(.*?)(?="\s*})/s);
          if (match && match[1]) {
            return match[1]
              .replace(/\\"/g, '"')
              .replace(/\\\\/g, '\\')
              .replace(/\\n/g, '\n')
              .replace(/\\t/g, '\t');
          }

          throw new Error('无法通过正则表达式提取content');
        } catch (fourthError) {
          console.error('所有解析方法都失败了');
          console.error('原始内容前200字符:', content.substring(0, 200));
          console.error('最后错误:', fourthError);

          throw new Error('系统提示词文件格式错误，无法解析');
        }
      }
    }
  }
};

// 获取用户简历内容
const getUserContent = async (): Promise<string> => {
  try {
    const response = await fetch('/Prompts/resume.md');
    if (!response.ok) {
      throw new Error('获取简历内容失败');
    }
    return await response.text();
  } catch (error) {
    console.error('获取简历内容失败:', error);
    throw error;
  }
};

// 调用硅基流动API的核心函数
const callSiliconFlowAPI = async (
  systemPrompt: string,
  userContent: string,
  requestId: string,
  signal?: AbortSignal
): Promise<LLMResponse> => {
  const requestBody = {
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userContent
      }
    ],
    temperature: 0.7,
    max_tokens: 5120,
    stream: false,
    enable_thinking: false
  };

  const response = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
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
    sessionId: requestId,
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

// 解析LLM响应为结构化数据
const parseAnalysisResult = (content: string): ResumeAnalysisResult => {
  if (!content || content.trim() === '') {
    throw new Error('LLM响应内容为空');
  }

  try {
    // 直接解析JSON
    return JSON.parse(content);
  } catch (error) {
    console.error('解析LLM响应失败:', error);
    console.error('响应内容:', content);
    throw new Error(`响应格式错误: ${error instanceof Error ? error.message : '未知错误'}`);
  }
};

// 主要的简历分析服务
export const analyzeResumeWithLLM = async (): Promise<ApiResponse<ResumeAnalysisResult>> => {
  const requestId = requestManager.generateRequestId();

  try {
    const result = await requestManager.addRequest(async () => {
      const controller = requestManager.createCancellableRequest(requestId);

      return await withRetry(async () => {
        // 并行获取系统提示词和用户内容
        const [systemPrompt, userContent] = await Promise.all([
          getSystemPrompt(),
          getUserContent()
        ]);

        // 调用LLM API
        const llmResponse = await callSiliconFlowAPI(
          systemPrompt,
          userContent,
          requestId,
          controller.signal
        );

        // 解析响应
        const analysisResult = parseAnalysisResult(llmResponse.content);

        return {
          success: true,
          data: analysisResult,
          message: '简历分析完成',
          usage: llmResponse.usage
        };
      });
    }, requestId);

    return result;
  } catch (error) {
    console.error('简历分析失败:', error);

    if (error.name === 'AbortError') {
      return {
        success: false,
        error: '请求已取消'
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : '分析失败，请重试'
    };
  }
};

// 自定义分析服务（支持自定义输入）
export const analyzeCustomContent = async (
  customSystemPrompt?: string,
  customUserContent?: string
): Promise<ApiResponse<LLMResponse>> => {
  const requestId = requestManager.generateRequestId();

  try {
    const result = await requestManager.addRequest(async () => {
      const controller = requestManager.createCancellableRequest(requestId);

      return await withRetry(async () => {
        const systemPrompt = customSystemPrompt || await getSystemPrompt();
        const userContent = customUserContent || await getUserContent();

        const llmResponse = await callSiliconFlowAPI(
          systemPrompt,
          userContent,
          requestId,
          controller.signal
        );

        return {
          success: true,
          data: llmResponse,
          message: '分析完成'
        };
      });
    }, requestId);

    return result;
  } catch (error) {
    console.error('自定义分析失败:', error);

    if (error.name === 'AbortError') {
      return {
        success: false,
        error: '请求已取消'
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : '分析失败，请重试'
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
    const response = await fetch(`${API_BASE_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
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
