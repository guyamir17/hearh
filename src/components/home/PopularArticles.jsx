import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp, Clock, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const categoryLabels = {
  'פרשת_שבוע': 'פרשת השבוע',
  'מאמרים_באמונה': 'אמונה',
  'מועדי_ישראל': 'מועדי ישראל',
  'עולם_הנפש': 'עולם הנפש',
  'מעגל_החיים': 'מעגל החיים'
};

export default function PopularArticles() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['popularArticles'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const featured = await base44.entities.Article.filter({ published: true, is_featured: true }, '-created_date', 6);
      if (featured.length >= 6) return featured.slice(0, 6);
      const recent = await base44.entities.Article.filter({ published: true }, '-created_date', 6);
      return [...featured, ...recent.filter(a => !featured.find(f => f.id === a.id))].slice(0, 6);
    }
  });

  if (isLoading) {
    return (
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <Skeleton className="h-7 w-40 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        </div>
      </section>
    );
  }

  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#1e3a5f]" />
            <h2 className="text-xl font-extrabold text-[#1e3a5f]">הנקראים ביותר</h2>
          </div>
          <Link to={createPageUrl('AllArticles')} className="flex items-center gap-1 text-[#4a90a4] text-sm font-medium hover:gap-2 transition-all">
            כל המאמרים <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
          {articles.map((article, index) => (
            <Link
              key={article.id}
              to={`${createPageUrl('Article')}?id=${article.id}`}
              className="group flex items-start gap-4 py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-3 rounded-xl -mx-3 transition-colors"
            >
              <span className={`flex-shrink-0 text-2xl font-extrabold w-8 text-center leading-none pt-0.5 ${index < 3 ? 'text-[#d4af37]' : 'text-slate-300'}`}>
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#1e3a5f] text-sm leading-snug group-hover:text-[#4a90a4] transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  <span>{categoryLabels[article.category] || article.category}</span>
                  {article.reading_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.reading_time} דק׳
                    </span>
                  )}
                </div>
              </div>
              {article.image_url && (
                <div className="flex-shrink-0 w-14 h-12 rounded-lg overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}