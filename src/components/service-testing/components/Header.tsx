import { Brain, Activity, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import { ServiceHealthStatus } from '../types';

interface HeaderProps {
  llmServiceHealth: ServiceHealthStatus;
  activeRequestsCount: number;
  onRefreshHealth: () => void;
}

export const Header = ({ llmServiceHealth, activeRequestsCount, onRefreshHealth }: HeaderProps) => {
  return (
    <header className="relative z-20 flex-shrink-0 h-16 flex items-center justify-between px-8 border-b border-primary/20 bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              服务测试控制台
            </h1>
            <p className="text-xs text-muted-foreground">
              支持 LLM分析、PDF提取、自定义测试等多种服务
            </p>
          </div>
        </div>

        {/* 服务状态指示器 */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-medium">活跃请求: {activeRequestsCount}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50">
            <div className={cn(
              "w-2 h-2 rounded-full",
              llmServiceHealth === 'healthy' ? 'bg-green-500' :
              llmServiceHealth === 'error' ? 'bg-red-500' : 'bg-yellow-500'
            )} />
            <span className="text-xs font-medium">
              LLM: {llmServiceHealth === 'healthy' ? '正常' :
                    llmServiceHealth === 'error' ? '异常' : '检测中'}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={onRefreshHealth}
              className="h-5 w-5 p-0 ml-1"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <ThemeToggle />
    </header>
  );
};
