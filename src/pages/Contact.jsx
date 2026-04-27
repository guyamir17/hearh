import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, MapPin, Send, Loader2, Check, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { staticClient } from '@/api/staticClient';

export default function Contact() {
  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const all = await staticClient.entities.SiteSettings.list();
      return all[0] || {};
    }
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await staticClient.entities.ContactMessage.create(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError('אירעה שגיאה בשליחת ההודעה. נסו שוב.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Hero */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1e3a5f] mb-4">
            יצירת קשר
          </h1>
          <p className="text-lg text-slate-600">
            נשמח לשמוע מכם! מלאו את הטופס ונחזור אליכם בהקדם
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#1e3a5f] mb-6">פרטי התקשרות</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4a90a4]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#4a90a4]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1e3a5f] mb-1">אימייל</h3>
                    <p className="text-slate-600">{settings?.contact_email || 'haara.website@gmail.com'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4a90a4]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#4a90a4]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1e3a5f] mb-1">טלפון</h3>
                    <p className="text-slate-600" dir="ltr">{settings?.contact_phone || '050-123-4567'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4a90a4]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#4a90a4]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1e3a5f] mb-1">כתובת</h3>
                    <p className="text-slate-600">{settings?.contact_address || 'ישראל'}</p>
                  </div>
                </div>

                {settings?.working_hours && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#4a90a4]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#4a90a4]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#1e3a5f] mb-1">שעות פעילות</h3>
                      <p className="text-slate-600">{settings.working_hours}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              {success ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">ההודעה נשלחה בהצלחה!</h2>
                  <p className="text-slate-600">נחזור אליכם בהקדם האפשרי</p>
                  <Button
                    onClick={() => setSuccess(false)}
                    className="mt-6 bg-[#1e3a5f] hover:bg-[#2a4a6f]"
                  >
                    שליחת הודעה נוספת
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                        שם מלא *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="h-12 rounded-xl"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                        אימייל *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="h-12 rounded-xl"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                        טלפון
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="h-12 rounded-xl"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                        נושא
                      </label>
                      <Input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="h-12 rounded-xl"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1e3a5f] mb-2">
                      הודעה *
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                      rows={6}
                      className="rounded-xl resize-none"
                      dir="rtl"
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-[#1e3a5f] hover:bg-[#2a4a6f] rounded-xl text-lg font-medium"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5 ml-2" />
                        שליחה
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}