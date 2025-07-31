import { ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ResumeRenderer } from '@/components/resume/ResumeRenderer';
import { resumeMarkdown } from '@/data/resumeExample';
import { BUTTON_STYLES, DASHBOARD_TEXT } from '@/constants/dashboard';

interface ResumeViewerProps {
  isAnalysisSummaryExpanded: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  showScrollToTop: boolean;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onScrollToTop: () => void;
}

export const ResumeViewer = ({
  isAnalysisSummaryExpanded,
  scrollContainerRef,
  showScrollToTop,
  onScroll,
  onScrollToTop
}: ResumeViewerProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 20);
    onScroll(e);
  };

  return (
    <div className={cn(
      "relative overflow-hidden transition-all duration-500 ease-in-out",
      isAnalysisSummaryExpanded
        ? "h-[calc(100vh-16rem)]"
        : "h-[calc(100vh-10rem)]"
    )}>
      {/* 动态顶部磨砂玻璃渐变效果 - 仅在滚动时显示 */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-12 z-10 pointer-events-none transition-opacity duration-300",
        isScrolled ? "opacity-100" : "opacity-0"
      )}>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 via-background/80 via-background/60 via-background/40 via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 via-background/15 to-transparent backdrop-blur-[3px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-white/[0.01] to-transparent" />
      </div>

      {/* 底部模糊遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      {/* 滚动内容 */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto scrollbar-hide"
      >
        <ResumeRenderer
          content={resumeMarkdown}
          title={DASHBOARD_TEXT.resumeSection.title}
          showHeader={false}
          className="border rounded-xl overflow-hidden text-sm"
        />
      </div>

      {/* 返回顶部按钮 */}
      <button
        onClick={onScrollToTop}
        className={cn(
          BUTTON_STYLES.scrollToTop,
          showScrollToTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        )}
        title={DASHBOARD_TEXT.resumeSection.scrollToTopTitle}
      >
        <ArrowUp className="w-4 h-4 mx-auto transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />

        {/* 背景光晕效果 */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      </button>
    </div>
  );
};
