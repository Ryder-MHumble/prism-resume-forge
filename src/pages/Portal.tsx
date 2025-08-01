import { useState, useEffect } from 'react';
import { AnalysisMode } from '@/components/prism/AnalysisMode';
import { useNavigate } from 'react-router-dom';
import { useFileUpload } from '@/hooks/useFileUpload';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { ControlPanel } from '@/components/portal/ControlPanel';
import { HeroSection } from '@/components/portal/HeroSection';
import { useAppContext } from '@/store/AppContext';
import { HandLoader } from '@/components/common/HandLoader';
import { analyzeResumeWithLLM } from '@/services/analysisService';

interface PortalProps {
  onStartAnalysis: (files: { resume?: File; jd?: File }, mode: AnalysisMode) => void;
}

export const Portal = () => {
  const navigate = useNavigate();
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('hardcore');
  const { state, setLoading, setError, setLLMAnalysisResult, setMode } = useAppContext();

  // 同步分析模式到全局状态
  const handleAnalysisModeChange = (mode: AnalysisMode) => {
    setAnalysisMode(mode);
    setMode(mode);
  };

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

  const handleStartAnalysis = async () => {
    if (!uploadedFiles.resume) return;

    try {
      // 设置加载状态
      setLoading(true);
      setError(null);

      // 调用LLM分析服务
      const evaluationMode = analysisMode === 'hardcore' ? 'mean' : 'gentle';
      const result = await analyzeResumeWithLLM(evaluationMode);

      if (result.success && result.data) {
        // 保存分析结果到全局状态
        setLLMAnalysisResult(result.data);
        // 跳转到仪表盘
        navigate('/dashboard');
      } else {
        setError(result.error || '分析失败，请重试');
      }
    } catch (error) {
      console.error('简历分析失败:', error);
      setError('分析失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-gradient-to-br from-background via-background/95 to-background">
      {/* 简化的背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-50" />
      
      {/* 加载状态覆盖层 */}
      {state.isLoading && (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center">
          <HandLoader
            size="lg"
            showText={true}
            customTexts={[
              "解析您的简历",
              "分析技能匹配度",
              "识别优化空间",
              "生成专业建议"
            ]}
          />
        </div>
      )}

      {/* 主内容层 */}
      <div className="relative z-10 h-full">
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
            canStartAnalysis={canStartAnalysis && !state.isLoading}
            setActivePanel={setActivePanel}
            setAnalysisMode={handleAnalysisModeChange}
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