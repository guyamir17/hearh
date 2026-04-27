import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { ArrowLeft, Clock, BookOpen, Pencil, Check, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { HebrewCalendar, HDate } from '@hebcal/core';
import { format } from 'date-fns';

// Maps English parasha name → Hebrew DB key used in parasha_name field
const parashaNameMapping = {
  'Bereshit': 'בראשית', 'Noach': 'נח', 'Lech-Lecha': 'לך_לך', 'Vayera': 'וירא',
  'Chayei Sara': 'חיי_שרה', 'Toldot': 'תולדות', 'Vayetzei': 'ויצא', 'Vayishlach': 'וישלח',
  'Vayeshev': 'וישב', 'Miketz': 'מקץ', 'Vayigash': 'ויגש', 'Vayechi': 'ויחי',
  'Shemot': 'שמות', 'Vaera': 'וארא', 'Bo': 'בא', 'Beshalach': 'בשלח',
  'Yitro': 'יתרו', 'Mishpatim': 'משפטים', 'Terumah': 'תרומה', 'Tetzaveh': 'תצווה',
  'Ki Tisa': 'כי_תשא', 'Vayakhel': 'ויקהל', 'Pekudei': 'פקודי', 'Vayikra': 'ויקרא',
  'Tzav': 'צו', 'Shmini': 'שמיני', 'Tazria': 'תזריע', 'Metzora': 'מצורע',
  'Achrei Mot': 'אחרי_מות', 'Kedoshim': 'קדושים', 'Emor': 'אמור', 'Behar': 'בהר',
  'Bechukotai': 'בחוקותי', 'Bamidbar': 'במדבר', 'Nasso': 'נשא', "Beha'alotcha": 'בהעלותך',
  "Sh'lach": 'שלח', 'Korach': 'קרח', 'Chukat': 'חוקת', 'Balak': 'בלק',
  'Pinchas': 'פינחס', 'Matot': 'מטות', 'Masei': 'מסעי', 'Devarim': 'דברים',
  'Vaetchanan': 'ואתחנן', 'Eikev': 'עקב', "Re'eh": 'ראה', 'Shoftim': 'שופטים',
  'Ki Teitzei': 'כי_תצא', 'Ki Tavo': 'כי_תבוא', 'Nitzavim': 'נצבים', 'Vayeilech': 'וילך',
  "Ha'Azinu": 'האזינו', 'Vezot Haberakhah': 'וזאת_הברכה'
};

// Use @hebcal/core Sedra class — most reliable way to get the weekly parasha
function getCurrentParasha() {
  try {
    const today = new Date();
    // Start from today's HDate and use getSedra / Sedra
    const hdate = new HDate(today);

    // HebrewCalendar with sedrot gives us the parasha for the coming Shabbat
    // Scan from today to +7 days to find the nearest Shabbat sedra
    const startHDate = hdate;
    const endHDate = new HDate(new Date(today.getTime() + 8 * 86400000));

    const events = HebrewCalendar.calendar({
      start: startHDate,
      end: endHDate,
      sedrot: true,
      il: true,
      noHolidays: true,
      noRoshHashana: true,
    });

    // The first sedra event found is the coming week's parasha
    const parashaEvent = events.find(ev => {
      try {
        const desc = ev.getDesc();
        return desc && desc.startsWith('Parashat');
      } catch { return false; }
    });

    if (parashaEvent) {
      // render('he') returns e.g. "פרשת אמור" — strip the prefix
      const hebrewRaw = parashaEvent.render('he');
      const displayName = hebrewRaw.replace(/^פרשת\s+/, '').replace(/^פרשה\s+/, '').trim();

      // render('en') returns e.g. "Parashat Emor"
      const englishRaw = parashaEvent.render('en');
      const englishName = englishRaw.replace(/^Parashat\s+/, '').trim();

      const dbKey = parashaNameMapping[englishName] || displayName.replace(/ /g, '_');

      return { dbKey, displayName };
    }
  } catch (err) {
    console.error('Parasha lookup error:', err);
  }
  return { dbKey: null, displayName: 'פרשת השבוע' };
}

export default function ParshatShavuaSection() {
  const currentParasha = getCurrentParasha();

  // Check if current user is admin
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    staticClient.auth.me().then(user => {
      if (user?.role === 'admin') setIsAdmin(true);
    }).catch(() => {});
  }, []);

  // Editable section title + description (admin only)
  const [editing, setEditing] = useState(false);
  const [sectionTitle, setSectionTitle] = useState('מאמרים לפרשת השבוע');
  const [titleDraft, setTitleDraft] = useState(sectionTitle);

  // Editable sidebar card text (admin only)
  const [editingCard, setEditingCard] = useState(false);
  const defaultCardText = (name) => `קראו את המאמרים המומלצים שלנו על ${name}. דברי תורה, פירושים וסיפורים.`;
  const [cardText, setCardText] = useState('');
  const [cardTextDraft, setCardTextDraft] = useState('');

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['parshatShavuaArticles', currentParasha.dbKey],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!currentParasha.dbKey) return [];
      // Only fetch articles for THIS specific parasha — no fallback to other parashiyot
      const results = await staticClient.entities.Article.filter(
        { published: true, category: 'פרשת_שבוע', parasha_name: currentParasha.dbKey },
        '-created_date',
        6
      );
      return results;
    }
  });

  if (isLoading) {
    return (
      <section className="py-10 bg-[#f4f6fb]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            <Skeleton className="h-72 rounded-2xl" />
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-72 rounded-2xl" />)}
          </div>
        </div>
      </section>
    );
  }

  const articleCards = articles.slice(0, 3);

  return (
    <section className="py-10 bg-[#f4f6fb]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        {/* Section header with editable title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {isAdmin && editing ? (
              <div className="flex items-center gap-2">
                <input
                  value={titleDraft}
                  onChange={e => setTitleDraft(e.target.value)}
                  className="text-xl font-extrabold text-[#1e3a5f] border-b-2 border-[#4a90a4] bg-transparent outline-none w-64"
                  autoFocus
                />
                <button
                  onClick={() => { setSectionTitle(titleDraft); setEditing(false); }}
                  className="text-green-600 hover:text-green-700 p-1"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setTitleDraft(sectionTitle); setEditing(false); }}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-[#1e3a5f]">{sectionTitle}</h2>
                {isAdmin && (
                  <button
                    onClick={() => { setTitleDraft(sectionTitle); setEditing(true); }}
                    className="text-slate-400 hover:text-[#4a90a4] transition-colors p-1"
                    title="ערוך כותרת"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
          <Link to={createPageUrl('ParshatShavua')} className="flex items-center gap-1 text-[#4a90a4] text-sm font-medium hover:gap-2 transition-all">
            לכל הפרשות <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar parasha card */}
          <div className="bg-white rounded-2xl p-5 flex flex-col border border-slate-100 shadow-sm order-first lg:order-none">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-[#1e3a5f] rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">פרשת השבוע</p>
                {/* Only show the parasha name (already contains nikkud from hebcal), no extra "פרשת" prefix */}
                <h3 className="text-xl font-extrabold text-[#1e3a5f]">{currentParasha.displayName}</h3>
              </div>
            </div>

            {articleCards[0]?.image_url && (
              <div className="relative h-32 rounded-xl overflow-hidden mb-4">
                <img
                  src={articleCards[0].image_url}
                  alt={currentParasha.displayName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Editable card description */}
            <div className="flex-1 mb-4">
              {isAdmin && editingCard ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={cardTextDraft}
                    onChange={e => setCardTextDraft(e.target.value)}
                    className="text-slate-500 text-sm leading-relaxed border border-[#4a90a4] rounded-lg p-2 w-full resize-none outline-none"
                    rows={3}
                    dir="rtl"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button onClick={() => { setCardText(cardTextDraft); setEditingCard(false); }} className="text-green-600 hover:text-green-700 p-1"><Check className="w-4 h-4" /></button>
                    <button onClick={() => setEditingCard(false)} className="text-red-400 hover:text-red-600 p-1"><X className="w-4 h-4" /></button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-1">
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {cardText || defaultCardText(currentParasha.displayName)}
                  </p>
                  {isAdmin && (
                    <button onClick={() => { setCardTextDraft(cardText || defaultCardText(currentParasha.displayName)); setEditingCard(true); }} className="text-slate-300 hover:text-[#4a90a4] p-0.5 flex-shrink-0">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <Link
              to={createPageUrl('ParshatShavua')}
              className="flex items-center justify-center gap-2 py-3 bg-[#1e3a5f] text-white rounded-xl font-medium text-sm hover:bg-[#2a4a6f] transition-colors mb-3"
            >
              לכל המאמרים על הפרשה
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <Link
              to={createPageUrl('ParshatShavua')}
              className="flex items-center justify-center gap-1 text-[#4a90a4] text-sm font-medium hover:gap-2 transition-all"
            >
              כל הפרשות
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* Article cards — only for current parasha, or empty state */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            {articleCards.length > 0 ? articleCards.map((article) => (
              <Link
                key={article.id}
                to={`${createPageUrl('Article')}?id=${article.id}`}
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={article.image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&q=80'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-[#1e3a5f] text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
                      {currentParasha.displayName}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-[#1e3a5f] text-sm leading-snug group-hover:text-[#4a90a4] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-slate-500 text-xs line-clamp-2 mt-1 mb-3">{article.excerpt}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-100 mt-auto">
                    {article.created_date && (
                      <span>{format(new Date(article.created_date), 'dd/MM/yyyy')}</span>
                    )}
                    {article.reading_time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {article.reading_time} דק׳
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )) : (
              <div className="md:col-span-3 bg-white rounded-2xl p-10 flex flex-col items-center justify-center text-center border border-dashed border-slate-200">
                <BookOpen className="w-10 h-10 text-[#1e3a5f]/30 mb-3" />
                <h3 className="font-bold text-[#1e3a5f] mb-1">מאמרים לפרשה: {currentParasha.displayName}</h3>
                <p className="text-slate-400 text-sm">מאמרים לפרשה זו יתווספו בקרוב</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}