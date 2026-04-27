import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Heart, BookOpen, Users, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import SEOHead from '@/components/shared/SEOHead';

const defaults = {
  hero_title: 'אודות הארה',
  hero_subtitle: 'מקום להארת הנפש ולחיזוק הרוח דרך תורה, אמונה וחכמת החיים',
  profile_image_url: 'https://images.unsplash.com/photo-1544476915-ed1370594142?w=400&q=80',
  main_text_1: 'אתר "הארה" נוצר מתוך אהבה עמוקה לתורה ולחכמת ישראל, ומתוך רצון כן להנגיש את האור הגדול הזה לכל אחד ואחת מעם ישראל.',
  main_text_2: 'באתר תמצאו מאמרים מעמיקים ונגישים בנושאי אמונה, פרשת השבוע, מועדי ישראל, עולם הנפש ומעגל החיים היהודי. כל מאמר נכתב בקפידה, עם שילוב של מקורות מהתורה לצד תובנות מעשיות ליום-יום.',
  vision_title: 'החזון שלנו',
  vision_text: 'אנו מאמינים שכל יהודי ויהודייה צריכים גישה לתורה ולחכמה היהודית בצורה נגישה ומזמינה. המטרה שלנו היא ליצור מקום שבו כל אחד יכול למצוא השראה, חיזוק והכוונה לחייו.',
  feature_1_title: 'תוכן איכותי',
  feature_1_desc: 'מאמרים מעמיקים המבוססים על מקורות התורה והחכמה היהודית',
  feature_2_title: 'נגישות',
  feature_2_desc: 'תכנים מותאמים לכל רמה, בשפה ברורה ונעימה',
  feature_3_title: 'קהילה',
  feature_3_desc: 'בניית קהילה של לומדים ומתעניינים בחכמת ישראל',
  feature_4_title: 'השראה',
  feature_4_desc: 'תכנים שמעוררים מחשבה ומביאים להתעלות',
  cta_title: 'רוצים להתחיל?',
  cta_subtitle: 'גלו את המאמרים שלנו והתחילו את המסע',
  cta_button_text: 'לכל המאמרים'
};

export default function About() {
  const { data: rawSettings } = useQuery({
    queryKey: ['aboutPageSettings'],
    queryFn: async () => {
      const all = await staticClient.entities.AboutPageSettings.list();
      return all[0] || {};
    }
  });

  const s = { ...defaults, ...rawSettings };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead title={`${s.hero_title} | הארה`} description={s.hero_subtitle} />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#1e3a5f] to-[#2a4a6f] text-white py-20 lg:py-28 overflow-hidden">
        {s.hero_image_url && (
          <>
            <img src={s.hero_image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f]/80 to-[#2a4a6f]/80" />
          </>
        )}
        <div className="relative max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">{s.hero_title}</h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">{s.hero_subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16 lg:py-20">

        {/* Profile image */}
        {s.profile_image_url && (
          <div className="flex justify-center mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-[#4a90a4]/20 blur-3xl rounded-full"></div>
              <img
                src={s.profile_image_url}
                alt="אודות"
                className="relative w-48 h-48 rounded-full object-cover shadow-2xl border-4 border-white"
              />
            </div>
          </div>
        )}

        {/* Main text */}
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f] mb-6">ברוכים הבאים לאתר הארה</h2>
          {s.main_text_1 && (
            <p className="text-lg text-slate-700 leading-relaxed mb-5" style={{ textAlign: 'justify', textAlignLast: 'right' }}>
              {s.main_text_1}
            </p>
          )}
          {s.main_text_2 && (
            <p className="text-lg text-slate-700 leading-relaxed" style={{ textAlign: 'justify', textAlignLast: 'right' }}>
              {s.main_text_2}
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
          {[
            { title: s.feature_1_title, desc: s.feature_1_desc, Icon: BookOpen },
            { title: s.feature_2_title, desc: s.feature_2_desc, Icon: Heart },
            { title: s.feature_3_title, desc: s.feature_3_desc, Icon: Users },
            { title: s.feature_4_title, desc: s.feature_4_desc, Icon: Star },
          ].map(({ title, desc, Icon }, i) => (
            title && (
              <div key={i} className="bg-[#f8f6f3] rounded-3xl p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-[#4a90a4] to-[#1e3a5f] rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">{title}</h3>
                <p className="text-slate-600">{desc}</p>
              </div>
            )
          ))}
        </div>

        {/* Vision */}
        {s.vision_title && (
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2a4a6f] rounded-3xl p-10 text-white text-center my-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-5">{s.vision_title}</h2>
            <p className="text-white/85 leading-relaxed text-lg max-w-2xl mx-auto">{s.vision_text}</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16 pt-12 border-t border-slate-100">
          <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">{s.cta_title}</h3>
          <p className="text-slate-600 mb-8">{s.cta_subtitle}</p>
          <Link
            to={createPageUrl('AllArticles')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1e3a5f] text-white rounded-full font-medium hover:bg-[#2a4a6f] transition-all shadow-lg hover:shadow-xl"
          >
            {s.cta_button_text}
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
