import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CrucibleHeaderProps {
  onBack: () => void;
}

export const CrucibleHeader: React.FC<CrucibleHeaderProps> = ({ onBack }) => {
  return (
    <header className="border-b border-border/50 bg-gradient-to-r from-background via-background/95 to-background backdrop-blur-sm z-10 flex-shrink-0">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:bg-muted/50"
          >
            <ArrowLeft className="w-4 h-4" />
            返回仪表盘
          </Button>

          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-1">
              能力炼金室
            </h1>
            <p className="text-xs text-muted-foreground/80 font-medium">深度挖掘你的潜力，重塑你的简历</p>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium text-foreground">个人能力优化引擎</div>
            <div className="text-xs text-muted-foreground/60">AI-Powered Enhancement</div>
          </div>
        </div>
      </div>
    </header>
  );
};