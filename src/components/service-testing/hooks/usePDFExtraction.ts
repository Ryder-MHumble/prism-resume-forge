import { useState, useRef } from 'react';
import { ExtractedFile, ImageExtractionResult } from '../types';
import { isValidFile, extractTextFromFile, isPDFFile, isImageFile } from '../utils/fileUtils';

export const usePDFExtraction = () => {
  const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([]);
  const [imageResults, setImageResults] = useState<ImageExtractionResult[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [extractionMethod, setExtractionMethod] = useState<'pdfjs' | 'react-pdftotext' | 'tesseract'>('pdfjs');
  const [enableTextOptimization, setEnableTextOptimization] = useState(true);
  const [conservativeMode, setConservativeMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件提取
  const handleFileExtraction = async (files: File[]) => {
    const validFiles = files.filter(isValidFile);

    if (validFiles.length === 0) {
      alert('请上传支持的文件格式：PDF、PNG、JPG、JPEG、WebP');
      return;
    }

    // 分离PDF和图片文件
    const pdfFiles = validFiles.filter(isPDFFile);
    const imageFiles = validFiles.filter(isImageFile);

    // 处理PDF文件
    if (pdfFiles.length > 0) {
      const newExtractedFiles: ExtractedFile[] = pdfFiles.map(file => ({
        file,
        extractedText: '',
        status: 'extracting' as const,
        extractionMethod: extractionMethod === 'tesseract' ? 'pdfjs' : extractionMethod,
        fileType: 'pdf'
      }));

      setExtractedFiles(prev => [...prev, ...newExtractedFiles]);

      for (let i = 0; i < pdfFiles.length; i++) {
        const file = pdfFiles[i];
        const fileIndex = extractedFiles.length + i;
        const method = extractionMethod === 'tesseract' ? 'pdfjs' : extractionMethod;

        try {
          const extractedText = await extractTextFromFile(file, method);

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
    }

    // 处理图片文件
    if (imageFiles.length > 0) {
      const newImageResults: ImageExtractionResult[] = imageFiles.map(file => ({
        file,
        extractedText: '',
        status: 'extracting' as const
      }));

      setImageResults(prev => [...prev, ...newImageResults]);

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fileIndex = imageResults.length + i;

        try {
          const extractedText = await extractTextFromFile(file, 'tesseract', enableTextOptimization, conservativeMode);

          setImageResults(prev =>
            prev.map((item, index) =>
              index === fileIndex
                ? { ...item, extractedText, status: 'success' as const }
                : item
            )
          );
        } catch (error) {
          setImageResults(prev =>
            prev.map((item, index) =>
              index === fileIndex
                ? { ...item, status: 'error' as const, error: error instanceof Error ? error.message : 'OCR提取失败' }
                : item
            )
          );
        }
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

  const removeFile = (index: number, type: 'pdf' | 'image') => {
    if (type === 'pdf') {
      setExtractedFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      setImageResults(prev => prev.filter((_, i) => i !== index));
    }
  };

  const clearAllResults = () => {
    setExtractedFiles([]);
    setImageResults([]);
  };

  return {
    extractedFiles,
    imageResults,
    isDragOver,
    fileInputRef,
    extractionMethod,
    enableTextOptimization,
    conservativeMode,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    removeFile,
    clearAllResults,
    setExtractionMethod,
    setEnableTextOptimization,
    setConservativeMode
  };
};
