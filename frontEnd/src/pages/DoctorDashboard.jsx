import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import {
    LayoutDashboard,
    Clock,
    Users,
    Calendar,
    Activity,
    LogOut,
    Stethoscope,
    Settings,
    Phone,
    Mail,
    Award,
    Menu,
    X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import DoctorPendingRequests from './DoctorPendingRequests';
import DoctorMyAppointments from './DoctorMyAppointments';
import DoctorProfile from './DoctorProfile';
import DoctorPlanning from './DoctorPlanning';
import PatientSearchBar from '../components/PatientSearchBar';


const DoctorDashboard = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isRTL = language === 'ar';

    const sidebarItems = [
        { id: 'dashboard', label: 'Tableau de Bord', icon: <LayoutDashboard size={20} /> },
        { id: 'demandes', label: 'Demandes', icon: <Clock size={20} /> },
        { id: 'patients', label: 'Mes Patients', icon: <Users size={20} /> },
        { id: 'planning', label: 'Planning', icon: <Calendar size={20} /> },
    ];

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setLoading(false);
            if (parsedUser.type !== 'doctor') {
                navigate('/login');
            }
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
                    <div className={`flex items-center justify-between mb-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Stethoscope size={24} />
                            </div>
                            <div className={isRTL ? 'text-right' : ''}>
                                <h1 className="font-black text-xl tracking-tighter text-brand-primary dark:text-white uppercase">Espace</h1>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Médecin</p>
                            </div>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-brand-primary dark:text-white"><X size={24} /></button>
                    </div>

                    <nav className="flex-1 space-y-3">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-full font-black text-[11px] uppercase tracking-widest transition-all ${isRTL ? 'flex-row-reverse text-right' : ''} ${activeTab === item.id
                                    ? 'bg-emerald-500 text-white shadow-lg scale-[1.02]'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-white hover:bg-emerald-500/5 dark:hover:bg-white/5'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto space-y-4">
                        <button
                            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-full font-black text-[11px] uppercase tracking-widest transition-all ${isRTL ? 'flex-row-reverse text-right' : ''} ${activeTab === 'settings' ? 'bg-emerald-500 text-white shadow-lg scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-white hover:bg-emerald-500/5 dark:hover:bg-white/5'}`}
                        >
                            <Settings size={20} />
                            Paramètres
                        </button>
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
                <header className={`glass-morphism sticky top-0 z-40 h-24 flex items-center justify-between px-8 md:px-12 border-b border-brand-primary/10 dark:border-white/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-12 h-12 flex items-center justify-center bg-emerald-500/5 rounded-2xl text-emerald-600 dark:text-white">
                            <Menu size={24} />
                        </button>
                        <PatientSearchBar accentColor="emerald-500" />
                    </div>

                    <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-4 border-slate-200 dark:border-white/10 ${isRTL ? 'border-r pr-6' : 'border-l pl-6'}`}>
                            <div className={`${isRTL ? 'text-left' : 'text-right'} hidden sm:block`}>
                                <p className="text-sm font-black text-slate-800 dark:text-white">Dr. {user?.prenom} {user?.nom}</p>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{user?.profile?.specialite || 'Médecin'}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-md">
                                Dr
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                    {activeTab === 'dashboard' && (
                        <div className="animate-fade-in space-y-10">
                            {/* Welcome Card */}
                            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-500 to-teal-600 p-8 md:p-12 text-white shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                                <div className={`relative z-10 ${isRTL ? 'text-right' : ''}`}>
                                    <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase">
                                        Bonjour, <span className="text-emerald-100">Dr. {user?.nom}</span> 👋
                                    </h2>
                                    <p className="text-emerald-50 text-lg max-w-2xl font-medium">
                                        Gérez vos consultations, suivez vos patients et organisez votre emploi du temps médical.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Quick Navigation */}
                                <div className="lg:col-span-2 space-y-6">
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-emerald-500" />
                                        Activités
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <button
                                            onClick={() => setActiveTab('demandes')}
                                            className="bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] text-left hover:shadow-2xl transition-all group relative overflow-hidden border border-brand-primary/5 dark:border-white/5 shadow-lg"
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                                <Clock className="w-24 h-24 text-orange-500" />
                                            </div>
                                            <div className="relative z-10">
                                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                                                    <Clock className="w-6 h-6" />
                                                </div>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Demandes</h4>
                                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Consultations en attente</p>
                                                    </div>
                                                    <span className="bg-orange-100 text-orange-900 border border-orange-200 text-xs font-bold px-2 py-1 rounded-lg">Action requise</span>
                                                </div>
                                                <div className="flex items-center text-sm font-bold text-orange-600 dark:text-orange-400">
                                                    Voir les demandes <Activity className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setActiveTab('patients')}
                                            className="bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] text-left hover:shadow-2xl transition-all group relative overflow-hidden border border-brand-primary/5 dark:border-white/5 shadow-lg"
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                                <Users className="w-24 h-24 text-emerald-500" />
                                            </div>
                                            <div className="relative z-10">
                                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                                    <Users className="w-6 h-6" />
                                                </div>
                                                <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Mes Patients</h4>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Historique et dossiers</p>
                                                <div className="flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                    Accéder aux dossiers <Activity className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Today's Planning */}
                                    <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] p-6 border border-brand-primary/5 dark:border-white/5 shadow-lg">
                                        <h4 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-brand-primary" />
                                            Planning Aujourd&apos;hui
                                        </h4>
                                        <div className="text-center py-8 text-slate-500 dark:text-slate-400 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                            <p>Aucun rendez-vous prévu pour le moment.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Doctor Profile Card */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                        <Award className="w-5 h-5 text-brand-primary" />
                                        Profil Médecin
                                    </h3>

                                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-brand-primary/5 dark:border-white/5 shadow-lg relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                                        <div className="flex flex-col items-center text-center mb-6 relative z-10">
                                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-3">
                                                Dr
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-800 dark:text-white">
                                                Dr. {user?.prenom} {user?.nom}
                                            </h4>
                                            <p className="text-sm font-medium text-brand-primary dark:text-brand-accent bg-brand-primary/10 px-3 py-1 rounded-full mt-1">
                                                {user?.profile?.specialite || 'Médecin Généraliste'}
                                            </p>
                                        </div>

                                        <div className="space-y-4 relative z-10">
                                            <div className="flex items-center gap-3 text-sm p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                                                    <p className="font-medium text-slate-800 dark:text-white truncate">{user?.email}</p>
                                                </div>
                                            </div>

                                            {user?.profile?.telephone && (
                                                <div className="flex items-center gap-3 text-sm p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">Téléphone</p>
                                                        <p className="font-medium text-slate-800 dark:text-white">{user.profile.telephone}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {user?.profile?.numero_ordre && (
                                                <div className="flex items-center gap-3 text-sm p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                    <Award className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">Numéro d&apos;Ordre</p>
                                                        <p className="font-medium text-slate-800 dark:text-white">{user.profile.numero_ordre}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'demandes' && (
                        <div className="animate-fade-in">
                            <DoctorPendingRequests />
                        </div>
                    )}

                    {activeTab === 'patients' && (
                        <div className="animate-fade-in">
                            <DoctorMyAppointments />
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="animate-fade-in">
                            <DoctorProfile />
                        </div>
                    )}

                    {activeTab === 'planning' && (
                        <div className="animate-fade-in">
                            <DoctorPlanning />
                        </div>
                    )}
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

export default DoctorDashboard;
