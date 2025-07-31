import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/store/AppContext';
import { CrucibleHeader, DefectList, ChatArea, ProgressPanel } from '@/components/crucible';

const Crucible = () => {
  const navigate = useNavigate();
  const { weaknessId } = useParams<{ weaknessId?: string }>();
  const { state } = useAppContext();

  const [currentDefectIndex, setCurrentDefectIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [completedDefects, setCompletedDefects] = useState<Set<number>>(new Set());
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  // 消息计数：记录每个问题的消息数量
  const [messageCount, setMessageCount] = useState<Record<number, number>>({});
  // 消息历史：记录每个问题的消息内容
  const [messageHistory, setMessageHistory] = useState<Record<number, string[]>>({});

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

  // 导航函数
  const handleBack = () => {
    navigate('/dashboard');
  };

  // 处理缺陷点击
  const handleDefectClick = (index: number) => {
    setCurrentDefectIndex(index);
  };

  // 处理用户回复
  const handleUserReply = () => {
    if (userResponse.trim()) {
      // 更新消息计数
      const currentCount = messageCount[currentDefectIndex] || 0;
      const newCount = currentCount + 1;
      
      const newMessageCount = { ...messageCount, [currentDefectIndex]: newCount };
      setMessageCount(newMessageCount);

      // 更新消息历史
      const currentHistory = messageHistory[currentDefectIndex] || [];
      const newHistory = [...currentHistory, userResponse.trim()];
      const newMessageHistory = { ...messageHistory, [currentDefectIndex]: newHistory };
      setMessageHistory(newMessageHistory);

      // 如果达到5条消息，自动标记为完成
      if (newCount >= 5) {
      const newCompleted = new Set(completedDefects);
      newCompleted.add(currentDefectIndex);
      setCompletedDefects(newCompleted);

      // 移动到下一个未完成的缺陷
      const nextIndex = defects.findIndex((_, index) =>
        index > currentDefectIndex && !newCompleted.has(index)
      );

      if (nextIndex !== -1) {
        setCurrentDefectIndex(nextIndex);
        }
      }

      setUserResponse('');
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
    <div className="h-screen bg-background overflow-hidden flex flex-col">
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