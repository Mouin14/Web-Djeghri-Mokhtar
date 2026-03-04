import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import axios from '../lib/axios';
import {
    Calendar, ChevronLeft, ChevronRight, Eye, X,
    Clock, User, FileText, Image as ImageIcon
} from 'lucide-react';
import DetailsModal from '../components/appointments/doctor/DetailsModal';
import DossierModal from '../components/appointments/doctor/DossierModal';
import DossiersListModal from '../components/appointments/doctor/DossiersListModal';

/* ─── helpers ──────────────────────────────────────────────────────────── */

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const toKey = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const fmtDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const STATUS_MAP = {
    pending:   { label: 'En attente',  color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', dot: 'bg-yellow-500' },
    confirmed: { label: 'Confirmé',    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-500' },
    cancelled: { label: 'Annulé',      color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' },
    completed: { label: 'Complété',    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' },
};

/* ─── DoctorPlanning ──────────────────────────────────────────────────── */

const DoctorPlanning = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Day popup
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDayModal, setShowDayModal] = useState(false);

    // Details modal (reuse pattern)
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // Dossier modals
    const [showDossierModal, setShowDossierModal] = useState(false);
    const [dossierNotes, setDossierNotes] = useState('');
    const [dossierFiles, setDossierFiles] = useState([]);
    const [dossierLoading, setDossierLoading] = useState(false);
    const [showDossiersListModal, setShowDossiersListModal] = useState(false);
    const [patientDossiers, setPatientDossiers] = useState([]);

    /* ── fetch appointments ── */
    const fetchAppointments = useCallback(async () => {
        try {
            const res = await axios.get('/api/doctor/appointments');
            if (res.data.success) setAppointments(res.data.data);
        } catch (err) {
            console.error('Error fetching appointments:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

    /* ── group appointments by date ── */
    const appointmentsByDate = useMemo(() => {
        const map = {};
        appointments.forEach((a) => {
            if (!a.appointment_date) return;
            // Normalize: handle both "2026-02-25" and "2026-02-25T00:00:00.000000Z"
            const key = a.appointment_date.substring(0, 10);
            if (!map[key]) map[key] = [];
            map[key].push(a);
        });
        return map;
    }, [appointments]);

    /* ── calendar grid ── */
    const calendarDays = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);

        // Monday = 0
        let startDow = firstDay.getDay() - 1;
        if (startDow < 0) startDow = 6;

        const days = [];

        // Previous month padding
        const prevMonthLast = new Date(currentYear, currentMonth, 0).getDate();
        for (let i = startDow - 1; i >= 0; i--) {
            days.push({ day: prevMonthLast - i, current: false, date: null });
        }

        // Current month
        for (let d = 1; d <= lastDay.getDate(); d++) {
            const date = new Date(currentYear, currentMonth, d);
            days.push({ day: d, current: true, date, key: toKey(date) });
        }

        // Next month padding
        const remaining = 7 - (days.length % 7);
        if (remaining < 7) {
            for (let i = 1; i <= remaining; i++) {
                days.push({ day: i, current: false, date: null });
            }
        }

        return days;
    }, [currentMonth, currentYear]);

    /* ── navigation ── */
    const goNext = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
    };
    const goPrev = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
    };
    const goToday = () => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); };

    /* ── day click ── */
    const handleDayClick = (cell) => {
        if (!cell.current || !cell.key) return;
        const dayAppts = appointmentsByDate[cell.key];
        if (!dayAppts || dayAppts.length === 0) return;
        setSelectedDate(cell);
        setShowDayModal(true);
    };

    /* ── view details ── */
    const viewDetails = useCallback(async (id) => {
        try {
            const res = await axios.get(`/api/doctor/appointments/${id}`);
            if (res.data.success) {
                setSelectedAppointment(res.data.data);
                setShowDayModal(false);
                setShowDetailsModal(true);
            }
        } catch (err) {
            console.error('Error viewing details:', err);
        }
    }, []);

    /* ── dossier ── */
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
        } catch (err) {
            console.error('Error creating dossier:', err);
        } finally {
            setDossierLoading(false);
        }
    }, [selectedAppointment, dossierNotes, dossierFiles]);

    const viewPatientDossiers = useCallback(async (maladeId) => {
        try {
            const res = await axios.get(`/api/doctor/patients/${maladeId}/medical-records`);
            if (res.data.success) {
                setPatientDossiers(res.data.data);
                setShowDetailsModal(false);
                setShowDossiersListModal(true);
            }
        } catch (err) {
            console.error('Error viewing dossiers:', err);
        }
    }, []);

    const closeAllModals = () => {
        setShowDayModal(false);
        setShowDetailsModal(false);
        setShowDossierModal(false);
        setShowDossiersListModal(false);
    };

    /* ── today key ── */
    const todayKey = toKey(today);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 border border-brand-primary/5 dark:border-white/5 shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                            <Calendar size={28} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Planning</h2>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Vue calendrier</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button onClick={goPrev} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all text-slate-600 dark:text-slate-300">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={goNext} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all text-slate-600 dark:text-slate-300">
                            <ChevronRight size={20} />
                        </button>
                        <button onClick={goToday} className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all">
                            Aujourd'hui
                        </button>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white">
                        {MONTHS[currentMonth]} {currentYear}
                    </h3>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Weekday headers */}
                        <div className="grid grid-cols-7 mb-2">
                            {WEEKDAYS.map((wd) => (
                                <div key={wd} className="text-center text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest py-3">
                                    {wd}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((cell, i) => {
                                const hasAppts = cell.current && cell.key && appointmentsByDate[cell.key];
                                const count = hasAppts ? appointmentsByDate[cell.key].length : 0;
                                const isToday = cell.current && cell.key === todayKey;

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleDayClick(cell)}
                                        disabled={!cell.current}
                                        className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all text-sm font-bold
                                            ${!cell.current
                                                ? 'text-slate-200 dark:text-slate-700 cursor-default'
                                                : hasAppts
                                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 cursor-pointer hover:scale-105'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 cursor-default'
                                            }
                                            ${isToday ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900' : ''}
                                        `}
                                    >
                                        <span className={`${isToday ? 'bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center' : ''}`}>
                                            {cell.day}
                                        </span>
                                        {hasAppts && (
                                            <span className="flex items-center gap-0.5">
                                                {count <= 3 ? (
                                                    Array.from({ length: count }).map((_, j) => (
                                                        <span key={j} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">{count}</span>
                                                )}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Legend */}
                <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <span className="w-3 h-3 rounded-full ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900" />
                        Aujourd'hui
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <span className="w-3 h-3 rounded-full bg-emerald-500/20" />
                        Jour avec rendez-vous
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <span className="flex gap-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </span>
                        Nombre de RDV
                    </div>
                </div>
            </div>

            {/* ── Day Modal (portal) ── */}
            {showDayModal && selectedDate && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDayModal(false)}>
                    <div
                        className="relative bg-white dark:bg-slate-900 w-full sm:w-[95%] sm:max-w-2xl sm:rounded-3xl rounded-t-3xl shadow-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Drag handle (mobile) */}
                        <div className="sm:hidden flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                        </div>

                        {/* Header */}
                        <div className="px-5 py-4 sm:p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-emerald-50/50 dark:bg-emerald-900/10 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-black text-base sm:text-lg flex-shrink-0">
                                    {selectedDate.day}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                                        {fmtDate(selectedDate.key)}
                                    </h2>
                                    <p className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                        {appointmentsByDate[selectedDate.key]?.length || 0} rendez-vous
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setShowDayModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Appointment list — scrollable */}
                        <div className="overflow-y-auto flex-1 p-3 sm:p-4 space-y-3">
                            {(appointmentsByDate[selectedDate.key] || []).map((appt) => {
                                const s = STATUS_MAP[appt.status] || STATUS_MAP.pending;
                                return (
                                    <div key={appt.id} className="bg-slate-50 dark:bg-white/5 rounded-2xl p-3 sm:p-4 border border-slate-100 dark:border-white/10 hover:shadow-md transition-shadow">
                                        <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-3 flex-col sm:flex-row">
                                            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full">
                                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-xs sm:text-sm flex-shrink-0">
                                                    {appt.patient_first_name?.[0]}{appt.patient_last_name?.[0]}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm text-slate-800 dark:text-white truncate">
                                                        {appt.patient_first_name} {appt.patient_last_name}
                                                    </p>
                                                    <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                                                        <span className="flex items-center gap-1 text-xs text-slate-400">
                                                            <Clock size={12} />
                                                            {appt.appointment_time?.substring(0, 5)}
                                                        </span>
                                                        {appt.reason && (
                                                            <span className="text-xs text-slate-400 truncate max-w-[150px] sm:max-w-none">
                                                                {appt.reason}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${s.color}`}>
                                                    {s.label}
                                                </span>
                                                <button
                                                    onClick={() => viewDetails(appt.id)}
                                                    className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                                                    title="Voir les détails"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* ── Details / Dossier Modals (portal) ── */}
            {(showDetailsModal || showDossierModal || showDossiersListModal) && createPortal(
                <div className="fixed inset-0 z-[9999] bg-gray-900/60 dark:bg-gray-950/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeAllModals}>
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
                </div>,
                document.body
            )}
        </div>
    );
};

export default DoctorPlanning;
