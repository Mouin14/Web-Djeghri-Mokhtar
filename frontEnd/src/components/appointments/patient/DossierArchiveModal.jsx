import { memo } from 'react';
import { X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
};

/**
 * DossierArchiveModal — shows completed appointment medical records for the patient.
 */
const DossierArchiveModal = memo(({ show, rdv, onClose }) => (
    <AnimatePresence>
        {show && rdv && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-500">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 50 }}
                    className="glass-morphism-premium rounded-[4rem] shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col border border-white/40 group/modal"
                >
                    {/* Header */}
                    <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-brand-primary/5">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-brand-primary text-white rounded-2xl flex items-center justify-center shadow-2xl">
                                <FileText size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Medical Archive</h2>
                                <p className="text-xs font-bold text-slate-400 dark:text-slate-200 uppercase tracking-widest mt-1">
                                    Surgical Session: {formatDate(rdv.date_rdv)}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-12 h-12 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-95">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-12 overflow-y-auto custom-scrollbar">
                        {!rdv.records || rdv.records.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <FileText size={48} className="text-slate-200 mx-auto mb-6" />
                                <p className="text-xl font-black text-slate-400 uppercase tracking-tight">No Archive Data synchronized.</p>
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {rdv.records.map((dossier) => (
                                    <div key={dossier.id} className="glass-morphism-premium border border-white/40 dark:border-white/10 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-[60px] -z-10" />

                                        <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-brand-success text-white flex items-center justify-center font-black shadow-xl">DR</div>
                                                <div>
                                                    <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Dr. {dossier.doctor_first_name} {dossier.doctor_last_name}</p>
                                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-[0.3em]">{new Date(dossier.created_at).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="px-5 py-2.5 bg-brand-success/10 text-brand-success rounded-full text-[10px] font-black uppercase tracking-widest">Verified Entry</div>
                                        </div>

                                        <div className="mb-10">
                                            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-200 uppercase tracking-[0.4em] mb-4">Clinical Observations</h4>
                                            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2rem] text-lg font-medium text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed shadow-inner border border-slate-100 dark:border-slate-800">
                                                {dossier.notes}
                                            </div>
                                        </div>

                                        {dossier.attachments?.length > 0 && (
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-200 uppercase tracking-[0.4em] mb-6">Archive Documents ({dossier.attachments.length})</h4>
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                                    {dossier.attachments.map((att) => (
                                                        <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer" className="group block glass-morphism-premium border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2">
                                                            {att.file_type === 'pdf' ? (
                                                                <div className="h-32 bg-red-50 dark:bg-red-950/20 flex flex-col items-center justify-center text-red-500">
                                                                    <FileText size={32} className="mb-2" />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest">PDF ANALYTICS</span>
                                                                </div>
                                                            ) : (
                                                                <div className="h-32 w-full overflow-hidden">
                                                                    <img src={att.url} alt="doc" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                                </div>
                                                            )}
                                                            <div className="p-4 bg-white/50 dark:bg-slate-900/50 text-[10px] font-black text-slate-600 dark:text-slate-400 truncate uppercase tracking-widest border-t border-white/10 group-hover:text-brand-primary">
                                                                {att.original_name}
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
));

DossierArchiveModal.displayName = 'DossierArchiveModal';
export default DossierArchiveModal;
