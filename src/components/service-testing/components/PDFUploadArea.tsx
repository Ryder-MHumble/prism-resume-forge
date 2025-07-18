import { Upload, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PDFUploadAreaProps {
  isDragOver: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PDFUploadArea = ({
  isDragOver,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect
}: PDFUploadAreaProps) => {
  return (
    <div className="space-y-4 bg-card/30 p-4 rounded-xl border">
      <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
        <FileText className="w-4 h-4" />
        PDF提取配置
      </h3>

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
        <Upload className="w-12 h-12 mx-auto mb-3 text-green-500" />
        <p className="text-sm font-medium mb-1">上传PDF文件</p>
        <p className="text-xs text-muted-foreground">
          拖拽或点击选择PDF文件
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf"
        onChange={onFileSelect}
        className="hidden"
      />
    </div>
  );
};
