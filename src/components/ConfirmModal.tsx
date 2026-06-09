import React from "react";
import { X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "green" | "red";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Ya",
  cancelText = "Batal",
  confirmColor = "green",
  onConfirm,
  onCancel,
}: ConfirmModalProps): React.ReactElement | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1.5 rounded-full hover:bg-gray-200 border-none bg-transparent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">
          <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer border-none bg-transparent"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-semibold text-white rounded-md transition-all shadow-sm cursor-pointer border-none ${
                confirmColor === "red"
                  ? "bg-kms-red hover:bg-red-700 focus:ring-red-500"
                  : "bg-kms-green-dark hover:bg-[#1E301D] focus:ring-kms-green-dark"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
