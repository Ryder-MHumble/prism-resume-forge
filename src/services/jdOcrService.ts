import { createWorker } from 'tesseract.js';

// 仅用于 JD 文本的保守清理，尽量保留原始结构
const cleanOCRTextConservative = (text: string): string => {
  return text
    .split('\n')
    .map(line => line.replace(/\s{2,}/g, ' ').trim())
    .join('\n')
    .replace(/\s*([，。！？；：""''（）【】,.!?;:()\[\]{}"'`])\s*/g, '$1')
    .trim();
};

const isImageFile = (file: File): boolean => {
  const typeOk = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type);
  const extOk = ['.png', '.jpg', '.jpeg', '.webp'].some(ext => file.name.toLowerCase().endsWith(ext));
  return typeOk || extOk;
};

/**
 * 使用 Tesseract.js 提取 JD 图片文本（中英混合识别，保守清理）
 */
export const extractJDTextFromImage = async (file: File): Promise<string> => {
  if (!isImageFile(file)) {
    throw new Error('仅支持 PNG/JPG/JPEG/WebP 图片作为JD提取');
  }

  const worker = await createWorker('chi_sim+eng', 1, { logger: () => {} });
  try {
    const { data: { text } } = await worker.recognize(file);
    const finalText = cleanOCRTextConservative(text || '');
    if (!finalText.trim()) {
      throw new Error('未从图片中识别出有效文字');
    }
    return finalText;
  } finally {
    await worker.terminate();
  }
};


