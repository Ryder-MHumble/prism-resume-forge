import { DashboardData, WeaknessItem, RevelationData } from '@/types';

// 示例仪表盘数据
export const sampleDashboardData: DashboardData = {
  score: 75,
  mode: 'hardcore',
  comment: '简历整体质量不错，但仍有优化空间',
  radarData: [
    { category: '技术能力', value: 4, maxValue: 5 },
    { category: '项目经验', value: 3, maxValue: 5 },
    { category: '表达能力', value: 4, maxValue: 5 },
    { category: '匹配度', value: 3, maxValue: 5 }
  ],
  weaknesses: [
    {
      id: 1,
      title: '项目描述缺乏量化数据',
      description: '项目成果描述过于模糊，缺少具体的数据支撑',
      impact: '高',
      suggestion: '添加具体的性能提升数据、用户量等指标',
      original: '优化了系统性能'
    },
    {
      id: 2,
      title: '技能描述过于主观',
      description: '使用"精通"、"熟练"等主观词汇，缺乏客观证据',
      impact: '中',
      suggestion: '用具体的项目实践和成果来证明技能水平',
      original: '精通React开发'
    }
  ],
  resumeContent: '这里是示例简历内容...'
};

// 示例弱点数据
export const sampleWeaknessItems: WeaknessItem[] = [
  {
    id: 1,
    title: '项目描述缺乏量化数据',
    description: '项目成果描述过于模糊，缺少具体的数据支撑',
    impact: '高',
    suggestion: '添加具体的性能提升数据、用户量等指标',
    original: '优化了系统性能'
  },
  {
    id: 2,
    title: '技能描述过于主观',
    description: '使用"精通"、"熟练"等主观词汇，缺乏客观证据',
    impact: '中',
    suggestion: '用具体的项目实践和成果来证明技能水平',
    original: '精通React开发'
  }
];

// 示例优化结果数据
export const sampleRevelationData: RevelationData = {
  originalScore: 75,
  newScore: 85,
  optimizedResume: '这里是优化后的简历内容...',
  completedImprovements: [
    '添加了具体的性能优化数据',
    '用项目经验替换了主观技能描述'
  ]
};
