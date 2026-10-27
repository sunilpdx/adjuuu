import React, { useState } from 'react';
import { ProductDrop } from '../types';
import { ProductImage } from './ProductImage';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface ProductCardProps {
  product: ProductDrop;
  onSelect: (product: ProductDrop) => void;
  onTrackClick: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onTrackClick,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(product.code);
    setCopied(true);
    onShowToast(`Copied code #${product.code}`);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTrackClick(product.id);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="bg-[#141618] border border-white/10 hover:border-amber-400/50 p-4 sm:p-5 rounded-2xl transition duration-200 flex flex-col justify-between group cursor-pointer hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5"
    >
      <div>
        {/* Product Image Stage */}
        <div className="relative h-48 bg-white rounded-xl flex items-center justify-center p-4 overflow-hidden mb-4 shadow-inner">
          {/* Article Code Badge */}
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 bg-black/85 backdrop-blur-md text-white px-2 py-0.5 rounded-md border border-white/10">
            <span className="font-code text-[11px] font-bold text-amber-300">
              #{product.code}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-md bg-black/75 hover:bg-black text-zinc-300 hover:text-white backdrop-blur-md border border-white/10 transition"
            title="Copy 6-digit code"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <ProductImage
            src={product.image}
            alt={product.title}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Category & Offer Line (Unboxed, clean) */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
          <span className="font-medium text-[11px] uppercase tracking-wider text-amber-400">
            {product.offer || 'Deal'}
          </span>
          <span className="text-zinc-500 text-[11px]">
            {product.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-amber-200 transition-colors line-clamp-2 leading-snug">
          {product.title}
        </h3>
      </div>

      {/* Footer: Price and CTA */}
      <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between gap-3">
        <div>
          <span className="text-base font-bold text-white tabular-nums">
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="ml-1.5 text-xs text-zinc-500 line-through tabular-nums">
              {product.originalPrice}
            </span>
          )}
        </div>

        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleBuyClick}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-amber-400 hover:text-black text-zinc-200 hover:font-bold text-xs font-semibold rounded-lg transition duration-150 active:scale-95"
        >
          <span>Get Deal</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
