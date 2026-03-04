import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import axios from '../lib/axios';
import { ASSETS } from '../constants/images';
import {
    LayoutDashboard,
    Calendar,
    User as UserIcon,
    LogOut,
    Shield,
    ArrowRight,
    HeartPulse,
    Menu,
    X,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';
import PatientAppointments from './PatientAppointments';
import PatientProfile from './PatientProfile';

const ActionCard = ({ icon: Icon, title, subtitle, onClick, color, navigateText }) => {
    const colorClasses = {
        blue: {
            bg: "bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-brand-primary group-hover:text-white",
            accent: "bg-blue-500/10",
            text: "text-brand-primary dark:text-brand-success"
        },
        purple: {
            bg: "bg-purple-50/50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white",
            accent: "bg-purple-500/10",
            text: "text-purple-600 dark:text-purple-400"
        }
    };
    const c = colorClasses[color];

    return (
        <button
            onClick={onClick}
            className={`glass-morphism p-8 rounded-[2rem] text-left transition-all duration-500 group relative overflow-hidden shadow-lg hover:shadow-2xl border border-white/40 dark:border-white/5 w-full`}
        >
            <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${c.accent}`}></div>
            <div className="relative z-10 flex flex-col h-full">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-all duration-500 group-hover:rotate-6 ${c.bg}`}>
                    <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                    <h4 className="text-xl font-black text-contrast-heading mb-2 tracking-tight">{title}</h4>
                    <p className="text-sm font-medium text-contrast-body mb-6 leading-relaxed">{subtitle}</p>
                </div>
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-3 transition-all ${c.text}`}>
                    {navigateText}
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </button>
    );
};


const ClientDashboard = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isRTL = language === 'ar';

    const sidebarItems = [
        { id: 'dashboard', label: 'Tableau de Bord', icon: <LayoutDashboard size={20} /> },
        { id: 'rendez-vous', label: 'Mes Rendez-vous', icon: <Calendar size={20} /> },
        { id: 'profile', label: 'Mon Profil', icon: <UserIcon size={20} /> },
    ];

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (error) {
                console.error("Failed to parse user data:", error);
                localStorage.removeItem('user');
                navigate('/login');
            }
            setLoading(false);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = useCallback(async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('user');
            navigate('/login');
        }
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-surface-light dark:bg-brand-surface-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-500 overflow-x-hidden ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-80 bg-white dark:bg-slate-900 border-r border-brand-primary/5 dark:border-white/5 transition-transform duration-300 transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')}`}>
                <div className="h-full flex flex-col p-8">
                    {/* Sidebar Header */}
                    <div className={`flex items-center justify-between mb-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2 overflow-hidden border border-brand-primary/10">
                                <img src={ASSETS.LOGO} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className={isRTL ? 'text-right' : ''}>
                                <h1 className="font-black text-xl tracking-tighter text-brand-primary dark:text-white uppercase">Espace</h1>
                                <p className="text-[10px] font-black text-brand-secondary dark:text-brand-accent uppercase tracking-widest">Patient</p>
                            </div>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-brand-primary dark:text-white"><X size={24} /></button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-3">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-full font-black text-[11px] uppercase tracking-widest transition-all ${isRTL ? 'flex-row-reverse text-right' : ''} ${activeTab === item.id
                                    ? 'bg-brand-primary text-white shadow-lg scale-[1.02]'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-white hover:bg-brand-primary/5 dark:hover:bg-white/5'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="mt-auto space-y-4">
                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-full font-black text-[11px] uppercase tracking-widest bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                        >
                            <LogOut size={20} />
                            Déconnexion
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className={`glass-morphism h-24 flex items-center justify-between px-8 md:px-12 sticky top-0 z-40 border-b border-brand-primary/10 dark:border-white/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-12 h-12 flex items-center justify-center bg-brand-primary/5 rounded-2xl text-brand-primary dark:text-white">
                            <Menu size={24} />
                        </button>
                    </div>

                    <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-4 border-slate-200 dark:border-white/10 ${isRTL ? 'border-r pr-6' : 'border-l pl-6'}`}>
                            <div className={`${isRTL ? 'text-left' : 'text-right'} hidden sm:block`}>
                                <p className="text-sm font-black text-slate-800 dark:text-white">{user?.prenom} {user?.nom}</p>
                                <p className="text-[10px] font-black text-brand-primary dark:text-brand-accent uppercase tracking-widest">Patient</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-md">
                                {user?.prenom?.[0]}{user?.nom?.[0]}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-12"
                            >
                                {/* Welcome Hero */}
                                <div className="grid lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-8">
                                        <div className="bg-slate-900 dark:bg-brand-primary-dark rounded-[2rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl border border-white/5">
                                            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                                            <div className={`relative z-10 flex flex-col md:flex-row justify-between items-start gap-10 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                                                <div className={isRTL ? 'text-right' : ''}>
                                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-brand-accent text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                                                        <Shield size={14} /> Compte Vérifié
                                                    </div>
                                                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">
                                                        Bonjour, <br /><span className="text-brand-accent">{user?.prenom}</span> 👋
                                                    </h2>
                                                    <p className="text-slate-300 font-medium max-w-sm leading-relaxed text-lg">
                                                        Bienvenue sur votre espace santé. Gérez vos rendez-vous et consultez vos informations.
                                                    </p>
                                                </div>
                                                <div className={`bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[1.5rem] flex items-center gap-6 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                                    <div className="w-16 h-16 bg-brand-accent text-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                                                        <HeartPulse size={32} className="animate-pulse" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Statut</p>
                                                        <p className="text-2xl font-black">Actif</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Action Cards */}
                                        <div className="grid sm:grid-cols-2 gap-8">
                                            <ActionCard
                                                icon={Calendar}
                                                title="Mes Rendez-vous"
                                                subtitle="Planifiez vos consultations médicales"
                                                color="blue"
                                                onClick={() => setActiveTab('rendez-vous')}
                                                navigateText="Accéder"
                                            />
                                            <ActionCard
                                                icon={UserIcon}
                                                title="Mon Profil"
                                                subtitle="Mettez à jour vos informations"
                                                color="purple"
                                                onClick={() => setActiveTab('profile')}
                                                navigateText="Gérer"
                                            />
                                        </div>
                                    </div>

                                    {/* Info Sidebar */}
                                    <div className="space-y-8">
                                        <div className="bg-white dark:bg-slate-900 p-10 rounded-[1.5rem] shadow-lg border border-brand-primary/5 dark:border-white/5 h-full">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Mes Informations</h3>
                                            <div className="space-y-6">
                                                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                    <div className="p-3 rounded-xl bg-brand-primary/10"><Mail className="w-5 h-5 text-brand-primary" /></div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</p>
                                                        <p className="font-bold text-slate-800 dark:text-white truncate">{user?.email}</p>
                                                    </div>
                                                </div>
                                                {user?.profile?.telephone && (
                                                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                        <div className="p-3 rounded-xl bg-brand-success/10"><Phone className="w-5 h-5 text-brand-success" /></div>
                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Téléphone</p>
                                                            <p className="font-bold text-slate-800 dark:text-white">{user?.profile?.telephone}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {user?.profile?.adresse && (
                                                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800"><MapPin className="w-5 h-5 text-slate-600 dark:text-slate-400" /></div>
                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Adresse</p>
                                                            <p className="font-bold text-slate-800 dark:text-white line-clamp-2">{user?.profile?.adresse}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setActiveTab('profile')}
                                                className="w-full mt-8 bg-brand-primary text-white py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all shadow-md"
                                            >
                                                Modifier mon profil
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Banner */}
                                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 border border-brand-primary/5 dark:border-white/5 shadow-lg relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                        <Shield className="w-32 h-32 text-brand-success" />
                                    </div>
                                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                                        <div className="p-5 bg-brand-success/10 rounded-2xl">
                                            <Shield className="w-10 h-10 text-brand-success" />
                                        </div>
                                        <div className="max-w-xl">
                                            <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2">Confidentialité & Sécurité Premium</h4>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                                Vos données médicales sont sécurisées par un chiffrement de pointe. Protection totale de votre vie privée.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'rendez-vous' && (
                            <motion.div
                                key="rendez-vous"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <PatientAppointments />
                            </motion.div>
                        )}

                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <PatientProfile />
                            </motion.div>
                        )}


                    </AnimatePresence>
                </div>
            </main>

            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default ClientDashboard;
