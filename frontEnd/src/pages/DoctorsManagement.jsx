import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosLib from 'axios';
import axios from '../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';

import {
    UserPlus,
    Search,
    Edit2,
    Trash2,
    X,
    Phone,
    Mail,
    Shield,
    ChevronLeft,
    Check,
    ArrowLeft,
    ArrowRight,
    Info,
    ShieldCheck,
    LayoutDashboard
} from 'lucide-react';



const DoctorsManagement = () => {
    const navigate = useNavigate();
    const [medecins, setMedecins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMedecin, setEditingMedecin] = useState(null);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        mot_de_passe: '',
        specialite: '',
        telephone: '',
        numero_ordre: ''
    });
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const isStepValid = () => {
        switch (step) {
            case 1: return !!formData.nom && !!formData.prenom;
            case 2: {
                const isEmailValid = !!formData.email && formData.email.includes('@');
                const isPasswordValid = editingMedecin ? true : (!!formData.mot_de_passe && formData.mot_de_passe.length >= 8);
                return isEmailValid && isPasswordValid && !!formData.numero_ordre;
            }
            case 3: return !!formData.telephone && !!formData.specialite;
            default: return false;
        }
    };

    const fetchMedecins = useCallback(async () => {
        try {
            const response = await axios.get('/api/admin/medecins');
            setMedecins(Array.isArray(response.data.data) ? response.data.data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            if (axiosLib.isAxiosError(error) && error.response?.status === 401) {
                localStorage.removeItem('user');
                navigate('/login');
            }
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);

            if (parsedUser.role !== 'admin' && parsedUser.type !== 'admin') {
                navigate('/login');
                return;
            }
        } else {
            navigate('/login');
            return;
        }

        fetchMedecins();
    }, [navigate, fetchMedecins]);


    const openCreateModal = () => {
        setEditingMedecin(null);
        setFormData({
            nom: '',
            prenom: '',
            email: '',
            mot_de_passe: '',
            specialite: '',
            telephone: '',
            numero_ordre: ''
        });
        setFormError('');
        setStep(1);
        setShowModal(true);
    };

    const openEditModal = (medecin) => {
        setEditingMedecin(medecin);
        setFormData({
            nom: medecin.nom,
            prenom: medecin.prenom,
            email: medecin.email,
            mot_de_passe: '',
            specialite: medecin.specialite,
            telephone: medecin.telephone,
            numero_ordre: medecin.numero_ordre.toString()
        });
        setFormError('');
        setStep(1);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingMedecin(null);
        setFormData({
            nom: '',
            prenom: '',
            email: '',
            mot_de_passe: '',
            specialite: '',
            telephone: '',
            numero_ordre: ''
        });
        setFormError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');

        try {
            const dataToSend = {
                ...formData,
                numero_ordre: Number(formData.numero_ordre)
            };
            if (editingMedecin && !dataToSend.mot_de_passe) {
                delete dataToSend.mot_de_passe;
            }

            if (editingMedecin) {
                await axios.put(`/api/admin/medecins/${editingMedecin.id}`, dataToSend);
            } else {
                await axios.post('/api/admin/medecins', dataToSend);
            }

            await fetchMedecins();
            closeModal();
        } catch (error) {
            console.error('Error saving doctor:', error);
            let message = 'Une erreur est survenue';
            if (axiosLib.isAxiosError(error) && error.response?.data?.message) {
                message = error.response.data.message;
            }
            setFormError(message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce médecin?')) {
            return;
        }

        try {
            await axios.delete(`/api/admin/medecins/${id}`);
            await fetchMedecins();
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de la suppression');
        }
    };

    const filteredMedecins = medecins.filter(medecin =>
        medecin.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medecin.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medecin.specialite.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-surface-light dark:bg-brand-surface-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <div className="glass-morphism sticky top-0 z-30 border-b border-brand-primary/10 dark:border-white/10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/admin/dashboard')}
                                className="p-2 hover:bg-brand-primary/10 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Gestion des Médecins</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Administration du personnel médical</p>
                            </div>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="bg-brand-primary hover:bg-brand-primary-dark text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/20 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span className="hidden sm:inline">Ajouter Médecin</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                {/* Search Bar */}
                <div className="mb-6 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher par nom, prénom ou spécialité..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary sm:text-sm transition-all shadow-sm"
                    />
                </div>

                {/* Table */}
                <div className="glass-morphism rounded-3xl border border-white/50 dark:border-white/10 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-brand-primary/10 dark:border-white/10 bg-brand-primary/5 dark:bg-white/5">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-primary dark:text-brand-primary-light uppercase tracking-wider">Médecin</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-primary dark:text-brand-primary-light uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-primary dark:text-brand-primary-light uppercase tracking-wider">Spécialité</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-primary dark:text-brand-primary-light uppercase tracking-wider">N° Ordre</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-brand-primary dark:text-brand-primary-light uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-primary/5 dark:divide-white/5">
                                {filteredMedecins.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            Aucun médecin trouvé.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMedecins.map((medecin) => (
                                        <tr key={medecin.id} className="hover:bg-brand-primary/5 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-brand-primary/10 dark:bg-white/10 rounded-full flex items-center justify-center text-brand-primary dark:text-brand-primary-light font-bold">
                                                        {medecin.prenom[0]}{medecin.nom[0]}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                                                            Dr. {medecin.prenom} {medecin.nom}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                                    <Mail className="w-3 h-3 text-gray-400" /> {medecin.email}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-0.5">
                                                    <Phone className="w-3 h-3 text-gray-400" /> {medecin.telephone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                    {medecin.specialite}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                #{medecin.numero_ordre}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => openEditModal(medecin)}
                                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3 transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(medecin.id)}
                                                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-500">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="glass-morphism-premium rounded-[3.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-white/40 dark:border-white/10"
                        >
                            {/* Modal Header */}
                            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                                        {editingMedecin ? <ShieldCheck size={32} /> : <UserPlus size={32} />}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                            {editingMedecin ? 'Update Physician' : 'Physician Onboarding'}
                                        </h2>
                                        <p className="text-xs font-bold text-slate-400 dark:text-slate-200 uppercase tracking-widest mt-1">
                                            {step === 1 && 'Clinical Identity Protocol'}
                                            {step === 2 && 'Security & System Credentials'}
                                            {step === 3 && 'Specialization & Contact'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-95 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Stepper */}
                            <div className="grid grid-cols-3 border-b border-slate-100 dark:border-slate-800">
                                {[1, 2, 3].map((s) => (
                                    <div key={s} className={`p-6 text-center transition-colors ${step === s ? 'bg-brand-primary/5 dark:bg-brand-primary/10' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-black transition-all ${step >= s ? 'bg-brand-primary text-white scale-110 shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                            {step > s ? <Check size={16} /> : s}
                                        </div>
                                        <p className={`text-[9px] font-black uppercase tracking-widest ${step >= s ? 'text-brand-primary' : 'text-slate-400'}`}>
                                            {s === 1 && 'Identity'}
                                            {s === 2 && 'Security'}
                                            {s === 3 && 'Specialty'}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-10 overflow-y-auto custom-scrollbar flex-1">
                                <form onSubmit={(e) => { e.preventDefault(); if (step === 3) handleSubmit(e); else nextStep(); }} className="space-y-10">
                                    {formError && (
                                        <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-2xl flex items-center gap-4 animate-pulse">
                                            <Shield size={20} className="text-red-600 flex-shrink-0" />
                                            <p className="text-red-700 dark:text-red-400 text-xs font-black uppercase tracking-widest">{formError}</p>
                                        </div>
                                    )}

                                    <AnimatePresence mode="wait">
                                        {step === 1 && (
                                            <motion.div
                                                key="step1"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                                            >
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">Nom *</label>
                                                    <input
                                                        type="text"
                                                        value={formData.nom}
                                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                                        required
                                                        placeholder="DOE"
                                                        autoComplete="family-name"
                                                        className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 focus:border-brand-primary rounded-[2rem] outline-none transition-all text-slate-900 dark:text-white font-medium shadow-inner"
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">Prénom *</label>
                                                    <input
                                                        type="text"
                                                        value={formData.prenom}
                                                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                                        required
                                                        placeholder="John"
                                                        autoComplete="given-name"
                                                        className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 focus:border-brand-primary rounded-[2rem] outline-none transition-all text-slate-900 dark:text-white font-medium shadow-inner"
                                                    />
                                                </div>
                                                <div className="col-span-full p-8 glass-morphism-premium rounded-[2.5rem] bg-brand-primary/5 border border-brand-primary/10 flex gap-6 items-center">
                                                    <Info size={28} className="text-brand-primary flex-shrink-0" />
                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed uppercase tracking-tight">
                                                        Ensure the physician&apos;s legal name matches their medical registry entry for synchronization.
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}

                                        {step === 2 && (
                                            <motion.div
                                                key="step2"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-8"
                                            >
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">Email Address *</label>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        required
                                                        placeholder="john.doe@hospital.com"
                                                        autoComplete="email"
                                                        className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 focus:border-brand-primary rounded-[2rem] outline-none transition-all text-slate-900 dark:text-white font-medium shadow-inner"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <label className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">
                                                            N° Ordre *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.numero_ordre}
                                                            onChange={(e) => setFormData({ ...formData, numero_ordre: e.target.value })}
                                                            required
                                                            placeholder="123456"
                                                            className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 focus:border-brand-primary rounded-[2rem] outline-none transition-all text-slate-900 dark:text-white font-medium shadow-inner"
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <label className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">
                                                            System Password {!editingMedecin && '*'}
                                                        </label>
                                                        <input
                                                            type="password"
                                                            value={formData.mot_de_passe}
                                                            onChange={(e) => setFormData({ ...formData, mot_de_passe: e.target.value })}
                                                            required={!editingMedecin}
                                                            minLength={8}
                                                            placeholder={editingMedecin ? "Keep empty to preserve" : "min. 8 characters"}
                                                            autoComplete="new-password"
                                                            className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 focus:border-brand-primary rounded-[2rem] outline-none transition-all text-slate-900 dark:text-white font-medium shadow-inner"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {step === 3 && (
                                            <motion.div
                                                key="step3"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-8"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <label className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">Specialization *</label>
                                                        <input
                                                            type="text"
                                                            value={formData.specialite}
                                                            onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                                                            required
                                                            placeholder="Cardiologist"
                                                            className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 focus:border-brand-primary rounded-[2rem] outline-none transition-all text-slate-900 dark:text-white font-medium shadow-inner"
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <label className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">Direct Phone *</label>
                                                        <input
                                                            type="tel"
                                                            value={formData.telephone}
                                                            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                                            required
                                                            placeholder="+213..."
                                                            autoComplete="tel"
                                                            className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 focus:border-brand-primary rounded-[2rem] outline-none transition-all text-slate-900 dark:text-white font-medium shadow-inner"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="bg-brand-primary/5 dark:bg-brand-primary/10 p-10 rounded-[3rem] border border-brand-primary/10">
                                                    <h3 className="text-xs font-black text-brand-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                                        <LayoutDashboard size={16} /> Dashboard Injection Preview
                                                    </h3>
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-20 h-20 bg-brand-primary/20 rounded-[1.5rem] flex items-center justify-center text-brand-primary font-black text-2xl uppercase shadow-lg">
                                                            {formData.prenom[0]}{formData.nom[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">{formData.prenom} {formData.nom}</p>
                                                            <p className="text-xs font-black text-brand-primary uppercase tracking-widest mt-1">{formData.specialite || 'Field not set'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex gap-6 pt-4 mt-auto">
                                        {step > 1 && (
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="flex-1 py-7 border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <ArrowLeft size={16} /> Back
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={!isStepValid() || (step === 3 && formLoading)}
                                            className="flex-[2] py-7 bg-brand-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {step === 3 ? (formLoading ? 'Synchronizing...' : (editingMedecin ? 'Update System' : 'Authorize Physician')) : 'Next Protocol'}
                                            {step < 3 && <ArrowRight size={16} />}
                                            {step === 3 && !formLoading && <Check size={16} />}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DoctorsManagement;
