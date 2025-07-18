import { useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { sampleDashboardData } from '@/data/sampleData';
import { DASHBOARD_UI } from '@/constants/dashboard';
import { useAppContext } from '@/store/AppContext';
import type { DashboardData, RadarData, WeaknessItem } from '@/types';

export interface UseDashboardReturn {
  // 数据
  data: DashboardData;

  // 状态
  highlightedSection: string | null;
  activeTab: string;
  showScrollToTop: boolean;
  isAnalysisSummaryExpanded: boolean;
  isRadarChartExpanded: boolean;
  expandedWeaknessId: string | null;

  // 引用
  scrollContainerRef: React.RefObject<HTMLDivElement>;

  // 操作函数
  setHighlightedSection: (sectionId: string | null) => void;
  setActiveTab: (tabId: string) => void;
  setIsAnalysisSummaryExpanded: (expanded: boolean) => void;
  setIsRadarChartExpanded: (expanded: boolean) => void;
  setExpandedWeaknessId: (weaknessId: string | null) => void;
  handleWeaknessClick: (weaknessId: string) => void;
  handleToggleWeaknessExpansion: (weaknessId: string) => void;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollToTop: () => void;
  handleBack: () => void;
  handleOptimizeWeakness: (weaknessId: string) => void;
}

export const useDashboard = (): UseDashboardReturn => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { state } = useAppContext();

  // 状态管理
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('weaknesses');
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isAnalysisSummaryExpanded, setIsAnalysisSummaryExpanded] = useState(true);
  const [isRadarChartExpanded, setIsRadarChartExpanded] = useState(true);
  const [expandedWeaknessId, setExpandedWeaknessId] = useState<string | null>(null);

  // 将LLM分析结果转换为Dashboard数据格式
  const data = useMemo((): DashboardData => {
    const llmResult = state.llmAnalysisResult;

    if (!llmResult) {
      // 如果没有LLM结果，返回示例数据
      return sampleDashboardData;
    }

    // 转换维度评分为雷达图数据
    const radarData: RadarData[] = llmResult.dimension_scores.map(item => ({
      category: item.dimension,
      value: item.score,
      maxValue: 5  // LLM返回的是0-5分，这里设置最大值为5
    }));

    // 转换问题列表为弱点数据
    const weaknesses: WeaknessItem[] = llmResult.issues.map(issue => ({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      impact: issue.impact,
      suggestion: issue.suggestion,
      original: issue.original
    }));

     return {
       score: llmResult.overall_score,
       mode: state.analysisMode, // 从全局状态获取用户选择的分析模式
       comment: `综合评分 ${llmResult.overall_score}/100，发现 ${llmResult.issues.length} 个需要优化的问题`,
       radarData,
       weaknesses,
       resumeContent: sampleDashboardData.resumeContent // 简历内容保持使用静态数据
     };
   }, [state.llmAnalysisResult, state.analysisMode]);

  // 弱点点击处理
  const handleWeaknessClick = useCallback((weaknessId: string) => {
    setHighlightedSection(weaknessId);
  }, []);

  // 弱点展开/收起切换
  const handleToggleWeaknessExpansion = useCallback((weaknessId: string) => {
    setExpandedWeaknessId(current =>
      current === weaknessId ? null : weaknessId
    );
  }, []);

  // 滚动处理
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setShowScrollToTop(target.scrollTop > DASHBOARD_UI.scrollThreshold);
  }, []);

  // 滚动到顶部
  const scrollToTop = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  // 导航处理
  const handleBack = useCallback(() => {
    navigate('/portal');
  }, [navigate]);

  const handleOptimizeWeakness = useCallback((weaknessId: string) => {
    navigate(`/crucible/${weaknessId}`);
  }, [navigate]);

  return {
    // 数据
    data,

    // 状态
    highlightedSection,
    activeTab,
    showScrollToTop,
    isAnalysisSummaryExpanded,
    isRadarChartExpanded,
    expandedWeaknessId,

    // 引用
    scrollContainerRef,

    // 操作函数
    setHighlightedSection,
    setActiveTab,
    setIsAnalysisSummaryExpanded,
    setIsRadarChartExpanded,
    setExpandedWeaknessId,
    handleWeaknessClick,
    handleToggleWeaknessExpansion,
    handleScroll,
    scrollToTop,
    handleBack,
    handleOptimizeWeakness
  };
};
