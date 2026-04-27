import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { Skeleton } from '@/components/ui/skeleton';

const categoryLabels = {
  'פרשת_שבוע': 'פרשת שבוע',
  'מאמרים_באמונה': 'מאמרים באמונה',
  'מועדי_ישראל': 'מועדי ישראל',
  'עולם_הנפש': 'עולם הנפש',
  'מעגל_החיים': 'מעגל החיים'
};

export default function LatestArticles() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['latestArticles'],
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    queryFn: async () => {
      const all = await staticClient.entities.Article.filter({ published: true }, '-created_date', 6);
      return all;
    }
  });

  if (isLoading) {
    return (
      <section className="py-16 lg:py-20 bg-[#f8f6f3]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f] text-center mb-12" style={{ fontFamily: 'Heebo, sans-serif' }}>
            מאמרים אחרונים
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <Skeleton className="h-44 w-full" />
                <div className="p-5">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <section className="py-16 lg:py-20 bg-[#f8f6f3]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f] mb-3" style={{ fontFamily: 'Heebo, sans-serif' }}>
            מאמרים אחרונים
          </h2>
          <p className="text-slate-600">עדיין אין מאמרים. בקרוב יתווספו תכנים חדשים!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20 bg-[#f8f6f3]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header - Unified style */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12 bg-[#1e3a5f]/20"></div>
            <span className="text-sm text-[#4a90a4] font-medium">חדש באתר</span>
            <div className="h-px w-12 bg-[#1e3a5f]/20"></div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f] mb-3">
            מאמרים אחרונים
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            התכנים החדשים ביותר באתר
          </p>
        </div>
        <div className="flex items-center justify-end mb-6">
          <Link
            to={createPageUrl('AllArticles')}
            className="hidden md:flex items-center gap-1 text-[#4a90a4] font-medium hover:gap-2 transition-all text-sm"
          >
            לכל המאמרים
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`${createPageUrl('Article')}?id=${article.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={article.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-white/95 backdrop-blur-sm text-[#1e3a5f] text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                    {categoryLabels[article.category] || article.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-base font-bold text-[#1e3a5f] mb-2 group-hover:text-[#4a90a4] transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                    {article.excerpt}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    {article.reading_time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.reading_time} דק׳
                      </span>
                    )}
                    {article.author && <span>{article.author}</span>}
                  </div>
                  <span className="flex items-center gap-1 text-[#4a90a4] font-medium text-sm">
                    קראו עוד
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <Link
            to={createPageUrl('AllArticles')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-medium hover:bg-[#2a4a6f] transition-colors"
          >
            לכל המאמרים
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}