import { Heart } from 'lucide-react';
import CategoryPage from '@/components/category/CategoryPage';

export default function MaamarimEmuna() {
  return (
    <CategoryPage
      category="מאמרים_באמונה"
      categoryKey="maamarim_emuna"
      title="מאמרים באמונה"
      description="חיזוק האמונה, השקפה יהודית ויסודות בעבודת ה'"
      icon={Heart}
    />
  );
}