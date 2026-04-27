import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminInitCategories() {
  const [status, setStatus] = useState('idle');

  const { data: existingCategories } = useQuery({
    queryKey: ['categories-check'],
    queryFn: async () => {
      return await base44.entities.Category.list();
    }
  });

  const initMutation = useMutation({
    mutationFn: async () => {
      const defaultCategories = [
        {
          name: 'פרשת שבוע',
          key: 'פרשת_שבוע',
          icon: 'BookOpen',
          description: 'דברי תורה על פרשת השבוע',
          display_order: 1,
          active: true,
          show_in_menu: true,
          page_url: 'ParshatShavua'
        },
        {
          name: 'מאמרים באמונה',
          key: 'מאמרים_באמונה',
          icon: 'Heart',
          description: 'מאמרי עומק בנושאי אמונה',
          display_order: 2,
          active: true,
          show_in_menu: true,
          page_url: 'MaamarimEmuna'
        },
        {
          name: 'מועדי ישראל',
          key: 'מועדי_ישראל',
          icon: 'Calendar',
          description: 'חגים ומועדים',
          display_order: 3,
          active: true,
          show_in_menu: true,
          page_url: 'MoadeiYisrael'
        },
        {
          name: 'עולם הנפש',
          key: 'עולם_הנפש',
          icon: 'Brain',
          description: 'פסיכולוגיה יהודית וצמיחה אישית',
          display_order: 4,
          active: true,
          show_in_menu: true,
          page_url: 'OlamHanefesh'
        },
        {
          name: 'מעגל החיים',
          key: 'מעגל_החיים',
          icon: 'Users',
          description: 'אירועי מעגל החיים',
          display_order: 5,
          active: true,
          show_in_menu: true,
          page_url: 'MaagalHachaim'
        }
      ];

      for (const cat of defaultCategories) {
        await base44.entities.Category.create(cat);
      }
    },
    onSuccess: () => {
      setStatus('success');
      toast.success('הקטגוריות נוצרו בהצלחה!');
    },
    onError: () => {
      setStatus('error');
      toast.error('שגיאה ביצירת הקטגוריות');
    }
  });

  const hasCategories = existingCategories && existingCategories.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
        <h1 className="text-2xl font-bold text-[#1e3a5f] mb-4">אתחול קטגוריות</h1>
        
        {hasCategories ? (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <p className="text-slate-600">
              כבר קיימות {existingCategories.length} קטגוריות במערכת
            </p>
          </div>
        ) : status === 'success' ? (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <p className="text-slate-600">הקטגוריות נוצרו בהצלחה!</p>
          </div>
        ) : status === 'error' ? (
          <div className="space-y-4">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            <p className="text-slate-600">אירעה שגיאה ביצירת הקטגוריות</p>
            <Button onClick={() => initMutation.mutate()} className="bg-[#1e3a5f]">
              נסה שוב
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-slate-600 mb-6">
              לא נמצאו קטגוריות במערכת. לחצו כדי ליצור את הקטגוריות הבסיסיות.
            </p>
            <Button 
              onClick={() => initMutation.mutate()} 
              disabled={initMutation.isPending}
              className="bg-[#1e3a5f] w-full"
            >
              {initMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  יוצר קטגוריות...
                </>
              ) : (
                'צור קטגוריות בסיסיות'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}