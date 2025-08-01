import { useState } from 'react';
import { EvaluationMode, ExtractedFile } from './types';

type TestServiceType = 'llm' | 'custom' | 'pdf' | 'crucible';
import { useServiceHealth } from './hooks/useServiceHealth';
import { usePDFExtraction } from './hooks/usePDFExtraction';
import { useLLMTesting } from './hooks/useLLMTesting';
import { useCrucibleChat } from './hooks/useCrucibleChat';
import { copyToClipboard } from './utils/clipboardUtils';
import { downloadTextFile } from './utils/fileUtils';

import { Header } from './components/Header';
import { ServiceSelector } from './components/ServiceSelector';
import { TestResultsPanel } from './components/TestResultsPanel';
import { PDFUploadArea } from './components/PDFUploadArea';
import { CrucibleTestPanel } from './components/CrucibleTestPanel';

export const ServiceTestingDashboard = () => {
  // 核心状态
  const [activeServiceType, setActiveServiceType] = useState<TestServiceType>('llm');
  const [evaluationMode, setEvaluationMode] = useState<EvaluationMode>('mean');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // 健康检查hook
  const {
    llmServiceHealth,
    activeRequestsCount: serviceActiveRequests,
    checkLlmHealth,
    updateActiveRequestsCount
  } = useServiceHealth();

  // PDF提取功能
  const {
    extractedFiles,
    isDragOver,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    removeFile
  } = usePDFExtraction();

  // LLM测试功能
  const {
    llmTestResults,
    expandedResultId,
    expandedSections,
    testResumeAnalysis,
    testCustomAnalysis,
    clearTestResults,
    toggleResultExpansion,
    toggleSection
  } = useLLMTesting(updateActiveRequestsCount);

  const {
    testResults: crucibleTestResults,
    expandedTestId: expandedCrucibleTestId,
    activeChatSession,
    currentMessage,
    isSendingMessage,
    prepareAnalysisData,
    startChatSession,
    sendMessage,
    endChat,
    clearTestResults: clearCrucibleTestResults,
    toggleTestExpansion,
    setCurrentMessage
  } = useCrucibleChat();

  // 处理复制到剪贴板
  const handleCopyToClipboard = async (text: string, id: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedText(id);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  // 处理文件下载
  const handleDownloadText = (text: string, filename: string) => {
    downloadTextFile(text, filename);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* 页面标题栏 */}
      <Header
        llmServiceHealth={llmServiceHealth}
        activeRequestsCount={serviceActiveRequests}
        onRefreshHealth={checkLlmHealth}
      />

      {/* 主要内容区域 */}
      <div className="container mx-auto p-6">
        <div className="flex gap-6 h-[calc(100vh-8rem)]">
          {/* 左侧：服务选择和配置面板 */}
          <div className="flex flex-col">
            <ServiceSelector
              activeServiceType={activeServiceType}
              evaluationMode={evaluationMode}
              customPrompt={customPrompt}
              customContent={customContent}
              llmTestResultsCount={llmTestResults.length}
              onServiceTypeChange={setActiveServiceType}
              onEvaluationModeChange={setEvaluationMode}
              onCustomPromptChange={setCustomPrompt}
              onCustomContentChange={setCustomContent}
              onClearTestResults={clearTestResults}
            />

            {/* PDF上传区域 */}
            {activeServiceType === 'pdf' && (
              <div className="w-80 p-4">
                <PDFUploadArea
                  isDragOver={isDragOver}
                  fileInputRef={fileInputRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onFileSelect={handleFileSelect}
                />
              </div>
            )}
          </div>

          {/* 能力炼金室面板 */}
          {activeServiceType === 'crucible' && (
            <CrucibleTestPanel
              testResults={crucibleTestResults}
              expandedTestId={expandedCrucibleTestId}
              activeChatSession={activeChatSession}
              currentMessage={currentMessage}
              isSendingMessage={isSendingMessage}
              onPrepareAnalysisData={prepareAnalysisData}
              onStartChatSession={startChatSession}
              onSendMessage={sendMessage}
              onEndChat={endChat}
              onClearTestResults={clearCrucibleTestResults}
              onToggleTestExpansion={toggleTestExpansion}
              onSetCurrentMessage={setCurrentMessage}
            />
          )}

          {/* 右侧：测试结果展示 */}
          {activeServiceType !== 'crucible' && (
            <TestResultsPanel
              activeServiceType={activeServiceType}
              llmTestResults={llmTestResults}
              extractedFiles={extractedFiles}
              expandedResultId={expandedResultId}
              expandedSections={expandedSections}
              copiedText={copiedText}
              onToggleResultExpansion={toggleResultExpansion}
              onToggleSection={toggleSection}
              onCopyToClipboard={handleCopyToClipboard}
              onRemoveFile={removeFile}
              onDownloadText={handleDownloadText}
            />
          )}

          {/* 能力炼金室的右侧区域 - 可以显示详细的对话内容或其他相关信息 */}
          {activeServiceType === 'crucible' && activeChatSession && (
            <div className="flex-1 p-6 bg-card/30">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">对话详情</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      轮次 {activeChatSession.roundCount}/{activeChatSession.maxRounds}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      activeChatSession.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {activeChatSession.status === 'active' ? '进行中' : '已完成'}
                    </span>
                  </div>
                </div>

                <div className="bg-background/50 rounded-lg p-4 mb-4">
                  <h3 className="font-medium mb-2">当前问题</h3>
                  <div className="text-sm text-muted-foreground mb-2">
                    <strong>标题：</strong>{activeChatSession.issueTitle}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>描述：</strong>{activeChatSession.issueDescription}
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  <h3 className="font-medium mb-3">对话记录</h3>
                  <div className="space-y-3">
                    {activeChatSession.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="text-sm font-medium mb-1">
                            {message.role === 'user' ? '您' : '简历助手'}
                          </div>
                          <div className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </div>
                          <div className="text-xs opacity-70 mt-2">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
