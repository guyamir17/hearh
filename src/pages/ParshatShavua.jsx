import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';

const books = [
  { name: 'בראשית', image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80', description: 'מעשה בראשית ותולדות האבות' },
  { name: 'שמות', image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80', description: 'יציאת מצרים ומתן תורה' },
  { name: 'ויקרא', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', description: 'קורבנות וקדושה' },
  { name: 'במדבר', image: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&q=80', description: 'מסע במדבר' },
  { name: 'דברים', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', description: 'משנה תורה' }
];

export default function ParshatShavua() {
  const { data: categorySettings } = useQuery({
    queryKey: ['categorySettings'],
    queryFn: async () => {
      return await staticClient.entities.CategorySettings.list();
    }
  });

  const settings = categorySettings?.find(s => s.category_key === 'פרשת_שבוע');
  const displayTitle = settings?.title || 'פרשת שבוע';
  const displayDescription = settings?.description || 'דברי תורה, רעיונות והשקפה על פרשיות השבוע';

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
          {/* Decorative top line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex gap-1">
              <span className="w-1 h-1 rounded-full bg-[#1e3a5f]/30"></span>
              <span className="w-1 h-1 rounded-full bg-[#1e3a5f]/30"></span>
              <span className="w-1 h-1 rounded-full bg-[#1e3a5f]/30"></span>
            </div>
            <div className="h-px w-20 bg-[#1e3a5f]/15"></div>
            <div className="h-px w-20 bg-[#1e3a5f]/15"></div>
            <div className="flex gap-1">
              <span className="w-1 h-1 rounded-full bg-[#1e3a5f]/30"></span>
              <span className="w-1 h-1 rounded-full bg-[#1e3a5f]/30"></span>
              <span className="w-1 h-1 rounded-full bg-[#1e3a5f]/30"></span>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <BookOpen className="w-6 h-6 text-[#1e3a5f]" strokeWidth={1.5} />
              <h1 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f]">
                {displayTitle}
              </h1>
            </div>
            <p className="text-slate-500 max-w-lg mx-auto text-sm lg:text-base">
              {displayDescription}
            </p>
          </div>
        </div>
        <div className="h-px bg-slate-100"></div>
      </div>

      {/* Books Grid */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
        <h2 className="text-lg font-bold text-[#1e3a5f] mb-6 text-center">בחרו ספר</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Link
              key={book.name}
              to={`${createPageUrl('BookParshiyot')}?book=${book.name}`}
              className="group relative rounded-2xl overflow-hidden h-48 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <img
                src={book.image}
                alt={`ספר ${book.name}`}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                style={{ objectPosition: 'center 35%' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#d4af37] transition-colors">
                  ספר {book.name}
                </h3>
                <p className="text-white/80 text-sm">
                  {book.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}