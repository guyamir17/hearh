import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { ArrowRight, Clock, Calendar, Tag, Copy, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import SEOHead from '@/components/shared/SEOHead';
import { ArticleStructuredData, BreadcrumbStructuredData } from '@/components/shared/StructuredData';
import ReadingControls from '@/components/article/ReadingControls';

const categoryLabels = {
  'פרשת_שבוע': 'פרשת שבוע',
  'מאמרים_באמונה': 'מאמרים באמונה',
  'מועדי_ישראל': 'מועדי ישראל',
  'עולם_הנפש': 'עולם הנפש',
  'מעגל_החיים': 'מעגל החיים'
};

const categoryPages = {
  'פרשת_שבוע': 'ParshatShavua',
  'מאמרים_באמונה': 'MaamarimEmuna',
  'מועדי_ישראל': 'MoadeiYisrael',
  'עולם_הנפש': 'OlamHanefesh',
  'מעגל_החיים': 'MaagalHachaim'
};

// Social share buttons component
function ShareButtons({ title, url, excerpt }) {
  const [copied, setCopied] = React.useState(false);
  
  const handleShare = (platform) => {
    const articleUrl = url || window.location.href;
    const whatsappText = excerpt 
      ? `*${title}*\n\n${excerpt}\n\n${articleUrl}`
      : `*${title}*\n\n${articleUrl}`;
    const shareLinks = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(title)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(title)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(title + '\n\n' + articleUrl)}`
    };
    
    window.open(shareLinks[platform], '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-500">שתפו:</span>
      <div className="flex items-center gap-2">
        <button onClick={() => handleShare('whatsapp')} className="p-2 text-[#1e3a5f] hover:text-[#4a90a4] hover:bg-slate-50 rounded-lg transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </button>
        <button onClick={() => handleShare('facebook')} className="p-2 text-[#1e3a5f] hover:text-[#4a90a4] hover:bg-slate-50 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </button>
        <button onClick={() => handleShare('telegram')} className="p-2 text-[#1e3a5f] hover:text-[#4a90a4] hover:bg-slate-50 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
        </button>
        <button onClick={() => handleShare('twitter')} className="p-2 text-[#1e3a5f] hover:text-[#4a90a4] hover:bg-slate-50 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </button>
        <button onClick={() => handleShare('email')} className="p-2 text-[#1e3a5f] hover:text-[#4a90a4] hover:bg-slate-50 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
        </button>
        <button onClick={handleCopy} className="p-2 text-[#1e3a5f] hover:text-[#4a90a4] hover:bg-slate-50 rounded-lg transition-colors">
          {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" strokeWidth={1.5} />}
        </button>
      </div>
    </div>
  );
}

// Clean HTML content
function ArticleContent({ content }) {
  if (!content) return null;
  
  let cleanContent = content;
  if (content.includes('&lt;') || content.includes('&gt;')) {
    cleanContent = content.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }
  
  return (
    <div 
      className="article-content"
      dangerouslySetInnerHTML={{ __html: cleanContent }}
    />
  );
}


export default function Article() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', articleId],
    queryFn: async () => {
      const articles = await staticClient.entities.Article.filter({ id: articleId });
      return articles[0];
    },
    enabled: !!articleId
  });

  const { data: relatedArticles } = useQuery({
    queryKey: ['relatedArticles', article?.category],
    queryFn: async () => {
      const articles = await staticClient.entities.Article.filter({ 
        published: true, 
        category: article.category 
      }, '-created_date', 4);
      return articles.filter(a => a.id !== articleId);
    },
    enabled: !!article?.category
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Skeleton className="h-72 w-full rounded-2xl mb-8" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-5 w-1/2 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-[#1e3a5f] mb-4">המאמר לא נמצא</h1>
        <Link to={createPageUrl('Home')} className="text-[#4a90a4] hover:underline">
          חזרה לעמוד הבית
        </Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: 'בית', url: typeof window !== 'undefined' ? window.location.origin : '' },
    { name: categoryLabels[article.category] || article.category, url: `${typeof window !== 'undefined' ? window.location.origin : ''}${createPageUrl(categoryPages[article.category] || 'AllArticles')}` },
    { name: article.title, url: currentUrl }
  ];

  return (
    <article className="pb-16">
      <SEOHead
        title={article.seo_title || article.title}
        description={article.seo_description || article.excerpt}
        keywords={article.seo_keywords || article.tags?.join(', ')}
        image={article.og_image || article.image_url}
        url={currentUrl}
        type="article"
        author={article.author}
        publishedTime={article.created_date}
        modifiedTime={article.updated_date}
        article={true}
      />
      <ArticleStructuredData article={article} url={currentUrl} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <ReadingControls content={article.content} />

      {/* Article Styles - Rubik font */}
      <style>{`
        .article-content {
          font-family: 'Rubik', 'Heebo', sans-serif;
          font-size: 17px;
          line-height: 1.7;
          color: #374151;
        }
        @media (min-width: 1024px) {
          .article-content {
            font-size: 18px;
          }
        }
        .article-content p {
          text-align: justify;
          text-align-last: right;
          margin-bottom: 1.25rem;
        }
        /* Drop Cap */
        .article-content p:first-of-type::first-letter {
          font-family: 'Rubik', sans-serif;
          font-size: 36px;
          font-weight: 700;
          float: right;
          line-height: 0.8;
          margin-left: 8px;
          color: #1e3a5f;
        }
        @media (min-width: 1024px) {
          .article-content p:first-of-type::first-letter {
            font-size: 52px;
          }
        }
        .article-content h1 {
          font-family: 'Rubik', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #1e3a5f;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          text-align: right;
        }
        @media (min-width: 1024px) {
          .article-content h1 {
            font-size: 32px;
          }
        }
        .article-content h2 {
          font-family: 'Rubik', sans-serif;
          font-size: 22px;
          font-weight: 600;
          color: #1e3a5f;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          text-align: right;
        }
        @media (min-width: 1024px) {
          .article-content h2 {
            font-size: 24px;
          }
        }
        .article-content h3 {
          font-family: 'Rubik', sans-serif;
          font-size: 19px;
          font-weight: 600;
          color: #1e3a5f;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          text-align: right;
        }
        @media (min-width: 1024px) {
          .article-content h3 {
            font-size: 20px;
          }
        }
        .article-content ul, .article-content ol {
          margin: 1.25rem 0;
          padding-right: 1.5rem;
        }
        .article-content li {
          margin-bottom: 0.5rem;
        }
        .article-content blockquote {
          border-right: 4px solid #1e3a5f;
          margin: 1.5rem 0;
          font-style: normal;
          font-weight: 500;
          font-size: 1.1rem;
          color: #1e3a5f;
          background: #f8f6f3;
          padding: 1.25rem 1.5rem;
          border-radius: 0.5rem;
          text-align: right;
        }
        .article-content a {
          color: #4a90a4;
          text-decoration: underline;
        }
        .article-content strong {
          font-weight: 600;
          color: #1e3a5f;
        }
        .article-content img {
          max-width: 100%;
          border-radius: 0.75rem;
          margin: 1.5rem 0;
        }
      `}</style>

      {/* Hero Image with overlay content */}
      <div className={`relative -mt-20 ${article.image_url ? '' : 'pt-20'}`}>
        {article.image_url && (
          <>
            {/* Image container */}
            <div
              className="overflow-hidden"
              style={{ height: '45vh', minHeight: '260px' }}
            >
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover object-center"
                style={{ objectPosition: 'center 30%' }}
                loading="eager"
              />
              {/* Gradient overlay - strong at bottom for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            {/* Faded background continuation behind article card */}
            <div
              className="absolute inset-0 w-full h-full -z-10 pointer-events-none"
              style={{
                backgroundImage: `url(${article.image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 30%',
                opacity: 0.07,
                filter: 'blur(8px)',
                top: '45vh',
                height: '200px'
              }}
            />
          </>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-5 lg:px-8">
        <div className={`${article.image_url ? '-mt-28 relative z-10' : 'pt-10'}`}>
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-5">
              <Link to={createPageUrl('Home')} className="text-[#4a90a4] hover:underline">בית</Link>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 rotate-180" />
              <Link to={createPageUrl(categoryPages[article.category] || 'AllArticles')} className="text-[#4a90a4] hover:underline">
                {categoryLabels[article.category] || article.category}
              </Link>
            </div>

            {/* Category Badge */}
            <span className="inline-block bg-[#1e3a5f]/10 text-[#1e3a5f] text-sm px-4 py-1.5 rounded-full font-medium mb-4">
              {categoryLabels[article.category] || article.category}
            </span>

            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1e3a5f] leading-tight mb-5">
              {article.title}
            </h1>

            {/* Meta + Share */}
            <div className="flex flex-col gap-3 text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4">
                  {article.author && <span className="font-medium text-[#1e3a5f]">{article.author}</span>}
                  {article.created_date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" strokeWidth={1.5} />
                      {format(new Date(article.created_date), 'dd/MM/yyyy')}
                    </span>
                  )}
                  {article.reading_time && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" strokeWidth={1.5} />
                      {article.reading_time} דקות קריאה
                    </span>
                  )}
                </div>
                <ShareButtons title={article.title} url={currentUrl} excerpt={article.excerpt} />
              </div>
            </div>

            {/* Intro Section */}
            {article.excerpt && (
              <div className="mb-10">
                <h2 className="text-base font-bold text-[#1e3a5f] mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#4a90a4] rounded-full"></span>
                  מבוא למאמר
                </h2>
                <div className="bg-[#f8f6f3] rounded-xl p-5 border-r-4 border-[#4a90a4]">
                  <p className="text-[#4a5568] leading-relaxed text-base" style={{ textAlign: 'justify', textAlignLast: 'right' }}>
                    {article.excerpt}
                  </p>
                </div>
                {/* Separator */}
                <div className="flex items-center gap-4 my-10">
                  <div className="flex-1 h-0.5 bg-gradient-to-l from-[#1e3a5f]/20 to-transparent rounded-full"></div>
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f]/30"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f]/30"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f]/30"></span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-[#1e3a5f]/20 to-transparent rounded-full"></div>
                </div>
              </div>
            )}

            {/* Content */}
            <ArticleContent content={article.content} />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-slate-100">
                <Tag className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
                {article.tags.map((tag, index) => (
                  <span key={index} className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Bottom Share */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <ShareButtons title={article.title} url={currentUrl} excerpt={article.excerpt} />
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles && relatedArticles.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-[#1e3a5f] mb-6">מאמרים נוספים</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedArticles.slice(0, 3).map((related) => (
                <a
                  key={related.id}
                  href={`${createPageUrl('Article')}?id=${related.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="h-32 overflow-hidden">
                    <img
                      src={related.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#1e3a5f] text-sm group-hover:text-[#4a90a4] transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}