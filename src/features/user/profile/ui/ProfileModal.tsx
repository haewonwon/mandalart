'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '../model/useProfile';
import { X, User as UserIcon } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useModal } from '@/shared/hooks';
import { AlertModal } from '@/shared/ui';
import { formatError } from '@/shared/lib';

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const modal = useModal();
  const { profile, updateProfile, isSaving } = useProfile();
  const [editName, setEditName] = useState('');

  // 모달이 열릴 때 닉네임 상태 동기화
  useEffect(() => {
    if (isOpen && profile) {
      setEditName(profile.nickname);
    }
  }, [isOpen, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(editName);
      modal.alert.show({
        type: 'success',
        message: '프로필이 수정되었습니다.',
      });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error: any) {
      modal.alert.show({
        type: 'error',
        message: formatError(error, '프로필 수정 중 오류가 발생했습니다.'),
      });
    }
  };

  if (!isOpen) return null;

  // Portal을 사용하여 body 바로 아래에 렌더링
  return createPortal(
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <div className="bg-slate-100 p-2 rounded-full">
              <UserIcon size={20} className="text-slate-700" />
            </div>
            내 프로필
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-50 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 focus:outline-none cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-400">이메일은 변경할 수 없습니다.</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition"
              placeholder="이름을 입력하세요"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSaving || editName === profile?.nickname}
              className="px-6 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>

    {/* Alert Modal */}
    <AlertModal
      isOpen={modal.alert.isOpen}
      onClose={modal.alert.hide}
      title={modal.alert.title}
      message={modal.alert.message}
      type={modal.alert.type}
    />
    </>,
    document.body
  );
};
