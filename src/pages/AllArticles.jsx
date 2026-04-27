import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { Search, Filter, Clock, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const categoryLabels = {
  'פרשת_שבוע': 'פרשת שבוע',
  'מאמרים_באמונה': 'מאמרים באמונה',
  'מועדי_ישראל': 'מועדי ישראל',
  'עולם_הנפש': 'עולם הנפש',
  'מעגל_החיים': 'מעגל החיים'
};

export default function AllArticles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: articles, isLoading } = useQuery({
    queryKey: ['allArticles'],
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    queryFn: async () => {
      const all = await staticClient.entities.Article.filter({ published: true }, '-created_date');
      return all;
    }
  });

  const filteredArticles = React.useMemo(() => {
    if (!articles) return [];
    return articles.filter(article => {
      const matchesSearch = !searchQuery || 
        article.title?.includes(searchQuery) || 
        article.excerpt?.includes(searchQuery);
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1e3a5f] mb-4">
            כל המאמרים
          </h1>
          <p className="text-lg text-slate-600">
            גלו את כל התכנים באתר הארה
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="חיפוש מאמרים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 h-12 bg-white border-slate-200 rounded-xl"
              dir="rtl"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 h-12 bg-white border-slate-200 rounded-xl">
              <Filter className="w-4 h-4 ml-2" />
              <SelectValue placeholder="כל הקטגוריות" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הקטגוריות</SelectItem>
              {Object.entries(categoryLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Articles Grid */}
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
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">לא נמצאו מאמרים</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                to={`${createPageUrl('Article')}?id=${article.id}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={article.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
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