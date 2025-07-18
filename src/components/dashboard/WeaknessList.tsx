import { ChevronDown, ChevronUp, ArrowRight, AlertTriangle, Info, Lightbulb, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CARD_STYLES, DASHBOARD_TEXT, BUTTON_STYLES } from '@/constants/dashboard';
import { cn } from '@/lib/utils';
import type { DashboardData } from '@/types';

interface WeaknessListProps {
  data: DashboardData;
  expandedWeaknessId: string | null;
  highlightedSection: string | null;
  onWeaknessClick: (weaknessId: string) => void;
  onToggleExpansion: (weaknessId: string) => void;
  onOptimizeWeakness: (weaknessId: string) => void;
}

export const WeaknessList = ({
  data,
  expandedWeaknessId,
  highlightedSection,
  onWeaknessClick,
  onToggleExpansion,
  onOptimizeWeakness
}: WeaknessListProps) => {
  const handleWeaknessClick = (id: string) => {
    onWeaknessClick(id);
    onToggleExpansion(id);
  };

  // 根据影响程度获取对应的图标和样式
  const getImpactStyle = (impact: string) => {
    const normalizedImpact = impact.toLowerCase();
    if (normalizedImpact.includes('高') || normalizedImpact.includes('high')) {
      return {
        icon: AlertTriangle,
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
        // 卡片级别样式
        cardBorderColor: 'border-red-500/30',
        cardGradient: 'bg-gradient-to-br from-red-500/5 via-background to-red-500/5',
        titleColor: 'text-red-400'
      };
    } else if (normalizedImpact.includes('中') || normalizedImpact.includes('medium')) {
      return {
        icon: Info,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
        // 卡片级别样式
        cardBorderColor: 'border-yellow-500/30',
        cardGradient: 'bg-gradient-to-br from-yellow-500/5 via-background to-yellow-500/5',
        titleColor: 'text-yellow-400'
      };
    } else {
      return {
        icon: Info,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        // 卡片级别样式
        cardBorderColor: 'border-blue-500/30',
        cardGradient: 'bg-gradient-to-br from-blue-500/5 via-background to-blue-500/5',
        titleColor: 'text-blue-400'
      };
    }
  };

  return (
    <div className="space-y-3">
      {data.weaknesses.map((weakness, index) => {
        const id = weakness.id.toString();
        const isExpanded = expandedWeaknessId === id;
        const impactStyle = getImpactStyle(weakness.impact);
        const ImpactIcon = impactStyle.icon;

        return (
          <div key={id} className={cn(
            "relative rounded-xl border-2 transition-all duration-200",
            impactStyle.cardBorderColor,
            impactStyle.cardGradient,
            "shadow-sm hover:shadow-md"
          )}>
            {/* 霓虹边框效果 */}
            <div className={CARD_STYLES.neonBorder} />

            <div className="relative z-10 p-3">
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => handleWeaknessClick(id)}
              >
                <div className="flex-1">
                  {/* 标题行 */}
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center",
                      impactStyle.bgColor,
                      impactStyle.borderColor,
                      "border"
                    )}>
                      <ImpactIcon className={cn("w-3.5 h-3.5", impactStyle.color)} />
                    </div>
                    <div className="flex-1">
                      <h3 className={cn(
                        "text-base font-medium leading-relaxed",
                        impactStyle.titleColor
                      )}>
                        {weakness.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 ml-3 flex items-center gap-2">
                  {/* 影响程度标签 */}
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                    impactStyle.bgColor,
                    impactStyle.color,
                    "border",
                    impactStyle.borderColor
                  )}>
                    影响程度: {weakness.impact}
                  </span>

                  {/* 展开图标 */}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* 展开内容 */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border space-y-4">
                  {/* 详细描述 */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Info className="w-3 h-3 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                        详细描述
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{weakness.description}</p>
                    </div>
                  </div>

                  {/* 优化建议 */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-md bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <Lightbulb className="w-3 h-3 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                        优化建议
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{weakness.suggestion}</p>
                    </div>
                  </div>

                  {/* 原始内容 */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-md bg-gray-500/10 border border-gray-500/20 flex items-center justify-center">
                      <FileText className="w-3 h-3 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                        原始内容
                      </h4>
                      <div className="bg-muted/30 rounded-lg p-3 border">
                        <p className="text-sm text-muted-foreground font-mono leading-relaxed">{weakness.original}</p>
                      </div>
                    </div>
                  </div>

                  {/* 前往炼金室优化按钮 */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOptimizeWeakness(weakness.id.toString());
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 hover:from-emerald-500/20 hover:to-cyan-500/20 border border-emerald-500/30 hover:border-emerald-500/50 rounded-lg text-sm font-semibold text-emerald-600 dark:text-emerald-400 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Zap className="w-4 h-4" />
                        前往炼金室优化
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

    </div>
  );
};
