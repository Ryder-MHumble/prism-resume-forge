import { useState, useRef, useEffect } from 'react';
import {
  Upload, FileText, X, Download, AlertCircle, Brain, Settings, Activity, RefreshCw,
  Play, Square, Trash2, Copy, Check, Eye, EyeOff, ChevronDown, ChevronRight, Clock, Hash, MessageSquare, FileCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { CyberpunkBackground } from '@/components/ui/CyberpunkBackground';
import { cn } from '@/lib/utils';
import * as pdfjsLib from 'pdfjs-dist';
import {
  analyzeResumeWithLLM,
  analyzeCustomContent,
  healthCheck,
  getActiveRequestsCount,
  type ResumeAnalysisResult,
  type LLMResponse
} from '@/services/llmService';
import { TestServiceType, LLMTestResult } from '@/types';

interface ExtractedFile {
  file: File;
  extractedText: string;
  status: 'extracting' | 'success' | 'error';
  error?: string;
}

export const ServiceTestingDashboard = () => {
  // PDF提取相关状态
  const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // LLM服务测试相关状态
  const [activeServiceType, setActiveServiceType] = useState<TestServiceType>('llm');
  const [llmTestResults, setLlmTestResults] = useState<LLMTestResult[]>([]);
  const [llmServiceHealth, setLlmServiceHealth] = useState<'unknown' | 'healthy' | 'error'>('unknown');
  const [activeRequestsCount, setActiveRequestsCount] = useState(0);
  const [customPrompt, setCustomPrompt] = useState('');
  const [customContent, setCustomContent] = useState('');

  // 评估模式状态
  const [evaluationMode, setEvaluationMode] = useState<'gentle' | 'mean'>('gentle');

  // UI状态
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: Set<string>}>({});

  // 组件挂载时检查LLM健康状态
  useEffect(() => {
    checkLlmHealth();
    const interval = setInterval(updateActiveRequestsCount, 1000);
    return () => clearInterval(interval);
  }, []);

  // 支持的文件类型
  const supportedTypes = ['application/pdf'];
  const supportedExtensions = ['.pdf'];

  // 检查文件类型
  const isValidFile = (file: File) => {
    const isValidType = supportedTypes.includes(file.type);
    const isValidExtension = supportedExtensions.some(ext =>
      file.name.toLowerCase().endsWith(ext)
    );
    return isValidType || isValidExtension;
  };

  // PDF文本提取功能
  const extractTextFromFile = async (file: File): Promise<string> => {
    try {
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      }

      const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

      if (isPDF) {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const loadingTask = pdfjsLib.getDocument(uint8Array);
        const pdf = await loadingTask.promise;

        let extractedText = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();

          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');

          extractedText += pageText + '\n\n';
        }

        extractedText = extractedText.trim();

        if (!extractedText) {
          throw new Error('PDF文件中未找到可提取的文本内容，可能是扫描版PDF');
        }

        return `=== PDF文本提取结果 ===

文件名: ${file.name}
文件大小: ${(file.size / 1024 / 1024).toFixed(2)} MB
页数: ${pdf.numPages}
提取时间: ${new Date().toLocaleString()}

--- 提取的文本内容 ---

${extractedText}

--- 提取完成 ---
总字符数: ${extractedText.length}
建议: 请检查提取的文本是否完整准确`;

      } else {
        throw new Error(`不支持的文件类型：${file.type}。目前仅支持PDF文件的文本提取。`);
      }

    } catch (error) {
      console.error('文件提取失败:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new Error(`文本提取失败: ${errorMessage}`);
    }
  };

  // 处理文件提取
  const handleFileExtraction = async (files: File[]) => {
    const validFiles = files.filter(isValidFile);

    if (validFiles.length === 0) {
      alert('请上传支持的文件格式：PDF');
      return;
    }

    const newExtractedFiles: ExtractedFile[] = validFiles.map(file => ({
      file,
      extractedText: '',
      status: 'extracting' as const
    }));

    setExtractedFiles(prev => [...prev, ...newExtractedFiles]);

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const fileIndex = extractedFiles.length + i;

      try {
        const extractedText = await extractTextFromFile(file);

        setExtractedFiles(prev =>
          prev.map((item, index) =>
            index === fileIndex
              ? { ...item, extractedText, status: 'success' as const }
              : item
          )
        );
      } catch (error) {
        setExtractedFiles(prev =>
          prev.map((item, index) =>
            index === fileIndex
              ? { ...item, status: 'error' as const, error: error instanceof Error ? error.message : '文本提取失败' }
              : item
          )
        );
      }
    }
  };

  // 拖拽处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileExtraction(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileExtraction(files);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setExtractedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const downloadText = (file: ExtractedFile) => {
    const blob = new Blob([file.extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.file.name.replace(/\.[^/.]+$/, '')}_extracted.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // LLM服务健康检查
  const checkLlmHealth = async () => {
    try {
      const result = await healthCheck();
      setLlmServiceHealth(result.success ? 'healthy' : 'error');
    } catch (error) {
      setLlmServiceHealth('error');
    }
  };

  // 更新活跃请求数量
  const updateActiveRequestsCount = () => {
    setActiveRequestsCount(getActiveRequestsCount());
  };

  // 简历分析测试
  const testResumeAnalysis = async () => {
    const requestId = `test_${Date.now()}`;
    const startTime = Date.now();

    const testResult: LLMTestResult = {
      requestId,
      timestamp: startTime,
      status: 'pending',
      systemPrompt: `${evaluationMode === 'gentle' ? '温柔模式' : '严苛模式'}系统提示词`,
      inputContent: '默认简历内容'
    };
    setLlmTestResults(prev => [testResult, ...prev.slice(0, 9)]);
    updateActiveRequestsCount();

    try {
      const result = await analyzeResumeWithLLM(evaluationMode);
      const duration = Date.now() - startTime;

      setLlmTestResults(prev =>
        prev.map(test =>
          test.requestId === requestId
            ? {
                ...test,
                status: result.success ? 'success' : 'error',
                response: result.success ? JSON.stringify(result.data, null, 2) : undefined,
                error: result.success ? undefined : result.error,
                usage: (result as any).usage,
                duration
              }
            : test
        )
      );
    } catch (error) {
      setLlmTestResults(prev =>
        prev.map(test =>
          test.requestId === requestId
            ? {
                ...test,
                status: 'error',
                error: error instanceof Error ? error.message : '未知错误',
                duration: Date.now() - startTime
              }
            : test
        )
      );
    } finally {
      updateActiveRequestsCount();
    }
  };

  // 自定义内容分析测试
  const testCustomAnalysis = async () => {
    if (!customPrompt.trim() && !customContent.trim()) {
      alert('请输入自定义提示词或内容');
      return;
    }

    const requestId = `custom_${Date.now()}`;
    const startTime = Date.now();

    const testResult: LLMTestResult = {
      requestId,
      timestamp: startTime,
      status: 'pending',
      prompt: customPrompt || '使用默认系统提示词',
      systemPrompt: customPrompt || '默认系统提示词',
      inputContent: customContent || '默认内容'
    };
    setLlmTestResults(prev => [testResult, ...prev.slice(0, 9)]);
    updateActiveRequestsCount();

    try {
      const result = await analyzeCustomContent(
        customPrompt.trim() || undefined,
        customContent.trim() || undefined
      );
      const duration = Date.now() - startTime;

      setLlmTestResults(prev =>
        prev.map(test =>
          test.requestId === requestId
            ? {
                ...test,
                status: result.success ? 'success' : 'error',
                response: result.success ? result.data?.content : undefined,
                error: result.success ? undefined : result.error,
                usage: result.success ? result.data?.usage : undefined,
                duration
              }
            : test
        )
      );
    } catch (error) {
      setLlmTestResults(prev =>
        prev.map(test =>
          test.requestId === requestId
            ? {
                ...test,
                status: 'error',
                error: error instanceof Error ? error.message : '未知错误',
                duration: Date.now() - startTime
              }
            : test
        )
      );
      } finally {
        updateActiveRequestsCount();
      }
  };

  // 清除测试结果
  const clearTestResults = () => {
    setLlmTestResults([]);
  };

  // 复制到剪贴板
  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(id);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  // 切换结果展开/收缩
  const toggleResultExpansion = (id: string) => {
    setExpandedResultId(expandedResultId === id ? null : id);
  };

  // 切换模块展开/收缩
  const toggleSection = (resultId: string, sectionType: string) => {
    setExpandedSections(prev => {
      const newExpanded = { ...prev };
      if (!newExpanded[resultId]) {
        newExpanded[resultId] = new Set();
      }

      if (newExpanded[resultId].has(sectionType)) {
        newExpanded[resultId].delete(sectionType);
      } else {
        newExpanded[resultId].add(sectionType);
      }

      return newExpanded;
    });
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <CyberpunkBackground intensity="low" />

      <div className="relative z-10 h-full bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-sm flex flex-col">

        {/* 顶部状态栏 */}
        <header className="relative z-20 flex-shrink-0 h-16 flex items-center justify-between px-8 border-b border-primary/20 bg-background/80 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  服务测试控制台
                </h1>
                <p className="text-xs text-muted-foreground">
                  支持 LLM分析、PDF提取、自定义测试等多种服务
                </p>
              </div>
            </div>

            {/* 服务状态指示器 */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-medium">活跃请求: {activeRequestsCount}</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  llmServiceHealth === 'healthy' ? 'bg-green-500' :
                  llmServiceHealth === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                )} />
                <span className="text-xs font-medium">
                  LLM: {llmServiceHealth === 'healthy' ? '正常' :
                        llmServiceHealth === 'error' ? '异常' : '检测中'}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={checkLlmHealth}
                  className="h-5 w-5 p-0 ml-1"
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          <ThemeToggle />
        </header>

        {/* 主内容区域 */}
        <div className="flex-1 min-h-0 flex">

          {/* 左侧：服务选择和配置 */}
          <div className="w-80 border-r border-primary/20 bg-background/50 backdrop-blur-sm flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">

              {/* 服务选择 */}
              <div>
                <h2 className="text-sm font-semibold mb-3 flex items-center gap-2 text-primary">
                  <Settings className="w-4 h-4" />
                  选择测试服务
                </h2>

                <div className="space-y-3">
                  {[
                    { type: 'llm' as TestServiceType, label: 'LLM简历分析', icon: Brain, desc: '使用AI模型分析简历', color: 'text-blue-500' },
                    { type: 'custom' as TestServiceType, label: '自定义测试', icon: Settings, desc: '自定义提示词和内容', color: 'text-purple-500' },
                    { type: 'pdf' as TestServiceType, label: 'PDF文本提取', icon: FileText, desc: '从PDF文件提取文本', color: 'text-green-500' },
                  ].map(({ type, label, icon: Icon, desc, color }) => (
                    <button
                      key={type}
                      onClick={() => setActiveServiceType(type)}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 text-left transition-all duration-300 group",
                        activeServiceType === type
                          ? "border-primary bg-gradient-to-r from-primary/10 to-primary/5 shadow-lg scale-105"
                          : "border-border bg-card/50 hover:border-primary/30 hover:bg-primary/5 hover:scale-102"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={cn("w-6 h-6 mt-0.5", color)} />
                        <div className="flex-1">
                          <div className="font-semibold text-sm mb-1">{label}</div>
                          <div className="text-xs text-muted-foreground leading-relaxed">{desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* LLM测试配置 */}
              {(activeServiceType === 'llm' || activeServiceType === 'custom') && (
                <div className="space-y-4 bg-card/30 p-4 rounded-xl border">
                  <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    LLM测试配置
                  </h3>

                  {/* 评估模式选择 */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">评估模式</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEvaluationMode('gentle')}
                        className={cn(
                          "flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200",
                          evaluationMode === 'gentle'
                            ? "bg-green-500/20 border-green-500 text-green-700 dark:text-green-300"
                            : "bg-background border-border hover:border-green-500/50 hover:bg-green-500/5"
                        )}
                      >
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          温柔模式
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-1">鼓励式评估</div>
                      </button>

                      <button
                        onClick={() => setEvaluationMode('mean')}
                        className={cn(
                          "flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200",
                          evaluationMode === 'mean'
                            ? "bg-red-500/20 border-red-500 text-red-700 dark:text-red-300"
                            : "bg-background border-border hover:border-red-500/50 hover:bg-red-500/5"
                        )}
                      >
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          严苛模式
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-1">严格式评估</div>
                      </button>
                    </div>
                  </div>

                  {/* 并发测试按钮组 */}
                  <div className="space-y-3">
                    <Button
                      onClick={testResumeAnalysis}
                      disabled={false} // 移除isLlmTesting限制，支持并发
                      className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      size="lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      启动简历分析
                    </Button>

                    {/* 快速测试按钮 */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={testResumeAnalysis}
                        variant="outline"
                        size="sm"
                        className="h-10"
                      >
                        <Brain className="w-4 h-4 mr-1" />
                        快速测试
                      </Button>
                      <Button
                        onClick={clearTestResults}
                        variant="outline"
                        size="sm"
                        disabled={llmTestResults.length === 0}
                        className="h-10"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        清空结果
                      </Button>
                    </div>
                  </div>

                  {/* 自定义测试输入 */}
                  {activeServiceType === 'custom' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium mb-2 block text-muted-foreground">
                          系统提示词（可选）
                        </label>
                        <textarea
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          placeholder="留空将使用默认的简历分析提示词..."
                          className="w-full h-16 p-2 text-xs border rounded-lg bg-background/80 resize-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium mb-2 block text-muted-foreground">
                          测试内容（可选）
                        </label>
                        <textarea
                          value={customContent}
                          onChange={(e) => setCustomContent(e.target.value)}
                          placeholder="留空将使用默认的简历内容..."
                          className="w-full h-16 p-2 text-xs border rounded-lg bg-background/80 resize-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>

                      <Button
                        onClick={testCustomAnalysis}
                        disabled={false} // 移除isLlmTesting限制
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                        size="sm"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        开始自定义分析
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* PDF测试配置 */}
              {activeServiceType === 'pdf' && (
                <div className="space-y-4 bg-card/30 p-4 rounded-xl border">
                  <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    PDF提取配置
                  </h3>

                  <div
                    className={cn(
                      "border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer",
                      isDragOver ? "border-primary bg-primary/10 scale-105" : "border-muted-foreground/30",
                      "hover:border-primary/50 hover:bg-primary/5 hover:scale-102"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-3 text-green-500" />
                    <p className="text-sm font-medium mb-1">上传PDF文件</p>
                    <p className="text-xs text-muted-foreground">
                      拖拽或点击选择PDF文件
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 右侧：测试结果展示 */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-shrink-0 p-4 border-b border-primary/20 bg-background/80">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">测试结果</h2>
                  <p className="text-sm text-muted-foreground">
                    {activeServiceType === 'llm' && '显示LLM简历分析结果'}
                    {activeServiceType === 'custom' && '显示自定义测试结果'}
                    {activeServiceType === 'pdf' && '显示PDF文本提取结果'}
                  </p>
                </div>

                {/* 结果统计 */}
                {(activeServiceType === 'llm' || activeServiceType === 'custom') && llmTestResults.length > 0 && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>成功: {llmTestResults.filter(r => r.status === 'success').length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span>失败: {llmTestResults.filter(r => r.status === 'error').length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <span>进行中: {llmTestResults.filter(r => r.status === 'pending').length}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 min-h-0 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {/* LLM测试结果 */}
              {(activeServiceType === 'llm' || activeServiceType === 'custom') && (
                <div className="space-y-4">
                  {llmTestResults.length === 0 ? (
                    <div className="text-center py-16">
                      <Brain className="w-20 h-20 mx-auto mb-6 opacity-30" />
                      <p className="text-lg text-muted-foreground mb-2">暂无测试结果</p>
                      <p className="text-sm text-muted-foreground">点击左侧按钮开始测试，支持多并发请求</p>
                    </div>
                  ) : (
                    llmTestResults.map((result) => (
                      <div key={result.requestId} className="border rounded-xl p-5 bg-card/50 shadow-sm hover:shadow-md transition-all duration-200">
                        {/* 结果头部 */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-4 h-4 rounded-full shadow-sm",
                              result.status === 'success' ? 'bg-green-500 shadow-green-500/30' :
                              result.status === 'error' ? 'bg-red-500 shadow-red-500/30' :
                              result.status === 'pending' ? 'bg-yellow-500 animate-pulse shadow-yellow-500/30' : 'bg-gray-500'
                            )} />
                            <div>
                              <span className="font-mono text-sm font-medium">{result.requestId}</span>
                              {result.isStreaming && (
                                <span className="ml-2 text-xs text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full animate-pulse">
                                  流式输出中...
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(result.timestamp).toLocaleTimeString()}
                            </span>
                            {result.response && (
                              <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(result.response!, result.requestId)}
                                  className="h-7 w-7 p-0 hover:bg-background"
                                  title="复制"
                                >
                                  {copiedText === result.requestId ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 可展开的信息模块 */}
                        <div className="space-y-3">
                          {/* 总Token模块 */}
                          {result.usage && (
                            <div className="border rounded-lg bg-background/50">
                              <button
                                onClick={() => toggleSection(result.requestId, 'tokens')}
                                className="w-full p-3 flex items-center justify-between hover:bg-muted/30 rounded-lg transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <Hash className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm font-medium">总Token: {result.usage.totalTokens}</span>
                                </div>
                                {expandedSections[result.requestId]?.has('tokens') ?
                                  <ChevronDown className="w-4 h-4" /> :
                                  <ChevronRight className="w-4 h-4" />
                                }
                              </button>
                              {expandedSections[result.requestId]?.has('tokens') && (
                                <div className="px-3 pb-3 pt-0">
                                  <div className="grid grid-cols-3 gap-3 text-xs">
                                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center">
                                      <div className="font-medium text-green-600 dark:text-green-400">输入</div>
                                      <div className="text-lg font-bold">{result.usage.promptTokens}</div>
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg text-center">
                                      <div className="font-medium text-purple-600 dark:text-purple-400">输出</div>
                                      <div className="text-lg font-bold">{result.usage.completionTokens}</div>
                                    </div>
                                    <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-center">
                                      <div className="font-medium text-orange-600 dark:text-orange-400">效率</div>
                                      <div className="text-lg font-bold">{Math.round((result.usage.completionTokens / result.usage.promptTokens) * 100)}%</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* 耗费时间模块 */}
                          {result.duration && (
                            <div className="border rounded-lg bg-background/50">
                              <button
                                onClick={() => toggleSection(result.requestId, 'duration')}
                                className="w-full p-3 flex items-center justify-between hover:bg-muted/30 rounded-lg transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-green-500" />
                                  <span className="text-sm font-medium">耗费时间: {result.duration}ms</span>
                                </div>
                                {expandedSections[result.requestId]?.has('duration') ?
                                  <ChevronDown className="w-4 h-4" /> :
                                  <ChevronRight className="w-4 h-4" />
                                }
                              </button>
                              {expandedSections[result.requestId]?.has('duration') && (
                                <div className="px-3 pb-3 pt-0">
                                  <div className="text-xs text-muted-foreground space-y-1">
                                    <div>请求开始: {new Date(result.timestamp).toLocaleTimeString()}</div>
                                    <div>请求结束: {new Date(result.timestamp + result.duration).toLocaleTimeString()}</div>
                                    <div>总耗时: {(result.duration / 1000).toFixed(2)}秒</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* 系统提示词模块 */}
                          {result.systemPrompt && (
                            <div className="border rounded-lg bg-background/50">
                              <button
                                onClick={() => toggleSection(result.requestId, 'systemPrompt')}
                                className="w-full p-3 flex items-center justify-between hover:bg-muted/30 rounded-lg transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4 text-purple-500" />
                                  <span className="text-sm font-medium">系统提示词</span>
                                </div>
                                {expandedSections[result.requestId]?.has('systemPrompt') ?
                                  <ChevronDown className="w-4 h-4" /> :
                                  <ChevronRight className="w-4 h-4" />
                                }
                              </button>
                              {expandedSections[result.requestId]?.has('systemPrompt') && (
                                <div className="px-3 pb-3 pt-0">
                                  <div className="bg-muted/30 rounded-lg p-3 max-h-40 overflow-y-auto">
                                    <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono">
                                      {result.systemPrompt}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* 输入内容模块 */}
                          {result.inputContent && (
                            <div className="border rounded-lg bg-background/50">
                              <button
                                onClick={() => toggleSection(result.requestId, 'inputContent')}
                                className="w-full p-3 flex items-center justify-between hover:bg-muted/30 rounded-lg transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <FileCode className="w-4 h-4 text-orange-500" />
                                  <span className="text-sm font-medium">输入内容</span>
                                </div>
                                {expandedSections[result.requestId]?.has('inputContent') ?
                                  <ChevronDown className="w-4 h-4" /> :
                                  <ChevronRight className="w-4 h-4" />
                                }
                              </button>
                              {expandedSections[result.requestId]?.has('inputContent') && (
                                <div className="px-3 pb-3 pt-0">
                                  <div className="bg-muted/30 rounded-lg p-3 max-h-40 overflow-y-auto">
                                    <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono">
                                      {result.inputContent}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* 错误信息 */}
                        {result.error && (
                          <div className="mt-4 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-red-700 dark:text-red-300 mb-1">执行失败</p>
                                <p className="text-sm text-red-600 dark:text-red-400">{result.error}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 响应内容 - 支持流式渲染 */}
                        {result.response && (
                          <div className="mt-4 bg-muted/30 rounded-lg overflow-hidden border">
                            <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b">
                              <span className="text-xs font-medium text-muted-foreground">响应内容</span>
                              <div className="flex items-center gap-2">
                                {result.isStreaming && (
                                  <span className="text-xs text-blue-500 animate-pulse">实时输出中...</span>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleResultExpansion(result.requestId)}
                                  className="h-6 px-2 text-xs"
                                >
                                  {expandedResultId === result.requestId ? "收起" : "展开详情"}
                                </Button>
                              </div>
                            </div>
                            <div className={cn(
                              "transition-all duration-300 ease-in-out",
                              expandedResultId === result.requestId
                                ? "max-h-[600px] overflow-y-auto"
                                : "max-h-32 overflow-hidden"
                            )}>
                              <pre className="p-4 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-background/50">
                                {result.response}
                              </pre>
                            </div>
                            {expandedResultId !== result.requestId && result.response.length > 200 && (
                              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted/80 to-transparent pointer-events-none" />
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* PDF提取结果 */}
              {activeServiceType === 'pdf' && (
                <div className="space-y-4">
                  {extractedFiles.length === 0 ? (
                    <div className="text-center py-16">
                      <FileText className="w-20 h-20 mx-auto mb-6 opacity-30" />
                      <p className="text-lg text-muted-foreground mb-2">暂无文件</p>
                      <p className="text-sm text-muted-foreground">请上传PDF文件开始提取</p>
                    </div>
                  ) : (
                    extractedFiles.map((item, index) => (
                      <div key={index} className="border rounded-xl p-5 bg-card/50 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-green-500" />
                            <div>
                              <h4 className="font-medium">{item.file.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {(item.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.status === 'extracting' && (
                              <div className="flex items-center gap-2 text-blue-500">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm font-medium">提取中...</span>
                              </div>
                            )}

                            {item.status === 'success' && (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyToClipboard(item.extractedText, `file_${index}`)}
                                  className="h-8"
                                >
                                  {copiedText === `file_${index}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadText(item)}
                                  className="h-8"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            )}

                            {item.status === 'error' && (
                              <div className="flex items-center gap-2 text-red-500">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">提取失败</span>
                              </div>
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFile(index)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {item.status === 'success' && (
                          <div className="bg-muted/30 rounded-lg p-4 max-h-60 overflow-y-auto">
                            <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                              {item.extractedText}
                            </pre>
                          </div>
                        )}

                        {item.status === 'error' && (
                          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-red-700 dark:text-red-300 mb-1">提取失败</p>
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  {item.error || '未知错误'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
