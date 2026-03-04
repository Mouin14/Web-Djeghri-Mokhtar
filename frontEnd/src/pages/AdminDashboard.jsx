import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosLib from 'axios';
import axios from '../lib/axios';
import {
    LayoutDashboard,
    Users,
    UserPlus,
    Calendar,
    Activity,
    LogOut,
    Shield,
    Settings,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import DoctorsManagement from './DoctorsManagement';
import PatientsManagement from './PatientsManagement';
import AppointmentsManagement from './AppointmentsManagement';
import AdminProfile from './AdminProfile';
import PatientSearchBar from '../components/PatientSearchBar';

const StatCard = ({ icon: Icon, title, value, color, onClick, navigateText }) => {
    const colorClasses = {
        blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
        green: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
        purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
    };

    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-slate-900 rounded-[1.5rem] p-6 relative overflow-hidden group cursor-pointer hover:shadow-2xl transition-all border border-brand-primary/5 dark:border-white/5 shadow-lg"
        >
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-all transform group-hover:scale-110">
                <Icon className={`w-24 h-24 ${color === 'blue' ? 'text-blue-500' : color === 'green' ? 'text-emerald-500' : 'text-purple-500'}`} />
            </div>
            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{title}</p>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{value}</h3>
                <div className={`flex items-center mt-4 text-sm font-bold ${color === 'blue' ? 'text-blue-700 dark:text-blue-400' : color === 'green' ? 'text-emerald-700 dark:text-emerald-400' : 'text-purple-700 dark:text-purple-400'}`}>
                    {navigateText} <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        todayAppointments: 0
    });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isRTL = language === 'ar';

    const sidebarItems = [
        { id: 'dashboard', label: 'Tableau de Bord', icon: <LayoutDashboard size={20} /> },
        { id: 'medecins', label: 'Médecins', icon: <UserPlus size={20} /> },
        { id: 'patients', label: 'Patients', icon: <Users size={20} /> },
        { id: 'rendez-vous', label: 'Rendez-vous', icon: <Calendar size={20} /> },
    ];

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            if (parsedUser.role !== 'admin' && parsedUser.type !== 'admin') {
                navigate('/login');
                return;
            }
        } else {
            navigate('/login');
            return;
        }

        axios.get('/api/dashboard/stats')
            .then(response => {
                setStats(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching stats:', error);
                if (axiosLib.isAxiosError(error) && error.response?.status === 401) {
                    localStorage.removeItem('user');
                    navigate('/login');
                }
                setLoading(false);
            });
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
                            <div className="w-12 h-12 bg-brand-primary dark:bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Shield size={24} />
                            </div>
                            <div className={isRTL ? 'text-right' : ''}>
                                <h1 className="font-black text-xl tracking-tighter text-brand-primary dark:text-white uppercase">Admin</h1>
                                <p className="text-[10px] font-black text-brand-secondary dark:text-brand-accent uppercase tracking-widest">Panneau de Contrôle</p>
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
                                    ? 'bg-brand-primary text-white shadow-lg scale-[1.02]'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-white hover:bg-brand-primary/5 dark:hover:bg-white/5'
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
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-full font-black text-[11px] uppercase tracking-widest transition-all ${isRTL ? 'flex-row-reverse text-right' : ''} ${activeTab === 'settings' ? 'bg-brand-primary text-white shadow-lg scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:text-brand-primary dark:hover:text-white hover:bg-brand-primary/5 dark:hover:bg-white/5'}`}
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
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-12 h-12 flex items-center justify-center bg-brand-primary/5 rounded-2xl text-brand-primary dark:text-white">
                            <Menu size={24} />
                        </button>
                        <PatientSearchBar />
                    </div>

                    <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-4 border-slate-200 dark:border-white/10 ${isRTL ? 'border-r pr-6' : 'border-l pl-6'}`}>
                            <div className={`${isRTL ? 'text-left' : 'text-right'} hidden sm:block`}>
                                <p className="text-sm font-black text-slate-800 dark:text-white">{user?.prenom} {user?.nom || 'Administrateur'}</p>
                                <p className="text-[10px] font-black text-brand-primary dark:text-brand-accent uppercase tracking-widest">Système</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-md">
                                <Shield size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                    {activeTab === 'dashboard' && (
                        <div className="animate-fade-in space-y-10">
                            {/* Welcome Banner */}
                            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-700 p-8 md:p-12 text-white shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                                <div className="relative z-10">
                                    <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase">
                                        Panneau de <span className="text-blue-200">Contrôle</span>
                                    </h2>
                                    <p className="text-blue-100 text-lg max-w-2xl font-medium">
                                        Supervisez l&apos;activité de la clinique, gérez les utilisateurs et suivez les indicateurs clés.
                                    </p>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <StatCard
                                    icon={Users}
                                    title="Total Patients"
                                    value={stats.totalPatients}
                                    color="blue"
                                    onClick={() => setActiveTab('patients')}
                                    navigateText="Gérer les patients"
                                />
                                <StatCard
                                    icon={UserPlus}
                                    title="Médecins Actifs"
                                    value={stats.totalDoctors}
                                    color="green"
                                    onClick={() => setActiveTab('medecins')}
                                    navigateText="Gérer le personnel"
                                />
                                <StatCard
                                    icon={Calendar}
                                    title="Total Rendez-vous"
                                    value={stats.totalAppointments}
                                    color="purple"
                                    onClick={() => setActiveTab('rendez-vous')}
                                    navigateText="Voir le planning"
                                />
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-brand-primary/5 dark:border-white/5 shadow-lg">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                            <Activity className="w-5 h-5 text-brand-primary" />
                                            Activité Récente
                                        </h3>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-center text-slate-500 dark:text-slate-400 text-sm">
                                        Aucune activité récente à afficher.
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-brand-primary/5 dark:border-white/5 shadow-lg">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                            <Settings className="w-5 h-5 text-brand-primary" />
                                            Configuration Rapide
                                        </h3>
                                    </div>
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => setActiveTab('medecins')}
                                            className="w-full text-left p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-3 group"
                                        >
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                                <UserPlus className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 dark:text-white group-hover:text-brand-primary transition-colors">Ajouter un Médecin</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Créer un nouveau compte praticien</p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
                                        </button>

                                        <button
                                            onClick={() => setActiveTab('rendez-vous')}
                                            className="w-full text-left p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-3 group"
                                        >
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 dark:text-white group-hover:text-brand-primary transition-colors">Planning Général</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Voir la disponibilité de la clinique</p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'medecins' && (
                        <div className="animate-fade-in">
                            <DoctorsManagement />
                        </div>
                    )}

                    {activeTab === 'patients' && (
                        <div className="animate-fade-in">
                            <PatientsManagement />
                        </div>
                    )}

                    {activeTab === 'rendez-vous' && (
                        <div className="animate-fade-in">
                            <AppointmentsManagement />
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="animate-fade-in">
                            <AdminProfile />
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

export default AdminDashboard;
