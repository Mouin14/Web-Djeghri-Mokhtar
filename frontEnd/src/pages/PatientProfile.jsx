import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, ShieldCheck, Lock, ArrowLeft, Save, LogOut } from 'lucide-react';


const PatientProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        telephone: '',
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('/api/patient/profile');
            if (response.data.success) {
                setProfile(response.data.data);
                setFormData({
                    email: response.data.data.email,
                    telephone: response.data.data.telephone || '',
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');
        setSuccessMessage('');

        // Validate passwords match
        if (formData.new_password && formData.new_password !== formData.new_password_confirmation) {
            setFormError('Les mots de passe ne correspondent pas');
            setFormLoading(false);
            return;
        }

        // Validate current password is provided if new password is set
        if (formData.new_password && !formData.current_password) {
            setFormError('Veuillez entrer votre mot de passe actuel');
            setFormLoading(false);
            return;
        }

        try {
            const dataToSend = {
                email: formData.email,
                telephone: formData.telephone,
            };

            // Only include password fields if user wants to change password
            if (formData.new_password) {
                dataToSend.current_password = formData.current_password;
                dataToSend.new_password = formData.new_password;
                dataToSend.new_password_confirmation = formData.new_password_confirmation;
            }

            const response = await axios.put('/api/patient/profile', dataToSend);

            if (response.data.success) {
                setSuccessMessage('Profil mis à jour avec succès');
                setProfile(response.data.data);

                // Clear password fields
                setFormData({
                    ...formData,
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: ''
                });

                // Update localStorage if email changed
                const userData = localStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    user.email = response.data.data.email;
                    localStorage.setItem('user', JSON.stringify(user));
                }
            }
        } catch (error) {
            setFormError(error.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setFormLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('user');
            navigate('/login');
        }
    };



    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 selection:bg-brand-primary/20">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[120px] animate-pulse-subtle"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-success/5 rounded-full blur-[120px] animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                >
                    {/* Compact Modern Header */}
                    <div className="glass-morphism-premium rounded-[2.5rem] p-8 md:p-10 border border-white/40 dark:border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <User className="w-32 h-32 text-brand-primary" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-6">
                                <div className="p-5 bg-brand-primary/10 rounded-2xl">
                                    <User className="w-10 h-10 text-brand-primary" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Mon Profil</h1>
                                    <p className="text-sm font-medium text-slate-500 dark:text-gray-300">Gérez vos informations personnelles et sécurisez votre compte</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/client/dashboard')}
                                    className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95"
                                >
                                    <ArrowLeft size={16} /> Retour
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-95"
                                >
                                    <LogOut size={16} /> Déconnexion
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Profile Summary Card */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="glass-morphism-premium rounded-[2.5rem] p-10 border border-white/40 dark:border-white/5 shadow-2xl relative overflow-hidden group">
                                <div className="flex flex-col items-center mb-10">
                                    <div className="w-28 h-28 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                        {profile?.prenom?.charAt(0)}{profile?.nom?.charAt(0)}
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                                        {profile?.prenom} {profile?.nom}
                                    </h2>
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-success/10 border border-brand-success/20 text-brand-success text-[10px] font-black uppercase tracking-[0.2em]">
                                        Verified Patient
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-6 rounded-[2rem] bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-brand-primary/10">
                                                <Mail className="w-5 h-5 text-brand-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Email</p>
                                                <p className="font-bold truncate">{profile?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-[2rem] bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-brand-success/10">
                                                <Phone className="w-5 h-5 text-brand-success" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Phone</p>
                                                <p className="font-bold">{profile?.telephone || 'Non renseigné'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Form Card */}
                        <div className="lg:col-span-8">
                            <div className="glass-morphism-premium rounded-[2.5rem] p-10 border border-white/40 dark:border-white/5 shadow-2xl">
                                <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-4">
                                    <div className="w-1.5 h-8 bg-brand-primary rounded-full"></div>
                                    Modifier mes informations
                                </h2>

                                <AnimatePresence mode="wait">
                                    {formError && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mb-8 p-5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-2xl flex items-center gap-4"
                                        >
                                            <div className="p-2 bg-red-100 rounded-lg">
                                                <ShieldCheck className="w-5 h-5 text-red-600" />
                                            </div>
                                            <p className="text-red-700 dark:text-red-300 text-sm font-bold">{formError}</p>
                                        </motion.div>
                                    )}

                                    {successMessage && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mb-8 p-5 bg-brand-success/10 border border-brand-success/20 rounded-2xl flex items-center gap-4"
                                        >
                                            <div className="p-2 bg-brand-success/20 rounded-lg">
                                                <ShieldCheck className="w-5 h-5 text-brand-success" />
                                            </div>
                                            <p className="text-brand-success text-sm font-bold">{successMessage}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSubmit} className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 ml-4">
                                                Email Address
                                            </label>
                                            <div className="relative group">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-300 group-focus-within:text-brand-primary transition-colors" />
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    required
                                                    className="w-full pl-14 pr-6 py-4 bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all dark:text-white font-bold"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 ml-4">
                                                Phone Number
                                            </label>
                                            <div className="relative group">
                                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-300 group-focus-within:text-brand-success transition-colors" />
                                                <input
                                                    type="tel"
                                                    value={formData.telephone}
                                                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                                    maxLength={20}
                                                    className="w-full pl-14 pr-6 py-4 bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-brand-success/10 outline-none transition-all dark:text-white font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-10 border-t border-slate-200 dark:border-white/10">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Sécurité du Compte</h3>
                                                <p className="text-sm font-medium text-slate-500 dark:text-gray-300">Modifiez votre mot de passe seulement si nécessaire</p>
                                            </div>
                                            <div className="p-3 bg-slate-100 dark:bg-white/10 rounded-2xl">
                                                <Lock className="w-6 h-6 text-slate-400 dark:text-gray-300" />
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 ml-4">
                                                    Mot de passe actuel
                                                </label>
                                                <input
                                                    type="password"
                                                    value={formData.current_password}
                                                    onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                                                    className="w-full px-6 py-4 bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-slate-100 dark:focus:ring-white/5 outline-none transition-all dark:text-white font-bold"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 ml-4">
                                                        Nouveau mot de passe
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={formData.new_password}
                                                        onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                                                        minLength={8}
                                                        className="w-full px-6 py-4 bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all dark:text-white font-bold"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 ml-4">
                                                        Confirmer le nouveau
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={formData.new_password_confirmation}
                                                        onChange={(e) => setFormData({ ...formData, new_password_confirmation: e.target.value })}
                                                        minLength={8}
                                                        className="w-full px-6 py-4 bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all dark:text-white font-bold"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-6">
                                        <button
                                            type="submit"
                                            disabled={formLoading}
                                            className="group bg-brand-primary hover:bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl shadow-brand-primary/30 active:scale-95 flex items-center gap-3 disabled:opacity-50"
                                        >
                                            {formLoading ? 'Mise à jour...' : (
                                                <>
                                                    Sauvegarder <Save size={18} className="group-hover:scale-110 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PatientProfile;
