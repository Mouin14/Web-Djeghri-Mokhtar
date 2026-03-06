import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import {
    Calendar,
    Search,
    Edit2,
    Trash2,
    X,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronLeft,
    Check,
    FileText,
    Image as ImageIcon
} from 'lucide-react';



const AppointmentsManagement = () => {
    const navigate = useNavigate();
    const [rendezVous, setRendezVous] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRdv, setEditingRdv] = useState(null);
    const [formData, setFormData] = useState({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        status: 'pending',
        reason: ''
    });
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [dossiers, setDossiers] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');


    const fetchRendezVous = useCallback(async () => {
        try {
            const response = await axios.get('/api/admin/rendez-vous');
            setRendezVous(Array.isArray(response.data.data) ? response.data.data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('user');
                navigate('/login');
            }
            setLoading(false);
        }
    }, [navigate]);

    const fetchPatients = useCallback(async () => {
        try {
            const response = await axios.get('/api/admin/select/patients');
            setPatients(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    }, []);

    const fetchDoctors = useCallback(async () => {
        try {
            const response = await axios.get('/api/admin/select/doctors');
            setDoctors(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    }, []);


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

        fetchRendezVous();
        fetchPatients();
        fetchDoctors();
    }, [navigate, fetchRendezVous, fetchPatients, fetchDoctors]);


    const openCreateModal = () => {
        setEditingRdv(null);
        setFormData({
            patient_id: '',
            doctor_id: '',
            appointment_date: '',
            appointment_time: '',
            status: 'pending',
            reason: ''
        });
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = async (rdv) => {
        setEditingRdv(rdv);
        setFormData({
            patient_id: rdv.patient_id.toString(),
            doctor_id: rdv.doctor_id ? rdv.doctor_id.toString() : '',
            appointment_date: rdv.appointment_date || '',
            appointment_time: rdv.appointment_time || '',
            status: rdv.status,
            reason: rdv.reason || ''
        });
        setFormError('');
        setDossiers([]);
        setShowModal(true);

        // Fetch full details including records if appointment is confirmed
        if (rdv.status === 'confirmed' || rdv.status === 'completed') {
            setLoadingDetails(true);
            try {
                const response = await axios.get(`/api/admin/rendez-vous/${rdv.id}`);
                if (response.data.success && response.data.data.records) {
                    setDossiers(response.data.data.records);
                }
            } catch (error) {
                console.error('Error fetching records:', error);
            } finally {
                setLoadingDetails(false);
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingRdv(null);
        setFormData({
            patient_id: '',
            doctor_id: '',
            appointment_date: '',
            appointment_time: '',
            status: 'pending',
            reason: ''
        });
        setFormError('');
        setDossiers([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');

        try {
            if (editingRdv) {
                await axios.put(`/api/admin/rendez-vous/${editingRdv.id}`, formData);
            } else {
                await axios.post('/api/admin/rendez-vous', formData);
            }

            await fetchRendezVous();
            closeModal();
        } catch (error) {
            setFormError(error.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous?')) {
            return;
        }

        try {
            await axios.delete(`/api/admin/rendez-vous/${id}`);
            await fetchRendezVous();
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de la suppression');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getStatutBadgeDetails = (status) => {
        switch (status) {
            case 'pending':
                return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: Clock, label: 'En attente' };
            case 'confirmed':
                return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: CheckCircle, label: 'Confirmé' };
            case 'cancelled':
                return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: XCircle, label: 'Annulé' };
            case 'completed':
                return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: CheckCircle, label: 'Complété' };
            default:
                return { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300', icon: AlertCircle, label: status };
        }
    };

    const filteredRendezVous = rendezVous.filter(rdv =>
        (rdv.patient_last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rdv.patient_first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rdv.doctor_last_name && rdv.doctor_last_name.toLowerCase().includes(searchTerm.toLowerCase()))
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
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Gestion des Rendez-vous</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Supervision des consultations</p>
                            </div>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="bg-brand-primary hover:bg-brand-primary-dark text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/20 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <Calendar className="w-4 h-4" />
                            <span className="hidden sm:inline">Nouveau RDV</span>
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
                        placeholder="Rechercher par patient ou médecin..."
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
                                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-primary dark:text-brand-primary-light uppercase tracking-wider">Patient</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-primary dark:text-brand-primary-light uppercase tracking-wider">Médecin</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-primary dark:text-brand-primary-light uppercase tracking-wider">Date & Heure</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-primary dark:text-brand-primary-light uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-brand-primary dark:text-brand-primary-light uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-primary/5 dark:divide-white/5">
                                {filteredRendezVous.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            Aucun rendez-vous trouvé.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRendezVous.map((rdv) => {
                                        const status = getStatutBadgeDetails(rdv.status);
                                        const StatusIcon = status.icon;
                                        return (
                                            <tr key={rdv.id} className="hover:bg-brand-primary/5 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                                                            {(rdv.patient_first_name || '?')[0]}{(rdv.patient_last_name || '?')[0]}
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="text-sm font-bold text-gray-900 dark:text-white">
                                                                {rdv.patient_first_name} {rdv.patient_last_name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {rdv.doctor_id ? (
                                                        <div className="text-sm text-gray-900 dark:text-white">
                                                            Dr. {rdv.doctor_first_name} {rdv.doctor_last_name}
                                                            <span className="block text-xs text-brand-primary dark:text-brand-primary-light">{rdv.doctor_specialty}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                            Non assigné
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 dark:text-white font-medium">
                                                        {rdv.appointment_date ? formatDate(rdv.appointment_date) : <span className="text-gray-400 italic">À définir</span>}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {rdv.appointment_time ? rdv.appointment_time.substring(0, 5) : ''}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => openEditModal(rdv)}
                                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3 transition-colors"
                                                        title="Modifier / Détails"
                                                    >
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(rdv.id)}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {editingRdv ? <Edit2 className="w-5 h-5 text-brand-primary" /> : <Calendar className="w-5 h-5 text-brand-primary" />}
                                {editingRdv ? 'Modifier Rendez-vous' : 'Nouveau Rendez-vous'}
                            </h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {formError && (
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                                        {formError}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Patient *</label>
                                        <select
                                            value={formData.patient_id}
                                            onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                        >
                                            <option value="">Sélectionner un patient</option>
                                            {patients.map(patient => (
                                                <option key={patient.id} value={patient.id}>
                                                    {patient.full_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Médecin</label>
                                        <select
                                            value={formData.doctor_id}
                                            onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                        >
                                            <option value="">-- Non assigné (En attente) --</option>
                                            {doctors.map(doctor => (
                                                <option key={doctor.id} value={doctor.id}>
                                                    {doctor.full_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date *</label>
                                        <input
                                            type="date"
                                            value={formData.appointment_date}
                                            onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Heure *</label>
                                        <input
                                            type="time"
                                            value={formData.appointment_time}
                                            onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Statut *</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                        >
                                            <option value="pending">En attente</option>
                                            <option value="confirmed">Confirmé</option>
                                            <option value="cancelled">Annulé</option>
                                            <option value="completed">Complété</option>
                                        </select>
                                    </div>
                                </div>

                                {formData.status === 'cancelled' && editingRdv?.cancellation_reason && (
                                    <div className="col-span-2 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800/20">
                                        <label className="block text-sm font-medium text-red-700 dark:text-red-400 mb-1">
                                            Motif d&apos;annulation (par le médecin)
                                        </label>
                                        <p className="text-sm text-red-800 dark:text-red-300">{editingRdv.cancellation_reason}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Motif *</label>
                                    <textarea
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        required
                                        maxLength={1000}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                    />
                                    <p className="text-xs text-right text-gray-500 mt-1">{formData.reason.length}/1000</p>
                                </div>

                                {/* Medical Records Section */}
                                {editingRdv && (editingRdv.status === 'confirmed' || editingRdv.status === 'completed') && (
                                    <div className="pt-6 border-t border-gray-100 dark:border-gray-700 animate-fade-in">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-brand-primary" /> Dossiers Médicaux Associés
                                        </h3>

                                        {loadingDetails ? (
                                            <div className="flex justify-center p-4">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                                            </div>
                                        ) : dossiers.length === 0 ? (
                                            <div className="text-center py-6 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                                <p className="text-gray-500 dark:text-gray-400">Aucun dossier médical pour ce rendez-vous.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {dossiers.map((dossier) => (
                                                    <div key={dossier.id} className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <p className="text-sm font-bold text-brand-primary dark:text-brand-primary-light">
                                                                    Dr. {dossier.doctor_first_name} {dossier.doctor_last_name}
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">{dossier.created_at}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-800 dark:text-gray-200 mb-3 whitespace-pre-wrap">{dossier.notes}</p>

                                                        {dossier.attachments && dossier.attachments.length > 0 && (
                                                            <div className="flex flex-wrap gap-2">
                                                                {dossier.attachments.map((file) => (
                                                                    <a
                                                                        key={file.id}
                                                                        href={file.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium hover:border-brand-primary transition-colors"
                                                                    >
                                                                        {file.file_type === 'pdf' ? (
                                                                            <FileText className="w-3.5 h-3.5 text-red-500" />
                                                                        ) : (
                                                                            <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                                                                        )}
                                                                        <span className="truncate max-w-[150px]">{file.original_name}</span>
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="flex-1 px-6 py-3 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary-dark shadow-lg shadow-brand-primary/20 transition-all disabled:opacity-50"
                                    >
                                        {formLoading ? 'Enregistrement...' : <span className="flex items-center justify-center gap-2"><Check className="w-5 h-5" /> Enregistrer</span>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentsManagement;
