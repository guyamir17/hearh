import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import LightbulbLogo from '@/components/shared/LightbulbLogo';

export default function Footer() {
  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const all = await staticClient.entities.SiteSettings.list();
      return all[0] || {};
    }
  });

  const categoryLinks = [
    { name: 'פרשת שבוע', page: 'ParshatShavua' },
    { name: 'מאמרים באמונה', page: 'MaamarimEmuna' },
    { name: 'מועדי ישראל', page: 'MoadeiYisrael' },
    { name: 'עולם הנפש', page: 'OlamHanefesh' },
    { name: 'מעגל החיים', page: 'MaagalHachaim' }
  ];

  const siteLinks = [
    { name: 'כל המאמרים', page: 'AllArticles' },
    { name: 'חנות', page: 'Shop' },
    { name: 'אודות', page: 'About' },
    { name: 'צור קשר', page: 'Contact' }
  ];

  return (
    <footer className="bg-[#1e3a5f] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0 text-center md:text-right">
          
          {/* Column 1: Newsletter */}
          <div className="lg:pl-8 lg:border-l lg:border-white/10">
            <h3 className="text-lg font-bold mb-5">רוצים לקבל עדכונים?</h3>
            <p className="text-white/70 text-[15px] mb-4 leading-relaxed">
              הירשמו לקבלת מאמרים ותכנים חדשים ישירות למייל
            </p>
            <a
              href="mailto:guyamir17@gmail.com?subject=%D7%94%D7%A8%D7%A9%D7%9E%D7%94%20%D7%9C%D7%A2%D7%93%D7%9B%D7%95%D7%A0%D7%99%D7%9D%20-%20%D7%94%D7%90%D7%A8%D7%94"
              className="inline-flex items-center gap-2 h-11 px-4 bg-[#4a90a4] hover:bg-[#5aa0b4] rounded-lg transition-colors text-[15px]"
            >
              <Send className="w-4 h-4" />
              הרשמה במייל
            </a>
          </div>

          {/* Column 2: Categories */}
          <div className="lg:px-8 lg:border-l lg:border-white/10">
            <h3 className="text-lg font-bold mb-5">קטגוריות</h3>
            <nav className="space-y-3">
              {categoryLinks.map((link) => (
                <Link
                  key={link.name}
                  to={createPageUrl(link.page)}
                  className="block text-white/70 hover:text-white transition-colors text-[15px] leading-relaxed"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Site Links */}
          <div className="lg:px-8 lg:border-l lg:border-white/10">
            <h3 className="text-lg font-bold mb-5">מפת אתר</h3>
            <nav className="space-y-3">
              {siteLinks.map((link) => (
                <Link
                  key={link.name}
                  to={createPageUrl(link.page)}
                  className="block text-white/70 hover:text-white transition-colors text-[15px] leading-relaxed"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Contact */}
          <div className="lg:pr-8">
            <h3 className="text-lg font-bold mb-5">יצירת קשר</h3>
            <div className="space-y-3 flex flex-col items-center md:items-start">
              {settings?.contact_email && (
                <a 
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[15px]"
                >
                  <Mail className="w-5 h-5" strokeWidth={1.5} />
                  {settings.contact_email}
                </a>
              )}
              {settings?.contact_phone && (
                <a 
                  href={`tel:${settings.contact_phone}`}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[15px]"
                >
                  <Phone className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                  <span dir="ltr">{settings.contact_phone}</span>
                </a>
              )}
              {settings?.whatsapp_number && (
                <a 
                  href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[15px]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.789l4.89-1.56A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.24 0-4.318-.724-6.015-1.955l-.42-.298-2.904.928.882-2.813-.31-.44A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  וואטסאפ
                </a>
              )}
              {settings?.contact_address && (
                <div className="flex items-center gap-2 text-white/70 text-[15px]">
                  <MapPin className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                  {settings.contact_address}
                </div>
              )}
              {/* Fallback if no contact details configured */}
              {!settings?.contact_email && !settings?.contact_phone && !settings?.whatsapp_number && (
                <Link
                  to={createPageUrl('Contact')}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[15px]"
                >
                  <Mail className="w-5 h-5" strokeWidth={1.5} />
                  לטופס יצירת קשר
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {/* Logo - Centered */}
            <div className="flex justify-center">
              <LightbulbLogo size="small" variant="light" />
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
            </div>

            {/* Copyright */}
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} הארה. כל הזכויות שמורות.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
