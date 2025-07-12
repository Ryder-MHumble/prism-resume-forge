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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* 动态背景 */}
      <div className="absolute inset-0 z-0">
        {/* 背景网格 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        
        {/* 流动的光点 */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full opacity-40 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* 中央辉光效果 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-3xl" />
      </div>

      {/* 顶部控件 */}
      <header className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="neural-pulse backdrop-blur-sm">
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
            <Button variant="outline" size="sm" className="neural-pulse backdrop-blur-sm">
              <LogIn className="w-4 h-4 mr-2" />
              登录
            </Button>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-5xl mx-auto space-y-16">
          {/* 标题区域 - 更有层次感 */}
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <div className="relative">
                <h1 className={cn(
                  "text-6xl md:text-8xl font-bold tracking-tight leading-tight",
                  "bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent",
                  "animate-fade-in"
                )}>
                  将你的简历
                </h1>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl -z-10" />
              </div>
              
              <div className="relative">
                <h1 className={cn(
                  "text-6xl md:text-8xl font-bold tracking-tight leading-tight",
                  "bg-gradient-to-r from-secondary via-secondary/80 to-primary bg-clip-text text-transparent",
                  "animate-fade-in"
                )}>
                  投入棱镜
                </h1>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 blur-2xl -z-10" />
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-2xl md:text-3xl text-muted-foreground font-light animate-fade-in">
                看看它能折射出多少种颜色
              </p>
              
              <div className="flex justify-center animate-fade-in">
                <div className="w-32 h-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-full" />
              </div>
            </div>
          </div>

          {/* 棱镜核心 - 增强视觉效果 */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 blur-xl" />
            <PrismCore 
              onFileUpload={setUploadedFiles}
              className="animate-fade-in relative z-10"
            />
          </div>

          {/* 解析模式选择器 */}
          <AnalysisModeSelector
            selectedMode={analysisMode}
            onModeChange={setAnalysisMode}
            className="animate-fade-in"
          />

          {/* 开始分析按钮 - 更突出 */}
          <div className="text-center animate-fade-in">
            <div className="relative inline-block">
              <Button
                size="lg"
                onClick={handleStartAnalysis}
                disabled={!canStartAnalysis}
                className={cn(
                  "px-12 py-6 text-xl font-bold",
                  "bg-gradient-to-r from-primary to-secondary",
                  "hover:from-primary/90 hover:to-secondary/90",
                  "transform hover:scale-110 transition-all duration-300",
                  "shadow-lg hover:shadow-2xl",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                )}
              >
                {canStartAnalysis ? (
                  <>
                    开始解析
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </>
                ) : (
                  "请先上传简历"
                )}
              </Button>
              
              {canStartAnalysis && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-30 blur-lg -z-10" />
              )}
            </div>
            
            {canStartAnalysis && (
              <div className="mt-6 space-y-2">
                <p className="text-lg text-muted-foreground font-mono animate-pulse">
                  Ready to reveal the spectrum within...
                </p>
                <div className="flex justify-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 底部装饰 */}
      <footer className="relative z-10 p-6 text-center">
        <div className="backdrop-blur-sm bg-background/30 rounded-lg px-4 py-2 inline-block">
          <p className="text-sm text-muted-foreground font-mono">
            © 2024 Prism • Powered by AI • Made with ⚡ for ambitious minds
          </p>
        </div>
      </footer>
    </div>
  );
};