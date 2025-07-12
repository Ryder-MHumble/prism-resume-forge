import { useState } from 'react';
import { ArrowLeft, CheckCircle, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface WeaknessItem {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  category: string;
  impact: string;
  completed?: boolean;
}

interface CrucibleProps {
  onBack: () => void;
  onComplete: () => void;
  weaknesses: WeaknessItem[];
  currentWeaknessId?: string;
}

export const Crucible = ({ onBack, onComplete, weaknesses, currentWeaknessId }: CrucibleProps) => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [currentTask, setCurrentTask] = useState(currentWeaknessId || weaknesses[0]?.id);
  const [userResponse, setUserResponse] = useState('');
  const [aiQuestion, setAiQuestion] = useState('请详细描述一下这个让你最有成就感的项目是什么？');
  
  const currentWeakness = weaknesses.find(w => w.id === currentTask);
  const isAllCompleted = completedTasks.size === weaknesses.length;

  const handleTaskClick = (taskId: string) => {
    setCurrentTask(taskId);
    setUserResponse('');
  };

  const handleSubmitResponse = () => {
    if (userResponse.trim()) {
      setCompletedTasks(prev => new Set([...prev, currentTask!]));
      setUserResponse('');
      
      // 如果还有未完成的任务，自动切换到下一个
      const nextTask = weaknesses.find(w => !completedTasks.has(w.id) && w.id !== currentTask);
      if (nextTask) {
        setCurrentTask(nextTask.id);
      }
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500/30 text-red-500';
      case 'medium': return 'border-yellow-500/30 text-yellow-500';
      case 'low': return 'border-blue-500/30 text-blue-500';
      default: return 'border-muted/30 text-muted-foreground';
    }
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
              返回仪表盘
            </Button>

            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              能力炼金屋
            </h1>

            <div className="text-sm text-muted-foreground">
              深度挖掘你的潜力，重塑你的简历
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* 左侧任务列表 */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">任务列表：</h3>
                  <div className="text-sm text-muted-foreground">
                    {completedTasks.size}/{weaknesses.length} 已完成
                  </div>
                </div>

                <div className="space-y-3">
                  {weaknesses.map((weakness, index) => {
                    const isCompleted = completedTasks.has(weakness.id);
                    const isCurrent = currentTask === weakness.id;
                    
                    return (
                      <div
                        key={weakness.id}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-prism",
                          isCurrent && "border-primary bg-primary/5",
                          isCompleted && "border-green-500/30 bg-green-500/5",
                          !isCurrent && !isCompleted && "border-border hover:border-primary/50"
                        )}
                        onClick={() => handleTaskClick(weakness.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                            isCompleted 
                              ? "border-green-500 bg-green-500 text-white" 
                              : isCurrent
                              ? "border-primary bg-primary/10"
                              : "border-muted"
                          )}>
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <span className="text-xs font-mono">
                                {index + 1}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              缺陷{index + 1}
                            </div>
                            <div className={cn(
                              "text-xs px-2 py-1 rounded",
                              getSeverityColor(weakness.severity)
                            )}>
                              {weakness.severity}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {isAllCompleted && (
                  <Button 
                    onClick={onComplete}
                    className="w-full prism-glow"
                  >
                    生成我的专属简历
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* 中间交互区域 */}
          <div className="lg:col-span-6">
            <Card className="p-6 h-fit">
              <div className="space-y-6">
                {currentWeakness && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">
                        当前任务: {currentWeakness.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentWeakness.description}
                      </p>
                    </div>

                    {/* AI 问题区域 */}
                    <div className="bg-card border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                          AI
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-2">
                            AI 助手询问
                          </div>
                          <div className="typewriter">
                            {aiQuestion}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 用户输入区域 */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">用户的回复</label>
                        <Textarea
                          value={userResponse}
                          onChange={(e) => setUserResponse(e.target.value)}
                          placeholder="请在这里详细描述你的经历和想法..."
                          className="min-h-32 resize-none"
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={handleSubmitResponse}
                          disabled={!userResponse.trim()}
                          className="gap-2"
                        >
                          <Send className="w-4 h-4" />
                          提交回复
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* 右侧相关资料 */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <div className="space-y-6">
                <h3 className="font-semibold">相关资料</h3>
                
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className="p-3 bg-muted/30 rounded border hover:border-primary/50 transition-prism cursor-pointer"
                    >
                      <div className="w-full h-16 bg-muted rounded mb-2" />
                      <div className="text-xs text-muted-foreground">
                        相关资源 #{item}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};