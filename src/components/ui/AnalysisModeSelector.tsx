import React from 'react';
import { Zap, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalysisMode } from '@/components/prism/AnalysisMode';

interface AnalysisModeSelectorProps {
  value: AnalysisMode;
  onChange: (mode: AnalysisMode) => void;
}

export const AnalysisModeSelector: React.FC<AnalysisModeSelectorProps> = ({
  value,
  onChange,
}) => {
  const modes = [
    {
      id: 'hardcore' as const,
      label: '严苛模式',
      icon: Zap,
      description: '模拟大厂面试官的视角，会用直接的语言一针见血地指出你的问题，专业性很强的同时压力也很大。',
      features: ['直接尖锐', '问题导向', '高标准要求', '深度分析'],
      color: 'primary',
    },
    {
      id: 'supportive' as const,
      label: '鼓励模式',
      icon: Heart,
      description: '扮演循循善诱的职业导师，聚焦优点，温和建议，帮助你以更加自信的方式展现自己的价值。',
      features: ['温和建议', '优点导向', '正向激励', '信心提升'],
      color: 'secondary',
    },
  ];

  const activeMode = modes.find(mode => mode.id === value) || modes[0];

  return (
    <div className="space-y-0">
      {/* Tab按钮区域 */}
      <div className="flex gap-1">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = value === mode.id;

          return (
            <div key={mode.id} className="relative">
              <button
                onClick={() => onChange(mode.id)}
                className={cn(
                  "relative px-6 py-3 text-sm font-medium transition-all duration-300",
                  "flex items-center gap-2 rounded-t-xl border border-b-0",
                  isActive
                    ? mode.color === 'primary'
                      ? "text-primary bg-gradient-to-b from-primary/15 to-primary/8 border-primary/30 shadow-lg shadow-primary/10"
                      : "text-secondary bg-gradient-to-b from-secondary/15 to-secondary/8 border-secondary/30 shadow-lg shadow-secondary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/10 bg-muted/5 border-muted/30 hover:border-muted/50"
                )}
              >
                <Icon className="w-4 h-4" />
                {mode.label}
              </button>

              {/* 选中状态的连接条 */}
              {isActive && (
                <div className={cn(
                  "absolute -bottom-px left-0 right-0 h-2 rounded-b-lg transition-all duration-300 border-l border-r",
                  mode.color === 'primary'
                    ? "bg-gradient-to-b from-primary/15 to-primary/8 border-primary/30"
                    : "bg-gradient-to-b from-secondary/15 to-secondary/8 border-secondary/30"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* 内容区域 */}
      <div className={cn(
        "relative rounded-xl rounded-tl-none p-8 backdrop-blur-md overflow-hidden transition-all duration-500 border",
        activeMode.color === 'primary'
          ? "bg-gradient-to-b from-primary/15 to-primary/8 border-primary/30 shadow-lg shadow-primary/10"
          : "bg-gradient-to-b from-secondary/15 to-secondary/8 border-secondary/30 shadow-lg shadow-secondary/10"
      )}>
        {/* 背景装饰 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br via-transparent to-transparent",
            activeMode.color === 'primary' ? "from-primary/10" : "from-secondary/10"
          )} />

          {/* 装饰性粒子 */}
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "absolute w-1 h-1 rounded-full animate-pulse opacity-60",
                  activeMode.color === 'primary' ? "bg-primary" : "bg-secondary"
                )}
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${15 + i * 25}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>

          {/* 右下角图标装饰 */}
          <div className="absolute bottom-8 right-8 w-20 h-20 opacity-15">
            <activeMode.icon className={cn(
              "w-full h-full",
              activeMode.color === 'primary' ? "text-primary" : "text-secondary"
            )} />
          </div>
        </div>

        {/* 内容 */}
        <div className="relative z-10 space-y-6">
          {/* 模式标题 */}
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-xl transition-all duration-500",
              activeMode.color === 'primary'
                ? "bg-primary/20 text-primary"
                : "bg-secondary/20 text-secondary"
            )}>
              <activeMode.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className={cn(
                "text-2xl font-bold transition-all duration-500",
                activeMode.color === 'primary' ? "text-primary" : "text-secondary"
              )}>
                {activeMode.label}
              </h3>
              <p className="text-sm text-muted-foreground font-mono">
                {activeMode.id === 'hardcore' ? 'Hardcore Mode' : 'Supportive Mode'}
              </p>
            </div>
          </div>

          {/* 详细描述 */}
          <div className="space-y-4">
            <p className="text-base leading-relaxed text-muted-foreground">
              {activeMode.description}
            </p>

            {/* 特点列表 */}
            <div className="grid grid-cols-2 gap-3">
              {activeMode.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className={cn(
                    "w-1 h-1 rounded-full",
                    activeMode.color === 'primary' ? "bg-primary" : "bg-secondary"
                  )} />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
