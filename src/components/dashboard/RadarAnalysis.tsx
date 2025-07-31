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
          {/* 优雅的标题区域 */}
          <div className="flex items-center justify-between mb-3">
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

          {/* 优雅的内容区域 */}
          {isExpanded && (
            <div className="space-y-6">
              {/* 数据展示区 - 水平布局 */}
              <div className="flex items-center justify-between">
                {/* 左侧雷达图 */}
                <div className="flex-1 relative">
                  <div className="relative flex items-center justify-center">
                    <RadarChart
                      data={data.radarData}
                      size={200}
                    />
                  </div>
                </div>

                {/* 右侧分数展示 - 垂直布局 */}
                <div className="flex-1 pl-6 space-y-4">
                  {/* 主分数区域 */}
                  <div className="relative text-center">
                    <div className="relative inline-block">
                      <div className="relative">
                        <div className="text-4xl font-bold bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                          {data.score}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground mt-1 tracking-wide">
                          {DASHBOARD_TEXT.scoreDisplay.title}
                        </div>
                      </div>

                      {/* 简洁的进度指示器 */}
                      <div className="absolute -inset-3 rounded-full border border-border/20">
                        <div
                          className="absolute inset-0 rounded-full border-2 border-blue-500/30 transition-all duration-1000"
                          style={{
                            borderTopColor: 'transparent',
                            borderRightColor: 'transparent',
                            transform: `rotate(${(data.score / 100) * 360}deg)`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 评级标签区 */}
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300",
                        "border bg-muted/50",
                        scoreLevel.textColor
                      )}>
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          scoreLevel.textColor.replace('text-', 'bg-')
                        )} />
                        <span>
                          {scoreLevel.label}
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs text-muted-foreground/70">
                        {DASHBOARD_TEXT.scoreDisplay.outperformText(Math.round(data.score * 1.2))}
                      </div>
                    </div>
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
