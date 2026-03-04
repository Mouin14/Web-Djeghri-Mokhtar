import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosLib from 'axios';
import axios from '../lib/axios';
import {
    Clock,
    Eye,
    X,
    Check,
    User,
    Phone,
    Mail,
    Image as ImageIcon,
    ChevronLeft,
    AlertCircle,
    XCircle
} from 'lucide-react';
import CancelModal from '../components/appointments/doctor/CancelModal';

const DoctorPendingRequests = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [acceptData, setAcceptData] = useState({
        appointment_date: '',
        appointment_time: ''
    });
    const [acceptLoading, setAcceptLoading] = useState(false);
    const [acceptError, setAcceptError] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelLoading, setCancelLoading] = useState(false);

    const fetchPendingRequests = useCallback(async () => {
        try {
            const response = await axios.get('/api/doctor/pending-requests');
            if (response.data.success) {
                setRequests(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching pending requests:', error);
            if (axiosLib.isAxiosError(error) && error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchPendingRequests();
    }, [fetchPendingRequests]);

    const viewDetails = useCallback(async (id) => {
        try {
            const response = await axios.get(`/api/doctor/pending-requests/${id}`);
            if (response.data.success) {
                setSelectedRequest(response.data.data);
                setShowDetailsModal(true);
            }
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    }, []);

    const openAcceptModal = useCallback(() => {
        setShowDetailsModal(false);
        setShowAcceptModal(true);
        setAcceptData({
            appointment_date: '',
            appointment_time: ''
        });
        setAcceptError('');
    }, []);

    const openCancelModal = useCallback(() => {
        setCancelReason('');
        setShowDetailsModal(false);
        setShowCancelModal(true);
    }, []);

    const handleCancel = useCallback(async (e) => {
        e.preventDefault();
        if (!selectedRequest) return;
        setCancelLoading(true);
        try {
            await axios.post(`/api/doctor/appointments/${selectedRequest.id}/cancel`, {
                cancellation_reason: cancelReason,
            });
            setShowCancelModal(false);
            setCancelReason('');
            setSelectedRequest(null);
            await fetchPendingRequests();
        } catch (error) {
            console.error('Error cancelling request:', error);
        } finally {
            setCancelLoading(false);
        }
    }, [selectedRequest, cancelReason, fetchPendingRequests]);

    const handleAccept = async (e) => {
        e.preventDefault();
        if (!selectedRequest) return;

        setAcceptLoading(true);
        setAcceptError('');

        try {
            await axios.post(`/api/doctor/pending-requests/${selectedRequest.id}/accept`, acceptData);
            setShowAcceptModal(false);
            setSelectedRequest(null);
            await fetchPendingRequests();
            // Optional: Success Toast
        } catch (error) {
            if (axiosLib.isAxiosError(error)) {
                setAcceptError(error.response?.data?.message || 'Une erreur est survenue');
            } else {
                setAcceptError('Une erreur est survenue');
            }
        } finally {
            setAcceptLoading(false);
        }
    };

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
                                onClick={() => navigate('/doctor/dashboard')}
                                className="p-2 hover:bg-brand-primary/10 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Demandes en Attente</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-300">Nouvelles consultations requises</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="glass-morphism rounded-2xl p-6 border border-white/50 dark:border-white/10 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Clock className="w-16 h-16 text-orange-500" />
                        </div>
                        <p className="text-sm font-medium text-contrast-body">Total Demandes</p>
                        <p className="text-3xl font-bold text-contrast-heading mt-2">{requests.length}</p>
                    </div>
                    <div className="glass-morphism rounded-2xl p-6 border border-white/50 dark:border-white/10 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <AlertCircle className="w-16 h-16 text-blue-500" />
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Action Requise</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{requests.length}</p>
                    </div>
                </div>

                {/* Table */}
                <div className="glass-morphism rounded-3xl border border-white/50 dark:border-white/10 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-brand-primary/10 dark:border-white/10 bg-brand-primary/5 dark:bg-white/5">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-primary dark:text-brand-primary-light uppercase tracking-wider">Patient</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-primary dark:text-brand-primary-light uppercase tracking-wider">Motif</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-primary dark:text-brand-primary-light uppercase tracking-wider">Images</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-primary dark:text-brand-primary-light uppercase tracking-wider">Date Demande</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-primary dark:text-brand-primary-light uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-primary/5 dark:divide-white/5">
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-contrast-muted">
                                            Aucune demande en attente.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((request) => (
                                        <tr key={request.id} className="hover:bg-brand-primary/5 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-contrast-heading">
                                                    {request.patient_first_name} {request.patient_last_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-contrast-body max-w-[200px] truncate">
                                                    {request.reason}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {request.images_count > 0 ? (
                                                    <span className="inline-flex items-center gap-1 text-sm text-brand-primary dark:text-brand-primary-light font-medium">
                                                        <ImageIcon className="w-4 h-4" />
                                                        {request.images_count}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-contrast-muted">
                                                    {request.created_at}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => viewDetails(request.id)}
                                                    className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                                                >
                                                    <Eye className="w-4 h-4" /> Voir
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

            {/* Modals Container */}
            {(showDetailsModal || showAcceptModal || showCancelModal) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => {
                        setShowDetailsModal(false);
                        setShowAcceptModal(false);
                        setShowCancelModal(false);
                    }}></div>

                    {/* Details Modal */}
                    {showDetailsModal && selectedRequest && (
                        <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Détails de la Demande</h2>
                                <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-6">
                                {/* Patient Contact Card */}
                                <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/20">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-contrast-heading">
                                                {selectedRequest.patient_first_name} {selectedRequest.patient_last_name}
                                            </h3>
                                            <p className="text-sm text-contrast-muted">Demandeur</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-xl border border-blue-100 dark:border-blue-800/30">
                                            <Phone className="w-4 h-4 text-blue-500" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-contrast-muted">Téléphone</p>
                                                <p className="text-sm font-medium text-contrast-heading truncate">{selectedRequest.patient_phone || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-xl border border-blue-100 dark:border-blue-800/30">
                                            <Mail className="w-4 h-4 text-blue-500" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-contrast-muted">Email</p>
                                                <p className="text-sm font-medium text-contrast-heading truncate" title={selectedRequest.patient_email}>{selectedRequest.patient_email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-contrast-muted uppercase tracking-wider mb-2">Motif</h4>
                                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-contrast-body">
                                        {selectedRequest.reason}
                                    </div>
                                </div>

                                {selectedRequest.images.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4" /> Images
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedRequest.images.map((image) => (
                                                <a
                                                    key={image.id}
                                                    href={image.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group relative aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                                                >
                                                    <img
                                                        src={image.url}
                                                        alt="Examen"
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Eye className="w-8 h-8 text-white" />
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 flex-wrap">
                                    <button
                                        onClick={() => setShowDetailsModal(false)}
                                        className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Fermer
                                    </button>
                                    <button
                                        onClick={openCancelModal}
                                        className="px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" /> Refuser le RDV
                                    </button>
                                    <button
                                        onClick={openAcceptModal}
                                        className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        <Check className="w-4 h-4" /> Accepter le RDV
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cancel Modal */}
                    {showCancelModal && selectedRequest && (
                        <CancelModal
                            appointment={selectedRequest}
                            cancelReason={cancelReason}
                            setCancelReason={setCancelReason}
                            cancelLoading={cancelLoading}
                            onSubmit={handleCancel}
                            onClose={() => setShowCancelModal(false)}
                        />
                    )}

                    {/* Accept Modal */}
                    {showAcceptModal && selectedRequest && (
                        <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Confirmer le Rendez-vous</h2>
                                <button onClick={() => setShowAcceptModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleAccept} className="p-6 space-y-6">
                                {acceptError && (
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                                        {acceptError}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Date prévue <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={acceptData.appointment_date}
                                        onChange={(e) => setAcceptData({ ...acceptData, appointment_date: e.target.value })}
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Heure prévue <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={acceptData.appointment_time}
                                        onChange={(e) => setAcceptData({ ...acceptData, appointment_time: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 rounded-xl">
                                    <p className="text-sm text-green-800 dark:text-green-300">
                                        Le patient sera notifié par email de la date et l&apos;heure de son rendez-vous.
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAcceptModal(false)}
                                        className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={acceptLoading}
                                        className="flex-1 px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all disabled:opacity-50"
                                    >
                                        {acceptLoading ? 'Validation...' : 'Confirmer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DoctorPendingRequests;
