import React, { useEffect, useRef } from 'react';
import { Bot, User, Copy, Check, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// 流式打字动画组件
const StreamingTypingAnimation: React.FC = () => (
  <div className="flex items-center space-x-1">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
    </div>
    <span className="text-xs text-muted-foreground/60 ml-2">AI正在思考...</span>
  </div>
);

// 流式内容渲染组件
const StreamingContent: React.FC<{ content: string; isComplete: boolean }> = ({ content, isComplete }) => {
  const [displayedContent, setDisplayedContent] = React.useState('');
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (content) {
      setDisplayedContent(content);
    }
  }, [content]);

  return (
    <div className="flex items-start">
      <pre className="text-sm text-foreground whitespace-pre-wrap break-words font-sans">
        {displayedContent}
        {!isComplete && (
          <span className="animate-pulse ml-0.5 text-primary">▊</span>
        )}
      </pre>
    </div>
  );
};

interface Defect {
  id: number;
  title: string;
  description?: string;
  suggestion?: string;
  impact: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatAreaProps {
  currentDefect: Defect | null;
  userResponse: string;
  messageHistory: Record<number, string[]>; // 保留兼容旧版本
  messageCount: Record<number, number>;
  currentDefectIndex: number;
  copiedMessage: string | null;
  // 新增流式支持相关props
  chatMessages: Message[]; // 完整的对话消息列表
  isStreaming: boolean; // 是否正在流式接收
  streamingContent: string; // 当前流式接收的内容
  onUserResponseChange: (value: string) => void;
  onUserReply: () => void;
  onCopyText: (text: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  currentDefect,
  userResponse,
  messageHistory,
  messageCount,
  currentDefectIndex,
  copiedMessage,
  chatMessages,
  isStreaming,
  streamingContent,
  onUserResponseChange,
  onUserReply,
  onCopyText,
}) => {
  const currentMessages = messageHistory[currentDefectIndex] || [];
  const currentMessageCount = messageCount[currentDefectIndex] || 0;

  if (!currentDefect) {
    return (
      <div className="lg:col-span-6 flex flex-col h-full">
        <Card className="flex-1 border-2 p-8 flex items-center justify-center">
          <p className="text-muted-foreground">请选择一个问题开始深度面试</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="lg:col-span-6 flex flex-col h-full">
      {/* 聊天消息区域 */}
      <Card className="flex-1 border-2 p-0 flex flex-col overflow-hidden max-h-[calc(100vh-90px)]">
        {/* 当前问题显示区域 - 内部顶部 */}
        <div className="p-4 pb-3 bg-gradient-to-r from-card/40 via-card/20 to-card/10 border-b border-border/30 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-1.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-1">
                {currentDefect.title}
              </h3>
              {currentDefect.description && (
                <p className="text-xs text-muted-foreground/80 mb-1 line-clamp-2">
                  {currentDefect.description}
                </p>
              )}
              {currentDefect.suggestion && (
                <p className="text-xs text-cyan-400/90 line-clamp-1">
                  💡 {currentDefect.suggestion}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted/30 scrollbar-track-transparent hover:scrollbar-thumb-muted/50 space-y-4 p-4 min-h-0 max-h-[calc(100vh-240px)]">

          {/* 完整对话消息 */}
          {chatMessages.map((message) => (
            <div key={message.id} className={cn(
              "flex gap-3",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}>
              {/* AI头像（左侧） */}
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
              )}

              <div className={cn(
                "flex-1 max-w-md group relative",
                message.role === 'user' ? "max-w-md" : "max-w-2xl"
              )}>
                <div className={cn(
                  "rounded-lg p-3",
                  message.role === 'user'
                    ? "bg-primary/10"
                    : "bg-muted/50 border border-border/30"
                )}>
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <pre className={cn(
                        "text-sm whitespace-pre-wrap break-words font-sans",
                        message.role === 'user' ? "text-primary" : "text-foreground"
                      )}>
                        {message.content}
                      </pre>
                    </div>
                  </div>

                  {/* 时间戳 */}
                  <div className="text-xs text-muted-foreground/60 mt-2">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>

                {/* 复制按钮 - hover时显示 */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => onCopyText(message.content)}
                >
                  {copiedMessage === message.content ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3 text-muted-foreground" />
                  )}
                </Button>
              </div>

              {/* 用户头像（右侧） */}
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

          {/* 正在流式接收的AI消息 */}
          {isStreaming && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Loader2 size={18} className="text-white animate-spin" />
              </div>

              <div className="flex-1 max-w-2xl">
                <div className="bg-muted/50 border border-border/30 rounded-lg p-3">
                  {streamingContent ? (
                    <StreamingContent content={streamingContent} isComplete={false} />
                  ) : (
                    <StreamingTypingAnimation />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 备用：兼容旧版本的用户历史消息（如果没有chatMessages） */}
          {(!chatMessages || chatMessages.length === 0) && currentMessages.map((message, index) => (
            <div key={index} className="flex gap-3 justify-end">
              <div className="flex-1 max-w-md group relative">
                <div className="bg-primary/10 rounded-lg p-3">
                  <p className="text-sm text-primary">
                    {message}
                  </p>
                </div>

                {/* 复制按钮 - hover时显示 */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => onCopyText(message)}
                >
                  {copiedMessage === message ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <User size={18} />
              </div>
            </div>
          ))}

          {/* 当前用户输入消息预览 (如果有) */}
          {userResponse && !isStreaming && (
            <div className="flex gap-3 justify-end">
              <div className="flex-1 max-w-md group relative">
                <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                  <p className="text-sm text-primary">
                    {userResponse}
                  </p>
                </div>

                {/* 复制按钮 - hover时显示 */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => onCopyText(userResponse)}
                >
                  {copiedMessage === userResponse ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <User size={18} />
              </div>
            </div>
          )}
        </div>

        {/* 输入区域 */}
        <div className="border-t border-border/20 pt-4 px-4 pb-4 bg-gradient-to-r from-background/50 via-background to-background/50 flex-shrink-0">
          <div className="space-y-3">
            {/* 输入框容器 - 发送按钮内嵌 */}
            <div className="relative">
              <div className="relative rounded-xl border-2 border-border/30 bg-background/80 backdrop-blur-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all duration-200">
                <Textarea
                  value={userResponse}
                  onChange={(e) => onUserResponseChange(e.target.value)}
                  placeholder="分享你的想法，或描述改进方案... (Shift + Enter 换行)"
                  className={cn(
                    "w-full resize-none border-0 bg-transparent",
                    "focus:ring-0 focus:outline-none placeholder:text-muted-foreground/60",
                    "py-3 pl-4 pr-20 scrollbar-thin scrollbar-thumb-muted/30 scrollbar-track-transparent",
                    "scrollbar-thumb-rounded-full hover:scrollbar-thumb-muted/50",
                    "min-h-[52px] max-h-[160px] overflow-y-auto"
                  )}
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'hsl(var(--muted) / 0.3) transparent',
                    height: 'auto',
                    minHeight: '52px'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    // 重置高度以获取正确的scrollHeight
                    target.style.height = 'auto';
                    // 设置新高度，但不超过最大高度
                    const newHeight = Math.min(target.scrollHeight, 160);
                    target.style.height = `${newHeight}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (e.shiftKey) {
                        // Shift + Enter: 允许换行，不做任何处理
                        return;
                      } else {
                        // 单独 Enter: 发送消息
                        e.preventDefault();
                        if (userResponse.trim()) {
                          onUserReply();
                        }
                      }
                    }
                  }}
                />

                {/* 字符计数器 - 位于右下角 */}
                {userResponse.length > 0 && (
                  <div className="absolute right-16 bottom-2 text-xs text-muted-foreground/60 pointer-events-none">
                    {userResponse.length}/500
                  </div>
                )}

                {/* 内嵌的发送按钮 - 垂直居中 */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Button
                    onClick={onUserReply}
                    disabled={!userResponse.trim()}
                    size="sm"
                    className={cn(
                      "h-10 w-10 rounded-full transition-all duration-300 flex items-center justify-center",
                      "shadow-md backdrop-blur-sm border-0 flex-shrink-0",
                      userResponse.trim()
                        ? [
                            "bg-gradient-to-r from-emerald-500 to-cyan-500",
                            "hover:from-emerald-600 hover:to-cyan-600",
                            "hover:shadow-lg hover:shadow-emerald-500/25",
                            "hover:scale-105 active:scale-95",
                            "text-white"
                          ]
                        : [
                            "bg-muted/40 text-muted-foreground/40",
                            "cursor-not-allowed"
                          ]
                    )}
                  >
                    <Send className={cn(
                      "transition-all duration-300",
                      userResponse.trim()
                        ? "w-4 h-4 transform translate-x-0.5"
                        : "w-3.5 h-3.5"
                    )} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};