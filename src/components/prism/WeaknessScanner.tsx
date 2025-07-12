import { ArrowRight, Eye, Target, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface WeaknessItem {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  category: string;
  impact: string;
}

interface WeaknessScannerProps {
  weaknesses: WeaknessItem[];
  onItemClick: (item: WeaknessItem) => void;
  onPreviewHighlight: (itemId: string) => void;
  className?: string;
}

export const WeaknessScanner = ({ 
  weaknesses, 
  onItemClick, 
  onPreviewHighlight,
  className 
}: WeaknessScannerProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      default: return 'text-muted-foreground bg-muted/10 border-muted/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Target className="w-4 h-4" />;
      case 'low': return <Eye className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-6">
        {/* 标题 */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-destructive/10 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">结构性弱点扫描</h3>
            <p className="text-sm text-muted-foreground">
              发现 {weaknesses.length} 个可优化点
            </p>
          </div>
        </div>

        {/* 弱点列表 */}
        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
          {weaknesses.map((weakness, index) => (
            <div
              key={weakness.id}
              className={cn(
                "group p-4 rounded-lg border transition-prism cursor-pointer",
                "hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02]"
              )}
              onMouseEnter={() => onPreviewHighlight(weakness.id)}
              onClick={() => onItemClick(weakness)}
            >
              <div className="space-y-3">
                {/* 标题行 */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono text-muted-foreground">
                        #{index + 1}
                      </span>
                      <h4 className="font-medium group-hover:text-primary transition-prism">
                        {weakness.title}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {weakness.description}
                    </p>
                  </div>
                  
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs border",
                    getSeverityColor(weakness.severity)
                  )}>
                    {getSeverityIcon(weakness.severity)}
                    <span className="capitalize">{weakness.severity}</span>
                  </div>
                </div>

                {/* 详细信息 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground">
                      分类: <span className="text-foreground">{weakness.category}</span>
                    </span>
                    <span className="text-muted-foreground">
                      影响: <span className="text-foreground">{weakness.impact}</span>
                    </span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "text-xs gap-1 opacity-70 group-hover:opacity-100",
                      "hover:bg-primary/10 hover:text-primary transition-prism"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onItemClick(weakness);
                    }}
                  >
                    进入炼金室优化
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 统计信息 */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {['high', 'medium', 'low'].map((severity) => {
              const count = weaknesses.filter(w => w.severity === severity).length;
              const label = severity === 'high' ? '严重' : severity === 'medium' ? '中等' : '轻微';
              
              return (
                <div key={severity} className="space-y-1">
                  <div className={cn(
                    "text-2xl font-bold",
                    getSeverityColor(severity).split(' ')[0]
                  )}>
                    {count}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};