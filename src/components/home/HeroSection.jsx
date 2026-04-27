import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { Search, ArrowLeft, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const all = await staticClient.entities.SiteSettings.list();
      return all[0] || {};
    }
  });

  const { data: homeSettings } = useQuery({
    queryKey: ['homePageSettings'],
    queryFn: async () => {
      const all = await staticClient.entities.HomePageSettings.list();
      return all[0] || {};
    }
  });

  // Use homeSettings first, then fall back to siteSettings
  const heroImage = homeSettings?.hero_image_url || settings?.hero_image_url;
  const heroTitle = homeSettings?.hero_title || settings?.hero_title || 'הֶאָרָה';
  const heroSubtitle = homeSettings?.hero_subtitle || settings?.hero_subtitle || 'להאיר את הנשמה, לחזק את הרוח';
  const heroDescription = homeSettings?.hero_description || settings?.hero_description || 'מאמרי עומק בתורה, אמונה וחכמת החיים';

  useEffect(() => {
    const search = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }
      
      setIsSearching(true);
      const all = await staticClient.entities.Article.filter({ published: true });
      const results = all.filter(article =>
        article.title?.includes(searchQuery) ||
        article.excerpt?.includes(searchQuery)
      ).slice(0, 5);
      
      setSearchResults(results);
      setShowResults(true);
      setIsSearching(false);
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `${createPageUrl('SearchResults')}?q=${searchQuery}`;
    }
  };

  // Show loading state or solid background while settings load
  if (settingsLoading) {
    return (
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#1e3a5f]">
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            הֶאָרָה
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image - Only render if we have an image */}
      <div className="absolute inset-0">
        {heroImage ? (
          <img
            src={heroImage}
            alt="רקע"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1e3a5f] to-[#2a4a6f]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/35" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
          {heroTitle}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-3 font-light">
          {heroSubtitle}
        </p>
        <p className="text-base md:text-lg text-white/70 mb-10 max-w-2xl mx-auto">
          {heroDescription}
        </p>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="חפשו מאמרים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              className="w-full h-14 pr-12 pl-4 rounded-2xl bg-white/95 backdrop-blur-sm border-0 text-[#1e3a5f] text-base shadow-lg"
              dir="rtl"
            />
            {isSearching && (
              <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a90a4] animate-spin" />
            )}
          </form>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full right-0 left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
              {searchResults.map((article) => (
                <Link
                  key={article.id}
                  to={`${createPageUrl('Article')}?id=${article.id}`}
                  className="block px-4 py-3 hover:bg-[#f8f6f3] transition-colors border-b border-slate-50 last:border-0"
                >
                  <h4 className="font-medium text-[#1e3a5f] text-sm line-clamp-1">{article.title}</h4>
                  <p className="text-slate-500 text-xs line-clamp-1 mt-1">{article.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Link
          to={createPageUrl('AllArticles')}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#1e3a5f] rounded-full font-medium hover:bg-white/90 transition-all shadow-lg text-base"
        >
          {homeSettings?.hero_cta_text || 'לכל המאמרים'}
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Scroll indicator - Now clickable */}
      <button
        onClick={() => {
          const nextSection = document.querySelector('section:nth-of-type(2)');
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform"
        aria-label="גלול למטה"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce"></div>
        </div>
      </button>
    </section>
  );
}