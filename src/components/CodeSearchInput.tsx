import React, { useState } from 'react';
import { Search, Sparkles, X } from 'lucide-react';

interface CodeSearchInputProps {
  onSearch: (code: string) => void;
  sampleCodes: string[];
}

export const CodeSearchInput: React.FC<CodeSearchInputProps> = ({
  onSearch,
  sampleCodes
}) => {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setValue(numeric);
    if (numeric.length === 6) {
      onSearch(numeric);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-zinc-900/90 border border-white/15 focus-within:border-amber-400/80 rounded-2xl p-2 shadow-2xl backdrop-blur-xl transition duration-200"
      >
        <div className="pl-3.5 pr-2 text-zinc-500">
          <Search className="w-5 h-5 text-amber-400" />
        </div>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={value}
          onChange={handleChange}
          placeholder="Enter 6-digit video code (e.g. 104829)"
          className="w-full bg-transparent text-white placeholder-zinc-500 text-lg sm:text-xl font-bold font-code tracking-widest focus:outline-none px-2 py-2"
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-zinc-400 hover:text-white transition mr-1"
            title="Clear code"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="px-5 py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-black font-bold text-xs sm:text-sm rounded-xl transition duration-150 shadow-lg shadow-amber-400/20 whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <span>Find Product</span>
          <span className="font-sans font-bold">→</span>
        </button>
      </form>

      {/* Suggested Quick Test Codes */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
        <span className="flex items-center gap-1 text-zinc-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Try live drops:
        </span>
        {sampleCodes.slice(0, 4).map(code => (
          <button
            key={code}
            type="button"
            onClick={() => {
              setValue(code);
              onSearch(code);
            }}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-amber-400/10 hover:text-amber-300 border border-white/10 font-code font-semibold transition"
          >
            #{code}
          </button>
        ))}
      </div>
    </div>
  );
};
