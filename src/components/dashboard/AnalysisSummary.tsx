import { Card } from '@/components/ui/card';
import {
  DASHBOARD_TEXT,
  CARD_STYLES,
  BUTTON_STYLES
} from '@/constants/dashboard';
import { ANALYSIS_SUMMARY } from '@/data/dashboardData';

interface AnalysisSummaryProps {
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
  content?: string;
}

export const AnalysisSummary = ({ isExpanded, onToggle, content }: AnalysisSummaryProps) => {
  return (
    <div className="relative">
      <Card className={CARD_STYLES.base}>
        {/* 霓虹边框效果 */}
        <div className={CARD_STYLES.neonBorder} />

        {/* 顶部装饰线 */}
        <div className={CARD_STYLES.topDecorationLine} />

        <div className="relative z-10 p-3 pb-3">
          {/* 精简的标题区域 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <div className="w-8 h-px bg-gradient-to-r from-cyan-400/50 to-transparent" />
              </div>
              <div>
                <h3 className="text-sm font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  {DASHBOARD_TEXT.analysisSummary.title}
                </h3>
                <p className="text-xs text-muted-foreground/80">{DASHBOARD_TEXT.analysisSummary.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => onToggle(!isExpanded)}
              className={BUTTON_STYLES.expandCollapse}
            >
              {isExpanded ? DASHBOARD_TEXT.actionButtons.expandCollapse.collapse : DASHBOARD_TEXT.actionButtons.expandCollapse.expand}
            </button>
          </div>

          {/* 精简的分析内容 - 条件渲染 */}
          {isExpanded && (
            <div className="relative p-3 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 bg-primary animate-pulse" />
                <p className="text-sm text-foreground leading-relaxed">
                  {content || ANALYSIS_SUMMARY.content}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
