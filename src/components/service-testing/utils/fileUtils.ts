import * as pdfjsLib from 'pdfjs-dist';
import { SUPPORTED_FILE_TYPES, SUPPORTED_FILE_EXTENSIONS } from './constants';

// 检查文件类型
export const isValidFile = (file: File): boolean => {
  const isValidType = SUPPORTED_FILE_TYPES.includes(file.type);
  const isValidExtension = SUPPORTED_FILE_EXTENSIONS.some(ext =>
    file.name.toLowerCase().endsWith(ext)
  );
  return isValidType || isValidExtension;
};

// PDF文本提取功能
export const extractTextFromFile = async (file: File): Promise<string> => {
  try {
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    }

    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (isPDF) {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const loadingTask = pdfjsLib.getDocument(uint8Array);
      const pdf = await loadingTask.promise;

      let extractedText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');

        extractedText += pageText + '\n\n';
      }

      extractedText = extractedText.trim();

      if (!extractedText) {
        throw new Error('PDF文件中未找到可提取的文本内容，可能是扫描版PDF');
      }

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

    } else {
      throw new Error(`不支持的文件类型：${file.type}。目前仅支持PDF文件的文本提取。`);
    }

  } catch (error) {
    console.error('文件提取失败:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    throw new Error(`文本提取失败: ${errorMessage}`);
  }
};

// 下载文本文件
export const downloadTextFile = (text: string, filename: string): void => {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
