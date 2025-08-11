import { Settings, Brain, FileText, Play, Trash2, MessageCircle, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SERVICE_TYPES, EVALUATION_MODES } from '../utils/constants';
import { EvaluationMode } from '../types';
type TestServiceType = 'llm' | 'custom' | 'pdf' | 'image' | 'crucible';

interface ServiceSelectorProps {
  activeServiceType: TestServiceType;
  evaluationMode: EvaluationMode;
  customPrompt: string;
  customContent: string;
  llmTestResultsCount: number;
  onServiceTypeChange: (type: TestServiceType) => void;
  onEvaluationModeChange: (mode: EvaluationMode) => void;
  onCustomPromptChange: (prompt: string) => void;
  onCustomContentChange: (content: string) => void;
  onTestResumeAnalysis: () => void;
  onTestCustomAnalysis: () => void;
  onClearTestResults: () => void;
}

export const ServiceSelector = ({
  activeServiceType,
  evaluationMode,
  customPrompt,
  customContent,
  llmTestResultsCount,
  onServiceTypeChange,
  onEvaluationModeChange,
  onCustomPromptChange,
  onCustomContentChange,
  onTestResumeAnalysis,
  onTestCustomAnalysis,
  onClearTestResults
}: ServiceSelectorProps) => {
  return (
    <div className="w-80 border-r border-primary/20 bg-background/50 backdrop-blur-sm flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">

        {/* 服务选择 */}
        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2 text-primary">
            <Settings className="w-4 h-4" />
            选择测试服务
          </h2>

          <div className="space-y-3">
            {SERVICE_TYPES.map(({ type, label, desc, color, icon }) => {
              const IconComponent = type === 'llm' ? Brain :
                                   type === 'custom' ? Settings :
                                   type === 'image' ? Image :
                                   type === 'crucible' ? MessageCircle : FileText;
              return (
                <button
                  key={type}
                  onClick={() => onServiceTypeChange(type)}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left transition-all duration-300 group",
                    activeServiceType === type
                      ? "border-primary bg-gradient-to-r from-primary/10 to-primary/5 shadow-lg scale-105"
                      : "border-border bg-card/50 hover:border-primary/30 hover:bg-primary/5 hover:scale-102"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{icon}</span>
                      <IconComponent className={cn("w-5 h-5 mt-0.5", color)} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">{label}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">{desc}</div>
                    </div>
                  </div>
                </button>
              );
            })}
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
                {Object.entries(EVALUATION_MODES).map(([mode, config]) => (
                  <button
                    key={mode}
                    onClick={() => onEvaluationModeChange(mode as EvaluationMode)}
                    className={cn(
                      "flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200",
                      evaluationMode === mode
                        ? `bg-${config.color}-500/20 border-${config.color}-500 text-${config.color}-700 dark:text-${config.color}-300`
                        : `bg-background border-border hover:border-${config.color}-500/50 hover:bg-${config.color}-500/5`
                    )}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <div className={`w-2 h-2 rounded-full bg-${config.color}-500`} />
                      {config.label}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">{config.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 并发测试按钮组 */}
            <div className="space-y-3">
              <Button
                onClick={onTestResumeAnalysis}
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                启动简历分析
              </Button>

              {/* 快速测试按钮 */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={onTestResumeAnalysis}
                  variant="outline"
                  size="sm"
                  className="h-10"
                >
                  <Brain className="w-4 h-4 mr-1" />
                  快速测试
                </Button>
                <Button
                  onClick={onClearTestResults}
                  variant="outline"
                  size="sm"
                  disabled={llmTestResultsCount === 0}
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
                    onChange={(e) => onCustomPromptChange(e.target.value)}
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
                    onChange={(e) => onCustomContentChange(e.target.value)}
                    placeholder="留空将使用默认的简历内容..."
                    className="w-full h-16 p-2 text-xs border rounded-lg bg-background/80 resize-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <Button
                  onClick={onTestCustomAnalysis}
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

        {/* 文件提取配置说明 */}
        {(activeServiceType === 'pdf' || activeServiceType === 'image') && (
          <div className="space-y-4 bg-card/30 p-4 rounded-xl border">
            <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
              {activeServiceType === 'pdf' ? <FileText className="w-4 h-4" /> : <Image className="w-4 h-4" />}
              {activeServiceType === 'pdf' ? 'PDF提取' : '图片OCR'} 配置
            </h3>
            
            <div className="text-xs text-muted-foreground space-y-2">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="font-medium mb-1">支持的文件格式：</div>
                {activeServiceType === 'pdf' ? (
                  <div>📄 PDF文件</div>
                ) : (
                  <div>🖼️ PNG, JPG, JPEG, WebP图片文件</div>
                )}
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <div className="font-medium mb-1 text-blue-700 dark:text-blue-300">使用说明：</div>
                <div className="text-blue-600 dark:text-blue-400">
                  {activeServiceType === 'pdf' 
                    ? '选择PDF文件进行文本提取，支持多种提取方法'
                    : '上传图片文件进行OCR文字识别，自动识别中英文内容'
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
