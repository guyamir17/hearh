import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';

export default function SEOHead({ 
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  article
}) {
  const { data: siteSettings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => staticClient.entities.SiteSettings.list(),
    staleTime: 10 * 60 * 1000,
  });

  const settings = siteSettings?.[0] || {};
  
  const seoTitle = title || settings.seo_default_title || 'הארה - להאיר את הנשמה, לחזק את הרוח';
  const seoDescription = description || settings.seo_default_description || 'מאמרי עומק בתורה, אמונה וחכמת החיים';
  const seoImage = image || settings.seo_default_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop&q=80';
  const siteName = settings.seo_site_name || 'הארה';
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  useEffect(() => {
    // Set document title
    document.title = seoTitle;

    // Update or create meta tags
    const updateMetaTag = (property, content, isProperty = true) => {
      if (!content) return;
      
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', seoDescription, false);
    if (keywords) updateMetaTag('keywords', keywords, false);
    if (author) updateMetaTag('author', author, false);

    // Open Graph tags
    updateMetaTag('og:title', seoTitle);
    updateMetaTag('og:description', seoDescription);
    updateMetaTag('og:image', seoImage);
    updateMetaTag('og:url', currentUrl);
    updateMetaTag('og:type', type);
    updateMetaTag('og:site_name', siteName);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', false);
    updateMetaTag('twitter:title', seoTitle, false);
    updateMetaTag('twitter:description', seoDescription, false);
    updateMetaTag('twitter:image', seoImage, false);

    // Article-specific tags
    if (article) {
      if (publishedTime) updateMetaTag('article:published_time', publishedTime);
      if (modifiedTime) updateMetaTag('article:modified_time', modifiedTime);
      if (author) updateMetaTag('article:author', author);
    }

    // Add canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

  }, [seoTitle, seoDescription, seoImage, keywords, author, currentUrl, type, siteName, article, publishedTime, modifiedTime]);

  return null;
}