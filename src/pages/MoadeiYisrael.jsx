import { Calendar } from 'lucide-react';
import CategoryPage from '@/components/category/CategoryPage';

const subcategories = [
  { value: 'ראש_השנה', label: 'ראש השנה' },
  { value: 'יום_כיפור', label: 'יום כיפור' },
  { value: 'סוכות', label: 'סוכות' },
  { value: 'חנוכה', label: 'חנוכה' },
  { value: 'פורים', label: 'פורים' },
  { value: 'פסח', label: 'פסח' },
  { value: 'שבועות', label: 'שבועות' },
  { value: 'תשעה_באב', label: 'תשעה באב' },
  { value: 'ט״ו_בשבט', label: 'ט״ו בשבט' },
  { value: 'ל״ג_בעומר', label: 'ל״ג בעומר' }
];

export default function MoadeiYisrael() {
  return (
    <CategoryPage
      category="מועדי_ישראל"
      categoryKey="moadei_yisrael"
      title="מועדי ישראל"
      description="עומק החגים והמועדים - מנהגים, הלכות ורעיונות"
      icon={Calendar}
      filterField="holiday"
      subcategories={subcategories}
    />
  );
}