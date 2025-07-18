import { Brain, FileText } from 'lucide-react';
import { LLMTestResult } from '@/types';
import { ExtractedFile } from '../types';
import { LLMTestResults } from './LLMTestResults';
import { PDFExtractionResults } from './PDFExtractionResults';

interface TestResultsPanelProps {
  activeServiceType: 'llm' | 'custom' | 'pdf';
  llmTestResults: LLMTestResult[];
  extractedFiles: ExtractedFile[];
  expandedResultId: string | null;
  expandedSections: {[key: string]: Set<string>};
  copiedText: string | null;
  onToggleResultExpansion: (id: string) => void;
  onToggleSection: (resultId: string, sectionType: string) => void;
  onCopyToClipboard: (text: string, id: string) => void;
  onRemoveFile: (index: number) => void;
  onDownloadText: (file: ExtractedFile) => void;
}

export const TestResultsPanel = ({
  activeServiceType,
  llmTestResults,
  extractedFiles,
  expandedResultId,
  expandedSections,
  copiedText,
  onToggleResultExpansion,
  onToggleSection,
  onCopyToClipboard,
  onRemoveFile,
  onDownloadText
}: TestResultsPanelProps) => {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-shrink-0 p-4 border-b border-primary/20 bg-background/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">测试结果</h2>
            <p className="text-sm text-muted-foreground">
              {activeServiceType === 'llm' && '显示LLM简历分析结果'}
              {activeServiceType === 'custom' && '显示自定义测试结果'}
              {activeServiceType === 'pdf' && '显示PDF文本提取结果'}
            </p>
          </div>

          {/* 结果统计 */}
          {(activeServiceType === 'llm' || activeServiceType === 'custom') && llmTestResults.length > 0 && (
            <div className="flex items-center gap-4 text-sm">
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
            </div>
          )}
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
            onRemoveFile={onRemoveFile}
            onDownloadText={onDownloadText}
          />
        )}
      </div>
    </div>
  );
};
