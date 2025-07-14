import { useState, useCallback } from 'react';
import { AnalysisMode, UploadedFiles, DashboardData, WeaknessItem } from '@/types';
import { analyzeResume, getWeaknessDetails } from '@/services/analysisService';
import { useToast } from '@/hooks/use-toast';

export const useAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // 执行简历分析
  const performAnalysis = useCallback(async (
    files: UploadedFiles,
    mode: AnalysisMode
  ): Promise<boolean> => {
    try {
      setIsAnalyzing(true);
      setError(null);

      toast({
        title: "开始解析简历",
        description: "正在分析你的简历内容，请稍候...",
      });

      const response = await analyzeResume(files, mode);

      if (response.success && response.data) {
        setAnalysisResult(response.data);
        toast({
          title: "分析完成！",
          description: "你的简历已经成功解析，快来查看结果吧！",
        });
        return true;
      } else {
        throw new Error(response.error || '分析失败');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '分析过程中出现错误';
      setError(errorMessage);
      toast({
        title: "分析失败",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  // 获取弱点详情
  const fetchWeaknessDetails = useCallback(async (
    weaknessId: string
  ): Promise<WeaknessItem[] | null> => {
    try {
      const response = await getWeaknessDetails(weaknessId);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || '获取弱点详情失败');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取数据失败';
      setError(errorMessage);
      toast({
        title: "获取失败",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // 重置分析状态
  const resetAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setError(null);
    setIsAnalyzing(false);
  }, []);

  return {
    isAnalyzing,
    analysisResult,
    error,
    performAnalysis,
    fetchWeaknessDetails,
    resetAnalysis
  };
};
