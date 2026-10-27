import React, { useState, useEffect, useMemo } from 'react';
import { ProductDrop, ActiveTab, CategoryFilter } from './types';
import { DEFAULT_PRODUCTS, CATEGORIES } from './data/defaultProducts';
import { Header } from './components/Header';
import { CodeSearchInput } from './components/CodeSearchInput';
import { SpotlightProduct } from './components/SpotlightProduct';
import { ProductCard } from './components/ProductCard';
import { CreatorDashboard } from './components/CreatorDashboard';
import { HowItWorksModal } from './components/HowItWorksModal';
import { Toast } from './components/Toast';
import { 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Video, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

const STORAGE_KEY = 'dropfind_products_v1';

export default function App() {
  // Products state with localStorage persistence
  const [products, setProducts] = useState<ProductDrop[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse stored products', e);
    }
    return DEFAULT_PRODUCTS;
  });

  // Active view tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('visitor');

  // Search & Filter state
  const [searchCode, setSearchCode] = useState<string>('');
  const [spotlightProduct, setSpotlightProduct] = useState<ProductDrop | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [textSearch, setTextSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'price-asc' | 'price-desc'>('newest');

  // Modals & Toast
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to save products to localStorage', e);
    }
  }, [products]);

  // Handle URL Query Params on mount (e.g. ?code=104829 or ?tab=admin)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const codeParam = params.get('code');
      const tabParam = params.get('tab');

      if (tabParam === 'admin') {
        setActiveTab('admin');
      }

      if (codeParam) {
        const match = products.find(p => p.code === codeParam);
        if (match) {
          setSpotlightProduct(match);
          setSearchCode(codeParam);
        }
      }
    } catch {
      // ignore
    }
  }, [products]);

  // Show auto-dismissing toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 2400);
  };

  // Handle Code Search from Input Box
  const handleSearchByCode = (inputCode: string) => {
    const trimmed = inputCode.trim();
    setSearchCode(trimmed);

    if (!trimmed) {
      setSpotlightProduct(null);
      setSearchError(null);
      return;
    }

    if (trimmed.length < 6) {
      setSearchError('Please enter a full 6-digit article number.');
      setSpotlightProduct(null);
      return;
    }

    const found = products.find(p => p.code === trimmed);
    if (found) {
      setSpotlightProduct(found);
      setSearchError(null);
      showToast(`Found Drop: ${found.title.slice(0, 24)}...`);
    } else {
      setSpotlightProduct(null);
      setSearchError(`No product found for code #${trimmed}. Try one from recent drops below!`);
    }
  };

  // Track affiliate click
  const handleTrackClick = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, clicks: p.clicks + 1 } : p))
    );
  };

  // Add new product from creator dashboard
  const handleAddProduct = (newDrop: ProductDrop) => {
    setProducts(prev => [newDrop, ...prev]);
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    if (spotlightProduct && spotlightProduct.id === id) {
      setSpotlightProduct(null);
    }
    showToast('Drop removed from your store');
  };

  // Reset to default sample products
  const handleResetDefaults = () => {
    setProducts(DEFAULT_PRODUCTS);
    setSpotlightProduct(null);
    setSearchError(null);
    showToast('Reset to default creator drops');
  };

  // Select drop for visitor view from creator dashboard
  const handleSelectDropForVisitor = (code: string) => {
    setActiveTab('visitor');
    handleSearchByCode(code);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered & Sorted drops for Visitor Catalog
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchQuery =
        !textSearch.trim() ||
        p.title.toLowerCase().includes(textSearch.toLowerCase()) ||
        p.code.includes(textSearch) ||
        p.offer.toLowerCase().includes(textSearch.toLowerCase());
      return matchCat && matchQuery;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.clicks - a.clicks;
      if (sortBy === 'price-asc') {
        const numA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
        const numB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
        return numA - numB;
      }
      if (sortBy === 'price-desc') {
        const numA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
        const numB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
        return numB - numA;
      }
      return 0; // default newest insertion order
    });
  }, [products, categoryFilter, textSearch, sortBy]);

  // List of active codes for search suggestions
  const sampleCodes = products.map(p => p.code);

  return (
    <div className="bg-[#0c0d0e] text-zinc-100 min-h-screen selection:bg-amber-400 selection:text-black flex flex-col justify-between">
      {/* Ambient Gradient Glow Backdrop */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-indigo-500/10 blur-[130px] pointer-events-none -z-10" />

      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNavigateHome={() => {
          setActiveTab('visitor');
          setSpotlightProduct(null);
          setSearchError(null);
        }}
        onOpenHowItWorks={() => setHowItWorksOpen(true)}
        dropsCount={products.length}
      />

      {/* ========================================================= */}
      {/* VIEW 1: VISITOR EXPERIENCE (Shop by 6-Digit Code)         */}
      {/* ========================================================= */}
      {activeTab === 'visitor' && (
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 text-center w-full">
          {/* Eyebrow kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Seen it on my Reel or Short?</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight" style={{ textWrap: 'balance' }}>
            Type the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
              6-Digit Code
            </span>{' '}
            to buy.
          </h1>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base max-w-md mx-auto">
            Get the direct store link, current discount, and live verified deal from the video.
          </p>

          {/* 6-Digit Search Input */}
          <div className="mt-8">
            <CodeSearchInput
              onSearch={handleSearchByCode}
              sampleCodes={sampleCodes}
            />
            {searchError && (
              <p className="text-xs text-rose-400 mt-3 font-medium animate-fade-in">
                {searchError}
              </p>
            )}
          </div>

          {/* Spotlight Highlighted Result */}
          {spotlightProduct && (
            <div className="mt-6">
              <SpotlightProduct
                product={spotlightProduct}
                onClose={() => setSpotlightProduct(null)}
                onTrackClick={handleTrackClick}
                onShowToast={showToast}
              />
            </div>
          )}

          {/* Recent Video Drops Section */}
          <section className="mt-20 text-left border-t border-white/10 pt-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Recent Video Drops
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Every product featured in my recent videos. Click any drop to inspect or buy.
                </p>
              </div>

              {/* Search & Sort Controls */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={textSearch}
                    onChange={e => setTextSearch(e.target.value)}
                    placeholder="Search drops..."
                    className="pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition w-36 sm:w-44"
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 text-xs">
                  <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="bg-transparent text-zinc-300 focus:outline-none text-xs cursor-pointer"
                  >
                    <option value="newest" className="bg-zinc-900">Newest</option>
                    <option value="popular" className="bg-zinc-900">Most Clicked</option>
                    <option value="price-asc" className="bg-zinc-900">Price: Low to High</option>
                    <option value="price-desc" className="bg-zinc-900">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-8 scrollbar-none">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategoryFilter(cat.value)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                    categoryFilter === cat.value
                      ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                      : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={p => {
                      setSpotlightProduct(p);
                      window.scrollTo({ top: 320, behavior: 'smooth' });
                    }}
                    onTrackClick={handleTrackClick}
                    onShowToast={showToast}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-sm font-semibold text-zinc-300">No drops found</p>
                <p className="text-xs text-zinc-500 mt-1">Try resetting filters or searching a different term.</p>
                <button
                  onClick={() => {
                    setCategoryFilter('All');
                    setTextSearch('');
                  }}
                  className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/15 text-xs font-bold rounded-xl transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </section>
        </main>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: CREATOR DASHBOARD & DROP PUBLISHER                */}
      {/* ========================================================= */}
      {activeTab === 'admin' && (
        <main className="flex-1">
          <CreatorDashboard
            products={products}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onResetDefaults={handleResetDefaults}
            onSelectDropForVisitor={handleSelectDropForVisitor}
            onShowToast={showToast}
          />
        </main>
      )}

      {/* Bottom Footer */}
      <footer className="border-t border-white/10 py-8 bg-[#0a0a0c]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-zinc-300 tracking-tight">DROPFIND</span>
            <span>·</span>
            <span>Shop by Video Code</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setHowItWorksOpen(true)}
              className="hover:text-zinc-300 transition"
            >
              How it Works
            </button>
            <button
              onClick={() => setActiveTab(activeTab === 'visitor' ? 'admin' : 'visitor')}
              className="hover:text-amber-400 transition"
            >
              {activeTab === 'visitor' ? 'Switch to Creator Mode' : 'Switch to Visitor Store'}
            </button>
          </div>
        </div>
      </footer>

      {/* How it Works Modal */}
      {howItWorksOpen && (
        <HowItWorksModal
          onClose={() => setHowItWorksOpen(false)}
          onOpenCreator={() => setActiveTab('admin')}
        />
      )}

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
