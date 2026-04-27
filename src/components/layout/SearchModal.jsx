import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { X, Search, Loader2 } from 'lucide-react';
import { staticClient } from '@/api/staticClient';
import { Input } from '@/components/ui/input';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        const articles = await staticClient.entities.Article.filter({ published: true });
        const filtered = articles.filter(article => 
          article.title?.includes(query) ||
          article.excerpt?.includes(query) ||
          article.content?.includes(query) ||
          article.tags?.some(tag => tag.includes(query))
        );
        setResults(filtered.slice(0, 10));
      } catch (error) {
        console.error('Search error:', error);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  if (!isOpen) return null;

  const categoryLabels = {
    'פרשת_שבוע': 'פרשת שבוע',
    'מאמרים_באמונה': 'מאמרים באמונה',
    'מועדי_ישראל': 'מועדי ישראל',
    'עולם_הנפש': 'עולם הנפש',
    'מעגל_החיים': 'מעגל החיים'
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      <div className="fixed inset-x-4 top-24 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Search Input */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="חיפוש מאמרים..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pr-12 pl-12 py-4 text-lg border-0 bg-slate-50 rounded-xl focus:ring-2 focus:ring-[#4a90a4]"
                autoFocus
                dir="rtl"
              />
              <button 
                onClick={onClose}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-[#4a90a4] animate-spin" />
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                לא נמצאו תוצאות עבור "{query}"
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="p-2">
                {results.map((article) => (
                  <Link
                    key={article.id}
                    to={`${createPageUrl('Article')}?id=${article.id}`}
                    onClick={onClose}
                    className="block p-4 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex gap-4">
                      {article.image_url && (
                        <img 
                          src={article.image_url}
                          alt=""
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#1e3a5f] mb-1 truncate">
                          {article.title}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <span className="inline-block mt-2 text-xs bg-[#4a90a4]/10 text-[#4a90a4] px-2 py-1 rounded-full">
                          {categoryLabels[article.category] || article.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!query && (
              <div className="text-center py-12 text-slate-400">
                הקלידו לחיפוש במאמרים
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}