import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { ArrowRight, CreditCard, Loader2, Check, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function Checkout() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('product');
  const quantity = parseInt(urlParams.get('quantity') || '1');
  const shippingMethod = urlParams.get('shipping') || '';

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    shipping_city: '',
    notes: ''
  });
  const [success, setSuccess] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['checkoutProduct', productId],
    queryFn: async () => {
      const products = await staticClient.entities.Product.filter({ id: productId });
      return products[0];
    },
    enabled: !!productId
  });

  const orderMutation = useMutation({
    mutationFn: async (orderData) => {
      await staticClient.entities.Order.create(orderData);
    },
    onSuccess: () => {
      setSuccess(true);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] py-10">
        <div className="max-w-3xl mx-auto px-4">
          <Skeleton className="h-96 rounded-2xl" />
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

  const currentPrice = product.sale_price || product.price;
  const subtotal = currentPrice * quantity;
  const shippingCost = shippingMethod === 'איסוף_עצמי' ? 0 : (product.shipping_cost || 0);
  const total = subtotal + shippingCost;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const orderData = {
      ...formData,
      shipping_method: shippingMethod,
      items: [{
        product_id: productId,
        product_name: product.name,
        quantity,
        price: currentPrice
      }],
      subtotal,
      shipping_cost: shippingCost,
      total,
      status: 'ממתין_לתשלום'
    };

    orderMutation.mutate(orderData);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center py-10">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#1e3a5f] mb-4">ההזמנה התקבלה!</h1>
          <p className="text-slate-600 mb-6">
            תודה על הזמנתך. ניצור איתך קשר בהקדם לתיאום התשלום והמשלוח.
          </p>
          <Link to={createPageUrl('Shop')}>
            <Button className="bg-[#1e3a5f] hover:bg-[#2a4a6f]">
              חזרה לחנות
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link to={`${createPageUrl('ProductPage')}?id=${productId}`} className="text-[#4a90a4] hover:underline flex items-center gap-1 text-sm">
            <ArrowRight className="w-4 h-4" />
            חזרה למוצר
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-[#1e3a5f] mb-8 flex items-center gap-3">
          <CreditCard className="w-7 h-7" />
          השלמת הזמנה
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-[#1e3a5f] mb-4">פרטי הלקוח</h2>
              
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">שם מלא *</Label>
                <Input
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                  required
                  className="h-11 rounded-lg"
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#1e3a5f] mb-2 block text-sm">אימייל *</Label>
                  <Input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                    required
                    className="h-11 rounded-lg"
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label className="text-[#1e3a5f] mb-2 block text-sm">טלפון *</Label>
                  <Input
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                    required
                    className="h-11 rounded-lg"
                    dir="ltr"
                  />
                </div>
              </div>

              {product.product_type === 'physical' && shippingMethod !== 'איסוף_עצמי' && (
                <>
                  <h2 className="text-lg font-bold text-[#1e3a5f] pt-4">כתובת למשלוח</h2>
                  
                  <div>
                    <Label className="text-[#1e3a5f] mb-2 block text-sm">כתובת *</Label>
                    <Input
                      value={formData.shipping_address}
                      onChange={(e) => setFormData({...formData, shipping_address: e.target.value})}
                      required
                      className="h-11 rounded-lg"
                      dir="rtl"
                      placeholder="רחוב, מספר בית, דירה"
                    />
                  </div>

                  <div>
                    <Label className="text-[#1e3a5f] mb-2 block text-sm">עיר *</Label>
                    <Input
                      value={formData.shipping_city}
                      onChange={(e) => setFormData({...formData, shipping_city: e.target.value})}
                      required
                      className="h-11 rounded-lg"
                      dir="rtl"
                    />
                  </div>
                </>
              )}

              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">הערות להזמנה</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="rounded-lg resize-none"
                  dir="rtl"
                />
              </div>

              <Button
                type="submit"
                disabled={orderMutation.isPending}
                className="w-full h-14 bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white rounded-xl text-lg font-medium mt-6"
              >
                {orderMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 ml-2" />
                    שלח הזמנה
                  </>
                )}
              </Button>

              <p className="text-sm text-slate-500 text-center">
                * ניצור איתך קשר לתיאום התשלום
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
              <h2 className="text-lg font-bold text-[#1e3a5f] mb-4">סיכום הזמנה</h2>
              
              <div className="flex gap-4 pb-4 border-b border-slate-100">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="font-medium text-[#1e3a5f]">{product.name}</h3>
                  <p className="text-sm text-slate-500">כמות: {quantity}</p>
                  <p className="text-sm font-medium text-[#1e3a5f] mt-1">₪{currentPrice}</p>
                </div>
              </div>

              <div className="py-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">סכום ביניים</span>
                  <span className="text-[#1e3a5f]">₪{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">משלוח</span>
                  <span className="text-[#1e3a5f]">{shippingCost === 0 ? 'חינם' : `₪${shippingCost}`}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1e3a5f]">סה״כ לתשלום</span>
                  <span className="text-2xl font-bold text-[#1e3a5f]">₪{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}