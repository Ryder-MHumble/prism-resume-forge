import { Brain, FileText, Image } from 'lucide-react';
import { LLMTestResult } from '@/types';
import { ExtractedFile, ImageExtractionResult } from '../types';
import { LLMTestResults } from './LLMTestResults';
import { PDFExtractionResults } from './PDFExtractionResults';

interface TestResultsPanelProps {
  activeServiceType: 'llm' | 'custom' | 'pdf' | 'image';
  llmTestResults: LLMTestResult[];
  extractedFiles: ExtractedFile[];
  imageResults: ImageExtractionResult[];
  expandedResultId: string | null;
  expandedSections: {[key: string]: Set<string>};
  copiedText: string | null;
  onToggleResultExpansion: (id: string) => void;
  onToggleSection: (resultId: string, sectionType: string) => void;
  onCopyToClipboard: (text: string, id: string) => void;
  onRemoveFile: (index: number, type: 'pdf' | 'image') => void;
  onDownloadText: (text: string, filename: string) => void;
}

export const TestResultsPanel = ({
  activeServiceType,
  llmTestResults,
  extractedFiles,
  imageResults,
  expandedResultId,
  expandedSections,
  copiedText,
  onToggleResultExpansion,
  onToggleSection,
  onCopyToClipboard,
  onRemoveFile,
  onDownloadText
}: TestResultsPanelProps) => {
  const getServiceIcon = () => {
    switch (activeServiceType) {
      case 'llm':
      case 'custom':
        return <Brain className="w-5 h-5" />;
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'image':
        return <Image className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  const getServiceDescription = () => {
    switch (activeServiceType) {
      case 'llm':
        return '显示LLM简历分析结果';
      case 'custom':
        return '显示自定义测试结果';
      case 'pdf':
        return '显示PDF文本提取结果';
      case 'image':
        return '显示图片OCR提取结果';
      default:
        return '显示测试结果';
    }
  };

  const getResultCount = () => {
    switch (activeServiceType) {
      case 'llm':
      case 'custom':
        return llmTestResults.length;
      case 'pdf':
        return extractedFiles.length;
      case 'image':
        return imageResults.length;
      default:
        return 0;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-shrink-0 p-4 border-b border-primary/20 bg-background/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getServiceIcon()}
            <div>
              <h2 className="text-lg font-semibold">测试结果</h2>
              <p className="text-sm text-muted-foreground">
                {getServiceDescription()}
              </p>
            </div>
          </div>

          {/* 结果统计 */}
          <div className="flex items-center gap-4 text-sm">
            {getResultCount() > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <span className="text-primary font-medium">总计: {getResultCount()}</span>
              </div>
            )}
            
            {(activeServiceType === 'llm' || activeServiceType === 'custom') && llmTestResults.length > 0 && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>成功: {llmTestResults.filter(r => r.status === 'success').length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>失败: {llmTestResults.filter(r => r.status === 'error').length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>进行中: {llmTestResults.filter(r => r.status === 'pending').length}</span>
                </div>
              </>
            )}

            {(activeServiceType === 'pdf' || activeServiceType === 'image') && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>成功: {
                    activeServiceType === 'pdf' 
                      ? extractedFiles.filter(f => f.status === 'success').length
                      : imageResults.filter(f => f.status === 'success').length
                  }</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>失败: {
                    activeServiceType === 'pdf' 
                      ? extractedFiles.filter(f => f.status === 'error').length
                      : imageResults.filter(f => f.status === 'error').length
                  }</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>处理中: {
                    activeServiceType === 'pdf' 
                      ? extractedFiles.filter(f => f.status === 'extracting').length
                      : imageResults.filter(f => f.status === 'extracting').length
                  }</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-0 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {/* LLM测试结果 */}
        {(activeServiceType === 'llm' || activeServiceType === 'custom') && (
          <LLMTestResults
            results={llmTestResults}
            expandedResultId={expandedResultId}
            expandedSections={expandedSections}
            copiedText={copiedText}
            onToggleResultExpansion={onToggleResultExpansion}
            onToggleSection={onToggleSection}
            onCopyToClipboard={onCopyToClipboard}
          />
        )}

        {/* PDF提取结果 */}
        {activeServiceType === 'pdf' && (
          <PDFExtractionResults
            extractedFiles={extractedFiles}
            copiedText={copiedText}
            onCopyToClipboard={onCopyToClipboard}
            onRemoveFile={(index) => onRemoveFile(index, 'pdf')}
            onDownloadText={onDownloadText}
          />
        )}

        {/* 图片OCR结果 */}
        {activeServiceType === 'image' && (
          <PDFExtractionResults
            extractedFiles={imageResults.map((result, index) => ({
              file: result.file,
              extractedText: result.extractedText,
              status: result.status,
              error: result.error,
              extractionMethod: 'tesseract',
              fileType: 'image'
            }))}
            copiedText={copiedText}
            onCopyToClipboard={onCopyToClipboard}
            onRemoveFile={(index) => onRemoveFile(index, 'image')}
            onDownloadText={onDownloadText}
          />
        )}
      </div>
    </div>
  );
};
