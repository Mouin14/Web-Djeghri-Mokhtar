import { memo } from 'react';
import {
    Plus, X, AlertCircle, CheckCircle, ShieldCheck,
    Image as ImageIcon, Info, ArrowLeft, ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * BookingModal — 3-step appointment creation modal for the patient.
 * All state/logic lives in usePatientAppointments; this is purely presentational.
 */
const BookingModal = memo(({
    showModal, onClose,
    step, onNext, onPrev, isStepValid,
    formData, setFormData,
    formLoading, formError,
    imagePreviews,
    handleImageChange, removeImage,
    onSubmit,
    isRTL,
}) => {
    if (!showModal) return null;

    const stepLabels = ['Registry', 'Diagnostics', 'Verification'];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-500">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="glass-morphism-premium rounded-[3.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-white/40 dark:border-white/10"
                >
                    {/* Header */}
                    <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                        <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                                {step === 3 ? <ShieldCheck size={32} /> : <Plus size={32} />}
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Registry Entry</h2>
                                <p className="text-xs font-bold text-slate-400 dark:text-slate-200 uppercase tracking-widest mt-1">
                                    {step === 1 && 'Clinical Consultation Protocol'}
                                    {step === 2 && 'Diagnostic Data Injection'}
                                    {step === 3 && 'Final Synchronization'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-12 h-12 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-95 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Stepper */}
                    <div className="grid grid-cols-3 border-b border-slate-100 dark:border-slate-800">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`p-6 text-center transition-colors ${step === s ? 'bg-brand-primary/5 dark:bg-brand-primary/10' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-black transition-all ${step >= s ? 'bg-brand-primary text-white scale-110 shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                    {step > s ? <CheckCircle size={16} /> : s}
                                </div>
                                <p className={`text-[9px] font-black uppercase tracking-widest ${step >= s ? 'text-brand-primary' : 'text-slate-400'}`}>
                                    {stepLabels[s - 1]}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Body */}
                    <div className="p-10 overflow-y-auto custom-scrollbar flex-1">
                        <form
                            onSubmit={(e) => { e.preventDefault(); if (step === 3) onSubmit(e); else onNext(); }}
                            className="space-y-10"
                        >
                            {formError && (
                                <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-2xl flex items-center gap-4 animate-pulse">
                                    <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                                    <p className="text-red-700 dark:text-red-400 text-xs font-black uppercase tracking-widest">{formError}</p>
                                </div>
                            )}

                            <AnimatePresence mode="wait">
                                {/* Step 1 — motif */}
                                {step === 1 && (
                                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <div className="p-8 glass-morphism-premium rounded-[2rem] border-l-4 border-brand-primary shadow-xl mb-8">
                                            <div className="flex gap-6 items-start">
                                                <Info size={28} className="text-brand-primary mt-1" />
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                                                    Please provide a detailed clinical description of your symptoms. Our triage system level 1 requires a minimum of 10 characters for synchronization.
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-end mb-4">
                                                <label className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">
                                                    Consultation Protocol <span className="text-brand-primary">*</span>
                                                </label>
                                                <span className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase">{formData.motif.length}/1000</span>
                                            </div>
                                            <textarea
                                                value={formData.motif}
                                                onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                                                rows={6}
                                                required
                                                minLength={10}
                                                maxLength={1000}
                                                placeholder="Describe clinical symptoms or reason for specialized intervention..."
                                                className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 focus:border-brand-primary rounded-[2rem] outline-none transition-all text-slate-900 dark:text-white font-medium placeholder-slate-400 resize-none shadow-inner"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2 — images */}
                                {step === 2 && (
                                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <label className="block text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest mb-4">
                                            Diagnostic Attachments (Optional)
                                        </label>
                                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 text-center hover:border-brand-primary hover:bg-brand-primary/5 transition-all cursor-pointer relative group">
                                            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                            <div className="relative z-0">
                                                <ImageIcon size={48} className="mx-auto text-slate-300 group-hover:text-brand-primary transition-colors mb-4" />
                                                <p className="text-sm font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Injection Hub</p>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">JPG, PNG, DICOM (Max 5MB)</p>
                                            </div>
                                        </div>
                                        {imagePreviews.length > 0 && (
                                            <div className="grid grid-cols-4 gap-4 mt-8">
                                                {imagePreviews.map((preview, index) => (
                                                    <div key={index} className="relative group aspect-square rounded-[1.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl transform transition-all hover:scale-105">
                                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute top-2 right-2 bg-slate-900/80 text-white w-8 h-8 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Step 3 — review */}
                                {step === 3 && (
                                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                        <div className="bg-brand-primary/5 dark:bg-brand-primary/10 p-8 rounded-[2.5rem] border border-brand-primary/10">
                                            <h3 className="text-xs font-black text-brand-primary uppercase tracking-[0.3em] mb-4">Transmission Payload Summary</h3>
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Motif</p>
                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 italic leading-relaxed">&quot;{formData.motif}&quot;</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnostics Attached</p>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                                                        {imagePreviews.length > 0 ? `${imagePreviews.length} Diagnostic Files` : 'No clinical images attached'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-8 glass-morphism-premium rounded-[2rem] border-l-4 border-brand-success shadow-xl bg-brand-success/5">
                                            <div className="flex gap-6 items-start">
                                                <ShieldCheck size={28} className="text-brand-success mt-1" />
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                                                    Data integrity check complete. Transmission is end-to-end encrypted. Proceed to synchronize with cardiac registry.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation buttons */}
                            <div className="flex gap-6 pt-4 mt-auto">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={onPrev}
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
                                    {step === 3 ? (formLoading ? 'Synchronizing...' : 'Finalize Registry') : 'Continue Flow'}
                                    {step < 3 && <ArrowRight size={16} />}
                                    {step === 3 && !formLoading && <CheckCircle size={16} />}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
});

BookingModal.displayName = 'BookingModal';
export default BookingModal;
