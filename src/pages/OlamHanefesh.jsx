import { Brain } from 'lucide-react';
import CategoryPage from '@/components/category/CategoryPage';

export default function OlamHanefesh() {
  return (
    <CategoryPage
      category="עולם_הנפש"
      categoryKey="olam_hanefesh"
      title="עולם הנפש"
      description="פסיכולוגיה יהודית, צמיחה אישית והתמודדות עם אתגרי החיים"
      icon={Brain}
      hideFeatured={true}
    />
  );
}