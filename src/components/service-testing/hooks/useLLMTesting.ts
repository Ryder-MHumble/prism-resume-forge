import { useState } from 'react';
import { analyzeResumeWithLLM } from '@/services/analysisService';
import { callLLM, LLMRequest } from '@/services/llmService';
import { LLMTestResult } from '@/types';
import { EvaluationMode } from '../types';

export const useLLMTesting = (updateActiveRequestsCount: () => void) => {
  const [llmTestResults, setLlmTestResults] = useState<LLMTestResult[]>([]);
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: Set<string>}>({});

  // 简历分析测试
  const testResumeAnalysis = async (evaluationMode: EvaluationMode) => {
    const requestId = `test_${Date.now()}`;
    const startTime = Date.now();

    const testResult: LLMTestResult = {
      requestId,
      timestamp: startTime,
      status: 'pending',
      systemPrompt: `${evaluationMode === 'gentle' ? '温柔模式' : '严苛模式'}系统提示词`,
      inputContent: '默认简历内容'
    };
    setLlmTestResults(prev => [testResult, ...prev.slice(0, 9)]);
    updateActiveRequestsCount();

    try {
      const result = await analyzeResumeWithLLM(evaluationMode);
      const duration = Date.now() - startTime;

      setLlmTestResults(prev =>
        prev.map(test =>
          test.requestId === requestId
            ? {
                ...test,
                status: result.success ? 'success' : 'error',
                response: result.success ? JSON.stringify(result.data, null, 2) : undefined,
                error: result.success ? undefined : result.error,
                usage: (result as any).usage,
                duration
              }
            : test
        )
      );
    } catch (error) {
      setLlmTestResults(prev =>
        prev.map(test =>
          test.requestId === requestId
            ? {
                ...test,
                status: 'error',
                error: error instanceof Error ? error.message : '未知错误',
                duration: Date.now() - startTime
              }
            : test
        )
      );
    } finally {
      updateActiveRequestsCount();
    }
  };

  // 自定义内容分析测试
  const testCustomAnalysis = async (customPrompt: string, customContent: string) => {
    if (!customPrompt.trim() && !customContent.trim()) {
      alert('请输入自定义提示词或内容');
      return;
    }

    const requestId = `custom_${Date.now()}`;
    const startTime = Date.now();

    const systemPrompt = customPrompt.trim() || '你是一个专业的简历分析助手，请分析用户提供的内容。';
    const userQuery = customContent.trim() || '请分析这份简历内容。';

    const testResult: LLMTestResult = {
      requestId,
      timestamp: startTime,
      status: 'pending',
      prompt: customPrompt || '使用默认系统提示词',
      systemPrompt,
      inputContent: userQuery
    };
    setLlmTestResults(prev => [testResult, ...prev.slice(0, 9)]);
    updateActiveRequestsCount();

    try {
      const llmRequest: LLMRequest = {
        systemPrompt,
        userQuery,
        temperature: 0.7,
        maxTokens: 5120
      };

      const result = await callLLM(llmRequest);
      const duration = Date.now() - startTime;

      setLlmTestResults(prev =>
        prev.map(test =>
          test.requestId === requestId
            ? {
                ...test,
                status: result.success ? 'success' : 'error',
                response: result.success ? result.data?.content : undefined,
                error: result.success ? undefined : result.error,
                usage: result.success ? result.data?.usage : undefined,
                duration
              }
            : test
        )
      );
    } catch (error) {
      setLlmTestResults(prev =>
        prev.map(test =>
          test.requestId === requestId
            ? {
                ...test,
                status: 'error',
                error: error instanceof Error ? error.message : '未知错误',
                duration: Date.now() - startTime
              }
            : test
        )
      );
    } finally {
      updateActiveRequestsCount();
    }
  };

  // 清除测试结果
  const clearTestResults = () => {
    setLlmTestResults([]);
  };

  // 切换结果展开/收缩
  const toggleResultExpansion = (id: string) => {
    setExpandedResultId(expandedResultId === id ? null : id);
  };

  // 切换模块展开/收缩
  const toggleSection = (resultId: string, sectionType: string) => {
    setExpandedSections(prev => {
      const newExpanded = { ...prev };
      if (!newExpanded[resultId]) {
        newExpanded[resultId] = new Set();
      }

      if (newExpanded[resultId].has(sectionType)) {
        newExpanded[resultId].delete(sectionType);
      } else {
        newExpanded[resultId].add(sectionType);
      }

      return newExpanded;
    });
  };

  return {
    llmTestResults,
    expandedResultId,
    expandedSections,
    testResumeAnalysis,
    testCustomAnalysis,
    clearTestResults,
    toggleResultExpansion,
    toggleSection
  };
};
