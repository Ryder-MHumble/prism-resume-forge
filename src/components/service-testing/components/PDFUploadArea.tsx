import { Upload, FileText, Image, Settings, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { EXTRACTION_METHODS } from '../utils/constants';

interface FileUploadAreaProps {
  isDragOver: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  extractionMethod: 'pdfjs' | 'react-pdftotext' | 'tesseract';
  enableTextOptimization: boolean;
  conservativeMode: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExtractionMethodChange: (method: 'pdfjs' | 'react-pdftotext' | 'tesseract') => void;
  onTextOptimizationChange: (enabled: boolean) => void;
  onConservativeModeChange: (enabled: boolean) => void;
}

export const FileUploadArea = ({
  isDragOver,
  fileInputRef,
  extractionMethod,
  enableTextOptimization,
  conservativeMode,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onExtractionMethodChange,
  onTextOptimizationChange,
  onConservativeModeChange
}: FileUploadAreaProps) => {
  return (
    <div className="space-y-4 bg-card/30 p-4 rounded-xl border">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
          <FileText className="w-4 h-4" />
          文件提取配置
        </h3>
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">提取方法</span>
        </div>
      </div>

      {/* 提取方法选择 */}
      <div className="space-y-2">
        <Select value={extractionMethod} onValueChange={onExtractionMethodChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择提取方法" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdfjs">
              <div className="flex items-center gap-2">
                <span>📄</span>
                <div>
                  <div className="font-medium">{EXTRACTION_METHODS.pdfjs.label}</div>
                  <div className="text-xs text-muted-foreground">{EXTRACTION_METHODS.pdfjs.description}</div>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="react-pdftotext">
              <div className="flex items-center gap-2">
                <span>⚡</span>
                <div>
                  <div className="font-medium">{EXTRACTION_METHODS['react-pdftotext'].label}</div>
                  <div className="text-xs text-muted-foreground">{EXTRACTION_METHODS['react-pdftotext'].description}</div>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="tesseract">
              <div className="flex items-center gap-2">
                <span>🖼️</span>
                <div>
                  <div className="font-medium">{EXTRACTION_METHODS.tesseract.label}</div>
                  <div className="text-xs text-muted-foreground">{EXTRACTION_METHODS.tesseract.description}</div>
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 文件上传区域 */}
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer",
          isDragOver ? "border-primary bg-primary/10 scale-105" : "border-muted-foreground/30",
          "hover:border-primary/50 hover:bg-primary/5 hover:scale-102"
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex justify-center mb-3">
          {extractionMethod === 'tesseract' ? (
            <Image className="w-12 h-12 text-indigo-500" />
          ) : (
            <Upload className="w-12 h-12 text-green-500" />
          )}
        </div>
        
        <p className="text-sm font-medium mb-1">
          {extractionMethod === 'tesseract' ? '上传图片文件' : '上传PDF文件'}
        </p>
        
        <p className="text-xs text-muted-foreground mb-3">
          {extractionMethod === 'tesseract' 
            ? '拖拽或点击选择图片文件 (PNG, JPG, JPEG, WebP)' 
            : '拖拽或点击选择PDF文件'
          }
        </p>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>📄</span>
            <span>PDF</span>
          </div>
          <span>|</span>
          <div className="flex items-center gap-1">
            <span>🖼️</span>
            <span>图片</span>
          </div>
        </div>
      </div>

      {/* 文本优化选项 */}
      {extractionMethod === 'tesseract' && (
        <div className="space-y-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <Label htmlFor="text-optimization" className="text-sm font-medium text-blue-700 dark:text-blue-300">
                文本优化
              </Label>
            </div>
            <Switch
              id="text-optimization"
              checked={enableTextOptimization}
              onCheckedChange={onTextOptimizationChange}
            />
          </div>
          
          {enableTextOptimization && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-600 dark:text-blue-400">保守模式</span>
              </div>
              <Switch
                id="conservative-mode"
                checked={conservativeMode}
                onCheckedChange={onConservativeModeChange}
              />
            </div>
          )}
          
          <div className="text-xs text-blue-600 dark:text-blue-400">
            {!enableTextOptimization 
              ? '❌ 保持原始提取结果，不进行优化'
              : conservativeMode
                ? '✅ 保守模式 - 仅清理空格，完整保留原文结构和换行'
                : '✅ 标准模式 - 清理空格、修复OCR错误、优化格式'
            }
          </div>
        </div>
      )}

      {/* 方法说明 */}
      <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
        <div className="font-medium mb-1">当前方法说明：</div>
        <div>{EXTRACTION_METHODS[extractionMethod].description}</div>
        {extractionMethod === 'tesseract' && (
          <div className="mt-1 text-orange-600">
            💡 图片OCR需要较长时间处理，请耐心等待
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={extractionMethod === 'tesseract' ? '.png,.jpg,.jpeg,.webp' : '.pdf'}
        onChange={onFileSelect}
        className="hidden"
      />
    </div>
  );
};

// 保持向后兼容
export const PDFUploadArea = FileUploadArea;
