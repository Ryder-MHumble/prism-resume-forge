import { useState, useEffect } from 'react';
import { AnalysisMode } from '@/components/prism/AnalysisMode';
import { useNavigate } from 'react-router-dom';
import { useFileUpload } from '@/hooks/useFileUpload';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { CyberpunkBackground } from '@/components/ui/CyberpunkBackground';
import { ControlPanel } from '@/components/portal/ControlPanel';
import { HeroSection } from '@/components/portal/HeroSection';
import { useAppContext } from '@/store/AppContext';
import { HandLoader } from '@/components/common/HandLoader';
import { extractJDTextFromImage } from '@/services/jdOcrService';
import type { LLMAnalysisResult } from '@/types';

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
      // 开始全局加载，在仪表盘显示蒙版
      setLoading(true);
      setError(null);

      // 若存在JD图片（如PNG），先OCR提取文本并暂存，供仪表盘分析使用
      let jdText = '';
      const jdFile = uploadedFiles.jd;
      if (jdFile && jdFile.type.includes('image/')) {
        try {
          jdText = await extractJDTextFromImage(jdFile);
        } catch (e) {
          console.warn('JD OCR 提取失败，将忽略JD：', e);
        }
      }

      if (jdText) sessionStorage.setItem('jdText', jdText);
      // 清空之前的分析结果，避免旧数据闪现
      setLLMAnalysisResult(null);

      // 进入仪表盘，由仪表盘负责启动分析与关闭加载
      navigate('/dashboard');
    } catch (error) {
      console.error('启动分析失败:', error);
      setError('启动分析失败，请重试');
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-gradient-to-br from-background via-background/95 to-background">
      {/* 背景动画 */}
      <CyberpunkBackground intensity="high" />
      {/* 简化的背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-50" />
      
      {/* 首页不再显示分析加载蒙版，蒙版移动到仪表盘页面 */}

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