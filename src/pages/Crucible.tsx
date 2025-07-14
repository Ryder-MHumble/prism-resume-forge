import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Edit, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { resumeMarkdown } from '@/data/resumeExample';
import { useNavigate, useParams } from 'react-router-dom';
import { sampleWeaknessItems } from '@/data/sampleData';

export const Crucible = () => {
  const navigate = useNavigate();
  const { weaknessId } = useParams<{ weaknessId?: string }>();

  const [improvements, setImprovements] = useState<Array<{id: string, original: string, improved: string, completed: boolean}>>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [editedContent, setEditedContent] = useState('');
  
  // 使用示例数据
  const weaknesses = sampleWeaknessItems;

  // 根据URL参数过滤需要改进的项目
  useEffect(() => {
    let targetWeaknesses = weaknesses;
    if (weaknessId && weaknessId !== 'all') {
      targetWeaknesses = weaknesses.filter(w => w.id === weaknessId);
    }

    setImprovements(targetWeaknesses.map(w => ({
      id: w.id,
      original: w.original,
      improved: '',
      completed: false
    })));
  }, [weaknessId]);
      
  // 导航函数
  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleComplete = (improvements: string[]) => {
    // 在真实场景中，这里应该保存改进数据
    navigate('/revelation');
  };

  // 初始化当前步骤的编辑内容
  useEffect(() => {
    if (improvements.length > 0 && currentStep < improvements.length) {
      setEditedContent(improvements[currentStep].improved || improvements[currentStep].original);
    }
  }, [currentStep, improvements]);

  const handleSaveImprovement = () => {
    if (currentStep >= improvements.length) return;

    const newImprovements = [...improvements];
    newImprovements[currentStep] = {
      ...newImprovements[currentStep],
      improved: editedContent,
      completed: true
    };

    setImprovements(newImprovements);

    if (currentStep < improvements.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 所有改进完成后，调用完成回调
      handleComplete(newImprovements.map(imp => imp.improved));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回仪表盘
            </Button>

            <h1 className="text-xl font-semibold">能力炼金屋</h1>

            <div className="text-sm text-muted-foreground">
              优化 {currentStep + 1} / {improvements.length}
            </div>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {improvements.length > 0 && currentStep < improvements.length ? (
            <>
              {/* 当前优化项目 */}
              <Card className="p-6 border">
                <h2 className="text-lg font-semibold mb-4">
                  {weaknesses.find(w => w.id === improvements[currentStep].id)?.title}
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">原始内容:</h3>
                    <div className="p-3 bg-muted/30 rounded-md text-sm">
                      {improvements[currentStep].original}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">改进建议:</h3>
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-md text-sm">
                      {weaknesses.find(w => w.id === improvements[currentStep].id)?.suggestion}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">你的改进:</h3>
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="min-h-[120px]"
                      placeholder="请在这里输入改进后的内容..."
                    />
                  </div>
                </div>
              </Card>

              {/* 操作按钮 */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : handleBack()}
                >
                  {currentStep > 0 ? '上一项' : '返回'}
                </Button>
                
                <Button onClick={handleSaveImprovement}>
                  {currentStep < improvements.length - 1 ? '保存并继续' : '完成优化'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          ) : (
            // 如果没有需要优化的项目或全部完成
            <Card className="p-6 text-center">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">全部优化完成!</h2>
              <p className="text-muted-foreground mb-6">
                您已成功完成所有改进项目，点击下方按钮查看优化效果。
              </p>
              <Button onClick={() => handleComplete(improvements.map(imp => imp.improved))}>
                查看优化结果
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};