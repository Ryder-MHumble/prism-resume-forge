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
      {/* 全息背景装饰 */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />

        {/* 全息粒子效果 */}
        <div className="absolute inset-0 opacity-40">
          {[...Array(PARTICLE_CONFIG.count)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-${PARTICLE_CONFIG.size.width} h-${PARTICLE_CONFIG.size.height} bg-gradient-to-r ${PARTICLE_CONFIG.colors.gradient} rounded-full animate-pulse`}
              style={{
                left: `${PARTICLE_CONFIG.position.minX + Math.random() * (PARTICLE_CONFIG.position.maxX - PARTICLE_CONFIG.position.minX)}%`,
                top: `${PARTICLE_CONFIG.position.minY + Math.random() * (PARTICLE_CONFIG.position.maxY - PARTICLE_CONFIG.position.minY)}%`,
                animationDelay: `${i * PARTICLE_CONFIG.baseDelay}s`,
                animationDuration: `${PARTICLE_CONFIG.baseDuration + Math.random() * PARTICLE_CONFIG.randomRange}s`
              }}
            />
          ))}
        </div>
      </div>

      <Card className={CARD_STYLES.base}>
        {/* 霓虹边框效果 */}
        <div className={CARD_STYLES.neonBorder} />

        <div className="relative z-10 p-3 pb-3">
          {/* 标题区域 - 赛博朋克风格 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <div className="w-8 h-px bg-gradient-to-r from-cyan-400/50 to-transparent" />
              </div>
              <div>
                <h3 className="text-sm font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  {DASHBOARD_TEXT.radarAnalysis.title}
                </h3>
                <p className="text-xs text-muted-foreground/80 font-mono">
                  {DASHBOARD_TEXT.radarAnalysis.subtitle}
                </p>
              </div>
            </div>

            {/* 科幻风格控制按钮 */}
            <button
              onClick={() => onToggle(!isExpanded)}
              className={BUTTON_STYLES.cyberControl}
            >
              {/* 扫描线动画 */}
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              <span className="relative z-10">
                {isExpanded ? DASHBOARD_TEXT.actionButtons.expandCollapse.collapse : DASHBOARD_TEXT.actionButtons.expandCollapse.expand}
              </span>
            </button>
          </div>

          {/* 内容区域 - 全新布局 */}
          {isExpanded && (
            <div className="space-y-6">
              {/* 数据展示区 - 水平布局 */}
              <div className="flex items-center justify-between">
                {/* 左侧雷达图 */}
                <div className="flex-1 relative">
                  <div className="relative flex items-center justify-center">                    {/* 雷达图背景装饰 */}
                    <div className="absolute inset-0 w-48 h-48 mx-auto">
                      {RADAR_DECORATIONS.rings.map((ring, index) => (
                        <div
                          key={index}
                          className={`absolute ${ring.inset ? `inset-${ring.inset}` : 'inset-0'} rounded-full border ${ring.opacity} animate-pulse`}
                          style={{ animationDelay: ring.delay }}
                        />
                      ))}
                    </div>

                    <RadarChart
                      data={data.radarData}
                      size={200}
                    />

                    {/* 中心全息核心 */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className={`w-${RADAR_DECORATIONS.centerCore.size} h-${RADAR_DECORATIONS.centerCore.size} bg-gradient-to-r ${RADAR_DECORATIONS.centerCore.gradient} rounded-full shadow-lg animate-pulse`} />
                      <div className={`absolute inset-0 w-${RADAR_DECORATIONS.centerCore.size} h-${RADAR_DECORATIONS.centerCore.size} bg-gradient-to-r ${RADAR_DECORATIONS.centerCore.gradient} rounded-full blur-xl animate-pulse`} />
                    </div>
                  </div>
                </div>

                {/* 右侧分数展示 - 垂直布局 */}
                <div className="flex-1 pl-6 space-y-4">
                  {/* 主分数区域 */}
                  <div className="relative text-center">
                    <div className="relative inline-block">
                      {/* 分数背景装饰 */}
                      <div className="absolute inset-0 -m-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl animate-pulse" />

                      <div className="relative">
                        <div className="text-4xl font-bold bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
                          {data.score}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground mt-1 font-mono uppercase tracking-wider">
                          {DASHBOARD_TEXT.scoreDisplay.title}
                        </div>
                      </div>

                      {/* 环形进度指示器 */}
                      <div className="absolute -inset-4 rounded-full border border-primary/20">
                        <div
                          className="absolute inset-0 rounded-full border border-primary/50 transition-all duration-1000"
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
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium font-mono uppercase tracking-wide transition-all duration-300 backdrop-blur-sm",
                        "border shadow-md",
                        `bg-gradient-to-r ${scoreLevel.gradient} ${scoreLevel.borderColor} ${scoreLevel.textColor} ${scoreLevel.shadowColor}`
                      )}>
                        <div className={cn(
                          "w-2 h-2 rounded-full animate-pulse",
                          scoreLevel.textColor.replace('text-', 'bg-')
                        )} />
                        <span>
                          {scoreLevel.label}
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs text-muted-foreground/70 font-mono">
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
