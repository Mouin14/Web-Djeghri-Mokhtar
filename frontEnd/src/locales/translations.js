/**
 * translations.js — backward-compatible re-export.
 * The actual content now lives in en.js / fr.js / ar.js.
 * All existing consumers of `{ translations }` keep working unchanged.
 */
export { translations } from './i18n';
export { default } from './i18n';
