import { CyberpunkBackground } from '@/components/ui/CyberpunkBackground';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AnalysisSummary } from '@/components/dashboard/AnalysisSummary';
import { ResumeViewer } from '@/components/dashboard/ResumeViewer';
import { RadarAnalysis } from '@/components/dashboard/RadarAnalysis';
import { WeaknessList } from '@/components/dashboard/WeaknessList';
// import { DASHBOARD_UI } from '@/constants/dashboard';

export const Dashboard = () => {
  const {
    data,
    highlightedSection,
    showScrollToTop,
    isAnalysisSummaryExpanded,
    isRadarChartExpanded,
    expandedWeaknessId,
    scrollContainerRef,
    setIsAnalysisSummaryExpanded,
    setIsRadarChartExpanded,
    handleWeaknessClick,
    handleToggleWeaknessExpansion,
    handleScroll,
    scrollToTop,
    handleBack,
    handleOptimizeWeakness
  } = useDashboard();

  return (
    <div className="h-screen bg-background animate-in fade-in duration-700 overflow-hidden flex flex-col relative">
      {/* 赛博朋克背景特效 */}
      <CyberpunkBackground intensity="low" className="opacity-30" />

      {/* 顶部导航 */}
      <DashboardHeader onBack={handleBack} />

      {/* 主内容 - 重新设计的布局 */}
      <main className="container mx-auto px-4 py-6 flex-1 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
          {/* 左侧区域 - 包含智能分析总结和简历渲染区 */}
          <div className="md:col-span-6 space-y-3 animate-in slide-in-from-left duration-500 delay-100">
            {/* 智能分析总结模块 */}
            <AnalysisSummary
              isExpanded={isAnalysisSummaryExpanded}
              onToggle={setIsAnalysisSummaryExpanded}
            />

            {/* 简历渲染区 */}
            <ResumeViewer
              isAnalysisSummaryExpanded={isAnalysisSummaryExpanded}
              scrollContainerRef={scrollContainerRef}
              showScrollToTop={showScrollToTop}
              onScroll={handleScroll}
              onScrollToTop={scrollToTop}
            />
          </div>

          {/* 右侧功能区 */}
          <div className="md:col-span-4 animate-in slide-in-from-right duration-500 delay-200">
            <div className="relative h-[calc(100vh-6rem)] overflow-hidden">
              {/* 底部模糊遮罩 - 和简历预览模块保持一致 */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

              <div className="h-full overflow-y-auto scrollbar-hide space-y-4 pr-2 pb-2">
                {/* 能力光谱分析 */}
                <RadarAnalysis
                  data={data}
                  isExpanded={isRadarChartExpanded}
                  onToggle={setIsRadarChartExpanded}
                />

                {/* 弱点列表 */}
                <WeaknessList
                  data={data}
                  expandedWeaknessId={expandedWeaknessId}
                  highlightedSection={highlightedSection}
                  onWeaknessClick={handleWeaknessClick}
                  onToggleExpansion={handleToggleWeaknessExpansion}
                  onOptimizeWeakness={handleOptimizeWeakness}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};