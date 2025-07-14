import { useState, useEffect } from 'react';
import { ArrowRight, Info, LogIn, Upload, Zap, Brain, Shield, Database, FileText, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { AnalysisModeSelector, AnalysisMode } from '@/components/prism/AnalysisMode';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CyberpunkBackground } from '@/components/ui/CyberpunkBackground';
import { cn } from '@/lib/utils';
// 导入logo
import prismLogo from '@/assets/极简logo.jpg';
import saiboLogo from  '@/assets/赛博logo.jpg';
import { useNavigate } from 'react-router-dom';

interface PortalProps {
  onStartAnalysis: (files: { resume?: File; jd?: File }, mode: AnalysisMode) => void;
}

export const Portal = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<{ resume?: File; jd?: File }>({});
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('hardcore');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<'upload' | 'ready'>('upload');
  const [isDragOver, setIsDragOver] = useState<{ resume: boolean; jd: boolean }>({ resume: false, jd: false });

  const handleStartAnalysis = () => {
    if (uploadedFiles.resume) {
      // 在真实场景中，这里应该发送文件到服务器，然后导航到仪表盘
      // 此处简化为直接导航
      navigate('/dashboard');
    }
  };

  const canStartAnalysis = !!uploadedFiles.resume;

  // 自动跳转逻辑
  useEffect(() => {
    // 如果简历和JD都上传了，自动跳转到ready面板
    if (uploadedFiles.resume && uploadedFiles.jd) {
      setTimeout(() => {
        setActivePanel('ready');
      }, 800); // 延迟800ms让用户看到上传成功的反馈
    }
  }, [uploadedFiles.resume, uploadedFiles.jd]);

  // 检查文件类型
  const isResumeFile = (file: File) => {
    return file.type.includes('pdf') ||
           file.type.includes('word') ||
           file.type.includes('document') ||
           file.name.toLowerCase().endsWith('.pdf') ||
           file.name.toLowerCase().endsWith('.doc') ||
           file.name.toLowerCase().endsWith('.docx');
  };

  const isJDFile = (file: File) => {
    return file.type.includes('pdf') ||
           file.type.includes('word') ||
           file.type.includes('document') ||
           file.type.includes('text') ||
           file.type.includes('image') ||
           file.name.toLowerCase().endsWith('.pdf') ||
           file.name.toLowerCase().endsWith('.doc') ||
           file.name.toLowerCase().endsWith('.docx') ||
           file.name.toLowerCase().endsWith('.txt') ||
           file.name.toLowerCase().endsWith('.png');
  };

  // 简历文件拖拽处理
  const handleResumeDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(prev => ({ ...prev, resume: true }));
  };

  const handleResumeDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(prev => ({ ...prev, resume: false }));
  };

  const handleResumeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(prev => ({ ...prev, resume: false }));

    const files = Array.from(e.dataTransfer.files);
    const resumeFile = files.find(file => isResumeFile(file));

    if (resumeFile) {
      const newFiles = { ...uploadedFiles, resume: resumeFile };
      setUploadedFiles(newFiles);
    }
  };

  // JD文件拖拽处理
  const handleJDDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(prev => ({ ...prev, jd: true }));
  };

  const handleJDDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(prev => ({ ...prev, jd: false }));
  };

  const handleJDDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(prev => ({ ...prev, jd: false }));

    const files = Array.from(e.dataTransfer.files);
    const jdFile = files.find(file => isJDFile(file));

    if (jdFile) {
      const newFiles = { ...uploadedFiles, jd: jdFile };
      setUploadedFiles(newFiles);
    }
  };

  // 文件选择处理
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'jd') => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      const isValid = type === 'resume' ? isResumeFile(file) : isJDFile(file);

      if (isValid) {
        const newFiles = { ...uploadedFiles, [type]: file };
        setUploadedFiles(newFiles);
      } else {
        alert(`不支持的文件格式。${type === 'resume' ? '简历' : 'JD'}文件支持的格式：${type === 'resume' ? 'PDF, Word' : 'PDF, Word, TXT, PNG'}`);
      }
    }

    // 重置input值，允许重复选择同一文件
    e.target.value = '';
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* 赛博朋克背景 */}
      <CyberpunkBackground intensity="medium" />

      {/* 主内容层 */}
      <div className="relative z-10 h-full bg-gradient-to-br from-background/90 via-background/85 to-background/90 backdrop-blur-[2px]">

        {/* 顶部状态栏 */}
        <header className="relative z-20 h-16 flex items-center justify-between px-8 border-b border-primary/20 bg-background/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* 替换为自定义logo */}
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
                <img
                  src={prismLogo}
                  alt="Prism Logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  棱镜 Prism
                </h1>
                <p className="text-xs text-muted-foreground">个人价值光谱分析仪</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-500">光谱引擎在线</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-blue-500" />
                <span className="text-blue-500">价值加密传输</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="border border-primary/20 hover:border-primary/40 hover:bg-primary/10">
                  <Info className="w-4 h-4 mr-2" />
                  关于棱镜
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl border-primary/20 bg-background/95 backdrop-blur-xl overflow-hidden">
                {/* 背景装饰 */}
                <div className="absolute inset-0 pointer-events-none">
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
                  {/* Logo和标题区域 - 改为横向布局 */}
                  <div className="flex items-center gap-6 mb-8">
                    {/* Logo区域 - 移除边框 */}
                    <div className="flex-shrink-0">
                      <div className="w-30 h-20 flex items-center justify-center">
                        <img
                          src={saiboLogo}
                          alt="Prism Logo"
                          className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                        />
                      </div>
                    </div>

                    {/* 品牌标题和描述 */}
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent mb-2">
                        棱镜 Prism
                      </h2>
                      <p className="text-lg text-muted-foreground font-medium">
                        折射你的全部才能
                      </p>
                    </div>
                  </div>

                  {/* 品牌故事内容 */}
                  <div className="space-y-6">
                    {/* 核心理念卡片 - 优化版本 */}
                    <div className="relative p-8 bg-gradient-to-br from-card/70 to-card/40 rounded-3xl border border-primary/15 backdrop-blur-md overflow-hidden">
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

                        {/* 核心理念强调 */}
                        {/* <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl border border-primary/20">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm">核</span>
                            </div>
                            <h4 className="font-semibold text-primary">核心哲学</h4>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center p-2 bg-primary/10 rounded-lg">
                              <div className="font-semibold text-primary">解析</div>
                              <div className="text-muted-foreground/70">不创造</div>
                            </div>
                            <div className="text-center p-2 bg-secondary/10 rounded-lg">
                              <div className="font-semibold text-secondary">折射</div>
                              <div className="text-muted-foreground/70">不美化</div>
                            </div>
                            <div className="text-center p-2 bg-primary/10 rounded-lg">
                              <div className="font-semibold text-primary">赋能</div>
                              <div className="text-muted-foreground/70">不包办</div>
                            </div>
                          </div>
                        </div> */}
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
              </DialogContent>
            </Dialog>

            {/* 主题切换 */}
            {/* <ThemeToggle /> */}

            {/* <Button variant="outline" size="sm">
              <LogIn className="w-4 h-4 mr-2" />
              登录
            </Button> */}
          </div>
        </header>

        {/* 主要内容区域 */}
        <div className="flex h-[calc(100vh-4rem)]">

          {/* 左侧控制面板 - 完全移除背景色，只保留边框和模糊效果 */}
          <div className="w-2/5 flex flex-col border-r border-primary/20 backdrop-blur-sm relative">

            {/* 面板标签 */}
            <div className="flex border-b border-primary/20">
              {[
                { id: 'upload', label: '上传材料', icon: Upload },
                { id: 'ready', label: '光谱分析', icon: Zap }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActivePanel(id as any)}
                  className={cn(
                    "flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 border-b-2 backdrop-blur-sm",
                    activePanel === id
                      ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-primary/5"
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="w-4 h-4" />
                    {label}
                  </div>
                </button>
              ))}
            </div>
              
            {/* 面板内容 */}
            <div className="flex-1 p-6 overflow-hidden">
              {/* 文件上传面板 */}
              {activePanel === 'upload' && (
                <div className="h-full overflow-y-auto scrollbar-hide space-y-8">
            
                  {/* 主要上传区域 - 简历 */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-primary">简历文件 (必需)</span>
                      </div>
              
                      {/* 下一步按钮 */}
                      {uploadedFiles.resume && (
                        <button
                          onClick={() => setActivePanel('ready')}
                          className="group flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
                        >
                          <span>下一步：光谱分析</span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </button>
                      )}
                    </div>

                    <div
                      onDragOver={handleResumeDragOver}
                      onDragLeave={handleResumeDragLeave}
                      onDrop={handleResumeDrop}
                      className={cn(
                        "group relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-500 cursor-pointer",
                        "backdrop-blur-md", // 移除背景色，只保留模糊效果
                        "hover:border-primary/50 hover:bg-primary/8 hover:shadow-lg hover:shadow-primary/10",
                        isDragOver.resume ? "border-primary bg-primary/12 scale-[1.02] shadow-2xl shadow-primary/20" : "border-border/50",
                        uploadedFiles.resume && "border-primary/60 bg-primary/12 shadow-lg shadow-primary/10"
                      )}
                      onClick={() => document.getElementById('resume-file-input')?.click()}
                    >
                      {/* 背景装饰 */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
                      </div>

                      <div className="relative z-10 space-y-6 pointer-events-none">
                        {!uploadedFiles.resume ? (
                          <>
                            <div className="space-y-4">
                              <div className="relative">
                                <FileText className="w-16 h-16 mx-auto text-primary/70 group-hover:text-primary transition-colors duration-300 drop-shadow-lg" />
                                <div className="absolute inset-0 w-16 h-16 mx-auto bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-300" />
                              </div>

                              <div className="space-y-2">
                                <h4 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300 text-shadow">
                                  上传你的简历
                                </h4>
                                <p className="text-sm text-muted-foreground/90 text-shadow">
                                  支持 PDF、Word 格式 • 解析你的价值光谱
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/80">
                              <div className="flex items-center gap-1">
                                <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                                <span className="text-shadow">价值解析</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-1 h-1 bg-secondary rounded-full animate-pulse" />
                                <span className="text-shadow">光谱折射</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                                <span className="text-shadow">能力赋能</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-4">
                            <div className="relative">
                              <FileText className="w-12 h-12 mx-auto text-primary drop-shadow-lg" />
                              <div className="absolute inset-0 w-12 h-12 mx-auto bg-primary/30 rounded-full blur-lg animate-pulse" />
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-lg font-semibold text-primary text-shadow">简历光谱就绪</h4>
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full backdrop-blur-sm">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                <span className="text-sm font-medium text-primary">{uploadedFiles.resume.name}</span>
                              </div>
                              <div className="mt-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setUploadedFiles(prev => ({ ...prev, resume: undefined }));
                                  }}
                                  className="text-xs pointer-events-auto border-primary/30 hover:bg-primary/10"
                                >
                                  重新上传
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 隐藏的文件输入 */}
                      <input
                        id="resume-file-input"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileSelect(e, 'resume')}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* 次要上传区域 - JD */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-secondary">目标职位JD (可选)</span>
                      <div className="px-2 py-1 bg-secondary/15 border border-secondary/30 rounded-full backdrop-blur-sm">
                        <span className="text-xs text-secondary">精准折射</span>
                      </div>
                    </div>

                    <div
                      onDragOver={handleJDDragOver}
                      onDragLeave={handleJDDragLeave}
                      onDrop={handleJDDrop}
                      className={cn(
                        "group relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-500 cursor-pointer",
                        "backdrop-blur-md", // 移除背景色，只保留模糊效果
                        "hover:border-secondary/50 hover:bg-secondary/8 hover:shadow-lg hover:shadow-secondary/10",
                        isDragOver.jd ? "border-secondary bg-secondary/12 scale-[1.02] shadow-2xl shadow-secondary/20" : "border-border/40",
                        uploadedFiles.jd && "border-secondary/60 bg-secondary/12 shadow-lg shadow-secondary/10"
                      )}
                      onClick={() => document.getElementById('jd-file-input')?.click()}
                    >
                      {/* 背景装饰 */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-secondary/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
                      </div>

                      <div className="relative z-10 pointer-events-none">
                        {!uploadedFiles.jd ? (
                          <div className="space-y-4">
                            <div className="relative">
                              <Briefcase className="w-12 h-12 mx-auto text-secondary/70 group-hover:text-secondary transition-colors duration-300 drop-shadow-lg" />
                              <div className="absolute inset-0 w-12 h-12 mx-auto bg-secondary/20 rounded-full blur-lg group-hover:bg-secondary/30 transition-all duration-300" />
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-lg font-medium group-hover:text-secondary transition-colors duration-300 text-shadow">
                                上传目标职位描述
                              </h4>
                              <p className="text-sm text-muted-foreground/90 text-shadow">
                                支持 PDF、Word、TXT、PNG • 让价值折射更精准
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="relative">
                              <Briefcase className="w-10 h-10 mx-auto text-secondary drop-shadow-lg" />
                              <div className="absolute inset-0 w-10 h-10 mx-auto bg-secondary/30 rounded-full blur-lg animate-pulse" />
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-base font-semibold text-secondary text-shadow">JD 折射准备完成</h4>
                              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/20 border border-secondary/30 rounded-full backdrop-blur-sm">
                                <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
                                <span className="text-xs font-medium text-secondary">{uploadedFiles.jd.name}</span>
                              </div>
                              <div className="mt-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setUploadedFiles(prev => ({ ...prev, jd: undefined }));
                                  }}
                                  className="text-xs pointer-events-auto border-secondary/30 text-secondary hover:bg-secondary/10"
                                >
                                  重新上传
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 隐藏的文件输入 */}
                      <input
                        id="jd-file-input"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.png"
                        onChange={(e) => handleFileSelect(e, 'jd')}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 启动分析面板 */}
              {activePanel === 'ready' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-shadow">光谱分析配置</h3>
                    <p className="text-sm text-muted-foreground/90 text-shadow">
                      选择分析模式，准备解析你的价值光谱
                    </p>
                  </div>

                  {/* 分析模式选择 */}
                  <div className="backdrop-blur-md border border-primary/20 rounded-lg p-6">
                    <AnalysisModeSelector
                      selectedMode={analysisMode}
                      onModeChange={setAnalysisMode}
                    />
                  </div>

                  {/* 启动按钮 */}
                  <div className="pt-4">
                    <Button
                      onClick={handleStartAnalysis}
                      disabled={!canStartAnalysis}
                      size="lg"
                      className={cn(
                        "w-full h-12 text-base font-semibold",
                        "bg-gradient-to-r from-primary to-secondary",
                        "hover:from-primary/90 hover:to-secondary/90",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-all duration-300 transform hover:scale-[1.02]",
                        "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                      )}
                    >
                      <Database className="w-5 h-5 mr-2" />
                      {canStartAnalysis ? '开始光谱分析' : '请先上传简历'}
                      {canStartAnalysis && <ArrowRight className="w-5 h-5 ml-2" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
            
          {/* 右侧展示区域 */}
          <div className="flex-1 relative overflow-hidden">

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
                      在被AI筛选之前，先用棱镜看清自己
                    </div>
                  </div>
                </div>

                {/* 主标题区域 */}
                <div className="mb-12">
                  <h1 className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[0.85] tracking-tight mb-6">
                    <div className="relative inline-block">
                      <span className="bg-gradient-to-r from-primary via-primary/95 to-primary/80 bg-clip-text text-transparent drop-shadow-lg">
                        折射你的
                      </span>
                      <div className="absolute -right-4 top-4 w-2 h-2 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50" />
                    </div>
                    <br />
                    <div className="relative inline-block ml-8">
                      <span className="bg-gradient-to-r from-secondary via-secondary/95 to-secondary/80 bg-clip-text text-transparent drop-shadow-lg">
                        全部才能
                      </span>
                      <div className="absolute -left-6 -top-2 w-16 h-px bg-gradient-to-r from-secondary/60 to-transparent" />
                    </div>
                  </h1>

                  <div className="max-w-md">
                    <p className="text-lg text-muted-foreground/80 leading-relaxed font-light mb-4">
                      面对AI招聘官？别让平庸的简历，埋没你发光的实力
                    </p>
                    <p className="text-base text-muted-foreground/60 font-light">
                      你的职业生涯，需要一次光谱分析
                    </p>
                  </div>
                </div>

                {/* 核心理念 - 增强科幻感 */}
                <div className="space-y-4">
                  <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground/50 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span>CORE PRINCIPLES</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                  </div>

                  {[
                    {
                      number: "01",
                      title: "解析，而非创造",
                      subtitle: "Analyze, Don't Invent",
                      desc: "深度洞察每段真实经历背后的隐藏价值"
                    },
                    {
                      number: "02",
                      title: "折射，而非美化",
                      subtitle: "Refract, Don't Beautify",
                      desc: "将能力折射到企业最关心的维度"
                    },
                    {
                      number: "03",
                      title: "赋能，而非包办",
                      subtitle: "Empower, Don't Do It",
                      desc: "引导自我发现，赋予持久的自信力量"
                    }
                  ].map(({ number, title, subtitle, desc }, index) => (
                    <div
                      key={index}
                      className="group flex gap-4 py-3 pl-4 transition-all duration-300 backdrop-blur-sm"
                    >
                      <div className="flex-shrink-0">
                        <div className="text-xl font-bold text-primary/60 group-hover:text-primary/90 transition-colors duration-300 font-mono">
                          {number}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3 mb-1">
                          <h3 className="text-base font-semibold text-primary/90 group-hover:text-primary transition-colors duration-300">
                            {title}
                          </h3>
                          <span className="text-xs text-muted-foreground/60 font-mono tracking-wider">
                            {subtitle}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground/90 leading-relaxed text-shadow">
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 右侧装饰区 */}

            </div>

            {/* 底部装饰条 */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {/* 版权信息 */}
            <div className="absolute bottom-4 left-12 text-xs text-muted-foreground/60 font-mono">
              © 2025 Prism AI • Neural Analysis Engine
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};