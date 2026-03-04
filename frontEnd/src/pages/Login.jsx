import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { User, Mail, Lock, Phone, MapPin, Calendar, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { use3DTilt } from '../hooks/useMouseEffects';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const tilt = use3DTilt(5);

    const [registerData, setRegisterData] = useState({
        nom: '',
        prenom: '',
        email: '',
        mot_de_passe: '',
        mot_de_passe_confirmation: '',
        date_naissance: '',
        sexe: 'M',
        telephone: '',
        adresse: ''
    });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.get('/sanctum/csrf-cookie');
            await new Promise(resolve => setTimeout(resolve, 300));

            const response = await axios.post('/api/login', {
                email: email,
                mot_de_passe: password
            });

            const userData = response.data.user;
            localStorage.setItem('user', JSON.stringify(userData));

            if (userData.type === 'admin' || userData.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (userData.type === 'doctor') {
                navigate('/doctor/dashboard');
            } else if (userData.type === 'patient' || userData.type === 'client') {
                navigate('/client/dashboard');
            } else {
                navigate('/client/dashboard');
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Identifiants invalides. Veuillez réessayer.";
            setError(errorMessage);
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (registerData.mot_de_passe !== registerData.mot_de_passe_confirmation) {
            setError('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        try {
            await axios.get('/sanctum/csrf-cookie');
            await new Promise(resolve => setTimeout(resolve, 300));

            const response = await axios.post('/api/patient/register', registerData);

            if (response.data.success) {
                setEmail(registerData.email);
                setPassword(registerData.mot_de_passe);
                setMode('login');
                setError('');
                alert('Compte créé avec succès! Veuillez vous connecter.');
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erreur lors de la création du compte.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex items-center justify-center p-4 min-h-[70vh]"
        >
            <motion.div
                ref={tilt.ref}
                style={tilt.style}
                onMouseMove={tilt.onMouseMove}
                onMouseLeave={tilt.onMouseLeave}
                className="glass-morphism-premium p-10 rounded-[2.5rem] shadow-2xl w-full max-w-lg relative overflow-hidden preserve-3d border border-white/20"
            >
                {/* Background Glows */}
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand-primary/10 rounded-full blur-[80px]" />
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-brand-success/10 rounded-full blur-[80px]" />

                <div className="text-center mb-10 relative z-10">
                    <motion.h1
                        key={mode}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight"
                    >
                        {mode === 'login' ? 'Bienvenue' : 'Créer un compte'}
                    </motion.h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        {mode === 'login'
                            ? 'Accédez à votre espace patient'
                            : 'Rejoignez notre clinique pour un meilleur suivi'}
                    </p>
                </div>

                <div className="flex mb-10 bg-slate-100/50 dark:bg-white/5 p-1.5 rounded-2xl relative z-10 border border-slate-200/50 dark:border-white/10 backdrop-blur-md">
                    <button
                        onClick={() => { setMode('login'); setError(''); }}
                        className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${mode === 'login'
                            ? 'bg-white dark:bg-slate-800 text-brand-primary dark:text-white shadow-xl scale-[1.02]'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                    >
                        Connexion
                    </button>
                    <button
                        onClick={() => { setMode('register'); setError(''); }}
                        className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${mode === 'register'
                            ? 'bg-white dark:bg-slate-800 text-brand-primary dark:text-white shadow-xl scale-[1.02]'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                    >
                        Inscription
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {mode === 'login' ? (
                        <motion.form
                            key="login"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleLoginSubmit}
                            className="space-y-6 relative z-10"
                        >
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-2xl flex items-center gap-3"
                                >
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <p className="text-red-600 dark:text-red-400 text-xs font-bold leading-tight">{error}</p>
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <div className="group relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors h-5 w-5" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white font-medium"
                                        placeholder="Adresse Email"
                                    />
                                </div>

                                <div className="group relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors h-5 w-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-14 py-4 bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white font-medium"
                                        placeholder="Mot de Passe"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-primary transition-all p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full relative h-[64px] bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:shadow-brand-primary/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    {loading ? 'Traitement...' : (
                                        <>
                                            Se Connecter <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="register"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleRegisterSubmit}
                            className="space-y-4 relative z-10 max-h-[55vh] overflow-y-auto pr-3 custom-scrollbar"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="group relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary h-4 w-4" />
                                    <input
                                        type="text"
                                        value={registerData.nom}
                                        onChange={(e) => setRegisterData({ ...registerData, nom: e.target.value })}
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white text-sm font-medium"
                                        placeholder="Nom"
                                    />
                                </div>
                                <div className="group relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary h-4 w-4" />
                                    <input
                                        type="text"
                                        value={registerData.prenom}
                                        onChange={(e) => setRegisterData({ ...registerData, prenom: e.target.value })}
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white text-sm font-medium"
                                        placeholder="Prénom"
                                    />
                                </div>
                            </div>

                            <div className="group relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary h-4 w-4" />
                                <input
                                    type="email"
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white text-sm font-medium"
                                    placeholder="Email"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="group relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary h-4 w-4" />
                                    <input
                                        type="password"
                                        value={registerData.mot_de_passe}
                                        onChange={(e) => setRegisterData({ ...registerData, mot_de_passe: e.target.value })}
                                        required
                                        minLength={8}
                                        className="w-full pl-11 pr-4 py-3.5 bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white text-sm font-medium"
                                        placeholder="Passe"
                                    />
                                </div>
                                <div className="group relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary h-4 w-4" />
                                    <input
                                        type="password"
                                        value={registerData.mot_de_passe_confirmation}
                                        onChange={(e) => setRegisterData({ ...registerData, mot_de_passe_confirmation: e.target.value })}
                                        required
                                        minLength={8}
                                        className="w-full pl-11 pr-4 py-3.5 bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white text-sm font-medium"
                                        placeholder="Confirmer"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="group relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary h-4 w-4" />
                                    <input
                                        type="date"
                                        value={registerData.date_naissance}
                                        onChange={(e) => setRegisterData({ ...registerData, date_naissance: e.target.value })}
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white text-sm font-medium"
                                    />
                                </div>
                                <select
                                    value={registerData.sexe}
                                    onChange={(e) => setRegisterData({ ...registerData, sexe: e.target.value })}
                                    required
                                    className="w-full px-4 py-3.5 bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white text-sm font-bold"
                                >
                                    <option value="M">Masculin</option>
                                    <option value="F">Féminin</option>
                                </select>
                            </div>

                            <div className="group relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary h-4 w-4" />
                                <input
                                    type="tel"
                                    value={registerData.telephone}
                                    onChange={(e) => setRegisterData({ ...registerData, telephone: e.target.value })}
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white text-sm font-medium"
                                    placeholder="Téléphone"
                                />
                            </div>

                            <div className="group relative">
                                <MapPin className="absolute left-4 top-4 text-slate-400 group-focus-within:text-brand-primary h-4 w-4" />
                                <textarea
                                    value={registerData.adresse}
                                    onChange={(e) => setRegisterData({ ...registerData, adresse: e.target.value })}
                                    required
                                    rows={2}
                                    className="w-full pl-11 pr-4 py-4 bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all dark:text-white text-sm font-medium resize-none"
                                    placeholder="Adresse complète"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-[60px] bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-brand-primary transition-all active:scale-95 mt-4 flex items-center justify-center gap-3"
                            >
                                {loading ? 'Création...' : (
                                    <>
                                        Créer mon compte <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default Login;
