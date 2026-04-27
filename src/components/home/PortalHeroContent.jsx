import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Clock, ArrowLeft, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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

function ArticleCard({ article, size = 'small' }) {
  const label = categoryLabels[article.category] || article.category;
  const bg = categoryBg[article.category] || 'bg-[#1e3a5f]';

  if (size === 'large') {
    return (
      <Link
        to={`${createPageUrl('Article')}?id=${article.id}`}
        className="group relative rounded-2xl overflow-hidden block col-span-2 row-span-2"
        style={{ minHeight: 380 }}
      >
        <img
          src={article.image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=900&q=80'}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        <div className="absolute bottom-0 p-6 lg:p-8">
          <span className={`inline-block text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 ${bg}`}>
            {label}
          </span>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-2 group-hover:text-[#d4af37] transition-colors">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="text-white/70 text-sm line-clamp-2 mb-3">{article.excerpt}</p>
          )}
          <div className="flex items-center gap-4 text-white/60 text-xs">
            {article.author && <span>מאת: {article.author}</span>}
            {article.reading_time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {article.reading_time} דקות קריאה
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`${createPageUrl('Article')}?id=${article.id}`}
      className="group relative rounded-xl overflow-hidden block"
      style={{ minHeight: 180 }}
    >
      <img
        src={article.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute bottom-0 p-4">
        <span className={`inline-block text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-2 ${bg}`}>
          {label}
        </span>
        <h3 className="font-bold text-white text-sm leading-snug group-hover:text-[#d4af37] transition-colors line-clamp-2">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}

export default function PortalHeroContent() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['portalHeroArticles'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const featured = await base44.entities.Article.filter({ published: true, is_featured: true }, '-created_date', 5);
      if (featured.length >= 5) return featured.slice(0, 5);
      const recent = await base44.entities.Article.filter({ published: true }, '-created_date', 5);
      return [...featured, ...recent.filter(a => !featured.find(f => f.id === a.id))].slice(0, 5);
    }
  });

  if (isLoading) {
    return (
      <section className="bg-white py-6 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-3 gap-4" style={{ height: 380 }}>
            <Skeleton className="col-span-2 rounded-2xl h-full" />
            <div className="flex flex-col gap-4">
              <Skeleton className="flex-1 rounded-xl" />
              <Skeleton className="flex-1 rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!articles || articles.length === 0) return null;

  const [main, ...rest] = articles;
  const sideArticles = rest.slice(0, 4);

  return (
    <section className="bg-white py-6 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Desktop: large article left, 2x2 grid right */}
        <div className="hidden lg:grid grid-cols-3 gap-4" style={{ height: 400 }}>
          <ArticleCard article={main} size="large" />
          <div className="grid grid-rows-2 gap-4">
            {sideArticles.slice(0, 2).map(a => (
              <ArticleCard key={a.id} article={a} size="small" />
            ))}
          </div>
        </div>

        {/* Mobile: stack */}
        <div className="lg:hidden flex flex-col gap-4">
          <ArticleCard article={main} size="large" />
          <div className="grid grid-cols-2 gap-3">
            {sideArticles.slice(0, 2).map(a => (
              <ArticleCard key={a.id} article={a} size="small" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}