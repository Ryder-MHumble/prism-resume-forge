import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { RadarChart } from '@/components/charts/RadarChart';
import { AnalysisMode } from '@/components/prism/AnalysisMode';
import { CyberpunkBackground } from '@/components/ui/CyberpunkBackground';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { resumeMarkdown } from '@/data/resumeExample';
import prismLogo from '@/assets/极简logo.jpg';
import cyberLogo from '@/assets/赛博logo.jpg';
import { useNavigate } from 'react-router-dom';
import { sampleDashboardData } from '@/data/sampleData';
import { ResumeRenderer } from '@/components/resume/ResumeRenderer';
import {
  HIGHLIGHTED_SECTIONS,
  ANALYSIS_SUMMARY,
  RADAR_ANALYSIS,
  SCORE_LEVELS,
  RECOMMENDED_RESOURCES,
  PAGE_TEXT
} from '@/data/dashboardData';

interface DashboardData {
  score: number;
  mode: AnalysisMode;
  comment: string;
  radarData: Array<{
    category: string;
    value: number;
    maxValue: number;
  }>;
  weaknesses: Array<{
    id: string;
    title: string;
    description: string;
    impact: string;
    suggestion: string;
    original: string;
  }>;
  resumeContent: string;
}

interface DashboardProps {
  data: DashboardData;
  onBack: () => void;
  onOptimizeWeakness: (weaknessId: string) => void;
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('weaknesses');
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isAnalysisSummaryExpanded, setIsAnalysisSummaryExpanded] = useState(true);
  const [isRadarChartExpanded, setIsRadarChartExpanded] = useState(true);
  const [expandedWeaknessId, setExpandedWeaknessId] = useState<string | null>(null);


  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 使用示例数据
  const data = sampleDashboardData;

  // 导航到不同页面的函数
  const handleBack = () => {
    navigate('/portal');
  };

  const handleOptimizeWeakness = (weaknessId: string) => {
    navigate(`/crucible/${weaknessId}`);
  };

  // 使用统一的简历内容
  const markdownContent = resumeMarkdown;

  // 使用从data文件导入的高亮部分数据
  const highlightedSections = HIGHLIGHTED_SECTIONS;

  const handleWeaknessClick = (weaknessId: string) => {
    setHighlightedSection(weaknessId);
  };

  // 滚动监听和返回顶部功能
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setShowScrollToTop(target.scrollTop > 200);
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="h-screen bg-background animate-in fade-in duration-700 overflow-hidden flex flex-col relative">
      {/* 赛博朋克背景特效 */}
      <CyberpunkBackground intensity="low" className="opacity-30" />
      {/* 顶部导航 */}
      <header className="border-b border-border bg-background z-10 flex-shrink-0">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="text-sm"
            >
              {PAGE_TEXT.header.backButton}
            </Button>

            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                {PAGE_TEXT.header.title}
              </h1>
              <p className="text-xs text-muted-foreground">个人价值光谱分析仪</p>
            </div>

            <div className="text-sm text-muted-foreground">
              {PAGE_TEXT.header.subtitle}
            </div>
          </div>
        </div>
      </header>

      {/* 主内容 - 重新设计的布局 */}
      <main className="container mx-auto px-4 py-6 flex-1 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
          {/* 左侧区域 - 包含智能分析总结和简历渲染区 */}
          <div className="md:col-span-6 space-y-3 animate-in slide-in-from-left duration-500 delay-100">
            {/* 智能分析总结模块 - 重构版本 */}
            <div className="relative">
              <Card className="relative border-2 border-primary/30 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-background/90 to-secondary/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-primary/50 backdrop-blur-md">
                {/* 霓虹边框效果 */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 opacity-50 animate-pulse" />

                {/* 顶部装饰线 */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

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
                          {ANALYSIS_SUMMARY.title}
                        </h3>
                        <p className="text-xs text-muted-foreground/80">{ANALYSIS_SUMMARY.subtitle}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsAnalysisSummaryExpanded(!isAnalysisSummaryExpanded)}
                      className="px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-primary border border-primary/20 hover:border-primary/40 rounded-lg transition-colors hover:bg-primary/5"
                    >
                      {isAnalysisSummaryExpanded ? "收起" : "展开"}
                    </button>
                  </div>

                  {/* 精简的分析内容 - 条件渲染 */}
                  {isAnalysisSummaryExpanded && (
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
                          <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 border border-primary/20 rounded">
                            <div className="w-1 h-1 bg-primary rounded-full" />
                            <span className="text-xs text-primary font-medium">结构清晰</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 border border-orange-200 rounded">
                            <div className="w-1 h-1 bg-orange-500 rounded-full" />
                            <span className="text-xs text-orange-600 font-medium">待量化</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-secondary/10 border border-secondary/20 rounded">
                            <div className="w-1 h-1 bg-secondary rounded-full" />
                            <span className="text-xs text-secondary font-medium">可优化</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* 简历渲染区 */}
            <div className={cn(
              "relative overflow-hidden transition-all duration-500 ease-in-out",
              isAnalysisSummaryExpanded
                ? "h-[calc(100vh-16rem)]"
                : "h-[calc(100vh-10rem)]"
            )}>
              {/* 仅保留底部模糊遮罩 */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

              {/* 滚动内容 */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="h-full overflow-y-auto scrollbar-hide hover:scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted/30 scrollbar-thumb-rounded-full"
              >
                <ResumeRenderer
                  content={markdownContent}
                  title="当前简历内容"
                  showHeader={false}
                  className="border rounded-xl overflow-hidden text-sm"
                />
              </div>

              {/* 返回顶部按钮 */}
              <button
                onClick={scrollToTop}
                className={cn(
                  "group absolute top-4 right-4 z-20 w-11 h-11 rounded-xl shadow-lg transition-all duration-500 ease-out transform",
                  "bg-gradient-to-br from-primary/90 to-secondary/90 hover:from-primary hover:to-secondary",
                  "text-white/90 hover:text-white backdrop-blur-sm",
                  "hover:shadow-xl hover:shadow-primary/25 hover:scale-110 active:scale-95",
                  showScrollToTop
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-2 pointer-events-none"
                )}
                title="返回顶部"
              >
                <ArrowUp className="w-4 h-4 mx-auto transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />

                {/* 背景光晕效果 */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </button>
            </div>
          </div>

          {/* 右侧功能区 */}
          <div className="md:col-span-4 animate-in slide-in-from-right duration-500 delay-200">
            <div className="relative h-[calc(100vh-6rem)] overflow-hidden">
              {/* 底部模糊遮罩 - 和简历预览模块保持一致 */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

              <div className="h-full overflow-y-auto scrollbar-hide hover:scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted/30 scrollbar-thumb-rounded-full space-y-4 pr-2 pb-2">

                {/* 能力光谱分析 - 赛博朋克风格重构版本 */}
                <div className="relative">
                  {/* 全息背景装饰 */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                    <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />

                    {/* 全息粒子效果 */}
                    <div className="absolute inset-0 opacity-40">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"
                          style={{
                            left: `${10 + Math.random() * 80}%`,
                            top: `${10 + Math.random() * 80}%`,
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <Card className="relative border-2 border-primary/30 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-background/90 to-secondary/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-primary/50 backdrop-blur-md">
                    {/* 霓虹边框效果 */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 opacity-50 animate-pulse" />

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
                              能力光谱
                            </h3>
                            <p className="text-xs text-muted-foreground/80 font-mono">
                              能力光谱 • 多维度量化分析
                            </p>
                          </div>
                        </div>

                        {/* 科幻风格控制按钮 */}
                        <button
                          onClick={() => setIsRadarChartExpanded(!isRadarChartExpanded)}
                          className="group relative px-4 py-2 text-xs font-medium font-mono uppercase tracking-wider text-muted-foreground hover:text-primary border border-primary/30 hover:border-primary/60 rounded-lg transition-all duration-300 hover:bg-primary/10 backdrop-blur-sm"
                        >
                          {/* 扫描线动画 */}
                          <div className="absolute inset-0 overflow-hidden rounded-lg">
                            <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                          </div>

                          <span className="relative z-10">
                            {isRadarChartExpanded ? "收起" : "展开"}
                          </span>
                        </button>
                      </div>

                      {/* 内容区域 - 全新布局 */}
                      {isRadarChartExpanded && (
                        <div className="space-y-6">
                          {/* 数据展示区 - 水平布局 */}
                          <div className="flex items-center justify-between">
                            {/* 左侧雷达图 */}
                            <div className="flex-1 relative">
                              <div className="relative flex items-center justify-center">
                                {/* 雷达图背景装饰 */}
                                <div className="absolute inset-0 w-48 h-48 mx-auto">
                                  <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse" />
                                  <div className="absolute inset-2 rounded-full border border-secondary/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
                                  <div className="absolute inset-4 rounded-full border border-primary/20 animate-pulse" style={{ animationDelay: '1s' }} />
                                </div>

                                <RadarChart
                                  data={data.radarData}
                                  size={200}
                                />

                                {/* 中心全息核心 */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full shadow-lg animate-pulse" />
                                  <div className="absolute inset-0 w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full blur-xl animate-pulse" />
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
                                      综合评分
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
                                    data.score >= 80
                                      ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-400 shadow-green-500/20"
                                      : data.score >= 60
                                        ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-400 shadow-yellow-500/20"
                                        : "bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/50 text-red-400 shadow-red-500/20"
                                  )}>
                                    <div className={cn(
                                      "w-2 h-2 rounded-full animate-pulse",
                                      data.score >= 80 ? "bg-green-400" :
                                        data.score >= 60 ? "bg-yellow-400" :
                                          "bg-red-400"
                                    )} />
                                    <span>
                                      {data.score >= 80 ? "优秀" : data.score >= 60 ? "良好" : "待提升"}
                                    </span>
                                  </div>
                                </div>

                                <div className="text-center">
                                  <div className="text-xs text-muted-foreground/70 font-mono">
                                    超越 {Math.round(data.score * 1.2)}% 的候选人
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

                {/* 弱点列表 - 极简版本 */}
                <div className="space-y-3">
                  {Object.entries(highlightedSections).map(([id, section], index) => {
                    const isExpanded = expandedWeaknessId === id;
                    const weakness = data.weaknesses.find(w => w.id === id);

                    return (
                      <div key={id} className="relative border-2 border-primary/30 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-background/90 to-secondary/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-primary/50 backdrop-blur-md">
                        {/* 霓虹边框效果 */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 opacity-50 animate-pulse" />

                        <div className="relative z-10 p-4">
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => {
                            handleWeaknessClick(id);
                            setExpandedWeaknessId(isExpanded ? null : id);
                          }}
                        >
                          <div className="flex-1">
                            <div className="text-sm text-foreground">
                              {isExpanded && weakness ? weakness.title : section.text}
                            </div>
                          </div>
                          <div className="ml-3">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>

                        {/* 展开内容 */}
                        {isExpanded && weakness && (
                          <div className="mt-4 pt-4 border-t border-border space-y-3">
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground mb-1">问题分析</h4>
                              <p className="text-sm text-foreground">{weakness.title}</p>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground mb-1">详细描述</h4>
                              <p className="text-sm text-muted-foreground">{weakness.description}</p>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground mb-1">影响程度</h4>
                              <p className="text-sm text-muted-foreground">{weakness.impact}</p>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground mb-1">优化建议</h4>
                              <p className="text-sm text-muted-foreground">{weakness.suggestion}</p>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground mb-1">原始内容</h4>
                              <p className="text-sm text-muted-foreground font-mono">{weakness.original}</p>
                            </div>
                            <div className="pt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOptimizeWeakness(weakness.id);
                                }}
                                className="text-xs text-primary hover:text-primary/80 underline"
                              >
                                立即优化
                              </button>
                            </div>
                          </div>
                        )}
                        </div>
                      </div>
                    );
                  })}

                  {/* 底部按钮 */}
                  <div className="mt-6">
                    <Button
                      onClick={() => handleOptimizeWeakness(highlightedSection || 'all')}
                      className="w-full"
                    >
                      进入能力炼金室
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};