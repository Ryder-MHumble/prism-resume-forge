import { ArrowRight, Upload, Zap, Heart, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalysisModeSelector } from '@/components/ui/AnalysisModeSelector';
import { cn } from '@/lib/utils';
import { PORTAL_TEXT, ANIMATION_CONFIG } from '@/constants/portal';
import { FileUploadArea } from './FileUploadArea';
import { AnalysisMode } from '@/components/prism/AnalysisMode';
import {
  UploadedFiles,
  DragState,
  FileType,
  ActivePanel
} from '@/hooks/useFileUpload';

interface ControlPanelProps {
  activePanel: ActivePanel;
  uploadedFiles: UploadedFiles;
  isDragOver: DragState;
  analysisMode: AnalysisMode;
  canStartAnalysis: boolean;
  setActivePanel: React.Dispatch<React.SetStateAction<ActivePanel>>;
  setAnalysisMode: React.Dispatch<React.SetStateAction<AnalysisMode>>;
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFiles>>;
  onDragOver: (e: React.DragEvent, type: FileType) => void;
  onDragLeave: (e: React.DragEvent, type: FileType) => void;
  onDrop: (e: React.DragEvent, type: FileType) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>, type: FileType) => void;
  onStartAnalysis: () => void;
}

export const ControlPanel = ({
  activePanel,
  uploadedFiles,
  isDragOver,
  analysisMode,
  canStartAnalysis,
  setActivePanel,
  setAnalysisMode,
  setUploadedFiles,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onStartAnalysis
}: ControlPanelProps) => {

  const handleFileRemove = (type: FileType) => {
    setUploadedFiles(prev => ({ ...prev, [type]: undefined }));
  };

  return (
    <div className="w-2/5 flex flex-col border-r border-primary/20 backdrop-blur-sm relative">
      {/* 面板头部区域 */}
      <div className="relative border-b border-primary/20 bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-md">
        {/* 扫描线动画 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse"
            style={{
              top: '50%',
              animationDuration: ANIMATION_CONFIG.scanAnimationDuration,
              boxShadow: '0 0 10px rgba(34, 211, 238, 0.4)'
            }} />
        </div>

        <div className="flex items-center justify-between py-5 px-8 relative z-10">
          {/* 左侧：当前阶段标题 */}
          <div className="flex items-center gap-3">
            {activePanel === 'upload' ? (
              <>
                <Upload className="w-5 h-5 text-primary drop-shadow-lg" />
                <div>
                  <h3 className="text-lg font-semibold text-primary">{PORTAL_TEXT.steps.upload.title}</h3>
                  <p className="text-xs text-muted-foreground/80">{PORTAL_TEXT.steps.upload.subtitle}</p>
                </div>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 text-primary drop-shadow-lg" />
                <div>
                  <h3 className="text-lg font-semibold text-primary">{PORTAL_TEXT.steps.analysis.title}</h3>
                  <p className="text-xs text-muted-foreground/80">{PORTAL_TEXT.steps.analysis.subtitle}</p>
                </div>
              </>
            )}

            {/* 阶段进度指示器 */}
            <div className="ml-4 flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                activePanel === 'upload' ? "bg-primary animate-pulse" : "bg-primary/30"
              )} />
              <div className="w-8 h-px bg-gradient-to-r from-primary/50 to-secondary/50" />
              <div className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                activePanel === 'ready' ? "bg-secondary animate-pulse" : "bg-secondary/30"
              )} />
            </div>
          </div>

          {/* 右侧：条件显示的按钮 */}
          <div className="flex items-center gap-3">
            {/* 上传阶段：下一步按钮（仅在有简历时显示） */}
            {activePanel === 'upload' && uploadedFiles.resume && (
              <Button
                onClick={() => setActivePanel('ready')}
                size="sm"
                className="bg-gradient-to-r from-primary/80 to-secondary/80 hover:from-primary hover:to-secondary border border-primary/30 shadow-lg shadow-primary/20 transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2">下一步：分析配置</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}

            {/* 分析配置阶段：重新上传按钮 */}
            {activePanel === 'ready' && (
              <Button
                onClick={() => {
                  setUploadedFiles({});
                  setActivePanel('upload');
                }}
                variant="outline"
                size="sm"
                className="border-secondary/30 text-secondary hover:bg-secondary/10 hover:border-secondary/50 transition-all duration-300"
              >
                <Upload className="w-4 h-4 mr-2" />
                重新上传
              </Button>
            )}
          </div>
        </div>

        {/* 底部装饰线 */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
      </div>

      {/* 面板内容 */}
      <div className="flex-1 p-6 overflow-hidden relative">
        {/* 文件上传面板 */}
        {activePanel === 'upload' && (
          <div className="animate-in fade-in-0 slide-in-from-left-4 duration-500">
            <FileUploadArea
              uploadedFiles={uploadedFiles}
              isDragOver={isDragOver}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onFileSelect={onFileSelect}
              onFileRemove={handleFileRemove}
            />
          </div>
        )}

        {/* 启动分析面板 */}
        {activePanel === 'ready' && (
          <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500 h-full">
            <div className="h-full flex flex-col relative">
              {/* 背景装饰图层 */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* 根据选中的模式显示不同的背景插图 */}
                {analysisMode === 'hardcore' && (
                  <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
                    <Zap className="w-full h-full text-primary" />
                  </div>
                )}
                {analysisMode === 'supportive' && (
                  <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
                    <Heart className="w-full h-full text-secondary" />
                  </div>
                )}
              </div>

              {/* 主要内容区域 */}
              <div className="flex-1 relative z-10">
                <AnalysisModeSelector
                  value={analysisMode}
                  onChange={setAnalysisMode}
                />
              </div>

              {/* 右下角开始分析按钮 */}
              <div className="relative z-10 flex justify-end mt-6">
                <Button
                  onClick={onStartAnalysis}
                  disabled={!canStartAnalysis}
                  size="lg"
                  className={cn(
                    "px-8 h-12 text-base font-semibold",
                    "bg-gradient-to-r from-primary to-secondary",
                    "hover:from-primary/90 hover:to-secondary/90",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "transition-all duration-300 transform hover:scale-[1.02]",
                    "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
                    "border border-primary/30"
                  )}
                >
                  <Database className="w-5 h-5 mr-3" />
                  <span>{canStartAnalysis ? '开始光谱分析' : '请先上传简历'}</span>
                  {canStartAnalysis && <ArrowRight className="w-5 h-5 ml-3" />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
