export interface ExtractedMetadata {
  title: string;
  image: string;
  description?: string;
  publisher?: string;
  suggestedPrice?: string;
  suggestedOffer?: string;
}

export async function fetchUrlMetadata(url: string): Promise<ExtractedMetadata> {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    throw new Error('Please enter a valid URL');
  }

  let domain = '';
  try {
    const parsed = new URL(trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`);
    domain = parsed.hostname.replace('www.', '');
  } catch {
    throw new Error('Invalid URL format. Include http:// or https://');
  }

  // Attempt live extraction via Microlink API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(trimmedUrl)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && json.data) {
        const { title, description, image, publisher } = json.data;
        const imageUrl = image?.url || '';
        
        // Clean up title if it contains store suffix
        let cleanTitle = title || '';
        if (cleanTitle) {
          cleanTitle = cleanTitle
            .replace(/\s*:\s*Amazon\.[a-z.]+/i, '')
            .replace(/\s*\|\s*Best Buy/i, '')
            .replace(/\s*\|\s*eBay/i, '')
            .replace(/Amazon\.com:\s*/i, '')
            .trim();
        }

        return {
          title: cleanTitle || fallbackTitleFromUrl(trimmedUrl, domain),
          image: imageUrl || fallbackImageForDomain(domain),
          description: description || '',
          publisher: publisher || domain,
          suggestedPrice: 'Check Price',
          suggestedOffer: 'Verified Deal'
        };
      }
    }
  } catch (err) {
    console.warn('Microlink fetch error or timeout, applying domain fallback', err);
  }

  // Fallback extraction from URL slug and domain
  return {
    title: fallbackTitleFromUrl(trimmedUrl, domain),
    image: fallbackImageForDomain(domain),
    publisher: domain,
    suggestedPrice: 'Check Price',
    suggestedOffer: 'Featured Deal'
  };
}

function fallbackTitleFromUrl(urlStr: string, domain: string): string {
  try {
    const url = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`);
    const pathname = url.pathname;
    const parts = pathname.split('/').filter(Boolean);
    
    // Look for slug in pathname
    const slug = parts.find(p => p.length > 5 && !p.startsWith('dp') && !p.startsWith('gp') && !/^[A-Z0-9]{10}$/.test(p));
    if (slug) {
      const readable = slug
        .replace(/[-_+]/g, ' ')
        .replace(/\.[a-z0-9]+$/i, '')
        .split(' ')
        .filter(w => w.length > 1)
        .slice(0, 7)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
      if (readable.length > 5) return readable;
    }
  } catch {
    // ignore
  }
  return `Featured Product from ${domain || 'Store'}`;
}

function fallbackImageForDomain(domain: string): string {
  if (domain.includes('amazon')) {
    return 'https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg';
  }
  return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800';
}
