import { PORTAL_ASSETS } from '@/constants/portal';

export const AboutDialog = () => {
  return (
    <div className="relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Prism Logo 背景图片 */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url(${PORTAL_ASSETS.prismBgLogo})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        />

        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-radial from-secondary/10 via-secondary/5 to-transparent rounded-full blur-2xl" />

        {/* 装饰性网格 */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
                 linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
                 linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
               `,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="relative z-10 space-y-8 py-2">
        {/* 品牌故事内容 */}
        <div className="space-y-6">
          {/* 核心理念卡片 - 优化版本 */}
          <div className="relative p-8 rounded-3xl border border-primary/25 overflow-hidden">
            {/* 顶部装饰线 */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {/* 侧边装饰 */}
            <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-primary/50 via-secondary/50 to-primary/50 rounded-r-full" />

            <div className="space-y-6 text-sm leading-relaxed">
              {/* 第一段 - 问题陈述 */}
              <div className="space-y-3">
                <p className="text-muted-foreground/90 first-letter:text-3xl first-letter:font-bold first-letter:text-primary first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                  我们相信，每个人的经历都蕴含着独特的
                  <span className="inline-block mx-1 px-2 py-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-md text-primary font-semibold">
                    价值光谱
                  </span>
                  。但在
                  <span className="text-red-400 font-medium">一秒扫过上千份简历</span>
                  的AI招聘时代，这些光芒常常被埋没在
                  <span className="text-muted-foreground/60 line-through">平淡的描述</span>
                  之下。
                </p>
              </div>

              {/* 第二段 - 使命陈述 */}
              <div className="relative pl-4 border-l-2 border-secondary/30">
                <p className="text-muted-foreground/90">
                  <span className="text-secondary font-semibold">棱镜 Prism</span> 的诞生，源于一个简单的信念：
                  <br />
                  <span className="text-blue-400 font-medium">技术</span>不应只成为
                  <span className="text-orange-400">企业的筛选工具</span>，更应成为
                  <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-md text-white font-semibold">
                    个体发光的赋能武器
                  </span>
                  。
                </p>
              </div>

              {/* 第三段 - 核心价值 */}
              <div className="relative">
                <div className="absolute -left-2 top-0 w-6 h-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </div>
                <p className="text-muted-foreground/90 pl-6">
                  我们不是
                  <span className="text-muted-foreground/50 line-through">简历优化器</span>
                  ，我们是个人价值的
                  <span className="inline-block mx-1 px-3 py-1 bg-gradient-to-r from-primary/25 via-secondary/25 to-primary/25 rounded-full text-primary font-bold text-base border border-primary/30">
                    "光谱分析仪"
                  </span>
                  。
                </p>
                <p className="text-muted-foreground/80 pl-6 mt-3 italic">
                  我们
                  <span className="text-emerald-400 font-medium not-italic">不创造</span>
                  你的故事，我们只是帮你，以
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold not-italic">
                    最绚烂的方式
                  </span>
                  ，讲述它。
                </p>
              </div>
            </div>
          </div>

          {/* 引用区域 - 增强版 */}
          <div className="relative">
            <div className="text-center p-8 bg-gradient-to-r from-primary/8 via-primary/12 to-secondary/8 rounded-3xl border border-primary/25 relative overflow-hidden">
              {/* 背景装饰 */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />

              <div className="relative z-10">
                <div className="absolute -left-3 -top-3 text-5xl text-primary/40 font-serif">"</div>
                <blockquote className="text-xl font-medium px-8 py-2">
                  <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    欢迎来到棱镜，让您的每一束光都被世界看见
                  </span>
                </blockquote>
                <div className="absolute -right-3 -bottom-3 text-5xl text-secondary/40 font-serif">"</div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <div className="text-sm text-muted-foreground/70 font-medium">
                  棱镜核心理念
                </div>
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
          </div>

          {/* 底部信息 - 增强版 */}
          <div className="flex items-center justify-center gap-6 pt-6 text-xs">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 font-medium">智能分析引擎</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-blue-400 font-medium">安全隐私保护</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-purple-400 font-medium">专业品质服务</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
