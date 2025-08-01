export const SUPPORTED_FILE_TYPES = ['application/pdf'];
export const SUPPORTED_FILE_EXTENSIONS = ['.pdf'];

export const SERVICE_TYPES = [
  {
    type: 'llm' as const,
    label: 'LLM简历分析',
    desc: '使用AI模型分析简历',
    color: 'text-blue-500'
  },
  {
    type: 'custom' as const,
    label: '自定义测试',
    desc: '自定义提示词和内容',
    color: 'text-purple-500'
  },
  {
    type: 'crucible' as const,
    label: '能力炼金室',
    desc: '针对问题的对话式优化',
    color: 'text-orange-500'
  },
  {
    type: 'pdf' as const,
    label: 'PDF文本提取',
    desc: '从PDF文件提取文本',
    color: 'text-green-500'
  },
];

export const EVALUATION_MODES = {
  gentle: {
    label: '温柔模式',
    description: '鼓励式评估',
    color: 'green'
  },
  mean: {
    label: '严苛模式',
    description: '严格式评估',
    color: 'red'
  }
} as const;
