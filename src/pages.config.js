/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import About from './pages/About';
import AdminAboutPage from './pages/AdminAboutPage';
import AdminAboutSettings from './pages/AdminAboutSettings';
import AdminArticles from './pages/AdminArticles';
import AdminCategories from './pages/AdminCategories';
import AdminCategorySettings from './pages/AdminCategorySettings';
import AdminExternalArticles from './pages/AdminExternalArticles';
import AdminHomeSettings from './pages/AdminHomeSettings';
import AdminInitCategories from './pages/AdminInitCategories';
import AdminIntroSettings from './pages/AdminIntroSettings';
import AdminProducts from './pages/AdminProducts';
import AdminSEO from './pages/AdminSEO';
import AdminSettings from './pages/AdminSettings';
import AllArticles from './pages/AllArticles';
import Article from './pages/Article';
import ArticleEditor from './pages/ArticleEditor';
import BookParshiyot from './pages/BookParshiyot';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Home from './pages/Home';
import MaagalHachaim from './pages/MaagalHachaim';
import MaamarimEmuna from './pages/MaamarimEmuna';
import MoadeiYisrael from './pages/MoadeiYisrael';
import OlamHanefesh from './pages/OlamHanefesh';
import ParshaArticles from './pages/ParshaArticles';
import ParshatShavua from './pages/ParshatShavua';
import ProductEditor from './pages/ProductEditor';
import ProductPage from './pages/ProductPage';
import SearchResults from './pages/SearchResults';
import Shop from './pages/Shop';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "AdminAboutPage": AdminAboutPage,
    "AdminAboutSettings": AdminAboutSettings,
    "AdminArticles": AdminArticles,
    "AdminCategories": AdminCategories,
    "AdminCategorySettings": AdminCategorySettings,
    "AdminExternalArticles": AdminExternalArticles,
    "AdminHomeSettings": AdminHomeSettings,
    "AdminInitCategories": AdminInitCategories,
    "AdminIntroSettings": AdminIntroSettings,
    "AdminProducts": AdminProducts,
    "AdminSEO": AdminSEO,
    "AdminSettings": AdminSettings,
    "AllArticles": AllArticles,
    "Article": Article,
    "ArticleEditor": ArticleEditor,
    "BookParshiyot": BookParshiyot,
    "Checkout": Checkout,
    "Contact": Contact,
    "Home": Home,
    "MaagalHachaim": MaagalHachaim,
    "MaamarimEmuna": MaamarimEmuna,
    "MoadeiYisrael": MoadeiYisrael,
    "OlamHanefesh": OlamHanefesh,
    "ParshaArticles": ParshaArticles,
    "ParshatShavua": ParshatShavua,
    "ProductEditor": ProductEditor,
    "ProductPage": ProductPage,
    "SearchResults": SearchResults,
    "Shop": Shop,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};