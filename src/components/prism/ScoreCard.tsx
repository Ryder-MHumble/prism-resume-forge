import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AnalysisMode } from './AnalysisMode';

interface ScoreCardProps {
  score: number;
  previousScore?: number;
  mode: AnalysisMode;
  comment: string;
  className?: string;
}

export const ScoreCard = ({ 
  score, 
  previousScore, 
  mode, 
  comment, 
  className 
}: ScoreCardProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-primary';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'S';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };

  const getTrendIcon = () => {
    if (!previousScore) return <Minus className="w-4 h-4" />;
    if (score > previousScore) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (score < previousScore) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getModeStyles = () => {
    return mode === 'hardcore' 
      ? 'border-primary/30 bg-primary/5' 
      : 'border-secondary/30 bg-secondary/5';
  };

  return (
    <Card className={cn(
      "p-6 neural-pulse transition-prism",
      getModeStyles(),
      className
    )}>
      <div className="space-y-6">
        {/* 分数显示 */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className={cn(
                "text-4xl font-bold number-roll",
                getScoreColor(animatedScore)
              )}>
                {animatedScore}
              </span>
              <span className="text-xl text-muted-foreground">/100</span>
              <span className={cn(
                "text-2xl font-bold px-2 py-1 rounded",
                "bg-gradient-to-r from-primary/20 to-secondary/20",
                getScoreColor(score)
              )}>
                {getScoreGrade(score)}
              </span>
            </div>
            
            {previousScore && (
              <div className="flex items-center gap-2 text-sm">
                {getTrendIcon()}
                <span className="text-muted-foreground">
                  较上次 {score > previousScore ? '+' : ''}{score - previousScore}
                </span>
              </div>
            )}
          </div>

          {/* 模式标识 */}
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-mono",
            mode === 'hardcore' 
              ? "bg-primary/20 text-primary" 
              : "bg-secondary/20 text-secondary"
          )}>
            {mode === 'hardcore' ? 'HARDCORE' : 'SUPPORTIVE'}
          </div>
        </div>

        {/* AI 评语 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              mode === 'hardcore' ? "bg-primary" : "bg-secondary"
            )} />
            <span className="text-sm font-semibold">AI 诊断评语</span>
          </div>
          
          <blockquote className={cn(
            "border-l-4 pl-4 py-2 text-sm leading-relaxed",
            mode === 'hardcore' 
              ? "border-primary text-foreground italic" 
              : "border-secondary text-foreground"
          )}>
            {comment}
          </blockquote>
        </div>

        {/* 进度条 */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>潜力解锁进度</span>
            <span>{score}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-1500 ease-out",
                "bg-gradient-to-r",
                mode === 'hardcore' 
                  ? "from-primary to-primary/70" 
                  : "from-secondary to-secondary/70"
              )}
              style={{ width: `${animatedScore}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};