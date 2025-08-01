import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/store/AppContext';
import { CrucibleHeader, DefectList, ChatArea, ProgressPanel } from '@/components/crucible';
import { CyberpunkBackground } from '@/components/ui/CyberpunkBackground';
import {
  startCrucibleChat,
  sendCrucibleMessage,
  getCrucibleChatSession,
  CrucibleChatSession,
  CrucibleChatMessage,
  SendMessageRequest
} from '@/services/crucibleChatService';
import { analyzeResumeWithLLM } from '@/services/analysisService';

const Crucible = () => {
  const navigate = useNavigate();
  const { weaknessId } = useParams<{ weaknessId?: string }>();
  const { state } = useAppContext();

  const [currentDefectIndex, setCurrentDefectIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [completedDefects, setCompletedDefects] = useState<Set<number>>(new Set());
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);

  // 旧版本兼容（保留但逐渐废弃）
  const [messageCount, setMessageCount] = useState<Record<number, number>>({});
  const [messageHistory, setMessageHistory] = useState<Record<number, string[]>>({});

  // 新的对话会话管理
  const [chatSessions, setChatSessions] = useState<Record<number, CrucibleChatSession>>({});
  const [activeChatSession, setActiveChatSession] = useState<CrucibleChatSession | null>(null);

  // 消息发送状态
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // 需要首先运行分析以获取问题列表的状态
  const [needsAnalysis, setNeedsAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // 获取LLM分析的弱点数据，如果没有则使用空数组
  const defects = state.llmAnalysisResult?.issues || [];

  // 根据URL参数设置当前缺陷
  useEffect(() => {
    if (weaknessId && weaknessId !== 'all' && defects.length > 0) {
      const targetIndex = defects.findIndex(d => d.id.toString() === weaknessId);
      if (targetIndex !== -1) {
        setCurrentDefectIndex(targetIndex);
      }
    }
  }, [weaknessId, defects]);

  // 检查是否需要运行分析
  useEffect(() => {
    if (defects.length === 0) {
      setNeedsAnalysis(true);
    }
  }, [defects]);

  // 运行简历分析
  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const result = await analyzeResumeWithLLM('mean');
      if (result.success && result.data) {
        // 这里需要更新AppContext中的分析结果
        // 暂时通过页面刷新来获取最新结果
        window.location.reload();
      } else {
        setAnalysisError(result.error || '分析失败');
      }
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : '分析失败');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 启动对话会话
  const startChat = async (issueId: number) => {
    try {
      const result = await startCrucibleChat({
        analysisSessionId: 'latest', // 使用最新的分析结果
        issueId
      });

      if (result.success && result.data) {
        const session = result.data;
        setChatSessions(prev => ({ ...prev, [issueId]: session }));
        setActiveChatSession(session);
      } else {
        console.error('启动对话失败:', result.error);
      }
    } catch (error) {
      console.error('启动对话失败:', error);
    }
  };

  // 导航函数
  const handleBack = () => {
    navigate('/dashboard');
  };

  // 处理缺陷点击
  const handleDefectClick = async (index: number) => {
    setCurrentDefectIndex(index);

    // 获取当前问题的对话会话，如果不存在则创建
    const currentDefect = defects[index];
    if (currentDefect && !chatSessions[currentDefect.id]) {
      await startChat(currentDefect.id);
    } else if (chatSessions[currentDefect.id]) {
      setActiveChatSession(chatSessions[currentDefect.id]);
    }
  };

  // 处理用户回复
  const handleUserReply = async () => {
    if (!userResponse.trim() || !activeChatSession || isSendingMessage) return;
      
    const message = userResponse.trim();
    setUserResponse('');
    setIsSendingMessage(true);

    try {
      const messageRequest: SendMessageRequest = {
        chatSessionId: activeChatSession.sessionId,
        message
      };

      const result = await sendCrucibleMessage(messageRequest);

       if (result.success && result.data) {
         // 从服务层重新获取完整的会话数据
         const updatedSession = getCrucibleChatSession(activeChatSession.sessionId);
         if (updatedSession) {
           setChatSessions(prev => ({
             ...prev,
             [activeChatSession.sessionId]: updatedSession
           }));
           setActiveChatSession(updatedSession);

           // 检查是否完成对话
           if (!result.data.canContinue) {
             setCompletedDefects(prev => new Set(prev).add(currentDefectIndex));

             // 移动到下一个未完成的缺陷
             const nextIndex = defects.findIndex((_, index) =>
               index > currentDefectIndex && !completedDefects.has(index)
             );

             if (nextIndex !== -1) {
               setCurrentDefectIndex(nextIndex);
             }
           }
         }
      } else {
        console.error('发送消息失败:', result.error);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // 生成专属简历
  const handleGenerateResume = () => {
    navigate('/revelation');
  };

  const currentDefect = defects[currentDefectIndex];

  // 复制文本到剪贴板
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessage(text);
      setTimeout(() => setCopiedMessage(null), 2000);
    });
  };

  return (
    <div className="h-screen bg-background/80 overflow-hidden flex flex-col relative">
      {/* 背景动画 - 底层 */}
      <CyberpunkBackground intensity="medium" />

      <CrucibleHeader onBack={handleBack} />

      {/* 主要内容区域 */}
      <main className="container mx-auto px-4 pt-3 pb-0 flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 h-full">
          
          <DefectList
            defects={defects}
            currentDefectIndex={currentDefectIndex}
            completedDefects={completedDefects}
            messageCount={messageCount}
            onDefectClick={handleDefectClick}
            onGenerateResume={handleGenerateResume}
          />

          <ChatArea
            currentDefect={currentDefect}
            userResponse={userResponse}
            messageHistory={messageHistory}
            messageCount={messageCount}
            currentDefectIndex={currentDefectIndex}
            copiedMessage={copiedMessage}
            chatMessages={activeChatSession?.messages || []}
            isStreaming={isSendingMessage}
            streamingContent=""
            onUserResponseChange={setUserResponse}
            onUserReply={handleUserReply}
            onCopyText={handleCopyText}
          />

          <ProgressPanel
            completedCount={completedDefects.size}
            totalCount={defects.length}
          />
        </div>
      </main>
    </div>
  );
};

export { Crucible };