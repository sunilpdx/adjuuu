import React from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#181a1d] text-white text-xs font-semibold rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl animate-fade-in">
      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
        <Check className="w-3 h-3 stroke-[3]" />
      </div>
      <span>{message}</span>
    </div>
  );
};
