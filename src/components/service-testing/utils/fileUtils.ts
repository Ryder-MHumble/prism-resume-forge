import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import { SUPPORTED_FILE_TYPES, SUPPORTED_FILE_EXTENSIONS } from './constants';

// 检查文件类型
export const isValidFile = (file: File): boolean => {
  const isValidType = SUPPORTED_FILE_TYPES.includes(file.type);
  const isValidExtension = SUPPORTED_FILE_EXTENSIONS.some(ext =>
    file.name.toLowerCase().endsWith(ext)
  );
  return isValidType || isValidExtension;
};

// 检查是否为PDF文件
export const isPDFFile = (file: File): boolean => {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
};

// 检查是否为图片文件
export const isImageFile = (file: File): boolean => {
  return ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type) ||
         ['.png', '.jpg', '.jpeg', '.webp'].some(ext => file.name.toLowerCase().endsWith(ext));
};

// 使用PDF.js提取PDF文本（原有方法）
export const extractTextFromPDFWithPDFJS = async (file: File): Promise<string> => {
  try {
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    }

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

    return `=== PDF.js 文本提取结果 ===

文件名: ${file.name}
文件大小: ${(file.size / 1024 / 1024).toFixed(2)} MB
页数: ${pdf.numPages}
提取时间: ${new Date().toLocaleString()}
提取方法: PDF.js

--- 提取的文本内容 ---

${extractedText}

--- 提取完成 ---
总字符数: ${extractedText.length}
建议: 请检查提取的文本是否完整准确`;

  } catch (error) {
    console.error('PDF.js提取失败:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    throw new Error(`PDF.js文本提取失败: ${errorMessage}`);
  }
};

