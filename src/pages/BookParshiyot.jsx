import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, ArrowRight } from 'lucide-react';

const parshiyotData = {
  'בראשית': [
    { name: 'בראשית', image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80' },
    { name: 'נח', image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&q=80' },
    { name: 'לך_לך', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80' },
    { name: 'וירא', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
    { name: 'חיי_שרה', image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80' },
    { name: 'תולדות', image: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=600&q=80' },
    { name: 'ויצא', image: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=600&q=80' },
    { name: 'וישלח', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80' },
    { name: 'וישב', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80' },
    { name: 'מקץ', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
    { name: 'ויגש', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
    { name: 'ויחי', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80' }
  ],
  'שמות': [
    { name: 'שמות', image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=600&q=80' },
    { name: 'וארא', image: 'https://images.unsplash.com/photo-1514923995763-768e52f5af87?w=600&q=80' },
    { name: 'בא', image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&q=80' },
    { name: 'בשלח', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&q=80' },
    { name: 'יתרו', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
    { name: 'משפטים', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
    { name: 'תרומה', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80' },
    { name: 'תצווה', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80' },
    { name: 'כי_תשא', image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80' },
    { name: 'ויקהל', image: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=600&q=80' },
    { name: 'פקודי', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80' }
  ],
  'ויקרא': [
    { name: 'ויקרא', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80' },
    { name: 'צו', image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=600&q=80' },
    { name: 'שמיני', image: 'https://images.unsplash.com/photo-1514923995763-768e52f5af87?w=600&q=80' },
    { name: 'תזריע', image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&q=80' },
    { name: 'מצורע', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&q=80' },
    { name: 'אחרי_מות', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
    { name: 'קדושים', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
    { name: 'אמור', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80' },
    { name: 'בהר', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80' },
    { name: 'בחוקותי', image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80' }
  ],
  'במדבר': [
    { name: 'במדבר', image: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=600&q=80' },
    { name: 'נשא', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80' },
    { name: 'בהעלותך', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80' },
    { name: 'שלח', image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=600&q=80' },
    { name: 'קרח', image: 'https://images.unsplash.com/photo-1514923995763-768e52f5af87?w=600&q=80' },
    { name: 'חוקת', image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&q=80' },
    { name: 'בלק', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&q=80' },
    { name: 'פינחס', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
    { name: 'מטות', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
    { name: 'מסעי', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80' }
  ],
  'דברים': [
    { name: 'דברים', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80' },
    { name: 'ואתחנן', image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80' },
    { name: 'עקב', image: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=600&q=80' },
    { name: 'ראה', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80' },
    { name: 'שופטים', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80' },
    { name: 'כי_תצא', image: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=600&q=80' },
    { name: 'כי_תבוא', image: 'https://images.unsplash.com/photo-1514923995763-768e52f5af87?w=600&q=80' },
    { name: 'נצבים', image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&q=80' },
    { name: 'וילך', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&q=80' },
    { name: 'האזינו', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
    { name: 'וזאת_הברכה', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' }
  ]
};

export default function BookParshiyot() {
  const urlParams = new URLSearchParams(window.location.search);
  const book = urlParams.get('book');
  const parshiyot = parshiyotData[book] || [];

  if (!book || parshiyot.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">ספר לא נמצא</p>
          <Link to={createPageUrl('ParshatShavua')} className="text-[#4a90a4] hover:underline">
            חזרה לפרשת שבוע
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <div className="flex items-center gap-3 mb-6">
            <Link 
              to={createPageUrl('ParshatShavua')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-[#1e3a5f]" />
            </Link>
          </div>

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
                ספר {book}
              </h1>
            </div>
            <p className="text-slate-500 max-w-lg mx-auto text-sm lg:text-base">
              בחרו פרשה לצפייה במאמרים
            </p>
          </div>
        </div>
        <div className="h-px bg-slate-100"></div>
      </div>

      {/* Parshiyot Grid */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {parshiyot.map((parsha) => (
            <Link
              key={parsha.name}
              to={`${createPageUrl('ParshaArticles')}?book=${book}&parsha=${parsha.name}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-32 overflow-hidden">
                <img
                  src={parsha.image}
                  alt={`פרשת ${parsha.name}`}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  style={{ objectPosition: 'center 35%' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-[#1e3a5f] group-hover:text-[#4a90a4] transition-colors">
                  פרשת {parsha.name.replace(/_/g, ' ')}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}