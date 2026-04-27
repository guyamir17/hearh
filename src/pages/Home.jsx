import HeroSection from '@/components/home/HeroSection';
import PortalHeroContent from '@/components/home/PortalHeroContent';
import CategoryGrid from '@/components/home/CategoryGrid';
// PopularArticles removed
import ParshatShavuaSection from '@/components/home/ParshatShavuaSection';
import LatestArticles from '@/components/home/LatestArticles';
import ExternalArticlesSection from '@/components/home/ExternalArticlesSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import SEOHead from '@/components/shared/SEOHead';
import { WebsiteStructuredData } from '@/components/shared/StructuredData';

export default function Home() {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  return (
    <div>
      <SEOHead />
      <WebsiteStructuredData 
        siteName="הארה" 
        url={currentUrl}
        description="מאמרי עומק בתורה, אמונה וחכמת החיים"
      />
      
      <HeroSection />
      <PortalHeroContent />
      <CategoryGrid />
      <ParshatShavuaSection />
      {/* PopularArticles removed */}
      <LatestArticles />
      <ExternalArticlesSection />
      <NewsletterSection />
    </div>
  );
}