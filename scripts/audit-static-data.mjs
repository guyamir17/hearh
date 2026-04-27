import { initialData } from '../src/api/localData.js';

const issues = [];
const articles = initialData.Article.filter((article) => article.published);
const products = initialData.Product.filter((product) => product.published);
const externalArticles = initialData.ExternalArticle.filter((article) => article.published);

const parshaBooks = {
  'בראשית': ['בראשית', 'נח', 'לך_לך', 'וירא', 'חיי_שרה', 'תולדות', 'ויצא', 'וישלח', 'וישב', 'מקץ', 'ויגש', 'ויחי'],
  'שמות': ['שמות', 'וארא', 'בא', 'בשלח', 'יתרו', 'משפטים', 'תרומה', 'תצווה', 'כי_תשא', 'ויקהל', 'פקודי'],
  'ויקרא': ['ויקרא', 'צו', 'שמיני', 'תזריע', 'מצורע', 'אחרי_מות', 'קדושים', 'אמור', 'בהר', 'בחוקותי'],
  'במדבר': ['במדבר', 'נשא', 'בהעלותך', 'שלח', 'קרח', 'חוקת', 'בלק', 'פינחס', 'מטות', 'מסעי'],
  'דברים': ['דברים', 'ואתחנן', 'עקב', 'ראה', 'שופטים', 'כי_תצא', 'כי_תבוא', 'נצבים', 'וילך', 'האזינו', 'וזאת_הברכה']
};

const requiredCategories = ['פרשת_שבוע', 'מאמרים_באמונה', 'מועדי_ישראל', 'עולם_הנפש', 'מעגל_החיים'];

for (const article of articles) {
  if (!article.id || !article.title || !article.excerpt || !article.content || !article.category) {
    issues.push(`Article is missing required text fields: ${article.id || article.title || 'unknown'}`);
  }
  if (!article.image_url) {
    issues.push(`Article is missing image_url: ${article.id}`);
  }
}

for (const product of products) {
  if (!product.id || !product.name || !product.image_url || product.price === undefined || !product.product_type) {
    issues.push(`Product is incomplete: ${product.id || product.name || 'unknown'}`);
  }
}

for (const article of externalArticles) {
  if (!article.id || !article.title || !article.external_url || !article.image_url || !article.source_name) {
    issues.push(`External article is incomplete: ${article.id || article.title || 'unknown'}`);
  }
}

for (const [book, parshiyot] of Object.entries(parshaBooks)) {
  for (const parsha of parshiyot) {
    const hasArticle = articles.some((article) => (
      article.category === 'פרשת_שבוע' &&
      article.parasha_book === book &&
      article.parasha_name === parsha
    ));

    if (!hasArticle) {
      issues.push(`Missing parsha article: ${book}/${parsha}`);
    }
  }
}

for (const category of requiredCategories) {
  if (!articles.some((article) => article.category === category)) {
    issues.push(`No published article for category: ${category}`);
  }
}

const summary = {
  articles: articles.length,
  products: products.length,
  externalArticles: externalArticles.length,
  issues
};

console.log(JSON.stringify(summary, null, 2));

if (issues.length > 0) {
  process.exit(1);
}
