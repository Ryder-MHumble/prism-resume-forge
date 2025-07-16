import { useState, useRef } from 'react';
import { Upload, FileText, X, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { CyberpunkBackground } from '@/components/ui/CyberpunkBackground';
import { cn } from '@/lib/utils';
import * as pdfjsLib from 'pdfjs-dist';

interface ExtractedFile {
  file: File;
  extractedText: string;
  status: 'extracting' | 'success' | 'error';
  error?: string;
}

export const FileTextExtraction = () => {
  const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 支持的文件类型
  const supportedTypes = ['application/pdf'];
  const supportedExtensions = ['.pdf'];

  // 检查文件类型
  const isValidFile = (file: File) => {
    const isValidType = supportedTypes.includes(file.type);
    const isValidExtension = supportedExtensions.some(ext =>
      file.name.toLowerCase().endsWith(ext)
    );
    return isValidType || isValidExtension;
  };

  // PDF文本提取功能
  const extractTextFromFile = async (file: File): Promise<string> => {
    try {
      // 配置 PDF.js Worker（如果还没有配置）
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      }

      // 检查文件类型
      const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

      if (isPDF) {
        // PDF 文件处理
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // 使用 PDF.js 加载PDF文档
        const loadingTask = pdfjsLib.getDocument(uint8Array);
        const pdf = await loadingTask.promise;

        let extractedText = '';

        // 遍历所有页面提取文本
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();

          // 将文本项连接成字符串
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');

          extractedText += pageText + '\n\n';
        }

        extractedText = extractedText.trim();

        if (!extractedText) {
          throw new Error('PDF文件中未找到可提取的文本内容，可能是扫描版PDF');
        }

        // 返回包含文件信息和提取文本的结果
        return `=== PDF文本提取结果 ===

文件名: ${file.name}
文件大小: ${(file.size / 1024 / 1024).toFixed(2)} MB
页数: ${pdf.numPages}
提取时间: ${new Date().toLocaleString()}

--- 提取的文本内容 ---

${extractedText}

--- 提取完成 ---
总字符数: ${extractedText.length}
建议: 请检查提取的文本是否完整准确`;

      } else if (file.type.startsWith('image/')) {
        // 图片文件处理（暂不支持OCR）
        throw new Error('图片文件需要OCR功能，当前版本暂不支持。建议使用PDF格式的文件。');
      } else {
        // 其他文件类型
        throw new Error(`不支持的文件类型：${file.type}。目前仅支持PDF文件的文本提取。`);
      }

    } catch (error) {
      console.error('文件提取失败:', error);

      // 返回错误信息
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new Error(`文本提取失败: ${errorMessage}`);
    }
  };

  // 处理文件提取
  const handleFileExtraction = async (files: File[]) => {
    const validFiles = files.filter(isValidFile);

    if (validFiles.length === 0) {
      alert('请上传支持的文件格式：PDF');
      return;
    }

    const newExtractedFiles: ExtractedFile[] = validFiles.map(file => ({
      file,
      extractedText: '',
      status: 'extracting' as const
    }));

    setExtractedFiles(prev => [...prev, ...newExtractedFiles]);

    // 并行处理所有文件
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const fileIndex = extractedFiles.length + i;

      try {
        const extractedText = await extractTextFromFile(file);

        setExtractedFiles(prev =>
          prev.map((item, index) =>
            index === fileIndex
              ? { ...item, extractedText, status: 'success' as const }
              : item
          )
        );
      } catch (error) {
        setExtractedFiles(prev =>
          prev.map((item, index) =>
            index === fileIndex
              ? { ...item, status: 'error' as const, error: error instanceof Error ? error.message : '文本提取失败' }
              : item
          )
        );
      }
    }
  };

  // 拖拽处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileExtraction(files);
  };

  // 文件选择处理
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileExtraction(files);
    e.target.value = '';
  };

  // 删除文件
  const removeFile = (index: number) => {
    setExtractedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 下载提取的文本
  const downloadText = (file: ExtractedFile) => {
    const blob = new Blob([file.extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.file.name.replace(/\.[^/.]+$/, '')}_extracted.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <CyberpunkBackground intensity="medium" />

      <div className="relative z-10 h-full bg-gradient-to-br from-background/90 via-background/85 to-background/90 backdrop-blur-[2px]">

        {/* 顶部状态栏 */}
        <header className="relative z-20 h-16 flex items-center justify-between px-8 border-b border-primary/20 bg-background/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  PDF文本提取测试
                </h1>
                <p className="text-xs text-muted-foreground">支持 PDF 格式文本提取</p>
              </div>
            </div>
          </div>

          <ThemeToggle />
        </header>

        {/* 主内容区域 */}
        <div className="flex-1 overflow-hidden flex flex-col p-6">

          {/* 上传区域 */}
          <div className="mb-6">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
                isDragOver ? "border-primary bg-primary/10" : "border-muted-foreground/30",
                "hover:border-primary/50 hover:bg-primary/5"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">上传PDF文件进行文本提取</h3>
              <p className="text-sm text-muted-foreground mb-4">
                拖拽PDF文件到此处，或点击按钮选择PDF文件
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                支持格式：PDF（最大10MB）<br />
                注意：仅支持包含文本内容的PDF，不支持扫描版PDF
              </p>

              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary hover:bg-primary/90"
              >
                <Upload className="w-4 h-4 mr-2" />
                选择文件
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* 文件列表和结果 */}
          <div className="flex-1 overflow-y-auto">
            {extractedFiles.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>暂无文件，请上传文件开始文本提取</p>
              </div>
            ) : (
              <div className="space-y-4">
                {extractedFiles.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                          <h4 className="font-medium">{item.file.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {(item.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.status === 'extracting' && (
                          <div className="flex items-center gap-2 text-blue-500">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">提取中...</span>
                          </div>
                        )}

                        {item.status === 'success' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadText(item)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            下载
                          </Button>
                        )}

                        {item.status === 'error' && (
                          <div className="flex items-center gap-2 text-red-500">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">提取失败</span>
                          </div>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {item.status === 'success' && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium mb-2">提取的文本内容：</h5>
                        <div className="bg-muted/50 rounded p-3 text-sm max-h-40 overflow-y-auto">
                          <pre className="whitespace-pre-wrap">{item.extractedText}</pre>
                        </div>
                      </div>
                    )}

                    {item.status === 'error' && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {item.error || '未知错误'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
