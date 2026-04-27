import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, ChevronDown, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';
import MobileMenu from './MobileMenu';
import SearchModal from './SearchModal';
import LightbulbLogo from '@/components/shared/LightbulbLogo';

// Mapping from category key to page name
const categoryPageMap = {
  'פרשת_שבוע': 'ParshatShavua',
  'מאמרים_באמונה': 'MaamarimEmuna',
  'מועדי_ישראל': 'MoadeiYisrael',
  'עולם_הנפש': 'OlamHanefesh',
  'מעגל_החיים': 'MaagalHachaim',
  'shop': 'Shop'
};

// Which URL param name to use per parent category (must match what CategoryPage reads)
const filterFieldMap = {
  'פרשת_שבוע': 'book',
  'מועדי_ישראל': 'holiday',
  'מעגל_החיים': 'event',
  'עולם_הנפש': 'subcategory',
  'מאמרים_באמונה': 'subcategory'
};

// Static items that always appear (not category-based)
const staticRightItems = [
  { name: 'אודות', page: 'About', subcategories: [] },
  { name: 'חנות', page: 'Shop', subcategories: [] }
];

function MenuItemWithDropdown({ item, activeDropdown, setActiveDropdown }) {
  return (
    <div
      className="relative group"
      onMouseEnter={() => setActiveDropdown(item.name)}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <Link
        to={createPageUrl(item.page)}
        className="flex items-center gap-1 text-[15px] font-medium text-[#1e3a5f] hover:text-[#4a90a4] transition-colors py-3 px-1"
      >
        {item.name}
        {item.subcategories?.length > 0 && (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </Link>

      {item.subcategories?.length > 0 && activeDropdown === item.name && (
        <div className="absolute top-full right-0 pt-2 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-2 min-w-44 animate-in fade-in slide-in-from-top-2 duration-200">
            {item.subcategories.map((sub) => (
              <Link
                key={sub.name}
                to={`${createPageUrl(sub.page)}?${sub.param}`}
                className="block px-4 py-2.5 text-sm text-[#1e3a5f] hover:bg-[#f8f6f3] hover:text-[#4a90a4] transition-colors"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const result = await staticClient.entities.Category.list();
      return result.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    },
    staleTime: 5 * 60 * 1000
  });

  // Build menu items from categories
  const buildMenuItems = () => {
    if (!categories) return { right: [], left: staticRightItems };

    const mainCats = categories.filter(c => !c.parent_category && c.active !== false && c.show_in_menu !== false);

    const menuItems = mainCats.map(cat => {
      const page = cat.page_url || categoryPageMap[cat.key] || 'AllArticles';
      const filterField = filterFieldMap[cat.key];
      const subs = categories.filter(c => c.parent_category === cat.key && c.active !== false);

      const subcategories = subs.map(sub => ({
        name: sub.name,
        page,
        param: filterField ? `${filterField}=${sub.key}` : `subcategory=${sub.key}`
      }));

      return { name: cat.name, page, subcategories };
    });

    // Split: first half right, second half left (+ static)
    const mid = Math.ceil(menuItems.length / 2);
    return {
      right: menuItems.slice(0, mid),
      left: [...menuItems.slice(mid), ...staticRightItems]
    };
  };

  const { right: rightMenuItems, left: leftMenuItems } = buildMenuItems();
  const allCategories = [...rightMenuItems, ...leftMenuItems];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/98 backdrop-blur-md z-50 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-18">

            {/* Right Menu */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
              {rightMenuItems.map((item) => (
                <MenuItemWithDropdown
                  key={item.name}
                  item={item}
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                />
              ))}
            </nav>

            {/* Logo - Center */}
            <Link
              to={createPageUrl('Home')}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="absolute left-1/2 -translate-x-1/2 z-10"
            >
              <LightbulbLogo size="large" variant="dark" />
            </Link>

            {/* Left Menu + Search */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
              {leftMenuItems.map((item) => (
                <MenuItemWithDropdown
                  key={item.name}
                  item={item}
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                />
              ))}

              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[#1e3a5f] hover:text-[#4a90a4] transition-colors rounded-lg hover:bg-slate-50"
                aria-label="חיפוש"
              >
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </nav>

            {/* Mobile */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-[#1e3a5f]"
                aria-label="תפריט"
              >
                <Menu className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={allCategories}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}