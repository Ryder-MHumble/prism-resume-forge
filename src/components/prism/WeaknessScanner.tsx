import { ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface WeaknessItem {
  id: number;
  title: string;
  description: string;
  impact: string;
  suggestion: string;
  original: string;
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
              onMouseEnter={() => onPreviewHighlight(weakness.id.toString())}
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
                </div>

                {/* 详细信息 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs">
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
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {weaknesses.length}
            </div>
            <div className="text-xs text-muted-foreground">
              待优化项目
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};