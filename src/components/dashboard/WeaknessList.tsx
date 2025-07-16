import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HIGHLIGHTED_SECTIONS } from '@/data/dashboardData';
import { CARD_STYLES, DASHBOARD_TEXT, BUTTON_STYLES } from '@/constants/dashboard';
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

  return (
    <div className="space-y-3">
      {Object.entries(HIGHLIGHTED_SECTIONS).map(([id, section], index) => {
        const isExpanded = expandedWeaknessId === id;
        const weakness = data.weaknesses.find(w => w.id.toString() === id);

        return (
          <div key={id} className={CARD_STYLES.weaknessCard}>
            {/* 霓虹边框效果 */}
            <div className={CARD_STYLES.neonBorder} />

            <div className="relative z-10 p-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => handleWeaknessClick(id)}
              >
                <div className="flex-1">
                  <div className="text-sm text-foreground">
                    {isExpanded && weakness ? weakness.title : section.text}
                  </div>
                </div>
                <div className="ml-3">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* 展开内容 */}
              {isExpanded && weakness && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">
                      {DASHBOARD_TEXT.weaknessDetails.detailedDescription}
                    </h4>
                    <p className="text-sm text-muted-foreground">{weakness.description}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">
                      {DASHBOARD_TEXT.weaknessDetails.impactLevel}
                    </h4>
                    <p className="text-sm text-muted-foreground">{weakness.impact}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">
                      {DASHBOARD_TEXT.weaknessDetails.optimizationSuggestion}
                    </h4>
                    <p className="text-sm text-muted-foreground">{weakness.suggestion}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">
                      {DASHBOARD_TEXT.weaknessDetails.originalContent}
                    </h4>
                    <p className="text-sm text-muted-foreground font-mono">{weakness.original}</p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOptimizeWeakness(weakness.id.toString());
                      }}
                      className="text-xs text-primary hover:text-primary/80 underline"
                    >
                      {DASHBOARD_TEXT.weaknessDetails.optimizeNow}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* 底部按钮 */}
      <div className="mt-6">
        <Button
          onClick={() => onOptimizeWeakness(highlightedSection || 'all')}
          className={BUTTON_STYLES.optimizeMain}
        >
          {DASHBOARD_TEXT.actionButtons.optimize}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
