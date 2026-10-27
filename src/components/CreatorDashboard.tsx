import React, { useState } from 'react';
import { ProductDrop, CategoryFilter } from '../types';
import { fetchUrlMetadata } from '../utils/metadataFetcher';
import { ProductImage } from './ProductImage';
import { VideoStickerModal } from './VideoStickerModal';
import { 
  Sparkles, 
  RefreshCw, 
  Trash2, 
  ExternalLink, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  RotateCcw,
  TrendingUp,
  Tag,
  Video
} from 'lucide-react';

interface CreatorDashboardProps {
  products: ProductDrop[];
  onAddProduct: (product: ProductDrop) => void;
  onDeleteProduct: (id: string) => void;
  onResetDefaults: () => void;
  onSelectDropForVisitor: (code: string) => void;
  onShowToast: (msg: string) => void;
}

const DEMO_PRESETS = [
  {
    name: 'Sony WH-1000XM5',
    url: 'https://amazon.com/dp/B09XS7JWHH',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    price: '$348',
    offer: 'BESTSELLER',
    category: 'Audio' as CategoryFilter,
    image: 'https://m.media-amazon.com/images/I/61+elL41-OL._AC_SL1500_.jpg'
  },
  {
    name: 'Apple AirPods Pro 2',
    url: 'https://apple.com/airpods-pro',
    title: 'Apple AirPods Pro 2 Wireless Earbuds with USB-C',
    price: '$199',
    offer: '20% OFF',
    category: 'Audio' as CategoryFilter,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800'
  },
  {
    name: 'NuPhy Air75 V2',
    url: 'https://nuphy.com/products/air75-v2',
    title: 'NuPhy Air75 V2 Wireless Mechanical Keyboard',
    price: '$119',
    offer: 'STAFF PICK',
    category: 'Tech & Setup' as CategoryFilter,
    image: 'https://m.media-amazon.com/images/I/61kWB+e9VUL._AC_SL1500_.jpg'
  }
];

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  products,
  onAddProduct,
  onDeleteProduct,
  onResetDefaults,
  onSelectDropForVisitor,
  onShowToast
}) => {
  // Form State
  const [url, setUrl] = useState('');
  const [code, setCode] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [offer, setOffer] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('Tech & Setup');
  const [image, setImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [storeName, setStoreName] = useState('Amazon');
  
  // Status states
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Sticker modal state
  const [selectedStickerProduct, setSelectedStickerProduct] = useState<ProductDrop | null>(null);

  // Generate unique code
  const handleRegenerateCode = () => {
    let newCode = '';
    do {
      newCode = Math.floor(100000 + Math.random() * 900000).toString();
    } while (products.some(p => p.code === newCode));
    setCode(newCode);
    onShowToast(`Generated new code #${newCode}`);
  };

  // Auto-fetch metadata from URL
  const handleAutoFetch = async () => {
    if (!url.trim()) {
      setFetchError('Please paste a product URL first.');
      return;
    }
    setFetchError(null);
    setIsFetching(true);

    try {
      const meta = await fetchUrlMetadata(url);
      if (meta.title) setTitle(meta.title);
      if (meta.image) setImage(meta.image);
      if (meta.publisher) setStoreName(meta.publisher);
      if (!price) setPrice(meta.suggestedPrice || 'Check Price');
      if (!offer) setOffer(meta.suggestedOffer || 'Special Deal');
      onShowToast('Metadata successfully extracted!');
    } catch (err: any) {
      setFetchError(err.message || 'Could not fetch metadata. You can enter details manually.');
    } finally {
      setIsFetching(false);
    }
  };

  // Apply quick demo preset
  const handleApplyPreset = (preset: typeof DEMO_PRESETS[0]) => {
    setUrl(preset.url);
    setTitle(preset.title);
    setPrice(preset.price);
    setOffer(preset.offer);
    setCategory(preset.category);
    setImage(preset.image);
    setStoreName('Online Store');
    onShowToast(`Applied preset: ${preset.name}`);
  };

  // Publish Drop
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setFetchError('URL is required');
      return;
    }
    if (!title.trim()) {
      setFetchError('Title is required');
      return;
    }

    // Check if code is already taken
    if (products.some(p => p.code === code)) {
      setFetchError('This 6-digit code is already in use. Please regenerate.');
      return;
    }

    const newDrop: ProductDrop = {
      id: `drop-${Date.now()}`,
      code,
      title: title.trim(),
      price: price.trim() || 'Check Price',
      originalPrice: originalPrice.trim() || undefined,
      offer: offer.trim() || 'Verified Deal',
      image: image.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      url: url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`,
      category,
      storeName: storeName.trim() || 'Store',
      videoUrl: videoUrl.trim() || undefined,
      clicks: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddProduct(newDrop);
    onShowToast(`Drop #${code} published successfully!`);

    // Reset form
    setUrl('');
    setTitle('');
    setPrice('');
    setOriginalPrice('');
    setOffer('');
    setImage('');
    setVideoUrl('');
    handleRegenerateCode();

    // Offer to immediately view in visitor mode or sticker
    setSelectedStickerProduct(newDrop);
  };

  const handleCopyCode = (c: string) => {
    navigator.clipboard.writeText(c);
    setCopiedCode(c);
    onShowToast(`Copied code #${c}`);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  // Aggregate stats
  const totalClicks = products.reduce((acc, p) => acc + p.clicks, 0);
  const topProduct = [...products].sort((a, b) => b.clicks - a.clicks)[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Creator Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Creator Studio & Drop Publisher
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Turn any product link into a memorable 6-digit code for your Reels, Shorts, and Stories.
          </p>
        </div>

        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs transition border border-white/5 self-start sm:self-auto"
          title="Reset to default items"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Drops</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="p-4 rounded-2xl bg-[#141618] border border-white/5">
          <span className="text-xs text-zinc-400 block">Total Active Drops</span>
          <span className="text-2xl font-black text-white font-code mt-1 block tabular-nums">
            {products.length}
          </span>
          <span className="text-[11px] text-zinc-500 mt-1 block">Live & searchable</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#141618] border border-white/5">
          <span className="text-xs text-zinc-400 block flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            Total Affiliate Clicks
          </span>
          <span className="text-2xl font-black text-amber-400 font-code mt-1 block tabular-nums">
            {totalClicks.toLocaleString()}
          </span>
          <span className="text-[11px] text-zinc-500 mt-1 block">Tracked referrals</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#141618] border border-white/5">
          <span className="text-xs text-zinc-400 block">Top Performer</span>
          <span className="text-sm font-bold text-white mt-1 block truncate">
            {topProduct ? topProduct.title : 'No drops yet'}
          </span>
          <span className="text-[11px] text-amber-400/80 font-code mt-1 block">
            {topProduct ? `#${topProduct.code} (${topProduct.clicks} clicks)` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Add New Product Form Card */}
      <div className="bg-[#141618] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative mb-12">
        <div className="flex items-center justify-between pb-6 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-white">Add New Product Drop</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Paste your affiliate URL to auto-extract image, title, and create the 6-digit code.
            </p>
          </div>
          <span className="text-xs bg-amber-400/10 text-amber-400 border border-amber-400/20 px-3 py-1 rounded-full font-code">
            Auto-Fetcher
          </span>
        </div>

        {/* Quick Demo Preset Buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-500">Quick Demo Presets:</span>
          {DEMO_PRESETS.map(preset => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-2.5 py-1 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5 transition"
            >
              + {preset.name}
            </button>
          ))}
        </div>

        <form onSubmit={handlePublish} className="mt-6 space-y-5">
          {/* Step 1: URL Input + Live Fetch Button */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              1. Product / Affiliate Link
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://amazon.com/dp/... or any store URL"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-amber-400 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={handleAutoFetch}
                disabled={isFetching}
                className="px-5 py-3 bg-white hover:bg-zinc-200 active:scale-95 text-black font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 whitespace-nowrap shrink-0 disabled:opacity-50"
              >
                {isFetching ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Fetch Details</span>
                  </>
                )}
              </button>
            </div>
            {fetchError && (
              <p className="text-xs text-rose-400 mt-2 font-medium">{fetchError}</p>
            )}
          </div>

          {/* Step 2: 6-Digit Code */}
          <div className="pt-4 border-t border-white/5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              2. Unique 6-Digit Video Code
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={code}
                readOnly
                className="w-36 px-4 py-2.5 bg-black/50 border border-amber-400/50 text-amber-300 font-code font-bold text-lg rounded-xl text-center"
              />
              <button
                type="button"
                onClick={handleRegenerateCode}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold border border-white/5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reroll Code</span>
              </button>
              <span className="text-xs text-zinc-500 hidden sm:inline">
                Place this in your Reel overlay & caption!
              </span>
            </div>
          </div>

          {/* Step 3: Product Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              3. Product Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 focus:border-amber-400 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Step 4: Pricing, Offer & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Display Price
              </label>
              <input
                type="text"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="e.g. $99 or ₹1,499"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 focus:border-amber-400 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Offer / Badge Tag
              </label>
              <input
                type="text"
                value={offer}
                onChange={e => setOffer(e.target.value)}
                placeholder="e.g. 25% OFF or Deal"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 focus:border-amber-400 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CategoryFilter)}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-white/10 focus:border-amber-400 rounded-xl text-sm text-white focus:outline-none transition"
              >
                <option value="Tech & Setup">Tech & Setup</option>
                <option value="Audio">Audio</option>
                <option value="EDC & Gadgets">EDC & Gadgets</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>
          </div>

          {/* Step 5: Image Link & Real-Time Preview */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Image URL
            </label>
            <input
              type="text"
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="Auto-extracted image link or paste any image URL"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 focus:border-amber-400 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none transition"
            />

            {image && (
              <div className="mt-3 flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/10">
                <div className="w-14 h-14 bg-white rounded-lg p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  <ProductImage src={image} alt="Thumbnail preview" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Image loaded</span>
                  <span className="text-[11px] text-zinc-400 block truncate max-w-xs sm:max-w-md">
                    {image}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Optional: Video / Reel URL */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-rose-400" />
              <span>Video Link (Optional - Reel, TikTok, or Short URL)</span>
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://instagram.com/reels/... or https://tiktok.com/@..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 focus:border-amber-400 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-sm rounded-xl transition shadow-lg shadow-amber-400/20 active:scale-95"
          >
            Publish Drop Now 🚀
          </button>
        </form>
      </div>

      {/* Published Drops Management Table */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Your Published Drops</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Manage your active video codes and download overlay stickers.
            </p>
          </div>
          <span className="text-xs font-code text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            {products.length} live
          </span>
        </div>

        <div className="space-y-3">
          {products.map(p => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-[#141618] border border-white/5 hover:border-white/15 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                  <ProductImage src={p.image} alt={p.title} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-code text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      #{p.code}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {p.category} · {p.price}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white line-clamp-1 mt-1">
                    {p.title}
                  </h4>
                  <span className="text-[11px] text-zinc-500">
                    {p.clicks} shoppers clicked buy · Created {p.createdAt}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedStickerProduct(p)}
                  className="px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-bold text-xs border border-amber-400/30 transition flex items-center gap-1"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Sticker</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyCode(p.code)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs border border-white/5 transition flex items-center gap-1"
                  title="Copy 6-digit code"
                >
                  {copiedCode === p.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === p.code ? 'Copied' : 'Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectDropForVisitor(p.code)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs border border-white/5 transition flex items-center gap-1"
                  title="Test in visitor view"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Search</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteProduct(p.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs border border-rose-500/20 transition"
                  title="Delete drop"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Overlay Sticker Modal */}
      {selectedStickerProduct && (
        <VideoStickerModal
          product={selectedStickerProduct}
          onClose={() => setSelectedStickerProduct(null)}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
