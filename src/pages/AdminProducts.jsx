import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Plus, Search, Edit2, Trash2, Eye, EyeOff, 
  MoreVertical, Loader2, Package, ShoppingBag
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const categoryLabels = {
  'ספרים': 'ספרים',
  'חוברות': 'חוברות',
  'מוצרי_יודאיקה': 'מוצרי יודאיקה',
  'קורסים_דיגיטליים': 'קורסים דיגיטליים',
  'אחר': 'אחר'
};

export default function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: async () => {
      const all = await base44.entities.Product.list('-created_date');
      return all;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await base44.entities.Product.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      setDeleteId(null);
    }
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }) => {
      await base44.entities.Product.update(id, { published: !published });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    }
  });

  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    if (!searchQuery) return products;
    return products.filter(product =>
      product.name?.includes(searchQuery) ||
      product.short_description?.includes(searchQuery)
    );
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f]">
                ניהול מוצרים
              </h1>
              <p className="text-slate-600 mt-1">
                {products?.length || 0} מוצרים בחנות
              </p>
            </div>
            <Link to={createPageUrl('ProductEditor')}>
              <Button className="bg-[#1e3a5f] hover:bg-[#2a4a6f] rounded-xl">
                <Plus className="w-5 h-5 ml-2" />
                מוצר חדש
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="relative max-w-md mt-6">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="חיפוש מוצרים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 h-12 bg-slate-50 border-slate-200 rounded-xl"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4">
                <Skeleton className="h-40 w-full rounded-xl mb-4" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#1e3a5f] mb-2">אין מוצרים</h2>
            <p className="text-slate-500 mb-6">התחילו בהוספת המוצר הראשון לחנות</p>
            <Link to={createPageUrl('ProductEditor')}>
              <Button className="bg-[#1e3a5f] hover:bg-[#2a4a6f] rounded-xl">
                <Plus className="w-5 h-5 ml-2" />
                מוצר חדש
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative h-40 bg-slate-100">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                  
                  {/* Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 left-2 bg-white/90 hover:bg-white rounded-lg"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`${createPageUrl('ProductEditor')}?id=${product.id}`}>
                          <Edit2 className="w-4 h-4 ml-2" />
                          עריכה
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`${createPageUrl('ProductPage')}?id=${product.id}`} target="_blank">
                          <Eye className="w-4 h-4 ml-2" />
                          צפייה
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => togglePublishMutation.mutate({ 
                          id: product.id, 
                          published: product.published 
                        })}
                      >
                        {product.published ? (
                          <>
                            <EyeOff className="w-4 h-4 ml-2" />
                            הסתר
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 ml-2" />
                            הצג
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => setDeleteId(product.id)}
                      >
                        <Trash2 className="w-4 h-4 ml-2" />
                        מחיקה
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Badges */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {!product.published && (
                      <Badge className="bg-slate-600 text-white text-xs">טיוטה</Badge>
                    )}
                    {product.product_type === 'digital' && (
                      <Badge className="bg-[#4a90a4] text-white text-xs">דיגיטלי</Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <span className="text-xs text-[#4a90a4] font-medium">
                    {categoryLabels[product.category] || product.category}
                  </span>
                  <h3 className="font-bold text-[#1e3a5f] mt-1 line-clamp-1">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      {product.sale_price ? (
                        <>
                          <span className="font-bold text-[#1e3a5f]">₪{product.sale_price}</span>
                          <span className="text-sm text-slate-400 line-through">₪{product.price}</span>
                        </>
                      ) : (
                        <span className="font-bold text-[#1e3a5f]">₪{product.price}</span>
                      )}
                    </div>
                    {product.stock !== undefined && (
                      <span className="text-xs text-slate-500">
                        מלאי: {product.stock}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>האם למחוק את המוצר?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו לא ניתנת לביטול. המוצר יימחק לצמיתות.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'מחיקה'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}