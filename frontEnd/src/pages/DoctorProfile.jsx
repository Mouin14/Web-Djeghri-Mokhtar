import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Stethoscope, ShieldCheck, Lock, Save } from 'lucide-react';

const DoctorProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        specialite: '',
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const fetchProfile = useCallback(async () => {
        try {
            const response = await axios.get('/api/doctor/profile');
            if (response.data.success) {
                const data = response.data.data;
                setProfile(data);
                setFormData({
                    prenom: data.prenom || '',
                    nom: data.nom || '',
                    email: data.email,
                    telephone: data.telephone || '',
                    specialite: data.specialite || '',
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: '',
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (error.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');
        setSuccessMessage('');

        if (formData.new_password && formData.new_password !== formData.new_password_confirmation) {
            setFormError('Les mots de passe ne correspondent pas');
            setFormLoading(false);
            return;
        }

        if (formData.new_password && !formData.current_password) {
            setFormError('Veuillez entrer votre mot de passe actuel');
            setFormLoading(false);
            return;
        }

        try {
            const dataToSend = {
                prenom: formData.prenom,
                nom: formData.nom,
                email: formData.email,
                telephone: formData.telephone,
                specialite: formData.specialite,
            };

            if (formData.new_password) {
                dataToSend.current_password = formData.current_password;
                dataToSend.new_password = formData.new_password;
                dataToSend.new_password_confirmation = formData.new_password_confirmation;
            }

            const response = await axios.put('/api/doctor/profile', dataToSend);

            if (response.data.success) {
                setSuccessMessage('Profil mis à jour avec succès');
                setProfile(response.data.data);
                setFormData(prev => ({
                    ...prev,
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: '',
                }));

                const userData = localStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    user.email = response.data.data.email;
                    user.nom = response.data.data.nom;
                    user.prenom = response.data.data.prenom;
                    localStorage.setItem('user', JSON.stringify(user));
                }
            }
        } catch (error) {
            setFormError(error.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="glass-morphism-premium rounded-[2.5rem] p-8 md:p-10 border border-white/40 dark:border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <User className="w-32 h-32 text-emerald-500" />
                </div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="p-5 bg-emerald-500/10 rounded-2xl">
                        <User className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Mon Profil</h1>
                        <p className="text-sm font-medium text-slate-500 dark:text-gray-300">Gérez vos informations et sécurisez votre compte</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Summary Card */}
                <div className="lg:col-span-4">
                    <div className="glass-morphism-premium rounded-[2.5rem] p-10 border border-white/40 dark:border-white/5 shadow-2xl">
                        <div className="flex flex-col items-center mb-10">
                            <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                {profile?.prenom?.charAt(0)}{profile?.nom?.charAt(0)}
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                                Dr. {profile?.prenom} {profile?.nom}
                            </h2>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <Stethoscope className="w-3 h-3" /> {profile?.specialite || 'Médecin'}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-6 rounded-[2rem] bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-emerald-500/10">
                                        <Mail className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Email</p>
                                        <p className="font-bold truncate">{profile?.email}</p>
                                    </div>
                                </div>
                            </div>
                            {profile?.telephone && (
                                <div className="p-6 rounded-[2rem] bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-teal-500/10">
                                            <Phone className="w-5 h-5 text-teal-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Téléphone</p>
                                            <p className="font-bold">{profile.telephone}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-8">
                    <div className="glass-morphism-premium rounded-[2.5rem] p-10 border border-white/40 dark:border-white/5 shadow-2xl">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-4">
                            <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
                            Modifier mes informations
                        </h2>

                        <AnimatePresence mode="wait">
                            {formError && (
                                <motion.div
                                    key="error"
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
                                    key="success"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-8 p-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl flex items-center gap-4"
                                >
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-800/30 rounded-lg">
                                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <p className="text-emerald-700 dark:text-emerald-300 text-sm font-bold">{successMessage}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Personal Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 ml-4">
                                        Prénom
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.prenom}
                                            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all dark:text-white font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 ml-4">
                                        Nom
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.nom}
                                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all dark:text-white font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 ml-4">
                                        Adresse Email
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="w-full pl-14 pr-6 py-4 bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all dark:text-white font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 ml-4">
                                        Téléphone
                                    </label>
                                    <div className="relative group">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            type="tel"
                                            value={formData.telephone}
                                            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4 bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all dark:text-white font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 ml-4">
                                    Spécialité
                                </label>
                                <div className="relative group">
                                    <Stethoscope className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.specialite}
                                        onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                                        maxLength={100}
                                        placeholder="ex: Cardiologie"
                                        className="w-full pl-14 pr-6 py-4 bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all dark:text-white font-bold"
                                    />
                                </div>
                            </div>

                            {/* Password Section */}
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
                                                className="w-full px-6 py-4 bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all dark:text-white font-bold"
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
                                                className="w-full px-6 py-4 bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all dark:text-white font-bold"
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
                                    className="group bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl shadow-emerald-500/30 active:scale-95 flex items-center gap-3 disabled:opacity-50"
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
        </div>
    );
};

export default DoctorProfile;
