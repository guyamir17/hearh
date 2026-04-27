import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { ArrowRight, ShoppingCart, Truck, Download, Package, Check, Minus, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const shippingLabels = {
  'דואר': { label: 'דואר ישראל', icon: Package },
  'שליח': { label: 'שליח עד הבית', icon: Truck },
  'איסוף_עצמי': { label: 'איסוף עצמי', icon: Check }
};

export default function ProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  const [quantity, setQuantity] = useState(1);
  const [selectedShipping, setSelectedShipping] = useState('');
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
  const currentPrice = product.sale_price || product.price;
  const totalPrice = currentPrice * quantity;

  const handleBuy = () => {
    // Navigate to checkout with product info
    const checkoutUrl = `${createPageUrl('Checkout')}?product=${productId}&quantity=${quantity}&shipping=${selectedShipping}`;
    window.location.href = checkoutUrl;
  };

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

              {/* Quantity */}
              {product.product_type === 'physical' && (
                <div className="mb-6">
                  <Label className="text-[#1e3a5f] font-medium mb-2 block">כמות</Label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Shipping Options - Physical Products */}
              {product.product_type === 'physical' && product.shipping_methods?.length > 0 && (
                <div className="mb-6">
                  <Label className="text-[#1e3a5f] font-medium mb-3 block">שיטת משלוח</Label>
                  <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                    {product.shipping_methods.map((method) => {
                      const methodInfo = shippingLabels[method];
                      const Icon = methodInfo?.icon || Package;
                      return (
                        <div key={method} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-[#4a90a4] transition-colors">
                          <RadioGroupItem value={method} id={method} />
                          <Label htmlFor={method} className="flex-1 flex items-center gap-3 cursor-pointer">
                            <Icon className="w-5 h-5 text-slate-400" />
                            <span>{methodInfo?.label || method}</span>
                          </Label>
                          {product.shipping_cost > 0 && method !== 'איסוף_עצמי' && (
                            <span className="text-sm text-slate-500">₪{product.shipping_cost}</span>
                          )}
                          {method === 'איסוף_עצמי' && (
                            <span className="text-sm text-green-600">חינם</span>
                          )}
                        </div>
                      );
                    })}
                  </RadioGroup>
                  {product.delivery_time && (
                    <p className="text-sm text-slate-500 mt-2">
                      זמן משלוח משוער: {product.delivery_time}
                    </p>
                  )}
                </div>
              )}

              {/* Digital Product Info */}
              {product.product_type === 'digital' && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-[#4a90a4]">
                    <Download className="w-5 h-5" />
                    <span className="font-medium">מוצר דיגיטלי - קישור להורדה ישלח במייל לאחר הרכישה</span>
                  </div>
                </div>
              )}

              {/* Total & Buy Button */}
              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-600">סה״כ לתשלום:</span>
                  <span className="text-2xl font-bold text-[#1e3a5f]">₪{totalPrice}</span>
                </div>
                <Button
                  onClick={handleBuy}
                  className="w-full h-14 bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white rounded-xl text-lg font-medium"
                >
                  <ShoppingCart className="w-5 h-5 ml-2" />
                  לרכישה
                </Button>
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