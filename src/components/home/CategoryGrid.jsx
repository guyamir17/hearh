import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, Heart, Calendar, Brain, Users } from 'lucide-react';

import { ShoppingBag } from 'lucide-react';

const categories = [
  {
    name: 'פרשת שבוע',
    description: 'דברי תורה והשראה על פרשת השבוע',
    icon: BookOpen,
    page: 'ParshatShavua',
  },
  {
    name: 'מאמרים באמונה',
    description: 'חיזוק האמונה והשקפת עולם',
    icon: Heart,
    page: 'MaamarimEmuna',
  },
  {
    name: 'מועדי ישראל',
    description: 'עומק החגים והמועדים',
    icon: Calendar,
    page: 'MoadeiYisrael',
  },
  {
    name: 'עולם הנפש',
    description: 'צמיחה רוחנית ועבודת המידות',
    icon: Brain,
    page: 'OlamHanefesh',
  },
  {
    name: 'מעגל החיים',
    description: 'מסורת ומשמעות באירועי החיים',
    icon: Users,
    page: 'MaagalHachaim',
  },
  {
    name: 'חנות',
    description: 'ספרים ומוצרים מיוחדים',
    icon: ShoppingBag,
    page: 'Shop',
  }
];

function CategoryCard({ category, isMobile }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const Icon = category.icon;

  const handleClick = (e) => {
    if (isMobile && !showDetail) {
      e.preventDefault();
      setShowDetail(true);
    }
  };

  const handleSecondClick = () => {
    if (isMobile && showDetail) {
      window.location.href = createPageUrl(category.page);
    }
  };

  const active = isHovered || showDetail;

  return (
    <Link
      to={createPageUrl(category.page)}
      onClick={isMobile ? handleClick : undefined}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      className="group block"
    >
      <div
        onClick={isMobile && showDetail ? handleSecondClick : undefined}
        className="relative rounded-2xl p-5 lg:p-6 h-full overflow-hidden"
        style={{
          background: active ? 'linear-gradient(160deg, #17304d 0%, #0d1f33 100%)' : '#ffffff',
          border: active ? '1px solid rgba(212,175,55,0.25)' : '1px solid rgba(0,0,0,0.07)',
          boxShadow: active
            ? '0 16px 40px rgba(10,24,46,0.3), inset 0 1px 0 rgba(255,255,255,0.06)'
            : '0 1px 4px rgba(0,0,0,0.05)',
          transform: active ? 'translateY(-3px)' : 'translateY(0)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Gold top line on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{
            background: active
              ? 'linear-gradient(90deg, transparent 0%, #c9a227 50%, transparent 100%)'
              : 'transparent',
            transition: 'background 0.3s ease',
          }}
        />

        <div className="flex flex-col items-center text-center relative z-10">
          {/* Icon */}
          <div
            className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center mb-4"
            style={{
              background: active ? 'rgba(255,255,255,0.07)' : '#f4f3f1',
              transition: 'background 0.3s ease',
            }}
          >
            <Icon
              className="w-6 h-6 lg:w-7 lg:h-7"
              strokeWidth={1.5}
              style={{
                color: active ? '#c9a227' : '#1e3a5f',
                transition: 'color 0.3s ease',
              }}
            />
          </div>

          <h3
            className="text-sm lg:text-[15px] font-bold mb-1.5"
            style={{
              color: active ? '#ffffff' : '#1a2e45',
              letterSpacing: '0.01em',
              transition: 'color 0.3s ease',
            }}
          >
            {category.name}
          </h3>
          <p
            className="text-xs leading-relaxed"
            style={{
              color: active ? 'rgba(255,255,255,0.6)' : '#7a8a9a',
              transition: 'color 0.3s ease',
            }}
          >
            {category.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function CategoryGrid() {
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const deepNavy = '#172e4a';
  const lightCream = '#faf9f7';
  const mediumCream = '#f5f3f0';

  return (
    <section className="py-20 lg:py-24" style={{ backgroundColor: lightCream }}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-12 bg-[#1e3a5f]/25"></div>
            <span className="text-sm text-[#4a90a4] font-semibold tracking-wide">גלו תכנים</span>
            <div className="h-px w-12 bg-[#1e3a5f]/25"></div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-4" style={{ color: deepNavy }}>
            קטגוריות התוכן
          </h2>
          <p className="text-slate-700 max-w-xl mx-auto leading-relaxed">
            מגוון נושאים להעמקה ולחיזוק הרוחני
          </p>
        </div>

        {/* Categories Grid - 6 columns on desktop, 2 on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-5">
          {categories.map((category) => (
            <CategoryCard 
              key={category.name} 
              category={category} 
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </section>
  );
}