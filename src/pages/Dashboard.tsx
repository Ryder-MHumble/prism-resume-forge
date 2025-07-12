import { useState } from 'react';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ScoreCard } from '@/components/prism/ScoreCard';
import { RadarChart } from '@/components/charts/RadarChart';
import { WeaknessScanner } from '@/components/prism/WeaknessScanner';
import { AnalysisMode } from '@/components/prism/AnalysisMode';
import { cn } from '@/lib/utils';

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

export const Dashboard = ({ data, onBack, onOptimizeWeakness }: DashboardProps) => {
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  const handleWeaknessClick = (weakness: any) => {
    onOptimizeWeakness(weakness.id);
  };

  const handlePreviewHighlight = (weaknessId: string) => {
    setHighlightedSection(weaknessId);
    // 这里可以添加滚动到对应段落的逻辑
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="neural-pulse"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                重新评估
              </Button>
              <div className="text-sm text-muted-foreground">
                剩余 3 次免费分析
              </div>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                评价仪表盘
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="neural-pulse">
                <Download className="w-4 h-4 mr-2" />
                导出报告
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* 左侧：评分和分析 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 分数卡片 */}
            <ScoreCard
              score={data.score}
              mode={data.mode}
              comment={data.comment}
              className="animate-fade-in"
            />

            {/* 能力雷达图 */}
            <Card className="p-6 animate-fade-in">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">技能能力分析</h3>
                  <p className="text-sm text-muted-foreground">
                    基于简历内容的多维度能力评估
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <RadarChart
                    data={data.radarData}
                    size={280}
                    className="neural-pulse"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {data.radarData.map((item, index) => (
                    <div key={index} className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="font-medium text-primary">
                        {item.value}/{item.maxValue}
                      </div>
                      <div className="text-muted-foreground">
                        {item.category}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* 弱点扫描 */}
            <WeaknessScanner
              weaknesses={data.weaknesses}
              onItemClick={handleWeaknessClick}
              onPreviewHighlight={handlePreviewHighlight}
              className="animate-fade-in"
            />
          </div>

          {/* 右侧：简历预览 */}
          <div className="space-y-6">
            <Card className="p-6 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Ryder Sun</h3>
                  <div className="p-2 bg-muted rounded-full">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full" />
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Email: xxx@gmail.com</p>
                  <p>深度挖掘你的潜力，重塑你的简历</p>
                </div>
              </div>
            </Card>

            {/* 简历内容预览 */}
            <Card className="p-6 max-h-96 overflow-y-auto animate-fade-in">
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">简历内容预览</h4>
                
                <div className="prose prose-sm max-w-none">
                  <div className="space-y-4 text-sm leading-relaxed">
                    {data.resumeContent.split('\n\n').map((paragraph, index) => (
                      <p
                        key={index}
                        className={cn(
                          "transition-prism",
                          highlightedSection && `highlighted-section-${index}` === highlightedSection
                            ? "bg-primary/10 border-l-4 border-primary pl-3 py-2 rounded-r"
                            : ""
                        )}
                      >
                        {paragraph || "这里显示简历的具体内容，根据左侧弱点扫描的选择会高亮对应段落..."}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* 相关资源 */}
            <Card className="p-6 animate-fade-in">
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">相关资料</h4>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="p-3 bg-muted/30 rounded border hover:border-primary/50 transition-prism cursor-pointer"
                    >
                      <div className="w-full h-8 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};