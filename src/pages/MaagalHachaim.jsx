import { Users } from 'lucide-react';
import CategoryPage from '@/components/category/CategoryPage';

const subcategories = [
  { value: 'ברית', label: 'ברית מילה' },
  { value: 'בר_מצווה', label: 'בר מצווה' },
  { value: 'בת_מצווה', label: 'בת מצווה' },
  { value: 'חתונה', label: 'חתונה' },
  { value: 'לידה', label: 'לידה' },
  { value: 'אבלות', label: 'אבלות' }
];

export default function MaagalHachaim() {
  return (
    <CategoryPage
      category="מעגל_החיים"
      categoryKey="maagal_hachaim"
      title="מעגל החיים"
      description="אירועי החיים היהודי - ברית, בר/בת מצווה, חתונה ועוד"
      icon={Users}
      filterField="event"
      subcategories={subcategories}
    />
  );
}