import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { BookOpen, ArrowRight, Clock, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ParshaArticles() {
  const urlParams = new URLSearchParams(window.location.search);
  const book = urlParams.get('book');
  const parsha = urlParams.get('parsha');

  const { data: articles, isLoading } = useQuery({
    queryKey: ['parshaArticles', book, parsha],
    queryFn: async () => {
      const parshaVariants = Array.from(new Set([
        parsha,
        parsha?.replace(/ /g, '_'),
        parsha?.replace(/_/g, ' ')
      ].filter(Boolean)));

      const filter = { 
        published: true, 
        category: 'פרשת_שבוע',
        parasha_book: book
      };
      const all = await staticClient.entities.Article.filter(filter, '-created_date');
      return all.filter((article) => parshaVariants.includes(article.parasha_name));
    },
    enabled: !!book && !!parsha
  });

  if (!book || !parsha) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">פרשה לא נמצאה</p>
          <Link to={createPageUrl('ParshatShavua')} className="text-[#4a90a4] hover:underline">
            חזרה לפרשת שבוע
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <div className="flex items-center gap-3 mb-6">
            <Link 
              to={`${createPageUrl('BookParshiyot')}?book=${book}`}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-[#1e3a5f]" />
            </Link>
          </div>

          {/* Decorative top line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex gap-1">
              <span className="w-1 h-1 rounded-full bg-[#1e3a5f]/30"></span>
              <span className="w-1 h-1 rounded-full bg-[#1e3a5f]/30"></span>
              <span className="w-1 h-1 rounded-full bg-[#1e3a5f]/30"></span>
            </div>
            <div className="h-px w-20 bg-[#1e3a5f]/15"></div>
            <div className="h-px w-20 bg-[#1e3a5f]/15"></div>
            <div className="flex gap-1">
              <span className="w-1 h-1 rounded-full bg-[#1e3a5f]/30"></span>
              <span className="w-1 h-1 rounded-full bg-[#1e3a5f]/30"></span>
              <span className="w-1 h-1 rounded-full bg-[#1e3a5f]/30"></span>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <BookOpen className="w-6 h-6 text-[#1e3a5f]" strokeWidth={1.5} />
              <h1 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f]">
                פרשת {parsha.replace(/_/g, ' ')}
              </h1>
            </div>
            <p className="text-slate-500 text-sm">
              ספר {book}
            </p>
          </div>
        </div>
        <div className="h-px bg-slate-100"></div>
      </div>

      {/* Articles */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <Skeleton className="h-40 w-full" />
                <div className="p-5">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : !articles || articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <p className="text-slate-500 mb-4">עדיין אין מאמרים בפרשה זו</p>
            <Link 
              to={`${createPageUrl('BookParshiyot')}?book=${book}`}
              className="text-[#4a90a4] hover:underline"
            >
              חזרה לרשימת הפרשות
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`${createPageUrl('Article')}?id=${article.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative h-40 overflow-hidden bg-slate-100">
                  <img
                    src={article.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'}
                    alt={article.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: 'center 35%' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                
                <div className="p-5">
                  <h3 className="text-base font-bold text-[#1e3a5f] mb-2 group-hover:text-[#4a90a4] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    {article.reading_time && (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                        {article.reading_time} דק׳
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[#4a90a4] font-medium text-sm">
                      קראו עוד
                      <ArrowLeft className="w-3.5 h-3.5" />
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
