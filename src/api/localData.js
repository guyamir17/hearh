export const initialData = {
  SiteSettings: [
    {
      id: 'site-settings',
      site_name: 'הארה',
      hero_title: 'הֶאָרָה',
      hero_subtitle: 'להאיר את הנשמה, לחזק את הרוח',
      hero_description: 'מאמרי עומק בתורה, אמונה וחכמת החיים',
      contact_email: 'haara.website@gmail.com',
      contact_phone: '050-123-4567',
      contact_address: 'ישראל',
      whatsapp_number: '972501234567',
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
    },
    {
      id: 'category-shop',
      category_key: 'shop',
      title: 'חנות',
      description: 'ספרים, חוברות ומוצרים מיוחדים'
    }
  ],
  Category: [
    { id: 'cat-parasha', key: 'פרשת_שבוע', name: 'פרשת שבוע', page_url: 'ParshatShavua', display_order: 1, active: true, show_in_menu: true },
    { id: 'cat-emuna', key: 'מאמרים_באמונה', name: 'מאמרים באמונה', page_url: 'MaamarimEmuna', display_order: 2, active: true, show_in_menu: true },
    { id: 'cat-holidays', key: 'מועדי_ישראל', name: 'מועדי ישראל', page_url: 'MoadeiYisrael', display_order: 3, active: true, show_in_menu: true },
    { id: 'cat-soul', key: 'עולם_הנפש', name: 'עולם הנפש', page_url: 'OlamHanefesh', display_order: 4, active: true, show_in_menu: true },
    { id: 'cat-life', key: 'מעגל_החיים', name: 'מעגל החיים', page_url: 'MaagalHachaim', display_order: 5, active: true, show_in_menu: true },
    { id: 'cat-shop', key: 'shop', name: 'חנות', page_url: 'Shop', display_order: 6, active: true, show_in_menu: false },
    { id: 'cat-emuna-bitachon', key: 'בטחון', parent_category: 'מאמרים_באמונה', name: 'בטחון', display_order: 1, active: true },
    { id: 'cat-soul-midot', key: 'עבודת_המידות', parent_category: 'עולם_הנפש', name: 'עבודת המידות', display_order: 1, active: true },
    { id: 'cat-life-family', key: 'משפחה', parent_category: 'מעגל_החיים', name: 'משפחה', display_order: 1, active: true },
    { id: 'cat-holidays-shabbat', key: 'שבת', parent_category: 'מועדי_ישראל', name: 'שבת', display_order: 1, active: true }
  ],
  Article: [
    {
      id: 'article-welcome',
      title: 'ברוכים הבאים להארה',
      excerpt: 'מקום למאמרים מעמיקים ונגישים בתורה, אמונה וחכמת החיים.',
      content: '<p>אתר הארה נבנה כדי להנגיש דברי תורה, חיזוק והשראה בצורה נקיה ונעימה. המטרה היא ליצור בית שקט לקריאה, לימוד והתבוננות.</p><p>כאן תמצאו מאמרים על פרשת השבוע, אמונה, מועדי ישראל, עולם הנפש ומעגל החיים היהודי.</p>',
      category: 'מאמרים_באמונה',
      subcategory: 'בטחון',
      published: true,
      is_featured: true,
      reading_time: 3,
      image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&q=80',
      created_date: '2026-04-27T00:00:00.000Z'
    },
    {
      id: 'article-parasha',
      title: 'בראשית: להתחיל מחדש',
      excerpt: 'פרשת בראשית מלמדת שכל התחלה נושאת בתוכה אפשרות של אור, תיקון ובחירה.',
      content: '<p>המילה הראשונה בתורה, בראשית, פותחת לא רק את סיפור הבריאה אלא גם את האפשרות האנושית להתחיל מחדש. העולם אינו מוצג כמציאות מקרית, אלא כמרחב שיש בו סדר, משמעות ותפקיד.</p><h2>האור הראשון</h2><p>לפני שהאדם נברא נאמר: יהי אור. האור הזה מסמן את הכיוון של כל עבודת האדם: להבחין, לברר, ולגלות את הטוב גם במקום שנראה מעורפל.</p><h2>אחריות האדם</h2><p>האדם נברא בצלם אלוקים, ולכן חייו אינם רק הישרדות אלא שליחות. כל בחירה קטנה יכולה להוסיף בניין, חמלה ואמת בעולם.</p><p>קריאת פרשת בראשית מזמינה אותנו לשאול: איזו התחלה חדשה אנחנו יכולים לבחור השבוע?</p>',
      category: 'פרשת_שבוע',
      parasha_book: 'בראשית',
      parasha_name: 'בראשית',
      published: true,
      is_featured: true,
      reading_time: 4,
      image_url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=900&q=80',
      created_date: '2026-04-26T00:00:00.000Z'
    },
    {
      id: 'article-noach',
      title: 'נח: לבנות תיבה בתוך המבול',
      excerpt: 'גם כשבחוץ יש רעש ובלבול, האדם יכול לבנות מרחב פנימי מוגן ונאמן.',
      content: '<p>פרשת נח מתארת עולם מוצף, אך בתוך המים הרבים נבנית תיבה. התיבה אינה רק מבנה פיזי, אלא סמל ליכולת לשמור על נקודה פנימית של אמונה ויושר.</p><p>לפעמים התיקון מתחיל בצעד קטן: מילה טובה, גבול נכון, זמן של שקט או נאמנות למשפחה ולשליחות.</p>',
      category: 'פרשת_שבוע',
      parasha_book: 'בראשית',
      parasha_name: 'נח',
      published: true,
      is_featured: false,
      reading_time: 3,
      image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80',
      created_date: '2026-04-25T00:00:00.000Z'
    },
    {
      id: 'article-lech-lecha',
      title: 'לך לך: הדרך אל עצמך',
      excerpt: 'הקריאה לאברהם היא קריאה לכל אדם לצאת אל הדרך שבה מתגלה שליחותו.',
      content: '<p>לך לך היא קריאה של תנועה. האדם נקרא לצאת מהרגלים, מתבניות ומפחדים, וללכת אל המקום שבו קולו הפנימי נעשה ברור יותר.</p><p>אמונה אינה תמיד ידיעה של כל הדרך מראש. פעמים רבות היא הצעד הבא שנעשה ביושר ובאומץ.</p>',
      category: 'פרשת_שבוע',
      parasha_book: 'בראשית',
      parasha_name: 'לך_לך',
      published: true,
      is_featured: false,
      reading_time: 3,
      image_url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=80',
      created_date: '2026-04-24T00:00:00.000Z'
    },
    {
      id: 'article-emuna-daily',
      title: 'אמונה ביום רגיל',
      excerpt: 'האמונה נבחנת לא רק ברגעים גדולים, אלא דווקא בשגרה הפשוטה.',
      content: '<p>אמונה אינה בריחה מן המציאות. היא היכולת לפגוש את המציאות בעיניים עמוקות יותר, ולראות שגם היום הפשוט נושא בתוכו הזמנה לעבודת הלב.</p><p>כאשר אדם מכניס תודה, סבלנות ואחריות אל סדר יומו, הוא מגלה שהחיים עצמם נעשים מקום של קרבת אלוקים.</p>',
      category: 'מאמרים_באמונה',
      subcategory: 'בטחון',
      published: true,
      is_featured: true,
      reading_time: 4,
      image_url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=900&q=80',
      created_date: '2026-04-23T00:00:00.000Z'
    },
    {
      id: 'article-shabbat',
      title: 'שבת: מנוחה שמחזירה נשמה',
      excerpt: 'השבת אינה רק הפסקה ממלאכה, אלא הזמנה לחזור אל המרכז.',
      content: '<p>שבת מלמדת את האדם שלא הכול תלוי בעשייה בלתי פוסקת. יש ברכה מיוחדת דווקא בעצירה, בהקשבה, במשפחה ובתפילה.</p><p>כאשר אדם שובת, הוא מגלה שיש לו ערך גם מעבר למה שהספיק לייצר השבוע.</p>',
      category: 'מועדי_ישראל',
      holiday: 'שבת',
      published: true,
      is_featured: false,
      reading_time: 3,
      image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=80',
      created_date: '2026-04-22T00:00:00.000Z'
    },
    {
      id: 'article-midot',
      title: 'עבודת המידות מתחילה בהקשבה',
      excerpt: 'לפני שמשנים מידה, צריך ללמוד להקשיב למה שהיא מבקשת לומר.',
      content: '<p>עולם הנפש אינו אויב של עבודת ה׳. להפך, ההקשבה לכוחות הנפש מאפשרת לעבוד עם האדם כולו ולא רק עם הרצון המוצהר שלו.</p><p>מידה מתוקנת אינה מחיקה של כוח, אלא הצבתו במקום הנכון ובמינון הנכון.</p>',
      category: 'עולם_הנפש',
      subcategory: 'עבודת_המידות',
      published: true,
      is_featured: false,
      reading_time: 4,
      image_url: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=900&q=80',
      created_date: '2026-04-21T00:00:00.000Z'
    },
    {
      id: 'article-family',
      title: 'בית יהודי כמקום של אור',
      excerpt: 'הבית נבנה מהרגלים קטנים של כבוד, הקשבה וברכה.',
      content: '<p>מעגל החיים היהודי מתחיל בבית. לא תמיד באירועים גדולים, אלא בשולחן, במילה טובה, בהקשבה לילד וביכולת לבקש סליחה.</p><p>כאשר הבית נעשה מקום שבו יש מקום לנשמה, גם היום העמוס מקבל פנים אחרות.</p>',
      category: 'מעגל_החיים',
      lifecycle_event: 'משפחה',
      published: true,
      is_featured: false,
      reading_time: 3,
      image_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=900&q=80',
      created_date: '2026-04-20T00:00:00.000Z'
    }
  ],
  ExternalArticle: [
    {
      id: 'external-1',
      title: 'לימוד יומי קצר',
      excerpt: 'רעיונות קצרים להעמקה יומית.',
      url: 'https://www.sefaria.org.il/',
      published: true,
      display_order: 1
    }
  ],
  Product: [
    {
      id: 'product-book',
      name: 'קובץ מאמרים להדפסה',
      short_description: 'אוסף מאמרי השראה לקריאה בשבת ובחגים.',
      full_description: 'קובץ דיגיטלי לדוגמה עבור גרסת האתר הסטטית.',
      category: 'ספרים',
      product_type: 'digital',
      price: 0,
      published: true,
      image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=900&q=80',
      created_date: '2026-04-19T00:00:00.000Z'
    }
  ],
  Subscriber: [],
  ContactMessage: [],
  Order: []
};
