import { Button } from '@/components/ui/button';
import { DASHBOARD_TEXT } from '@/constants/dashboard';

interface DashboardHeaderProps {
  onBack: () => void;
}

export const DashboardHeader = ({ onBack }: DashboardHeaderProps) => {
  return (
    <header className="relative border-b border-border/30 bg-transparent backdrop-blur-sm z-10 flex-shrink-0">
      {/* 顶部装饰光带 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 左侧返回按钮 */}
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="text-sm border-border/50 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-200"
          >
            {DASHBOARD_TEXT.header.backButton}
          </Button>

          {/* 中心标题区 */}
          <div className="flex items-center gap-4">
            {/* 棱镜图标装饰 */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-lg rotate-45 opacity-90" />
                <div className="absolute inset-1 bg-gradient-to-tr from-white/20 to-transparent rounded-sm" />
              </div>
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500/80 to-purple-600/80 rounded-full" />
            </div>
            
            <div className="text-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                {DASHBOARD_TEXT.header.title}
              </h1>
              <p className="text-xs text-muted-foreground/80 font-medium tracking-wide">
                棱镜 Prism • 个人价值光谱分析仪
              </p>
            </div>
          </div>

          {/* 右侧信息 */}
          <div className="text-sm text-muted-foreground/80 font-medium">
            {DASHBOARD_TEXT.header.subtitle}
          </div>
        </div>
      </div>
    </header>
  );
};
