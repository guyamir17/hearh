import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Clock, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const categoryLabels = {
  'פרשת_שבוע': 'פרשת שבוע',
  'מאמרים_באמונה': 'מאמרים באמונה',
  'מועדי_ישראל': 'מועדי ישראל',
  'עולם_הנפש': 'עולם הנפש',
  'מעגל_החיים': 'מעגל החיים'
};

export default function CategoryPage({ 
  category, 
  title, 
  description, 
  icon: Icon,
  filterField: filterFieldProp,
  filterValue,
  subcategories: staticSubcategories,
  hideFeatured = false,
  categoryKey
}) {
  // Fetch category settings
  const { data: categorySettings } = useQuery({
    queryKey: ['categorySettings'],
    queryFn: async () => base44.entities.CategorySettings.list()
  });

  // Fetch all categories from DB to get dynamic subcategories
  const { data: allCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => base44.entities.Category.list(),
    staleTime: 5 * 60 * 1000
  });

  // Find this category's record to get its key
  const thisCat = allCategories?.find(c => c.key === category || c.key === (categoryKey || ''));
  const catKey = thisCat?.key || category;

  // Build subcategories from DB (children of this category)
  const dbSubcategories = allCategories
    ? allCategories
        .filter(c => c.parent_category === catKey && c.active !== false)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .map(c => ({ value: c.key, label: c.name }))
    : [];

  // Use DB subcategories if available, fallback to static prop
  const subcategories = dbSubcategories.length > 0 ? dbSubcategories : (staticSubcategories || []);

  // Determine filterField: use prop if given, else 'subcategory' as generic fallback
  const filterField = filterFieldProp || 'subcategory';

  const urlParams = new URLSearchParams(window.location.search);
  const activeFilter = urlParams.get(filterField);

  // Get settings for this specific category
  const settings = categorySettings?.find(s => s.category_key === categoryKey);
  const displayTitle = settings?.title || title;
  const displayDescription = settings?.description || description;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeFilter]);

  const { data: articles, isLoading } = useQuery({
    queryKey: ['categoryArticles', category, activeFilter],
    queryFn: async () => {
      const filter = { published: true, category };
      if (activeFilter && filterField) {
        filter[filterField === 'book' ? 'parasha_book' : filterField === 'holiday' ? 'holiday' : 'lifecycle_event'] = activeFilter;
      }
      const all = await base44.entities.Article.filter(filter, '-created_date');
      return all;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
  });

  const { data: featuredArticles } = useQuery({
    queryKey: ['categoryFeatured', category],
    queryFn: async () => {
      const all = await base44.entities.Article.filter({ 
        published: true, 
        category,
        is_featured: true 
      }, '-created_date', 2);
      return all;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  });

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header - New elegant design */}
      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
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

          {/* Title with icon */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              {Icon && (
                <Icon className="w-6 h-6 text-[#1e3a5f]" strokeWidth={1.5} />
              )}
              <h1 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f]">
                {displayTitle}
              </h1>
            </div>
            {displayDescription && (
              <p className="text-slate-500 max-w-lg mx-auto text-sm lg:text-base">
                {displayDescription}
              </p>
            )}
          </div>

          {/* Subcategory filters */}
          {subcategories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              <button
                onClick={() => {
                  window.history.pushState({}, '', window.location.pathname);
                  window.location.reload();
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  !activeFilter 
                    ? 'bg-[#1e3a5f]/10 text-[#1e3a5f] border-[#1e3a5f]/20' 
                    : 'bg-transparent text-slate-500 border-slate-200 hover:border-[#1e3a5f]/30 hover:text-[#1e3a5f]'
                }`}
              >
                הכל
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.value}
                  onClick={() => {
                    window.history.pushState({}, '', `?${filterField}=${sub.value}`);
                    window.location.reload();
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    activeFilter === sub.value 
                      ? 'bg-[#1e3a5f]/10 text-[#1e3a5f] border-[#1e3a5f]/20' 
                      : 'bg-transparent text-slate-500 border-slate-200 hover:border-[#1e3a5f]/30 hover:text-[#1e3a5f]'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="h-px bg-slate-100"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
        {/* Featured Articles */}
        {featuredArticles && featuredArticles.length > 0 && !activeFilter && !hideFeatured && (
          <div className="mb-12">
            <h2 className="text-lg font-bold text-[#1e3a5f] mb-6 text-center">מאמרים מודגשים</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {featuredArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`${createPageUrl('Article')}?id=${article.id}`}
                  className="group relative rounded-2xl overflow-hidden h-56 lg:h-64"
                >
                  <img
                    src={article.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'}
                    alt={article.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: 'center 35%' }}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-white/80 line-clamp-2 text-sm">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        <h2 className="text-lg font-bold text-[#1e3a5f] mb-6 text-center">
          {activeFilter ? `מאמרים ב${activeFilter.replace(/_/g, ' ')}` : 'כל המאמרים'}
        </h2>

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
            <p className="text-slate-500">עדיין אין מאמרים בקטגוריה זו</p>
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