import { useState } from 'react';
import { ArrowRight, Info, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { PrismCore } from '@/components/prism/PrismCore';
import { AnalysisModeSelector, AnalysisMode } from '@/components/prism/AnalysisMode';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface PortalProps {
  onStartAnalysis: (files: { resume?: File; jd?: File }, mode: AnalysisMode) => void;
}

export const Portal = ({ onStartAnalysis }: PortalProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<{ resume?: File; jd?: File }>({});
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('hardcore');
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleStartAnalysis = () => {
    if (uploadedFiles.resume) {
      onStartAnalysis(uploadedFiles, analysisMode);
    }
  };

  const canStartAnalysis = !!uploadedFiles.resume;

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部控件 */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex justify-between items-center">
          <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="neural-pulse">
                <Info className="w-4 h-4 mr-2" />
                关于棱镜
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    棱镜 Prism
                  </h2>
                  <p className="text-sm text-muted-foreground font-mono mt-1">
                    Project Prism v1.0
                  </p>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="p-4 bg-card rounded-lg border">
                    <p className="font-semibold text-primary mb-2">核心哲学</p>
                    <p className="text-muted-foreground italic">
                      "我们不创造光，我们只解析光。"
                    </p>
                  </div>
                  
                  <div className="p-4 bg-card rounded-lg border">
                    <p className="font-semibold text-secondary mb-2">设计理念</p>
                    <p className="text-muted-foreground">
                      沉浸式赛博朋克 × 精密仪器美学，让简历分析变成一场视觉与智力的双重盛宴。
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm" className="neural-pulse">
              <User className="w-4 h-4 mr-2" />
              登录
            </Button>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl mx-auto space-y-12">
          {/* 标题区域 */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className={cn(
                "text-5xl md:text-6xl font-bold tracking-tight",
                "bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent",
                "animate-fade-in"
              )}>
                将你的简历
              </h1>
              <h1 className={cn(
                "text-5xl md:text-6xl font-bold tracking-tight",
                "bg-gradient-to-r from-secondary via-secondary to-primary bg-clip-text text-transparent",
                "animate-fade-in"
              )}>
                投入棱镜
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground font-light animate-fade-in">
              看看它能折射出多少种颜色
            </p>
            
            <div className="w-24 h-0.5 bg-gradient-to-r from-primary to-secondary mx-auto animate-fade-in" />
          </div>

          {/* 棱镜核心 */}
          <PrismCore 
            onFileUpload={setUploadedFiles}
            className="animate-fade-in"
          />

          {/* 解析模式选择器 */}
          <AnalysisModeSelector
            selectedMode={analysisMode}
            onModeChange={setAnalysisMode}
            className="animate-fade-in"
          />

          {/* 开始分析按钮 */}
          <div className="text-center animate-fade-in">
            <Button
              size="lg"
              onClick={handleStartAnalysis}
              disabled={!canStartAnalysis}
              className={cn(
                "px-8 py-4 text-lg font-semibold",
                "prism-glow hover:scale-105 transition-prism-bounce",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              )}
            >
              {canStartAnalysis ? (
                <>
                  开始解析
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                "请先上传简历"
              )}
            </Button>
            
            {canStartAnalysis && (
              <p className="text-sm text-muted-foreground mt-3 font-mono">
                Ready to reveal the spectrum within...
              </p>
            )}
          </div>
        </div>
      </main>

      {/* 底部装饰 */}
      <footer className="p-6 text-center">
        <p className="text-xs text-muted-foreground font-mono opacity-60">
          © 2024 Prism • Powered by AI • Made with ⚡ for ambitious minds
        </p>
      </footer>
    </div>
  );
};