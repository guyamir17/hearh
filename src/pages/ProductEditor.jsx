import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  ArrowRight, Save, Eye, Loader2, Upload, X, 
  Image as ImageIcon, Package, Truck
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const categories = [
  { value: 'ספרים', label: 'ספרים' },
  { value: 'חוברות', label: 'חוברות' },
  { value: 'מוצרי_יודאיקה', label: 'מוצרי יודאיקה' },
  { value: 'קורסים_דיגיטליים', label: 'קורסים דיגיטליים' },
  { value: 'אחר', label: 'אחר' }
];

const shippingMethods = [
  { value: 'דואר', label: 'דואר ישראל' },
  { value: 'שליח', label: 'שליח עד הבית' },
  { value: 'איסוף_עצמי', label: 'איסוף עצמי' }
];

export default function ProductEditor() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const isEditing = !!productId;

  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    full_description: '',
    price: '',
    sale_price: '',
    product_type: 'physical',
    image_url: '',
    gallery: [],
    category: '',
    shipping_methods: [],
    shipping_cost: '',
    delivery_time: '',
    digital_file_url: '',
    stock: '',
    published: true
  });
  const [uploading, setUploading] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['editProduct', productId],
    queryFn: async () => {
      const products = await base44.entities.Product.filter({ id: productId });
      return products[0];
    },
    enabled: isEditing
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        short_description: product.short_description || '',
        full_description: product.full_description || '',
        price: product.price || '',
        sale_price: product.sale_price || '',
        product_type: product.product_type || 'physical',
        image_url: product.image_url || '',
        gallery: product.gallery || [],
        category: product.category || '',
        shipping_methods: product.shipping_methods || [],
        shipping_cost: product.shipping_cost || '',
        delivery_time: product.delivery_time || '',
        digital_file_url: product.digital_file_url || '',
        stock: product.stock || '',
        published: product.published !== false
      });
    }
  }, [product]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const cleanData = {
        ...data,
        price: parseFloat(data.price) || 0,
        sale_price: data.sale_price ? parseFloat(data.sale_price) : null,
        shipping_cost: data.shipping_cost ? parseFloat(data.shipping_cost) : null,
        stock: data.stock ? parseInt(data.stock) : null
      };
      
      if (isEditing) {
        await base44.entities.Product.update(productId, cleanData);
      } else {
        await base44.entities.Product.create(cleanData);
      }
    },
    onSuccess: () => {
      window.location.href = createPageUrl('AdminProducts');
    }
  });

  const handleImageUpload = async (e, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      if (isGallery) {
        setFormData({ ...formData, gallery: [...formData.gallery, file_url] });
      } else {
        setFormData({ ...formData, image_url: file_url });
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
    setUploading(false);
  };

  const handleRemoveGalleryImage = (index) => {
    const newGallery = formData.gallery.filter((_, i) => i !== index);
    setFormData({ ...formData, gallery: newGallery });
  };

  const handleShippingMethodChange = (method, checked) => {
    if (checked) {
      setFormData({ ...formData, shipping_methods: [...formData.shipping_methods, method] });
    } else {
      setFormData({ ...formData, shipping_methods: formData.shipping_methods.filter(m => m !== method) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="bg-white rounded-2xl p-8 space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-24 z-30">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                to={createPageUrl('AdminProducts')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-[#1e3a5f]" />
              </Link>
              <h1 className="text-lg font-bold text-[#1e3a5f]">
                {isEditing ? 'עריכת מוצר' : 'מוצר חדש'}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              {isEditing && (
                <Link 
                  to={`${createPageUrl('ProductPage')}?id=${productId}`}
                  target="_blank"
                >
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Eye className="w-4 h-4 ml-1" />
                    תצוגה
                  </Button>
                </Link>
              )}
              <Button 
                onClick={handleSubmit}
                disabled={saveMutation.isPending || !formData.name || !formData.price}
                size="sm"
                className="bg-[#1e3a5f] hover:bg-[#2a4a6f] rounded-lg"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-1" />
                    שמירה
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1e3a5f] mb-5 flex items-center gap-2">
              <Package className="w-5 h-5" />
              פרטי מוצר
            </h2>

            <div className="space-y-5">
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">שם המוצר *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="שם המוצר"
                  className="h-11 rounded-lg"
                  dir="rtl"
                  required
                />
              </div>

              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">תיאור קצר</Label>
                <Textarea
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="תיאור קצר שיופיע בכרטיס המוצר"
                  rows={2}
                  className="rounded-lg resize-none"
                  dir="rtl"
                />
              </div>

              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">תיאור מורחב</Label>
                <Textarea
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  placeholder="תיאור מפורט של המוצר"
                  rows={5}
                  className="rounded-lg resize-none"
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#1e3a5f] mb-2 block text-sm">קטגוריה</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue placeholder="בחרו קטגוריה" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-[#1e3a5f] mb-2 block text-sm">סוג מוצר</Label>
                  <Select
                    value={formData.product_type}
                    onValueChange={(value) => setFormData({ ...formData, product_type: value })}
                  >
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physical">מוצר פיזי</SelectItem>
                      <SelectItem value="digital">מוצר דיגיטלי</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1e3a5f] mb-5">מחיר</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">מחיר רגיל (₪) *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                  className="h-11 rounded-lg"
                  dir="ltr"
                  required
                />
              </div>
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">מחיר מבצע (₪)</Label>
                <Input
                  type="number"
                  value={formData.sale_price}
                  onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                  placeholder="השאירו ריק אם אין מבצע"
                  className="h-11 rounded-lg"
                  dir="ltr"
                />
              </div>
              {formData.product_type === 'physical' && (
                <div>
                  <Label className="text-[#1e3a5f] mb-2 block text-sm">כמות במלאי</Label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="ללא הגבלה"
                    className="h-11 rounded-lg"
                    dir="ltr"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1e3a5f] mb-5 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              תמונות
            </h2>

            {/* Main Image */}
            <div className="mb-6">
              <Label className="text-[#1e3a5f] mb-2 block text-sm">תמונה ראשית</Label>
              {formData.image_url ? (
                <div className="relative w-48 h-48 rounded-xl overflow-hidden">
                  <img
                    src={formData.image_url}
                    alt="תמונה ראשית"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: '' })}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="block w-48">
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#4a90a4] transition-colors">
                    {uploading ? (
                      <Loader2 className="w-6 h-6 text-[#4a90a4] mx-auto animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-500">העלאת תמונה</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Gallery */}
            <div>
              <Label className="text-[#1e3a5f] mb-2 block text-sm">גלריית תמונות נוספת</Label>
              <div className="flex flex-wrap gap-3">
                {formData.gallery.map((img, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(index)}
                      className="absolute top-1 right-1 p-1 bg-white/90 rounded-full hover:bg-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#4a90a4] transition-colors">
                  <Upload className="w-5 h-5 text-slate-300" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Shipping - Physical Products */}
          {formData.product_type === 'physical' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-[#1e3a5f] mb-5 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                משלוח
              </h2>

              <div className="space-y-4">
                <div>
                  <Label className="text-[#1e3a5f] mb-3 block text-sm">שיטות משלוח</Label>
                  <div className="space-y-2">
                    {shippingMethods.map((method) => (
                      <div key={method.value} className="flex items-center gap-3">
                        <Checkbox
                          id={method.value}
                          checked={formData.shipping_methods.includes(method.value)}
                          onCheckedChange={(checked) => handleShippingMethodChange(method.value, checked)}
                        />
                        <Label htmlFor={method.value} className="cursor-pointer">
                          {method.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#1e3a5f] mb-2 block text-sm">עלות משלוח (₪)</Label>
                    <Input
                      type="number"
                      value={formData.shipping_cost}
                      onChange={(e) => setFormData({ ...formData, shipping_cost: e.target.value })}
                      placeholder="0 למשלוח חינם"
                      className="h-11 rounded-lg"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <Label className="text-[#1e3a5f] mb-2 block text-sm">זמן משלוח משוער</Label>
                    <Input
                      value={formData.delivery_time}
                      onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                      placeholder="לדוגמה: 3-5 ימי עסקים"
                      className="h-11 rounded-lg"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Digital Product */}
          {formData.product_type === 'digital' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-[#1e3a5f] mb-5">קובץ דיגיטלי</h2>
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">קישור להורדה</Label>
                <Input
                  value={formData.digital_file_url}
                  onChange={(e) => setFormData({ ...formData, digital_file_url: e.target.value })}
                  placeholder="https://..."
                  className="h-11 rounded-lg"
                  dir="ltr"
                />
                <p className="text-xs text-slate-500 mt-2">
                  הקישור יישלח ללקוח לאחר הרכישה
                </p>
              </div>
            </div>
          )}

          {/* Publishing */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[#1e3a5f]">פרסם מוצר</Label>
                <p className="text-xs text-slate-500">המוצר יהיה גלוי בחנות</p>
              </div>
              <Switch
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}