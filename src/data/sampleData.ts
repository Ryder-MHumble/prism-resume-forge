import { DashboardData, WeaknessItem, AnalysisMode } from '@/types';
import { resumeMarkdown } from './resumeExample';

// 示例仪表盘数据
export const sampleDashboardData: DashboardData = {
  score: 75,
  mode: 'hardcore',
  comment: "简历整体结构清晰，但部分项目描述缺乏具体量化的成果",
  radarData: [
    { category: "技术能力", value: 85, maxValue: 100 },
    { category: "项目经验", value: 70, maxValue: 100 },
    { category: "表达能力", value: 65, maxValue: 100 },
    { category: "团队合作", value: 80, maxValue: 100 },
    { category: "专业知识", value: 75, maxValue: 100 },
    { category: "项目价值", value: 70, maxValue: 100 }
  ],
  weaknesses: [
    {
      id: "project1",
      title: "[项目1] 描述中缺少可量化的成就",
      description: "项目描述应包含具体的数字和成果",
      severity: 'medium' as const,
      category: "表达能力",
      impact: "中等",
      suggestion: "添加具体的数据点，例如提升了多少效率，节省了多少成本等",
      original: "开发了一个复杂的数据可视化平台，展示企业的关键性能指标",
      lineStart: 45,
      lineEnd: 47
    },
    {
      id: "skill1",
      title: "技能描述过于笼统",
      description: "技能描述应该包含具体程度和应用场景",
      severity: 'high' as const,
      category: "技术能力",
      impact: "高",
      suggestion: "具体说明技能熟练程度和应用场景，避免简单列举",
      original: "编程语言: JavaScript (ES6+), TypeScript, HTML5, CSS3",
      lineStart: 35,
      lineEnd: 36
    }
  ],
  resumeContent: resumeMarkdown
};

// 炼金室示例数据
export const sampleWeaknessItems: WeaknessItem[] = [
  {
    id: "project1",
    title: "[项目1] 描述中缺少可量化的成就",
    description: "项目描述应包含具体的数字和成果",
    severity: 'medium' as const,
    category: "项目经验",
    impact: "影响评分 -8分",
    original: "开发了一个复杂的数据可视化平台，展示企业的关键性能指标",
    suggestion: "添加具体的数据点，例如提升了多少效率，节省了多少成本等",
    lineStart: 45,
    lineEnd: 47
  },
  {
    id: "skill1",
    title: "技能描述过于笼统",
    description: "技能描述应该包含具体程度和应用场景",
    severity: 'high' as const,
    category: "技术能力",
    impact: "影响评分 -12分",
    original: "编程语言: JavaScript (ES6+), TypeScript, HTML5, CSS3",
    suggestion: "具体说明技能熟练程度和应用场景，避免简单列举",
    lineStart: 35,
    lineEnd: 36
  },
  {
    id: "project2",
    title: "[项目2] 缺少具体技术细节",
    description: "技术实现细节不够具体",
    severity: 'low' as const,
    category: "项目经验",
    impact: "影响评分 -5分",
    original: "参与电商平台的移动端重构项目，采用React Native技术栈",
    suggestion: "详细说明你的技术贡献和解决的具体问题",
    lineStart: 52,
    lineEnd: 54
  }
];

// 展示页示例数据
export const sampleRevelationData = {
  originalScore: 75,
  newScore: 95,
  optimizedResume: `# Ryder Sun - 高级软件工程师

## 个人信息
- 邮箱: xxx@gmail.com
- 电话: +86 138-0000-0000
- 深度挖掘你的潜力，重塑你的简历

## 专业技能
### 编程语言
- JavaScript/TypeScript: 5年开发经验，熟练掌握ES6+特性
- Python: 3年经验，专长于数据处理和机器学习
- Java: 4年企业级开发经验

### 框架与工具
- React.js: 构建过10+个大型SPA应用
- Node.js: 负责过多个微服务架构项目
- Docker: 容器化部署经验，提升部署效率60%

## 项目经验
### 项目A - 企业级CRM系统 (2023.01 - 2023.08)
**角色**: 前端技术负责人
**成果**:
- 带领5人团队完成系统重构，性能提升40%
- 日活用户从500增长至2000+
- 用户满意度提升至4.8/5.0

### 项目B - 数据可视化平台 (2022.06 - 2022.12)
**技术栈**: React + D3.js + Python
**核心贡献**:
- 独立设计并实现交互式图表组件
- 处理TB级数据渲染，响应时间控制在200ms内
- 为公司节省数据分析成本30万/年

## 工作经历
### ABC科技有限公司 - 高级前端工程师 (2021.03 至今)
- 负责公司核心产品前端架构设计与开发
- 建立前端代码规范，团队开发效率提升25%
- 指导3名初级工程师，获得团队"最佳导师"称号

## 教育背景
### 重点大学 - 计算机科学与技术 (2017.09 - 2021.06)
- GPA: 3.8/4.0
- 核心课程: 数据结构、算法设计、软件工程
- 获得国家励志奖学金`,
  completedImprovements: [
    '修改项1: 量化了项目成果数据',
    '修改项2: 具体化了技能描述',
    '修改项3: 补充了技术难点说明',
    '修改项4: 规范了表达方式'
  ]
};
