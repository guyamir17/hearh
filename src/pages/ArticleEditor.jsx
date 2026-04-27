import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import { 
  ArrowRight, Save, Eye, Loader2, Upload, X, 
  Image as ImageIcon, Star, FileText, AlignJustify, FolderUp, Sparkles
} from 'lucide-react';
import BulkArticleUpload from '@/components/article/BulkArticleUpload';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Default categories as fallback
const defaultCategories = [
  { key: 'פרשת_שבוע', name: 'פרשת שבוע' },
  { key: 'מאמרים_באמונה', name: 'מאמרים באמונה' },
  { key: 'מועדי_ישראל', name: 'מועדי ישראל' },
  { key: 'עולם_הנפש', name: 'עולם הנפש' },
  { key: 'מעגל_החיים', name: 'מעגל החיים' }
];

const parashaByBook = {
  'בראשית': ['בראשית','נח','לך_לך','וירא','חיי_שרה','תולדות','ויצא','וישלח','וישב','מקץ','ויגש','ויחי'],
  'שמות':   ['שמות','וארא','בא','בשלח','יתרו','משפטים','תרומה','תצווה','כי_תשא','ויקהל','פקודי'],
  'ויקרא':  ['ויקרא','צו','שמיני','תזריע','מצורע','אחרי_מות','קדושים','אמור','בהר','בחוקותי'],
  'במדבר':  ['במדבר','נשא','בהעלותך','שלח','קרח','חוקת','בלק','פינחס','מטות','מסעי'],
  'דברים':  ['דברים','ואתחנן','עקב','ראה','שופטים','כי_תצא','כי_תבוא','נצבים','וילך','האזינו','וזאת_הברכה'],
};

const holidays = [
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

const lifecycleEvents = [
  { value: 'ברית', label: 'ברית מילה' },
  { value: 'בר_מצווה', label: 'בר מצווה' },
  { value: 'בת_מצווה', label: 'בת מצווה' },
  { value: 'חתונה', label: 'חתונה' },
  { value: 'לידה', label: 'לידה' },
  { value: 'אבלות', label: 'אבלות' }
];

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'align': [] }],
    [{ 'direction': 'rtl' }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ]
};

const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent', 'align', 'direction', 
  'blockquote', 'code-block', 'link', 'image', 'video', 
  'color', 'background'
];

// AI Button Component
function AIButton({ onClick, loading, label = "מלא באמצעות AI" }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={loading}
      className="rounded-lg border-[#4a90a4] text-[#4a90a4] hover:bg-[#4a90a4]/10"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 ml-1 animate-spin" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 ml-1" />
      )}
      {label}
    </Button>
  );
}

