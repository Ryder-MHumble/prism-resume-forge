import { FileText, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PORTAL_TEXT, FILE_VALIDATION, ANIMATION_CONFIG } from '@/constants/portal';
import { UploadedFiles, DragState, FileType } from '@/hooks/useFileUpload';

interface FileUploadAreaProps {
  uploadedFiles: UploadedFiles;
  isDragOver: DragState;
  onDragOver: (e: React.DragEvent, type: FileType) => void;
  onDragLeave: (e: React.DragEvent, type: FileType) => void;
  onDrop: (e: React.DragEvent, type: FileType) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>, type: FileType) => void;
  onFileRemove: (type: FileType) => void;
}

const FileUploadZone = ({
  type,
  file,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onFileRemove
}: {
  type: FileType;
  file?: File;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent, type: FileType) => void;
  onDragLeave: (e: React.DragEvent, type: FileType) => void;
  onDrop: (e: React.DragEvent, type: FileType) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>, type: FileType) => void;
  onFileRemove: (type: FileType) => void;
}) => {
  const isResume = type === 'resume';
  const config = FILE_VALIDATION[type];
  const Icon = isResume ? FileText : Briefcase;

  const texts = {
    title: isResume ? PORTAL_TEXT.upload.resumeTitle : PORTAL_TEXT.upload.jdTitle,
    placeholder: isResume ? PORTAL_TEXT.upload.resumePlaceholder : PORTAL_TEXT.upload.jdPlaceholder,
    formats: isResume ? PORTAL_TEXT.upload.resumeFormats : PORTAL_TEXT.upload.jdFormats
  };

  const inputId = `${type}-file-input`;
  const particleCount = ANIMATION_CONFIG.particleCount[type];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <div className={cn(
          "w-2 h-2 rounded-full animate-pulse",
          isResume ? "bg-primary" : "bg-secondary"
        )} />
        <span className={cn(
          "text-sm font-medium",
          isResume ? "text-primary" : "text-secondary"
        )}>
          {texts.title}
        </span>
        {!isResume && (
          <div className="px-2 py-1 bg-secondary/15 border border-secondary/30 rounded-full backdrop-blur-sm">
            <span className="text-xs text-secondary">精准折射</span>
          </div>
        )}
      </div>

      <div
        onDragOver={(e) => onDragOver(e, type)}
        onDragLeave={(e) => onDragLeave(e, type)}
        onDrop={(e) => onDrop(e, type)}
        className={cn(
          "group relative border-2 border-dashed rounded-2xl text-center transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-md",
          isResume ? "p-12" : "p-8",
          isResume ? (
            isDragOver ? "border-primary bg-primary/12 scale-[1.02] shadow-2xl shadow-primary/20" :
            file ? "border-primary/60 bg-primary/12 shadow-lg shadow-primary/10" :
            "border-border/50 hover:border-primary/50 hover:bg-primary/8 hover:shadow-lg hover:shadow-primary/10"
          ) : (
            isDragOver ? "border-secondary bg-secondary/12 scale-[1.02] shadow-2xl shadow-secondary/20" :
            file ? "border-secondary/60 bg-secondary/12 shadow-lg shadow-secondary/10" :
            "border-border/40 hover:border-secondary/50 hover:bg-secondary/8 hover:shadow-lg hover:shadow-secondary/10"
          )
        )}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        {/* 科幻背景装饰 */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          {/* 渐变边框 */}
          <div className={cn(
            "absolute w-full h-px bg-gradient-to-r from-transparent to-transparent",
            isResume ? "top-0 left-0 via-cyan-400/40" : "top-0 right-0 via-purple-400/40"
          )} />
          <div className={cn(
            "absolute w-full h-px bg-gradient-to-r from-transparent to-transparent",
            isResume ? "bottom-0 right-0 via-blue-400/40" : "bottom-0 left-0 via-pink-400/40"
          )} />

          {/* 粒子效果 */}
          <div className="absolute inset-0 opacity-60">
            {[...Array(particleCount)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "absolute rounded-full animate-pulse opacity-40",
                  isResume ? "w-1 h-1 bg-primary" : "w-0.5 h-0.5 bg-secondary"
                )}
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${15 + Math.random() * 70}%`,
                  animationDelay: `${i * (isResume ? 0.4 : 0.6)}s`,
                  animationDuration: `${2 + Math.random()}s`
                }}
              />
            ))}
          </div>

          {/* 角落装饰 */}
          <div className={cn(
            "absolute w-6 h-6 border-l-2 border-t-2 rounded-tl-lg",
            isResume ? "top-4 left-4 border-primary/30" : "top-3 left-3 border-secondary/30"
          )} />
          <div className={cn(
            "absolute w-6 h-6 border-r-2 border-t-2 rounded-tr-lg",
            isResume ? "top-4 right-4 border-primary/30" : "top-3 right-3 border-secondary/30"
          )} />
          <div className={cn(
            "absolute w-6 h-6 border-l-2 border-b-2 rounded-bl-lg",
            isResume ? "bottom-4 left-4 border-secondary/30" : "bottom-3 left-3 border-purple-400/30"
          )} />
          <div className={cn(
            "absolute w-6 h-6 border-r-2 border-b-2 rounded-br-lg",
            isResume ? "bottom-4 right-4 border-secondary/30" : "bottom-3 right-3 border-pink-400/30"
          )} />
        </div>

        <div className="relative z-10 space-y-6 pointer-events-none">
          {!file ? (
            <>
              <div className={cn("space-y-4", !isResume && "space-y-4")}>
                <div className="relative">
                  <Icon className={cn(
                    "mx-auto transition-colors duration-300 drop-shadow-lg",
                    isResume ? "w-16 h-16 text-primary/70 group-hover:text-primary" : "w-12 h-12 text-secondary/70 group-hover:text-secondary"
                  )} />
                  <div className={cn(
                    "absolute inset-0 mx-auto rounded-full blur-xl transition-all duration-300",
                    isResume ? "w-16 h-16 bg-primary/20 group-hover:bg-primary/30" : "w-12 h-12 bg-secondary/20 group-hover:bg-secondary/30"
                  )} />
                </div>

                <div className="space-y-2">
                  <h4 className={cn(
                    "font-semibold transition-colors duration-300 text-shadow",
                    isResume ? "text-xl group-hover:text-primary" : "text-lg font-medium group-hover:text-secondary"
                  )}>
                    {texts.placeholder}
                  </h4>
                  <p className="text-sm text-muted-foreground/90 text-shadow">
                    {texts.formats}
                  </p>
                </div>
              </div>

              {isResume && (
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/80">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                    <span className="text-shadow">价值解析</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-secondary rounded-full animate-pulse" />
                    <span className="text-shadow">光谱折射</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                    <span className="text-shadow">能力赋能</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={cn("space-y-4", !isResume && "space-y-3")}>
              <div className="relative">
                <Icon className={cn(
                  "mx-auto drop-shadow-lg",
                  isResume ? "w-12 h-12 text-primary" : "w-10 h-10 text-secondary"
                )} />
                <div className={cn(
                  "absolute inset-0 mx-auto rounded-full blur-lg animate-pulse",
                  isResume ? "w-12 h-12 bg-primary/30" : "w-10 h-10 bg-secondary/30"
                )} />
              </div>

              <div className="space-y-2">
                <h4 className={cn(
                  "font-semibold text-shadow",
                  isResume ? "text-lg text-primary" : "text-base text-secondary"
                )}>
                  {isResume ? '简历光谱就绪' : 'JD 折射准备完成'}
                </h4>
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 border rounded-full backdrop-blur-sm",
                  isResume ? "bg-primary/20 border-primary/30" : "bg-secondary/20 border-secondary/30"
                )}>
                  <div className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    isResume ? "bg-primary" : "bg-secondary"
                  )} />
                  <span className={cn(
                    "text-sm font-medium",
                    isResume ? "text-primary" : "text-secondary"
                  )}>
                    {file.name}
                  </span>
                </div>
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileRemove(type);
                    }}
                    className={cn(
                      "text-xs pointer-events-auto",
                      isResume ? "border-primary/30 hover:bg-primary/10" : "border-secondary/30 text-secondary hover:bg-secondary/10"
                    )}
                  >
                    重新上传
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 隐藏的文件输入 */}
        <input
          id={inputId}
          type="file"
          accept={config.accept}
          onChange={(e) => onFileSelect(e, type)}
          className="hidden"
        />
      </div>
    </div>
  );
};

export const FileUploadArea = ({
  uploadedFiles,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onFileRemove
}: FileUploadAreaProps) => {
  return (
    <div className="h-full overflow-y-auto scrollbar-hide space-y-8">
      {/* 主要上传区域 - 简历 */}
      <FileUploadZone
        type="resume"
        file={uploadedFiles.resume}
        isDragOver={isDragOver.resume}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onFileSelect={onFileSelect}
        onFileRemove={onFileRemove}
      />

      {/* 次要上传区域 - JD */}
      <FileUploadZone
        type="jd"
        file={uploadedFiles.jd}
        isDragOver={isDragOver.jd}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onFileSelect={onFileSelect}
        onFileRemove={onFileRemove}
      />
    </div>
  );
};
