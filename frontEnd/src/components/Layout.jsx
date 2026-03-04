

import Navbar from './Shared/Navbar';
import Footer from './Shared/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import BackgroundParticles from './BackgroundParticles';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const { language } = useLanguage();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={`min-h-screen bg-white dark:bg-slate-950 transition-colors duration-700 selection:bg-brand-primary selection:text-white ${language === 'ar' ? 'font-serif' : ''} bg-mesh relative`}>
            <BackgroundParticles />
            <Navbar currentTheme={theme} toggleTheme={toggleTheme} />
            <main className="pt-24 min-h-screen relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;

