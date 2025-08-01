import { useState } from 'react';
import { MessageCircle, Send, Zap, ChevronDown, ChevronUp, Clock, User, Bot, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CrucibleTestResult } from '../hooks/useCrucibleChat';
import { CrucibleChatSession, CrucibleChatMessage } from '@/services/crucibleChatService';

interface CrucibleTestPanelProps {
  testResults: CrucibleTestResult[];
  expandedTestId: string | null;
  activeChatSession: CrucibleChatSession | null;
  currentMessage: string;
  isSendingMessage: boolean;
  onPrepareAnalysisData: (mode: 'gentle' | 'mean') => void;
  onStartChatSession: (analysisSessionId: string, issueId: number) => void;
  onSendMessage: (message: string) => void;
  onEndChat: (sessionId: string) => void;
  onClearTestResults: () => void;
  onToggleTestExpansion: (testId: string) => void;
  onSetCurrentMessage: (message: string) => void;
}

export const CrucibleTestPanel = ({
  testResults,
  expandedTestId,
  activeChatSession,
  currentMessage,
  isSendingMessage,
  onPrepareAnalysisData,
  onStartChatSession,
  onSendMessage,
  onEndChat,
  onClearTestResults,
  onToggleTestExpansion,
  onSetCurrentMessage
}: CrucibleTestPanelProps) => {
  const [selectedMode, setSelectedMode] = useState<'gentle' | 'mean'>('mean');
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);

  const handlePrepareData = () => {
    onPrepareAnalysisData(selectedMode);
  };

  const handleStartChat = () => {
    const latestAnalysis = testResults.find(t => t.analysisSessionId && t.availableIssues);
    if (latestAnalysis?.analysisSessionId && selectedIssueId !== null) {
      onStartChatSession(latestAnalysis.analysisSessionId, selectedIssueId);
    }
  };

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      onSendMessage(currentMessage);
      onSetCurrentMessage('');
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'active': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const latestAnalysis = testResults.find(t => t.analysisSessionId && t.availableIssues);

  return (
    <div className="w-96 p-4 border-r border-border bg-card/50">
      {/* 控制面板 */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <span className="font-medium">能力炼金室测试</span>
        </div>

        {/* 第一步：准备分析数据 */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">1. 准备分析数据</span>
              <Badge variant="outline" className="text-xs">
                第一步
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                variant={selectedMode === 'gentle' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMode('gentle')}
              >
                温和模式
              </Button>
              <Button
                variant={selectedMode === 'mean' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMode('mean')}
              >
                严格模式
              </Button>
            </div>

            <Button
              onClick={handlePrepareData}
              className="w-full"
              size="sm"
            >
              <Zap className="w-4 h-4 mr-2" />
              运行简历分析
            </Button>
          </div>
        </Card>

        {/* 第二步：选择问题启动对话 */}
        {latestAnalysis && latestAnalysis.availableIssues && (
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">2. 选择问题</span>
                <Badge variant="outline" className="text-xs">
                  第二步
                </Badge>
              </div>

              <div className="space-y-2 max-h-32 overflow-y-auto">
                {latestAnalysis.availableIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`p-2 rounded border cursor-pointer transition-colors ${
                      selectedIssueId === issue.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-accent'
                    }`}
                    onClick={() => setSelectedIssueId(issue.id)}
                  >
                    <div className="text-sm font-medium">{issue.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {issue.description}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleStartChat}
                disabled={selectedIssueId === null || !!activeChatSession}
                className="w-full"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                启动对话
              </Button>
            </div>
          </Card>
        )}

        {/* 第三步：对话界面 */}
        {activeChatSession && (
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">3. 对话进行中</span>
                <Badge variant="outline" className="text-xs">
                  {activeChatSession.roundCount}/{activeChatSession.maxRounds}轮
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground">
                <strong>问题：</strong>{activeChatSession.issueTitle}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="输入您的回复..."
                  value={currentMessage}
                  onChange={(e) => onSetCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isSendingMessage || activeChatSession.status !== 'active'}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isSendingMessage || activeChatSession.status !== 'active'}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={() => onEndChat(activeChatSession.sessionId)}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                <Square className="w-4 h-4 mr-2" />
                结束对话
              </Button>
            </div>
          </Card>
        )}

        {/* 清理按钮 */}
        {testResults.length > 0 && (
          <Button
            onClick={onClearTestResults}
            variant="outline"
            size="sm"
            className="w-full"
          >
            清空测试结果
          </Button>
        )}
      </div>

      {/* 测试结果展示 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">测试记录</span>
          <Badge variant="secondary">{testResults.length}</Badge>
        </div>

        <ScrollArea className="h-64">
          <div className="space-y-2">
            {testResults.map((result) => (
              <Card key={result.testId} className="p-3">
                <div
                  className="cursor-pointer"
                  onClick={() => onToggleTestExpansion(result.testId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(result.status)}`} />
                      <span className="text-sm font-medium">
                        {result.testId.startsWith('analysis') ? '分析' : '对话'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(result.timestamp)}
                      </span>
                    </div>
                    {expandedTestId === result.testId ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {expandedTestId === result.testId && (
                  <div className="mt-3 space-y-2">
                    <Separator />

                    {result.status === 'error' && (
                      <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                        {result.error}
                      </div>
                    )}

                    {result.availableIssues && (
                      <div>
                        <div className="text-xs font-medium mb-1">发现的问题：</div>
                        <div className="space-y-1">
                          {result.availableIssues.slice(0, 3).map((issue) => (
                            <div key={issue.id} className="text-xs text-muted-foreground">
                              • {issue.title}
                            </div>
                          ))}
                          {result.availableIssues.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              ... 还有 {result.availableIssues.length - 3} 个问题
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {result.chatSession && (
                      <div>
                        <div className="text-xs font-medium mb-1">对话记录：</div>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {result.chatSession.messages.map((message, index) => (
                            <div
                              key={message.id}
                              className={`text-xs p-2 rounded ${
                                message.role === 'user'
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              <div className="flex items-center gap-1 mb-1">
                                {message.role === 'user' ? (
                                  <User className="w-3 h-3" />
                                ) : (
                                  <Bot className="w-3 h-3" />
                                )}
                                <span className="font-medium">
                                  {message.role === 'user' ? '用户' : '助手'}
                                </span>
                                <span className="text-xs">
                                  {formatTimestamp(message.timestamp)}
                                </span>
                              </div>
                              <div className="line-clamp-3">
                                {message.content}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.duration && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        耗时: {result.duration}ms
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
