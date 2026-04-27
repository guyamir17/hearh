import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import mammoth from 'mammoth';
import { createPageUrl } from '@/utils';
import { 
  Upload, FileText, Loader2, Check, X, AlertCircle, 
  ChevronDown, ChevronUp, Globe, Pencil, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Category detection keywords
const categoryKeywords = {
  'פרשת_שבוע': ['פרשת', 'בראשית', 'נח', 'לך לך', 'וירא', 'חיי שרה', 'תולדות', 'ויצא', 'וישלח', 'וישב', 'מקץ', 'ויגש', 'ויחי', 'שמות', 'וארא', 'בא', 'בשלח', 'יתרו', 'משפטים', 'תרומה', 'תצוה', 'כי תשא', 'ויקהל', 'פקודי', 'ויקרא', 'צו', 'שמיני', 'תזריע', 'מצורע', 'אחרי מות', 'קדושים', 'אמור', 'בהר', 'בחוקותי', 'במדבר', 'נשא', 'בהעלותך', 'שלח', 'קורח', 'חוקת', 'בלק', 'פנחס', 'מטות', 'מסעי', 'דברים', 'ואתחנן', 'עקב', 'ראה', 'שופטים', 'כי תצא', 'כי תבוא', 'ניצבים', 'וילך', 'האזינו', 'וזאת הברכה'],
  'מאמרים_באמונה': ['אמונה', 'ביטחון', 'השגחה', 'תפילה', 'קדושה', 'עבודת ה', 'יראת שמים', 'תשובה', 'מוסר', 'מידות'],
  'מועדי_ישראל': ['ראש השנה', 'יום כיפור', 'סוכות', 'חנוכה', 'פורים', 'פסח', 'שבועות', 'תשעה באב', 'ט"ו בשבט', 'ל"ג בעומר', 'חג', 'מועד'],
  'עולם_הנפש': ['נפש', 'צמיחה', 'מידות', 'כעס', 'שמחה', 'עצבות', 'חרדה', 'רגש', 'פנימי', 'נפשי', 'התפתחות'],
  'מעגל_החיים': ['חתונה', 'ברית', 'בר מצווה', 'בת מצווה', 'לידה', 'אבלות', 'שבעה', 'נישואין', 'זוגיות', 'משפחה', 'הורות']
};

// Default images by category
const categoryImages = {
  'פרשת_שבוע': [
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80',
    'https://images.unsplash.com/photo-1544376798-76e9b28fc083?w=800&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80'
  ],
  'מאמרים_באמונה': [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'
  ],
  'מועדי_ישראל': [
    'https://images.unsplash.com/photo-1544476915-ed1370594142?w=800&q=80',
    'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80'
  ],
  'עולם_הנפש': [
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80',
    'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80'
  ],
  'מעגל_החיים': [
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80'
  ],
  'default': [
    'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80'
  ]
};

function detectCategory(text) {
  const lowerText = text.toLowerCase();
  let maxScore = 0;
  let detectedCategory = null;
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        score++;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      detectedCategory = category;
    }
  }
  
  return detectedCategory;
}

function getRandomImage(category) {
  const images = categoryImages[category] || categoryImages['default'];
  return images[Math.floor(Math.random() * images.length)];
}

function extractTitle(content, filename) {
  // Try to find a title in the content
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // If first line looks like a title (short, no period at end)
    if (firstLine.length < 100 && !firstLine.endsWith('.')) {
      return firstLine;
    }
  }
  // Fall back to filename
  return filename.replace(/\.(docx?|pdf|txt)$/i, '').replace(/[-_]/g, ' ');
}

function extractExcerpt(content) {
  // Get first paragraph as excerpt
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim());
  if (paragraphs.length > 0) {
    const firstPara = paragraphs[0].trim();
    // Limit to ~200 chars
    if (firstPara.length > 200) {
      return firstPara.substring(0, 197) + '...';
    }
    return firstPara;
  }
  return '';
}

