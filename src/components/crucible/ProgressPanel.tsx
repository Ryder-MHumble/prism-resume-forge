import React from 'react';
import { Card } from '@/components/ui/card';

interface ProgressPanelProps {
  completedCount: number;
  totalCount: number;
}

export const ProgressPanel: React.FC<ProgressPanelProps> = ({ 
  completedCount, 
  totalCount 
}) => {
  return (
    <div className="lg:col-span-3 space-y-4">
      <div className="space-y-4">
        {/* 进度概览 */}
        <Card className="p-4 border-border/50">
          <h3 className="text-sm font-semibold mb-3 text-foreground">面试进度</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">已完成</span>
              <span className="text-primary font-medium">{completedCount}/{totalCount}</span>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
          </div>
        </Card>

        {/* 相关资料 */}
        <Card className="p-4 border-border/50">
          <h3 className="text-sm font-semibold mb-3 text-foreground">相关资料</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-border/30 bg-gradient-to-br from-blue-500/5 via-background to-blue-500/5 hover:border-blue-500/30 transition-colors cursor-pointer">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-xs font-medium text-blue-400 mb-1">简历优化指南</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    如何突出核心竞争力，让HR一眼看到你的价值
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-border/30 bg-gradient-to-br from-green-500/5 via-background to-green-500/5 hover:border-green-500/30 transition-colors cursor-pointer">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-xs font-medium text-green-400 mb-1">技能表达技巧</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    用数据和结果说话，展现专业能力
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-border/30 bg-gradient-to-br from-purple-500/5 via-background to-purple-500/5 hover:border-purple-500/30 transition-colors cursor-pointer">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-xs font-medium text-purple-400 mb-1">行业趋势洞察</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    了解市场需求，调整简历重点方向
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-border/30 bg-gradient-to-br from-orange-500/5 via-background to-orange-500/5 hover:border-orange-500/30 transition-colors cursor-pointer">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-xs font-medium text-orange-400 mb-1">面试准备要点</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    基于简历内容的面试问题预测与准备
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};