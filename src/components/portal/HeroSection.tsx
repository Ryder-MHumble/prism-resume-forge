import { PORTAL_ASSETS, PORTAL_TEXT, ANIMATION_CONFIG } from '@/constants/portal';

export const HeroSection = () => {
  return (
    <div className="flex-1 relative overflow-hidden">
      {/* 背景Logo */}
      <div
        className="absolute inset-0 opacity-[0.3] pointer-events-none z-0"
        style={{
          backgroundImage: `url(${PORTAL_ASSETS.prismBgLogo})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center right'
        }}
      />

      {/* 主布局容器 */}
      <div className="relative z-10 h-full flex">
        {/* 左侧主内容区 - 70% */}
        <div className="flex-[0.7] flex flex-col justify-center px-12 py-16">
          {/* 顶部标签 */}
          <div className="mb-12">
            <div className="inline-block">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">
                <div className="w-8 h-px bg-primary/50" />
                <span>AI-POWERED CAREER ANALYSIS</span>
              </div>
              <div className="text-sm text-primary/90 font-medium bg-primary/10 px-3 py-1 rounded-full border border-primary/30">
                {PORTAL_TEXT.brand.tagline}
              </div>
            </div>
          </div>

          {/* 主标题区域 - 增强全息粒子效果 */}
          <div className="mb-12">
            <h1 className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[0.85] tracking-tight mb-6 relative">
              <div className="relative inline-block">
                {/* 全息粒子背景 */}
                <div className="absolute inset-0 -m-4">
                  {[...Array(ANIMATION_CONFIG.particleCount.hero.primary)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-primary rounded-full animate-pulse opacity-60"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: `${2 + Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>

                <span className="relative bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg">
                  {PORTAL_TEXT.hero.title[0]}
                </span>
                <div className="absolute -right-4 top-4 w-2 h-2 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50" />
              </div>
              <br />
              <div className="relative inline-block ml-8">
                {/* 粒子聚合效果 */}
                <div className="absolute inset-0 -m-4">
                  {[...Array(ANIMATION_CONFIG.particleCount.hero.secondary)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-0.5 h-0.5 bg-secondary rounded-full animate-ping opacity-40"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${3 + Math.random()}s`
                      }}
                    />
                  ))}
                </div>

                <span className="relative bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
                  {PORTAL_TEXT.hero.title[1]}
                </span>
                <div className="absolute -left-6 -top-2 w-16 h-px bg-gradient-to-r from-secondary/60 to-transparent" />
              </div>
            </h1>

            <div className="max-w-md">
              {/* 故障艺术字副标题 */}
              <div className="relative mb-4">
                <p className="text-lg leading-relaxed font-light relative z-10">
                  <span className="text-muted-foreground/80">{PORTAL_TEXT.hero.subtitle}</span>
                  <span className="relative inline-block ml-2">
                    <span className="absolute inset-0 text-red-400/70 animate-pulse" style={{
                      textShadow: '2px 0 0 #ef4444, -2px 0 0 #3b82f6',
                      animationDuration: '0.1s'
                    }}>
                      {PORTAL_TEXT.hero.crossed}
                    </span>
                    <span className="relative text-muted-foreground/80 line-through decoration-red-400/60 decoration-2">
                      {PORTAL_TEXT.hero.crossed}
                    </span>
                  </span>
                  <span className="text-muted-foreground/80">{PORTAL_TEXT.hero.ending}</span>
                </p>

                {/* 故障干扰线 */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-400/40 to-transparent animate-pulse"
                  style={{ animationDuration: '0.15s' }} />
              </div>

              <p className="text-base text-muted-foreground/60 font-light">
                {PORTAL_TEXT.hero.description.split('光谱分析')[0]}
                <span className="relative inline-block mx-1">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold">
                    光谱分析
                  </span>
                  <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-primary/50 to-secondary/50" />
                </span>
              </p>
            </div>
          </div>

          {/* 添加CSS动画样式 */}
          <style>{`
            @keyframes scan {
              0%, 100% { top: 0%; opacity: 0; }
              10% { opacity: 1; }
              50% { top: 50%; opacity: 1; }
              90% { opacity: 1; }
              100% { top: 100%; opacity: 0; }
            }
          `}</style>
        </div>
      </div>

      {/* 底部装饰条 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* 版权信息 */}
      <div className="absolute bottom-4 left-12 text-xs text-muted-foreground/60 font-mono">
        {PORTAL_TEXT.copyright}
      </div>
    </div>
  );
};
