import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import {
    Mail, Lock, Eye, EyeOff, Heart, ArrowRight,
    User, Phone, MapPin, Calendar, Activity,
    AlertCircle, CheckCircle2, Stethoscope, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────
   Reusable Field Components
───────────────────────────────────────────── */
const FloatingInput = ({
    label, type = 'text', value, onChange,
    icon: Icon, required, minLength,
    rightElement, rows
}) => {
    const [focused, setFocused] = useState(false);
    const filled = value?.length > 0;
    const active = focused || filled;

    const baseClass = `
        peer w-full bg-transparent border-2 rounded-xl px-4 pt-6 pb-2 text-sm
        font-medium text-[#1E3A5F] dark:text-white outline-none
        transition-all duration-200 appearance-none
        ${active
            ? 'border-[#2196A6] ring-4 ring-[#2196A6]/10'
            : 'border-slate-200 dark:border-white/10 hover:border-[#2196A6]/50'
        }
        ${Icon ? 'pl-11' : 'pl-4'}
        ${rightElement ? 'pr-12' : 'pr-4'}
    `;

    return (
        <div className="relative group">
            {Icon && (
                <Icon className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${active ? 'text-[#2196A6]' : 'text-slate-300 dark:text-white/20 group-hover:text-[#2196A6]/60'}`} />
            )}
            {rows ? (
                <textarea
                    value={value}
                    onChange={onChange}
                    required={required}
                    rows={rows}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={`${baseClass} resize-none pt-6`}
                    placeholder=" "
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    minLength={minLength}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={baseClass}
                    placeholder=" "
                />
            )}

            {/* Floating Label */}
            <label className={`
                absolute left-${Icon ? '11' : '4'} pointer-events-none font-medium
                transition-all duration-200 select-none
                ${active
                    ? 'top-2 text-[10px] text-[#2196A6] font-semibold tracking-wider uppercase'
                    : 'top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-white/30'
                }
                ${Icon ? 'left-11' : 'left-4'}
            `}>
                {label}
            </label>

            {rightElement && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {rightElement}
                </div>
            )}
        </div>
    );
};

const SelectField = ({ label, value, onChange, options, required }) => {
    const [focused, setFocused] = useState(false);
    const active = focused || value?.length > 0;

    return (
        <div className="relative group">
            <select
                value={value}
                onChange={onChange}
                required={required}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={`
                    w-full bg-transparent border-2 rounded-xl px-4 pt-6 pb-2 text-sm
                    font-medium text-[#1E3A5F] dark:text-white outline-none
                    transition-all duration-200 appearance-none cursor-pointer
                    ${active
                        ? 'border-[#2196A6] ring-4 ring-[#2196A6]/10'
                        : 'border-slate-200 dark:border-white/10 hover:border-[#2196A6]/50'
                    }
                `}
            >
                {options.map(o => (
                    <option key={o.value} value={o.value} className="text-[#1E3A5F]">
                        {o.label}
                    </option>
                ))}
            </select>
            <label className={`
                absolute pointer-events-none font-semibold tracking-wider uppercase
                transition-all duration-200 left-4
                ${active
                    ? 'top-2 text-[10px] text-[#2196A6]'
                    : 'top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-white/30'
                }
            `}>
                {label}
            </label>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   Strength Indicator
───────────────────────────────────────────── */
const PasswordStrength = ({ password }) => {
    const checks = [
        { label: '8+ caractères', pass: password.length >= 8 },
        { label: 'Majuscule', pass: /[A-Z]/.test(password) },
        { label: 'Chiffre', pass: /[0-9]/.test(password) },
    ];
    const score = checks.filter(c => c.pass).length;
    const colors = ['bg-[#C62828]', 'bg-[#F9A825]', 'bg-[#006233]'];
    const labels = ['Faible', 'Moyen', 'Fort'];

    if (!password) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
        >
            <div className="flex gap-1.5">
                {[1, 2, 3].map(i => (
                    <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= score ? colors[score - 1] : 'bg-slate-200 dark:bg-white/10'
                            }`}
                    />
                ))}
            </div>
            <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${score === 3 ? 'text-[#006233]' : score === 2 ? 'text-[#F9A825]' : 'text-[#C62828]'}`}>
                    {labels[score - 1] || ''}
                </span>
                <div className="flex gap-3">
                    {checks.map((c, i) => (
                        <span key={i} className={`text-[10px] flex items-center gap-1 ${c.pass ? 'text-[#006233]' : 'text-slate-400'}`}>
                            <CheckCircle2 className={`w-3 h-3 ${c.pass ? 'opacity-100' : 'opacity-30'}`} />
                            {c.label}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

/* ─────────────────────────────────────────────
   Decorative Background Blobs
───────────────────────────────────────────── */
const Blobs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#2196A6]/8 dark:bg-[#2196A6]/5 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#1E3A5F]/6 dark:bg-[#1E3A5F]/10 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#006233]/4 blur-3xl" />
    </div>
);

/* ─────────────────────────────────────────────
   Step Progress (Register only)
───────────────────────────────────────────── */
const StepDots = ({ current, total }) => (
    <div className="flex items-center gap-2 justify-center mb-5">
        {Array.from({ length: total }, (_, i) => (
            <div
                key={i}
                className={`rounded-full transition-all duration-300 ${i === current
                        ? 'w-6 h-2 bg-[#2196A6]'
                        : i < current
                            ? 'w-2 h-2 bg-[#006233]'
                            : 'w-2 h-2 bg-slate-200 dark:bg-white/15'
                    }`}
            />
        ))}
    </div>
);

/* ─────────────────────────────────────────────
   Main Login Component
───────────────────────────────────────────── */
const Login = () => {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [step, setStep] = useState(0); // 0 = account info, 1 = personal info
    const navigate = useNavigate();

    const [reg, setReg] = useState({
        nom: '', prenom: '', email: '',
        mot_de_passe: '', mot_de_passe_confirmation: '',
        date_naissance: '', sexe: 'M', telephone: '', adresse: ''
    });

    // Reset state on mode switch
    useEffect(() => {
        setError('');
        setSuccess('');
        setStep(0);
    }, [mode]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.get('/sanctum/csrf-cookie');
            await new Promise(r => setTimeout(r, 300));
            const { data } = await axios.post('/api/login', { email, mot_de_passe: password });
            const user = data.user;
            localStorage.setItem('user', JSON.stringify(user));
            const routes = { admin: '/admin/dashboard', doctor: '/doctor/dashboard' };
            navigate(routes[user.type] || routes[user.role] || '/client/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Identifiants invalides. Veuillez réessayer.');
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (step === 0) { setStep(1); return; }

        setLoading(true);
        setError('');
        if (reg.mot_de_passe !== reg.mot_de_passe_confirmation) {
            setError('Les mots de passe ne correspondent pas.');
            setLoading(false);
            return;
        }
        try {
            await axios.get('/sanctum/csrf-cookie');
            await new Promise(r => setTimeout(r, 300));
            const { data } = await axios.post('/api/patient/register', reg);
            if (data.success) {
                setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
                setTimeout(() => { setMode('login'); setEmail(reg.email); }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création du compte.');
        } finally {
            setLoading(false);
        }
    };

    const eyeToggle = (
        <button type="button" onClick={() => setShowPassword(p => !p)}
            className="text-slate-400 hover:text-[#2196A6] transition-colors p-0.5">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
    );

    return (
        <div className="min-h-screen flex flex-col bg-[#f4f7fb] dark:bg-[#0b1829]">

            {/* ── Algerian Gov Banner ── */}
            <div className="hidden md:flex h-9 items-center justify-center relative overflow-hidden shrink-0">
                <div className="absolute inset-0 flex">
                    <div className="w-8 bg-[#006233]" />
                    <div className="flex-1 bg-white dark:bg-white/90" />
                    <div className="w-8 bg-[#D21034]" />
                </div>
                <div className="relative z-10 flex items-center gap-2 text-[11px] font-medium text-[#1E3A5F]">
                    <span className="text-[#006233] text-sm">&#9770;</span>
                    République Algérienne Démocratique et Populaire — Ministère de la Santé
                </div>
            </div>

            {/* ── Page Body ── */}
            <div className="flex flex-1 min-h-0">

                {/* ───── LEFT BRANDING PANEL ───── */}
                <div className="hidden lg:flex lg:w-[45%] relative flex-col overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="src/assets/image_3.png"
                            alt="EHS Dr. Djeghri Mokhtar"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F]/97 via-[#1E3A5F]/85 to-[#2196A6]/50" />
                        {/* Dot pattern overlay */}
                        <div
                            className="absolute inset-0 opacity-[0.04]"
                            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                        />
                    </div>

                    <div className="relative z-10 flex flex-col h-full p-10">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                                <Heart className="w-6 h-6 text-[#C62828] fill-[#C62828]/20" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm leading-tight">EHS Dr. Djeghri Mokhtar</div>
                                <div className="text-white/50 text-xs">Constantine — Algérie</div>
                            </div>
                        </div>

                        {/* Main pitch */}
                        <div className="flex-1 flex flex-col justify-center space-y-8">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
                                    <Stethoscope className="w-3.5 h-3.5 text-[#2196A6]" />
                                    <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Espace Patient Sécurisé</span>
                                </div>
                                <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.15] mb-4">
                                    Votre santé<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2196A6] to-[#64B5F6]">
                                        entre de bonnes mains
                                    </span>
                                </h1>
                                <p className="text-white/60 text-base leading-relaxed max-w-sm">
                                    Gérez vos rendez-vous, consultez vos résultats et suivez votre parcours de soins en toute simplicité.
                                </p>
                            </div>

                            {/* Feature pills */}
                            <div className="space-y-3">
                                {[
                                    { icon: Shield, text: 'Accès sécurisé et confidentiel', color: '#006233' },
                                    { icon: Calendar, text: 'Rendez-vous en ligne 24h/24', color: '#2196A6' },
                                    { icon: Activity, text: 'Suivi médical personnalisé', color: '#F9A825' },
                                ].map((f, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                                        className="flex items-center gap-3 bg-white/7 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm"
                                    >
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: `${f.color}25` }}>
                                            <f.icon className="w-4 h-4" style={{ color: f.color }} />
                                        </div>
                                        <span className="text-sm text-white/75 font-medium">{f.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { val: '80+', label: 'Lits', color: '#2196A6' },
                                { val: '25+', label: 'Années', color: '#006233' },
                                { val: '100%', label: 'Gratuit', color: '#F9A825' },
                            ].map((s, i) => (
                                <div key={i} className="bg-white/8 border border-white/10 rounded-xl py-3 px-2 text-center backdrop-blur-sm">
                                    <div className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</div>
                                    <div className="text-[11px] text-white/50 mt-0.5">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ───── RIGHT FORM PANEL ───── */}
                <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-10 overflow-y-auto relative">
                    <Blobs />

                    <div className="relative z-10 w-full max-w-[440px]">

                        {/* Mobile logo */}
                        <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-[#C62828]/10 flex items-center justify-center">
                                <Heart className="w-5 h-5 text-[#C62828]" />
                            </div>
                            <span className="font-bold text-[#1E3A5F] dark:text-white text-sm">
                                EHS Dr. Djeghri Mokhtar
                            </span>
                        </div>

                        {/* ── Mode Switcher ── */}
                        <div className="flex bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-1.5 rounded-2xl gap-1.5 mb-6 shadow-sm">
                            {[
                                { id: 'login', label: 'Connexion' },
                                { id: 'register', label: 'Inscription' }
                            ].map(({ id, label }) => (
                                <button
                                    key={id}
                                    onClick={() => setMode(id)}
                                    className={`relative flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${mode === id
                                            ? 'text-white shadow-md'
                                            : 'text-slate-400 dark:text-white/30 hover:text-[#1E3A5F] dark:hover:text-white/60'
                                        }`}
                                >
                                    {mode === id && (
                                        <motion.div
                                            layoutId="tab-bg"
                                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#1E3A5F] to-[#2196A6]"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                        />
                                    )}
                                    <span className="relative z-10">{label}</span>
                                </button>
                            ))}
                        </div>

                        {/* ── Card ── */}
                        <div className="bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-xl shadow-[#1E3A5F]/5 dark:shadow-black/20 overflow-hidden">

                            {/* Card Header */}
                            <div className="px-8 pt-8 pb-0">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`${mode}-${step}`}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="mb-6"
                                    >
                                        <h2 className="text-2xl font-bold text-[#1E3A5F] dark:text-white">
                                            {mode === 'login'
                                                ? 'Bon retour ! 👋'
                                                : step === 0
                                                    ? 'Créer un compte'
                                                    : 'Informations personnelles'}
                                        </h2>
                                        <p className="text-slate-400 dark:text-white/40 text-sm mt-1">
                                            {mode === 'login'
                                                ? 'Accédez à votre espace patient sécurisé'
                                                : step === 0
                                                    ? 'Renseignez vos identifiants de connexion'
                                                    : 'Complétez votre profil médical'}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>

                                {mode === 'register' && <StepDots current={step} total={2} />}
                            </div>

                            {/* Form */}
                            <div className="px-8 pb-8">

                                {/* Error / Success Banner */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6, height: 0 }}
                                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                                            exit={{ opacity: 0, y: -6, height: 0 }}
                                            className="flex items-start gap-3 bg-[#C62828]/8 border border-[#C62828]/25 text-[#C62828] text-sm rounded-xl px-4 py-3 mb-5"
                                        >
                                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                            <span>{error}</span>
                                        </motion.div>
                                    )}
                                    {success && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-start gap-3 bg-[#006233]/8 border border-[#006233]/25 text-[#006233] text-sm rounded-xl px-4 py-3 mb-5"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                                            <span>{success}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* ─── LOGIN ─── */}
                                <AnimatePresence mode="wait">
                                    {mode === 'login' && (
                                        <motion.form
                                            key="login-form"
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 30 }}
                                            transition={{ duration: 0.25 }}
                                            onSubmit={handleLogin}
                                            className="space-y-4"
                                        >
                                            <FloatingInput
                                                label="Adresse Email"
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                icon={Mail}
                                                required
                                            />
                                            <FloatingInput
                                                label="Mot de Passe"
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                icon={Lock}
                                                required
                                                rightElement={eyeToggle}
                                            />

                                            <div className="flex justify-end">
                                                <button type="button" className="text-xs text-[#2196A6] hover:underline font-medium">
                                                    Mot de passe oublié ?
                                                </button>
                                            </div>

                                            <motion.button
                                                type="submit"
                                                disabled={loading}
                                                whileHover={{ scale: loading ? 1 : 1.01 }}
                                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                                className="w-full flex items-center justify-center gap-3 py-4 mt-2 bg-gradient-to-r from-[#1E3A5F] to-[#2196A6] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#2196A6]/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {loading ? (
                                                    <span className="flex items-center gap-2">
                                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                        </svg>
                                                        Vérification en cours...
                                                    </span>
                                                ) : (
                                                    <>
                                                        Se connecter
                                                        <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </motion.button>
                                        </motion.form>
                                    )}

                                    {/* ─── REGISTER ─── */}
                                    {mode === 'register' && (
                                        <motion.form
                                            key={`register-step-${step}`}
                                            initial={{ opacity: 0, x: step === 0 ? -30 : 30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: step === 0 ? 30 : -30 }}
                                            transition={{ duration: 0.25 }}
                                            onSubmit={handleRegister}
                                            className="space-y-4"
                                        >
                                            {step === 0 ? (
                                                <>
                                                    {/* Step 0: Account credentials */}
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <FloatingInput
                                                            label="Nom"
                                                            value={reg.nom}
                                                            onChange={e => setReg({ ...reg, nom: e.target.value })}
                                                            icon={User}
                                                            required
                                                        />
                                                        <FloatingInput
                                                            label="Prénom"
                                                            value={reg.prenom}
                                                            onChange={e => setReg({ ...reg, prenom: e.target.value })}
                                                            icon={User}
                                                            required
                                                        />
                                                    </div>
                                                    <FloatingInput
                                                        label="Adresse Email"
                                                        type="email"
                                                        value={reg.email}
                                                        onChange={e => setReg({ ...reg, email: e.target.value })}
                                                        icon={Mail}
                                                        required
                                                    />
                                                    <FloatingInput
                                                        label="Mot de Passe"
                                                        type="password"
                                                        value={reg.mot_de_passe}
                                                        onChange={e => setReg({ ...reg, mot_de_passe: e.target.value })}
                                                        icon={Lock}
                                                        required
                                                        minLength={8}
                                                    />
                                                    <AnimatePresence>
                                                        {reg.mot_de_passe && (
                                                            <PasswordStrength password={reg.mot_de_passe} />
                                                        )}
                                                    </AnimatePresence>
                                                    <FloatingInput
                                                        label="Confirmer le mot de passe"
                                                        type="password"
                                                        value={reg.mot_de_passe_confirmation}
                                                        onChange={e => setReg({ ...reg, mot_de_passe_confirmation: e.target.value })}
                                                        icon={Lock}
                                                        required
                                                        minLength={8}
                                                    />
                                                    {/* Match indicator */}
                                                    <AnimatePresence>
                                                        {reg.mot_de_passe_confirmation && (
                                                            <motion.p
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                className={`text-xs flex items-center gap-1.5 font-medium ${reg.mot_de_passe === reg.mot_de_passe_confirmation
                                                                        ? 'text-[#006233]'
                                                                        : 'text-[#C62828]'
                                                                    }`}
                                                            >
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                {reg.mot_de_passe === reg.mot_de_passe_confirmation
                                                                    ? 'Les mots de passe correspondent'
                                                                    : 'Les mots de passe ne correspondent pas'}
                                                            </motion.p>
                                                        )}
                                                    </AnimatePresence>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Step 1: Personal info */}
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <FloatingInput
                                                            label="Date de naissance"
                                                            type="date"
                                                            value={reg.date_naissance}
                                                            onChange={e => setReg({ ...reg, date_naissance: e.target.value })}
                                                            icon={Calendar}
                                                            required
                                                        />
                                                        <SelectField
                                                            label="Sexe"
                                                            value={reg.sexe}
                                                            onChange={e => setReg({ ...reg, sexe: e.target.value })}
                                                            required
                                                            options={[
                                                                { value: 'M', label: 'Masculin' },
                                                                { value: 'F', label: 'Féminin' }
                                                            ]}
                                                        />
                                                    </div>
                                                    <FloatingInput
                                                        label="Téléphone"
                                                        type="tel"
                                                        value={reg.telephone}
                                                        onChange={e => setReg({ ...reg, telephone: e.target.value })}
                                                        icon={Phone}
                                                        required
                                                    />
                                                    <FloatingInput
                                                        label="Adresse complète"
                                                        value={reg.adresse}
                                                        onChange={e => setReg({ ...reg, adresse: e.target.value })}
                                                        icon={MapPin}
                                                        required
                                                        rows={2}
                                                    />
                                                </>
                                            )}

                                            <div className={`flex gap-3 mt-2 ${step === 1 ? 'flex-row' : ''}`}>
                                                {step === 1 && (
                                                    <motion.button
                                                        type="button"
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={() => setStep(0)}
                                                        className="flex-1 py-4 border-2 border-slate-200 dark:border-white/15 text-[#1E3A5F] dark:text-white font-bold text-sm rounded-2xl hover:border-[#2196A6] hover:text-[#2196A6] transition-all duration-200"
                                                    >
                                                        ← Retour
                                                    </motion.button>
                                                )}
                                                <motion.button
                                                    type="submit"
                                                    disabled={loading}
                                                    whileHover={{ scale: loading ? 1 : 1.01 }}
                                                    whileTap={{ scale: loading ? 1 : 0.98 }}
                                                    className={`flex items-center justify-center gap-3 py-4 bg-gradient-to-r font-bold text-sm text-white rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${step === 0
                                                            ? 'w-full from-[#1E3A5F] to-[#2196A6] shadow-[#2196A6]/20'
                                                            : 'flex-1 from-[#006233] to-[#2196A6] shadow-[#006233]/20'
                                                        }`}
                                                >
                                                    {loading ? (
                                                        <span className="flex items-center gap-2">
                                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                            </svg>
                                                            Création...
                                                        </span>
                                                    ) : (
                                                        <>
                                                            {step === 0 ? 'Continuer' : 'Créer mon compte'}
                                                            <ArrowRight className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </motion.button>
                                            </div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Footer note */}
                        <p className="text-center text-[11px] text-slate-400 dark:text-white/25 mt-5 leading-relaxed">
                            © {new Date().getFullYear()} EHS Dr. Djeghri Mokhtar •{' '}
                            <span className="text-[#2196A6]">Sous tutelle du Ministère de la Santé</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
