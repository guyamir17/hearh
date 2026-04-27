export const initialData = {
  SiteSettings: [
    {
      id: 'site-settings',
      site_name: 'הארה',
      hero_title: 'הֶאָרָה',
      hero_subtitle: 'להאיר את הנשמה, לחזק את הרוח',
      hero_description: 'מאמרי עומק בתורה, אמונה וחכמת החיים',
      email: '',
      phone: '',
      whatsapp_number: '',
      meta_title: 'הארה',
      meta_description: 'מאמרי עומק בתורה, אמונה וחכמת החיים'
    }
  ],
  HomePageSettings: [
    {
      id: 'home-settings',
      hero_title: 'הֶאָרָה',
      hero_subtitle: 'להאיר את הנשמה, לחזק את הרוח',
      hero_description: 'מאמרי עומק בתורה, אמונה וחכמת החיים',
      hero_cta_text: 'לכל המאמרים'
    }
  ],
  AboutSettings: [
    {
      id: 'about-settings',
      title: 'אודות הארה',
      description: 'בית למאמרים, השראה וחיזוק מתוך חכמת ישראל.'
    }
  ],
  AboutPageSettings: [],
  IntroSectionSettings: [],
  CategorySettings: [
    {
      id: 'category-parasha',
      category_key: 'פרשת_שבוע',
      title: 'פרשת שבוע',
      description: 'דברי תורה והשראה על פרשת השבוע'
    },
    {
      id: 'category-emuna',
      category_key: 'מאמרים_באמונה',
      title: 'מאמרים באמונה',
      description: 'חיזוק האמונה והשקפת עולם'
    },
    {
      id: 'category-holidays',
      category_key: 'מועדי_ישראל',
      title: 'מועדי ישראל',
      description: 'עומק החגים והמועדים'
    },
    {
      id: 'category-soul',
      category_key: 'עולם_הנפש',
      title: 'עולם הנפש',
      description: 'צמיחה רוחנית ועבודת המידות'
    },
    {
      id: 'category-life',
      category_key: 'מעגל_החיים',
      title: 'מעגל החיים',
      description: 'מסורת ומשמעות באירועי החיים'
    }
  ],
  Category: [
    { id: 'cat-parasha', key: 'פרשת_שבוע', name: 'פרשת שבוע', page_url: 'ParshatShavua', display_order: 1, active: true, show_in_menu: true },
    { id: 'cat-emuna', key: 'מאמרים_באמונה', name: 'מאמרים באמונה', page_url: 'MaamarimEmuna', display_order: 2, active: true, show_in_menu: true },
    { id: 'cat-holidays', key: 'מועדי_ישראל', name: 'מועדי ישראל', page_url: 'MoadeiYisrael', display_order: 3, active: true, show_in_menu: true },
    { id: 'cat-soul', key: 'עולם_הנפש', name: 'עולם הנפש', page_url: 'OlamHanefesh', display_order: 4, active: true, show_in_menu: true },
    { id: 'cat-life', key: 'מעגל_החיים', name: 'מעגל החיים', page_url: 'MaagalHachaim', display_order: 5, active: true, show_in_menu: true },
    { id: 'cat-shop', key: 'shop', name: 'חנות', page_url: 'Shop', display_order: 6, active: true, show_in_menu: false }
  ],
  Article: [
    {
      id: 'article-welcome',
      title: 'ברוכים הבאים להארה',
      excerpt: 'מקום למאמרים מעמיקים ונגישים בתורה, אמונה וחכמת החיים.',
      content: 'אתר הארה נבנה כדי להנגיש דברי תורה, חיזוק והשראה בצורה נקיה ונעימה. כאן ניתן לפרסם מאמרים לפי קטגוריות, לערוך תוכן, ולשמור שינויים בדפדפן ללא תלות בשירות חיצוני.',
      category: 'מאמרים_באמונה',
      published: true,
      is_featured: true,
      created_date: '2026-04-27T00:00:00.000Z'
    },
    {
      id: 'article-parasha',
      title: 'נקודה לפרשת השבוע',
      excerpt: 'רעיון קצר לפתיחת הלימוד השבועי.',
      content: 'פרשת השבוע מזמינה אותנו לעצור לרגע, להתבונן, ולמצוא נקודה אחת שאפשר לקחת אל חיי היום יום.',
      category: 'פרשת_שבוע',
      published: true,
      is_featured: false,
      created_date: '2026-04-26T00:00:00.000Z'
    }
  ],
  ExternalArticle: [],
  Product: [],
  Subscriber: [],
  ContactMessage: [],
  Order: []
};
