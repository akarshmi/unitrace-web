import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div 
        className="w-full max-w-md bg-white border-2 border-black p-6 shadow-none"
        role="dialog"
        aria-modal="true"
      >
        <div className="text-xs uppercase tracking-widest text-[#142B4A] font-semibold mb-2">
          Security Protocol Confirmation
        </div>
        <h3 className="text-xl font-heading text-black mb-2">{title}</h3>
        <p className="text-sm text-neutral-600 mb-6 leading-relaxed">{description}</p>
        
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium border border-neutral-300 hover:border-black text-black bg-white transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 text-sm font-medium text-white transition-colors cursor-pointer ${
              isDestructive 
                ? 'bg-red-700 hover:bg-red-800' 
                : 'bg-[#142B4A] hover:bg-[#1D3B63]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
