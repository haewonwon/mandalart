'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, ImageIcon, X, Bug, Lightbulb, MessageSquare } from 'lucide-react';
import { createClient } from '@/shared/lib/supabase/client';
import { useAuthSession } from '@/features/auth/model/useAuthSession';
import { useRouter } from 'next/navigation';
import { useModal } from '@/shared/hooks/useModal';
import { AlertModal } from '@/shared/ui/AlertModal';

export const FeedbackPage = () => {
  const supabase = createClient();
  const { session } = useAuthSession();
  const router = useRouter();
  const modal = useModal();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'BUG' | 'FEATURE' | 'OTHER'>('OTHER');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      // 개수 제한 체크
      if (files.length + selectedFiles.length > 3) {
        modal.alert.show({
          type: 'warning',
          message: '이미지는 최대 3장까지만 첨부할 수 있어요!',
        });
        return;
      }

      // 기존 파일에 추가
      setFiles((prev) => [...prev, ...selectedFiles]);

      // 미리보기 URL 생성
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }

    // 같은 파일 다시 선택 가능하게 input 초기화
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 선택한 이미지 삭제
  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      // 메모리 누수 방지 (URL 해제)
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      modal.alert.show({
        type: 'warning',
        message: '내용을 입력해주세요!',
      });
      return;
    }
    if (!session?.user) {
      modal.alert.show({
        type: 'error',
        message: '로그인이 필요합니다.',
      });
      return;
    }

    setIsUploading(true);

    try {
      // 1. 이미지 병렬 업로드 (Promise.all)
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        // 파일명: 유저ID/타임스탬프_랜덤.확장자
        const fileName = `${session.user.id}/${Date.now()}_${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('feedback-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // 공개 URL 가져오기
        const { data } = supabase.storage.from('feedback-images').getPublicUrl(fileName);

        return data.publicUrl;
      });

      // 모든 이미지 업로드 완료 대기
      const imageUrls = await Promise.all(uploadPromises);

      // 2. DB 저장
      const { error: dbError } = await supabase.from('feedbacks').insert({
        user_id: session.user.id,
        category,
        content,
        images: imageUrls,
      });

      if (dbError) throw dbError;

      // 초기화
      setContent('');
      setFiles([]);
      setPreviews([]);

      modal.alert.show({
        type: 'success',
        message: '소중한 피드백 감사합니다!',
      });

      // 모달이 닫힌 후 대시보드로 이동
      setTimeout(() => {
        modal.alert.hide();
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('피드백 전송 실패:', error);
      modal.alert.show({
        type: 'error',
        message: '전송 중 오류가 발생했습니다.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="flex flex-col flex-1 bg-slate-50 min-h-screen">
      {/* Custom Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-semibold text-slate-900 text-lg">피드백 보내기</h1>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-12 sm:px-8">
        <section className="w-full max-w-2xl space-y-8">
          <header className="mb-6 space-y-2 text-center sm:text-left">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">FEEDBACK</p>
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">피드백 보내기</h2>
            <p className="text-base text-slate-600">불편한 점이나 개선 아이디어를 알려주세요.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 카테고리 선택 */}
            <div className="space-y-3 rounded-lg bg-white border border-slate-200 px-6 py-5">
              <label className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
                카테고리
              </label>
              <div className="flex flex-wrap gap-2">
                {(['BUG', 'FEATURE', 'OTHER'] as const).map((cat) => {
                  const Icon = cat === 'BUG' ? Bug : cat === 'FEATURE' ? Lightbulb : MessageSquare;
                  const label = cat === 'BUG' ? '버그' : cat === 'FEATURE' ? '제안' : '기타';
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                        category === cat
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 내용 입력 */}
            <div className="space-y-3 rounded-lg bg-white border border-slate-200 px-6 py-5">
              <label
                htmlFor="content"
                className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 block"
              >
                내용
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="어떤 점이 불편하셨나요? 자유롭게 말씀해주세요."
                className="h-32 w-full resize-none rounded-md border border-slate-200 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                required
              />
            </div>

            {/* 이미지 첨부 영역 */}
            <div className="space-y-3 rounded-lg bg-white border border-slate-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
                  이미지 첨부
                </label>
                <span className="text-xs text-slate-400">({files.length}/3)</span>
              </div>

              {/* 이미지 미리보기 그리드 */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {previews.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                    >
                      <Image src={url} alt="preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {files.length < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 w-full rounded-md border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <ImageIcon size={18} className="text-slate-400" />
                  사진 추가
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* 하단 버튼 */}
            <div className="flex justify-end gap-3 pt-4">
              <Link
                href="/dashboard"
                className="rounded-md border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={isUploading}
                className="flex items-center gap-2 rounded-md bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    전송 중...
                  </>
                ) : (
                  '보내기'
                )}
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={modal.alert.isOpen}
        onClose={modal.alert.hide}
        message={modal.alert.message}
        type={modal.alert.type}
        title={modal.alert.title}
      />
    </main>
  );
};
