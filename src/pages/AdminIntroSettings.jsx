import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowRight, Save, Loader2, Upload, X, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function AdminIntroSettings() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['introSectionSettings'],
    queryFn: async () => {
      const all = await base44.entities.IntroSectionSettings.list();
      return all[0] || null;
    }
  });

  const [formData, setFormData] = useState(null);

  React.useEffect(() => {
    if (settings && !formData) {
      setFormData({
        badge_text: settings.badge_text || 'אתר הֶאָרָה',
        main_heading: settings.main_heading || 'מאמרים באמונה לכל עת ולכל שעה',
        description: settings.description || 'באתר שלנו תוכלו לקרוא מאמרים באמונה במגוון נושאים ולקבל דברי תורה מעמיקים המותאמים לכל רגע ולכל צורך. מפרשת השבוע ועד לימוד בחכמת החיים - כל התוכן כאן, בהישג יד.',
        feature_1_title: settings.feature_1_title || 'מאמרים מגוונים',
        feature_1_description: settings.feature_1_description || 'תורה, אמונה, מועדים, עולם הנפש ומעגל החיים',
        feature_2_title: settings.feature_2_title || 'תוכן מתעדכן',
        feature_2_description: settings.feature_2_description || 'מאמרים חדשים מתווספים באופן קבוע',
        feature_3_title: settings.feature_3_title || 'נגיש ונוח',
        feature_3_description: settings.feature_3_description || 'קריאה קלה וחווית משתמש מושלמת',
        button_text: settings.button_text || 'התחילו לקרוא עכשיו',
        image_url: settings.image_url || '',
        primary_color: settings.primary_color || '#1e3a5f',
        secondary_color: settings.secondary_color || '#4a90a4',
        background_color: settings.background_color || '#ffffff',
        title_font_size: settings.title_font_size || '32',
        title_font_weight: settings.title_font_weight || '800',
        description_font_size: settings.description_font_size || '18',
        spacing_top: settings.spacing_top || '80',
        spacing_bottom: settings.spacing_bottom || '80'
      });
    } else if (!settings && !formData) {
      setFormData({
        badge_text: 'אתר הֶאָרָה',
        main_heading: 'מאמרים באמונה לכל עת ולכל שעה',
        description: 'באתר שלנו תוכלו לקרוא מאמרים באמונה במגוון נושאים ולקבל דברי תורה מעמיקים המותאמים לכל רגע ולכל צורך. מפרשת השבוע ועד לימוד בחכמת החיים - כל התוכן כאן, בהישג יד.',
        feature_1_title: 'מאמרים מגוונים',
        feature_1_description: 'תורה, אמונה, מועדים, עולם הנפש ומעגל החיים',
        feature_2_title: 'תוכן מתעדכן',
        feature_2_description: 'מאמרים חדשים מתווספים באופן קבוע',
        feature_3_title: 'נגיש ונוח',
        feature_3_description: 'קריאה קלה וחווית משתמש מושלמת',
        button_text: 'התחילו לקרוא עכשיו',
        image_url: '',
        primary_color: '#1e3a5f',
        secondary_color: '#4a90a4',
        background_color: '#ffffff',
        title_font_size: '32',
        title_font_weight: '800',
        description_font_size: '18',
        spacing_top: '80',
        spacing_bottom: '80'
      });
    }
  }, [settings, formData]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (settings) {
        await base44.entities.IntroSectionSettings.update(settings.id, data);
      } else {
        await base44.entities.IntroSectionSettings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['introSectionSettings'] });
      alert('הגדרות נשמרו בהצלחה!');
    }
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, image_url: file_url });
    } catch (error) {
      console.error('Upload error:', error);
    }
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (isLoading || !formData) {
    return <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">טוען...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <div className="bg-white border-b border-slate-100 sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                to={createPageUrl('AdminSettings')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-[#1e3a5f]" />
              </Link>
              <h1 className="text-lg font-bold text-[#1e3a5f]">עריכת סקשן מבוא</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Link to={createPageUrl('Home')} target="_blank">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 ml-1" />
                  תצוגה מקדימה
                </Button>
              </Link>
              <Button 
                onClick={handleSubmit}
                disabled={saveMutation.isPending}
                size="sm"
                className="bg-[#1e3a5f] hover:bg-[#2a4a6f]"
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
          {/* Colors */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1e3a5f] mb-5">צבעים</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">צבע ראשי</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="w-20 h-11 p-1"
                  />
                  <Input
                    type="text"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="flex-1 h-11"
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">צבע משני</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="w-20 h-11 p-1"
                  />
                  <Input
                    type="text"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="flex-1 h-11"
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">צבע רקע</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.background_color}
                    onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                    className="w-20 h-11 p-1"
                  />
                  <Input
                    type="text"
                    value={formData.background_color}
                    onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                    className="flex-1 h-11"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Texts */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-[#1e3a5f]">טקסטים</h2>
            
            <div>
              <Label className="text-[#1e3a5f] mb-2 block text-sm">טקסט התג</Label>
              <Input
                value={formData.badge_text}
                onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                dir="rtl"
              />
            </div>

            <div>
              <Label className="text-[#1e3a5f] mb-2 block text-sm">כותרת ראשית</Label>
              <Input
                value={formData.main_heading}
                onChange={(e) => setFormData({ ...formData, main_heading: e.target.value })}
                dir="rtl"
              />
            </div>

            <div>
              <Label className="text-[#1e3a5f] mb-2 block text-sm">תיאור</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                dir="rtl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">תכונה 1 - כותרת</Label>
                <Input
                  value={formData.feature_1_title}
                  onChange={(e) => setFormData({ ...formData, feature_1_title: e.target.value })}
                  dir="rtl"
                />
              </div>
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">תכונה 1 - תיאור</Label>
                <Input
                  value={formData.feature_1_description}
                  onChange={(e) => setFormData({ ...formData, feature_1_description: e.target.value })}
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">תכונה 2 - כותרת</Label>
                <Input
                  value={formData.feature_2_title}
                  onChange={(e) => setFormData({ ...formData, feature_2_title: e.target.value })}
                  dir="rtl"
                />
              </div>
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">תכונה 2 - תיאור</Label>
                <Input
                  value={formData.feature_2_description}
                  onChange={(e) => setFormData({ ...formData, feature_2_description: e.target.value })}
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">תכונה 3 - כותרת</Label>
                <Input
                  value={formData.feature_3_title}
                  onChange={(e) => setFormData({ ...formData, feature_3_title: e.target.value })}
                  dir="rtl"
                />
              </div>
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">תכונה 3 - תיאור</Label>
                <Input
                  value={formData.feature_3_description}
                  onChange={(e) => setFormData({ ...formData, feature_3_description: e.target.value })}
                  dir="rtl"
                />
              </div>
            </div>

            <div>
              <Label className="text-[#1e3a5f] mb-2 block text-sm">טקסט כפתור</Label>
              <Input
                value={formData.button_text}
                onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                dir="rtl"
              />
            </div>
          </div>

          {/* Typography & Spacing */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-[#1e3a5f]">טיפוגרפיה ומרווחים</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">גודל כותרת (px)</Label>
                <Input
                  type="number"
                  value={formData.title_font_size}
                  onChange={(e) => setFormData({ ...formData, title_font_size: e.target.value })}
                  min="20"
                  max="60"
                />
              </div>
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">עובי כותרת (100-900)</Label>
                <Input
                  type="number"
                  value={formData.title_font_weight}
                  onChange={(e) => setFormData({ ...formData, title_font_weight: e.target.value })}
                  min="100"
                  max="900"
                  step="100"
                />
              </div>
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">גודל תיאור (px)</Label>
                <Input
                  type="number"
                  value={formData.description_font_size}
                  onChange={(e) => setFormData({ ...formData, description_font_size: e.target.value })}
                  min="14"
                  max="24"
                />
              </div>
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">ריווח עליון (px)</Label>
                <Input
                  type="number"
                  value={formData.spacing_top}
                  onChange={(e) => setFormData({ ...formData, spacing_top: e.target.value })}
                  min="0"
                  max="200"
                />
              </div>
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">ריווח תחתון (px)</Label>
                <Input
                  type="number"
                  value={formData.spacing_bottom}
                  onChange={(e) => setFormData({ ...formData, spacing_bottom: e.target.value })}
                  min="0"
                  max="200"
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1e3a5f] mb-5">תמונה</h2>

            {formData.image_url && (
              <div className="relative rounded-xl overflow-hidden mb-4">
                <img
                  src={formData.image_url}
                  alt="תמונה"
                  className="w-full h-56 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image_url: '' })}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <label className="block mb-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#4a90a4] transition-colors">
                {uploading ? (
                  <Loader2 className="w-6 h-6 text-[#4a90a4] mx-auto animate-spin" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-600 text-sm">לחצו להעלאת תמונה</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            <div>
              <Label className="text-[#1e3a5f] mb-2 block text-sm">או הדביקו קישור</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                dir="ltr"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}