import React, { useEffect, useRef, useState } from 'react';
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
  const [mounted, setMounted] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

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
  const activeIndex = modes.findIndex(mode => mode.id === value);

  // 更新滑块位置
  const updateSliderPosition = () => {
    if (sliderRef.current && tabRefs.current[activeIndex]) {
      const activeTab = tabRefs.current[activeIndex];
      if (activeTab) {
        const rect = activeTab.getBoundingClientRect();
        const containerRect = activeTab.parentElement?.getBoundingClientRect();
        if (containerRect) {
          const leftOffset = rect.left - containerRect.left;
          sliderRef.current.style.left = `${leftOffset}px`;
          sliderRef.current.style.width = `${rect.width}px`;
        }
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    const timeoutId = setTimeout(updateSliderPosition, 50);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (mounted) {
      updateSliderPosition();
    }
  }, [value, mounted]);

  return (
    <div className="space-y-4">
      {/* Modern Tab Selector */}
      <div className="space-y-4">
        {/* Tab Container */}
        <div className="relative">
          {/* Background Container */}
          <div className="relative p-1 rounded-2xl bg-muted/20 border border-border/30">
            {/* Sliding Background */}
            <div
              ref={sliderRef}
              className={cn(
                "absolute top-1 h-[calc(100%-8px)] rounded-xl transition-all duration-300 ease-out",
                activeMode.color === 'primary'
                  ? "bg-primary/10 border-primary/20"
                  : "bg-secondary/10 border-secondary/20"
              )}
              style={{ 
                transform: mounted ? 'none' : 'translateX(-100%)',
                opacity: mounted ? 1 : 0
              }}
            />

            {/* Tab Buttons */}
            <div className="relative flex">
              {modes.map((mode, index) => {
                const Icon = mode.icon;
                const isActive = value === mode.id;

                return (
                  <button
                    key={mode.id}
                    ref={el => tabRefs.current[index] = el}
                    onClick={() => onChange(mode.id)}
                    className={cn(
                      "relative flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200",
                      "flex items-center justify-center gap-2 rounded-xl",
                      isActive
                        ? mode.color === 'primary'
                          ? "text-primary"
                          : "text-secondary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-semibold">{mode.label}</span>
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <div className={cn(
                        "absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full",
                        mode.color === 'primary' ? "bg-primary" : "bg-secondary"
                      )} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className={cn(
        "relative rounded-2xl p-6 overflow-hidden transition-colors duration-300 border",
        "bg-gradient-to-br",
        activeMode.color === 'primary'
          ? "from-primary/5 to-primary/3 border-primary/20"
          : "from-secondary/5 to-secondary/3 border-secondary/20"
      )}>
        {/* Simple Background Decoration */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Single subtle decoration */}
          <div className={cn(
            "absolute bottom-0 right-0 w-20 h-20 rounded-full opacity-5",
            activeMode.color === 'primary' ? "bg-primary" : "bg-secondary"
          )} />
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className={cn(
              "p-4 rounded-2xl transition-colors duration-200",
              activeMode.color === 'primary'
                ? "bg-primary/10 text-primary"
                : "bg-secondary/10 text-secondary"
            )}>
              <activeMode.icon className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className={cn(
                "text-2xl font-bold transition-colors duration-200 mb-1",
                activeMode.color === 'primary' ? "text-primary" : "text-secondary"
              )}>
                {activeMode.label}
              </h3>
              <p className="text-sm text-muted-foreground font-mono tracking-wider">
                {activeMode.id === 'hardcore' ? 'Hardcore Mode' : 'Supportive Mode'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-base leading-relaxed text-muted-foreground">
              {activeMode.description}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {activeMode.features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 text-sm p-3 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50"
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    activeMode.color === 'primary' ? "bg-primary" : "bg-secondary"
                  )} />
                  <span className="text-muted-foreground font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Status */}
          <div className="flex items-center gap-2 pt-4 border-t border-border/30">
            <div className={cn(
              "w-2 h-2 rounded-full",
              activeMode.color === 'primary' ? "bg-primary" : "bg-secondary"
            )} />
            <span className="text-xs text-muted-foreground font-mono">模式已激活</span>
          </div>
        </div>
      </div>
    </div>
  );
};
