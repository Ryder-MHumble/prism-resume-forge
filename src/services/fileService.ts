import { UploadedFiles, FileValidationResult, AnalysisMode } from '@/types';

/**
 * 文件类型验证
 */
export const validateFileType = (file: File, type: 'resume' | 'jd'): FileValidationResult => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];

  if (type === 'jd') {
    allowedMimeTypes.push('image/png', 'image/jpeg', 'image/jpg');
    allowedExtensions.push('.png', '.jpg', '.jpeg');
  }

  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  const hasValidMimeType = allowedMimeTypes.includes(file.type) || file.type === '';

  if (!hasValidExtension && !hasValidMimeType) {
    return {
      isValid: false,
      error: `不支持的文件格式。请上传 ${allowedExtensions.join(', ')} 格式的文件`,
      type
    };
  }

  // 文件大小检查 (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: '文件大小不能超过 10MB',
      type
    };
  }

  return {
    isValid: true,
    type
  };
};

/**
 * 检查是否为简历文件
 */
export const isResumeFile = (file: File): boolean => {
  const result = validateFileType(file, 'resume');
  return result.isValid;
};

/**
 * 检查是否为JD文件
 */
export const isJDFile = (file: File): boolean => {
  const result = validateFileType(file, 'jd');
  return result.isValid;
};

/**
 * 处理文件上传
 */
export const handleFileUpload = async (
  file: File,
  type: 'resume' | 'jd'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const validation = validateFileType(file, type);

    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      };
    }

    // 这里可以添加实际的文件上传逻辑
    // 比如上传到服务器或者存储到本地

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: '文件上传失败，请重试'
    };
  }
};

/**
 * 批量处理拖拽文件
 */
export const processDraggedFiles = (
  files: FileList,
  currentFiles: UploadedFiles
): UploadedFiles => {
  const newFiles = { ...currentFiles };

  Array.from(files).forEach(file => {
    if (isResumeFile(file) && !newFiles.resume) {
      newFiles.resume = file;
    } else if (isJDFile(file) && !newFiles.jd) {
      newFiles.jd = file;
    }
  });

  return newFiles;
};

/**
 * 获取文件信息
 */
export const getFileInfo = (file: File) => {
  return {
    name: file.name,
    size: formatFileSize(file.size),
    type: file.type,
    lastModified: new Date(file.lastModified).toLocaleDateString()
  };
};

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 检查是否可以开始分析
 */
export const canStartAnalysis = (files: UploadedFiles): boolean => {
  return !!files.resume; // 至少需要简历文件
};

/**
 * 创建分析请求
 */
export const createAnalysisRequest = (files: UploadedFiles, mode: AnalysisMode) => {
  return {
    files,
    mode,
    timestamp: Date.now()
  };
};
