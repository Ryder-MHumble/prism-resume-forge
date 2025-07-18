import { FileText, AlertCircle, Download, Copy, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExtractedFile } from '../types';

interface PDFExtractionResultsProps {
  extractedFiles: ExtractedFile[];
  copiedText: string | null;
  onCopyToClipboard: (text: string, id: string) => void;
  onRemoveFile: (index: number) => void;
  onDownloadText: (file: ExtractedFile) => void;
}

export const PDFExtractionResults = ({
  extractedFiles,
  copiedText,
  onCopyToClipboard,
  onRemoveFile,
  onDownloadText
}: PDFExtractionResultsProps) => {
  if (extractedFiles.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText className="w-20 h-20 mx-auto mb-6 opacity-30" />
        <p className="text-lg text-muted-foreground mb-2">暂无文件</p>
        <p className="text-sm text-muted-foreground">请上传PDF文件开始提取</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {extractedFiles.map((item, index) => (
        <div key={index} className="border rounded-xl p-5 bg-card/50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-green-500" />
              <div>
                <h4 className="font-medium">{item.file.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {(item.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {item.status === 'extracting' && (
                <div className="flex items-center gap-2 text-blue-500">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium">提取中...</span>
                </div>
              )}

              {item.status === 'success' && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCopyToClipboard(item.extractedText, `file_${index}`)}
                    className="h-8"
                  >
                    {copiedText === `file_${index}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDownloadText(item)}
                    className="h-8"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {item.status === 'error' && (
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">提取失败</span>
                </div>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemoveFile(index)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {item.status === 'success' && (
            <div className="bg-muted/30 rounded-lg p-4 max-h-60 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                {item.extractedText}
              </pre>
            </div>
          )}

          {item.status === 'error' && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-700 dark:text-red-300 mb-1">提取失败</p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {item.error || '未知错误'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
