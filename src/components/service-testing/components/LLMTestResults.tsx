import { Brain, AlertCircle, Hash, Clock, MessageSquare, FileCode, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LLMTestResult } from '@/types';

interface LLMTestResultsProps {
  results: LLMTestResult[];
  expandedResultId: string | null;
  expandedSections: {[key: string]: Set<string>};
  copiedText: string | null;
  onToggleResultExpansion: (id: string) => void;
  onToggleSection: (resultId: string, sectionType: string) => void;
  onCopyToClipboard: (text: string, id: string) => void;
}

export const LLMTestResults = ({
  results,
  expandedResultId,
  expandedSections,
  copiedText,
  onToggleResultExpansion,
  onToggleSection,
  onCopyToClipboard
}: LLMTestResultsProps) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <Brain className="w-20 h-20 mx-auto mb-6 opacity-30" />
        <p className="text-lg text-muted-foreground mb-2">暂无测试结果</p>
        <p className="text-sm text-muted-foreground">点击左侧按钮开始测试，支持多并发请求</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
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
                    onClick={() => onCopyToClipboard(result.response!, result.requestId)}
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
                  onClick={() => onToggleSection(result.requestId, 'tokens')}
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
                  onClick={() => onToggleSection(result.requestId, 'duration')}
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
                  onClick={() => onToggleSection(result.requestId, 'systemPrompt')}
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
                  onClick={() => onToggleSection(result.requestId, 'inputContent')}
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
                   <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onToggleResultExpansion(result.requestId)}
                    className="h-6 px-2 text-xs"
                  >
                    {expandedResultId === result.requestId ? "收起" : "展开详情"}
                  </Button>
                </div>
              </div>
              <div className={cn(
                "transition-all duration-300 ease-in-out relative",
                expandedResultId === result.requestId
                  ? "max-h-[600px] overflow-y-auto"
                  : "max-h-32 overflow-hidden"
              )}>
                <pre className="p-4 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-background/50">
                  {result.response}
                </pre>
                {expandedResultId !== result.requestId && result.response.length > 200 && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted/80 to-transparent pointer-events-none" />
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
