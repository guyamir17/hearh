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

export default function AdminAboutSettings() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['aboutSettings'],
    queryFn: async () => {
      const all = await base44.entities.AboutSettings.list();
      return all[0] || null;
    }
  });

  const [formData, setFormData] = useState(null);

  React.useEffect(() => {
    if (settings && !formData) {
      setFormData({
        title: settings.title || 'אודות האתר',
        description: settings.description || 'אתר הארה הוקם במטרה להנגיש תורה ואמונה לכל אחד ואחת. כאן תמצאו מאמרים מעמיקים בפרשת השבוע, חגים ומועדים, עבודת המידות וחכמת החיים.',
        image_url: settings.image_url || '',
        button_text: settings.button_text || 'צרו קשר',
        primary_color: settings.primary_color || '#1e3a5f',
        background_color: settings.background_color || '#ffffff'
      });
    } else if (!settings && !formData) {
      setFormData({
        title: 'אודות האתר',
        description: 'אתר הארה הוקם במטרה להנגיש תורה ואמונה לכל אחד ואחת. כאן תמצאו מאמרים מעמיקים בפרשת השבוע, חגים ומועדים, עבודת המידות וחכמת החיים.',
        image_url: '',
        button_text: 'צרו קשר',
        primary_color: '#1e3a5f',
        background_color: '#ffffff'
      });
    }
  }, [settings, formData]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (settings) {
        await base44.entities.AboutSettings.update(settings.id, data);
      } else {
        await base44.entities.AboutSettings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aboutSettings'] });
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
              <h1 className="text-lg font-bold text-[#1e3a5f]">עריכת סקשן אודות</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            <h2 className="text-base font-bold text-[#1e3a5f]">תוכן</h2>
            
            <div>
              <Label className="text-[#1e3a5f] mb-2 block text-sm">כותרת</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                dir="rtl"
              />
            </div>

            <div>
              <Label className="text-[#1e3a5f] mb-2 block text-sm">תיאור</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                dir="rtl"
              />
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