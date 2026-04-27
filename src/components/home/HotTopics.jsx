import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Flame } from 'lucide-react';

const topics = [
  { name: 'שבת', query: 'שבת', emoji: '🕯️' },
  { name: 'אמונה', query: 'אמונה', emoji: '✨' },
  { name: 'תפילה', query: 'תפילה', emoji: '🙏' },
  { name: 'חינוך ילדים', query: 'חינוך', emoji: '📚' },
  { name: 'שלום בית', query: 'שלום בית', emoji: '🏡' },
  { name: 'כשרות', query: 'כשרות', emoji: '🍽️' },
  { name: 'פרשת שבוע', page: 'ParshatShavua', emoji: '📖' },
  { name: 'ראש השנה', query: 'ראש השנה', emoji: '🍎' },
  { name: 'יום כיפור', query: 'יום כיפור', emoji: '🕍' },
  { name: 'חסד', query: 'חסד', emoji: '💛' },
  { name: 'תשובה', query: 'תשובה', emoji: '🌅' },
  { name: 'ברכות', query: 'ברכות', emoji: '✡️' },
];

export default function HotTopics() {
  return (
    <section className="py-10 lg:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-3 mb-7">
          <div className="p-2 bg-orange-500 rounded-lg">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1e3a5f]">נושאים חמים</h2>
            <p className="text-slate-500 text-sm">הנושאים הפופולריים באתר</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {topics.map((topic) => {
            const href = topic.page
              ? createPageUrl(topic.page)
              : `${createPageUrl('SearchResults')}?q=${encodeURIComponent(topic.query)}`;

            return (
              <Link
                key={topic.name}
                to={href}
                className="group flex items-center gap-2 px-4 py-2.5 bg-[#f8f6f3] rounded-full text-[#1e3a5f] font-medium text-sm hover:bg-[#1e3a5f] hover:text-white transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <span className="text-base">{topic.emoji}</span>
                {topic.name}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}