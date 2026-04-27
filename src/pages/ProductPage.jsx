import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { ArrowRight, Mail, Download, Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function ProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const products = await staticClient.entities.Product.filter({ id: productId });
      return products[0];
    },
    enabled: !!productId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] py-10">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Skeleton className="h-96 rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1e3a5f] mb-4">המוצר לא נמצא</h1>
          <Link to={createPageUrl('Shop')} className="text-[#4a90a4] hover:underline">
            חזרה לחנות
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [product.image_url, ...(product.gallery || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to={createPageUrl('Shop')} className="text-[#4a90a4] hover:underline flex items-center gap-1">
              <ArrowRight className="w-4 h-4" />
              חזרה לחנות
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4 flex items-center justify-center p-6">
              {allImages.length > 0 ? (
                <img
                  src={allImages[selectedImage]}
                  alt={product.name}
                  className="max-w-full max-h-96 object-contain"
                  style={{ height: 'auto', width: 'auto' }}
                  loading="eager"
                />
              ) : (
                <div className="w-full h-80 lg:h-96 bg-slate-100 flex items-center justify-center">
                  <Package className="w-20 h-20 text-slate-300" />
                </div>
              )}
            </div>
            
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors bg-white flex items-center justify-center p-1 ${
                      selectedImage === index ? 'border-[#4a90a4]' : 'border-slate-200'
                    }`}
                  >
                    <img src={img} alt="" className="max-w-full max-h-full object-contain" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {product.sale_price && (
                  <Badge className="bg-red-500 text-white">מבצע</Badge>
                )}
                {product.product_type === 'digital' && (
                  <Badge className="bg-[#4a90a4] text-white">מוצר דיגיטלי</Badge>
                )}
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f] mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                {product.sale_price ? (
                  <>
                    <span className="text-3xl font-bold text-[#1e3a5f]">₪{product.sale_price}</span>
                    <span className="text-xl text-slate-400 line-through">₪{product.price}</span>
                    <Badge className="bg-red-100 text-red-600">
                      {Math.round((1 - product.sale_price / product.price) * 100)}% הנחה
                    </Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-[#1e3a5f]">₪{product.price}</span>
                )}
              </div>

              {/* Description */}
              {product.short_description && (
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {product.short_description}
                </p>
              )}

              {/* Digital Product Info */}
              {product.product_type === 'digital' && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-[#4a90a4]">
                    <Download className="w-5 h-5" />
                    <span className="font-medium">מוצר דיגיטלי</span>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 pt-6">
                <a
                  href={`mailto:guyamir17@gmail.com?subject=${encodeURIComponent(`התעניינות במוצר - ${product.name}`)}`}
                  className="inline-flex w-full h-14 items-center justify-center bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white rounded-xl text-lg font-medium"
                >
                  <Mail className="w-5 h-5 ml-2" />
                  לפרטים והזמנה
                </a>
              </div>
            </div>

            {/* Full Description */}
            {product.full_description && (
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm mt-6">
                <h2 className="text-lg font-bold text-[#1e3a5f] mb-4">תיאור מפורט</h2>
                <div className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.full_description}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
