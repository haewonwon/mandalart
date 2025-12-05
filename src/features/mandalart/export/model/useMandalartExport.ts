'use client';

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const useMandalartExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const downloadImage = async (fileName: string = 'mandalart-grid') => {
    if (!exportRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 2, // 고해상도
        backgroundColor: '#ffffff',
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Image export failed:', error);
      alert('이미지 저장에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadPDF = async (fileName: string = 'mandalart-grid') => {
    if (!exportRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // 중앙 정렬
      const x = 0;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF 저장에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportRef,
    isExporting,
    downloadImage,
    downloadPDF,
  };
};
