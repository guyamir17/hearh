import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsFetching } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppBanner from '@/components/layout/WhatsAppBanner';
import AccessibilityMenu from '@/components/layout/AccessibilityMenu';
import PageLoader from '@/components/shared/PageLoader';

export default function Layout({ children }) {
  const location = useLocation();
  const isFetching = useIsFetching();
  const [isNavigating, setIsNavigating] = useState(false);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 200);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Show loader only for slow fetches (>200ms)
  const [showLoaderForFetch, setShowLoaderForFetch] = useState(false);
  
  useEffect(() => {
    if (isFetching > 0) {
      const timer = setTimeout(() => setShowLoaderForFetch(true), 200);
      return () => clearTimeout(timer);
    } else {
      setShowLoaderForFetch(false);
    }
  }, [isFetching]);

  const showLoader = isNavigating || showLoaderForFetch;

  return (
    <div dir="rtl" className="min-h-screen bg-white" style={{ fontFamily: 'Heebo, sans-serif' }}>
      {showLoader && <PageLoader />}
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800&display=swap');
        
        :root {
          --color-primary: #1e3a5f;
          --color-secondary: #4a90a4;
          --color-gold: #d4af37;
          --color-sand: #f8f6f3;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body, * {
          font-family: 'Heebo', sans-serif;
        }
        
        /* Typography scale - Updated sizes */
        h1 { 
          font-size: 26px;
          font-weight: 700; 
          line-height: 1.2;
        }
        h2 { 
          font-size: 22px;
          font-weight: 600; 
          line-height: 1.3;
        }
        h3 { 
          font-size: 19px;
          font-weight: 600; 
          line-height: 1.4;
        }

        @media (min-width: 1024px) {
          h1 { font-size: 32px; }
          h2 { font-size: 24px; }
          h3 { font-size: 20px; }
        }

        /* Body text - Updated sizes */
        p, body {
          font-size: 17px;
          line-height: 1.7;
        }

        @media (min-width: 1024px) {
          p, body {
            font-size: 18px;
          }
        }
        
        /* Navbar text */
        nav a, nav button {
          font-size: 16px;
        }
        
        @media (min-width: 1024px) {
          nav a, nav button {
            font-size: 18px;
          }
        }
        
        /* Button text */
        button, .btn {
          font-size: 16px;
          font-weight: 500;
        }
        
        @media (min-width: 1024px) {
          button, .btn {
            font-size: 17px;
          }
        }
        
        /* Line clamp utilities */
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Quill editor RTL and styling - Rubik font */
        .ql-editor {
          direction: rtl;
          text-align: right;
          font-family: 'Rubik', 'Heebo', sans-serif;
          font-size: 17px;
          line-height: 1.7;
        }
        
        @media (min-width: 1024px) {
          .ql-editor {
            font-size: 18px;
          }
        }
        
        .ql-editor p {
          text-align: justify;
          text-align-last: right;
          margin-bottom: 1.25rem;
        }
        
        /* Drop Cap - First letter of first paragraph */
        .ql-editor p:first-of-type::first-letter {
          font-family: 'Rubik', sans-serif;
          font-size: 36px;
          font-weight: 700;
          float: right;
          line-height: 0.8;
          margin-left: 8px;
          color: #1e3a5f;
        }
        
        @media (min-width: 1024px) {
          .ql-editor p:first-of-type::first-letter {
            font-size: 52px;
          }
        }
        
        .ql-editor h1 {
          font-family: 'Rubik', sans-serif;
          font-size: 26px;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          color: #1e3a5f;
        }
        
        @media (min-width: 1024px) {
          .ql-editor h1 {
            font-size: 32px;
          }
        }
        
        .ql-editor h2 {
          font-family: 'Rubik', sans-serif;
          font-size: 22px;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          color: #1e3a5f;
        }
        
        @media (min-width: 1024px) {
          .ql-editor h2 {
            font-size: 24px;
            margin-top: 2rem;
            margin-bottom: 0.75rem;
          }
        }
        
        .ql-editor h3 {
          font-family: 'Rubik', sans-serif;
          font-size: 19px;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: #1e3a5f;
        }
        
        @media (min-width: 1024px) {
          .ql-editor h3 {
            font-size: 20px;
          }
        }
        
        .ql-editor blockquote {
          border-right: 4px solid #1e3a5f;
          background: #f8f6f3;
          padding: 1.25rem 1.5rem;
          margin: 1.5rem 0;
          font-style: normal;
          font-weight: 500;
          font-size: 17px;
          color: #1e3a5f;
          border-radius: 0.5rem;
          text-align: right;
        }
        
        @media (min-width: 1024px) {
          .ql-editor blockquote {
            font-size: 18px;
          }
        }
        
        /* Alignment classes for Quill */
        .ql-align-justify {
          text-align: justify !important;
        }
        
        .ql-align-right {
          text-align: right !important;
        }
        
        .ql-align-center {
          text-align: center !important;
        }
        
        .ql-align-left {
          text-align: left !important;
        }
      `}</style>
      
      <Header />
      
      <main className="pt-20">
        {children}
      </main>
      
      <Footer />
      <WhatsAppBanner />
      <AccessibilityMenu />

      {/* Open Graph Meta Tags for Social Sharing */}
      <script dangerouslySetInnerHTML={{__html: `
        (function() {
          var meta = document.querySelector('meta[property="og:image"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', 'og:image');
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop&q=80');

          var metaTitle = document.querySelector('meta[property="og:title"]');
          if (!metaTitle) {
            metaTitle = document.createElement('meta');
            metaTitle.setAttribute('property', 'og:title');
            document.head.appendChild(metaTitle);
          }
          metaTitle.setAttribute('content', 'הארה - להאיר את הנשמה, לחזק את הרוח');

          var metaDesc = document.querySelector('meta[property="og:description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('property', 'og:description');
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute('content', 'מאמרי עומק בתורה, אמונה וחכמת החיים');
        })();
      `}} />
      </div>
  );
}