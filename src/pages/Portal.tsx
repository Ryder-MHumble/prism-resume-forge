import { useState } from 'react';
import { CyberpunkBackground } from '@/components/ui/CyberpunkBackground';
import { AnalysisMode } from '@/components/prism/AnalysisMode';
import { useNavigate } from 'react-router-dom';
import { useFileUpload } from '@/hooks/useFileUpload';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { ControlPanel } from '@/components/portal/ControlPanel';
import { HeroSection } from '@/components/portal/HeroSection';

interface PortalProps {
  onStartAnalysis: (files: { resume?: File; jd?: File }, mode: AnalysisMode) => void;
}

export const Portal = () => {
  const navigate = useNavigate();
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('hardcore');

  const {
    uploadedFiles,
    isDragOver,
    activePanel,
    setUploadedFiles,
    setActivePanel,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    canStartAnalysis
  } = useFileUpload();

  const handleStartAnalysis = () => {
    if (uploadedFiles.resume) {
      // 在真实场景中，这里应该发送文件到服务器，然后导航到仪表盘
      // 此处简化为直接导航
      navigate('/dashboard');
    }
  };



  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* 赛博朋克背景 */}
      <CyberpunkBackground intensity="medium" />

      {/* 主内容层 */}
      <div className="relative z-10 h-full bg-gradient-to-br from-background/90 via-background/85 to-background/90 backdrop-blur-[2px]">
        {/* Portal 头部 */}
        <PortalHeader />

        {/* 主要内容区域 */}
        <div className="flex h-[calc(100vh-4rem)]">
          {/* 左侧控制面板 */}
          <ControlPanel
            activePanel={activePanel}
            uploadedFiles={uploadedFiles}
            isDragOver={isDragOver}
            analysisMode={analysisMode}
            canStartAnalysis={canStartAnalysis}
            setActivePanel={setActivePanel}
            setAnalysisMode={setAnalysisMode}
            setUploadedFiles={setUploadedFiles}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileSelect={handleFileSelect}
            onStartAnalysis={handleStartAnalysis}
          />

          {/* 右侧展示区域 */}
          <HeroSection />
        </div>
      </div>
    </div>
  );
};