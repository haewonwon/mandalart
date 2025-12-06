'use client';

import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

type AlertType = 'success' | 'error' | 'info' | 'warning';

type AlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: AlertType;
};

const typeConfig: Record<AlertType, { icon: typeof AlertCircle; iconColor: string; bgColor: string }> = {
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
};

export const AlertModal = ({ isOpen, onClose, title, message, type = 'info' }: AlertModalProps) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

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
        <div className="flex items-start gap-4">
          <div className={`${config.bgColor} p-2 rounded-full shrink-0`}>
            <Icon size={20} className={config.iconColor} />
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <h2 className="text-lg font-semibold text-slate-900 mb-2">{title}</h2>
            )}
            <p className="text-sm text-slate-600 whitespace-pre-line">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-50 rounded-full shrink-0"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition"
          >
            확인
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

