import React, { memo } from 'react';
import { X, Eye, FileText, Image as ImageIcon } from 'lucide-react';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
};

/**
 * DetailsModal — full appointment detail view for the doctor.
 *
 * @param {{ appointment: object|null, onClose: () => void, onCreateDossier: () => void, onViewDossiers: (patientId) => void }} props
 */
const DetailsModal = memo(({ appointment, onClose, onCreateDossier, onViewDossiers }) => {
    if (!appointment) return null;

    return (
        <div className="relative bg-white dark:bg-gray-800 w-full sm:max-w-4xl sm:rounded-3xl rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Drag handle (mobile) */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>

            {/* Header */}
            <div className="px-4 py-3 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 flex-shrink-0">
                <h2 className="text-base sm:text-xl font-bold text-contrast-heading">Détails du Rendez-vous</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0">
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Scrollable content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                    {/* Patient info */}
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-4 sm:p-6 border border-blue-100 dark:border-blue-800/20">
                        <h3 className="text-xs sm:text-sm font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-3 sm:mb-4">Patient</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-blue-600 dark:text-blue-300 font-bold">Nom Complet</p>
                                <p className="font-semibold text-contrast-heading text-base sm:text-lg">{appointment.patient_first_name} {appointment.patient_last_name}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <p className="text-xs text-blue-600 dark:text-blue-300 font-bold">Téléphone</p>
                                    <p className="font-medium text-contrast-body text-sm sm:text-base">{appointment.patient_phone || '-'}</p>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-blue-600 dark:text-blue-300 font-bold">Email</p>
                                    <p className="font-medium text-contrast-body truncate text-sm sm:text-base" title={appointment.patient_email}>{appointment.patient_email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Appointment info */}
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl p-4 sm:p-6 border border-emerald-100 dark:border-emerald-800/20">
                        <h3 className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-3 sm:mb-4">Rendez-vous</h3>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-300 font-bold">Date</p>
                                    <p className="font-semibold text-contrast-heading text-sm sm:text-base">{formatDate(appointment.appointment_date)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-300 font-bold">Heure</p>
                                    <p className="font-semibold text-contrast-heading text-sm sm:text-base">{appointment.appointment_time?.substring(0, 5)}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-emerald-600 dark:text-emerald-300 font-bold">Motif</p>
                                <p className="font-medium text-contrast-body mt-1 text-sm sm:text-base">{appointment.reason}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Images */}
                {appointment.images?.length > 0 && (
                    <div>
                        <h3 className="text-xs sm:text-sm font-bold text-contrast-heading uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> Images Médicales
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            {appointment.images.map((image) => (
                                <a key={image.id} href={image.url} target="_blank" rel="noopener noreferrer" className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <img src={image.url} alt="Examen" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Eye className="w-8 h-8 text-white" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer actions */}
            <div className="px-4 py-3 sm:p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 flex-shrink-0">
                <button
                    onClick={() => onViewDossiers(appointment.patient_id)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base text-center"
                >
                    Historique Dossiers
                </button>
                <button
                    onClick={onCreateDossier}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary-dark shadow-lg shadow-brand-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                    <FileText className="w-4 h-4" /> Créer Dossier
                </button>
            </div>
        </div>
    );
});

DetailsModal.displayName = 'DetailsModal';
export default DetailsModal;
