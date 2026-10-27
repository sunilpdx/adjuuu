import React, { useState } from 'react';
import { ProductDrop } from '../types';
import { ProductImage } from './ProductImage';
import { ExternalLink, Copy, Check, QrCode, Video, X } from 'lucide-react';

interface SpotlightProductProps {
  product: ProductDrop;
  onClose: () => void;
  onTrackClick: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const SpotlightProduct: React.FC<SpotlightProductProps> = ({
  product,
  onClose,
  onTrackClick,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(product.code);
    setCopied(true);
    onShowToast(`Copied code #${product.code} to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?code=${product.code}`;
    navigator.clipboard.writeText(url);
    onShowToast(`Direct link copied: ?code=${product.code}`);
  };

  const handleBuyClick = () => {
    onTrackClick(product.id);
  };

  const directUrl = `${window.location.origin}${window.location.pathname}?code=${product.code}`;
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(directUrl)}&bgcolor=141618&color=facc15`;

  return (
    <div className="relative w-full max-w-2xl mx-auto my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#181a1d] to-[#121316] border-2 border-amber-400/50 shadow-2xl shadow-amber-400/5 text-left transition-all">
      {/* Dismiss button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
        title="Close spotlight"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header Info: Code + Offer */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pr-8">
        <div className="flex items-center gap-2">
          <span className="font-code text-xs sm:text-sm font-bold bg-amber-400 text-black px-3 py-1 rounded-lg tracking-wider">
            #{product.code}
          </span>
          <span className="text-xs text-zinc-400">
            {product.category} · {product.storeName || 'Online Store'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
            {product.offer || 'Verified Deal'}
          </span>
        </div>
      </div>

      {/* Main Grid: Image & Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        {/* Product Image Frame */}
        <div className="relative h-64 sm:h-72 bg-white rounded-2xl p-6 flex items-center justify-center overflow-hidden group shadow-inner">
          <ProductImage
            src={product.image}
            alt={product.title}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {product.originalPrice && (
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
              Original: <span className="line-through">{product.originalPrice}</span>
            </div>
          )}
        </div>

        {/* Details & Actions */}
        <div className="flex flex-col justify-between h-full">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-3 leading-snug">
              {product.title}
            </h3>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-amber-400 tabular-nums">
                {product.price}
              </span>
              <span className="text-xs text-zinc-400">
                · {product.clicks} people bought this
              </span>
            </div>

            {product.videoUrl && (
              <a
                href={product.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-300 transition"
              >
                <Video className="w-3.5 h-3.5 text-rose-400" />
                <span>Featured in Reel / Short</span>
              </a>
            )}
          </div>

          {/* Primary CTA and Utility Bar */}
          <div className="mt-6 space-y-2.5">
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleBuyClick}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold rounded-xl text-sm transition duration-150 shadow-lg shadow-amber-400/20 active:scale-95"
            >
              <span>Buy Now on {product.storeName || 'Store'}</span>
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white border border-white/10 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Code Copied' : 'Copy Code'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowQR(!showQR)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white border border-white/10 transition"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{showQR ? 'Hide QR' : 'Scan QR'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full text-center text-xs text-zinc-400 hover:text-amber-400 transition py-1"
            >
              Copy direct share link
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Expansion */}
      {showQR && (
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <div className="bg-white p-2 rounded-xl">
            <img src={qrSvgUrl} alt={`QR Code for #${product.code}`} className="w-28 h-28" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Scan with phone camera</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs">
              Opens this exact drop page on your phone immediately with deal verified.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
