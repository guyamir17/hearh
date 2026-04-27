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
import AllArticles from './pages/AllArticles';
import Article from './pages/Article';
import BookParshiyot from './pages/BookParshiyot';
import Contact from './pages/Contact';
import Home from './pages/Home';
import MaagalHachaim from './pages/MaagalHachaim';
import MaamarimEmuna from './pages/MaamarimEmuna';
import MoadeiYisrael from './pages/MoadeiYisrael';
import OlamHanefesh from './pages/OlamHanefesh';
import ParshaArticles from './pages/ParshaArticles';
import ParshatShavua from './pages/ParshatShavua';
import ProductPage from './pages/ProductPage';
import SearchResults from './pages/SearchResults';
import Shop from './pages/Shop';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "AllArticles": AllArticles,
    "Article": Article,
    "BookParshiyot": BookParshiyot,
    "Contact": Contact,
    "Home": Home,
    "MaagalHachaim": MaagalHachaim,
    "MaamarimEmuna": MaamarimEmuna,
    "MoadeiYisrael": MoadeiYisrael,
    "OlamHanefesh": OlamHanefesh,
    "ParshaArticles": ParshaArticles,
    "ParshatShavua": ParshatShavua,
    "ProductPage": ProductPage,
    "SearchResults": SearchResults,
    "Shop": Shop,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
