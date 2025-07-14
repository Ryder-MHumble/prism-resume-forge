import { useState, useCallback } from 'react';
import { Upload, FileText, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import prismCoreImage from '@/assets/prism-core.png';

interface PrismCoreProps {
  onFileUpload: (files: { resume?: File; jd?: File }) => void;
  className?: string;
}

export const PrismCore = ({ onFileUpload, className }: PrismCoreProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ resume?: File; jd?: File }>({});

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const resumeFile = files.find(file =>
      file.type.includes('pdf') || file.type.includes('word') || file.type.includes('document')
    );

    if (resumeFile) {
      const newFiles = { ...uploadedFiles, resume: resumeFile };
      setUploadedFiles(newFiles);
      onFileUpload(newFiles);
    }
  }, [uploadedFiles, onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'jd') => {
    const file = e.target.files?.[0];
    if (file) {
      const newFiles = { ...uploadedFiles, [type]: file };
      setUploadedFiles(newFiles);
      onFileUpload(newFiles);
    }
  }, [uploadedFiles, onFileUpload]);

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto", className)}>
      {/* 棱镜核心视觉 */}
      <div className="relative mb-8">
        <div className="prism-core-rotate">
          <img
            src={prismCoreImage}
            alt="Prism Core"
            className="w-48 h-48 mx-auto"
          />
        </div>

        {/* 粒子效果层 */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-1 h-1 bg-primary rounded-full opacity-60",
                "animate-pulse"
              )}
              style={{
                left: `${20 + (i * 12)}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* 主上传区域 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-12 text-center transition-prism",
          "hover:border-primary hover:prism-glow cursor-pointer",
          isDragOver ? "border-primary prism-glow scale-105" : "border-muted",
          uploadedFiles.resume && "border-primary/50 bg-primary/5"
        )}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <FileText className="w-12 h-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold">
              {uploadedFiles.resume ? '简历已上传' : '拖拽或点击上传简历'}
            </h3>
            <p className="text-muted-foreground">
              支持 PDF、Word 格式
            </p>
          </div>

          {uploadedFiles.resume && (
            <div className="p-3 bg-card rounded-lg border neural-pulse">
              <p className="text-sm font-mono text-primary">
                ✓ {uploadedFiles.resume.name}
              </p>
            </div>
          )}

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileSelect(e, 'resume')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* JD上传区域（可选） */}
      <div className="mt-6">
        <div className="border border-muted/50 rounded-lg p-6 bg-card/30">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium">职位描述 (可选)</span>
          </div>

          {uploadedFiles.jd ? (
            <div className="p-3 bg-secondary/10 rounded border border-secondary/30">
              <p className="text-sm font-mono text-secondary">
                ✓ {uploadedFiles.jd.name}
              </p>
            </div>
          ) : (
            <label className="block">
              <div className="border border-dashed border-muted/50 rounded p-4 text-center hover:border-secondary transition-prism cursor-pointer">
                <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  上传目标职位JD，获得更精准的分析
                </span>
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => handleFileSelect(e, 'jd')}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};