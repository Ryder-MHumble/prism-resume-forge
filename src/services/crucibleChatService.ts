import { callLLM, LLMRequest, callLLMStream, LLMStreamRequest, LLMStreamChunk, LLMResponse } from './llmService';
import { IssuesRegistry, ResumeAnalysisResult } from './analysisService';
import { ApiResponse } from '@/types';

// 能力炼金室对话相关类型定义
export interface CrucibleChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface CrucibleChatSession {
  sessionId: string;
  issueId: number;
  issueTitle: string;
  issueDescription: string;
  originalContent: string;
  resumeContent: string;
  messages: CrucibleChatMessage[];
  roundCount: number;
  maxRounds: number;
  createdAt: number;
  updatedAt: number;
  status: 'active' | 'completed' | 'expired';
}

export interface StartChatRequest {
  analysisSessionId: string; // 分析会话ID，用于从IssuesRegistry获取问题数据
  issueId: number; // 问题ID
}

export interface SendMessageRequest {
  chatSessionId: string;
  message: string;
}

export interface SendMessageStreamRequest {
  chatSessionId: string;
  message: string;
  onChunk?: (chunk: { content: string; finished: boolean }) => void;
  onComplete?: (response: CrucibleChatResponse) => void;
  onError?: (error: Error) => void;
}

export interface CrucibleChatResponse {
  sessionId: string;
  message: CrucibleChatMessage;
  roundCount: number;
  canContinue: boolean;
  suggestions?: string[]; // 可选的建议回复
}

// 对话会话存储字典
const ChatSessionsRegistry: Map<string, CrucibleChatSession> = new Map();

/**
 * 获取系统提示词
 */
const getCrucibleSystemPrompt = async (): Promise<string> => {
  try {
    const response = await fetch('/Prompts/crucible-chat.md');
    if (!response.ok) {
      throw new Error('获取系统提示词失败');
    }
    // 现在直接返回markdown内容，无需JSON解析
    const content = await response.text();
    return content.trim();
  } catch (error) {
    console.error('获取系统提示词失败:', error);
    throw error;
  }
};

/**
 * 获取简历内容
 */
