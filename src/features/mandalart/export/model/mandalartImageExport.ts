import { toPng } from 'html-to-image';
import { type MandalartGrid, type MandalartSubGridKey } from '@/entities/mandalart';

export const exportMandalartAsImage = async (
  element: HTMLElement,
  fileName: string = 'mandalart-grid',
  year?: number | null
): Promise<void> => {
  // 요소를 화면에 완전히 보이도록 스크롤
  element.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
  
  // 스크롤 후 잠시 대기 (렌더링 완료 대기)
  await new Promise(resolve => setTimeout(resolve, 200));

  // 만다라트를 고해상도로 캡처 (pixelRatio 3으로 높은 해상도)
  const mandalartDataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 3, // 고해상도 (Retina 디스플레이 대응)
    backgroundColor: 'transparent',
    quality: 1.0,
  });

  // 9:16 비율의 최종 이미지 생성 (인스타그램 스토리용)
  // 고해상도로 생성 (2배 크기)
  const finalWidth = 2160; // 9:16 비율의 가로 크기 (1080 * 2)
  const finalHeight = 3840; // 9:16 비율의 세로 크기 (1920 * 2)

  // 만다라트 이미지를 로드
  const img = new Image();
  img.src = mandalartDataUrl;
  
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });

  // 고해상도 캔버스 생성
  const canvas = document.createElement('canvas');
  canvas.width = finalWidth;
  canvas.height = finalHeight;
  const ctx = canvas.getContext('2d', {
    alpha: false, // 알파 채널 비활성화로 성능 향상
    desynchronized: false,
  });
  
  if (!ctx) {
    throw new Error('Canvas context를 가져올 수 없습니다.');
  }

  // 고품질 렌더링 설정
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 흰색 배경 채우기
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, finalWidth, finalHeight);

  // 만다라트를 중앙에 배치 (비율 유지하면서 fit)
  const mandalartAspectRatio = img.width / img.height;
  const targetAspectRatio = finalWidth / finalHeight;

  let drawWidth: number;
  let drawHeight: number;
  let offsetX: number;
  let offsetY: number;

  // 만다라트 크기 계산 (로고/텍스트 공간 고려)
  const topMargin = finalHeight * 0.08; // 상단 여백 8%
  const bottomMargin = finalHeight * 0.05; // 하단 여백 5%
  const availableHeight = finalHeight - topMargin - bottomMargin;
  const availableWidth = finalWidth * 0.95; // 좌우 여백 2.5%씩

  // 만다라트 크기 재계산
  if (mandalartAspectRatio > (availableWidth / availableHeight)) {
    // 만다라트가 더 넓음 - 가로에 맞춤
    drawWidth = availableWidth;
    drawHeight = drawWidth / mandalartAspectRatio;
    offsetX = (finalWidth - drawWidth) / 2;
    offsetY = topMargin + (availableHeight - drawHeight) / 2;
  } else {
    // 만다라트가 더 높음 - 세로에 맞춤
    drawHeight = availableHeight;
    drawWidth = drawHeight * mandalartAspectRatio;
    offsetX = (finalWidth - drawWidth) / 2;
    offsetY = topMargin + (availableHeight - drawHeight) / 2;
  }

  // 만다라트 이미지 그리기
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

  // 로고 이미지 로드 및 추가 (만다라트 바로 위에 배치)
  try {
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/mandalart_logo.png';
    
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('로고 로드 타임아웃')), 3000);
      logoImg.onload = () => {
        clearTimeout(timeout);
        resolve(undefined);
      };
      logoImg.onerror = () => {
        // PNG 로고가 없으면 SVG 시도
        logoImg.src = '/mandalart_logo.svg';
        logoImg.onload = () => {
          clearTimeout(timeout);
          resolve(undefined);
        };
        logoImg.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('로고를 로드할 수 없습니다'));
        };
      };
    });

    // 로고 크기 계산
    const logoHeight = finalHeight * 0.04; // 화면 높이의 4%
    const logoAspectRatio = logoImg.width / logoImg.height;
    const logoWidth = logoHeight * logoAspectRatio;
    const logoX = (finalWidth - logoWidth) / 2;
    
    // 연도 텍스트 높이 계산
    let textHeight = 0;
    if (year) {
      const text = `${year} MANDALART`;
      ctx.font = `bold ${finalHeight * 0.03}px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif`;
      const textMetrics = ctx.measureText(text);
      textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    }
    
    // 위치 계산: 로고(위) -> 텍스트(중간) -> 만다라트(아래)
    const logoY = offsetY - logoHeight - textHeight - finalHeight * 0.05; // 만다라트 위에서 로고+텍스트+간격 (5%로 증가)
    const textY = logoY + logoHeight + finalHeight * 0.02; // 로고 아래 2% 간격 (1%에서 2%로 증가)

    // 1. 로고 그리기 (가장 위)
    ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);

    // 2. 연도 텍스트 그리기 (로고 아래)
    if (year) {
      const text = `${year} MANDALART`;
      ctx.fillStyle = '#1f2937'; // text-gray-800
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(text, finalWidth / 2, textY);
    }
  } catch (logoError) {
    console.warn('로고를 추가할 수 없습니다:', logoError);
    // 로고가 없어도 계속 진행
  }

  // 최종 이미지 다운로드 (고품질 PNG)
  const finalDataUrl = canvas.toDataURL('image/png', 1.0); // 최고 품질
  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = finalDataUrl;
  link.click();
};

