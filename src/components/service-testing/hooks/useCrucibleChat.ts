import { useState } from 'react';
import {
  startCrucibleChat,
  sendCrucibleMessage,
  getCrucibleChatSession,
  getAllCrucibleChatSessions,
  endCrucibleChatSession,
  cleanupExpiredChatSessions,
  CrucibleChatSession,
  StartChatRequest,
  SendMessageRequest
} from '@/services/crucibleChatService';
import { analyzeResumeWithLLM } from '@/services/analysisService';

export interface CrucibleTestResult {
  testId: string;
  timestamp: number;
  status: 'running' | 'success' | 'error';
  analysisSessionId?: string;
  availableIssues?: Array<{
    id: number;
    title: string;
    description: string;
  }>;
  chatSession?: CrucibleChatSession;
  error?: string;
  duration?: number;
}

export const useCrucibleChat = () => {
  const [testResults, setTestResults] = useState<CrucibleTestResult[]>([]);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [activeChatSession, setActiveChatSession] = useState<CrucibleChatSession | null>(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // 准备分析数据 - 运行简历分析获取问题列表
  const prepareAnalysisData = async (mode: 'gentle' | 'mean' = 'mean') => {
    const testId = `analysis_${Date.now()}`;
    const startTime = Date.now();

    const testResult: CrucibleTestResult = {
      testId,
      timestamp: startTime,
      status: 'running'
    };

    setTestResults(prev => [testResult, ...prev.slice(0, 9)]);

    try {
      const analysisResult = await analyzeResumeWithLLM(mode);
      const duration = Date.now() - startTime;

      if (analysisResult.success && analysisResult.data) {
        const availableIssues = analysisResult.data.issues.map(issue => ({
          id: issue.id,
          title: issue.title,
          description: issue.description
        }));

        // 直接从分析结果中获取sessionId
        const actualSessionId = analysisResult.data.sessionId;

        setTestResults(prev =>
          prev.map(test =>
            test.testId === testId
              ? {
                  ...test,
                  status: 'success' as const,
                  analysisSessionId: actualSessionId,
                  availableIssues,
                  duration
                }
              : test
          )
        );

        return {
          success: true,
          analysisSessionId: actualSessionId,
          availableIssues
        };
      } else {
        setTestResults(prev =>
          prev.map(test =>
            test.testId === testId
              ? {
                  ...test,
                  status: 'error' as const,
                  error: analysisResult.error || '分析失败',
                  duration
                }
              : test
          )
        );

        return {
          success: false,
          error: analysisResult.error || '分析失败'
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      setTestResults(prev =>
        prev.map(test =>
          test.testId === testId
            ? {
                ...test,
                status: 'error' as const,
                error: error instanceof Error ? error.message : '未知错误',
                duration
              }
            : test
        )
      );

      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  };

  // 启动对话会话
  const startChatSession = async (analysisSessionId: string, issueId: number) => {
    const testId = `chat_${Date.now()}`;
    const startTime = Date.now();

    const testResult: CrucibleTestResult = {
      testId,
      timestamp: startTime,
      status: 'running'
    };

    setTestResults(prev => [testResult, ...prev.slice(0, 9)]);

    try {
      const startRequest: StartChatRequest = {
        analysisSessionId,
        issueId
      };

      const chatResult = await startCrucibleChat(startRequest);
      const duration = Date.now() - startTime;

      if (chatResult.success && chatResult.data) {
        setTestResults(prev =>
          prev.map(test =>
            test.testId === testId
              ? {
                  ...test,
                  status: 'success' as const,
                  chatSession: chatResult.data,
                  duration
                }
              : test
          )
        );

        setActiveChatSession(chatResult.data);
        return { success: true, session: chatResult.data };
      } else {
        setTestResults(prev =>
          prev.map(test =>
            test.testId === testId
              ? {
                  ...test,
                  status: 'error' as const,
                  error: chatResult.error || '启动对话失败',
                  duration
                }
              : test
          )
        );

        return { success: false, error: chatResult.error || '启动对话失败' };
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      setTestResults(prev =>
        prev.map(test =>
          test.testId === testId
            ? {
                ...test,
                status: 'error' as const,
                error: error instanceof Error ? error.message : '未知错误',
                duration
              }
            : test
        )
      );

      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  };

  // 发送消息
  const sendMessage = async (message: string) => {
    if (!activeChatSession || !message.trim()) {
      return { success: false, error: '无效的消息或会话' };
    }

    setIsSendingMessage(true);

    try {
      const sendRequest: SendMessageRequest = {
        chatSessionId: activeChatSession.sessionId,
        message: message.trim()
      };

      const messageResult = await sendCrucibleMessage(sendRequest);

      if (messageResult.success && messageResult.data) {
        // 获取更新后的会话数据
        const updatedSession = getCrucibleChatSession(activeChatSession.sessionId);
        if (updatedSession) {
          setActiveChatSession(updatedSession);

          // 更新测试结果中的会话数据
          setTestResults(prev =>
            prev.map(test =>
              test.chatSession?.sessionId === activeChatSession.sessionId
                ? { ...test, chatSession: updatedSession }
                : test
            )
          );
        }

        return {
          success: true,
          response: messageResult.data,
          canContinue: messageResult.data.canContinue
        };
      } else {
        return {
          success: false,
          error: messageResult.error || '发送消息失败'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '发送消息失败'
      };
    } finally {
      setIsSendingMessage(false);
    }
  };

  // 结束对话会话
  const endChat = (sessionId: string) => {
    const success = endCrucibleChatSession(sessionId);
    if (success && activeChatSession?.sessionId === sessionId) {
      setActiveChatSession(null);
    }
    return success;
  };

  // 清理测试结果
  const clearTestResults = () => {
    setTestResults([]);
    setActiveChatSession(null);
    setExpandedTestId(null);
    setCurrentMessage('');
  };

  // 切换测试结果展开状态
  const toggleTestExpansion = (testId: string) => {
    setExpandedTestId(prev => prev === testId ? null : testId);
  };

  // 获取所有活跃的对话会话
  const getAllActiveSessions = () => {
    return getAllCrucibleChatSessions();
  };

  // 清理过期会话
  const cleanupExpiredSessions = () => {
    return cleanupExpiredChatSessions();
  };

  return {
    // 状态
    testResults,
    expandedTestId,
    activeChatSession,
    currentMessage,
    isSendingMessage,

    // 方法
    prepareAnalysisData,
    startChatSession,
    sendMessage,
    endChat,
    clearTestResults,
    toggleTestExpansion,
    getAllActiveSessions,
    cleanupExpiredSessions,

    // 更新方法
    setCurrentMessage,
    setActiveChatSession
  };
};