const getResumeContent = async (): Promise<string> => {
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

/**
 * 生成唯一的对话会话ID
 */
const generateChatSessionId = (): string => {
  return `crucible_chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 生成消息ID
 */
const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
};

/**
 * 构建对话上下文
 */
const buildChatContext = (session: CrucibleChatSession): string => {
  return `## 问题信息
**问题标题**: ${session.issueTitle}
**问题描述**: ${session.issueDescription}
**原始内容**: ${session.originalContent}

## 简历全文
${session.resumeContent}

## 对话历史
${session.messages.map(msg => `**${msg.role === 'user' ? '用户' : '助手'}**: ${msg.content}`).join('\n\n')}`;
};

/**
 * 启动针对特定问题的对话会话
 */
export const startCrucibleChat = async (
  request: StartChatRequest
): Promise<ApiResponse<CrucibleChatSession>> => {
  try {
    // 从数据字典获取问题数据
    const issues = IssuesRegistry.get(request.analysisSessionId);
    if (!issues) {
      return {
        success: false,
        error: '未找到分析数据，请先进行简历分析'
      };
    }

    // 查找指定的问题
    const issue = issues.find(item => item.id === request.issueId);
    if (!issue) {
      return {
        success: false,
        error: '未找到指定的问题'
      };
    }

    // 获取简历内容
    const resumeContent = await getResumeContent();

    // 创建新的对话会话
    const sessionId = generateChatSessionId();
    const session: CrucibleChatSession = {
      sessionId,
      issueId: request.issueId,
      issueTitle: issue.title,
      issueDescription: issue.description,
      originalContent: issue.original,
      resumeContent,
      messages: [],
      roundCount: 0,
      maxRounds: 5,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'active'
    };

    // 存储会话
    ChatSessionsRegistry.set(sessionId, session);

    // 生成初始欢迎消息
    const systemPrompt = await getCrucibleSystemPrompt();
    const contextPrompt = buildChatContext(session);

    const llmRequest: LLMRequest = {
      systemPrompt,
      userQuery: `请开始对话，这是我们要解决的问题。请按照第一轮对话的策略进行：问题确认、背景了解、初步诊断和改进方向。

${contextPrompt}`,
      temperature: 0.7,
      maxTokens: 2048,
      sessionId: sessionId
    };

    const llmResponse = await callLLM(llmRequest);

    if (!llmResponse.success) {
      return {
        success: false,
        error: llmResponse.error || '启动对话失败'
      };
    }

    // 添加助手的初始消息
    const assistantMessage: CrucibleChatMessage = {
      id: generateMessageId(),
      role: 'assistant',
      content: llmResponse.data!.content,
      timestamp: Date.now()
    };

    session.messages.push(assistantMessage);
    session.roundCount = 1;
    session.updatedAt = Date.now();

    // 更新存储
    ChatSessionsRegistry.set(sessionId, session);

    return {
      success: true,
      data: session,
      message: '对话会话启动成功'
    };
  } catch (error) {
    console.error('启动对话会话失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '启动对话失败'
    };
  }
};

/**
 * 发送消息并获取回复
 */
export const sendCrucibleMessage = async (
  request: SendMessageRequest
): Promise<ApiResponse<CrucibleChatResponse>> => {
  try {
    // 获取对话会话
    const session = ChatSessionsRegistry.get(request.chatSessionId);
    if (!session) {
      return {
        success: false,
        error: '对话会话不存在'
      };
    }

    // 检查会话状态
    if (session.status !== 'active') {
      return {
        success: false,
        error: '对话会话已结束'
      };
    }

    // 检查轮次限制
    if (session.roundCount >= session.maxRounds) {
      session.status = 'completed';
      ChatSessionsRegistry.set(request.chatSessionId, session);
      return {
        success: false,
        error: '已达到最大对话轮次限制'
      };
    }

    // 添加用户消息
    const userMessage: CrucibleChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: request.message,
      timestamp: Date.now()
    };

    session.messages.push(userMessage);

    // 构建完整的对话上下文
    const systemPrompt = await getCrucibleSystemPrompt();
    const contextPrompt = buildChatContext(session);

    const currentRoundInfo = `
## 当前对话状态
- 当前轮次：${session.roundCount + 1}/${session.maxRounds}
- 用户刚才的消息：${request.message}

请根据当前轮次和用户回复，按照对话策略继续指导。如果这是最后一轮对话，请提供总结性的最终建议。`;

    const llmRequest: LLMRequest = {
      systemPrompt,
      userQuery: `${contextPrompt}

${currentRoundInfo}`,
      temperature: 0.7,
      maxTokens: 2048,
      sessionId: session.sessionId
    };

    const llmResponse = await callLLM(llmRequest);

    if (!llmResponse.success) {
      return {
        success: false,
        error: llmResponse.error || '获取回复失败'
      };
    }

    // 添加助手回复
    const assistantMessage: CrucibleChatMessage = {
      id: generateMessageId(),
      role: 'assistant',
      content: llmResponse.data!.content,
      timestamp: Date.now()
    };

    session.messages.push(assistantMessage);
    session.roundCount++;
    session.updatedAt = Date.now();

    // 检查是否需要结束会话
    const canContinue = session.roundCount < session.maxRounds;
    if (!canContinue) {
      session.status = 'completed';
    }

    // 更新存储
    ChatSessionsRegistry.set(request.chatSessionId, session);

    // 输出对话记录到控制台（任务3要求）
    if (!canContinue || session.roundCount >= session.maxRounds) {
      console.log(`=== 问题 ${session.issueId}: ${session.issueTitle} 对话记录 ===`);
      session.messages.forEach((msg, index) => {
        console.log(`${index + 1}. [${msg.role === 'user' ? '用户' : '助手'}] (${new Date(msg.timestamp).toLocaleTimeString()})`);
        console.log(`   ${msg.content}`);
        console.log('---');
      });
      console.log('=== 对话记录结束 ===\n');
    }

    const response: CrucibleChatResponse = {
      sessionId: session.sessionId,
      message: assistantMessage,
      roundCount: session.roundCount,
      canContinue,
      suggestions: canContinue ? [
        '我想了解更多关于这个建议的细节',
        '这个改进方向听起来不错，具体应该怎么做？',
        '还有其他的优化建议吗？'
      ] : undefined
    };

    return {
      success: true,
      data: response,
      message: '消息发送成功'
    };
  } catch (error) {
    console.error('发送消息失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '发送消息失败'
    };
  }
};

/**
 * 发送消息并获取流式回复
 */
export const sendCrucibleMessageStream = async (
  request: SendMessageStreamRequest
): Promise<string> => {
  try {
    // 获取对话会话
    const session = ChatSessionsRegistry.get(request.chatSessionId);
    if (!session) {
      request.onError?.(new Error('对话会话不存在'));
      throw new Error('对话会话不存在');
    }

    // 检查会话状态
    if (session.status !== 'active') {
      request.onError?.(new Error('对话会话已结束'));
      throw new Error('对话会话已结束');
    }

    // 检查轮次限制
    if (session.roundCount >= session.maxRounds) {
      session.status = 'completed';
      ChatSessionsRegistry.set(request.chatSessionId, session);
      request.onError?.(new Error('已达到最大对话轮次限制'));
      throw new Error('已达到最大对话轮次限制');
    }

    // 添加用户消息
    const userMessage: CrucibleChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: request.message,
      timestamp: Date.now()
    };

    session.messages.push(userMessage);

    // 构建完整的对话上下文
    const systemPrompt = await getCrucibleSystemPrompt();
    const contextPrompt = buildChatContext(session);

    const currentRoundInfo = `
## 当前对话状态
- 当前轮次：${session.roundCount + 1}/${session.maxRounds}
- 用户刚才的消息：${request.message}

请根据当前轮次和用户回复，按照对话策略继续指导。如果这是最后一轮对话，请提供总结性的最终建议。`;

    // 创建助手消息的占位符
    const assistantMessage: CrucibleChatMessage = {
      id: generateMessageId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    };

    session.messages.push(assistantMessage);

    let fullContent = '';

    // 流式LLM请求
    const llmStreamRequest: LLMStreamRequest = {
      systemPrompt,
      userQuery: `${contextPrompt}

${currentRoundInfo}`,
      temperature: 0.7,
      maxTokens: 2048,
      sessionId: session.sessionId,
      onChunk: (chunk: LLMStreamChunk) => {
        fullContent += chunk.content;

        // 实时更新助手消息内容
        assistantMessage.content = fullContent;
        ChatSessionsRegistry.set(request.chatSessionId, session);

        // 调用用户提供的回调
        request.onChunk?.({
          content: chunk.content,
          finished: chunk.finished
        });
      },
      onComplete: (response: LLMResponse) => {
        // 最终更新会话状态
        assistantMessage.content = response.content;
        session.roundCount++;
        session.updatedAt = Date.now();

        // 检查是否需要结束会话
        const canContinue = session.roundCount < session.maxRounds;
        if (!canContinue) {
          session.status = 'completed';
        }

        // 更新存储
        ChatSessionsRegistry.set(request.chatSessionId, session);

        const chatResponse: CrucibleChatResponse = {
          sessionId: session.sessionId,
          message: assistantMessage,
          roundCount: session.roundCount,
          canContinue,
          suggestions: canContinue ? [
            '我想了解更多关于这个建议的细节',
            '这个改进方向听起来不错，具体应该怎么做？',
            '还有其他的优化建议吗？'
          ] : undefined
        };

        // 输出对话记录到控制台（任务3要求）
        if (!canContinue || session.roundCount >= session.maxRounds) {
          console.log(`=== 问题 ${session.issueId}: ${session.issueTitle} 对话记录 ===`);
          session.messages.forEach((msg, index) => {
            console.log(`${index + 1}. [${msg.role === 'user' ? '用户' : '助手'}] (${new Date(msg.timestamp).toLocaleTimeString()})`);
            console.log(`   ${msg.content}`);
            console.log('---');
          });
          console.log('=== 对话记录结束 ===\n');
        }

        request.onComplete?.(chatResponse);
      },
      onError: (error: Error) => {
        // 移除占位符消息
        session.messages.pop();
        ChatSessionsRegistry.set(request.chatSessionId, session);

        request.onError?.(error);
      }
    };

    const requestId = await callLLMStream(llmStreamRequest);
    return requestId;

  } catch (error) {
    console.error('流式发送消息失败:', error);
    const errorObj = error instanceof Error ? error : new Error('发送消息失败');
    request.onError?.(errorObj);
    throw errorObj;
  }
};

/**
 * 获取对话会话详情
 */
export const getCrucibleChatSession = (sessionId: string): CrucibleChatSession | null => {
  return ChatSessionsRegistry.get(sessionId) || null;
};

/**
 * 获取所有对话会话（用于调试）
 */
export const getAllCrucibleChatSessions = (): CrucibleChatSession[] => {
  return Array.from(ChatSessionsRegistry.values());
};

/**
 * 结束对话会话
 */
export const endCrucibleChatSession = (sessionId: string): boolean => {
  const session = ChatSessionsRegistry.get(sessionId);
  if (!session) {
    return false;
  }

  session.status = 'completed';
  session.updatedAt = Date.now();
  ChatSessionsRegistry.set(sessionId, session);
  return true;
};

/**
 * 清理过期的对话会话（超过24小时未活动）
 */
export const cleanupExpiredChatSessions = (): number => {
  const now = Date.now();
  const expirationTime = 24 * 60 * 60 * 1000; // 24小时
  let cleanedCount = 0;

  ChatSessionsRegistry.forEach((session, sessionId) => {
    if (now - session.updatedAt > expirationTime) {
      ChatSessionsRegistry.delete(sessionId);
      cleanedCount++;
    }
  });

  return cleanedCount;
};

/**
 * 导出对话历史（用于保存和分析）
 */
export const exportChatHistory = (sessionId: string): {
  session: CrucibleChatSession;
  summary: {
    totalMessages: number;
    userMessages: number;
    assistantMessages: number;
    duration: number;
  };
} | null => {
  const session = ChatSessionsRegistry.get(sessionId);
  if (!session) {
    return null;
  }

  const userMessages = session.messages.filter(msg => msg.role === 'user');
  const assistantMessages = session.messages.filter(msg => msg.role === 'assistant');

  return {
    session,
    summary: {
      totalMessages: session.messages.length,
      userMessages: userMessages.length,
      assistantMessages: assistantMessages.length,
      duration: session.updatedAt - session.createdAt
    }
  };
};
