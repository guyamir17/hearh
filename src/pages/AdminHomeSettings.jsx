import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Upload, Eye, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const fields = [
  { section: 'גיבור (Hero) - ראש הדף', items: [
    { key: 'hero_title', label: 'כותרת ראשית', type: 'input', placeholder: 'הֶאָרָה' },
    { key: 'hero_subtitle', label: 'כותרת משנה', type: 'input', placeholder: 'להאיר את הנשמה, לחזק את הרוח' },
    { key: 'hero_description', label: 'תיאור קצר', type: 'textarea', placeholder: 'מאמרי עומק בתורה, אמונה וחכמת החיים' },
    { key: 'hero_image_url', label: 'תמונת רקע', type: 'image' },
    { key: 'hero_cta_text', label: 'טקסט כפתור', type: 'input', placeholder: 'לכל המאמרים' },
  ]},
  { section: 'סקציית הפתיחה (IntroSection)', items: [
    { key: 'intro_badge_text', label: 'טקסט תג', type: 'input', placeholder: 'אתר הֶאָרָה' },
    { key: 'intro_heading', label: 'כותרת', type: 'input', placeholder: 'מאמרים באמונה לכל עת ולכל שעה' },
    { key: 'intro_description', label: 'תיאור', type: 'textarea', placeholder: '' },
    { key: 'intro_image_url', label: 'תמונה', type: 'image' },
    { key: 'intro_cta_text', label: 'טקסט כפתור', type: 'input', placeholder: 'התחילו לקרוא עכשיו' },
  ]},
  { section: 'תכונות בסקציית הפתיחה', items: [
    { key: 'intro_feature_1_title', label: 'תכונה 1 - כותרת', type: 'input' },
    { key: 'intro_feature_1_desc', label: 'תכונה 1 - תיאור', type: 'input' },
    { key: 'intro_feature_2_title', label: 'תכונה 2 - כותרת', type: 'input' },
    { key: 'intro_feature_2_desc', label: 'תכונה 2 - תיאור', type: 'input' },
    { key: 'intro_feature_3_title', label: 'תכונה 3 - כותרת', type: 'input' },
    { key: 'intro_feature_3_desc', label: 'תכונה 3 - תיאור', type: 'input' },
  ]},
  { section: 'ניוזלטר', items: [
    { key: 'newsletter_title', label: 'כותרת', type: 'input', placeholder: 'הצטרפו לניוזלטר' },
    { key: 'newsletter_subtitle', label: 'תיאור', type: 'textarea', placeholder: '' },
    { key: 'newsletter_button_text', label: 'טקסט כפתור', type: 'input', placeholder: 'הצטרפו עכשיו' },
  ]},
];

export default function AdminHomeSettings() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);

  const { data: settings } = useQuery({
    queryKey: ['homePageSettings'],
    queryFn: async () => {
      const all = await base44.entities.HomePageSettings.list();
      return all[0] || null;
    }
  });

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (settings?.id) {
        return base44.entities.HomePageSettings.update(settings.id, data);
      } else {
        return base44.entities.HomePageSettings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homePageSettings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  });

  const handleImageUpload = async (key, file) => {
    setUploadingKey(key);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, [key]: file_url }));
    setUploadingKey(null);
  };

  const handleSave = () => mutation.mutate(form);

  return (
    <div className="min-h-screen bg-[#f8f6f3]" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Home className="w-5 h-5 text-[#4a90a4]" />
              <h1 className="text-2xl font-bold text-[#1e3a5f]">תוכן עמוד הבית</h1>
            </div>
            <p className="text-slate-500 text-sm">שליטה מלאה על הטקסטים והתמונות בעמוד הבית</p>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl('Home')} target="_blank">
              <Button variant="outline" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                תצוגה מקדימה
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              disabled={mutation.isPending}
              className="bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saved ? '✓ נשמר!' : mutation.isPending ? 'שומר...' : 'שמור'}
            </Button>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
          <strong>שים לב:</strong> שדות ריקים ישתמשו בערכי ברירת המחדל. מלא רק את מה שאתה רוצה לשנות.
        </div>

        <div className="space-y-6">
          {fields.map(({ section, items }) => (
            <div key={section} className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-base font-bold text-[#1e3a5f] mb-5 pb-3 border-b border-slate-100">{section}</h2>
              <div className="space-y-5">
                {items.map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                    {type === 'input' && (
                      <Input
                        value={form[key] || ''}
                        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={placeholder}
                        dir="rtl"
                        className="text-base"
                      />
                    )}
                    {type === 'textarea' && (
                      <Textarea
                        value={form[key] || ''}
                        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={placeholder}
                        dir="rtl"
                        rows={3}
                        className="text-base resize-none"
                      />
                    )}
                    {type === 'image' && (
                      <div className="space-y-2">
                        <Input
                          value={form[key] || ''}
                          onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                          placeholder="https://..."
                          dir="ltr"
                          className="text-sm"
                        />
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-[#4a90a4] hover:text-[#1e3a5f] transition-colors">
                            <Upload className="w-4 h-4" />
                            {uploadingKey === key ? 'מעלה...' : 'העלה תמונה'}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => e.target.files[0] && handleImageUpload(key, e.target.files[0])}
                            />
                          </label>
                          {form[key] && (
                            <img src={form[key]} alt="" className="w-16 h-10 object-cover rounded-lg border border-slate-200" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={mutation.isPending}
            className="bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white flex items-center gap-2 px-8"
          >
            <Save className="w-4 h-4" />
            {saved ? '✓ נשמר!' : mutation.isPending ? 'שומר...' : 'שמור שינויים'}
          </Button>
        </div>
      </div>
    </div>
  );
}