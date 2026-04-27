import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { X, ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function MobileMenu({ isOpen, onClose, categories }) {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `${createPageUrl('SearchResults')}?q=${searchQuery}`;
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 z-50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 lg:hidden shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <button onClick={onClose} className="p-2 text-[#1e3a5f] hover:bg-slate-50 rounded-lg">
              <X className="w-6 h-6" />
            </button>
            <Link 
              to={createPageUrl('Home')} 
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
                <path d="M50 10C32 10 18 24 18 42C18 52 23 61 31 67V75C31 79 34 82 38 82H62C66 82 69 79 69 75V67C77 61 82 52 82 42C82 24 68 10 50 10Z" stroke="#1e3a5f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M42 50C42 50 45 42 50 42C55 42 58 50 58 50" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <line x1="38" y1="86" x2="62" y2="86" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="40" y1="91" x2="60" y2="91" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span className="text-xl font-bold text-[#1e3a5f]">הֶאָרָה</span>
            </Link>
            <div className="w-10"></div>
          </div>

          {/* Search inside menu */}
          <div className="p-5 border-b border-slate-100">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="חיפוש מאמרים..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 h-12 bg-slate-50 border-slate-200 rounded-xl text-base"
                dir="rtl"
              />
            </form>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-4">
            {categories.map((item) => (
              <div key={item.name} className="mb-2">
                <div className="flex items-center justify-between">
                  <Link
                    to={createPageUrl(item.page)}
                    onClick={onClose}
                    className="flex-1 py-3 px-4 text-[17px] font-medium text-[#1e3a5f] hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    {item.name}
                  </Link>
                  {item.subcategories?.length > 0 && (
                    <button
                      onClick={() => setExpandedCategory(
                        expandedCategory === item.name ? null : item.name
                      )}
                      className="p-3 text-[#1e3a5f] hover:bg-slate-50 rounded-xl"
                    >
                      <ChevronDown 
                        className={`w-5 h-5 transition-transform ${
                          expandedCategory === item.name ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                  )}
                </div>
                
                {item.subcategories?.length > 0 && expandedCategory === item.name && (
                  <div className="mr-5 border-r-2 border-[#4a90a4]/20 pr-4 mb-2">
                    {item.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        to={`${createPageUrl(sub.page)}?${sub.param}`}
                        onClick={onClose}
                        className="block py-2.5 px-4 text-[15px] text-[#1e3a5f]/80 hover:text-[#4a90a4] hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
          </nav>
        </div>
      </div>
    </>
  );
}