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
      <Card className="border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative p-4">
          {/* 优雅的标题区域 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {DASHBOARD_TEXT.analysisSummary.title}
                </h3>
                <p className="text-xs text-muted-foreground/70">{DASHBOARD_TEXT.analysisSummary.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => onToggle(!isExpanded)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted/80 rounded-md transition-all duration-200"
            >
              {isExpanded ? DASHBOARD_TEXT.actionButtons.expandCollapse.collapse : DASHBOARD_TEXT.actionButtons.expandCollapse.expand}
            </button>
          </div>

          {/* 优雅的分析内容 */}
          {isExpanded && (
            <div className="relative p-4 rounded-lg bg-muted/30 border border-border/30">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full mt-2 bg-blue-500 flex-shrink-0" />
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
