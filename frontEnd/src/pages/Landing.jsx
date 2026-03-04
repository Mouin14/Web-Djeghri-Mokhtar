import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const floatVariants = {
        animate: {
            y: [0, -10, 0],
            rotate: [0, 2, 0, -2, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            className="relative flex flex-col items-center justify-center min-h-[80vh] text-center p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                variants={floatVariants}
                animate="animate"
                className="card-3d inline-flex items-center justify-center w-32 h-32 bg-white/10 glass-morphism rounded-[2.5rem] shadow-2xl mb-10 transform transition-transform duration-500"
            >
                <svg className="w-20 h-20 text-brand-primary dark:text-brand-success filter drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </motion.div>

            <motion.h1
                variants={itemVariants}
                className="text-6xl md:text-8xl font-black text-brand-primary-dark dark:text-white mb-6 drop-shadow-sm tracking-tight relative z-10"
            >
                Clinique <span className="text-gradient">Cardio</span>
            </motion.h1>

            <motion.p
                variants={itemVariants}
                className="text-2xl md:text-3xl text-brand-secondary dark:text-brand-primary-light mb-6 font-medium relative z-10"
            >
                Système de Gestion Médicale Avancé
            </motion.p>

            <motion.p
                variants={itemVariants}
                className="text-lg text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed relative z-10"
            >
                Bienvenue sur notre plateforme. Connectez-vous pour accéder à vos rendez-vous, gérer votre dossier médical et communiquer avec vos médecins.
            </motion.p>

            <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-6 relative z-10"
            >
                <button
                    onClick={() => navigate('/login')}
                    className="group relative bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-lg hover:shadow-brand-primary/20 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 overflow-hidden"
                >
                    <span className="relative z-10">Se Connecter</span>
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl relative z-10"
            >
                {[
                    {
                        title: "Rendez-vous en ligne",
                        desc: "Prenez rendez-vous 24/7 en quelques clics avec une interface intuitive.",
                        icon: "📅"
                    },
                    {
                        title: "Dossier Médical",
                        desc: "Accédez à votre historique médical sécurisé et complet n'importe où.",
                        icon: "🔒"
                    },
                    {
                        title: "Suivi Personnalisé",
                        desc: "Restez en contact constant avec votre cardiologue pour un suivi optimal.",
                        icon: "👨‍⚕️"
                    }
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="glass-morphism p-8 rounded-3xl hover:bg-white/40 dark:hover:bg-white/10 transition-all duration-500 text-left border border-white/20"
                    >
                        <div className="text-4xl mb-4">{item.icon}</div>
                        <h3 className="font-bold text-xl text-brand-primary dark:text-brand-success mb-3">{item.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default Landing;
