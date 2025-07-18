import { useState, useRef } from 'react';
import { ExtractedFile } from '../types';
import { isValidFile, extractTextFromFile } from '../utils/fileUtils';

export const usePDFExtraction = () => {
  const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileExtraction(files);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setExtractedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return {
    extractedFiles,
    isDragOver,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    removeFile
  };
};
