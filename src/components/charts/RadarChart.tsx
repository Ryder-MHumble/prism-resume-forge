import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface RadarData {
  category: string;
  value: number;
  maxValue: number;
}

interface RadarChartProps {
  data: RadarData[];
  className?: string;
  size?: number;
}

export const RadarChart = ({ data, className, size = 200 }: RadarChartProps) => {
  const { isWarmTheme } = useTheme();
  
  const center = size / 2;
  const radius = size * 0.35;
  const levels = 5;
  
  // 计算雷达图的点
  const calculatePoint = (value: number, maxValue: number, angle: number) => {
    const ratio = value / maxValue;
    const distance = (radius * ratio);
    const radian = (angle - 90) * (Math.PI / 180);
    
    return {
      x: center + distance * Math.cos(radian),
      y: center + distance * Math.sin(radian)
    };
  };

  // 创建背景网格线
  const createGridLines = () => {
    const lines = [];
    const angleStep = 360 / data.length;
    
    // 同心圆
    for (let level = 1; level <= levels; level++) {
      const levelRadius = (radius * level) / levels;
      lines.push(
        <circle
          key={`circle-${level}`}
          cx={center}
          cy={center}
          r={levelRadius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          opacity={0.3}
        />
      );
    }
    
    // 射线
    data.forEach((_, index) => {
      const angle = index * angleStep;
      const endPoint = calculatePoint(100, 100, angle);
      lines.push(
        <line
          key={`line-${index}`}
          x1={center}
          y1={center}
          x2={endPoint.x}
          y2={endPoint.y}
          stroke="hsl(var(--border))"
          strokeWidth="1"
          opacity={0.3}
        />
      );
    });
    
    return lines;
  };

  // 创建数据多边形
  const createDataPolygon = () => {
    const angleStep = 360 / data.length;
    const points = data.map((item, index) => {
      const angle = index * angleStep;
      const point = calculatePoint(item.value, item.maxValue, angle);
      return `${point.x},${point.y}`;
    }).join(' ');

    return (
      <g>
        <polygon
          points={points}
          fill={isWarmTheme ? "hsl(var(--primary) / 0.2)" : "hsl(var(--primary) / 0.15)"}
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          className="transition-prism"
        />
        
        {/* 数据点 */}
        {data.map((item, index) => {
          const angle = index * angleStep;
          const point = calculatePoint(item.value, item.maxValue, angle);
          
          return (
            <g key={`point-${index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="hsl(var(--primary))"
                stroke="hsl(var(--background))"
                strokeWidth="2"
                className="hover:scale-125 transition-prism cursor-pointer"
              >
                <title>{`${item.category}: ${item.value}/${item.maxValue}`}</title>
              </circle>
              
              {/* 辉光效果 */}
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                fill="hsl(var(--primary))"
                opacity="0.3"
                className="animate-pulse"
              />
            </g>
          );
        })}
      </g>
    );
  };

  // 创建标签
  const createLabels = () => {
    const angleStep = 360 / data.length;
    
    return data.map((item, index) => {
      const angle = index * angleStep;
      const labelDistance = radius + 25;
      const point = calculatePoint(100, 100, angle);
      const labelX = center + (labelDistance * Math.cos((angle - 90) * (Math.PI / 180)));
      const labelY = center + (labelDistance * Math.sin((angle - 90) * (Math.PI / 180)));
      
      return (
        <g key={`label-${index}`}>
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-xs font-medium fill-foreground"
            transform={`translate(0, -5)`}
          >
            {item.category}
          </text>
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-xs font-mono fill-primary"
            transform={`translate(0, 8)`}
          >
            {item.value}
          </text>
        </g>
      );
    });
  };

  return (
    <div className={cn("inline-block", className)}>
      <svg width={size} height={size} className="overflow-visible">
        {/* 背景网格 */}
        {createGridLines()}
        
        {/* 数据多边形 */}
        {createDataPolygon()}
        
        {/* 标签 */}
        {createLabels()}
      </svg>
    </div>
  );
};