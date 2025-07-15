import {
  AnalysisMode,
  UploadedFiles,
  DashboardData,
  WeaknessItem,
  RevelationData,
  ImprovementItem,
  ApiResponse
} from '@/types';
import { sampleDashboardData, sampleWeaknessItems, sampleRevelationData } from '@/data/sampleData';

/**
 * 模拟API延迟
 */
const simulateApiDelay = (ms: number = 2000) =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * 执行简历分析
 */
export const analyzeResume = async (
  files: UploadedFiles,
  mode: AnalysisMode
): Promise<ApiResponse<DashboardData>> => {
  try {
    await simulateApiDelay();

    // 这里应该是实际的分析逻辑
    // 目前使用示例数据
    const analysisResult: DashboardData = {
      ...sampleDashboardData,
      mode,
    };

    return {
      success: true,
      data: analysisResult,
      message: '简历分析完成'
    };
  } catch (error) {
    return {
      success: false,
      error: '分析失败，请重试'
    };
  }
};

/**
 * 获取弱点详情
 */
export const getWeaknessDetails = async (weaknessId: string): Promise<ApiResponse<WeaknessItem[]>> => {
  try {
    await simulateApiDelay(500);

    // 根据ID筛选或返回所有弱点
    const weaknesses = weaknessId === 'all'
      ? sampleWeaknessItems
      : sampleWeaknessItems.filter(w => w.id === weaknessId);

    return {
      success: true,
      data: weaknesses,
      message: '弱点详情获取成功'
    };
  } catch (error) {
    return {
      success: false,
      error: '获取弱点详情失败'
    };
  }
};

/**
 * 保存改进内容
 */
export const saveImprovement = async (
  improvementId: string,
  content: string
): Promise<ApiResponse<void>> => {
  try {
    await simulateApiDelay(300);

    // 这里应该保存到服务器或本地存储
    console.log(`保存改进 ${improvementId}:`, content);

    return {
      success: true,
      message: '改进内容已保存'
    };
  } catch (error) {
    return {
      success: false,
      error: '保存失败，请重试'
    };
  }
};

/**
 * 生成最终优化结果
 */
export const generateOptimizedResume = async (
  improvements: ImprovementItem[]
): Promise<ApiResponse<RevelationData>> => {
  try {
    await simulateApiDelay(1500);

    // 计算分数提升
    const baseScore = sampleDashboardData.score;
    const completedCount = improvements.filter(imp => imp.completed).length;
    const scoreImprovement = Math.min(completedCount * 5, 30); // 每个改进项目最多提升5分

    const result: RevelationData = {
      originalScore: baseScore,
      newScore: baseScore + scoreImprovement,
      optimizedResume: generateOptimizedResumeContent(improvements),
      completedImprovements: improvements
        .filter(imp => imp.completed)
        .map(imp => imp.improved)
    };

    return {
      success: true,
      data: result,
      message: '优化简历生成成功'
    };
  } catch (error) {
    return {
      success: false,
      error: '生成优化简历失败'
    };
  }
};

/**
 * 生成优化后的简历内容
 */
const generateOptimizedResumeContent = (improvements: ImprovementItem[]): string => {
  // 这里应该是实际的简历优化逻辑
  // 目前返回示例数据
  let optimizedContent = sampleRevelationData.optimizedResume;

  // 应用改进内容
  improvements.forEach(improvement => {
    if (improvement.completed && improvement.improved) {
      // 替换原始内容为改进内容
      optimizedContent = optimizedContent.replace(
        improvement.original,
        improvement.improved
      );
    }
  });

  return optimizedContent;
};

/**
 * 计算分析模式影响
 */
export const calculateModeImpact = (mode: AnalysisMode): {
  scoreAdjustment: number;
  description: string;
} => {
  switch (mode) {
    case 'hardcore':
      return {
        scoreAdjustment: 0,
        description: '严格模式：最真实的评估结果'
      };
    case 'balanced':
      return {
        scoreAdjustment: 5,
        description: '平衡模式：适中的评估标准'
      };
    case 'gentle':
      return {
        scoreAdjustment: 10,
        description: '温和模式：鼓励性的评估方式'
      };
    default:
      return {
        scoreAdjustment: 0,
        description: '默认评估模式'
      };
  }
};

/**
 * 验证改进内容质量
 */
export const validateImprovementQuality = (
  original: string,
  improved: string
): {
  isValid: boolean;
  score: number;
  feedback: string;
} => {
  if (!improved.trim()) {
    return {
      isValid: false,
      score: 0,
      feedback: '请填写改进内容'
    };
  }

  if (improved.length < 10) {
    return {
      isValid: false,
      score: 20,
      feedback: '改进内容过于简短，建议更详细'
    };
  }

  if (improved === original) {
    return {
      isValid: false,
      score: 10,
      feedback: '内容未发生改变，请进行实质性改进'
    };
  }

  // 简单的质量评分算法
  let score = 60; // 基础分

  // 长度奖励
  if (improved.length > original.length * 1.2) score += 10;

  // 关键词检查（简化版）
  const keywords = ['优化', '提升', '改进', '增强', '完善'];
  const hasKeywords = keywords.some(keyword => improved.includes(keyword));
  if (hasKeywords) score += 10;

  // 结构完整性
  if (improved.includes('：') || improved.includes('、') || improved.includes('；')) {
    score += 10;
  }

  score = Math.min(score, 100);

  return {
    isValid: score >= 60,
    score,
    feedback: score >= 80 ? '优秀的改进！' :
              score >= 60 ? '不错的改进，可以继续完善' :
              '建议进一步改进内容质量'
  };
};

/**
 * 获取改进建议
 */
export const getImprovementSuggestions = (weakness: WeaknessItem): string[] => {
  return [
    '详细描述具体内容',
    '使用数据支撑观点',
    '突出个人价值',
    '保持逻辑清晰'
  ];
};
