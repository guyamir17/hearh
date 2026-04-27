import React, { useState } from 'react';
import { Mail, Loader2, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { staticClient } from '@/api/staticClient';
import { useQuery } from '@tanstack/react-query';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { data: homeSettings } = useQuery({
    queryKey: ['homePageSettings'],
    queryFn: async () => {
      const all = await staticClient.entities.HomePageSettings.list();
      return all[0] || {};
    }
  });

  const newsletterTitle = homeSettings?.newsletter_title || 'רוצים לקבל את מאמרי השבת?';
  const newsletterSubtitle = homeSettings?.newsletter_subtitle || 'הירשמו לקבלת עדכונים על מאמרים חדשים ותכנים מיוחדים ישירות לתיבת המייל';
  const newsletterButtonText = homeSettings?.newsletter_button_text || 'הרשמה';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    
    try {
      await staticClient.entities.Subscriber.create({ email, subscribed: true });
      // Send notification email to admin
      await staticClient.integrations.Core.SendEmail({
        to: 'guyamir17@gmail.com',
        subject: 'נרשם חדש לאתר הארה',
        body: `שלום גיא-שלום,\n\nהתקבלה הרשמה חדשה לרשימת התפוצה:\n\nאימייל: ${email}\n\nבברכה,\nמערכת הארה`
      });
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError('אירעה שגיאה, נסו שוב');
    }
    setLoading(false);
  };

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-[#f8f6f3] to-[#f0ebe3]">
      <div className="max-w-2xl mx-auto px-4 lg:px-8 text-center">
        <div className="w-14 h-14 bg-[#1e3a5f] rounded-xl flex items-center justify-center mx-auto mb-5">
          <Mail className="w-7 h-7 text-white" />
        </div>
        
        {/* Section Header - Unified style */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-12 bg-[#1e3a5f]/20"></div>
          <span className="text-sm text-[#4a90a4] font-medium">עדכונים</span>
          <div className="h-px w-12 bg-[#1e3a5f]/20"></div>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f] mb-3">
          {newsletterTitle}
        </h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          {newsletterSubtitle}
        </p>

        {success ? (
          <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 rounded-xl py-5 px-6">
            <Check className="w-5 h-5" />
            <span className="font-medium">תודה! נרשמתם בהצלחה לרשימת התפוצה</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="כתובת אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 bg-white border-0 rounded-xl shadow-sm focus:ring-2 focus:ring-[#4a90a4] text-right"
              dir="rtl"
              required
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-12 px-8 bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                newsletterButtonText
              )}
            </Button>
          </form>
        )}

        {error && (
          <p className="text-red-500 mt-3 text-sm">{error}</p>
        )}
      </div>
    </section>
  );
}