// 使用react-pdftotext提取PDF文本（新方法）
export const extractTextFromPDFWithReactPDFToText = async (file: File): Promise<string> => {
  try {
    // 动态导入react-pdftotext
    const pdfToText = (await import('react-pdftotext')).default;
    
    const startTime = Date.now();
    const extractedText = await pdfToText(file);
    const processingTime = Date.now() - startTime;

    if (!extractedText || extractedText.trim() === '') {
      throw new Error('PDF文件中未找到可提取的文本内容');
    }

    return `=== React-PDFToText 提取结果 ===

文件名: ${file.name}
文件大小: ${(file.size / 1024 / 1024).toFixed(2)} MB
提取时间: ${new Date().toLocaleString()}
处理耗时: ${processingTime}ms
提取方法: React-PDFToText

--- 提取的文本内容 ---

${extractedText.trim()}

--- 提取完成 ---
总字符数: ${extractedText.length}
建议: 请检查提取的文本是否完整准确`;

  } catch (error) {
    console.error('React-PDFToText提取失败:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    throw new Error(`React-PDFToText文本提取失败: ${errorMessage}`);
  }
};

// 清理和优化OCR文本（保守模式 - 保留原文结构）
const cleanOCRText = (text: string): string => {
  return text
    // 保留原始换行结构，只清理每行内的多余空格
    .split('\n')
    .map(line => {
      // 清理行内的多余空格，但保留必要的空格
      return line
        // 清理连续的空格，但保留单个空格
        .replace(/\s{2,}/g, ' ')
        // 清理行首行尾空格
        .trim();
    })
    .join('\n')
    // 清理中文标点符号前后的多余空格
    .replace(/\s*([，。！？；：""''（）【】])\s*/g, '$1')
    // 清理英文标点符号前后的多余空格
    .replace(/\s*([,.!?;:()\[\]{}"'`])\s*/g, '$1')
    // 修复常见的OCR错误（但保持谨慎）
    .replace(/\b[0O]{2,}\b/g, '00') // 修复数字0和字母O的混淆（仅在单词边界）
    .replace(/\b[1l]{2,}\b/g, '11') // 修复数字1和字母l的混淆（仅在单词边界）
    .replace(/\b[5S]{2,}\b/g, '55') // 修复数字5和字母S的混淆（仅在单词边界）
    .replace(/\b[8B]{2,}\b/g, '88') // 修复数字8和字母B的混淆（仅在单词边界）
    // 清理重复的字符（但保持谨慎）
    .replace(/(.)\1{4,}/g, '$1$1$1$1') // 限制重复字符最多4个
    // 修复常见的格式问题
    .replace(/([a-zA-Z])\s+([a-zA-Z])/g, '$1 $2') // 英文单词间保持一个空格
    .replace(/([0-9])\s+([0-9])/g, '$1$2') // 数字间移除空格
    // 清理多余的空行，但保留段落结构
    .replace(/\n{4,}/g, '\n\n\n')
    // 最终清理
    .trim();
};

// 更保守的文本清理（仅清理空格，保留所有结构）
const cleanOCRTextConservative = (text: string): string => {
  return text
    // 保留原始换行结构，只清理每行内的多余空格
    .split('\n')
    .map(line => {
      // 只清理连续的空格，保留所有其他内容
      return line
        .replace(/\s{2,}/g, ' ') // 将多个空格替换为单个空格
        .trim(); // 清理行首行尾空格
    })
    .join('\n')
    // 清理标点符号前后的多余空格
    .replace(/\s*([，。！？；：""''（）【】,.!?;:()\[\]{}"'`])\s*/g, '$1')
    // 最终清理
    .trim();
};

// 使用Tesseract.js提取图片文本
export const extractTextFromImageWithTesseract = async (
  file: File, 
  enableTextOptimization: boolean = true,
  conservativeMode: boolean = false
): Promise<{
  text: string;
  confidence: number;
  processingTime: number;
}> => {
  try {
    const startTime = Date.now();
    
    const worker = await createWorker('chi_sim+eng', 1, {
      logger: m => console.log(m)
    });

    const { data: { text, confidence } } = await worker.recognize(file);
    await worker.terminate();

    const processingTime = Date.now() - startTime;

    if (!text || text.trim() === '') {
      throw new Error('图片中未识别到文字内容');
    }

    // 清理和优化提取的文本
    let finalText: string;
    let optimizationStatus: string;
    
    if (!enableTextOptimization) {
      finalText = text.trim();
      optimizationStatus = '已禁用';
    } else if (conservativeMode) {
      finalText = cleanOCRTextConservative(text);
      optimizationStatus = '保守模式（保留结构）';
    } else {
      finalText = cleanOCRText(text);
      optimizationStatus = '标准模式';
    }

    return {
      text: `=== Tesseract.js OCR 提取结果 ===

文件名: ${file.name}
文件大小: ${(file.size / 1024 / 1024).toFixed(2)} MB
提取时间: ${new Date().toLocaleString()}
处理耗时: ${processingTime}ms
识别置信度: ${confidence.toFixed(2)}%
提取方法: Tesseract.js OCR
文本优化: ${optimizationStatus}

--- 提取的文本内容 ---

${finalText}

--- 提取完成 ---
总字符数: ${finalText.length}
原始字符数: ${text.length}
置信度: ${confidence.toFixed(2)}%
${enableTextOptimization 
  ? conservativeMode 
    ? '优化说明: 保守模式 - 仅清理多余空格和标点符号周围空白，完整保留原文结构和换行' 
    : '优化说明: 标准模式 - 清理多余空格、标点符号周围空白，并修复常见OCR错误'
  : '优化说明: 保持原始提取结果，未进行文本优化'
}
建议: 置信度越高，识别准确度越好`,
      confidence,
      processingTime
    };

  } catch (error) {
    console.error('Tesseract.js提取失败:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    throw new Error(`Tesseract.js OCR提取失败: ${errorMessage}`);
  }
};

// 统一的文件文本提取函数
export const extractTextFromFile = async (
  file: File, 
  method: 'pdfjs' | 'react-pdftotext' | 'tesseract' = 'pdfjs',
  enableTextOptimization: boolean = true,
  conservativeMode: boolean = false
): Promise<string> => {
  try {
    if (isPDFFile(file)) {
      if (method === 'react-pdftotext') {
        return await extractTextFromPDFWithReactPDFToText(file);
      } else {
        return await extractTextFromPDFWithPDFJS(file);
      }
    } else if (isImageFile(file)) {
      if (method === 'tesseract') {
        const result = await extractTextFromImageWithTesseract(file, enableTextOptimization, conservativeMode);
        return result.text;
      } else {
        throw new Error('图片文件只能使用Tesseract.js方法提取');
      }
    } else {
      throw new Error(`不支持的文件类型：${file.type}。目前支持PDF和图片文件的文本提取。`);
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