export default function ArticleEditor() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  const bulkMode = urlParams.get('bulk') === 'true';
  const isEditing = !!articleId;

  const [formData, setFormData] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);
  const [aiLoading, setAiLoading] = useState({});

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const result = await staticClient.entities.Category.filter({ active: true });
      return result.length > 0 ? result.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)) : defaultCategories;
    },
    initialData: defaultCategories
  });

  const { data: article, isLoading: articleLoading } = useQuery({
    queryKey: ['editArticle', articleId],
    queryFn: async () => {
      const articles = await staticClient.entities.Article.filter({ id: articleId });
      return articles[0];
    },
    enabled: isEditing
  });

  // Initialize form data once
  useEffect(() => {
    if (isEditing && article && !formData) {
      // Editing existing article - load all data from database
      setFormData({
        title: article.title || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        image_url: article.image_url || '',
        category: article.category || '',
        subcategory: article.subcategory || '',
        parasha_book: article.parasha_book || '',
        parasha_name: article.parasha_name || '',
        holiday: article.holiday || '',
        lifecycle_event: article.lifecycle_event || '',
        tags: Array.isArray(article.tags) ? [...article.tags] : [],
        author: article.author || 'גיא-שלום אמיר',
        reading_time: article.reading_time || '',
        published: article.published === true,
        is_featured: article.is_featured === true,
        seo_title: article.seo_title || '',
        seo_description: article.seo_description || '',
        seo_keywords: article.seo_keywords || '',
        og_image: article.og_image || ''
      });
    } else if (!isEditing && !formData) {
      // New article - initialize with defaults including author
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        image_url: '',
        category: '',
        subcategory: '',
        parasha_book: '',
        parasha_name: '',
        holiday: '',
        lifecycle_event: '',
        tags: [],
        author: 'גיא-שלום אמיר',
        reading_time: '',
        published: false,
        is_featured: false,
        seo_title: '',
        seo_description: '',
        seo_keywords: '',
        og_image: ''
      });
    }
  }, [article, isEditing, formData]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const processedData = { ...data };
      
      // Only auto-generate if fields are truly empty AND it's a new article
      if (!isEditing) {
        if (!processedData.excerpt && processedData.content) {
          const plainText = processedData.content
            .replace(/<[^>]*>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          const words = plainText.split(/\s+/).slice(0, 35);
          processedData.excerpt = words.join(' ') + (words.length >= 35 ? '...' : '');
        }
        
        if (!processedData.image_url && processedData.category) {
          const defaultImages = {
            'פרשת_שבוע': 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80',
            'מאמרים_באמונה': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
            'מועדי_ישראל': 'https://images.unsplash.com/photo-1544476915-ed1370594142?w=800&q=80',
            'עולם_הנפש': 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80',
            'מעגל_החיים': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80'
          };
          processedData.image_url = defaultImages[processedData.category];
        }
        
        if (!processedData.reading_time && processedData.content) {
          const plainText = processedData.content.replace(/<[^>]*>/g, ' ');
          const wordCount = plainText.split(/\s+/).length;
          processedData.reading_time = Math.max(1, Math.ceil(wordCount / 200));
        }
        
        if ((!processedData.tags || processedData.tags.length === 0) && processedData.category) {
          const categoryTags = {
            'פרשת_שבוע': ['תורה', 'פרשה'],
            'מאמרים_באמונה': ['אמונה', 'השקפה'],
            'מועדי_ישראל': ['חגים', 'מועדים'],
            'עולם_הנפש': ['נפש', 'צמיחה'],
            'מעגל_החיים': ['מסורת', 'משפחה']
          };
          processedData.tags = categoryTags[processedData.category] || [];
        }
        
        if (processedData.published === undefined) {
          processedData.published = true;
        }
      }
      
      if (isEditing) {
        await staticClient.entities.Article.update(articleId, processedData);
      } else {
        await staticClient.entities.Article.create(processedData);
      }
    },
    onSuccess: () => {
      window.location.href = createPageUrl('AdminArticles');
    }
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { file_url } = await staticClient.integrations.Core.UploadFile({ file });
    // Auto-set og_image too if not already set
    setFormData(prev => ({ 
      ...prev, 
      image_url: file_url,
      og_image: prev.og_image || file_url
    }));
    setUploading(false);
  };

  const handleOgImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingOg(true);
    const { file_url } = await staticClient.integrations.Core.UploadFile({ file });
    setFormData(prev => ({ ...prev, og_image: file_url }));
    setUploadingOg(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const generateWithAI = async (field) => {
    setAiLoading(prev => ({ ...prev, [field]: true }));
    
    try {
      const content = formData.content?.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim() || '';
      const title = formData.title || '';
      
      let prompt = '';
      let jsonSchema = null;
      
      const torahContext = `הכותב הוא רב ומחנך יהודי. השפה צריכה להיות תורנית, מרוממת, ויחד עם זאת שיווקית ומזמינה – כזו שמושכת את הלב ומעוררת רצון לקרוא.`;

      switch(field) {
        case 'excerpt':
          prompt = `${torahContext}\n\nכתוב מבוא קצר של שני משפטי פתיחה תורניים ובהירים למאמר הבא. המשפטים יהיו עמוקים, מזמינים ויעוררו סקרנות לקריאה.\n\nכותרת: ${title}\n\nתוכן: ${content.slice(0, 1000)}`;
          jsonSchema = { type: "object", properties: { excerpt: { type: "string" } } };
          break;
          
        case 'seo_title':
          prompt = `${torahContext}\n\nצור כותרת SEO (עד 60 תווים בדיוק) למאמר הבא. הכותרת תהיה תורנית, מושכת, ותכלול מילת מפתח מרכזית. אל תוסיף מירכאות.\n\nכותרת מקורית: ${title}\n\nתוכן: ${content.slice(0, 500)}`;
          jsonSchema = { type: "object", properties: { seo_title: { type: "string" } } };
          break;
          
        case 'seo_description':
          prompt = `${torahContext}\n\nכתוב תיאור SEO (עד 155 תווים בדיוק) למאמר הבא. התיאור יהיה מושך ושיווקי, ישדר ערך רוחני ויעודד קליקים. אל תוסיף מירכאות.\n\nכותרת: ${title}\n\nתוכן: ${content.slice(0, 800)}`;
          jsonSchema = { type: "object", properties: { seo_description: { type: "string" } } };
          break;
          
        case 'seo_keywords':
          prompt = `${torahContext}\n\nצור 6-8 מילות מפתח רלוונטיות בעברית, מופרדות בפסיקים, למאמר הבא. כלול מונחים תורניים ומונחי חיפוש שאנשים ישתמשו בהם.\n\nכותרת: ${title}\n\nתוכן: ${content.slice(0, 800)}`;
          jsonSchema = { type: "object", properties: { seo_keywords: { type: "string" } } };
          break;
          
        case 'reading_time':
          const wordCount = content.split(/\s+/).length;
          const calculatedTime = Math.max(1, Math.ceil(wordCount / 200));
          setFormData(prev => ({ ...prev, reading_time: calculatedTime }));
          setAiLoading(prev => ({ ...prev, [field]: false }));
          return;
      }
      
      const result = await staticClient.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: jsonSchema
      });
      
      setFormData(prev => ({ ...prev, [field]: result[field] }));
    } catch (error) {
      console.error('AI generation error:', error);
    }
    
    setAiLoading(prev => ({ ...prev, [field]: false }));
  };

  // Auto-generate all AI fields when title + content are both present
  const generateAllAI = async () => {
    if (!formData.title || !formData.content) return;
    setAiLoading({ excerpt: true, seo_title: true, seo_description: true, seo_keywords: true });
    
    const content = formData.content?.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim() || '';
    const title = formData.title || '';
    const torahContext = `הכותב הוא רב ומחנך יהודי. השפה צריכה להיות תורנית, מרוממת, ויחד עם זאת שיווקית ומזמינה – כזו שמושכת את הלב ומעוררת רצון לקרוא.`;
    
    try {
      const result = await staticClient.integrations.Core.InvokeLLM({
        prompt: `${torahContext}\n\nלמאמר הבא, צור את כל השדות הבאים:\n\nכותרת: ${title}\n\nתוכן: ${content.slice(0, 1200)}\n\n1. מבוא (excerpt): שני משפטי פתיחה תורניים ובהירים, עמוקים ומזמינים לקריאה.\n2. seo_title: כותרת SEO עד 60 תווים, תורנית ושיווקית.\n3. seo_description: תיאור SEO עד 155 תווים, מושך ומעודד קליקים.\n4. seo_keywords: 6-8 מילות מפתח עבריות מופרדות בפסיקים.`,
        response_json_schema: {
          type: "object",
          properties: {
            excerpt: { type: "string" },
            seo_title: { type: "string" },
            seo_description: { type: "string" },
            seo_keywords: { type: "string" }
          }
        }
      });
      
      setFormData(prev => ({
        ...prev,
        excerpt: result.excerpt || prev.excerpt,
        seo_title: result.seo_title || prev.seo_title,
        seo_description: result.seo_description || prev.seo_description,
        seo_keywords: result.seo_keywords || prev.seo_keywords,
      }));
    } catch (error) {
      console.error('AI generation error:', error);
    }
    
    setAiLoading({ excerpt: false, seo_title: false, seo_description: false, seo_keywords: false });
  };

  if (bulkMode) {
    return (
      <div className="min-h-screen bg-[#f8f6f3]">
        <div className="bg-white border-b border-slate-100 sticky top-16 z-30">
          <div className="max-w-4xl mx-auto px-4 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <Link 
                to={createPageUrl('AdminArticles')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-[#1e3a5f]" />
              </Link>
              <h1 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
                <FolderUp className="w-5 h-5" />
                העלאה מרוכזת
              </h1>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6">
          <BulkArticleUpload onComplete={() => {}} />
        </div>
      </div>
    );
  }

  // Show loading while fetching article data or while form is not ready
  const isLoading = (isEditing && articleLoading) || !formData;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="bg-white rounded-2xl p-8 space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                to={createPageUrl('AdminArticles')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-[#1e3a5f]" />
              </Link>
              <h1 className="text-lg font-bold text-[#1e3a5f]">
                {isEditing ? 'עריכת מאמר' : 'מאמר חדש'}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              {isEditing && (
                <Link 
                  to={`${createPageUrl('Article')}?id=${articleId}`}
                  target="_blank"
                >
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Eye className="w-4 h-4 ml-1" />
                    תצוגה
                  </Button>
                </Link>
              )}
              <Button 
                onClick={handleSubmit}
                disabled={saveMutation.isPending || !formData.title || !formData.category}
                size="sm"
                className="bg-[#1e3a5f] hover:bg-[#2a4a6f] rounded-lg"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-1" />
                    שמירה
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Content */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1e3a5f] mb-5 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              תוכן המאמר
            </h2>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">כותרת *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="כותרת המאמר"
                  className="h-12 rounded-lg"
                  dir="rtl"
                  required
                />
              </div>

              {/* Excerpt / מבוא */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-[#1e3a5f] text-sm">מבוא</Label>
                  {formData.title && formData.content && (
                    <AIButton 
                      onClick={() => generateWithAI('excerpt')}
                      loading={aiLoading.excerpt}
                      label="צור מבוא"
                    />
                  )}
                </div>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="שני משפטי פתיחה תורניים ומזמינים שיופיעו בכרטיסי המאמר"
                  rows={3}
                  className="rounded-lg resize-none"
                  dir="rtl"
                />
              </div>

              {/* SEO Fields */}
              <div className="bg-slate-50 rounded-xl p-5 space-y-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#1e3a5f] flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    הגדרות SEO
                  </h3>
                  {formData.title && formData.content && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={generateAllAI}
                      disabled={Object.values(aiLoading).some(Boolean)}
                      className="bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white rounded-lg text-xs gap-1.5"
                    >
                      {Object.values(aiLoading).some(Boolean) ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      מלא הכל אוטומטית
                    </Button>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-slate-700">
                      כותרת SEO (מומלץ עד 60 תווים)
                    </Label>
                    {formData.title && formData.content && (
                      <AIButton 
                        onClick={() => generateWithAI('seo_title')}
                        loading={aiLoading.seo_title}
                        label="צור כותרת"
                      />
                    )}
                  </div>
                  <Input
                    type="text"
                    placeholder="כותרת כפי שתופיע בגוגל"
                    value={formData.seo_title || ''}
                    onChange={(e) => setFormData({...formData, seo_title: e.target.value})}
                    maxLength={60}
                    className="rounded-lg"
                    dir="rtl"
                  />
                  <span className="text-xs text-slate-500 mt-1 block">
                    {(formData.seo_title || '').length}/60 תווים
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-slate-700">
                      תיאור SEO (מומלץ עד 160 תווים)
                    </Label>
                    {formData.title && formData.content && (
                      <AIButton 
                        onClick={() => generateWithAI('seo_description')}
                        loading={aiLoading.seo_description}
                        label="צור תיאור"
                      />
                    )}
                  </div>
                  <Textarea
                    placeholder="תיאור קצר שיופיע בתוצאות חיפוש"
                    value={formData.seo_description || ''}
                    onChange={(e) => setFormData({...formData, seo_description: e.target.value})}
                    className="h-20 rounded-lg"
                    maxLength={160}
                    dir="rtl"
                  />
                  <span className="text-xs text-slate-500 mt-1 block">
                    {(formData.seo_description || '').length}/160 תווים
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-slate-700">
                      מילות מפתח (מופרדות בפסיקים)
                    </Label>
                    {formData.title && formData.content && (
                      <AIButton 
                        onClick={() => generateWithAI('seo_keywords')}
                        loading={aiLoading.seo_keywords}
                        label="צור מילות מפתח"
                      />
                    )}
                  </div>
                  <Input
                    type="text"
                    placeholder="תורה, אמונה, השראה"
                    value={formData.seo_keywords || ''}
                    onChange={(e) => setFormData({...formData, seo_keywords: e.target.value})}
                    className="rounded-lg"
                    dir="rtl"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">
                    תמונת שיתוף (Open Graph)
                  </Label>
                  {formData.og_image ? (
                    <div className="space-y-2">
                      <div className="relative rounded-lg overflow-hidden">
                        <img src={formData.og_image} alt="תמונת שיתוף" className="w-full h-32 object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, og_image: ''})}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <Input
                        type="text"
                        placeholder="קישור לתמונה"
                        value={formData.og_image || ''}
                        onChange={(e) => setFormData({...formData, og_image: e.target.value})}
                        className="rounded-lg text-xs"
                        dir="ltr"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="block">
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center cursor-pointer hover:border-[#4a90a4] transition-colors">
                          {uploadingOg ? (
                            <Loader2 className="w-5 h-5 text-[#4a90a4] mx-auto animate-spin" />
                          ) : (
                            <>
                              <Upload className="w-5 h-5 text-slate-300 mx-auto mb-1" />
                              <p className="text-slate-500 text-xs">לחצו להעלאת תמונת שיתוף</p>
                            </>
                          )}
                        </div>
                        <input type="file" accept="image/*" onChange={handleOgImageUpload} className="hidden" />
                      </label>
                      <Input
                        type="text"
                        placeholder="או הדביקו קישור לתמונה"
                        value={formData.og_image || ''}
                        onChange={(e) => setFormData({...formData, og_image: e.target.value})}
                        className="rounded-lg"
                        dir="ltr"
                      />
                      {formData.image_url && (
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, og_image: formData.image_url})}
                          className="text-xs text-[#4a90a4] hover:underline"
                        >
                          השתמש בתמונה הראשית
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm flex items-center gap-2">
                  תוכן המאמר
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <AlignJustify className="w-3 h-3" />
                    תומך ביישור לשני הצדדים
                  </span>
                </Label>
                <div className="rounded-lg overflow-hidden border border-slate-200" dir="rtl">
                  <style>{`
                    .ql-editor {
                      direction: rtl;
                      text-align: right;
                      min-height: 280px;
                      font-family: 'Heebo', sans-serif;
                      font-size: 16px;
                      line-height: 1.8;
                    }
                    .ql-editor p {
                      text-align: justify;
                      text-align-last: right;
                    }
                    .ql-editor.ql-blank::before {
                      right: 15px;
                      left: auto;
                    }
                    .ql-toolbar {
                      direction: ltr;
                      border-bottom: 1px solid #e2e8f0;
                    }
                    .ql-container {
                      border: none;
                    }
                  `}</style>
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="כתבו את תוכן המאמר כאן..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1e3a5f] mb-5 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              תמונה ראשית
            </h2>

            {formData.image_url ? (
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={formData.image_url}
                  alt="תמונה ראשית"
                  className="w-full h-56 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image_url: '' })}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="block">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center cursor-pointer hover:border-[#4a90a4] transition-colors">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 text-[#4a90a4] mx-auto animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600 text-sm">לחצו להעלאת תמונה</p>
                      <p className="text-xs text-slate-400 mt-1">JPG, PNG עד 5MB</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}

            <div className="mt-4">
              <Label className="text-[#1e3a5f] mb-2 block text-sm">או הדביקו קישור לתמונה</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  image_url: e.target.value,
                  og_image: prev.og_image || e.target.value
                }))}
                placeholder="https://..."
                className="rounded-lg"
                dir="ltr"
              />
            </div>
          </div>

          {/* Category & Classification */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1e3a5f] mb-5">סיווג</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Category */}
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">קטגוריה *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    category: value,
                    subcategory: '',
                    parasha_book: '',
                    parasha_name: '',
                    holiday: '',
                    lifecycle_event: ''
                  })}
                >
                  <SelectTrigger className="h-11 rounded-lg">
                    <SelectValue placeholder="בחרו קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.filter(c => !c.parent_category).map((cat) => (
                      <SelectItem key={cat.key} value={cat.key}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Parasha Book + Name - only for פרשת שבוע */}
              {formData.category === 'פרשת_שבוע' && (
                <>
                  <div>
                    <Label className="text-[#1e3a5f] mb-2 block text-sm">ספר</Label>
                    <Select
                      value={formData.parasha_book}
                      onValueChange={(value) => setFormData({ ...formData, parasha_book: value, parasha_name: '' })}
                    >
                      <SelectTrigger className="h-11 rounded-lg">
                        <SelectValue placeholder="בחרו ספר" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(parashaByBook).map(book => (
                          <SelectItem key={book} value={book}>{book}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[#1e3a5f] mb-2 block text-sm">שם הפרשה</Label>
                    <Select
                      value={formData.parasha_name}
                      onValueChange={(value) => setFormData({ ...formData, parasha_name: value })}
                      disabled={!formData.parasha_book}
                    >
                      <SelectTrigger className="h-11 rounded-lg">
                        <SelectValue placeholder={formData.parasha_book ? 'בחרו פרשה' : 'בחרו ספר תחילה'} />
                      </SelectTrigger>
                      <SelectContent>
                        {(parashaByBook[formData.parasha_book] || []).map(p => (
                          <SelectItem key={p} value={p}>{p.replace(/_/g, ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Author */}
              <div>
                <Label className="text-[#1e3a5f] mb-2 block text-sm">מחבר</Label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="שם המחבר"
                  className="h-11 rounded-lg"
                  dir="rtl"
                />
              </div>

              {/* Reading Time */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-[#1e3a5f] text-sm">זמן קריאה (דקות)</Label>
                  {formData.content && (
                    <AIButton 
                      onClick={() => generateWithAI('reading_time')}
                      loading={aiLoading.reading_time}
                      label="חשב"
                    />
                  )}
                </div>
                <Input
                  type="number"
                  value={formData.reading_time}
                  onChange={(e) => setFormData({ ...formData, reading_time: parseInt(e.target.value) || '' })}
                  placeholder="5"
                  className="h-11 rounded-lg"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="mt-5">
              <Label className="text-[#1e3a5f] mb-2 block text-sm">תגיות</Label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {formData.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="הוסיפו תגית"
                  className="h-10 rounded-lg"
                  dir="rtl"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                >
                  הוסף
                </Button>
              </div>
            </div>
          </div>

          {/* Publishing Options */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1e3a5f] mb-5">הגדרות פרסום</h2>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#1e3a5f]">פרסם מאמר</Label>
                  <p className="text-xs text-slate-500">המאמר יהיה גלוי לכל המבקרים</p>
                </div>
                <Switch
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#1e3a5f] flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    מאמר נבחר
                  </Label>
                  <p className="text-xs text-slate-500">יופיע בחלק המאמרים הנבחרים</p>
                </div>
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}