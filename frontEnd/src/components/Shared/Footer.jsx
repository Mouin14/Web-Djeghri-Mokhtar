
import { Phone, MapPin, Facebook, Instagram, Linkedin, ExternalLink, Heart } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ASSETS } from '../../constants/images';

const Footer = () => {
    const { language } = useLanguage();
    const isRTL = language === 'ar';

    return (
        <footer id="contact" className="bg-slate-900 dark:bg-brand-surface-dark text-white pt-32 pb-16 transition-colors relative overflow-hidden" role="contentinfo">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-success/50 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6">
                <div className={`grid lg:grid-cols-12 gap-16 mb-24 ${isRTL ? 'direction-rtl text-right' : ''}`}>

                    <div className="lg:col-span-4 space-y-12">
                        <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center p-3 shadow-2xl overflow-hidden group hover:scale-110 transition-transform duration-500">
                                <img src={ASSETS.LOGO} alt="EHS Mokhtar Djaghri Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="leading-tight">
                                <h3 className="text-4xl font-black tracking-tight uppercase">Mokhtar</h3>
                                <p className="text-[10px] font-bold text-brand-success uppercase tracking-[0.4em] opacity-90">Djaghri</p>
                            </div>
                        </div>
                        <p className="text-xl font-medium text-slate-400 dark:text-slate-500 leading-relaxed max-w-sm transition-colors">
                            Algeria&apos;s premier center for cardiovascular excellence, defining the next era of robotic surgery and patient care.
                        </p>
                        <div className={`flex gap-5 ${isRTL ? 'justify-end' : ''}`}>
                            {[
                                { icon: Facebook, label: 'Facebook' },
                                { icon: Instagram, label: 'Instagram' },
                                { icon: Linkedin, label: 'LinkedIn' }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    aria-label={social.label}
                                    className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-brand-primary hover:scale-110 active:scale-95 transition-all border border-white/10 group shadow-xl"
                                >
                                    <social.icon size={24} className="group-hover:rotate-6 transition-transform" aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-success">Units</h4>
                        <ul className="space-y-4">
                            {['Cardiac Surgery', 'Clinical Rehab', 'Diagnostic Unit', 'Pediatrics'].map(l => (
                                <li key={l}><a href="#" className="text-base font-bold text-slate-500 hover:text-white dark:hover:text-brand-success transition-all inline-block">{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-success">Hospital</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Ethical Code', 'Careers', 'Registry Privacy'].map(l => (
                                <li key={l}><a href="#" className="text-base font-bold text-slate-500 hover:text-white dark:hover:text-brand-success transition-all inline-block">{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-4 space-y-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-success">Direct Hub</h4>
                        <div className="space-y-8">
                            <a href="tel:1021" className={`flex items-center gap-6 group active:scale-95 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-brand-success transition-all border border-white/10 shadow-xl">
                                    <Phone size={24} aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Emergency Desk 24/7</p>
                                    <p className="text-2xl font-black tracking-tight group-hover:text-brand-success transition-colors">1021</p>
                                </div>
                            </a>
                            <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 flex-shrink-0">
                                    <MapPin size={24} aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">Physical Landmark</p>
                                    <p className="text-lg font-bold leading-tight">Plateau Mansourah, Constantine, DZ.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-600 dark:text-slate-700">
                    <div className="flex items-center gap-3">
                        <Heart size={14} fill="currentColor" className="text-brand-success animate-pulse" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em]">© 2025 EHS Mokhtar Djaghri.</p>
                    </div>
                    <div className="flex gap-10">
                        <a href="#" className="hover:text-white dark:hover:text-brand-success transition-colors text-[10px] font-bold uppercase tracking-widest">Compliance</a>
                        <a href="#" className="hover:text-white dark:hover:text-brand-success transition-colors text-[10px] font-bold uppercase tracking-widest">Clinical Trials</a>
                        <a href="#" className="hover:text-white dark:hover:text-brand-success transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">Protocol <ExternalLink size={12} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
