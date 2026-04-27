import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { staticClient } from '@/api/staticClient';

export default function Contact() {
  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const all = await staticClient.entities.SiteSettings.list();
      return all[0] || {};
    }
  });

  const contactEmail = settings?.contact_email || 'haara.website@gmail.com';
  const contactPhone = settings?.contact_phone || '050-123-4567';

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1e3a5f] mb-4">
            יצירת קשר
          </h1>
          <p className="text-lg text-slate-600">
            נשמח לשמוע מכם דרך אחד מפרטי ההתקשרות הבאים.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-8">פרטי התקשרות</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-start gap-4 rounded-2xl border border-slate-100 p-5 hover:border-[#4a90a4]/40 transition-colors"
            >
              <div className="w-12 h-12 bg-[#4a90a4]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#4a90a4]" />
              </div>
              <div>
                <h3 className="font-medium text-[#1e3a5f] mb-1">אימייל</h3>
                <p className="text-slate-600">{contactEmail}</p>
              </div>
            </a>

            <a
              href={`tel:${contactPhone}`}
              className="flex items-start gap-4 rounded-2xl border border-slate-100 p-5 hover:border-[#4a90a4]/40 transition-colors"
            >
              <div className="w-12 h-12 bg-[#4a90a4]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-[#4a90a4]" />
              </div>
              <div>
                <h3 className="font-medium text-[#1e3a5f] mb-1">טלפון</h3>
                <p className="text-slate-600" dir="ltr">{contactPhone}</p>
              </div>
            </a>

            <div className="flex items-start gap-4 rounded-2xl border border-slate-100 p-5">
              <div className="w-12 h-12 bg-[#4a90a4]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#4a90a4]" />
              </div>
              <div>
                <h3 className="font-medium text-[#1e3a5f] mb-1">כתובת</h3>
                <p className="text-slate-600">{settings?.contact_address || 'ישראל'}</p>
              </div>
            </div>

            {settings?.working_hours && (
              <div className="flex items-start gap-4 rounded-2xl border border-slate-100 p-5">
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

          <div className="mt-10">
            <a
              href={`mailto:${contactEmail}?subject=${encodeURIComponent('פנייה מאתר הארה')}`}
              className="inline-flex items-center justify-center gap-2 h-14 px-8 py-4 bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white rounded-xl font-medium transition-colors"
            >
              <Send className="w-5 h-5" />
              שליחת מייל
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
