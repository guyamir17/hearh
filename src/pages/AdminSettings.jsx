import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Settings, Save, Loader2, Phone, Mail, MapPin, 
  MessageCircle, Globe, Check, Image, Upload
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    hero_image_url: '',
    hero_title: '',
    hero_subtitle: '',
    hero_description: '',
    about_title: '',
    about_text: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    contact_address: '',
    working_hours: '',
    whatsapp_number: '',
    whatsapp_button_text: '',
    whatsapp_message: '',
    whatsapp_position: 'left',
    whatsapp_show_on: 'all',
    facebook_url: '',
    instagram_url: '',
    youtube_url: ''
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['adminSiteSettings'],
    queryFn: async () => {
      const all = await base44.entities.SiteSettings.list();
      return all[0];
    }
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        hero_image_url: settings.hero_image_url || '',
        hero_title: settings.hero_title || '',
        hero_subtitle: settings.hero_subtitle || '',
        hero_description: settings.hero_description || '',
        about_title: settings.about_title || '',
        about_text: settings.about_text || '',
        contact_name: settings.contact_name || '',
        contact_phone: settings.contact_phone || '',
        contact_email: settings.contact_email || '',
        contact_address: settings.contact_address || '',
        working_hours: settings.working_hours || '',
        whatsapp_number: settings.whatsapp_number || '',
        whatsapp_button_text: settings.whatsapp_button_text || '',
        whatsapp_message: settings.whatsapp_message || '',
        whatsapp_position: settings.whatsapp_position || 'left',
        whatsapp_show_on: settings.whatsapp_show_on || 'all',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
        youtube_url: settings.youtube_url || ''
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (settings?.id) {
        await base44.entities.SiteSettings.update(settings.id, data);
      } else {
        await base44.entities.SiteSettings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSiteSettings'] });
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] p-4 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-20 z-30">
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#1e3a5f] flex items-center gap-2">
              <Settings className="w-5 h-5" />
              הגדרות האתר
            </h1>
            <Button 
              onClick={handleSubmit}
              disabled={saveMutation.isPending}
              className="bg-[#1e3a5f] hover:bg-[#2a4a6f] rounded-xl"
            >
              {saveMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <>
                  <Check className="w-4 h-4 ml-1" />
                  נשמר!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 ml-1" />
                  שמור
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Hero Section Content */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1e3a5f] mb-5 flex items-center gap-2">
              <Image className="w-5 h-5" />
              תוכן עמוד הבית
            </h2>
            
            <div className="space-y-5">
              {/* Hero Image */}
              {formData.hero_image_url && (
                <div className="relative">
                  <img 
                    src={formData.hero_image_url} 
                    alt="תמונת פתיחה" 
                    className="w-full h-40 object-cover rounded-xl"
                  />
                </div>
              )}
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">תמונת רקע</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const { file_url } = await base44.integrations.Core.UploadFile({ file });
                      setFormData({...formData, hero_image_url: file_url});
                    }
                  }}
                  className="h-11 rounded-lg"
                />
              </div>
              
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">כותרת ראשית</Label>
                <Input
                  value={formData.hero_title || ''}
                  onChange={(e) => setFormData({...formData, hero_title: e.target.value})}
                  placeholder="הֶאָרָה"
                  className="h-11 rounded-lg"
                  dir="rtl"
                />
              </div>
              
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">כותרת משנה</Label>
                <Input
                  value={formData.hero_subtitle || ''}
                  onChange={(e) => setFormData({...formData, hero_subtitle: e.target.value})}
                  placeholder="להאיר את הנשמה, לחזק את הרוח"
                  className="h-11 rounded-lg"
                  dir="rtl"
                />
              </div>
              
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">תיאור קצר</Label>
                <Textarea
                  value={formData.hero_description || ''}
                  onChange={(e) => setFormData({...formData, hero_description: e.target.value})}
                  placeholder="מאמרי עומק בתורה, אמונה וחכמת החיים"
                  rows={2}
                  className="rounded-lg resize-none"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
          
          {/* About Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1e3a5f] mb-5">אזור אודות בעמוד הבית</h2>
            
            <div className="space-y-4">
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">כותרת</Label>
                <Input
                  value={formData.about_title || ''}
                  onChange={(e) => setFormData({...formData, about_title: e.target.value})}
                  placeholder="אודות האתר"
                  className="h-11 rounded-lg"
                  dir="rtl"
                />
              </div>
              
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">טקסט אודות</Label>
                <Textarea
                  value={formData.about_text || ''}
                  onChange={(e) => setFormData({...formData, about_text: e.target.value})}
                  placeholder="ברוכים הבאים לאתר הארה..."
                  rows={4}
                  className="rounded-lg resize-none"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1e3a5f] mb-5 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              פרטי יצירת קשר
            </h2>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#1e3a5f] mb-2 block text-sm">שם איש קשר</Label>
                  <Input
                    value={formData.contact_name}
                    onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                    placeholder="שם מלא"
                    className="h-11 rounded-lg"
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label className="text-[#1e3a5f] mb-2 block text-sm">מספר טלפון</Label>
                  <Input
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                    placeholder="050-000-0000"
                    className="h-11 rounded-lg"
                    dir="ltr"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">כתובת אימייל</Label>
                <Input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                  placeholder="email@example.com"
                  className="h-11 rounded-lg"
                  dir="ltr"
                />
              </div>
              
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">כתובת פיזית</Label>
                <Input
                  value={formData.contact_address}
                  onChange={(e) => setFormData({...formData, contact_address: e.target.value})}
                  placeholder="רחוב, עיר"
                  className="h-11 rounded-lg"
                  dir="rtl"
                />
              </div>
              
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">שעות פעילות</Label>
                <Input
                  value={formData.working_hours}
                  onChange={(e) => setFormData({...formData, working_hours: e.target.value})}
                  placeholder="ימים א׳-ה׳ 9:00-17:00"
                  className="h-11 rounded-lg"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1e3a5f] mb-5 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              באנר וואטסאפ
            </h2>
            
            <div className="space-y-5">
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">מספר וואטסאפ</Label>
                <Input
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({...formData, whatsapp_number: e.target.value})}
                  placeholder="972501234567"
                  className="h-11 rounded-lg"
                  dir="ltr"
                />
                <p className="text-xs text-slate-500 mt-1">הזינו את המספר עם קידומת מדינה ללא סימנים</p>
              </div>
              
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">טקסט כפתור</Label>
                <Input
                  value={formData.whatsapp_button_text}
                  onChange={(e) => setFormData({...formData, whatsapp_button_text: e.target.value})}
                  placeholder="שאלות? דברו איתנו"
                  className="h-11 rounded-lg"
                  dir="rtl"
                />
              </div>
              
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">הודעת פתיחה</Label>
                <Textarea
                  value={formData.whatsapp_message}
                  onChange={(e) => setFormData({...formData, whatsapp_message: e.target.value})}
                  placeholder="שלום, פניתי מאתר הארה"
                  rows={2}
                  className="rounded-lg resize-none"
                  dir="rtl"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#1e3a5f] mb-2 block text-sm">מיקום במסך</Label>
                  <Select
                    value={formData.whatsapp_position}
                    onValueChange={(value) => setFormData({...formData, whatsapp_position: value})}
                  >
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">שמאל</SelectItem>
                      <SelectItem value="right">ימין</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[#1e3a5f] mb-2 block text-sm">הצגה</Label>
                  <Select
                    value={formData.whatsapp_show_on}
                    onValueChange={(value) => setFormData({...formData, whatsapp_show_on: value})}
                  >
                    <SelectTrigger className="h-11 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">דסקטופ ומובייל</SelectItem>
                      <SelectItem value="desktop">דסקטופ בלבד</SelectItem>
                      <SelectItem value="mobile">מובייל בלבד</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1e3a5f] mb-5 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              רשתות חברתיות
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">פייסבוק</Label>
                <Input
                  value={formData.facebook_url}
                  onChange={(e) => setFormData({...formData, facebook_url: e.target.value})}
                  placeholder="https://facebook.com/..."
                  className="h-11 rounded-lg"
                  dir="ltr"
                />
              </div>
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">אינסטגרם</Label>
                <Input
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({...formData, instagram_url: e.target.value})}
                  placeholder="https://instagram.com/..."
                  className="h-11 rounded-lg"
                  dir="ltr"
                />
              </div>
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">יוטיוב</Label>
                <Input
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
                  placeholder="https://youtube.com/..."
                  className="h-11 rounded-lg"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}