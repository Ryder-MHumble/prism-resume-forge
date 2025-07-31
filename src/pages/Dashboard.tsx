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
    analysisSummary,
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
    <div className="h-screen bg-gradient-to-br from-background via-background/95 to-background animate-in fade-in duration-700 overflow-hidden flex flex-col relative">
      {/* 简化背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-secondary/3 opacity-40" />

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
              content={analysisSummary}
            />

            {/* 简历渲染区 */}
            <div className="relative">
              <ResumeViewer
                isAnalysisSummaryExpanded={isAnalysisSummaryExpanded}
                scrollContainerRef={scrollContainerRef}
                showScrollToTop={showScrollToTop}
                onScroll={handleScroll}
                onScrollToTop={scrollToTop}
              />
            </div>
          </div>

          {/* 右侧功能区 */}
          <div className="md:col-span-4 animate-in slide-in-from-right duration-500 delay-200">
            <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4">
              {/* 固定的能力光谱分析 */}
              <div className="flex-shrink-0">
                <RadarAnalysis
                  data={data}
                  isExpanded={isRadarChartExpanded}
                  onToggle={setIsRadarChartExpanded}
                />
              </div>

              {/* 可滚动的弱点列表区域 */}
              <div className="flex-1 relative overflow-hidden min-h-0">
                {/* 底部模糊遮罩 - 和简历预览模块保持一致 */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

                <div className="h-full overflow-y-auto scrollbar-hide pr-2 pb-2">
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
        </div>
      </main>
    </div>
  );
};