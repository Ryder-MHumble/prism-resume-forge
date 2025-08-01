import { Card } from '@/components/ui/card';
import { RadarChart } from '@/components/charts/RadarChart';
import { cn } from '@/lib/utils';
import {
  DASHBOARD_TEXT,
  SCORE_SYSTEM,
  CARD_STYLES,
  BUTTON_STYLES,
  PARTICLE_CONFIG,
  RADAR_DECORATIONS
} from '@/constants/dashboard';
import { ANALYSIS_SUMMARY } from '@/data/dashboardData';
import type { DashboardData } from '@/types';

interface RadarAnalysisProps {
  data: DashboardData;
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
}

export const RadarAnalysis = ({ data, isExpanded, onToggle }: RadarAnalysisProps) => {
  const scoreLevel = SCORE_SYSTEM.getScoreLevel(data.score);

  return (
    <div className="relative">
      <Card className="border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative p-4">
          {/* 重构后的内容区域 - 左右两大div布局 */}
          {isExpanded && (
            <div className="flex gap-6">
              {/* 左侧区域 - 标题和雷达图 */}
              <div className="flex-shrink-0 space-y-4">
                {/* 标题区域 */}
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {DASHBOARD_TEXT.radarAnalysis.title}
                    </h3>
                    <p className="text-xs text-muted-foreground/70">
                      {DASHBOARD_TEXT.radarAnalysis.subtitle}
                    </p>
                  </div>
                </div>

                {/* 雷达图区域 */}
                <div className="relative flex items-center justify-center">
                  <RadarChart
                    data={data.radarData}
                    size={200}
                  />
                </div>
              </div>

              {/* 右侧区域 - 分数和分析总结 */}
              <div className="flex-1 space-y-4">
                {/* 第一行：分数展示和收起按钮 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="text-3xl font-bold bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                        {data.score}
                      </div>
                      <div className="text-xs font-medium text-muted-foreground mt-1 tracking-wide">
                        {DASHBOARD_TEXT.scoreDisplay.title}
                      </div>
                    </div>

                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300",
                      "border bg-muted/50",
                      scoreLevel.textColor
                    )}>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        scoreLevel.textColor.replace('text-', 'bg-')
                      )} />
                      <span>{scoreLevel.label}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggle(!isExpanded)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted/80 rounded-md transition-all duration-200"
                  >
                    {isExpanded ? DASHBOARD_TEXT.actionButtons.expandCollapse.collapse : DASHBOARD_TEXT.actionButtons.expandCollapse.expand}
                  </button>
                </div>

                {/* 智能分析总结区域 */}
                <div className="relative p-4 rounded-lg bg-muted/30 border border-border/30">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      <h4 className="text-sm font-semibold text-foreground">
                        {ANALYSIS_SUMMARY.title}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground/70 leading-relaxed">
                      {ANALYSIS_SUMMARY.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 折叠状态的简洁显示 */}
          {!isExpanded && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {DASHBOARD_TEXT.radarAnalysis.title}
                  </h3>
                  <p className="text-xs text-muted-foreground/70">
                    {DASHBOARD_TEXT.radarAnalysis.subtitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onToggle(!isExpanded)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted/80 rounded-md transition-all duration-200"
              >
                {isExpanded ? DASHBOARD_TEXT.actionButtons.expandCollapse.collapse : DASHBOARD_TEXT.actionButtons.expandCollapse.expand}
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
