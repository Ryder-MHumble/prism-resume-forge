export const SUPPORTED_FILE_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
export const SUPPORTED_FILE_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];

export const SERVICE_TYPES = [
  {
    type: 'llm' as const,
    label: 'LLM简历分析',
    desc: '使用AI模型分析简历',
    color: 'text-blue-500',
    icon: '🤖'
  },
  {
    type: 'custom' as const,
    label: '自定义测试',
    desc: '自定义提示词和内容',
    color: 'text-purple-500',
    icon: '⚙️'
  },
  {
    type: 'pdf' as const,
    label: 'PDF文本提取',
    desc: '从PDF文件提取文本',
    color: 'text-green-500',
    icon: '📄'
  },
  {
    type: 'image' as const,
    label: '图片OCR提取',
    desc: '从图片中提取文字',
    color: 'text-indigo-500',
    icon: '🖼️'
  },
  {
    type: 'crucible' as const,
    label: '能力炼金室',
    desc: '针对问题的对话式优化',
    color: 'text-orange-500',
    icon: '🔥'
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

export const EXTRACTION_METHODS = {
  pdfjs: {
    label: 'PDF.js (默认)',
    description: '使用PDF.js库提取文本',
    color: 'blue'
  },
  'react-pdftotext': {
    label: 'React-PDFToText',
    description: '使用react-pdftotext库提取文本',
    color: 'green'
  },
  tesseract: {
    label: 'Tesseract.js',
    description: '使用OCR技术提取图片文字',
    color: 'purple'
  }
} as const;
