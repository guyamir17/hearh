import { useState, useEffect } from 'react';
import { Accessibility, X, ZoomIn, ZoomOut, Link2, Type, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 100,
    contrast: 'normal',
    highlightLinks: false,
    readableFont: false,
    lineHeight: 'normal'
  });

  // Load saved settings on mount
  useEffect(() => {
    const saved = localStorage.getItem('accessibility_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(parsed);
      applySettings(parsed);
    }
  }, []);

  // Apply settings to document
  const applySettings = (s) => {
    const root = document.documentElement;
    
    // Font size - set on html element so rem units scale everywhere
    const basePx = Math.round(16 * (s.fontSize / 100));
    root.style.fontSize = `${basePx}px`;
    
    // Contrast
    root.classList.remove('high-contrast', 'inverted-contrast');
    if (s.contrast === 'high') {
      root.classList.add('high-contrast');
    } else if (s.contrast === 'inverted') {
      root.classList.add('inverted-contrast');
    }
    
    // Highlight links
    if (s.highlightLinks) {
      root.classList.add('highlight-links');
    } else {
      root.classList.remove('highlight-links');
    }
    
    // Readable font
    if (s.readableFont) {
      root.classList.add('readable-font');
    } else {
      root.classList.remove('readable-font');
    }
    
    // Line height
    root.classList.remove('increased-line-height');
    if (s.lineHeight === 'increased') {
      root.classList.add('increased-line-height');
    }
  };

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
    localStorage.setItem('accessibility_settings', JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 100,
      contrast: 'normal',
      highlightLinks: false,
      readableFont: false,
      lineHeight: 'normal'
    };
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    localStorage.removeItem('accessibility_settings');
  };

  const increaseFontSize = () => {
    if (settings.fontSize < 150) {
      updateSetting('fontSize', settings.fontSize + 10);
    }
  };

  const decreaseFontSize = () => {
    if (settings.fontSize > 80) {
      updateSetting('fontSize', settings.fontSize - 10);
    }
  };

  return (
    <>
      {/* Accessibility Styles */}
      <style>{`
        .high-contrast {
          filter: contrast(1.4);
        }
        .high-contrast img {
          filter: contrast(0.7);
        }
        .inverted-contrast {
          filter: invert(1) hue-rotate(180deg);
        }
        .inverted-contrast img {
          filter: invert(1) hue-rotate(180deg);
        }
        .highlight-links a {
          background-color: yellow !important;
          color: black !important;
          text-decoration: underline !important;
          padding: 2px 4px;
        }
        .readable-font * {
          font-family: Arial, sans-serif !important;
          letter-spacing: 0.02em;
        }
        .increased-line-height p,
        .increased-line-height li,
        .increased-line-height span,
        .increased-line-height div {
          line-height: 2 !important;
        }
      `}</style>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 z-40 w-12 h-12 bg-[#1e3a5f] text-white rounded-full shadow-lg hover:bg-[#2a4a6f] transition-colors flex items-center justify-center"
        aria-label="פתח תפריט נגישות"
      >
        <Accessibility className="w-6 h-6" />
      </button>

      {/* Menu Overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="fixed bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[#1e3a5f] text-white">
              <div className="flex items-center gap-2">
                <Accessibility className="w-5 h-5" />
                <h2 className="font-bold">הגדרות נגישות</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Settings */}
            <div className="p-4 space-y-5">
              {/* Font Size */}
              <div>
                <label className="text-sm font-medium text-[#1e3a5f] mb-3 block">
                  גודל טקסט: {settings.fontSize}%
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decreaseFontSize}
                    disabled={settings.fontSize <= 80}
                    className="flex-1"
                  >
                    <ZoomOut className="w-4 h-4 ml-2" />
                    הקטן
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={increaseFontSize}
                    disabled={settings.fontSize >= 150}
                    className="flex-1"
                  >
                    <ZoomIn className="w-4 h-4 ml-2" />
                    הגדל
                  </Button>
                </div>
              </div>

              {/* Contrast */}
              <div>
                <label className="text-sm font-medium text-[#1e3a5f] mb-3 block">
                  ניגודיות
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={settings.contrast === 'normal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('contrast', 'normal')}
                    className="flex-1 text-xs"
                  >
                    רגיל
                  </Button>
                  <Button
                    variant={settings.contrast === 'high' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('contrast', 'high')}
                    className="flex-1 text-xs"
                  >
                    גבוה
                  </Button>
                  <Button
                    variant={settings.contrast === 'inverted' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('contrast', 'inverted')}
                    className="flex-1 text-xs"
                  >
                    הפוך
                  </Button>
                </div>
              </div>

              {/* Line Height */}
              <div>
                <label className="text-sm font-medium text-[#1e3a5f] mb-3 block">
                  ריווח שורות
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={settings.lineHeight === 'normal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('lineHeight', 'normal')}
                    className="flex-1"
                  >
                    רגיל
                  </Button>
                  <Button
                    variant={settings.lineHeight === 'increased' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('lineHeight', 'increased')}
                    className="flex-1"
                  >
                    מורחב
                  </Button>
                </div>
              </div>

              {/* Toggle Options */}
              <div className="space-y-3">
                <button
                  onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors ${
                    settings.highlightLinks 
                      ? 'bg-[#1e3a5f]/10 border-[#1e3a5f]/30' 
                      : 'border-slate-200 hover:border-[#1e3a5f]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Link2 className="w-5 h-5 text-[#1e3a5f]" />
                    <span className="text-sm text-[#1e3a5f]">הדגשת קישורים</span>
                  </div>
                  <div className={`w-10 h-6 rounded-full transition-colors ${
                    settings.highlightLinks ? 'bg-[#1e3a5f]' : 'bg-slate-200'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow mt-0.5 transition-transform ${
                      settings.highlightLinks ? 'mr-0.5' : 'mr-4'
                    }`} />
                  </div>
                </button>

                <button
                  onClick={() => updateSetting('readableFont', !settings.readableFont)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors ${
                    settings.readableFont 
                      ? 'bg-[#1e3a5f]/10 border-[#1e3a5f]/30' 
                      : 'border-slate-200 hover:border-[#1e3a5f]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Type className="w-5 h-5 text-[#1e3a5f]" />
                    <span className="text-sm text-[#1e3a5f]">פונט קריא</span>
                  </div>
                  <div className={`w-10 h-6 rounded-full transition-colors ${
                    settings.readableFont ? 'bg-[#1e3a5f]' : 'bg-slate-200'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow mt-0.5 transition-transform ${
                      settings.readableFont ? 'mr-0.5' : 'mr-4'
                    }`} />
                  </div>
                </button>
              </div>

              {/* Reset */}
              <Button
                variant="outline"
                onClick={resetSettings}
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 ml-2" />
                איפוס הגדרות
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}