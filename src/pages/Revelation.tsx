import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Share2, CheckCircle, TrendingUp, Target, Sparkles, X, Trophy, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
// 导入logo
import prismLogo from '@/assets/极简logo.jpg';
import { useNavigate } from 'react-router-dom';
import { sampleRevelationData } from '@/data/sampleData';
import { resumeMarkdown } from '@/data/resumeExample';
import { ResumeRenderer } from '@/components/resume/ResumeRenderer';

interface RevelationProps {
  onBack: () => void;
  onBackToPortal: () => void;
  originalScore: number;
  newScore: number;
  optimizedResume: string;
  completedImprovements: string[];
}

// 庆祝弹窗组件
const CelebrationModal = ({
  isOpen,
  onClose,
  scoreImprovement
}: {
  isOpen: boolean;
  onClose: () => void;
  scoreImprovement: number;
}) => {
  const [showContent, setShowContent] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number}>>([]);
  const [countdown, setCountdown] = useState(5);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 延迟显示内容以实现动画效果
      setTimeout(() => setShowContent(true), 100);

      // 生成庆祝粒子
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
      }));
      setParticles(newParticles);

      // 倒计时功能
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            handleClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setShowContent(false);
      setCountdown(5);
    }, 500); // 等待消失动画完成
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center transition-all duration-500",
      isClosing ? "bg-black/0 backdrop-blur-none" : "bg-black/80 backdrop-blur-sm"
    )}>
      {/* 背景粒子效果 */}
      <div className={cn(
        "absolute inset-0 overflow-hidden transition-opacity duration-500",
        isClosing ? "opacity-0" : "opacity-100"
      )}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute h-2 w-2 animate-pulse rounded-full bg-emerald-400"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `float 3s ease-in-out infinite ${particle.id * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* 主要内容 */}
      <div
        className={cn(
          "relative mx-4 w-full max-w-lg transform transition-all duration-500 ease-out",
          showContent && !isClosing ? "scale-100 opacity-100 translate-y-0" :
          isClosing ? "scale-90 opacity-0 translate-y-4" : "scale-75 opacity-0 translate-y-8"
        )}
      >
        <Card className="border-emerald-500/50 bg-slate-800/95 p-8 shadow-2xl backdrop-blur-md">
          {/* 关闭按钮和倒计时 */}
          <div className="absolute right-4 top-4 flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-slate-700/50 px-2 py-1 text-xs text-slate-300">
              <Clock className="h-3 w-3" />
              <span>{countdown}s</span>
            </div>
            <button
              onClick={handleClose}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* 内容区域 */}
          <div className="space-y-6 text-center">
            {/* 图标和标题 */}
            <div className="relative">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border-2 border-emerald-500">
                <Trophy className="h-10 w-10 text-emerald-400 animate-bounce" />
              </div>
              <Sparkles className="absolute -right-2 -top-2 h-8 w-8 text-yellow-400 animate-pulse" />
              <Zap className="absolute -left-2 top-2 h-6 w-6 text-blue-400 animate-pulse" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-emerald-400">
                🎉 恭喜！优化完成！
              </h2>
              <p className="text-slate-300">
                您的简历已成功优化升级
              </p>
            </div>

            {/* 成就展示 */}
            <div className="space-y-4">
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-4">
                <div className="flex items-center justify-center gap-2 text-emerald-400">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-lg font-semibold">评分提升</span>
                </div>
                <div className="mt-2 text-3xl font-bold text-emerald-400">
                  +{scoreImprovement} 分
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded bg-slate-700/50 p-3">
                  <div className="text-slate-400">优化项目</div>
                  <div className="font-semibold text-white">5+</div>
                </div>
                <div className="rounded bg-slate-700/50 p-3">
                  <div className="text-slate-400">竞争力</div>
                  <div className="font-semibold text-emerald-400">显著提升</div>
                </div>
              </div>
            </div>

            {/* 重要提示信息 */}
            <div className="rounded-lg bg-slate-700/30 border border-slate-600/50 p-4 text-left">
              <h3 className="text-sm font-semibold text-slate-200 mb-3 text-center">
                ⚠️ 请注意
              </h3>
              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  这份蓝图的每一句话，都源自你在"能力炼金屋"中的真实输入。
                  请确保你能在面试中自信地为每一个字辩护。
                </p>
                <p className="text-center font-semibold text-emerald-400 mt-3">
                  ✨ 真正的强大，源于真实的你
                </p>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-slate-600 bg-slate-700/50 text-slate-200 hover:bg-slate-600"
              >
                稍后查看 ({countdown}s)
              </Button>
              <Button
                onClick={handleClose}
                className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600"
              >
                立即查看结果
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* 优化后的浮动动画CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: translateY(-20px) rotate(90deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-40px) rotate(180deg);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-20px) rotate(270deg);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export const Revelation = () => {
  const navigate = useNavigate();

  // 使用示例数据
  const { originalScore, newScore, optimizedResume, completedImprovements } = sampleRevelationData;

  const [animatedOldScore, setAnimatedOldScore] = useState(0);
  const [animatedNewScore, setAnimatedNewScore] = useState(0);
  const [showCelebrationModal, setShowCelebrationModal] = useState(true);

  useEffect(() => {
    // 动画显示分数变化（在庆祝弹窗关闭后开始）
    if (!showCelebrationModal) {
      setTimeout(() => {
        setAnimatedOldScore(originalScore);
        setTimeout(() => {
          setAnimatedNewScore(newScore);
        }, 1000);
      }, 100);
    }
  }, [originalScore, newScore, showCelebrationModal]);

  const handleExport = () => {
    // 导出左侧显示的简历内容
    const contentToExport = resumeMarkdown;

    // 动态提取姓名作为文件名
    const extractNameFromResume = (content: string): string => {
      // 尝试从markdown中提取第一个标题作为姓名
      const nameMatch = content.match(/^#\s*(.+)$/m);
      if (nameMatch && nameMatch[1]) {
        return nameMatch[1].trim();
      }

      // 如果没有找到，尝试其他方式或使用默认名称
      return '优化简历';
    };

    // 生成动态文件名
    const extractedName = extractNameFromResume(contentToExport);
    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD格式
    const fileName = `${extractedName}-${timestamp}.md`;

    // 创建并下载文件
    const element = document.createElement('a');
    const file = new Blob([contentToExport], { type: 'text/markdown; charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    // 清理URL对象以释放内存
    URL.revokeObjectURL(element.href);
  };

  // 导航函数
  const handleBack = () => {
    navigate('/crucible');
  };

  const handleBackToPortal = () => {
    navigate('/portal');
  };

  const handleCloseCelebration = () => {
    setShowCelebrationModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* 庆祝弹窗 */}
      <CelebrationModal
        isOpen={showCelebrationModal}
        onClose={handleCloseCelebration}
        scoreImprovement={newScore - originalScore}
      />

      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-40 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/75">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* 左侧：返回按钮 */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回炼金屋
            </Button>

            {/* 中间：标题和logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center">
                <img
                  src={prismLogo}
                  alt="Prism"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                <h1 className="text-xl font-bold text-emerald-400">
                  恭喜！你已解锁专属优化简历
                </h1>
              </div>
            </div>

            {/* 右侧：操作按钮 */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700"
              >
                <Download className="mr-2 h-4 w-4" />
                导出
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700"
              >
                <Share2 className="mr-2 h-4 w-4" />
                分享
              </Button>
              <Button
                onClick={handleBackToPortal}
                className="bg-emerald-500 text-white hover:bg-emerald-600"
              >
                返回首页
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="container mx-auto px-6 py-8">
        {/* 主要内容网格 */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* 左侧：简历内容区域 (8/12) */}
          <div className="space-y-6 lg:col-span-8">
            {/* 使用新的简历渲染组件 */}
            <ResumeRenderer
              content={resumeMarkdown}
              title="优化后简历内容"
              showHeader={true}
            />
          </div>

          {/* 右侧：统计和成果展示区域 (4/12) */}
          <div className="space-y-6 lg:col-span-4">
            {/* 评分对比卡片 */}
            <Card className="border-slate-700 bg-slate-800/50 p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">评分对比</h3>
                </div>
                  
                <div className="grid grid-cols-2 gap-6">
                  {/* 优化前 */}
                  <div className="text-center space-y-2">
                    <div className="text-sm text-slate-400">优化前</div>
                    <div className="text-4xl font-bold text-slate-400 transition-all duration-1000">
                      {animatedOldScore}
                    </div>
                    <div className="text-xs text-slate-500">分</div>
                  </div>
                    
                  {/* 优化后 */}
                  <div className="text-center space-y-2">
                    <div className="text-sm text-emerald-400">优化后</div>
                    <div className="text-4xl font-bold text-emerald-400 transition-all duration-1000">
                      {animatedNewScore}
                    </div>
                    <div className="text-xs text-emerald-500">分</div>
                  </div>
                </div>
                  
                {/* 提升显示 */}
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                  <div className="text-lg font-bold text-emerald-400">
                    提升 +{newScore - originalScore} 分
                  </div>
                  <div className="text-sm text-emerald-300">
                    显著提升简历竞争力
                  </div>
                </div>
              </div>
            </Card>

            {/* 完成的改进项目 */}
            <Card className="border-slate-700 bg-slate-800/50 p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <h4 className="font-semibold text-white">完成的改进项目</h4>
                </div>
                  
                <div className="space-y-3">
                  {completedImprovements.map((improvement, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                      <span className="text-sm text-slate-200">{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* 下一步建议 */}
            <Card className="border-slate-700 bg-slate-800/50 p-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-white">下一步建议</h4>
                  
                <div className="space-y-3">
                  {[
                    "使用优化后的简历投递目标职位",
                    "准备面试时重点练习新增的项目描述",
                    "定期更新简历内容保持最新状态"
                  ].map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* 移除原有的style标签，因为样式已经在ResumeRenderer组件中 */}
    </div>
  );
};