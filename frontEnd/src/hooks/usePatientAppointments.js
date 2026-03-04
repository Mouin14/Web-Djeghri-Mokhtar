import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosLib from 'axios';
import axios from '../lib/axios';

/**
 * Custom hook encapsulating all state and API logic for PatientAppointments.
 */
const usePatientAppointments = () => {
    const navigate = useNavigate();

    // ── List state ──────────────────────────────────────────────────────────
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profileComplete, setProfileComplete] = useState(false);

    // ── Modal visibility ────────────────────────────────────────────────────
    const [showModal, setShowModal] = useState(false);
    const [showDossiersModal, setShowDossiersModal] = useState(false);
    const [selectedRdv, setSelectedRdv] = useState(null);

    // ── Booking form state ──────────────────────────────────────────────────
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ motif: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    // ── API calls ───────────────────────────────────────────────────────────
    const fetchUserProfile = useCallback(async () => {
        try {
            const response = await axios.get('/api/patient/profile');
            if (response.data.success) {
                const profile = response.data.data;
                setProfileComplete(!!profile.telephone && profile.telephone.trim() !== '');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }, []);

    const fetchAppointments = useCallback(async () => {
        try {
            const response = await axios.get('/api/patient/appointments');
            if (response.data.success) {
                setAppointments(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            if (error.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchUserProfile();
        fetchAppointments();
    }, [fetchUserProfile, fetchAppointments]);

    // ── Booking modal controls ─────────────────────────────────────────────
    const openModal = useCallback(() => {
        if (!profileComplete) return;
        setFormData({ motif: '' });
        setSelectedImages([]);
        setImagePreviews([]);
        setFormError('');
        setStep(1);
        setShowModal(true);
    }, [profileComplete]);

    const closeModal = useCallback(() => {
        setShowModal(false);
        setFormData({ motif: '' });
        setSelectedImages([]);
        setImagePreviews([]);
        setFormError('');
    }, []);

    // ── Step helpers ───────────────────────────────────────────────────────
    const nextStep = useCallback(() => setStep(prev => Math.min(prev + 1, 3)), []);
    const prevStep = useCallback(() => setStep(prev => Math.max(prev - 1, 1)), []);

    const isStepValid = useCallback(() => {
        if (step === 1) return formData.motif.length >= 10;
        return true;
    }, [step, formData.motif]);

    // ── Image handling ─────────────────────────────────────────────────────
    const handleImageChange = useCallback((e) => {
        const files = Array.from(e.target.files || []);
        if (files.length + selectedImages.length > 10) {
            setFormError('Vous ne pouvez télécharger que 10 images maximum');
            return;
        }
        setFormError('');
        setSelectedImages(prev => [...prev, ...files]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result]);
            reader.readAsDataURL(file);
        });
    }, [selectedImages]);

    const removeImage = useCallback((index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }, []);

    // ── Form submit ────────────────────────────────────────────────────────
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');
        try {
            const fd = new FormData();
            fd.append('motif', formData.motif);
            selectedImages.forEach((image, index) => fd.append(`images[${index}]`, image));
            await axios.post('/api/patient/appointments', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await fetchAppointments();
            closeModal();
        } catch (error) {
            if (axiosLib.isAxiosError(error)) {
                setFormError(error.response?.data?.message || 'Une erreur est survenue.');
            } else {
                setFormError('Une erreur inattendue est survenue.');
            }
        } finally {
            setFormLoading(false);
        }
    }, [formData.motif, selectedImages, fetchAppointments, closeModal]);

    // ── Delete ─────────────────────────────────────────────────────────────
    const handleDelete = useCallback(async (id, statut) => {
        if (!['en attente', 'annulé', 'pending', 'cancelled'].includes(statut)) {
            alert('Vous ne pouvez supprimer que les rendez-vous en attente ou annulés');
            return;
        }
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) return;

        // Optimistic update — remove the card immediately before the API call resolves
        setAppointments(prev => prev.filter(rdv => rdv.id !== id));

        try {
            const response = await axios.delete(`/api/patient/appointments/${id}`);
            if (!response.data.success) {
                // Rollback: refetch the real list if the server rejected the delete
                console.error('[handleDelete] Server rejected delete:', response.data.message);
                await fetchAppointments();
                alert(response.data.message || 'Erreur lors de la suppression');
            }
        } catch (error) {
            // Rollback: refetch so the card reappears if the request failed
            console.error('[handleDelete] API error:', error.response?.data || error.message);
            await fetchAppointments();
            alert(error.response?.data?.message || 'Erreur lors de la suppression');
        }
    }, [fetchAppointments]);

    // ── Dossier viewer ─────────────────────────────────────────────────────
    // viewDossiers fetches the full appointment detail (which includes `records`)
    // because the list endpoint never populates `records` (only on *.show routes).
    const viewDossiers = useCallback(async (rdv) => {
        try {
            const response = await axios.get(`/api/patient/appointments/${rdv.id}`);
            if (response.data.success) {
                setSelectedRdv(response.data.data);
            } else {
                // Fallback: open modal with what we already have (records will be empty)
                console.warn('[viewDossiers] Could not load full details, using cached data.');
                setSelectedRdv(rdv);
            }
        } catch (error) {
            console.error('[viewDossiers] Error loading appointment details:', error.response?.data || error.message);
            setSelectedRdv(rdv);
        } finally {
            setShowDossiersModal(true);
        }
    }, []);

    return {
        // list
        appointments, loading, profileComplete,
        // booking modal
        showModal, openModal, closeModal,
        step, nextStep, prevStep, isStepValid,
        formData, setFormData,
        formLoading, formError,
        selectedImages, imagePreviews,
        handleImageChange, removeImage, handleSubmit,
        // delete  ← THIS WAS THE MISSING EXPORT (root cause of the silent failure)
        handleDelete,
        // dossier modal
        showDossiersModal, setShowDossiersModal, selectedRdv,
        viewDossiers,
        // navigation
        navigate,
    };
};

export default usePatientAppointments;
