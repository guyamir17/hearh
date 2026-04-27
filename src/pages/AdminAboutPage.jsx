import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Upload, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const fields = [
  { section: 'גיבור (Hero)', items: [
    { key: 'hero_title', label: 'כותרת ראשית', type: 'input' },
    { key: 'hero_subtitle', label: 'כותרת משנה', type: 'textarea' },
    { key: 'hero_image_url', label: 'תמונת רקע (URL)', type: 'image' },
  ]},
  { section: 'תמונה ותוכן', items: [
    { key: 'profile_image_url', label: 'תמונת פרופיל עגולה (URL)', type: 'image' },
    { key: 'main_text_1', label: 'פסקה ראשונה', type: 'textarea' },
    { key: 'main_text_2', label: 'פסקה שניה', type: 'textarea' },
  ]},
  { section: 'תכונות (4 כרטיסים)', items: [
    { key: 'feature_1_title', label: 'כרטיס 1 - כותרת', type: 'input' },
    { key: 'feature_1_desc', label: 'כרטיס 1 - תיאור', type: 'textarea' },
    { key: 'feature_2_title', label: 'כרטיס 2 - כותרת', type: 'input' },
    { key: 'feature_2_desc', label: 'כרטיס 2 - תיאור', type: 'textarea' },
    { key: 'feature_3_title', label: 'כרטיס 3 - כותרת', type: 'input' },
    { key: 'feature_3_desc', label: 'כרטיס 3 - תיאור', type: 'textarea' },
    { key: 'feature_4_title', label: 'כרטיס 4 - כותרת', type: 'input' },
    { key: 'feature_4_desc', label: 'כרטיס 4 - תיאור', type: 'textarea' },
  ]},
  { section: 'קטע החזון', items: [
    { key: 'vision_title', label: 'כותרת החזון', type: 'input' },
    { key: 'vision_text', label: 'טקסט החזון', type: 'textarea' },
  ]},
  { section: 'קריאה לפעולה', items: [
    { key: 'cta_title', label: 'כותרת', type: 'input' },
    { key: 'cta_subtitle', label: 'תיאור', type: 'input' },
    { key: 'cta_button_text', label: 'טקסט כפתור', type: 'input' },
  ]},
];

export default function AdminAboutPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);

  const { data: settings } = useQuery({
    queryKey: ['aboutPageSettings'],
    queryFn: async () => {
      const all = await base44.entities.AboutPageSettings.list();
      return all[0] || null;
    }
  });

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (settings?.id) {
        return base44.entities.AboutPageSettings.update(settings.id, data);
      } else {
        return base44.entities.AboutPageSettings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aboutPageSettings'] });
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
            <h1 className="text-2xl font-bold text-[#1e3a5f]">עריכת עמוד אודות</h1>
            <p className="text-slate-500 text-sm mt-1">כל השינויים יופיעו מיד בעמוד האודות</p>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl('About')} target="_blank">
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
              {saved ? 'נשמר!' : mutation.isPending ? 'שומר...' : 'שמור שינויים'}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {fields.map(({ section, items }) => (
            <div key={section} className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-base font-bold text-[#1e3a5f] mb-5 pb-3 border-b border-slate-100">{section}</h2>
              <div className="space-y-5">
                {items.map(({ key, label, type }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                    {type === 'input' && (
                      <Input
                        value={form[key] || ''}
                        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                        dir="rtl"
                        className="text-base"
                      />
                    )}
                    {type === 'textarea' && (
                      <Textarea
                        value={form[key] || ''}
                        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
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
            {saved ? 'נשמר!' : mutation.isPending ? 'שומר...' : 'שמור שינויים'}
          </Button>
        </div>
      </div>
    </div>
  );
}