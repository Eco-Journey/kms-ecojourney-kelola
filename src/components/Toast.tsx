import React, { useEffect } from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({
  message,
  type,
  onClose,
}: ToastProps): React.ReactElement {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-kms-green-status" />,
    error: <XCircle className="w-5 h-5 text-kms-red" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  };

  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
    warning: "bg-yellow-50 border-yellow-200",
  };

  return (
    <div className="fixed bottom-6 lg:bottom-10 right-6 lg:right-10 z-[120] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div
        className={`flex items-start space-x-3 px-4 py-3.5 rounded-lg border shadow-lg max-w-sm ${bgColors[type]}`}
      >
        <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
        <p className="text-sm font-semibold text-gray-800 leading-snug">
          {message}
        </p>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer p-1 rounded-md hover:bg-black/5 transition-colors border-none bg-transparent"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
