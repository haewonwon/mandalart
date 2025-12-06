import { toCanvas } from 'html-to-image';
import jsPDF from 'jspdf';

export const exportMandalartAsPDF = async (
  element: HTMLElement,
  fileName: string = 'mandalart-grid'
): Promise<void> => {
  // 요소를 화면에 완전히 보이도록 스크롤
  element.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
  
  // 스크롤 후 잠시 대기 (렌더링 완료 대기)
  await new Promise(resolve => setTimeout(resolve, 200));

  // 만다라트를 고해상도로 캡처 (pixelRatio 3으로 높은 해상도)
  const canvas = await toCanvas(element, {
    cacheBust: true,
    pixelRatio: 3, // 고해상도
    backgroundColor: '#ffffff',
    quality: 1.0,
  });

  // 고품질 렌더링 설정
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }

  const imgData = canvas.toDataURL('image/png', 1.0); // 최고 품질
  const pdf = new jsPDF({
    orientation: 'portrait', // 세로 방향
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // 이미지 비율 유지하면서 A4에 맞춤
  const imgAspectRatio = canvas.width / canvas.height;
  const pdfAspectRatio = pdfWidth / pdfHeight;

  let imgWidth: number;
  let imgHeight: number;
  let x: number;
  let y: number;

  if (imgAspectRatio > pdfAspectRatio) {
    // 이미지가 더 넓음 - 가로에 맞춤
    imgWidth = pdfWidth * 0.9; // 여백 10%
    imgHeight = imgWidth / imgAspectRatio;
    x = (pdfWidth - imgWidth) / 2;
    y = (pdfHeight - imgHeight) / 2;
  } else {
    // 이미지가 더 높음 - 세로에 맞춤
    imgHeight = pdfHeight * 0.9; // 여백 10%
    imgWidth = imgHeight * imgAspectRatio;
    x = (pdfWidth - imgWidth) / 2;
    y = (pdfHeight - imgHeight) / 2;
  }

  pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
  pdf.save(`${fileName}.pdf`);
};
