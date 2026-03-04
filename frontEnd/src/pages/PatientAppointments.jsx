import React, { useCallback } from 'react';
import { Plus, ChevronRight, Activity, UserCircle } from 'lucide-react';
import usePatientAppointments from '../hooks/usePatientAppointments';
import LoadingSpinner from '../components/appointments/LoadingSpinner';
import EmptyState from '../components/appointments/EmptyState';
import ProfileIncompletePrompt from '../components/appointments/patient/ProfileIncompletePrompt';
import AppointmentCard from '../components/appointments/patient/AppointmentCard';
import BookingModal from '../components/appointments/patient/BookingModal';
import DossierArchiveModal from '../components/appointments/patient/DossierArchiveModal';

/**
 * PatientAppointments — thin shell page using the usePatientAppointments hook
 * and composed smaller components. All logic lives in the hook.
 */
const PatientAppointments = () => {
    const {
        appointments, loading, profileComplete,
        showModal, openModal, closeModal,
        step, nextStep, prevStep, isStepValid,
        formData, setFormData,
        formLoading, formError,
        selectedImages, imagePreviews,
        handleImageChange, removeImage, handleSubmit,
        handleDelete,                                  // ← was missing from destructuring
        showDossiersModal, setShowDossiersModal, selectedRdv,
        viewDossiers,
        navigate,
    } = usePatientAppointments();

    const handleNavigateToProfile = useCallback(() => navigate('/patient/profile'), [navigate]);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-brand-surface-light dark:bg-brand-surface-dark p-8 lg:p-16">
            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-success/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative">
                {/* Header */}
                <div className="mb-20">
                    <div className="inline-flex items-center gap-3 px-6 py-3 glass-morphism-premium border border-brand-primary/30 rounded-full text-xs font-black text-brand-primary uppercase tracking-[0.3em] mb-8 shadow-2xl">
                        <Activity size={12} />
                        Patient Portal
                        <ChevronRight size={12} className="text-slate-400" />
                        <span className="text-slate-400">Cardiac Registry</span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div>
                            <h1 className="text-7xl lg:text-9xl font-black text-slate-900 dark:text-white tracking-[-0.04em] leading-none uppercase mb-6">
                                <span className="block">CARDIAC</span>
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-success">REGISTRY.</span>
                            </h1>
                            <p className="text-2xl font-medium text-slate-500 dark:text-slate-400 max-w-xl">
                                Your complete cardiovascular consultation archive.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/patient/profile')}
                                className="flex items-center gap-3 px-10 py-6 bg-white/30 dark:bg-slate-800/30 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-2xl transition-all active:scale-95"
                            >
                                <UserCircle size={20} />
                                Identity File
                            </button>
                            <button
                                onClick={openModal}
                                disabled={!profileComplete}
                                className={`flex items-center gap-3 px-10 py-6 rounded-3xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-2xl ${profileComplete
                                    ? 'bg-brand-primary text-white hover:bg-slate-900 hover:shadow-brand-primary/30'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                                    }`}
                            >
                                <Plus size={20} />
                                New Entry
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile incomplete warning */}
                {!profileComplete && (
                    <ProfileIncompletePrompt onNavigate={handleNavigateToProfile} />
                )}

                {/* Stats bar */}
                {appointments.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                        {[
                            { label: 'Total', value: appointments.length, col: 'text-slate-900 dark:text-white' },
                            { label: 'En attente', value: appointments.filter(r => r.status === 'pending').length, col: 'text-yellow-600' },
                            { label: 'Confirmés', value: appointments.filter(r => r.status === 'confirmed').length, col: 'text-green-600' },
                            { label: 'Complétés', value: appointments.filter(r => r.status === 'completed').length, col: 'text-blue-600' },
                        ].map(({ label, value, col }) => (
                            <div key={label} className="glass-morphism-premium rounded-[3rem] p-8 border border-white/40 dark:border-white/5 shadow-xl text-center">
                                <p className={`text-5xl font-black tracking-tight ${col}`}>{value}</p>
                                <p className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-[0.3em] mt-2">{label}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Card grid or empty state */}
                {appointments.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                        {appointments.map(rdv => (
                            <AppointmentCard
                                key={rdv.id}
                                rdv={rdv}
                                onDelete={handleDelete}
                                onViewDossier={viewDossiers}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <BookingModal
                showModal={showModal}
                onClose={closeModal}
                step={step}
                onNext={nextStep}
                onPrev={prevStep}
                isStepValid={isStepValid}
                formData={formData}
                setFormData={setFormData}
                formLoading={formLoading}
                formError={formError}
                imagePreviews={imagePreviews}
                handleImageChange={handleImageChange}
                removeImage={removeImage}
                onSubmit={handleSubmit}
                isRTL={false}
            />

            <DossierArchiveModal
                show={showDossiersModal}
                rdv={selectedRdv}
                onClose={() => setShowDossiersModal(false)}
            />
        </div>
    );
};

export default PatientAppointments;
