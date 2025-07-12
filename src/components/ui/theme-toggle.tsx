import { Sun, Moon } from "lucide-react";
import { Button } from "./button";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { isWarmTheme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "neural-pulse hover:prism-glow transition-prism",
        className
      )}
    >
      {isWarmTheme ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">切换主题</span>
    </Button>
  );
};