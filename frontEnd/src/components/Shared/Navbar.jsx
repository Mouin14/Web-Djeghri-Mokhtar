
import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Globe, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ASSETS } from '../../constants/images';
import { Link } from 'react-router-dom';

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' }
];

const NAV_ITEMS = ['Services', 'About', 'Facility', 'FAQ', 'Location'];

const Navbar = ({ currentTheme, toggleTheme }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();



    const isRTL = language === 'ar';

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 ${isScrolled ? 'py-3' : 'py-6'}`}
            role="navigation"
            aria-label="Main Navigation"
        >
            <div className={`max-w-7xl mx-auto glass-morphism-premium rounded-[2rem] px-8 py-3 flex justify-between items-center transition-all duration-500 shadow-2xl border border-white/10 ${isScrolled ? 'bg-white/80 dark:bg-slate-900/80 saturate-150 backdrop-blur-xl' : ''} ${isRTL ? 'flex-row-reverse' : ''}`}>

                {/* Brand Identity */}
                <a
                    href="/"
                    className={`flex items-center gap-4 group active:scale-95 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
                    aria-label="EHS Mokhtar Djaghri Home"
                >
                    <div className="relative">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500 p-2 overflow-hidden">
                            <img src={ASSETS.LOGO} alt="Hospital Logo" className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-success rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
                    </div>
                    <div className={`flex flex-col leading-tight ${isRTL ? 'text-right' : ''}`}>
                        <span className="text-brand-primary dark:text-white font-black text-xl tracking-tight uppercase">Mokhtar</span>
                        <span className="text-brand-secondary dark:text-brand-accent font-bold text-[9px] uppercase tracking-[0.25em] opacity-80">Djaghri</span>
                    </div>
                </a>

                {/* Navigation Desktop */}
                <div className={`hidden lg:flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div
                        className={`flex items-center gap-1 px-4 border-x border-brand-primary/5 dark:border-white/5 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                        {NAV_ITEMS.map((item) => (
                            <a
                                key={item}
                                href={`/#${item.toLowerCase()}`}
                                className="px-4 py-2 rounded-xl text-[10px] font-black text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-success hover:bg-brand-primary/5 dark:hover:bg-white/5 uppercase tracking-widest transition-all relative group/item"
                            >
                                <span className="relative z-10">{t.nav[item.toLowerCase()]}</span>
                                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-brand-primary dark:bg-brand-success rounded-full transition-all duration-300 group-hover/item:w-4 opacity-0 group-hover/item:opacity-100`}></span>
                            </a>
                        ))}
                    </div>

                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <button
                            onClick={toggleTheme}
                            aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
                            className="p-2.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all text-slate-600 dark:text-slate-300 active:scale-90"
                        >
                            {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all text-slate-600 dark:text-slate-300 active:scale-90"
                            >
                                <Globe size={18} />
                                <span className="text-[10px] font-black uppercase">{language}</span>
                            </button>
                            {isLangOpen && (
                                <div className={`absolute top-full mt-4 w-44 glass-morphism rounded-2xl overflow-hidden py-2 shadow-2xl animate-scale-in ${isRTL ? 'left-0' : 'right-0'}`}>
                                    {LANGUAGES.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang.code);
                                                setIsLangOpen(false);
                                            }}
                                            className={`w-full px-5 py-3 text-[10px] font-bold uppercase transition-colors text-slate-600 dark:text-slate-300 hover:bg-brand-primary/10 hover:text-brand-primary dark:hover:bg-brand-success/10 dark:hover:text-brand-success ${isRTL ? 'text-right' : 'text-left'}`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link
                            to="/login"
                            className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-brand-primary hover:text-white dark:hover:bg-brand-primary transition-all active:scale-95"
                        >
                            <User size={14} /> Portal
                        </Link>

                        <Link
                            to="/patient/rendez-vous"
                            className="bg-brand-accent text-white px-7 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all shadow-lg hover:shadow-brand-accent/20 active:scale-95"
                        >
                            {t.nav.bookNow}
                        </Link>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden p-2.5 text-slate-600 dark:text-slate-300 active:scale-90"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-6 right-6 mt-4 glass-morphism rounded-[3rem] p-10 lg:hidden animate-in slide-in-from-top-10 duration-500 shadow-2xl transition-all">
                    <div className={`flex flex-col gap-8 ${isRTL ? 'text-right' : ''}`}>
                        {NAV_ITEMS.map((item) => (
                            <a
                                key={item}
                                href={`/#${item.toLowerCase()}`}
                                onClick={closeMenu}
                                className="text-4xl font-black text-brand-primary dark:text-white tracking-tighter hover:text-brand-accent transition-colors active:scale-95"
                            >
                                {t.nav[item.toLowerCase()]}
                            </a>
                        ))}

                        <hr className="border-brand-primary/10 dark:border-white/10" />

                        <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <button
                                onClick={toggleTheme}
                                className="flex items-center gap-4 text-brand-primary dark:text-white font-black uppercase text-xs active:scale-90 transition-all"
                            >
                                {currentTheme === 'dark' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
                                Theme
                            </button>
                            <button
                                onClick={() => {
                                    const next = language === 'en' ? 'fr' : language === 'fr' ? 'ar' : 'en';
                                    setLanguage(next);
                                }}
                                className="flex items-center gap-4 text-brand-primary dark:text-white font-black uppercase text-xs active:scale-90 transition-all"
                            >
                                <Globe size={20} aria-hidden="true" />
                                {language.toUpperCase()}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Link
                                to="/login"
                                onClick={closeMenu}
                                className="bg-slate-100 dark:bg-brand-primary/20 text-brand-primary dark:text-white py-6 rounded-full text-center font-black uppercase tracking-widest active:scale-95 transition-all"
                            >
                                Portal
                            </Link>
                            <Link
                                to="/patient/rendez-vous"
                                onClick={closeMenu}
                                className="bg-brand-accent text-white py-6 rounded-full text-center font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
                            >
                                {t.nav.bookNow}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
