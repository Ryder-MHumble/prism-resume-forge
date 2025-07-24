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
    <div className="h-screen bg-background overflow-hidden flex flex-col">
      {/* 顶部标题栏 - 使用Dashboard样式 */}
      <header className="border-b border-border bg-background z-10 flex-shrink-0">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="text-sm"
            >
              返回仪表盘
            </Button>

            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                能力炼金室
              </h1>
              <p className="text-xs text-muted-foreground">深度挖掘你的潜力，重塑你的简历</p>
            </div>

            <div className="text-sm text-muted-foreground">
              个人能力优化引擎
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="container mx-auto px-4 py-6 flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-full">

          {/* 左侧：深挖问题列表 */}
          <div className="lg:col-span-3 flex flex-col h-full max-h-[calc(100vh-200px)]">
            <h2 className="text-lg font-semibold mb-4">深挖问题</h2>

            {/* 可滚动的问题列表区域 */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto scrollbar-hide pr-2 space-y-3 max-h-[calc(100vh-300px)]">
                {defects.map((defect, index) => {
                  const isActive = currentDefectIndex === index;
                  const isCompleted = completedDefects.has(index);

                  // 根据影响程度获取对应的样式
                  const getImpactStyle = (impact: string) => {
                    const normalizedImpact = impact.toLowerCase();
                    if (normalizedImpact.includes('高') || normalizedImpact.includes('high')) {
                      return {
                        cardBorderColor: 'border-red-500/30',
                        cardGradient: 'bg-gradient-to-br from-red-500/5 via-background to-red-500/5',
                        titleColor: 'text-red-400',
                        iconColor: 'bg-red-500/10 border-red-500/20 text-red-500'
                      };
                    } else if (normalizedImpact.includes('中') || normalizedImpact.includes('medium')) {
                      return {
                        cardBorderColor: 'border-yellow-500/30',
                        cardGradient: 'bg-gradient-to-br from-yellow-500/5 via-background to-yellow-500/5',
                        titleColor: 'text-yellow-400',
                        iconColor: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                      };
                    } else {
                      return {
                        cardBorderColor: 'border-blue-500/30',
                        cardGradient: 'bg-gradient-to-br from-blue-500/5 via-background to-blue-500/5',
                        titleColor: 'text-blue-400',
                        iconColor: 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                      };
                    }
                  };

                  const impactStyle = getImpactStyle(defect.impact);

                  return (
                    <div
                      key={defect.id}
                      onClick={() => handleDefectClick(index)}
                      className={cn(
                        "relative rounded-xl border-2 transition-all duration-200 cursor-pointer",
                        isActive ? "border-primary bg-primary/10" : impactStyle.cardBorderColor,
                        !isActive && impactStyle.cardGradient,
                        "shadow-sm hover:shadow-md"
                      )}
                    >
                      <div className="relative z-10 p-3">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center border mt-0.5",
                            isCompleted
                              ? "bg-green-500/10 border-green-500/20 text-green-500"
                              : isActive
                              ? "bg-primary/10 border-primary/20 text-primary"
                              : impactStyle.iconColor
                          )}>
                            <div className="w-2 h-2 rounded-full bg-current" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <h3 className={cn(
                              "text-sm font-medium line-clamp-2 leading-relaxed",
                              isActive ? "text-primary" : impactStyle.titleColor
                            )}>
                              {defect.title || `问题${index + 1}`}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                                isActive
                                  ? "bg-primary/10 border-primary/20 text-primary"
                                  : impactStyle.iconColor.replace('text-', 'text-').replace('bg-', 'bg-').replace('border-', 'border-')
                              )}>
                                {defect.impact}
                              </span>
                              {isCompleted && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-500">
                                  已完成
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 底部模糊遮罩 */}
              <div className="h-4 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </div>

            {/* 底部生成简历按钮 - 固定在底部 */}
            <div className="pt-4 border-t border-border/50">
              <Button
                onClick={handleGenerateResume}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl"
                disabled={completedDefects.size === 0}
              >
                生成我的专属简历
              </Button>
            </div>
          </div>

          {/* 中间：面试对话区域 */}
          <div className="lg:col-span-6 flex flex-col h-full">
            {currentDefect ? (
              <>
                {/* 聊天消息区域 */}
                <Card className="flex-1 border-2 p-4 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 mb-4">
                    {/* 面试官提问 */}
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        面试官
                      </div>
                      <div className="flex-1">
                        <div className="bg-muted/30 rounded-lg p-3 border">
                          <p className="text-sm text-foreground mb-2 font-medium">
                            {currentDefect.title}
                          </p>
                          {currentDefect.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {currentDefect.description}
                            </p>
                          )}
                          {currentDefect.suggestion && (
                            <div className="mt-2 p-2 bg-primary/5 rounded text-xs border border-primary/20">
                              <strong>🤔 深挖方向：</strong>{currentDefect.suggestion}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 用户回复消息 (如果有) */}
                    {userResponse && (
                      <div className="flex gap-3 justify-end">
                        <div className="flex-1 max-w-md">
                          <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                            <p className="text-sm text-primary">
                              {userResponse}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                          我
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 输入区域 */}
                  <div className="border-t border-border/20 pt-4 bg-gradient-to-r from-background/50 via-background to-background/50">
                    <div className="space-y-3">
                      {/* 快捷回复按钮 */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUserResponse("能否给我一些具体的回答思路和要点？")}
                          className="h-7 px-3 text-xs bg-muted/30 hover:bg-muted/50 border border-border/30 rounded-full"
                        >
                          💡 需要回答思路
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUserResponse("我想详细说明这个项目的背景和我的贡献")}
                          className="h-7 px-3 text-xs bg-muted/30 hover:bg-muted/50 border border-border/30 rounded-full"
                        >
                          📝 详细展开
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUserResponse("这个问题我需要重新思考和组织语言")}
                          className="h-7 px-3 text-xs bg-muted/30 hover:bg-muted/50 border border-border/30 rounded-full"
                        >
                          🤔 需要重新思考
                        </Button>
                      </div>

                      {/* 输入框和发送按钮 */}
                      <div className="flex gap-3 items-end">
                        <div className="flex-1 relative">
                          <Textarea
                            value={userResponse}
                            onChange={(e) => setUserResponse(e.target.value)}
                            placeholder="分享你的想法，或描述改进方案..."
                            className="min-h-[52px] max-h-[120px] resize-none rounded-xl border-2 border-border/30 bg-background/80 backdrop-blur-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200 pr-12"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (userResponse.trim()) {
                                  handleUserReply();
                                }
                              }
                            }}
                          />
                          <div className="absolute right-3 bottom-3 text-xs text-muted-foreground">
                            {userResponse.length > 0 && `${userResponse.length}/500`}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={handleUserReply}
                            disabled={!userResponse.trim()}
                            size="sm"
                            className="h-10 w-16 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium rounded-xl shadow-lg shadow-primary/20 transition-all duration-200 disabled:opacity-50 disabled:shadow-none"
                          >
                            发送
                          </Button>
                          <Button
                            onClick={handleNext}
                            variant="outline"
                            size="sm"
                            disabled={currentDefectIndex >= defects.length - 1}
                            className="h-8 w-16 border-border/40 hover:bg-muted/30 rounded-lg transition-all duration-200"
                            title="跳过到下一项"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="flex-1 border-2 p-8 flex items-center justify-center">
                <p className="text-muted-foreground">请选择一个问题开始深度面试</p>
              </Card>
            )}
          </div>

          {/* 右侧：进度与工具 */}
          <div className="lg:col-span-3 space-y-4">
            <div className="space-y-4">
              {/* 进度概览 */}
              <Card className="p-4 border-border/50">
                <h3 className="text-sm font-semibold mb-3 text-foreground">面试进度</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">已完成</span>
                    <span className="text-primary font-medium">{completedDefects.size}/{defects.length}</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${defects.length > 0 ? (completedDefects.size / defects.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </Card>

              {/* 相关资料 */}
              <Card className="p-4 border-border/50">
                <h3 className="text-sm font-semibold mb-3 text-foreground">相关资料</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-border/30 bg-gradient-to-br from-blue-500/5 via-background to-blue-500/5 hover:border-blue-500/30 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-xs font-medium text-blue-400 mb-1">简历优化指南</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          如何突出核心竞争力，让HR一眼看到你的价值
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/30 bg-gradient-to-br from-green-500/5 via-background to-green-500/5 hover:border-green-500/30 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-xs font-medium text-green-400 mb-1">技能表达技巧</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          用数据和结果说话，展现专业能力
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/30 bg-gradient-to-br from-purple-500/5 via-background to-purple-500/5 hover:border-purple-500/30 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-xs font-medium text-purple-400 mb-1">行业趋势洞察</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          了解市场需求，调整简历重点方向
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/30 bg-gradient-to-br from-orange-500/5 via-background to-orange-500/5 hover:border-orange-500/30 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-xs font-medium text-orange-400 mb-1">面试准备要点</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          基于简历内容的面试问题预测与准备
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};