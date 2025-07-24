// 基础类型定义
export type AnalysisMode = 'hardcore' | 'supportive' | 'gentle';

// 文件上传相关类型
export interface UploadedFiles {
  resume?: File;
  jd?: File;
}

// 雷达图数据类型
export interface RadarData {
  category: string;
  value: number;
  maxValue: number;
}

// 弱点分析类型
export interface WeaknessItem {
  id: number;
  title: string;
  description: string;
  impact: string;
  suggestion: string;
  original: string;
}

// 改进项目类型
export interface ImprovementItem {
  id: string;
  original: string;
  improved: string;
  completed: boolean;
}

// 仪表盘数据类型
export interface DashboardData {
  score: number;
  mode: AnalysisMode;
  comment: string;
  radarData: RadarData[];
  weaknesses: WeaknessItem[];
  resumeContent: string;
}

// 优化结果类型
export interface RevelationData {
  originalScore: number;
  newScore: number;
  optimizedResume: string;
  completedImprovements: string[];
}

// 应用状态类型
export type AppState = 'portal' | 'dashboard' | 'crucible' | 'revelation';

// 主题类型
export type Theme = 'dark' | 'light';

// 路由参数类型
export interface RouteParams {
  weaknessId?: string;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分析请求类型
export interface AnalysisRequest {
  files: UploadedFiles;
  mode: AnalysisMode;
}

// LLM简历分析结果类型
export interface LLMAnalysisResult {
  summarization: string;
  overall_score: number;
  dimension_scores: Array<{
    dimension: string;
    score: number;
  }>;
  issues: Array<{
    id: number;
    title: string;
    description: string;
    impact: string;
    original: string;
    suggestion: string;
  }>;
}

// 分析状态类型
export interface AnalysisState {
  isAnalyzing: boolean;
  analysisResult: LLMAnalysisResult | null;
  error: string | null;
}

// 组件Props基础类型
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// 导航相关类型
export interface NavigationHandlers {
  onBack: () => void;
  onNext?: () => void;
  onComplete?: () => void;
}

// 文件处理相关类型
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  type?: 'resume' | 'jd';
}

// 拖拽状态类型
export interface DragState {
  resume: boolean;
  jd: boolean;
}

// 动画配置类型
export interface AnimationConfig {
  intensity: 'low' | 'medium' | 'high';
  duration?: number;
  delay?: number;
}

// 图表配置类型
export interface ChartConfig {
  size?: number;
  colors?: string[];
  showLabels?: boolean;
}

// 模态框状态类型
export interface ModalState {
  isOpen: boolean;
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  content?: string;
}

// LLM服务测试相关类型
export interface LLMTestResult {
  requestId: string;
  timestamp: number;
  status: 'pending' | 'success' | 'error' | 'cancelled';
  prompt?: string;
  response?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  duration?: number;
  systemPrompt?: string;
  inputContent?: string;
}

// 测试服务类型
export type TestServiceType = 'pdf' | 'llm' | 'analysis' | 'custom';

// 测试配置类型
export interface TestConfig {
  serviceType: TestServiceType;
  maxConcurrent?: number;
  retryCount?: number;
  timeout?: number;
}
