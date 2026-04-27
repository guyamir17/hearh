import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { ExternalLink, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function ExternalArticlesSection() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['externalArticles'],
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    queryFn: async () => {
      const all = await staticClient.entities.ExternalArticle.filter({ published: true }, 'display_order', 8);
      return all;
    }
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <Skeleton className="h-8 w-64 mx-auto mb-3" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#f8f6f3] rounded-xl overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12 bg-[#1e3a5f]/20"></div>
            <span className="text-sm text-[#4a90a4] font-medium">פרסומים</span>
            <div className="h-px w-12 bg-[#1e3a5f]/20"></div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f] mb-3">
            מאמרים שפורסמו ברשת
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            מאמרים שהתפרסמו באתרים מובילים
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {articles.map((article) => (
            <a
              key={article.id}
              href={article.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#f8f6f3] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-36 overflow-hidden bg-white">
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('bg-gradient-to-br', 'from-[#1e3a5f]/10', 'to-[#4a90a4]/10');
                      const icon = document.createElement('div');
                      icon.className = 'w-full h-full flex items-center justify-center';
                      icon.innerHTML = '<svg class="w-8 h-8 text-[#1e3a5f]/30" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>';
                      e.target.parentElement.appendChild(icon);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1e3a5f]/10 to-[#4a90a4]/10 flex items-center justify-center">
                    <ExternalLink className="w-8 h-8 text-[#1e3a5f]/30" />
                  </div>
                )}
                {/* Source Badge */}
                <div className="absolute top-2 right-2">
                  <span className="bg-white/90 backdrop-blur-sm text-[#1e3a5f] text-xs px-2 py-1 rounded-full font-medium">
                    {article.source_name}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-[#1e3a5f] text-sm group-hover:text-[#4a90a4] transition-colors line-clamp-2 mb-2">
                  {article.title}
                </h3>
                {article.subtitle && (
                  <p className="text-slate-500 text-xs line-clamp-1 mb-2">
                    {article.subtitle}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  {article.publish_date && (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(article.publish_date), 'dd/MM/yy')}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[#4a90a4] text-xs font-medium">
                    לקריאה
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}