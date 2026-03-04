import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosLib from 'axios';
import axios from '../lib/axios';

/**
 * Custom hook encapsulating all state and API logic for DoctorMyAppointments.
 */
const useDoctorAppointments = () => {
    const navigate = useNavigate();

    // ── List state ──────────────────────────────────────────────────────────
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // ── Detail modal ─────────────────────────────────────────────────────────
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // ── Dossier create modal ─────────────────────────────────────────────────
    const [showDossierModal, setShowDossierModal] = useState(false);
    const [dossierNotes, setDossierNotes] = useState('');
    const [dossierFiles, setDossierFiles] = useState([]);
    const [dossierLoading, setDossierLoading] = useState(false);

    // ── Dossiers list modal ──────────────────────────────────────────────────
    const [showDossiersListModal, setShowDossiersListModal] = useState(false);
    const [patientDossiers, setPatientDossiers] = useState([]);

    // ── API calls ────────────────────────────────────────────────────────────
    const fetchAppointments = useCallback(async () => {
        try {
            const response = await axios.get('/api/doctor/appointments');
            if (response.data.success) setAppointments(response.data.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            if (axiosLib.isAxiosError(error) && error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const viewDetails = useCallback(async (id) => {
        try {
            const response = await axios.get(`/api/doctor/appointments/${id}`);
            if (response.data.success) {
                setSelectedAppointment(response.data.data);
                setShowDetailsModal(true);
            }
        } catch (error) {
            console.error('Error viewing details:', error);
        }
    }, []);

    // ── Dossier create ───────────────────────────────────────────────────────
    const openDossierModal = useCallback(() => {
        setShowDetailsModal(false);
        setDossierNotes('');
        setDossierFiles([]);
        setShowDossierModal(true);
    }, []);

    const handleFileChange = useCallback((e) => {
        if (e.target.files) setDossierFiles(Array.from(e.target.files));
    }, []);

    const handleCreateDossier = useCallback(async (e) => {
        e.preventDefault();
        if (!selectedAppointment) return;
        setDossierLoading(true);
        try {
            const formData = new FormData();
            formData.append('notes', dossierNotes);
            dossierFiles.forEach(file => formData.append('attachments[]', file));
            await axios.post(
                `/api/doctor/patients/${selectedAppointment.patient_id}/medical-records`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setShowDossierModal(false);
            setDossierNotes('');
            setDossierFiles([]);
        } catch (error) {
            console.error('Error creating dossier:', error);
        } finally {
            setDossierLoading(false);
        }
    }, [selectedAppointment, dossierNotes, dossierFiles]);

    // ── Dossiers history ─────────────────────────────────────────────────────
    const viewPatientDossiers = useCallback(async (maladeId) => {
        try {
            const response = await axios.get(`/api/doctor/patients/${maladeId}/medical-records`);
            if (response.data.success) {
                setPatientDossiers(response.data.data);
                setShowDetailsModal(false);
                setShowDossiersListModal(true);
            }
        } catch (error) {
            console.error('Error viewing dossiers:', error);
        }
    }, []);

    /** Close all modals at once (backdrop click) */
    const closeAllModals = useCallback(() => {
        setShowDetailsModal(false);
        setShowDossierModal(false);
        setShowDossiersListModal(false);
    }, []);

    return {
        // list
        appointments, loading,
        // details modal
        showDetailsModal, setShowDetailsModal,
        selectedAppointment,
        viewDetails,
        // dossier create modal
        showDossierModal, setShowDossierModal,
        openDossierModal,
        dossierNotes, setDossierNotes,
        dossierFiles,
        dossierLoading,
        handleFileChange, handleCreateDossier,
        // dossiers list modal
        showDossiersListModal, setShowDossiersListModal,
        patientDossiers,
        viewPatientDossiers,
        // helpers
        closeAllModals,
        navigate,
    };
};

export default useDoctorAppointments;
