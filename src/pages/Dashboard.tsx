import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { RadarChart } from '@/components/charts/RadarChart';
import { AnalysisMode } from '@/components/prism/AnalysisMode';
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
    severity: 'low' | 'medium' | 'high';
    category: string;
    impact: string;
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
    <div className="h-screen bg-background animate-in fade-in duration-700 overflow-hidden flex flex-col">
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

            <h1 className="text-xl font-semibold">{PAGE_TEXT.header.title}</h1>

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
          <div className="md:col-span-7 space-y-3 animate-in slide-in-from-left duration-500 delay-100">
            {/* 智能分析总结模块 - 重构版本 */}
            <div className="relative">
              <Card className="relative border border-primary/20 rounded-xl overflow-hidden bg-gradient-to-br from-primary/5 via-background/95 to-secondary/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30">
                <div className="p-3 pb-2">
                  {/* 精简的标题区域 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-primary/20 to-secondary/20 p-1">
                        <img src={cyberLogo} alt="Prism Logo" className="w-full h-full object-cover rounded" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">
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
          <div className="md:col-span-3 animate-in slide-in-from-right duration-500 delay-200">
            <div className="relative h-[calc(100vh-6rem)] overflow-hidden">
              {/* 底部模糊遮罩 - 和简历预览模块保持一致 */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

              <div className="h-full overflow-y-auto scrollbar-hide hover:scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted/30 scrollbar-thumb-rounded-full space-y-4 pr-2 pb-2">

                {/* 能力光谱分析 - 统一样式版本 */}
                <div>
                  <Card className="relative border border-primary/20 rounded-xl overflow-hidden bg-gradient-to-br from-primary/5 via-background/95 to-secondary/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30">
                    <div className="p-3 pb-2">
                      {/* 标题区域 */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-primary/20 to-secondary/20 p-1">
                            <img src={cyberLogo} alt="Prism Logo" className="w-full h-full object-cover rounded" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">
                              能力光谱分析
                            </h3>
                            <p className="text-xs text-muted-foreground/80">多维度技能评估与量化</p>
                          </div>
                        </div>

                        {/* 展开收起按钮 */}
                        <button
                          onClick={() => setIsRadarChartExpanded(!isRadarChartExpanded)}
                          className="px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-primary border border-primary/20 hover:border-primary/40 rounded-lg transition-colors hover:bg-primary/5"
                        >
                          {isRadarChartExpanded ? "收起" : "展开"}
                        </button>
                      </div>

                      {/* 内容区域 */}
                      {isRadarChartExpanded && (
                        <div className="grid grid-cols-5 gap-6 items-center">
                          {/* 雷达图区域 - 占3列 */}
                          <div className="col-span-3 relative">
                            <div className="relative flex items-center justify-center">
                              <RadarChart
                                data={data.radarData}
                                size={180}
                              />
                              {/* 中心装饰 */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-4 h-4 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg animate-pulse" />
                              </div>
                            </div>
                            {/* 雷达图说明 */}
                            <div className="mt-4 text-center">
                              <p className="text-xs text-muted-foreground">
                                综合能力维度分析
                              </p>
                            </div>
                          </div>

                          {/* 分数展示区域 - 占2列 */}
                          <div className="col-span-2 text-center space-y-4">
                            {/* 主分数 */}
                            <div className="relative">
                              <div className="text-5xl font-bold bg-gradient-to-br from-primary via-primary/90 to-secondary bg-clip-text text-transparent drop-shadow-sm">
                                {data.score}
                              </div>
                              <div className="text-lg font-medium text-muted-foreground mt-1">
                                综合评分
                              </div>
                            </div>

                            {/* 评级标签 */}
                            <div className="space-y-2">
                              <div className={cn(
                                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                data.score >= 80 ? "bg-green-100 text-green-700 border border-green-200" :
                                  data.score >= 60 ? "bg-yellow-100 text-yellow-700 border border-yellow-200" :
                                    "bg-red-100 text-red-700 border border-red-200"
                              )}>
                                <div className={cn(
                                  "w-2 h-2 rounded-full",
                                  data.score >= 80 ? "bg-green-500" :
                                    data.score >= 60 ? "bg-yellow-500" :
                                      "bg-red-500"
                                )} />
                                {data.score >= 80 ? "优秀" : data.score >= 60 ? "良好" : "待提升"}
                              </div>

                              <div className="text-xs text-muted-foreground">
                                超越 {Math.round(data.score * 1.2)}% 的候选人
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* 弱点扫描和资源探测 - 重构版本 */}
                <div className="relative">
                  {/* 背景装饰 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 rounded-2xl blur-xl opacity-60" />

                  <Card className="relative border border-primary/20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 via-background/95 to-secondary/5 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30">
                    <Tabs defaultValue="weaknesses" onValueChange={setActiveTab}>
                      {/* 重新设计的Tab导航 */}
                      <div className="relative p-6 pb-0">
                        <div className="flex items-center justify-center mb-6">
                          <div className="relative flex bg-muted/30 p-1 rounded-2xl backdrop-blur-sm border border-border/20">
                            {/* 活动指示器背景 - 优化颜色和阴影 */}
                            <div
                              className={cn(
                                "absolute top-1 bottom-1 rounded-xl transition-all duration-500 ease-out",
                                activeTab === "weaknesses"
                                  ? "left-1 right-[50%] bg-gradient-to-r from-primary/90 to-primary shadow-lg shadow-primary/20"
                                  : "left-[50%] right-1 bg-gradient-to-r from-secondary/90 to-secondary shadow-lg shadow-secondary/20"
                              )}
                            />

                            <button
                              onClick={() => setActiveTab('weaknesses')}
                              className={cn(
                                "relative z-10 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300",
                                "flex items-center gap-2.5 min-w-[110px] justify-center group",
                                activeTab === "weaknesses"
                                  ? "text-white transform scale-[1.02]"
                                  : "text-muted-foreground hover:text-foreground hover:scale-[1.01]"
                              )}
                            >
                              <div className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                activeTab === "weaknesses"
                                  ? "bg-white shadow-sm animate-pulse"
                                  : "bg-primary/60 group-hover:bg-primary/80"
                              )} />
                              <span className="font-semibold">弱点扫描</span>
                            </button>

                            <button
                              onClick={() => setActiveTab('resources')}
                              className={cn(
                                "relative z-10 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300",
                                "flex items-center gap-2.5 min-w-[110px] justify-center group",
                                activeTab === "resources"
                                  ? "text-white transform scale-[1.02]"
                                  : "text-muted-foreground hover:text-foreground hover:scale-[1.01]"
                              )}
                            >
                              <div className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                activeTab === "resources"
                                  ? "bg-white shadow-sm animate-pulse"
                                  : "bg-secondary/60 group-hover:bg-secondary/80"
                              )} />
                              <span className="font-semibold">资源探测</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 弱点扫描内容 - 重构版本 */}
                      <TabsContent value="weaknesses" className="p-0 m-0">
                        <div className="px-6 pb-3">
                          {/* 问题列表 */}
                          <div className="space-y-3">
                            {Object.entries(highlightedSections).map(([id, section], index) => (
                              <div
                                key={id}
                                onClick={() => handleWeaknessClick(id)}
                                className={cn(
                                  "group relative p-4 rounded-xl cursor-pointer transition-all duration-500 animate-in slide-in-from-bottom",
                                  "border-2 hover:shadow-lg hover:shadow-primary/10",
                                  highlightedSection === id
                                    ? "bg-primary/5 border-primary/40 shadow-lg shadow-primary/10 scale-[1.01]"
                                    : "bg-muted/30 border-muted hover:border-primary/40 hover:bg-muted/50"
                                )}
                                style={{ animationDelay: `${index * 150}ms` }}
                              >
                                {/* 左侧指示器 */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-r-full opacity-60 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-start gap-4 ml-3">
                                  {/* 状态指示器 */}
                                  <div className={cn(
                                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                                    "border-2 shadow-sm",
                                    highlightedSection === id
                                      ? "bg-primary border-primary shadow-primary/20"
                                      : "bg-background border-muted-foreground/30 group-hover:border-primary/50"
                                  )}>
                                    {highlightedSection === id ? (
                                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                                    ) : (
                                      <div className="w-3 h-3 border-2 border-muted-foreground/50 rounded-full" />
                                    )}
                                  </div>

                                  {/* 内容 */}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                                      {section.text}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      第 {section.lineStart}-{section.lineEnd} 行 • 影响评分 -5分
                                    </div>
                                  </div>

                                  {/* 右侧箭头 */}
                                  <div className={cn(
                                    "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                                    highlightedSection === id
                                      ? "bg-primary/20 text-primary"
                                      : "text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
                                  )}>
                                    <ArrowRight className="w-3 h-3" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* 优化按钮 */}
                          <div className="mt-6 flex justify-center">
                            <Button
                              onClick={() => handleOptimizeWeakness(highlightedSection || 'all')}
                              className="relative px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                              <span className="flex items-center gap-2">
                                进入炼金优化室
                                <ArrowRight className="w-4 h-4" />
                              </span>
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                      {/* 资源探测内容 - 重构版本 */}
                      <TabsContent value="resources" className="p-0 m-0">
                        <div className="px-6 pb-6">
                          {/* 资源统计 */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                              <div className="text-2xl font-bold text-primary">{RECOMMENDED_RESOURCES.stats.total}</div>
                              <div className="text-xs text-primary/80">推荐资源</div>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
                              <div className="text-2xl font-bold text-secondary">{RECOMMENDED_RESOURCES.stats.matchRate}%</div>
                              <div className="text-xs text-secondary/80">匹配度</div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground mb-4 text-center">
                              {RECOMMENDED_RESOURCES.description}
                            </p>

                            <div className="grid gap-3">
                              {RECOMMENDED_RESOURCES.items.map((resource, i) => (
                                <div
                                  key={i}
                                  className="group relative p-4 rounded-xl bg-gradient-to-r from-background to-muted/30 border border-muted hover:border-primary/40 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02]"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className={cn(
                                        "w-3 h-3 rounded-full bg-gradient-to-r",
                                        resource.color
                                      )} />
                                      <span className="font-medium text-sm group-hover:text-primary transition-colors">
                                        {resource.title}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={cn(
                                        "px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r text-white",
                                        resource.color
                                      )}>
                                        {resource.tag}
                                      </span>
                                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};