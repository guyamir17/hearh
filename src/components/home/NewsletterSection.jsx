import React from 'react';
import { Mail } from 'lucide-react';
import { staticClient } from '@/api/staticClient';
import { useQuery } from '@tanstack/react-query';

export default function NewsletterSection() {
  const { data: homeSettings } = useQuery({
    queryKey: ['homePageSettings'],
    queryFn: async () => {
      const all = await staticClient.entities.HomePageSettings.list();
      return all[0] || {};
    }
  });

  const newsletterTitle = homeSettings?.newsletter_title || 'רוצים לקבל את מאמרי השבת?';
  const newsletterSubtitle = homeSettings?.newsletter_subtitle || 'לקבלת עדכונים על מאמרים חדשים ותכנים מיוחדים, כתבו לנו ונצרף אתכם לרשימת התפוצה';
  const newsletterButtonText = homeSettings?.newsletter_button_text || 'שליחת בקשה במייל';

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

        <a
          href="mailto:guyamir17@gmail.com?subject=%D7%94%D7%A8%D7%A9%D7%9E%D7%94%20%D7%9C%D7%A8%D7%A9%D7%99%D7%9E%D7%AA%20%D7%94%D7%AA%D7%A4%D7%95%D7%A6%D7%94%20-%20%D7%94%D7%90%D7%A8%D7%94"
          className="inline-flex h-12 items-center justify-center px-8 bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
        >
          {newsletterButtonText}
        </a>
      </div>
    </section>
  );
}
