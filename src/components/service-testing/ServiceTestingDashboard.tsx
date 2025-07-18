import { useState } from 'react';
import { CyberpunkBackground } from '@/components/ui/CyberpunkBackground';
import { EvaluationMode, ExtractedFile } from './types';

type TestServiceType = 'llm' | 'custom' | 'pdf';
import { useServiceHealth } from './hooks/useServiceHealth';
import { usePDFExtraction } from './hooks/usePDFExtraction';
import { useLLMTesting } from './hooks/useLLMTesting';
import { copyToClipboard } from './utils/clipboardUtils';
import { downloadTextFile } from './utils/fileUtils';
import { Header } from './components/Header';
import { ServiceSelector } from './components/ServiceSelector';
import { TestResultsPanel } from './components/TestResultsPanel';
import { PDFUploadArea } from './components/PDFUploadArea';

export const ServiceTestingDashboard = () => {
  // 基础状态
  const [activeServiceType, setActiveServiceType] = useState<TestServiceType>('llm');
  const [evaluationMode, setEvaluationMode] = useState<EvaluationMode>('gentle');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // 使用自定义hooks
  const { llmServiceHealth, activeRequestsCount, checkLlmHealth, updateActiveRequestsCount } = useServiceHealth();

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

  // 处理复制到剪贴板
  const handleCopyToClipboard = async (text: string, id: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedText(id);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  // 处理下载文本
  const handleDownloadText = (file: ExtractedFile) => {
    const filename = `${file.file.name.replace(/\.[^/.]+$/, '')}_extracted.txt`;
    downloadTextFile(file.extractedText, filename);
  };

  // 处理简历分析测试
  const handleTestResumeAnalysis = () => {
    testResumeAnalysis(evaluationMode);
  };

  // 处理自定义分析测试
  const handleTestCustomAnalysis = () => {
    testCustomAnalysis(customPrompt, customContent);
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <CyberpunkBackground intensity="low" />

      <div className="relative z-10 h-full bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-sm flex flex-col">

        {/* 顶部状态栏 */}
        <Header
          llmServiceHealth={llmServiceHealth}
          activeRequestsCount={activeRequestsCount}
          onRefreshHealth={checkLlmHealth}
        />

        {/* 主内容区域 */}
        <div className="flex-1 min-h-0 flex">

          {/* 左侧：服务选择和配置 */}
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
              onTestResumeAnalysis={handleTestResumeAnalysis}
              onTestCustomAnalysis={handleTestCustomAnalysis}
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

          {/* 右侧：测试结果展示 */}
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
        </div>
      </div>
    </div>
  );
};
