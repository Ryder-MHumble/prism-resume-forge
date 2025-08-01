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
import { callLLM, LLMRequest } from './llmService';

// 简历分析相关类型定义
export interface ResumeAnalysisResult {
  overall_score: number;
  dimension_scores: Array<{
    dimension: string;
    score: number;
  }>;
  issues: Array<{
    id: number;
    title: string;
    description: string;
    impact: string;
    original: string;
    suggestion: string;
  }>;
  sessionId?: string; // 新增sessionId字段
}

// 问题列表数据字典 - 用于后续LLM服务节点
export const IssuesRegistry: Map<string, ResumeAnalysisResult['issues']> = new Map();

/**
 * 获取系统提示词
 */
const getSystemPrompt = async (mode: 'gentle' | 'mean' = 'mean'): Promise<string> => {
  const promptFile = mode === 'gentle' ? '/Prompts/gentle-resume-val.md' : '/Prompts/mean-resume-val.md';
  const response = await fetch(promptFile);
  if (!response.ok) {
    throw new Error('获取系统提示词失败');
  }
  const content = await response.text();

  try {
    // 先尝试直接解析JSON
    const promptData = JSON.parse(content);
    return promptData.content;
  } catch (error) {
    console.warn('直接JSON解析失败，开始清理内容:', error);

    try {
      // 方法1: 智能清理转义字符
      let cleanedContent = content
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');

      const promptData = JSON.parse(cleanedContent);
      return promptData.content;
    } catch (secondError) {
      console.warn('第一种清理方法失败，尝试第二种方法:', secondError);

      try {
        // 方法2: 手动构建有效的JSON字符串
        const contentMatch = content.match(/"content":\s*"([\s\S]*?)"\s*}/);
        if (contentMatch && contentMatch[1]) {
          let contentValue = contentMatch[1];

          contentValue = contentValue
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
            .replace(/\\n/g, '\n')
            .replace(/\\t/g, '\t');

          return contentValue;
        }

        throw new Error('无法提取content字段');
      } catch (thirdError) {
        console.warn('第二种清理方法失败，尝试第三种方法:', thirdError);

        try {
          const match = content.match(/"content":\s*"(.*?)(?="\s*})/s);
          if (match && match[1]) {
            return match[1]
              .replace(/\\"/g, '"')
              .replace(/\\\\/g, '\\')
              .replace(/\\n/g, '\n')
              .replace(/\\t/g, '\t');
          }

          throw new Error('无法通过正则表达式提取content');
        } catch (fourthError) {
          console.error('所有解析方法都失败了');
          console.error('原始内容前200字符:', content.substring(0, 200));
          console.error('最后错误:', fourthError);

          throw new Error('系统提示词文件格式错误，无法解析');
        }
      }
    }
  }
};

/**
 * 获取用户简历内容
 */
const getUserContent = async (): Promise<string> => {
  try {
    const response = await fetch('/Prompts/resume.md');
    if (!response.ok) {
      throw new Error('获取简历内容失败');
    }
    return await response.text();
  } catch (error) {
    console.error('获取简历内容失败:', error);
    throw error;
  }
};

/**
 * 解析LLM响应为结构化数据
 */
const parseAnalysisResult = (content: string): ResumeAnalysisResult => {
  if (!content || content.trim() === '') {
    throw new Error('LLM响应内容为空');
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    console.error('解析LLM响应失败:', error);
    console.error('响应内容:', content);
    throw new Error(`响应格式错误: ${error instanceof Error ? error.message : '未知错误'}`);
  }
};

/**
 * 模拟API延迟
 */
const simulateApiDelay = (ms: number = 2000) =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * 执行简历分析（返回原始LLM结果）
 * 主要用于Portal页面，保持与原有状态管理逻辑的兼容性
 */
export const analyzeResumeWithLLM = async (
  mode: 'gentle' | 'mean' = 'mean'
): Promise<ApiResponse<ResumeAnalysisResult>> => {
  try {
    // 获取系统提示词和用户简历内容
    const [systemPrompt, userContent] = await Promise.all([
      getSystemPrompt(mode),
      getUserContent()
    ]);

    // 调用LLM进行分析
    const llmRequest: LLMRequest = {
      systemPrompt,
      userQuery: userContent,
      temperature: 0.7,
      maxTokens: 5120
    };

    const llmResponse = await callLLM(llmRequest);

    if (!llmResponse.success) {
      throw new Error(llmResponse.error || 'LLM分析失败');
    }

    // 解析LLM响应
    const analysisResult = parseAnalysisResult(llmResponse.data!.content);

    // 将问题列表存储到数据字典中，使用分析会话ID作为键
    const sessionId = llmResponse.data!.sessionId;
    IssuesRegistry.set(sessionId, analysisResult.issues);

    // 添加sessionId到分析结果中
    analysisResult.sessionId = sessionId;

    return {
      success: true,
      data: analysisResult,
      message: '简历分析完成'
    };
  } catch (error) {
    console.error('简历分析失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '分析失败，请重试'
    };
  }
};

/**
 * 执行简历分析
 */
export const analyzeResume = async (
  files: UploadedFiles,
  mode: AnalysisMode
): Promise<ApiResponse<DashboardData>> => {
  try {
    // 获取系统提示词和用户简历内容
    const [systemPrompt, userContent] = await Promise.all([
      getSystemPrompt(mode === 'gentle' ? 'gentle' : 'mean'),
      getUserContent()
    ]);

    // 调用LLM进行分析
    const llmRequest: LLMRequest = {
      systemPrompt,
      userQuery: userContent,
      temperature: 0.7,
      maxTokens: 5120
    };

    const llmResponse = await callLLM(llmRequest);

    if (!llmResponse.success) {
      throw new Error(llmResponse.error || 'LLM分析失败');
    }

    // 解析LLM响应
    const analysisResult = parseAnalysisResult(llmResponse.data!.content);

    // 将问题列表存储到数据字典中，使用分析会话ID作为键
    const sessionId = llmResponse.data!.sessionId;
    IssuesRegistry.set(sessionId, analysisResult.issues);

    // 转换为DashboardData格式
    const dashboardData: DashboardData = {
      score: analysisResult.overall_score,
      mode,
      comment: `综合评分 ${analysisResult.overall_score}/100，发现 ${analysisResult.issues.length} 个需要优化的问题`,
      radarData: analysisResult.dimension_scores.map(dim => ({
        category: dim.dimension,
        value: dim.score,
        maxValue: 5
      })),
      weaknesses: analysisResult.issues.map(issue => ({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        impact: issue.impact,
        suggestion: issue.suggestion,
        original: issue.original
      })),
      resumeContent: userContent
    };

    return {
      success: true,
      data: dashboardData,
      message: '简历分析完成'
    };
  } catch (error) {
    console.error('简历分析失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '分析失败，请重试'
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
      : sampleWeaknessItems.filter(w => w.id.toString() === weaknessId);

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