function cleanContent(content) {
  // Clean up content
  return content
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function contentToHtml(content) {
  // Convert plain text to HTML paragraphs
  const paragraphs = content.split(/\n\n+/);
  return paragraphs
    .map(p => `<p>${p.trim().replace(/\n/g, '<br/>')}</p>`)
    .join('\n');
}

export default function BulkArticleUpload({ onComplete }) {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [expandedResult, setExpandedResult] = useState(null);
  const [publishingAll, setPublishingAll] = useState(false);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setResults([]);
  };

  const processFiles = async () => {
    setProcessing(true);
    setProgress(0);
    const newResults = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress(((i) / files.length) * 100);

      try {
        const content = await readFileContent(file);
        const cleanedContent = cleanContent(content);
        
        const title = extractTitle(cleanedContent, file.name);
        const excerpt = extractExcerpt(cleanedContent);
        const category = detectCategory(cleanedContent + ' ' + title);
        const imageUrl = getRandomImage(category);
        
        const wordCount = cleanedContent.split(/\s+/).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));
        
        const htmlContent = contentToHtml(cleanedContent);
        
        const articleData = {
          title,
          excerpt,
          content: htmlContent,
          image_url: imageUrl,
          category: category || 'מאמרים_באמונה',
          reading_time: readingTime,
          published: false
        };
        
        const created = await base44.entities.Article.create(articleData);
        
        newResults.push({
          filename: file.name,
          status: 'success',
          title,
          category: category || 'לא מסווג',
          excerpt,
          articleId: created.id,
          published: false
        });
      } catch (error) {
        newResults.push({
          filename: file.name,
          status: 'error',
          error: error.message
        });
      }
    }

    setProgress(100);
    setResults(newResults);
    setProcessing(false);
    queryClient.invalidateQueries({ queryKey: ['adminArticles'] });
    
    if (onComplete) {
      onComplete(newResults);
    }
  };

  const publishAll = async () => {
    setPublishingAll(true);
    const successResults = results.filter(r => r.status === 'success' && !r.published);
    
    for (const result of successResults) {
      await base44.entities.Article.update(result.articleId, { published: true });
      result.published = true;
    }
    
    setResults([...results]);
    setPublishingAll(false);
    queryClient.invalidateQueries({ queryKey: ['adminArticles'] });
  };

  const readFileContent = async (file) => {
    // For DOCX files, use mammoth to extract text client-side
    if (file.name.toLowerCase().endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (result?.value) {
        return result.value;
      }
      throw new Error('לא ניתן לחלץ תוכן מהקובץ');
    }
    
    // For TXT files, read directly
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('שגיאה בקריאת הקובץ'));
      reader.readAsText(file, 'UTF-8');
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5" />
        העלאה מרוכזת של מאמרים
      </h2>
      
      <p className="text-slate-500 text-sm mb-6">
        העלו קבצי טקסט (TXT או DOCX) והמערכת תיצור מאמרים אוטומטית עם כותרת, תקציר, תמונה וקטגוריה.
      </p>

      {/* File Input */}
      <div className="mb-6">
        <label className="block">
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#4a90a4] transition-colors">
            <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 mb-1">לחצו לבחירת קבצים</p>
            <p className="text-xs text-slate-400">TXT, DOCX - ניתן לבחור מספר קבצים</p>
          </div>
          <input
            type="file"
            accept=".txt,.docx"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      {/* Selected Files */}
      {files.length > 0 && !processing && results.length === 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[#1e3a5f] mb-3">
            נבחרו {files.length} קבצים:
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                <FileText className="w-4 h-4 text-slate-400" />
                {file.name}
              </div>
            ))}
          </div>
          <Button
            onClick={processFiles}
            className="mt-4 w-full bg-[#1e3a5f] hover:bg-[#2a4a6f]"
          >
            עבד והעלה מאמרים
          </Button>
        </div>
      )}

      {/* Processing */}
      {processing && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-5 h-5 animate-spin text-[#4a90a4]" />
            <span className="text-slate-600">מעבד קבצים...</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-[#1e3a5f] mb-3">תוצאות:</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`rounded-lg border ${
                  result.status === 'success' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div 
                  className="flex items-center justify-between p-3 cursor-pointer"
                  onClick={() => setExpandedResult(expandedResult === index ? null : index)}
                >
                  <div className="flex items-center gap-2">
                    {result.status === 'success' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium">
                      {result.status === 'success' ? result.title : result.filename}
                    </span>
                  </div>
                  {result.status === 'success' && (
                    expandedResult === index 
                      ? <ChevronUp className="w-4 h-4 text-slate-400" />
                      : <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                
                {expandedResult === index && result.status === 'success' && (
                  <div className="px-3 pb-3 pt-0 text-sm space-y-2">
                    <div className="text-slate-600">
                      <span className="font-medium">קטגוריה:</span> {result.category}
                    </div>
                    <div className="text-slate-500 text-xs line-clamp-2">
                      {result.excerpt}
                    </div>
                    <a
                      href={`${createPageUrl('ArticleEditor')}?id=${result.articleId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#4a90a4] hover:underline font-medium"
                    >
                      <Pencil className="w-3 h-3" />
                      עריכה בעורך המאמרים
                    </a>
                  </div>
                )}
                
                {result.status === 'error' && (
                  <div className="px-3 pb-3 text-xs text-red-600">
                    {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="mt-5 space-y-3">
            {results.some(r => r.status === 'success' && !r.published) && (
              <Button
                onClick={publishAll}
                disabled={publishingAll}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {publishingAll ? (
                  <><Loader2 className="w-4 h-4 animate-spin ml-2" />מפרסם...</>
                ) : (
                  <><Globe className="w-4 h-4 ml-2" />פרסם את כל המאמרים ({results.filter(r => r.status === 'success' && !r.published).length})</>
                )}
              </Button>
            )}
            {results.every(r => r.status !== 'success' || r.published) && results.some(r => r.status === 'success') && (
              <div className="flex items-center gap-2 justify-center text-green-600 text-sm font-medium py-2">
                <CheckCircle2 className="w-4 h-4" />
                כל המאמרים פורסמו בהצלחה!
              </div>
            )}
            <Button
              onClick={() => { setFiles([]); setResults([]); }}
              variant="outline"
              className="w-full"
            >
              העלה עוד קבצים
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}