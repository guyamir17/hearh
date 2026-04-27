import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSEO() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState(null);

  const { data: siteSettings, isLoading } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const result = await staticClient.entities.SiteSettings.list();
      if (result && result.length > 0) {
        setSettings(result[0]);
        return result;
      }
      return [];
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      if (settings?.id) {
        return await staticClient.entities.SiteSettings.update(settings.id, data);
      } else {
        return await staticClient.entities.SiteSettings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      toast.success('הגדרות SEO נשמרו בהצלחה');
    },
    onError: () => {
      toast.error('שגיאה בשמירת הגדרות');
    }
  });

  const handleSave = () => {
    if (!settings) return;
    updateMutation.mutate(settings);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="animate-pulse text-[#1e3a5f]">טוען...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-6 h-6 text-[#1e3a5f]" />
            <h1 className="text-2xl font-bold text-[#1e3a5f]">הגדרות SEO כלליות</h1>
          </div>
          <p className="text-slate-600">
            הגדרות ברירת מחדל לקידום האתר במנועי החיפוש
          </p>
        </div>

        {/* Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <strong>טיפ:</strong> הגדרות אלו ישמשו כברירת מחדל לעמודים שלא הוגדרו בהם הגדרות SEO ייעודיות.
            מומלץ למלא את כל השדות לקידום מיטבי.
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          {/* Site Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              שם האתר
            </label>
            <Input
              type="text"
              placeholder="הארה"
              value={settings?.seo_site_name || ''}
              onChange={(e) => setSettings({...settings, seo_site_name: e.target.value})}
            />
            <span className="text-xs text-slate-500 mt-1 block">
              שם האתר כפי שיופיע ברשתות חברתיות
            </span>
          </div>

          {/* Default Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              כותרת ברירת מחדל (מומלץ עד 60 תווים)
            </label>
            <Input
              type="text"
              placeholder="הארה - להאיר את הנשמה, לחזק את הרוח"
              value={settings?.seo_default_title || ''}
              onChange={(e) => setSettings({...settings, seo_default_title: e.target.value})}
              maxLength={60}
            />
            <span className="text-xs text-slate-500 mt-1 block">
              {(settings?.seo_default_title || '').length}/60 תווים
            </span>
          </div>

          {/* Default Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              תיאור ברירת מחדל (מומלץ עד 160 תווים)
            </label>
            <Textarea
              placeholder="מאמרי עומק בתורה, אמונה וחכמת החיים. פרשת שבוע, מועדי ישראל, עולם הנפש ומעגל החיים."
              value={settings?.seo_default_description || ''}
              onChange={(e) => setSettings({...settings, seo_default_description: e.target.value})}
              className="h-24"
              maxLength={160}
            />
            <span className="text-xs text-slate-500 mt-1 block">
              {(settings?.seo_default_description || '').length}/160 תווים
            </span>
          </div>

          {/* Default Image */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              תמונת שיתוף ברירת מחדל
            </label>
            <Input
              type="text"
              placeholder="https://..."
              value={settings?.seo_default_image || ''}
              onChange={(e) => setSettings({...settings, seo_default_image: e.target.value})}
            />
            <span className="text-xs text-slate-500 mt-1 block">
              תמונה שתופיע בעת שיתוף קישורים ברשתות חברתיות (מומלץ 1200x630 פיקסל)
            </span>
            {settings?.seo_default_image && (
              <div className="mt-3">
                <img 
                  src={settings.seo_default_image} 
                  alt="תצוגה מקדימה"
                  className="w-full max-w-md rounded-lg border border-slate-200"
                />
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="bg-[#1e3a5f] hover:bg-[#2a4a6f]"
            >
              <Save className="w-4 h-4 ml-2" />
              {updateMutation.isPending ? 'שומר...' : 'שמור הגדרות'}
            </Button>
          </div>
        </div>

        {/* Robots.txt Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
          <h2 className="text-lg font-bold text-[#1e3a5f] mb-3">
            הגדרות נוספות
          </h2>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#4a90a4] rounded-full mt-2"></div>
              <div>
                <strong>Sitemap.xml:</strong> מפת האתר נוצרת אוטומטית וכוללת את כל המאמרים והעמודים המפורסמים
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#4a90a4] rounded-full mt-2"></div>
              <div>
                <strong>Robots.txt:</strong> הקובץ מוגדר לאפשר סריקה מלאה של האתר על ידי מנועי חיפוש
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#4a90a4] rounded-full mt-2"></div>
              <div>
                <strong>Schema Markup:</strong> נתונים מובנים מוסיפים אוטומטית לכל מאמר לשיפור התצוגה בתוצאות החיפוש
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}