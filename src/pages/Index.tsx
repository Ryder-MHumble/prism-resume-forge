import { useState } from 'react';
import { Portal } from './Portal';
import { Dashboard } from './Dashboard';
import { Crucible } from './Crucible';
import { Revelation } from './Revelation';
import { AnalysisMode } from '@/components/prism/AnalysisMode';
import { useToast } from '@/hooks/use-toast';
import { sampleDashboardData, sampleWeaknessItems, sampleRevelationData } from '@/data/sampleData';

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
    setAppState('crucible');
  };

  const handleCrucibleComplete = () => {
    toast({
      title: "优化完成！",
      description: "你的专属优化简历已生成",
    });
    setAppState('revelation');
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
            data={sampleDashboardData}
            onBack={handleBackToPortal}
            onOptimizeWeakness={handleOptimizeWeakness}
          />
        );
      case 'crucible':
        return (
          <Crucible
            onBack={() => setAppState('dashboard')}
            onComplete={handleCrucibleComplete}
            weaknesses={sampleWeaknessItems}
          />
        );
      case 'revelation':
        return (
          <Revelation
            onBack={() => setAppState('crucible')}
            onBackToPortal={handleBackToPortal}
            originalScore={sampleRevelationData.originalScore}
            newScore={sampleRevelationData.newScore}
            optimizedResume={sampleRevelationData.optimizedResume}
            completedImprovements={sampleRevelationData.completedImprovements}
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
