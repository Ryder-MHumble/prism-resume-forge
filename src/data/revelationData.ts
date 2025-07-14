// Revelation页面相关的静态数据

// 庆祝弹窗配置
export const CELEBRATION_CONFIG = {
  countdown: 5,
  particleCount: 50,
  title: '🎉 恭喜！优化完成！',
  subtitle: '您的简历已成功优化升级',

  achievementData: {
    completedProjects: '5+',
    competitiveness: '显著提升'
  },

  importantNotice: {
    title: '⚠️ 请注意',
    content: '这份蓝图的每一句话，都源自你在"能力炼金屋"中的真实输入。请确保你能在面试中自信地为每一个字辩护。',
    highlight: '✨ 真正的强大，源于真实的你'
  },

  buttons: {
    later: '稍后查看',
    view: '立即查看结果'
  }
};

// 页面文本内容
export const PAGE_TEXT = {
  header: {
    title: '恭喜！你已解锁专属优化简历',
    backButton: '返回炼金屋',
    homeButton: '返回首页'
  },

  actions: {
    export: '导出',
    share: '分享'
  },

  scoreComparison: {
    title: '评分对比',
    before: '优化前',
    after: '优化后',
    improvement: (score: number) => `提升 +${score} 分`,
    description: '显著提升简历竞争力'
  },

  completedImprovements: {
    title: '完成的改进项目'
  },

  nextSteps: {
    title: '下一步建议',
    suggestions: [
      "使用优化后的简历投递目标职位",
      "准备面试时重点练习新增的项目描述",
      "定期更新简历内容保持最新状态"
    ]
  }
};

// 文件导出配置
export const EXPORT_CONFIG = {
  defaultFileName: '优化简历',
  fileExtension: '.md',
  mimeType: 'text/markdown; charset=utf-8'
};
