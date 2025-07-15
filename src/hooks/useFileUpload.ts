import { useState, useEffect, useCallback } from 'react';
import { FILE_VALIDATION, ANIMATION_CONFIG } from '@/constants/portal';

export type FileType = 'resume' | 'jd';
export type UploadedFiles = { resume?: File; jd?: File };
export type DragState = { resume: boolean; jd: boolean };
export type ActivePanel = 'upload' | 'ready';

interface UseFileUploadReturn {
  uploadedFiles: UploadedFiles;
  isDragOver: DragState;
  activePanel: ActivePanel;
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFiles>>;
  setActivePanel: React.Dispatch<React.SetStateAction<ActivePanel>>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>, type: FileType) => void;
  handleDragOver: (e: React.DragEvent, type: FileType) => void;
  handleDragLeave: (e: React.DragEvent, type: FileType) => void;
  handleDrop: (e: React.DragEvent, type: FileType) => void;
  isValidFile: (file: File, type: FileType) => boolean;
  canStartAnalysis: boolean;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({});
  const [isDragOver, setIsDragOver] = useState<DragState>({ resume: false, jd: false });
  const [activePanel, setActivePanel] = useState<ActivePanel>('upload');

  // 自动跳转逻辑
  useEffect(() => {
    if (uploadedFiles.resume && uploadedFiles.jd) {
      setTimeout(() => {
        setActivePanel('ready');
      }, ANIMATION_CONFIG.panelSwitchDelay);
    } else if (!uploadedFiles.resume && !uploadedFiles.jd) {
      setActivePanel('upload');
    }
  }, [uploadedFiles.resume, uploadedFiles.jd]);

  // 文件类型验证
  const isValidFile = useCallback((file: File, type: FileType): boolean => {
    const config = FILE_VALIDATION[type];

    return config.types.some(fileType => file.type.includes(fileType)) ||
           config.extensions.some(ext => file.name.toLowerCase().endsWith(ext));
  }, []);

  // 拖拽处理
  const handleDragOver = useCallback((e: React.DragEvent, type: FileType) => {
    e.preventDefault();
    setIsDragOver(prev => ({ ...prev, [type]: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, type: FileType) => {
    e.preventDefault();
    setIsDragOver(prev => ({ ...prev, [type]: false }));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, type: FileType) => {
    e.preventDefault();
    setIsDragOver(prev => ({ ...prev, [type]: false }));

    const files = Array.from(e.dataTransfer.files);
    const targetFile = files.find(file => isValidFile(file, type));

    if (targetFile) {
      setUploadedFiles(prev => ({ ...prev, [type]: targetFile }));
    }
  }, [isValidFile]);

  // 文件选择处理
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: FileType) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isValidFile(file, type)) {
        setUploadedFiles(prev => ({ ...prev, [type]: file }));
      } else {
        const typeNames = { resume: '简历', jd: 'JD' };
        const config = FILE_VALIDATION[type];
        alert(`不支持的文件格式。${typeNames[type]}文件支持的格式：${config.extensions.join(', ')}`);
      }
    }
    // 重置input值，允许重复选择同一文件
    e.target.value = '';
  }, [isValidFile]);

  const canStartAnalysis = !!uploadedFiles.resume;

  return {
    uploadedFiles,
    isDragOver,
    activePanel,
    setUploadedFiles,
    setActivePanel,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isValidFile,
    canStartAnalysis
  };
};
