import React, { useRef, useState } from 'react';
import { ProductDrop } from '../types';
import { Download, Check, X, Sparkles } from 'lucide-react';

interface VideoStickerModalProps {
  product: ProductDrop;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const VideoStickerModal: React.FC<VideoStickerModalProps> = ({
  product,
  onClose,
  onShowToast
}) => {
  const [style, setStyle] = useState<'minimal' | 'amber' | 'story'>('amber');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (style === 'minimal') {
      canvas.width = 600;
      canvas.height = 160;
      // Background rounded pill
      ctx.fillStyle = '#0f1115';
      ctx.beginPath();
      ctx.roundRect(10, 10, 580, 140, 36);
      ctx.fill();
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Brand text
      ctx.fillStyle = '#9ca3af';
      ctx.font = '600 24px system-ui, sans-serif';
      ctx.fillText('DROPFIND CODE:', 45, 90);

      // Code text
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 44px monospace';
      ctx.fillText(`#${product.code}`, 310, 93);
    } else if (style === 'amber') {
      canvas.width = 640;
      canvas.height = 180;
      // Background
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.roundRect(10, 10, 620, 160, 32);
      ctx.fill();

      // Black text
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText('CODE IN BIO / REEL LINK:', 40, 65);

      ctx.fillStyle = '#000000';
      ctx.font = '900 52px monospace';
      ctx.fillText(`#${product.code}`, 40, 125);

      ctx.fillStyle = '#1f2937';
      ctx.font = '600 22px system-ui, sans-serif';
      ctx.fillText(product.offer || 'Verified Deal', 420, 115);
    } else {
      // Story sticker (Instagram/TikTok sticker look)
      canvas.width = 600;
      canvas.height = 240;
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.roundRect(10, 10, 580, 220, 32);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px system-ui, sans-serif';
      ctx.fillText('TAP LINK IN BIO ⚡', 40, 65);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '900 56px monospace';
      ctx.fillText(`#${product.code}`, 40, 135);

      ctx.fillStyle = '#a1a1aa';
      ctx.font = '500 20px system-ui, sans-serif';
      ctx.fillText(`${product.title.slice(0, 32)}...`, 40, 185);
    }

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `dropfind-code-${product.code}.png`;
    a.click();
    onShowToast(`Downloaded sticker for #${product.code}`);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`Code: #${product.code} on Dropfind (Link in bio)`);
    setCopied(true);
    onShowToast('Copied caption text for your Reel/Short description!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#141618] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-xl font-bold text-white">Video Overlay & Sticker</h3>
        </div>
        <p className="text-xs text-zinc-400 mb-6">
          Put this code overlay directly on your Instagram Reel, TikTok, or YouTube Short video.
        </p>

        {/* Style Selector */}
        <div className="flex items-center gap-2 mb-6 p-1 bg-white/5 rounded-xl border border-white/5">
          <button
            onClick={() => setStyle('amber')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              style === 'amber' ? 'bg-amber-400 text-black shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Amber Banner
          </button>
          <button
            onClick={() => setStyle('minimal')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              style === 'minimal' ? 'bg-white/15 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Minimal Dark
          </button>
          <button
            onClick={() => setStyle('story')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              style === 'story' ? 'bg-white/15 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Story Card
          </button>
        </div>

        {/* Live Visual Preview */}
        <div className="p-6 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center min-h-[160px] text-center">
          {style === 'amber' && (
            <div className="bg-amber-400 text-black px-6 py-4 rounded-2xl shadow-xl border border-amber-300 max-w-sm w-full">
              <span className="block text-[11px] font-bold uppercase tracking-wider opacity-85">
                Code on Dropfind:
              </span>
              <span className="font-code text-3xl sm:text-4xl font-extrabold tracking-wider block mt-0.5">
                #{product.code}
              </span>
              <span className="block text-xs font-semibold mt-1">
                {product.offer || 'Live Deal'} · Link in Bio
              </span>
            </div>
          )}

          {style === 'minimal' && (
            <div className="bg-zinc-900 border border-zinc-700 px-6 py-4 rounded-full shadow-2xl flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Drop Code:
              </span>
              <span className="font-code text-2xl font-black text-amber-400">
                #{product.code}
              </span>
            </div>
          )}

          {style === 'story' && (
            <div className="bg-[#18181b] border-2 border-amber-400/80 p-4 rounded-2xl text-left max-w-xs w-full">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Tap Link in Bio ⚡
              </span>
              <span className="font-code text-2xl font-black text-white mt-1 block">
                #{product.code}
              </span>
              <span className="text-xs text-zinc-400 line-clamp-1 mt-1 block">
                {product.title}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded-xl transition shadow-lg shadow-amber-400/20 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG Overlay</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition border border-white/10 active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4" />}
            <span>Copy Caption Text</span>
          </button>
        </div>

        <p className="text-[11px] text-zinc-500 text-center mt-4">
          Ready to import as an overlay sticker in CapCut, InShot, VN, or Instagram Reels.
        </p>
      </div>
    </div>
  );
};
