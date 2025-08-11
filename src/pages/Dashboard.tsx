import { useEffect } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ResumeViewer } from '@/components/dashboard/ResumeViewer';
import { RadarAnalysis } from '@/components/dashboard/RadarAnalysis';
import { WeaknessList } from '@/components/dashboard/WeaknessList';
import { CyberpunkBackground } from '@/components/ui/CyberpunkBackground';
import { HandLoader } from '@/components/common/HandLoader';
import { useAppContext } from '@/store/AppContext';
import { analyzeResumeWithLLM } from '@/services/analysisService';
// import { DASHBOARD_UI } from '@/constants/dashboard';

export const Dashboard = () => {
  const { state, setLLMAnalysisResult, setLoading, setError } = useAppContext();
  const {
    data,
    highlightedSection,
    showScrollToTop,
    isRadarChartExpanded,
    expandedWeaknessId,
    scrollContainerRef,
    setIsRadarChartExpanded,
    handleWeaknessClick,
    handleToggleWeaknessExpansion,
    handleScroll,
    scrollToTop,
    handleBack,
    handleOptimizeWeakness
  } = useDashboard();

  // 进入仪表盘后启动分析，并在本页显示加载蒙版
  useEffect(() => {
    const run = async () => {
      if (state.llmAnalysisResult) return; // 已有结果则不重复分析
      try {
        if (!state.isLoading) setLoading(true);
        const jdText = sessionStorage.getItem('jdText') || undefined;
        const evaluationMode = state.analysisMode === 'hardcore' ? 'mean' : 'gentle';
        const result = await analyzeResumeWithLLM(evaluationMode, jdText ? { jdText } : undefined);
        if (result.success && result.data) {
          setLLMAnalysisResult({
            summarization: '',
            overall_score: result.data.overall_score,
            dimension_scores: result.data.dimension_scores,
            issues: result.data.issues
          });
        } else {
          setError(result.error || '分析失败，请重试');
        }
      } catch (err) {
        console.error('仪表盘分析失败:', err);
        setError('分析失败，请重试');
      } finally {
        sessionStorage.removeItem('jdText');
        setLoading(false);
      }
    };
    run();
    // 仅在初次挂载时尝试启动
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-background/80 via-background/90 to-background/80 animate-in fade-in duration-700 overflow-hidden flex flex-col relative">
      {/* 背景动画 - 底层 */}
      <CyberpunkBackground intensity="low" />

      {/* 分析加载蒙版（移动自首页）*/}
      {state.isLoading && (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center">
          <HandLoader
            size="lg"
            showText={true}
            customTexts={[
              '解析您的简历',
              '分析技能匹配度',
              '识别优化空间',
              '生成专业建议'
            ]}
          />
        </div>
      )}

      {/* 简化背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-secondary/3 opacity-40" />

      {/* 顶部导航 */}
      <DashboardHeader onBack={handleBack} />

      {/* 主内容 - 重新设计的布局 */}
      <main className="container mx-auto px-4 pt-6 pb-0 flex-1 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
          {/* 左侧区域 - 简历渲染区 */}
          <div className="md:col-span-6 animate-in slide-in-from-left duration-500 delay-100">
            {/* 简历渲染区 */}
            <div className="relative">
              <ResumeViewer
                isAnalysisSummaryExpanded={false}
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