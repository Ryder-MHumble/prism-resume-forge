// Portal页面常量配置
import prismLogo from '@/assets/极简logo.jpg';
import saiboLogo from '@/assets/赛博logo.jpg';
import prismBgLogo from '@/assets/Prism-Logo.png';

// Logo配置
export const PORTAL_ASSETS = {
  prismLogo,
  saiboLogo,
  prismBgLogo
} as const;

// 文案配置
export const PORTAL_TEXT = {
  brand: {
    name: '棱镜 Prism',
    subtitle: '个人价值光谱分析仪',
    tagline: '在被AI筛选之前，先用棱镜看清自己'
  },
  status: {
    engineOnline: '光谱引擎在线',
    encryptedTransfer: '价值加密传输'
  },
  upload: {
    resumeTitle: '简历文件 (必需)',
    jdTitle: '目标职位JD (可选)',
    resumePlaceholder: '上传你的简历',
    jdPlaceholder: '上传目标职位描述',
    resumeFormats: '支持 PDF、Word 格式 • 解析你的价值光谱',
    jdFormats: '支持 PDF、Word、TXT、PNG • 让价值折射更精准'
  },
  steps: {
    upload: {
      title: '上传材料',
      subtitle: '解析你的价值光谱'
    },
    analysis: {
      title: '分析配置',
      subtitle: '选择你的分析模式'
    }
  },
  hero: {
    title: ['折射你的', '全部才能'],
    subtitle: '面对AI招聘官？',
    crossed: '别让平庸的简历',
    ending: '，埋没你发光的实力',
    description: '你的职业生涯，需要一次 光谱分析'
  },
  copyright: '© 2025 Prism AI • Neural Analysis Engine'
} as const;

// 文件类型验证配置
export const FILE_VALIDATION = {
  resume: {
    accept: '.pdf,.doc,.docx',
    types: ['pdf', 'word', 'document'],
    extensions: ['.pdf', '.doc', '.docx']
  },
  jd: {
    accept: '.pdf,.doc,.docx,.txt,.png',
    types: ['pdf', 'word', 'document', 'text', 'image'],
    extensions: ['.pdf', '.doc', '.docx', '.txt', '.png']
  }
} as const;

// 动画配置
export const ANIMATION_CONFIG = {
  panelSwitchDelay: 800,
  scanAnimationDuration: '2s',
  particleCount: {
    resume: 6,
    jd: 4,
    hero: {
      primary: 8,
      secondary: 6
    }
  }
} as const;
