import React, { memo } from 'react';
import { X, FileText, Image as ImageIcon } from 'lucide-react';

/**
 * DossiersListModal — timeline view of patient's medical history.
 *
 * @param {{ dossiers: object[], onClose: () => void }} props
 */
const DossiersListModal = memo(({ dossiers, onClose }) => (
    <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <h2 className="text-xl font-bold text-contrast-heading">Historique Médical</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
            </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {dossiers.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-contrast-muted opacity-40" />
                    </div>
                    <h3 className="text-lg font-medium text-contrast-heading">Aucun dossier trouvé</h3>
                    <p className="text-contrast-muted">Ce patient n'a pas encore d'historique médical.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {dossiers.map((dossier) => (
                        <DossierTimelineItem key={dossier.id} dossier={dossier} />
                    ))}
                </div>
            )}
        </div>
    </div>
));

const DossierTimelineItem = memo(({ dossier }) => (
    <div className="relative pl-8 before:absolute before:left-3 before:top-8 before:bottom-0 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700 last:before:hidden">
        <div className="absolute left-0 top-1 w-6 h-6 bg-brand-primary rounded-full border-4 border-white dark:border-gray-800 ring-2 ring-brand-primary/20" />

        <div className="glass-morphism p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-bold text-brand-primary dark:text-brand-primary-light">
                        Dr. {dossier.doctor_first_name} {dossier.doctor_last_name}
                    </p>
                    <p className="text-xs text-contrast-muted mt-0.5">{dossier.created_at}</p>
                </div>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-4">
                <p className="text-sm text-contrast-body leading-relaxed whitespace-pre-wrap">{dossier.notes}</p>
            </div>

            {dossier.attachments?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {dossier.attachments.map((file) => (
                        <a
                            key={file.id}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium hover:border-brand-primary transition-colors"
                        >
                            {file.file_type === 'pdf'
                                ? <FileText className="w-3.5 h-3.5 text-red-500" />
                                : <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                            }
                            <span className="truncate max-w-[150px]">{file.original_name}</span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    </div>
));

DossiersListModal.displayName = 'DossiersListModal';
DossierTimelineItem.displayName = 'DossierTimelineItem';
export default DossiersListModal;
