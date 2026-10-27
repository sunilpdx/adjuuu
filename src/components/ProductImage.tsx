import React, { useState } from 'react';
import { Package, ShoppingBag } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = 'max-h-full max-w-full object-contain',
  containerClassName = 'relative w-full h-full flex items-center justify-center'
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // If no source or error, show sophisticated fallback
  if (!src || error) {
    return (
      <div className={`${containerClassName} bg-zinc-900 border border-white/5`}>
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2 text-amber-400">
            <Package className="w-6 h-6 stroke-[1.5]" />
          </div>
          <span className="text-[11px] font-medium text-zinc-400 line-clamp-1 max-w-[140px]">
            {alt || 'Verified Product'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      {!loaded && (
        <div className="absolute inset-0 bg-white/[0.03] animate-pulse flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-zinc-600" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};
