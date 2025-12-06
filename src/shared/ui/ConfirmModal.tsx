'use client';

import { X, AlertCircle, AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

type ConfirmType = 'danger' | 'warning';

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
  isLoading?: boolean;
};

const typeConfig: Record<ConfirmType, { icon: typeof AlertCircle; iconColor: string; bgColor: string; buttonColor: string }> = {
  danger: {
    icon: AlertCircle,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
    buttonColor: 'bg-red-500 hover:bg-red-600',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
  },
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  type = 'warning',
  isLoading = false,
}: ConfirmModalProps) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, isLoading]);

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-6">
          <div className={`${config.bgColor} p-2 rounded-full shrink-0`}>
            <Icon size={20} className={config.iconColor} />
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <h2 className="text-lg font-semibold text-slate-900 mb-2">{title}</h2>
            )}
            <p className="text-sm text-slate-600 whitespace-pre-line">{message}</p>
          </div>
          {!isLoading && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-50 rounded-full shrink-0"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-6 py-2.5 text-sm font-medium text-white ${config.buttonColor} rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? '처리 중...' : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

