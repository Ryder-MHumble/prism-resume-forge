import { useState } from 'react';
import { Zap, Heart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type AnalysisMode = 'hardcore' | 'supportive';

interface AnalysisModeProps {
  selectedMode: AnalysisMode;
  onModeChange: (mode: AnalysisMode) => void;
  className?: string;
}

export const AnalysisModeSelector = ({ 
  selectedMode, 
  onModeChange, 
  className 
}: AnalysisModeProps) => {
  const modes = [
    {
      id: 'hardcore' as const,
      name: '严苛模式',
      subtitle: 'Hardcore Mode',
      description: '模拟一线大厂资深面试官，一针见血，不留情面',
      icon: Zap,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30'
    },
    {
      id: 'supportive' as const,
      name: '鼓励模式',
      subtitle: 'Supportive Mode',
      description: '扮演循循善诱的职业导师，聚焦优点，温和建议',
      icon: Heart,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/30'
    }
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">解析风格</h3>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;
          
          return (
            <Card
              key={mode.id}
              className={cn(
                "p-6 cursor-pointer transition-prism hover-scale",
                "border-2 hover:prism-glow",
                isSelected 
                  ? `${mode.borderColor} ${mode.bgColor} prism-glow` 
                  : "border-muted hover:border-muted-foreground"
              )}
              onClick={() => onModeChange(mode.id)}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isSelected ? mode.bgColor : "bg-muted/50"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5",
                      isSelected ? mode.color : "text-muted-foreground"
                    )} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{mode.name}</h4>
                    <p className="text-xs text-muted-foreground font-mono">
                      {mode.subtitle}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {mode.description}
                </p>
                
                {isSelected && (
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <div className={cn("w-2 h-2 rounded-full", 
                      mode.id === 'hardcore' ? "bg-primary" : "bg-secondary"
                    )} />
                    <span className={mode.color}>已选择</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};