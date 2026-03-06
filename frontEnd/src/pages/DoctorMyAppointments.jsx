import { Activity } from 'lucide-react';
import useDoctorAppointments from '../hooks/useDoctorAppointments';
import LoadingSpinner from '../components/appointments/LoadingSpinner';
import AppointmentStatsBar from '../components/appointments/doctor/AppointmentStatsBar';
import AppointmentTable from '../components/appointments/doctor/AppointmentTable';
import DetailsModal from '../components/appointments/doctor/DetailsModal';
import DossierModal from '../components/appointments/doctor/DossierModal';
import DossiersListModal from '../components/appointments/doctor/DossiersListModal';

/**
 * DoctorMyAppointments — thin shell page using the useDoctorAppointments hook
 * and composed smaller components. All logic lives in the hook.
 */
const DoctorMyAppointments = () => {
    const {
        appointments, loading,
        showDetailsModal, setShowDetailsModal,
        selectedAppointment,
        viewDetails,
        showDossierModal, setShowDossierModal,
        openDossierModal,
        dossierNotes, setDossierNotes,
        dossierFiles,
        dossierLoading,
        handleFileChange, handleCreateDossier,
        showDossiersListModal, setShowDossiersListModal,
        patientDossiers,
        viewPatientDossiers,
        closeAllModals,
    } = useDoctorAppointments();

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-brand-surface-light dark:bg-brand-surface-dark p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-contrast-heading">Mes Rendez-vous</h1>
                            <p className="text-sm text-contrast-muted">Gérez et consultez vos rendez-vous patients</p>
                        </div>
                    </div>
                    <AppointmentStatsBar appointments={appointments} />
                </div>

                {/* Table */}
                <AppointmentTable appointments={appointments} onViewDetails={viewDetails} />
            </div>

            {/* Backdrop for modals */}
            {(showDetailsModal || showDossierModal || showDossiersListModal) && (
                <div
                    className="fixed inset-0 bg-gray-900/60 dark:bg-gray-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={closeAllModals}
                >
                    {/* Prevent backdrop click propagation from closing modal when clicking inside it */}
                    <div onClick={(e) => e.stopPropagation()}>
                        {showDetailsModal && (
                            <DetailsModal
                                appointment={selectedAppointment}
                                onClose={() => setShowDetailsModal(false)}
                                onCreateDossier={openDossierModal}
                                onViewDossiers={viewPatientDossiers}
                            />
                        )}
                        {showDossierModal && (
                            <DossierModal
                                appointment={selectedAppointment}
                                dossierNotes={dossierNotes}
                                setDossierNotes={setDossierNotes}
                                dossierFiles={dossierFiles}
                                dossierLoading={dossierLoading}
                                onFileChange={handleFileChange}
                                onSubmit={handleCreateDossier}
                                onClose={() => setShowDossierModal(false)}
                            />
                        )}
                        {showDossiersListModal && (
                            <DossiersListModal
                                dossiers={patientDossiers}
                                onClose={() => setShowDossiersListModal(false)}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorMyAppointments;
