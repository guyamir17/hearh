import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Clock, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const categoryLabels = {
  'פרשת_שבוע': 'פרשת השבוע',
  'מאמרים_באמונה': 'אמונה',
  'מועדי_ישראל': 'מועדי ישראל',
  'עולם_הנפש': 'עולם הנפש',
  'מעגל_החיים': 'מעגל החיים'
};

const categoryBg = {
  'פרשת_שבוע': 'bg-[#1e3a5f]',
  'מאמרים_באמונה': 'bg-purple-600',
  'מועדי_ישראל': 'bg-teal-600',
  'עולם_הנפש': 'bg-blue-600',
  'מעגל_החיים': 'bg-rose-600'
};

export default function FeaturedArticles() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['featuredArticlesSection'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const featured = await staticClient.entities.Article.filter({ published: true, is_featured: true }, '-created_date', 6);
      if (featured.length >= 6) return featured.slice(0, 6);
      const recent = await staticClient.entities.Article.filter({ published: true }, '-created_date', 6);
      return [...featured, ...recent.filter(a => !featured.find(f => f.id === a.id))].slice(0, 6);
    }
  });

  if (isLoading) {
    return (
      <section className="py-10 bg-[#f8f6f3]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-10 bg-[#f8f6f3]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-[#1e3a5f]">מאמרים מומלצים</h2>
          <Link to={createPageUrl('AllArticles')} className="flex items-center gap-1 text-[#4a90a4] text-sm font-medium hover:gap-2 transition-all">
            צפה בכל <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {articles.map((article) => {
            const label = categoryLabels[article.category] || article.category;
            const bg = categoryBg[article.category] || 'bg-[#1e3a5f]';
            return (
              <Link
                key={article.id}
                to={`${createPageUrl('Article')}?id=${article.id}`}
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`text-white text-[11px] font-bold px-3 py-1.5 rounded-full ${bg}`}>
                      {label}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-[#1e3a5f] text-base leading-snug mb-2 group-hover:text-[#4a90a4] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-slate-400 pt-3 border-t border-slate-100 mt-auto">
                    {article.created_date && (
                      <span>{format(new Date(article.created_date), 'dd/MM/yyyy')}</span>
                    )}
                    {article.reading_time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {article.reading_time} דק׳
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}