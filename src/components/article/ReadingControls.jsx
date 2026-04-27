import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Type, Moon, Sun, List, X } from 'lucide-react';

export default function ReadingControls({ content }) {
  const [fontSize, setFontSize] = useState(18);
  const [darkMode, setDarkMode] = useState(false);
  const [showTOC, setShowTOC] = useState(false);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    if (content) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const allHeadings = [];
      tempDiv.querySelectorAll('h2').forEach((h, i) =>
        allHeadings.push({ text: h.textContent, id: `heading-${i}`, level: 2 })
      );
      tempDiv.querySelectorAll('h3').forEach((h, i) =>
        allHeadings.push({ text: h.textContent, id: `h3-${i}`, level: 3 })
      );
      setHeadings(allHeadings);
    }
  }, [content]);

  useEffect(() => {
    const el = document.querySelector('.article-content');
    if (el) el.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    const article = document.querySelector('article');
    if (article) article.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const scrollToHeading = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setShowTOC(false);
  };

  return (
    <>
      <style>{`
        article.dark-mode { background: #1a1a1a; color: #e5e5e5; }
        article.dark-mode .article-content { color: #e5e5e5; }
        article.dark-mode .article-content h1,
        article.dark-mode .article-content h2,
        article.dark-mode .article-content h3 { color: #f0f0f0; }
        article.dark-mode .article-content blockquote { background: #2a2a2a; color: #e5e5e5; border-right-color: #4a90a4; }
        article.dark-mode .bg-white { background: #2a2a2a !important; }
        article.dark-mode .text-slate-500, article.dark-mode .text-slate-600 { color: #a0a0a0 !important; }
      `}</style>

      {/* Desktop floating controls */}
      <div className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-2 bg-white rounded-xl shadow-lg p-2">
        <div className="flex flex-col items-center gap-1">
          <Button size="icon" variant="ghost" onClick={() => setFontSize(Math.min(fontSize + 2, 24))} disabled={fontSize >= 24} title="הגדל טקסט">
            <Type className="w-5 h-5" />
          </Button>
          <span className="text-xs text-slate-500">{fontSize}</span>
          <Button size="icon" variant="ghost" onClick={() => setFontSize(Math.max(fontSize - 2, 14))} disabled={fontSize <= 14} title="הקטן טקסט">
            <Type className="w-4 h-4" />
          </Button>
        </div>
        <div className="h-px bg-slate-200 my-1"></div>
        <Button size="icon" variant="ghost" onClick={() => setDarkMode(!darkMode)} title={darkMode ? 'מצב בהיר' : 'מצב כהה'}>
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        {headings.length > 0 && (
          <>
            <div className="h-px bg-slate-200 my-1"></div>
            <Button size="icon" variant="ghost" onClick={() => setShowTOC(!showTOC)} title="תוכן עניינים">
              <List className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>

      {/* TOC Modal */}
      {showTOC && headings.length > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowTOC(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <h3 className="font-bold text-[#1e3a5f]">תוכן עניינים</h3>
              <Button size="icon" variant="ghost" onClick={() => setShowTOC(false)}><X className="w-5 h-5" /></Button>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {headings.map((heading, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToHeading(heading.id)}
                      className={`text-right w-full text-sm hover:text-[#4a90a4] transition-colors ${heading.level === 3 ? 'pr-4 text-slate-600' : 'font-medium text-[#1e3a5f]'}`}
                    >
                      {heading.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}