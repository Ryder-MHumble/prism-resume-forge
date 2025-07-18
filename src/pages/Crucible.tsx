import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/store/AppContext';

export const Crucible = () => {
  const navigate = useNavigate();
  const { weaknessId } = useParams<{ weaknessId?: string }>();
  const { state } = useAppContext();

  const [currentDefectIndex, setCurrentDefectIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [completedDefects, setCompletedDefects] = useState<Set<number>>(new Set());

  // 获取LLM分析的弱点数据，如果没有则使用空数组
  const defects = state.llmAnalysisResult?.issues || [];

  // 根据URL参数设置当前缺陷
  useEffect(() => {
    if (weaknessId && weaknessId !== 'all' && defects.length > 0) {
      const targetIndex = defects.findIndex(d => d.id.toString() === weaknessId);
      if (targetIndex !== -1) {
        setCurrentDefectIndex(targetIndex);
      }
    }
  }, [weaknessId, defects]);

  // 导航函数
  const handleBack = () => {
    navigate('/dashboard');
  };

  // 处理缺陷点击
  const handleDefectClick = (index: number) => {
    setCurrentDefectIndex(index);
  };

  // 处理用户回复
  const handleUserReply = () => {
    if (userResponse.trim()) {
      const newCompleted = new Set(completedDefects);
      newCompleted.add(currentDefectIndex);
      setCompletedDefects(newCompleted);

      // 移动到下一个未完成的缺陷
      const nextIndex = defects.findIndex((_, index) =>
        index > currentDefectIndex && !newCompleted.has(index)
      );

      if (nextIndex !== -1) {
        setCurrentDefectIndex(nextIndex);
        setUserResponse('');
      }
    }
  };

  // 生成专属简历
  const handleGenerateResume = () => {
    navigate('/revelation');
  };

  // 继续到下一个
  const handleNext = () => {
    if (currentDefectIndex < defects.length - 1) {
      setCurrentDefectIndex(currentDefectIndex + 1);
    }
  };

  const currentDefect = defects[currentDefectIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部标题栏 */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              className="px-4 py-2 rounded-lg"
            >
              返回仪表盘
            </Button>

            <h1 className="text-2xl font-bold text-center">能力炼金室</h1>

            <div className="text-sm text-muted-foreground max-w-xs text-right">
              深度挖掘你的潜力，重塑你的简历
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">

          {/* 左侧：任务列表 */}
          <div className="col-span-3 space-y-4">
            <h2 className="text-lg font-semibold mb-4">任务列表：</h2>

            <div className="space-y-3">
              {defects.map((defect, index) => (
                <div
                  key={defect.id}
                  onClick={() => handleDefectClick(index)}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    currentDefectIndex === index
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-4 h-4 rounded-full",
                      completedDefects.has(index)
                        ? "bg-green-500"
                        : currentDefectIndex === index
                        ? "bg-blue-500"
                        : "bg-red-400"
                    )} />
                    <span className="font-medium">缺陷{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 底部生成简历按钮 */}
            <div className="pt-8">
              <Button
                onClick={handleGenerateResume}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl"
                disabled={completedDefects.size === 0}
              >
                生成我的专属简历
              </Button>
            </div>
          </div>

          {/* 中间：主要内容区 */}
          <div className="col-span-6 space-y-4">
            {currentDefect ? (
              <>
                {/* 问题卡片 */}
                <Card className="p-8 border-2">
                  <div className="text-center">
                    <h3 className="text-xl font-medium text-foreground leading-relaxed">
                      请详细描述一下这个让你最有成就感的项目是什么？
                    </h3>
                  </div>
                </Card>

                {/* 用户回复区域 */}
                <Card className="p-6 border-2">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Button
                        onClick={handleUserReply}
                        disabled={!userResponse.trim()}
                        className="px-8 py-3 bg-muted/50 hover:bg-muted/70 text-foreground border rounded-xl"
                        variant="outline"
                      >
                        用户的回复
                      </Button>
                    </div>

                    <Textarea
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      placeholder="在这里输入你的改进方案..."
                      className="min-h-[150px] resize-none"
                    />

                    <div className="flex justify-between items-center">
                      <Button
                        onClick={handleUserReply}
                        disabled={!userResponse.trim()}
                        className="bg-primary hover:bg-primary/90"
                      >
                        提交回复
                      </Button>

                      <Button
                        onClick={handleNext}
                        variant="outline"
                        className="p-2"
                        disabled={currentDefectIndex >= defects.length - 1}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">暂无需要优化的项目</p>
              </Card>
            )}
          </div>

          {/* 右侧：相关资料 */}
          <div className="col-span-3 space-y-4">
            <h2 className="text-lg font-semibold mb-4">相关资料</h2>

            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <Card key={item} className="p-4 h-20 bg-muted/20">
                  <div className="text-sm text-muted-foreground">
                    相关资料 {item}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};