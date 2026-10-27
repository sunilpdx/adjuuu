import React from 'react';
import { X, Smartphone, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
  onOpenCreator: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  onClose,
  onOpenCreator
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-[#141618] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-xl font-bold text-white">How DROPFIND Works</h3>
        </div>
        <p className="text-xs text-zinc-400 mb-6">
          The fastest way to link products featured in short-form video content.
        </p>

        <div className="space-y-6">
          {/* For Shoppers */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-3">
              For Viewers & Shoppers
            </span>
            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <span>Spot the 6-digit code in the creator's Reel, TikTok, or Short (e.g. <code>#104829</code>).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <span>Type or paste the code into DROPFIND search.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <span>Instantly see the exact product with live discount price and verified direct store link!</span>
              </div>
            </div>
          </div>

          {/* For Creators */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-3">
              For Creators & Influencers
            </span>
            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Paste your Amazon or affiliate URL; our tool auto-extracts the photo and title.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Generate a unique 6-digit code and export high-res sticker graphics for video overlays.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Track exact purchase clicks and see which product converts highest.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition"
          >
            Got it
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenCreator();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl transition"
          >
            <span>Open Creator Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
