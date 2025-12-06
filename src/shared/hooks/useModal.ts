'use client';

import { useState, useCallback } from 'react';

type AlertType = 'success' | 'error' | 'info' | 'warning';

type AlertOptions = {
  title?: string;
  message: string;
  type?: AlertType;
};

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning';
  onCancel?: () => void;
};

export const useModal = () => {
  const [alertState, setAlertState] = useState<{ isOpen: boolean } & AlertOptions>({
    isOpen: false,
    message: '',
  });

  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; onConfirm?: () => void; onCancel?: () => void } & ConfirmOptions>({
    isOpen: false,
    message: '',
  });

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertState({
      isOpen: true,
      ...options,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions & { onConfirm: () => void }) => {
    const { onConfirm, onCancel, ...rest } = options;
    setConfirmState({
      isOpen: true,
      onConfirm,
      onCancel,
      ...rest,
    });
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false, onConfirm: undefined, onCancel: undefined }));
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmState.onConfirm) {
      confirmState.onConfirm();
    }
    hideConfirm();
  }, [confirmState.onConfirm, hideConfirm]);

  return {
    alert: {
      ...alertState,
      show: showAlert,
      hide: hideAlert,
    },
    confirm: {
      ...confirmState,
      show: showConfirm,
      hide: hideConfirm,
      onConfirm: handleConfirm,
    },
  };
};

