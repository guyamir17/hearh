import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { BookOpen, Sparkles, Clock, Heart } from 'lucide-react';

export default function IntroSection() {
  const { data: legacySettings } = useQuery({
    queryKey: ['introSectionSettings'],
    queryFn: async () => {
      const all = await staticClient.entities.IntroSectionSettings.list();
      return all[0] || {};
    }
  });

  const { data: homeSettings } = useQuery({
    queryKey: ['homePageSettings'],
    queryFn: async () => {
      const all = await staticClient.entities.HomePageSettings.list();
      return all[0] || {};
    }
  });

  // Prefer homePageSettings, fallback to legacy IntroSectionSettings
  const settings = legacySettings;
  const badgeText = homeSettings?.intro_badge_text || settings?.badge_text || 'אתר הֶאָרָה';
  const mainHeading = homeSettings?.intro_heading || settings?.main_heading || 'מאמרים באמונה לכל עת ולכל שעה';
  const description = homeSettings?.intro_description || settings?.description || 'באתר שלנו תוכלו לקרוא מאמרים באמונה במגוון נושאים ולקבל דברי תורה מעמיקים המותאמים לכל רגע ולכל צורך. מפרשת השבוע ועד לימוד בחכמת החיים - כל התוכן כאן, בהישג יד.';
  const feature1Title = homeSettings?.intro_feature_1_title || settings?.feature_1_title || 'מאמרים מגוונים';
  const feature1Desc = homeSettings?.intro_feature_1_desc || settings?.feature_1_description || 'תורה, אמונה, מועדים, עולם הנפש ומעגל החיים';
  const feature2Title = homeSettings?.intro_feature_2_title || settings?.feature_2_title || 'תוכן מתעדכן';
  const feature2Desc = homeSettings?.intro_feature_2_desc || settings?.feature_2_description || 'מאמרים חדשים מתווספים באופן קבוע';
  const feature3Title = homeSettings?.intro_feature_3_title || settings?.feature_3_title || 'נגיש ונוח';
  const feature3Desc = homeSettings?.intro_feature_3_desc || settings?.feature_3_description || 'קריאה קלה וחווית משתמש מושלמת';
  const buttonText = homeSettings?.intro_cta_text || settings?.button_text || 'התחילו לקרוא עכשיו';
  const imageUrl = homeSettings?.intro_image_url || settings?.image_url || '';
  const primaryColor = settings?.primary_color || '#1e3a5f';
  const secondaryColor = settings?.secondary_color || '#4a90a4';
  const backgroundColor = settings?.background_color || '#ffffff';

  // Deepen primary color by 10%
  const deepenColor = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const factor = 0.9; // Darken by 10%
    return `#${Math.round(r * factor).toString(16).padStart(2, '0')}${Math.round(g * factor).toString(16).padStart(2, '0')}${Math.round(b * factor).toString(16).padStart(2, '0')}`;
  };

  const deepPrimary = deepenColor(primaryColor);
  const deepSecondary = deepenColor(secondaryColor);

  return (
    <section className="relative py-0 lg:py-20 overflow-hidden" style={{ backgroundColor }}>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-60" style={{ backgroundColor: `${secondaryColor}` }}></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-60" style={{ backgroundColor: `${primaryColor}` }}></div>

      <div className="relative max-w-7xl mx-auto lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 items-center">
          
          {/* Image first on mobile */}
          <div className="order-1 lg:order-2">
            <div className="relative lg:rounded-2xl overflow-hidden">
              {/* Main image */}
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="תמונה"
                  className="w-full h-[280px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:hidden"></div>
              </div>

              {/* Mobile: Badge and decorative line overlaying image */}
              <div className="lg:hidden absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-end">
                <div className="bg-gradient-to-t from-black/60 to-transparent pt-12 pb-6 px-4">
                  <div className="flex flex-col items-center mb-4">
                    {/* Decorative line */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-px w-16 bg-white/40"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
                      <div className="h-px w-16 bg-white/40"></div>
                    </div>
                    
                    {/* Badge - centered and larger */}
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold mb-2 bg-white/95 backdrop-blur-sm" style={{ color: deepPrimary }}>
                      <Sparkles className="w-5 h-5" />
                      {badgeText}
                    </div>
                  </div>
                  
                  {/* Text below image on mobile */}
                  <p className="text-white text-center text-sm leading-relaxed max-w-md mx-auto">
                    {description}
                  </p>
                </div>
              </div>

              {/* Desktop decorative elements */}
              <div className="hidden lg:block absolute -top-6 -right-6 w-32 h-32 rounded-2xl rotate-12" style={{ backgroundColor: `${secondaryColor}30` }}></div>
              <div className="hidden lg:block absolute -bottom-6 -left-6 w-24 h-24 rounded-2xl -rotate-12" style={{ backgroundColor: `${primaryColor}20` }}></div>
            </div>
          </div>

          {/* Text content - Desktop only */}
          <div className="order-2 lg:order-1 hidden lg:block px-4 lg:px-0">
            {/* Small badge - desktop */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: `${primaryColor}15`, color: deepPrimary }}>
              <Sparkles className="w-4 h-4" />
              {badgeText}
            </div>

            {/* Main heading */}
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-8 leading-tight" style={{ color: deepPrimary }}>
              {mainHeading}
            </h2>

            {/* Description */}
            <p className="text-lg text-slate-700 leading-relaxed mb-10">
              {description}
            </p>

            {/* Features */}
            <div className="space-y-5 mb-10">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2.5 rounded-lg" style={{ backgroundColor: `${secondaryColor}18` }}>
                  <BookOpen className="w-6 h-6" strokeWidth={1.5} style={{ color: deepSecondary }} />
                </div>
                <div>
                  <h3 className="font-bold mb-1.5 text-base" style={{ color: deepPrimary }}>{feature1Title}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{feature1Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-2.5 rounded-lg" style={{ backgroundColor: `${secondaryColor}18` }}>
                  <Clock className="w-6 h-6" strokeWidth={1.5} style={{ color: deepSecondary }} />
                </div>
                <div>
                  <h3 className="font-bold mb-1.5 text-base" style={{ color: deepPrimary }}>{feature2Title}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{feature2Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-2.5 rounded-lg" style={{ backgroundColor: `${secondaryColor}18` }}>
                  <Heart className="w-6 h-6" strokeWidth={1.5} style={{ color: deepSecondary }} />
                </div>
                <div>
                  <h3 className="font-bold mb-1.5 text-base" style={{ color: deepPrimary }}>{feature3Title}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{feature3Desc}</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to={createPageUrl('AllArticles')}
              className="inline-flex items-center gap-2 px-8 py-4 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: deepPrimary }}
            >
              {buttonText}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}