# 项目架构文档

## 架构概览

本项目采用现代化的React架构设计，注重模块化、可维护性和可扩展性。

## 目录结构

```
src/
├── components/           # 组件库
│   ├── charts/          # 图表组件
│   ├── common/          # 通用组件
│   ├── layout/          # 布局组件
│   ├── prism/           # 业务特定组件
│   ├── resume/          # 简历相关组件
│   └── ui/              # 基础UI组件
├── contexts/            # React Context
├── data/               # 静态数据和示例数据
├── hooks/              # 自定义Hooks
├── pages/              # 页面组件
├── services/           # 服务层（API调用、业务逻辑）
├── store/              # 状态管理
├── types/              # TypeScript类型定义
├── utils/              # 工具函数
└── assets/             # 静态资源
```

## 核心架构原则

### 1. 关注点分离 (Separation of Concerns)
- **UI组件**: 只负责渲染和用户交互
- **服务层**: 处理业务逻辑和API调用
- **状态管理**: 集中管理应用状态
- **工具函数**: 提供通用功能

### 2. 模块化设计
- 每个模块都有明确的职责边界
- 组件可以独立开发和测试
- 易于重构和扩展

### 3. 类型安全
- 使用TypeScript确保类型安全
- 统一的类型定义系统
- 减少运行时错误

## 状态管理架构

### AppContext (src/store/AppContext.tsx)
使用React Context + useReducer模式实现状态管理：

```typescript
// 中心化状态管理
interface AppContextState {
  currentPage: AppState;
  uploadedFiles: UploadedFiles;
  analysisMode: AnalysisMode;
  dashboardData: DashboardData | null;
  // ... 其他状态
}

// Action-based状态更新
type AppAction =
  | { type: 'SET_CURRENT_PAGE'; payload: AppState }
  | { type: 'SET_UPLOADED_FILES'; payload: UploadedFiles }
  // ... 其他actions
```

**优势:**
- 集中化的状态管理
- 可预测的状态更新
- 易于调试和测试
- 类型安全的状态操作

## 服务层架构

### 文件服务 (src/services/fileService.ts)
处理文件相关的业务逻辑：
- 文件验证
- 拖拽处理
- 文件信息获取

### 分析服务 (src/services/analysisService.ts)
处理简历分析相关的业务逻辑：
- 简历分析
- 弱点检测
- 优化建议生成

**优势:**
- 业务逻辑与UI分离
- 易于单元测试
- 可重用的服务函数
- 统一的错误处理

## 自定义Hooks

### useFileUpload (src/hooks/useFileUpload.ts)
封装文件上传逻辑：
```typescript
const {
  uploadedFiles,
  dragState,
  errors,
  handleFileSelect,
  handleDrop,
  // ...
} = useFileUpload();
```

### useAnalysis (src/hooks/useAnalysis.ts)
封装分析流程逻辑：
```typescript
const {
  isAnalyzing,
  analysisResult,
  performAnalysis,
  // ...
} = useAnalysis();
```

**优势:**
- 逻辑复用
- 关注点分离
- 易于测试
- 减少组件复杂度

## 类型系统

### 统一类型定义 (src/types/index.ts)
所有业务类型集中定义：
```typescript
export interface DashboardData {
  score: number;
  mode: AnalysisMode;
  comment: string;
  radarData: RadarData[];
  weaknesses: WeaknessItem[];
  resumeContent: string;
}
```

**优势:**
- 类型一致性
- 自动类型检查
- 更好的IDE支持
- 重构安全

## 组件架构

### 组件分层
1. **页面组件** (pages/): 顶层路由组件
2. **容器组件** (components/): 业务逻辑容器
3. **展示组件** (components/ui/): 纯UI组件

### 组件设计原则
- **单一职责**: 每个组件只负责一个功能
- **组合优于继承**: 通过组合构建复杂功能
- **Props接口清晰**: 明确的输入输出定义

## 错误处理

### ErrorBoundary
全局错误捕获和处理：
```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### 服务层错误处理
统一的错误响应格式：
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## 性能优化

### 1. 组件优化
- 使用React.memo防止不必要的重渲染
- useCallback和useMemo优化计算和回调

### 2. 代码分割
- 路由级别的懒加载
- 组件级别的动态导入

### 3. 状态优化
- 精确的状态更新
- 避免过度渲染

## 开发规范

### 1. 文件命名
- 组件文件使用PascalCase
- 工具函数使用camelCase
- 类型文件使用index.ts

### 2. 导入规范
```typescript
// 第三方库
import React from 'react';
import { Button } from '@/components/ui/button';

// 内部模块
import { useAppContext } from '@/store/AppContext';
import { AnalysisMode } from '@/types';
```

### 3. 组件规范
```typescript
interface ComponentProps {
  // Props定义
}

export const Component = ({ ...props }: ComponentProps) => {
  // 组件实现
};
```

## 扩展指南

### 添加新页面
1. 在pages/创建页面组件
2. 在AppRouter中添加路由
3. 更新类型定义

### 添加新服务
1. 在services/创建服务文件
2. 定义API接口
3. 创建对应的Hook

### 添加新状态
1. 更新AppContextState接口
2. 添加对应的Action类型
3. 更新reducer逻辑

## 测试策略

### 1. 单元测试
- 工具函数测试
- 服务层测试
- Hook测试

### 2. 组件测试
- 组件渲染测试
- 交互行为测试
- 状态管理测试

### 3. 集成测试
- 页面级别测试
- 用户流程测试

## 部署考虑

### 1. 构建优化
- 代码压缩
- 资源优化
- 缓存策略

### 2. 环境配置
- 开发环境配置
- 生产环境配置
- 环境变量管理

## 总结

新的架构设计实现了：
- ✅ 高度模块化的代码组织
- ✅ 类型安全的开发体验
- ✅ 可维护的状态管理
- ✅ 可扩展的服务架构
- ✅ 一致的错误处理
- ✅ 优秀的开发者体验

这个架构为项目的长期发展和团队协作提供了坚实的基础。
