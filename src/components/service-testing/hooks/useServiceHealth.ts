import { useState, useEffect } from 'react';
import { healthCheck, getActiveRequestsCount } from '@/services/llmService';
import { ServiceHealthStatus } from '../types';

export const useServiceHealth = () => {
  const [llmServiceHealth, setLlmServiceHealth] = useState<ServiceHealthStatus>('unknown');
  const [activeRequestsCount, setActiveRequestsCount] = useState(0);

  // 检查LLM健康状态
  const checkLlmHealth = async () => {
    try {
      const result = await healthCheck();
      setLlmServiceHealth(result.success ? 'healthy' : 'error');
    } catch (error) {
      setLlmServiceHealth('error');
    }
  };

  // 更新活跃请求数量
  const updateActiveRequestsCount = () => {
    setActiveRequestsCount(getActiveRequestsCount());
  };

  useEffect(() => {
    checkLlmHealth();
    const interval = setInterval(updateActiveRequestsCount, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    llmServiceHealth,
    activeRequestsCount,
    checkLlmHealth,
    updateActiveRequestsCount
  };
};
