import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

const categories = [
  { key: 'parshat_shavua', name: 'פרשת שבוע', defaultTitle: 'פרשת שבוע', defaultDesc: 'דברי תורה והשראה על פרשת השבוע' },
  { key: 'maamarim_emuna', name: 'מאמרים באמונה', defaultTitle: 'מאמרים באמונה', defaultDesc: 'חיזוק האמונה והשקפת עולם' },
  { key: 'moadei_yisrael', name: 'מועדי ישראל', defaultTitle: 'מועדי ישראל', defaultDesc: 'עומק החגים והמועדים' },
  { key: 'olam_hanefesh', name: 'עולם הנפש', defaultTitle: 'עולם הנפש', defaultDesc: 'פסיכולוגיה יהודית, צמיחה אישית והתמודדות עם אתגרי החיים' },
  { key: 'maagal_hachaim', name: 'מעגל החיים', defaultTitle: 'מעגל החיים', defaultDesc: 'מסורת ומשמעות באירועי החיים' },
  { key: 'shop', name: 'חנות', defaultTitle: 'חנות', defaultDesc: 'ספרים, חוברות ומוצרים מיוחדים' }
];

export default function AdminCategorySettings() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({});
  const [saved, setSaved] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['categorySettings'],
    queryFn: async () => {
      return await base44.entities.CategorySettings.list();
    }
  });

  useEffect(() => {
    if (settings) {
      const data = {};
      categories.forEach(cat => {
        const existing = settings.find(s => s.category_key === cat.key);
        data[cat.key] = {
          title: existing?.title || cat.defaultTitle,
          description: existing?.description || cat.defaultDesc,
          id: existing?.id
        };
      });
      setFormData(data);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      for (const cat of categories) {
        const data = formData[cat.key];
        if (data.id) {
          await base44.entities.CategorySettings.update(data.id, {
            title: data.title,
            description: data.description
          });
        } else {
          await base44.entities.CategorySettings.create({
            category_key: cat.key,
            title: data.title,
            description: data.description
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorySettings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  });

  const handleSave = () => {
    saveMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f6f3]">
        <div className="bg-white border-b border-slate-100 sticky top-20 z-30">
          <div className="max-w-5xl mx-auto px-4 lg:px-8 py-4">
            <Skeleton className="h-8 w-48" />
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <div className="bg-white border-b border-slate-100 sticky top-20 z-30">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#1e3a5f]">הגדרות קטגוריות</h1>
            <Button 
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="bg-[#1e3a5f] hover:bg-[#2a4a6f]"
            >
              {saveMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : saved ? (
                '✓ נשמר'
              ) : (
                <>
                  <Save className="w-4 h-4 ml-2" />
                  שמור שינויים
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
        <p className="text-slate-600 mb-8">
          ערכו את הכותרות והתיאורים שמופיעים בראש כל עמוד קטגוריה באתר
        </p>

        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.key} className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">{cat.name}</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-slate-600 mb-2 block">כותרת</Label>
                  <Input
                    value={formData[cat.key]?.title || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      [cat.key]: { ...formData[cat.key], title: e.target.value }
                    })}
                    dir="rtl"
                    className="text-base"
                  />
                </div>

                <div>
                  <Label className="text-sm text-slate-600 mb-2 block">תיאור</Label>
                  <Textarea
                    value={formData[cat.key]?.description || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      [cat.key]: { ...formData[cat.key], description: e.target.value }
                    })}
                    dir="rtl"
                    rows={3}
                    className="text-base"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}