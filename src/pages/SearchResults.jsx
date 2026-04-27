import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { Search, Clock, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const categoryLabels = {
  'פרשת_שבוע': 'פרשת שבוע',
  'מאמרים_באמונה': 'מאמרים באמונה',
  'מועדי_ישראל': 'מועדי ישראל',
  'עולם_הנפש': 'עולם הנפש',
  'מעגל_החיים': 'מעגל החיים'
};

export default function SearchResults() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q') || '';

  const { data: articles, isLoading } = useQuery({
    queryKey: ['searchResults', query],
    queryFn: async () => {
      const all = await staticClient.entities.Article.filter({ published: true });
      return all.filter(article =>
        article.title?.includes(query) ||
        article.excerpt?.includes(query) ||
        article.content?.includes(query) ||
        article.tags?.some(tag => tag.includes(query))
      );
    },
    enabled: !!query
  });

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-8 h-8 text-[#4a90a4]" />
            <h1 className="text-3xl lg:text-4xl font-bold text-[#1e3a5f]">
              תוצאות חיפוש
            </h1>
          </div>
          <p className="text-lg text-slate-600">
            {isLoading ? 'מחפש...' : `נמצאו ${articles?.length || 0} תוצאות עבור "${query}"`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : !articles || articles.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-xl font-bold text-[#1e3a5f] mb-2">לא נמצאו תוצאות</h2>
            <p className="text-slate-500 mb-6">נסו לחפש מילים אחרות או לעיין בקטגוריות</p>
            <Link
              to={createPageUrl('AllArticles')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] text-white rounded-full font-medium hover:bg-[#2a4a6f] transition-colors"
            >
              לכל המאמרים
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`${createPageUrl('Article')}?id=${article.id}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/95 backdrop-blur-sm text-[#1e3a5f] text-xs px-3 py-1 rounded-full font-medium">
                      {categoryLabels[article.category] || article.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#1e3a5f] mb-2 group-hover:text-[#4a90a4] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    {article.reading_time && (
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {article.reading_time} דק׳
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[#4a90a4] font-medium text-sm">
                      קראו עוד
                      <ArrowLeft className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}