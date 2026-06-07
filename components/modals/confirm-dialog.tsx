'use client';

import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, description, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'default', onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800 animate-scale-in">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{description}</p>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 pt-0">
          <Button variant="outline" onClick={onCancel}>{cancelText}</Button>
          <Button variant={variant === 'destructive' ? 'destructive' : 'primary'} onClick={onConfirm}>{confirmText}</Button>
        </div>
      </div>
    </div>
  );
}
