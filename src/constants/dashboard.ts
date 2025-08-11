// Dashboard页面常量配置

// 组件UI配置
export const DASHBOARD_UI = {
  layout: {
    leftColumnSpan: 6,
    rightColumnSpan: 4,
    headerHeight: '4rem',
    contentPadding: '1.5rem'
  },
  scrollThreshold: 200,
  animations: {
    fadeInDuration: 700,
    slideInDuration: 500,
    slideInDelay: {
      left: 100,
      right: 200
    },
    particleCount: 12,
    pulseAnimationDuration: '2s'
  }
} as const;

// 文案配置
export const DASHBOARD_TEXT = {
  header: {
    title: '评价仪表盘',
    subtitle: '深度挖掘你的潜力，重塑你的简历',
    backButton: '重新评估'
  },
  resumeSection: {
    title: '当前简历内容',
    scrollToTopTitle: '返回顶部'
  },
  actionButtons: {
    optimize: '进入能力炼金室',
    expandCollapse: {
      expand: '展开',
      collapse: '收起'
    }
  },
  scoreDisplay: {
    title: '综合评分',
    outperformText: (percentage: number) => `超越 ${percentage}% 的候选人`
  },
  analysisSummary: {
    title: '智能分析总结',
    subtitle: '基于大模型算法的综合评估'
  },
  radarAnalysis: {
    title: '能力光谱',
    subtitle: '能力光谱 • 多维度量化分析',
    description: '综合能力维度分析'
  },
  weaknessDetails: {
    detailedDescription: '详细描述',
    impactLevel: '影响程度',
    optimizationSuggestion: '优化建议',
    originalContent: '原始内容',
    optimizeNow: '立即优化'
  }
} as const;

// 评级系统配置
export const SCORE_SYSTEM = {
  levels: {
    EXCELLENT: {
      threshold: 80,
      label: '优秀',
      color: 'green',
      gradient: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/50',
      textColor: 'text-green-400',
      shadowColor: 'shadow-green-500/20'
    },
    GOOD: {
      threshold: 60,
      label: '良好',
      color: 'yellow',
      gradient: 'from-yellow-500/20 to-orange-500/20',
      borderColor: 'border-yellow-500/50',
      textColor: 'text-yellow-400',
      shadowColor: 'shadow-yellow-500/20'
    },
    NEEDS_IMPROVEMENT: {
      threshold: 0,
      label: '待提升',
      color: 'red',
      gradient: 'from-red-500/20 to-pink-500/20',
      borderColor: 'border-red-500/50',
      textColor: 'text-red-400',
      shadowColor: 'shadow-red-500/20'
    }
  },
  getScoreLevel: (score: number) => {
    if (score >= 80) return SCORE_SYSTEM.levels.EXCELLENT;
    if (score >= 60) return SCORE_SYSTEM.levels.GOOD;
    return SCORE_SYSTEM.levels.NEEDS_IMPROVEMENT;
  }
} as const;

// 分析标签配置
export const ANALYSIS_TAGS = {
  structureClear: {
    text: '结构清晰',
    color: 'primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
    textColor: 'text-primary',
    dotColor: 'bg-primary'
  },
  needsQuantification: {
    text: '待量化',
    color: 'orange',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-600',
    dotColor: 'bg-orange-500'
  },
  canOptimize: {
    text: '可优化',
    color: 'secondary',
    bgColor: 'bg-secondary/10',
    borderColor: 'border-secondary/20',
    textColor: 'text-secondary',
    dotColor: 'bg-secondary'
  }
} as const;

// 粒子动画配置
export const PARTICLE_CONFIG = {
  count: 12,
  baseDelay: 0.3,
  baseDuration: 2,
  randomRange: 2,
  opacity: 0.4,
  size: {
    width: 1,
    height: 1
  },
  position: {
    minX: 10,
    maxX: 90,
    minY: 10,
    maxY: 90
  },
  colors: {
    gradient: 'from-cyan-400 to-purple-400'
  }
} as const;
// 雷达图装饰配置
export const RADAR_DECORATIONS = {
  rings: [
    { inset: 0, opacity: 'border-primary/20', delay: '0s' },
    { inset: 2, opacity: 'border-secondary/20', delay: '0.5s' },
    { inset: 4, opacity: 'border-primary/20', delay: '1s' }
  ],
  centerCore: {
    size: 6,
    gradient: 'from-cyan-400 to-purple-600',
    blurSize: 6
  }
} as const;

// 按钮样式配置
export const BUTTON_STYLES = {
  expandCollapse: 'px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-primary border border-primary/20 hover:border-primary/40 rounded-lg transition-colors hover:bg-primary/5',
  cyberControl: 'group relative px-4 py-2 text-xs font-medium font-mono uppercase tracking-wider text-muted-foreground hover:text-primary border border-primary/30 hover:border-primary/60 rounded-lg transition-all duration-300 hover:bg-primary/10 backdrop-blur-sm',
  scrollToTop: 'group absolute top-4 right-4 z-20 w-11 h-11 rounded-xl shadow-lg transition-all duration-500 ease-out transform bg-gradient-to-br from-primary/90 to-secondary/90 hover:from-primary hover:to-secondary text-white/90 hover:text-white backdrop-blur-sm hover:shadow-xl hover:shadow-primary/25 hover:scale-110 active:scale-95',
  optimizeMain: 'w-full'
} as const;

// 卡片样式配置
export const CARD_STYLES = {
  base: 'relative border-2 border-primary/30 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-background/90 to-secondary/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-primary/50 backdrop-blur-md',
  neonBorder: 'absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 opacity-50 animate-pulse',
  topDecorationLine: 'absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent',
  weaknessCard: 'relative border-2 border-primary/30 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-background/90 to-secondary/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-primary/50 backdrop-blur-md'
} as const;
