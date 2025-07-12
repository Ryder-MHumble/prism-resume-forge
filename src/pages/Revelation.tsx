import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Share2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RevelationProps {
  onBack: () => void;
  onBackToPortal: () => void;
  originalScore: number;
  newScore: number;
  optimizedResume: string;
  completedImprovements: string[];
}

export const Revelation = ({ 
  onBack, 
  onBackToPortal, 
  originalScore, 
  newScore, 
  optimizedResume,
  completedImprovements 
}: RevelationProps) => {
  const [animatedOldScore, setAnimatedOldScore] = useState(0);
  const [animatedNewScore, setAnimatedNewScore] = useState(0);

  useEffect(() => {
    // 动画显示分数变化
    setTimeout(() => {
      setAnimatedOldScore(originalScore);
      setTimeout(() => {
        setAnimatedNewScore(newScore);
      }, 1000);
    }, 500);
  }, [originalScore, newScore]);

  const handleExport = () => {
    const element = document.createElement('a');
    const file = new Blob([optimizedResume], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = 'optimized-resume.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="neural-pulse"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回炼金屋
            </Button>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              恭喜！你已解锁专属优化简历
            </h1>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
              <Button onClick={onBackToPortal}>
                返回首页
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* 说明文字 */}
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">
              请注意：
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              这份蓝图的每一句话，都源自你在"能力炼金屋"中的真实输入。
              请确保你能在面试中自信地为每一个字辩护。
              <br />
              <span className="font-semibold text-primary">
                真正的强大，源于真实的你
              </span>
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* 左侧：简历内容 */}
            <div className="space-y-6">
              {/* 个人信息卡片 */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Ryder Sun</h3>
                    <div className="p-2 bg-muted rounded-full">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full" />
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>Email: xxx@gmail.com</p>
                    <p>深度挖掘你的潜力，重塑你的简历</p>
                  </div>
                </div>
              </Card>

              {/* 优化后的简历内容 */}
              <Card className="p-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">优化后简历内容</h4>
                  
                  <div className="prose prose-sm max-w-none">
                    <div className="space-y-6 text-sm leading-relaxed">
                      {optimizedResume.split('\n\n').map((section, index) => (
                        <div key={index} className="space-y-2">
                          {section.split('\n').map((line, lineIndex) => (
                            <p key={lineIndex} className="mb-2">
                              {line}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">更多优化后内容</h4>
                  <div className="prose prose-sm max-w-none">
                    <div className="space-y-6 text-sm leading-relaxed">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="mb-2 text-muted-foreground text-xs font-mono">
                          {`<!-- Generated by Prism. Based on your truth. -->`}
                        </p>
                        <p>
                          在这里展示更多详细的优化内容，包括项目经历、技能描述、
                          成就量化等各个方面的提升...
                        </p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p>
                          继续展示优化后的内容，确保每一个改进都有具体的体现...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* 右侧：改进列表和分数对比 */}
            <div className="space-y-6">
              {/* 分数对比 */}
              <Card className="p-6 text-center">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">评分对比</h3>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">优化前</div>
                      <div className="text-3xl font-bold text-muted-foreground number-roll">
                        {animatedOldScore}
                      </div>
                      <div className="text-xs text-muted-foreground">分</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-primary">优化后</div>
                      <div className="text-3xl font-bold text-primary number-roll">
                        {animatedNewScore}
                      </div>
                      <div className="text-xs text-primary">分</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-500">
                      提升 +{newScore - originalScore} 分
                    </div>
                  </div>
                </div>
              </Card>

              {/* 改进项列表 */}
              <Card className="p-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">完成的改进项目</h4>
                  
                  <div className="space-y-3">
                    {completedImprovements.map((improvement, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* 下一步建议 */}
              <Card className="p-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">下一步建议</h4>
                  
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      • 使用优化后的简历投递目标职位
                    </p>
                    <p>
                      • 准备面试时重点练习新增的项目描述
                    </p>
                    <p>
                      • 定期更新简历内容保持最新状态
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};