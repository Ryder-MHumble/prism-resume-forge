import { Card } from '@/components/ui/card';
import {
  DASHBOARD_TEXT,
  ANALYSIS_TAGS,
  CARD_STYLES,
  BUTTON_STYLES
} from '@/constants/dashboard';
import { ANALYSIS_SUMMARY } from '@/data/dashboardData';

interface AnalysisSummaryProps {
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
}

export const AnalysisSummary = ({ isExpanded, onToggle }: AnalysisSummaryProps) => {
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
              <div className="space-y-2.5">
                {/* 精简的分析点 */}
                <div className="space-y-2.5">
                  {ANALYSIS_SUMMARY.analysisPoints.map((point, index) => (
                    <div key={point.type} className="flex items-start gap-2.5">
                      <div
                        className={`w-1.5 h-1.5 bg-${point.color} rounded-full mt-1.5 animate-pulse`}
                        style={{ animationDelay: `${point.delay}s` }}
                      />
                      <p className="text-sm text-foreground leading-relaxed">
                        <span className={`font-medium text-${point.color}`}>{point.label}：</span>
                        {point.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* 精简的标签 */}
                <div className="flex items-center gap-1.5 pt-3 border-t border-border/30">
                  <div className={`flex items-center gap-1 px-2 py-1 ${ANALYSIS_TAGS.structureClear.bgColor} border ${ANALYSIS_TAGS.structureClear.borderColor} rounded`}>
                    <div className={`w-1 h-1 ${ANALYSIS_TAGS.structureClear.dotColor} rounded-full`} />
                    <span className={`text-xs ${ANALYSIS_TAGS.structureClear.textColor} font-medium`}>{ANALYSIS_TAGS.structureClear.text}</span>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 ${ANALYSIS_TAGS.needsQuantification.bgColor} border ${ANALYSIS_TAGS.needsQuantification.borderColor} rounded`}>
                    <div className={`w-1 h-1 ${ANALYSIS_TAGS.needsQuantification.dotColor} rounded-full`} />
                    <span className={`text-xs ${ANALYSIS_TAGS.needsQuantification.textColor} font-medium`}>{ANALYSIS_TAGS.needsQuantification.text}</span>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 ${ANALYSIS_TAGS.canOptimize.bgColor} border ${ANALYSIS_TAGS.canOptimize.borderColor} rounded`}>
                    <div className={`w-1 h-1 ${ANALYSIS_TAGS.canOptimize.dotColor} rounded-full`} />
                    <span className={`text-xs ${ANALYSIS_TAGS.canOptimize.textColor} font-medium`}>{ANALYSIS_TAGS.canOptimize.text}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
