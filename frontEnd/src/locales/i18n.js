import en from './en';
import fr from './fr';
import ar from './ar';

/**
 * Merged translations object — compatible with LanguageContext.
 * Access like: translations[language].nav.services
 */
export const translations = { en, fr, ar };

/** Default language used when none is set */
export const defaultLanguage = 'fr';

/** All supported language codes */
export const supportedLanguages = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'fr', label: 'Français', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' },
];

export default translations;
