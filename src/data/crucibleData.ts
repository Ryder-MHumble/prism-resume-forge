// Crucible页面相关的静态数据

// 页面文本内容
export const PAGE_TEXT = {
  header: {
    title: '能力炼金屋',
    backButton: '返回仪表盘',
    progressTemplate: (current: number, total: number) => `优化 ${current} / ${total}`
  },

  improvementForm: {
    originalLabel: '原始内容:',
    suggestionLabel: '改进建议:',
    yourImprovementLabel: '你的改进:',
    placeholder: '请在这里输入改进后的内容...'
  },

  navigation: {
    previous: '上一项',
    back: '返回',
    saveAndContinue: '保存并继续',
    complete: '完成优化'
  },

  completion: {
    title: '全部优化完成!',
    subtitle: '您已成功完成所有改进项目，点击下方按钮查看优化效果。',
    viewResults: '查看优化结果'
  }
};
