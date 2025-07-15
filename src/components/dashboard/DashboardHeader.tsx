import { Button } from '@/components/ui/button';
import { DASHBOARD_TEXT } from '@/constants/dashboard';

interface DashboardHeaderProps {
  onBack: () => void;
}

export const DashboardHeader = ({ onBack }: DashboardHeaderProps) => {
  return (
    <header className="border-b border-border bg-background z-10 flex-shrink-0">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="text-sm"
          >
            {DASHBOARD_TEXT.header.backButton}
          </Button>

          <div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              {DASHBOARD_TEXT.header.title}
            </h1>
            <p className="text-xs text-muted-foreground">个人价值光谱分析仪</p>
          </div>

          <div className="text-sm text-muted-foreground">
            {DASHBOARD_TEXT.header.subtitle}
          </div>
        </div>
      </div>
    </header>
  );
};
