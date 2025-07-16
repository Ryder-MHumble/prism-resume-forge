// Dashboard页面相关的静态数据

// 高亮部分示例数据（实际应用中应该根据扫描结果动态生成）
export const HIGHLIGHTED_SECTIONS = {
  "1": {
    text: "[项目1] 描述中缺少可量化的..."
  },
  "2": {
    text: "精通XX为无效描述，需具体化"
  },
  "3": {
    text: "[项目2] 描述中缺少可量化的..."
  },
  "4": {
    text: "精通XX为无效描述，需具体化"
  },
};

// 智能分析总结内容
export const ANALYSIS_SUMMARY = {
  title: '智能分析总结',
  subtitle: '基于大模型算法的综合评估',

  analysisPoints: [
    {
      type: 'overview',
      label: '整体评估',
      content: '简历整体结构清晰，技术栈匹配度较高，但部分项目描述缺乏具体量化的成果展示。',
      color: 'primary',
      delay: 0
    },
    {
      type: 'finding',
      label: '关键发现',
      content: '技能部分存在过度使用"精通"等模糊词汇的情况，建议重点优化项目成果的数据化表达。',
      color: 'secondary',
      delay: 0.3
    },
    {
      type: 'suggestion',
      label: '优化建议',
      content: '增加具体的项目数据和成果指标，提升简历的说服力和竞争优势。',
      color: 'primary',
      delay: 0.6
    }
  ],

  tags: [
    { text: '结构清晰', color: 'primary' },
    { text: '待量化', color: 'orange' },
    { text: '可优化', color: 'secondary' }
  ]
};

// 能力光谱分析配置
export const RADAR_ANALYSIS = {
  title: '能力光谱分析',
  subtitle: '多维度技能评估与量化',
  description: '综合能力维度分析'
};

// 评级标准
export const SCORE_LEVELS = {
  EXCELLENT: { threshold: 80, label: '优秀', color: 'green' },
  GOOD: { threshold: 60, label: '良好', color: 'yellow' },
  NEEDS_IMPROVEMENT: { threshold: 0, label: '待提升', color: 'red' }
};

// Tab配置
export const TAB_CONFIG = [
  {
    id: 'weaknesses',
    label: '弱点扫描',
    color: 'primary'
  },
  {
    id: 'resources',
    label: '资源探测',
    color: 'secondary'
  }
];

// 推荐资源数据（静态测试数据 - 将来会被LLM替换）
export const RECOMMENDED_RESOURCES = {
  stats: {
    total: 12,
    matchRate: 95
  },
  description: '基于你的简历内容和行业趋势，为你精选以下学习资源',
  items: [
    { title: "前端性能优化最佳实践", tag: "热门", color: "from-red-500 to-pink-500" },
    { title: "React架构设计模式", tag: "推荐", color: "from-blue-500 to-cyan-500" },
    { title: "数据可视化高级技巧", tag: "进阶", color: "from-purple-500 to-indigo-500" },
    { title: "技术简历写作指南", tag: "必读", color: "from-green-500 to-emerald-500" }
  ]
};

// 页面文本内容
export const PAGE_TEXT = {
  header: {
    title: '评价仪表盘',
    subtitle: '深度挖掘你的潜力，重塑你的简历',
    backButton: '重新评估（剩余3次）'
  },

  resumeSection: {
    title: '当前简历内容',
    scrollToTopTitle: '返回顶部'
  },

  actionButtons: {
    optimize: '进入炼金优化室',
    expandCollapse: {
      expand: '展开',
      collapse: '收起'
    }
  },

  scoreDisplay: {
    title: '综合评分',
    outperformText: (percentage: number) => `超越 ${percentage}% 的候选人`
  }
};
