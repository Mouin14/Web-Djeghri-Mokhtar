import React, { memo } from 'react';
import { X, FileText, Download } from 'lucide-react';

/**
 * DossierModal — create a new medical dossier for the selected patient.
 */
const DossierModal = memo(({
    appointment,
    dossierNotes, setDossierNotes,
    dossierFiles,
    dossierLoading,
    onFileChange,
    onSubmit,
    onClose,
}) => {
    if (!appointment) return null;

    return (
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <h2 className="text-xl font-bold text-contrast-heading">Nouveau Dossier Médical</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-6">
                {/* Patient summary */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                        {appointment.patient_first_name[0]}
                    </div>
                    <div>
                        <p className="text-sm text-contrast-muted">Patient</p>
                        <p className="font-bold text-contrast-heading">{appointment.patient_first_name} {appointment.patient_last_name}</p>
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-semibold text-contrast-body mb-2">
                        Observations Médicales <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={dossierNotes}
                        onChange={(e) => setDossierNotes(e.target.value)}
                        required
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-contrast-body focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                        placeholder="Saisissez vos notes cliniques détaillées..."
                    />
                </div>

                {/* File upload */}
                <div>
                    <label className="block text-sm font-semibold text-contrast-body mb-2">Pièces Jointes</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-brand-primary transition-colors cursor-pointer relative">
                        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={onFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <Download className="w-8 h-8 text-contrast-muted opacity-50 mx-auto mb-2" />
                        <p className="text-sm text-contrast-body">
                            Cliquez ou glissez des fichiers ici
                            <span className="block text-xs text-contrast-muted mt-1">PDF, JPG, PNG (Max 10MB)</span>
                        </p>
                    </div>
                    {dossierFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {dossierFiles.map((file, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-contrast-body bg-gray-50 dark:bg-gray-900 p-2 rounded-lg">
                                    <FileText className="w-4 h-4 text-brand-primary" />
                                    {file.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <button type="button" onClick={onClose} className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        Annuler
                    </button>
                    <button type="submit" disabled={dossierLoading} className="flex-1 px-6 py-3 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary-dark shadow-lg shadow-brand-primary/20 transition-all disabled:opacity-50">
                        {dossierLoading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
});

DossierModal.displayName = 'DossierModal';
export default DossierModal;
