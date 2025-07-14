import { useState, useCallback } from 'react';
import { UploadedFiles, DragState, FileValidationResult } from '@/types';
import { validateFileType, processDraggedFiles, isResumeFile, isJDFile } from '@/services/fileService';

export const useFileUpload = (initialFiles: UploadedFiles = {}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>(initialFiles);
  const [dragState, setDragState] = useState<DragState>({ resume: false, jd: false });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 处理文件选择
  const handleFileSelect = useCallback((file: File, type: 'resume' | 'jd') => {
    const validation = validateFileType(file, type);

    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, [type]: validation.error || '文件验证失败' }));
      return false;
    }

    setUploadedFiles(prev => ({ ...prev, [type]: file }));
    setErrors(prev => ({ ...prev, [type]: '' }));
    return true;
  }, []);

  // 处理文件移除
  const handleFileRemove = useCallback((type: 'resume' | 'jd') => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[type];
      return newFiles;
    });
    setErrors(prev => ({ ...prev, [type]: '' }));
  }, []);

  // 拖拽相关处理函数
  const handleDragOver = useCallback((e: React.DragEvent, type: 'resume' | 'jd') => {
    e.preventDefault();
    setDragState(prev => ({ ...prev, [type]: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, type: 'resume' | 'jd') => {
    e.preventDefault();
    setDragState(prev => ({ ...prev, [type]: false }));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, type: 'resume' | 'jd') => {
    e.preventDefault();
    setDragState(prev => ({ ...prev, [type]: false }));

    const files = Array.from(e.dataTransfer.files);
    const targetFile = files.find(file =>
      type === 'resume' ? isResumeFile(file) : isJDFile(file)
    );

    if (targetFile) {
      handleFileSelect(targetFile, type);
    }
  }, [handleFileSelect]);

  // 批量处理拖拽文件
  const handleBatchDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragState({ resume: false, jd: false });

    const newFiles = processDraggedFiles(e.dataTransfer.files, uploadedFiles);
    setUploadedFiles(newFiles);
  }, [uploadedFiles]);

  // 清空所有文件
  const clearAllFiles = useCallback(() => {
    setUploadedFiles({});
    setErrors({});
  }, []);

  // 获取文件信息
  const getFileInfo = useCallback((type: 'resume' | 'jd') => {
    const file = uploadedFiles[type];
    if (!file) return null;

    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    };
  }, [uploadedFiles]);

  // 检查是否可以开始分析
  const canStartAnalysis = uploadedFiles.resume !== undefined;

  return {
    uploadedFiles,
    dragState,
    errors,
    canStartAnalysis,
    handleFileSelect,
    handleFileRemove,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleBatchDrop,
    clearAllFiles,
    getFileInfo,
    setUploadedFiles
  };
};
