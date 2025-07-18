import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  AppState,
  AnalysisMode,
  UploadedFiles,
  DashboardData,
  WeaknessItem,
  ImprovementItem,
  RevelationData,
  LLMAnalysisResult
} from '@/types';

// 应用状态接口
interface AppContextState {
  // 当前页面状态
  currentPage: AppState;

  // 上传的文件
  uploadedFiles: UploadedFiles;

  // 分析模式
  analysisMode: AnalysisMode;

  // 仪表盘数据
  dashboardData: DashboardData | null;

  // 当前处理的弱点ID
  currentWeaknessId: string | null;

  // 改进项目列表
  improvements: ImprovementItem[];

  // 当前改进步骤
  currentStep: number;

  // 最终结果数据
  revelationData: RevelationData | null;

  // 加载状态
  isLoading: boolean;

  // 错误信息
  error: string | null;

  // LLM分析结果
  llmAnalysisResult: LLMAnalysisResult | null;
}

// Action类型定义
type AppAction =
  | { type: 'SET_CURRENT_PAGE'; payload: AppState }
  | { type: 'SET_UPLOADED_FILES'; payload: UploadedFiles }
  | { type: 'SET_ANALYSIS_MODE'; payload: AnalysisMode }
  | { type: 'SET_DASHBOARD_DATA'; payload: DashboardData }
  | { type: 'SET_CURRENT_WEAKNESS_ID'; payload: string | null }
  | { type: 'SET_IMPROVEMENTS'; payload: ImprovementItem[] }
  | { type: 'UPDATE_IMPROVEMENT'; payload: { index: number; improvement: ImprovementItem } }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_REVELATION_DATA'; payload: RevelationData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LLM_ANALYSIS_RESULT'; payload: LLMAnalysisResult | null }
  | { type: 'RESET_STATE' };

// 初始状态
const initialState: AppContextState = {
  currentPage: 'portal',
  uploadedFiles: {},
  analysisMode: 'hardcore',
  dashboardData: null,
  currentWeaknessId: null,
  improvements: [],
  currentStep: 0,
  revelationData: null,
  isLoading: false,
  error: null,
  llmAnalysisResult: null,
};

// Reducer函数
function appReducer(state: AppContextState, action: AppAction): AppContextState {
  switch (action.type) {
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };

    case 'SET_UPLOADED_FILES':
      return { ...state, uploadedFiles: action.payload };

    case 'SET_ANALYSIS_MODE':
      return { ...state, analysisMode: action.payload };

    case 'SET_DASHBOARD_DATA':
      return { ...state, dashboardData: action.payload };

    case 'SET_CURRENT_WEAKNESS_ID':
      return { ...state, currentWeaknessId: action.payload };

    case 'SET_IMPROVEMENTS':
      return { ...state, improvements: action.payload };

    case 'UPDATE_IMPROVEMENT':
      const newImprovements = [...state.improvements];
      newImprovements[action.payload.index] = action.payload.improvement;
      return { ...state, improvements: newImprovements };

    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };

    case 'SET_REVELATION_DATA':
      return { ...state, revelationData: action.payload };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_LLM_ANALYSIS_RESULT':
      return { ...state, llmAnalysisResult: action.payload };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// Context接口
interface AppContextType {
  state: AppContextState;
  dispatch: React.Dispatch<AppAction>;

  // 便捷方法
  navigateToPage: (page: AppState) => void;
  setFiles: (files: UploadedFiles) => void;
  setMode: (mode: AnalysisMode) => void;
  setDashboardData: (data: DashboardData) => void;
  startOptimization: (weaknessId: string, weaknesses: WeaknessItem[]) => void;
  updateImprovement: (index: number, improvement: ImprovementItem) => void;
  completeOptimization: (revelationData: RevelationData) => void;
  resetApp: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLLMAnalysisResult: (result: LLMAnalysisResult | null) => void;
}

// 创建Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider组件
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 便捷方法实现
  const navigateToPage = useCallback((page: AppState) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  }, []);

  const setFiles = useCallback((files: UploadedFiles) => {
    dispatch({ type: 'SET_UPLOADED_FILES', payload: files });
  }, []);

  const setMode = useCallback((mode: AnalysisMode) => {
    dispatch({ type: 'SET_ANALYSIS_MODE', payload: mode });
  }, []);

  const setDashboardData = useCallback((data: DashboardData) => {
    dispatch({ type: 'SET_DASHBOARD_DATA', payload: data });
  }, []);

  const startOptimization = useCallback((weaknessId: string, weaknesses: WeaknessItem[]) => {
    dispatch({ type: 'SET_CURRENT_WEAKNESS_ID', payload: weaknessId });

    // 根据weaknessId生成改进项目
    const improvements: ImprovementItem[] = weaknesses.map(weakness => ({
      id: weakness.id.toString(),
      original: weakness.original,
      improved: '',
      completed: false,
    }));

    dispatch({ type: 'SET_IMPROVEMENTS', payload: improvements });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 0 });
  }, []);

  const updateImprovement = useCallback((index: number, improvement: ImprovementItem) => {
    dispatch({ type: 'UPDATE_IMPROVEMENT', payload: { index, improvement } });
  }, []);

  const completeOptimization = useCallback((revelationData: RevelationData) => {
    dispatch({ type: 'SET_REVELATION_DATA', payload: revelationData });
    dispatch({ type: 'SET_CURRENT_PAGE', payload: 'revelation' });
  }, []);

  const resetApp = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setLLMAnalysisResult = useCallback((result: LLMAnalysisResult | null) => {
    dispatch({ type: 'SET_LLM_ANALYSIS_RESULT', payload: result });
  }, []);

  const contextValue: AppContextType = {
    state,
    dispatch,
    navigateToPage,
    setFiles,
    setMode,
    setDashboardData,
    startOptimization,
    updateImprovement,
    completeOptimization,
    resetApp,
    setLoading,
    setError,
    setLLMAnalysisResult,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
