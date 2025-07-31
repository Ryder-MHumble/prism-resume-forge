import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Defect {
  id: number;
  title: string;
  description?: string;
  suggestion?: string;
  impact: string;
}

interface DefectListProps {
  defects: Defect[];
  currentDefectIndex: number;
  completedDefects: Set<number>;
  messageCount: Record<number, number>;
  onDefectClick: (index: number) => void;
  onGenerateResume: () => void;
}

export const DefectList: React.FC<DefectListProps> = ({
  defects,
  currentDefectIndex,
  completedDefects,
  messageCount,
  onDefectClick,
  onGenerateResume,
}) => {
  // 根据影响程度获取对应的样式
  const getImpactStyle = (impact: string) => {
    const normalizedImpact = impact.toLowerCase();
    if (normalizedImpact.includes('高') || normalizedImpact.includes('high')) {
      return {
        // 普通状态
        accentColor: 'from-red-400/20 to-red-500/10',
        textColor: 'text-red-400',
        iconColor: 'text-red-400',
        borderColor: 'border-red-500/20',
        // 激活状态
        activeBg: 'from-red-500/20 via-red-500/15 to-red-500/10',
        activeBorder: 'border-red-500/40',
        activeShadow: 'shadow-red-500/15',
        activeIndicator: 'from-red-500 via-red-500/90 to-red-500/70',
        activeIconBg: 'bg-red-500/25',
        activeIconBorder: 'border-red-500/50',
        activeIconText: 'text-red-400',
        activeText: 'text-red-300',
        activeTagBg: 'bg-red-500/20',
        activeTagBorder: 'border-red-500/40',
        activeTagText: 'text-red-300'
      };
    } else if (normalizedImpact.includes('中') || normalizedImpact.includes('medium')) {
      return {
        // 普通状态
        accentColor: 'from-yellow-400/20 to-yellow-500/10',
        textColor: 'text-yellow-400',
        iconColor: 'text-yellow-400',
        borderColor: 'border-yellow-500/20',
        // 激活状态
        activeBg: 'from-yellow-500/20 via-yellow-500/15 to-yellow-500/10',
        activeBorder: 'border-yellow-500/40',
        activeShadow: 'shadow-yellow-500/15',
        activeIndicator: 'from-yellow-500 via-yellow-500/90 to-yellow-500/70',
        activeIconBg: 'bg-yellow-500/25',
        activeIconBorder: 'border-yellow-500/50',
        activeIconText: 'text-yellow-400',
        activeText: 'text-yellow-300',
        activeTagBg: 'bg-yellow-500/20',
        activeTagBorder: 'border-yellow-500/40',
        activeTagText: 'text-yellow-300'
      };
    } else {
      return {
        // 普通状态
        accentColor: 'from-blue-400/20 to-blue-500/10',
        textColor: 'text-blue-400',
        iconColor: 'text-blue-400',
        borderColor: 'border-blue-500/20',
        // 激活状态
        activeBg: 'from-blue-500/20 via-blue-500/15 to-blue-500/10',
        activeBorder: 'border-blue-500/40',
        activeShadow: 'shadow-blue-500/15',
        activeIndicator: 'from-blue-500 via-blue-500/90 to-blue-500/70',
        activeIconBg: 'bg-blue-500/25',
        activeIconBorder: 'border-blue-500/50',
        activeIconText: 'text-blue-400',
        activeText: 'text-blue-300',
        activeTagBg: 'bg-blue-500/20',
        activeTagBorder: 'border-blue-500/40',
        activeTagText: 'text-blue-300'
      };
    }
  };

  return (
    <div className="lg:col-span-3 flex flex-col h-full max-h-[calc(100vh-90px)]">
      {/* 标题区域 - 紧凑设计 */}
      <div className="mb-3 bg-gradient-to-r from-card/20 via-card/10 to-transparent rounded-lg p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping opacity-20" />
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            深挖问题
          </h2>
          <div className="flex-1" />
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
            {defects.length} 项
          </span>
        </div>
      </div>

      {/* 可滚动的问题列表区域 - 优化容器设计 */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {/* 统一的列表容器 */}
        <div className="relative bg-gradient-to-b from-card/40 via-card/20 to-card/10 rounded-2xl border border-border/40 backdrop-blur-md overflow-hidden shadow-lg shadow-black/5">
          {/* 顶部装饰线组 */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          <div className="absolute top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent hover:scrollbar-thumb-cyan-500/40 p-3 space-y-2 max-h-[calc(100vh-190px)]">
            {defects.map((defect, index) => {
              const isActive = currentDefectIndex === index;
              const isCompleted = completedDefects.has(index);
              const isPrevious = index < currentDefectIndex;
              const isNext = index > currentDefectIndex;
              const currentMessageCount = messageCount[index] || 0;

              const impactStyle = getImpactStyle(defect.impact);

              return (
                <div
                  key={defect.id}
                  onClick={() => onDefectClick(index)}
                  className={cn(
                    "group relative rounded-xl transition-all duration-300 cursor-pointer overflow-hidden",
                    // 基础样式
                    "border border-transparent hover:border-border/60 backdrop-blur-sm",
                    // 激活状态 - 根据严重程度使用不同颜色
                    isActive && !isCompleted && [
                      "bg-gradient-to-r " + impactStyle.activeBg,
                      impactStyle.activeBorder + " shadow-lg " + impactStyle.activeShadow,
                      "transform scale-[1.02]"
                    ],
                    // 激活且已完成状态 - 使用绿色主题
                    isActive && isCompleted && [
                      "bg-gradient-to-r from-green-500/20 via-green-500/15 to-green-500/10",
                      "border-green-500/40 shadow-lg shadow-green-500/15",
                      "transform scale-[1.02]"
                    ],
                    // 已完成状态
                    isCompleted && !isActive && [
                      "bg-gradient-to-r from-green-500/10 to-green-500/5",
                      "border-green-500/20"
                    ],
                    // 普通状态
                    !isActive && !isCompleted && [
                      "hover:bg-gradient-to-r hover:" + impactStyle.accentColor,
                      "hover:border-border/40 hover:shadow-sm"
                    ],
                    // 位置相关的透明度
                    isPrevious && !isCompleted && "opacity-60",
                    isNext && "opacity-80"
                  )}
                >
                  {/* 激活状态的左侧指示条 */}
                  {isActive && !isCompleted && (
                    <div className={cn(
                      "absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b rounded-r-full",
                      impactStyle.activeIndicator
                    )} />
                  )}

                  {/* 激活且已完成状态的左侧指示条 */}
                  {isActive && isCompleted && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-green-500 via-green-500/90 to-green-500/70 rounded-r-full" />
                  )}

                  {/* 已完成状态的左侧指示条 */}
                  {isCompleted && !isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-green-500 via-green-500/80 to-green-500/60 rounded-r-full" />
                  )}

                                          <div className="relative z-10 p-4 pl-5">
                    <div className="flex items-start gap-3">
                      {/* 状态指示器 */}
                      <div className={cn(
                        "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 transition-all duration-300",
                        "border border-border/30 group-hover:border-border/50",
                        isCompleted
                          ? "bg-green-500/20 border-green-500/40 text-green-500"
                          : isActive
                          ? impactStyle.activeIconBg + " " + impactStyle.activeIconBorder + " " + impactStyle.activeIconText + " shadow-sm " + impactStyle.activeShadow
                          : "bg-card/50 " + impactStyle.iconColor + "/60"
                      )}>
                        {isCompleted ? (
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        ) : (
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all duration-300",
                            isActive ? "bg-current scale-125" : "bg-current"
                          )} />
                        )}
                      </div>

                      <div className="flex-1 space-y-1.5">
                        {/* 标题 */}
                        <h3 className={cn(
                          "text-sm font-medium line-clamp-2 leading-relaxed transition-colors duration-300",
                          isActive && isCompleted
                            ? "text-green-300 font-semibold"
                            : isActive
                            ? impactStyle.activeText + " font-semibold"
                            : isCompleted
                            ? "text-green-400"
                            : impactStyle.textColor
                        )}>
                          {defect.title || `问题${index + 1}`}
                        </h3>

                        {/* 标签区域 */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-300",
                            "border backdrop-blur-sm",
                            isActive && isCompleted
                              ? "bg-green-500/20 border-green-500/40 text-green-300"
                              : isActive
                              ? impactStyle.activeTagBg + " " + impactStyle.activeTagBorder + " " + impactStyle.activeTagText
                              : isCompleted
                              ? "bg-green-500/15 border-green-500/30 text-green-500"
                              : "bg-card/50 " + impactStyle.borderColor + " " + impactStyle.textColor
                          )}>
                            {defect.impact}
                          </span>

                          {isCompleted && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/15 border border-green-500/30 text-green-500 animate-pulse">
                              ✓ 已完成
                            </span>
                          )}

                          {isActive && !isCompleted && (
                            <span className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium animate-pulse",
                              impactStyle.activeTagBg + " border " + impactStyle.activeTagBorder + " " + impactStyle.activeTagText
                            )}>
                              ● 进行中
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 右侧箭头指示器 */}
                      <div className={cn(
                        "flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300",
                        isActive && isCompleted
                          ? "bg-green-500/25 text-green-400 transform rotate-90"
                          : isActive
                          ? impactStyle.activeIconBg + " " + impactStyle.activeIconText + " transform rotate-90"
                          : "bg-transparent text-muted-foreground/40 group-hover:text-muted-foreground/60"
                      )}>
                        <div className="w-1 h-1 rounded-full bg-current" />
                      </div>
                    </div>
                  </div>

                  {/* 悬停时的微光效果 */}
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                    !isActive && "bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  )} />
                </div>
              );
            })}
          </div>

          {/* 底部渐变遮罩 */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card/40 via-card/20 to-transparent pointer-events-none" />
        </div>
      </div>

                  {/* 底部生成简历按钮 - 紧贴底部 */}
            <div className="pt-3 mt-2 border-t border-border/50">
              <Button
                onClick={onGenerateResume}
                className={cn(
                  "w-full py-4 font-semibold rounded-xl transition-all duration-300",
                  "shadow-lg backdrop-blur-sm border border-transparent",
                  completedDefects.size === defects.length && defects.length > 0
                    ? [
                        "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600",
                        "hover:from-cyan-500 hover:via-blue-600 hover:to-purple-700",
                        "hover:shadow-xl hover:shadow-cyan-500/20 hover:scale-[1.02]",
                        "active:scale-[0.98] cursor-pointer",
                        "text-white"
                      ]
                    : [
                        "bg-gradient-to-r from-muted/40 via-muted/50 to-muted/40",
                        "text-muted-foreground/60 cursor-not-allowed",
                        "border-border/30"
                      ]
                )}
                disabled={completedDefects.size !== defects.length || defects.length === 0}
              >
                <div className="flex items-center justify-center gap-2">
                  {completedDefects.size === defects.length && defects.length > 0 ? (
                    <span>生成我的专属简历</span>
                  ) : (
                    <span>完成所有问题后可生成简历 ({completedDefects.size}/{defects.length})</span>
                  )}
                </div>
              </Button>
            </div>
    </div>
  );
};