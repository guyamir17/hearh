import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import CategoryPage from '@/components/category/CategoryPage';

const categoryLabels = {
  'ספרים': 'ספרים',
  'חוברות': 'חוברות',
  'מוצרי_יודאיקה': 'מוצרי יודאיקה',
  'קורסים_דיגיטליים': 'קורסים דיגיטליים',
  'אחר': 'אחר'
};

export default function Shop() {
  // Fetch category settings
  const { data: categorySettings } = useQuery({
    queryKey: ['categorySettings'],
    queryFn: async () => {
      return await base44.entities.CategorySettings.list();
    }
  });

  const settings = categorySettings?.find(s => s.category_key === 'shop');
  const displayTitle = settings?.title || 'חנות';
  const displayDescription = settings?.description || 'ספרים, חוברות ומוצרים מיוחדים';

  const { data: products, isLoading } = useQuery({
    queryKey: ['shopProducts'],
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    queryFn: async () => {
      const all = await base44.entities.Product.filter({ published: true });
      return all;
    }
  });

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header - Matching other category pages */}
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
              <ShoppingBag className="w-6 h-6 text-[#1e3a5f]" strokeWidth={1.5} />
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
        </div>
        <div className="h-px bg-slate-100"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <ShoppingBag className="w-12 h-12 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">החנות בבנייה</h2>
            <p className="text-slate-600 max-w-md mx-auto">
              אנחנו עובדים על הקמת החנות. בקרוב תוכלו למצוא כאן ספרים, חוברות ומוצרים מיוחדים.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`${createPageUrl('ProductPage')}?id=${product.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-100"
              >
                {/* Image - Fixed frame with object-fit contain */}
                <div className="relative h-56 overflow-hidden bg-white border-b border-slate-50">
                  {product.image_url ? (
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                      <ShoppingBag className="w-16 h-16 text-slate-200" />
                    </div>
                  )}
                  {product.sale_price && (
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1">
                      מבצע
                    </Badge>
                  )}
                  {product.product_type === 'digital' && (
                    <Badge className="absolute top-3 left-3 bg-[#4a90a4] text-white text-xs px-2 py-1">
                      דיגיטלי
                    </Badge>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs text-[#4a90a4] font-medium mb-1">
                    {categoryLabels[product.category] || product.category}
                  </span>
                  <h3 className="text-base font-bold text-[#1e3a5f] mb-2 group-hover:text-[#4a90a4] transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  {product.short_description && (
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3 flex-1">
                      {product.short_description}
                    </p>
                  )}
                  
                  {/* Price & Button */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      {product.sale_price ? (
                        <>
                          <span className="text-lg font-bold text-[#1e3a5f]">₪{product.sale_price}</span>
                          <span className="text-sm text-slate-400 line-through">₪{product.price}</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-[#1e3a5f]">₪{product.price}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-[#4a90a4] group-hover:text-[#1e3a5f] transition-colors flex items-center gap-1">
                      לצפייה
                      <ShoppingCart className="w-4 h-4" />
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