import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { ArrowLeft } from 'lucide-react';

export default function AboutSection() {
  const { data: settings } = useQuery({
    queryKey: ['aboutSettings'],
    queryFn: async () => {
      const all = await staticClient.entities.AboutSettings.list();
      return all[0] || {};
    }
  });

  const title = settings?.title || 'אודות האתר';
  const description = settings?.description || 'אתר הארה הוקם במטרה להנגיש תורה ואמונה לכל אחד ואחת. כאן תמצאו מאמרים מעמיקים בפרשת השבוע, חגים ומועדים, עבודת המידות וחכמת החיים.';
  const imageUrl = settings?.image_url || 'https://images.unsplash.com/photo-1544476915-ed1370594142?w=400&q=80';
  const buttonText = settings?.button_text || 'צרו קשר';
  const primaryColor = settings?.primary_color || '#1e3a5f';
  const backgroundColor = settings?.background_color || '#ffffff';

  return (
    <section className="py-16 lg:py-20" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12" style={{ backgroundColor: `${primaryColor}20` }}></div>
            <span className="text-sm text-[#4a90a4] font-medium">הכירו אותנו</span>
            <div className="h-px w-12" style={{ backgroundColor: `${primaryColor}20` }}></div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-3" style={{ color: primaryColor }}>
            {title}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center">
            {imageUrl && (
              <div className="mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#4a90a4]/20 blur-2xl rounded-full"></div>
                  <img
                    src={imageUrl}
                    alt={title}
                    className="relative w-36 h-36 lg:w-44 lg:h-44 rounded-full object-cover shadow-xl border-4 border-white"
                  />
                </div>
              </div>
            )}

            <p className="text-lg text-slate-700 leading-relaxed mb-6 max-w-2xl whitespace-pre-line">
              {description}
            </p>
            
            <Link
              to={createPageUrl('Contact')}
              className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              {buttonText}
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}