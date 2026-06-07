'use client';

import { useState, createContext, useContext } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

const DialogContext = createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({ open: false, onOpenChange: () => {} });

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => onOpenChange(false)}
          />
          <div className="relative z-50 animate-scale-in">
            {children}
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function DialogContent({ children, className = '', title, description }: DialogContentProps) {
  const { onOpenChange } = useContext(DialogContext);

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 ${className}`}>
      {(title || description) && (
        <div className="p-6 pb-0">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
      <button
        onClick={() => onOpenChange(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
}

export function DialogTrigger({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const { onOpenChange } = useContext(DialogContext);
  return (
    <div onClick={() => { onOpenChange(true); onClick?.(); }} className="cursor-pointer">
      {children}
    </div>
  );
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-3 p-6 pt-0">
      {children}
    </div>
  );
}
