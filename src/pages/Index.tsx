import { useState } from 'react';
import { Portal } from './Portal';
import { Dashboard } from './Dashboard';
import { AnalysisMode } from '@/components/prism/AnalysisMode';
import { useToast } from '@/hooks/use-toast';

type AppState = 'portal' | 'dashboard' | 'crucible' | 'revelation';

interface UploadedFiles {
  resume?: File;
  jd?: File;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>('portal');
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('hardcore');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({});
  const { toast } = useToast();

  // 模拟数据
  const mockDashboardData = {
    score: 78,
    mode: analysisMode,
    comment: analysisMode === 'hardcore' 
      ? "78/100. Solid foundation, but your resume reads like a shopping list. Time to tell a story that sells." 
      : "78/100. Great foundation! You have valuable experience. Let's polish your presentation to truly showcase your strengths.",
    radarData: [
      { category: '技术能力', value: 85, maxValue: 100 },
      { category: '项目经验', value: 72, maxValue: 100 },
      { category: '团队合作', value: 68, maxValue: 100 },
      { category: '表达能力', value: 75, maxValue: 100 },
      { category: '专业知识', value: 88, maxValue: 100 },
      { category: '项目价值', value: 65, maxValue: 100 },
    ],
    weaknesses: [
      {
        id: 'weak-1',
        title: '项目4] 描述中缺少可量化的成果',
        description: '项目成果描述过于模糊，缺乏具体的数据和指标',
        severity: 'high' as const,
        category: '成果量化',
        impact: '影响面试官对项目价值的判断'
      },
      {
        id: 'weak-2', 
        title: '"精通XX"为无效描述，需具体化',
        description: '技能描述过于宽泛，缺乏具体的应用场景和深度',
        severity: 'medium' as const,
        category: '技能描述',
        impact: '降低技能可信度'
      },
      {
        id: 'weak-3',
        title: '项目4] 描述中缺少技术难点',
        description: '未体现解决的技术挑战和创新点',
        severity: 'high' as const,
        category: '技术深度',
        impact: '无法展现技术水平'
      },
      {
        id: 'weak-4',
        title: '"精通XX"为无效描述，需具体化',
        description: '重复出现的问题，需要系统性优化',
        severity: 'medium' as const,
        category: '表达规范',
        impact: '影响专业度'
      }
    ],
    resumeContent: `作为一名有着丰富经验的软件工程师，我专注于全栈开发和系统架构设计。

在过去的工作中，我参与了多个大型项目的开发和维护，积累了丰富的实战经验。

我精通多种编程语言，包括JavaScript、Python、Java等，同时熟悉各种主流框架和工具。

在团队协作方面，我具备良好的沟通能力和项目管理经验，能够有效地推动项目进度。

我致力于持续学习新技术，保持技术的前瞻性和创新性，为团队和项目创造更大的价值。`
  };

  const handleStartAnalysis = (files: UploadedFiles, mode: AnalysisMode) => {
    setUploadedFiles(files);
    setAnalysisMode(mode);
    
    // 模拟文件上传和分析过程
    toast({
      title: "开始解析简历",
      description: "正在分析你的简历内容，请稍候...",
    });

    // 模拟加载过程
    setTimeout(() => {
      setAppState('dashboard');
      toast({
        title: "分析完成！",
        description: "你的简历已经成功解析，快来查看结果吧！",
      });
    }, 2000);
  };

  const handleBackToPortal = () => {
    setAppState('portal');
  };

  const handleOptimizeWeakness = (weaknessId: string) => {
    toast({
      title: "进入炼金室",
      description: `正在为 ${weaknessId} 生成优化方案...`,
    });
    // 这里将来会跳转到炼金室页面
  };

  const renderCurrentPage = () => {
    switch (appState) {
      case 'portal':
        return (
          <Portal onStartAnalysis={handleStartAnalysis} />
        );
      case 'dashboard':
        return (
          <Dashboard
            data={mockDashboardData}
            onBack={handleBackToPortal}
            onOptimizeWeakness={handleOptimizeWeakness}
          />
        );
      default:
        return <Portal onStartAnalysis={handleStartAnalysis} />;
    }
  };

  return (
    <div className="app-container">
      {renderCurrentPage()}
    </div>
  );
};

export default Index;
