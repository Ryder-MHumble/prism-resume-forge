import { useEffect, useRef, useState } from 'react';

interface CyberpunkBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
}

interface GridLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  alpha: number;
  speed: number;
  color: string;
}

interface DigitalRain {
  x: number;
  y: number;
  speed: number;
  char: string;
  color: string;
  alpha: number;
}

interface LightBeam {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
  width: number;
}

export const CyberpunkBackground = ({
  intensity = 'medium',
  className = ''
}: CyberpunkBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 动画参数配置
  const config = {
    low: {
      particles: 50,
      gridLines: 20,
      digitalRains: 15,
      lightBeams: 3,
      scanLines: 2
    },
    medium: {
      particles: 100,
      gridLines: 40,
      digitalRains: 25,
      lightBeams: 5,
      scanLines: 3
    },
    high: {
      particles: 200,
      gridLines: 60,
      digitalRains: 40,
      lightBeams: 8,
      scanLines: 4
    }
  };

  const currentConfig = config[intensity];

  // 颜色配置
  const colors = {
    primary: '#0AFFA4',      // 电子绿
    secondary: '#FF007F',    // 霓虹粉
    accent: '#00FFFF',       // 青色
    purple: '#8A2BE2',       // 紫色
    blue: '#0080FF',         // 蓝色
    orange: '#FF4500',       // 橙色
  };

  // 数字雨字符集
  const digitalChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '=', '+'];

  // 初始化画布尺寸
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 主动画循环
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // 初始化动画元素
    const particles: Particle[] = [];
    const gridLines: GridLine[] = [];
    const digitalRains: DigitalRain[] = [];
    const lightBeams: LightBeam[] = [];
    let scanLinePositions: number[] = [];
    let glitchTimer = 0;

    // 初始化粒子
    for (let i = 0; i < currentConfig.particles; i++) {
      particles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 200,
        size: Math.random() * 2 + 0.5,
        color: Object.values(colors)[Math.floor(Math.random() * Object.values(colors).length)],
        alpha: Math.random() * 0.8 + 0.2
      });
    }

    // 初始化网格线
    for (let i = 0; i < currentConfig.gridLines; i++) {
      const isVertical = Math.random() > 0.5;
      gridLines.push({
        x1: isVertical ? Math.random() * dimensions.width : 0,
        y1: isVertical ? 0 : Math.random() * dimensions.height,
        x2: isVertical ? Math.random() * dimensions.width : dimensions.width,
        y2: isVertical ? dimensions.height : Math.random() * dimensions.height,
        alpha: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.5 + 0.2,
        color: Object.values(colors)[Math.floor(Math.random() * Object.values(colors).length)]
      });
    }

    // 初始化数字雨
    for (let i = 0; i < currentConfig.digitalRains; i++) {
      digitalRains.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height - dimensions.height,
        speed: Math.random() * 2 + 1,
        char: digitalChars[Math.floor(Math.random() * digitalChars.length)],
        color: Math.random() > 0.7 ? colors.primary : colors.accent,
        alpha: Math.random() * 0.8 + 0.3
      });
    }

    // 初始化扫描线
    for (let i = 0; i < currentConfig.scanLines; i++) {
      scanLinePositions.push(Math.random() * dimensions.height);
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 15, 20, 0.05)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // 绘制网格线
      gridLines.forEach((line, index) => {
        ctx.strokeStyle = `${line.color}${Math.floor(line.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();

        // 更新网格线透明度
        line.alpha += (Math.random() - 0.5) * 0.02;
        line.alpha = Math.max(0.05, Math.min(0.4, line.alpha));
      });

      // 绘制粒子
      particles.forEach((particle, index) => {
        const alpha = (particle.life / particle.maxLife) * particle.alpha;

        ctx.fillStyle = `${particle.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // 添加光晕效果
        if (Math.random() > 0.95) {
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // 更新粒子
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // 重置粒子
        if (particle.life > particle.maxLife ||
            particle.x < 0 || particle.x > dimensions.width ||
            particle.y < 0 || particle.y > dimensions.height) {
          particle.x = Math.random() * dimensions.width;
          particle.y = Math.random() * dimensions.height;
          particle.life = 0;
          particle.vx = (Math.random() - 0.5) * 0.5;
          particle.vy = (Math.random() - 0.5) * 0.5;
        }
      });

      // 绘制数字雨
      digitalRains.forEach((rain, index) => {
        ctx.fillStyle = `${rain.color}${Math.floor(rain.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.font = '12px "Courier New", monospace';
        ctx.fillText(rain.char, rain.x, rain.y);

        // 更新数字雨
        rain.y += rain.speed;

        if (Math.random() > 0.98) {
          rain.char = digitalChars[Math.floor(Math.random() * digitalChars.length)];
        }

        // 重置数字雨
        if (rain.y > dimensions.height + 20) {
          rain.y = -20;
          rain.x = Math.random() * dimensions.width;
          rain.speed = Math.random() * 2 + 1;
        }
      });

      // 绘制光束
      lightBeams.forEach((beam, index) => {
        const alpha = (beam.life / beam.maxLife);
        ctx.strokeStyle = `${beam.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = beam.width;
        ctx.beginPath();
        ctx.moveTo(beam.x1, beam.y1);
        ctx.lineTo(beam.x2, beam.y2);
        ctx.stroke();

        // 添加光晕
        ctx.shadowColor = beam.color;
        ctx.shadowBlur = beam.width * 3;
        ctx.stroke();
        ctx.shadowBlur = 0;

        beam.life++;

        // 移除已死亡的光束
        if (beam.life > beam.maxLife) {
          lightBeams.splice(index, 1);
        }
      });

      // 随机生成新光束
      if (Math.random() > 0.98 && lightBeams.length < currentConfig.lightBeams) {
        lightBeams.push({
          x1: Math.random() * dimensions.width,
          y1: Math.random() * dimensions.height,
          x2: Math.random() * dimensions.width,
          y2: Math.random() * dimensions.height,
          alpha: 1,
          life: 0,
          maxLife: 30 + Math.random() * 60,
          color: Object.values(colors)[Math.floor(Math.random() * Object.values(colors).length)],
          width: Math.random() * 2 + 0.5
        });
      }

      // 绘制扫描线
      scanLinePositions.forEach((pos, index) => {
        const gradient = ctx.createLinearGradient(0, pos - 2, 0, pos + 2);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, colors.accent + '80');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, pos - 2, dimensions.width, 4);

        scanLinePositions[index] += 0.5;
        if (scanLinePositions[index] > dimensions.height + 10) {
          scanLinePositions[index] = -10;
        }
      });

      // 故障效果
      glitchTimer++;
      if (glitchTimer > 600 && Math.random() > 0.95) { // 大约每10秒一次故障
        const glitchHeight = 20 + Math.random() * 40;
        const glitchY = Math.random() * dimensions.height;

        // 色彩分离效果
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = colors.secondary + '40';
        ctx.fillRect(0, glitchY, dimensions.width, glitchHeight);

        ctx.fillStyle = colors.accent + '40';
        ctx.fillRect(5, glitchY, dimensions.width, glitchHeight);

        ctx.globalCompositeOperation = 'source-over';

        if (Math.random() > 0.7) {
          glitchTimer = 0;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height
      }}
    />
  );
};
