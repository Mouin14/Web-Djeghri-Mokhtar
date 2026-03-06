import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import axios from '../lib/axios';
import {
    Calendar, ChevronLeft, ChevronRight, Eye, X,
    Clock
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
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', dot: 'bg-yellow-500' },
    confirmed: { label: 'Confirmé', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-500' },
    cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' },
    completed: { label: 'Complété', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' },
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
        <div className="min-h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Header Sticky */}
            <div className="glass-morphism sticky top-0 z-30 border-b border-brand-primary/10 dark:border-white/10 shadow-sm mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Planning</h1>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vue calendrier des rendez-vous</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 animate-fade-in space-y-8">
                {/* Navigation and Month Header */}
                <div className="glass-morphism-premium rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-500/10 dark:border-white/5 shadow-xl">
                    <div className="flex items-center gap-4 bg-emerald-50 dark:bg-slate-900/50 p-2 rounded-2xl border border-emerald-100 dark:border-slate-800">
                        <button onClick={goPrev} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all text-slate-600 dark:text-slate-300 shadow-sm active:scale-95">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={goNext} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all text-slate-600 dark:text-slate-300 shadow-sm active:scale-95">
                            <ChevronRight size={20} />
                        </button>
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                        <button onClick={goToday} className="px-5 py-2.5 rounded-xl bg-emerald-500 flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 active:scale-95">
                            <Calendar size={14} /> Aujourd&apos;hui
                        </button>
                    </div>
                    <div className="flex flex-col items-end text-center md:text-right">
                        <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase">
                            {MONTHS[currentMonth]}
                        </h3>
                        <p className="text-sm font-bold text-emerald-500 tracking-widest">{currentYear}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="glass-morphism-premium rounded-[2rem] p-24 flex items-center justify-center border border-emerald-500/10 shadow-xl">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-emerald-500/20 rounded-full"></div>
                            <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-emerald-500 animate-pulse" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass-morphism-premium rounded-[2rem] p-6 lg:p-8 border border-white/40 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden bg-white/40 dark:bg-slate-900/40">
                        {/* Weekday headers */}
                        <div className="grid grid-cols-7 mb-2">
                            {WEEKDAYS.map((wd) => (
                                <div key={wd} className="text-center text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest py-3">
                                    {wd}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-3 sm:gap-4 mt-2">
                            {calendarDays.map((cell, i) => {
                                const hasAppts = cell.current && cell.key && appointmentsByDate[cell.key];
                                const count = hasAppts ? appointmentsByDate[cell.key].length : 0;
                                const isToday = cell.current && cell.key === todayKey;

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleDayClick(cell)}
                                        disabled={!cell.current}
                                        className={`relative aspect-[4/5] sm:aspect-square flex flex-col items-center justify-center gap-2 transition-all p-2 rounded-[1.5rem] md:rounded-[2rem] group
                                            ${!cell.current
                                                ? 'opacity-30 cursor-default'
                                                : hasAppts
                                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-100 dark:border-emerald-500/30 hover:bg-emerald-100 hover:border-emerald-300 dark:hover:bg-emerald-500/20 hover:scale-105 cursor-pointer shadow-sm hover:shadow-emerald-500/20'
                                                    : 'bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 cursor-default'
                                            }
                                            ${isToday ? 'ring-4 ring-emerald-500/30 border-emerald-500 dark:border-emerald-500 shadow-emerald-500/20 scale-[1.02]' : ''}
                                        `}
                                    >
                                        <span className={`text-base sm:text-xl font-black ${isToday ? 'bg-emerald-500 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg' : cell.current ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>
                                            {cell.day}
                                        </span>
                                        {hasAppts && (
                                            <div className="flex flex-col items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <span className="px-2 sm:px-3 py-1 bg-emerald-500 text-white rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase shadow-sm">
                                                    {count} RDV
                                                </span>
                                                <div className="flex gap-1 flex-wrap justify-center mt-1">
                                                    {Array.from({ length: Math.min(count, 3) }).map((_, j) => (
                                                        <span key={j} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    ))}
                                                    {count > 3 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-50" />}
                                                </div>
                                            </div>
                                        )}

                                        {/* Hover Gradient Overlay */}
                                        {cell.current && hasAppts && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/10 opacity-0 group-hover:opacity-100 rounded-[1.5rem] md:rounded-[2rem] transition-opacity pointer-events-none" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Detailed Legend Card */}
                <div className="glass-morphism-premium rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-200 dark:border-slate-800 text-sm font-bold shadow-sm">
                    <div className="flex flex-wrap items-center gap-8 justify-center w-full md:justify-start">
                        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                            <span className="w-4 h-4 rounded-[4px] bg-emerald-500 shadow border-2 border-emerald-500/30" />
                            Aujourd&apos;hui
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                            <span className="w-4 h-4 rounded-[4px] bg-emerald-100 dark:bg-emerald-500/20 border-2 border-emerald-200 dark:border-emerald-500/40" />
                            Jour avec consultation(s)
                        </div>
                        <div className="flex items-center gap-3 border-l-2 border-slate-200 dark:border-slate-800 pl-8">
                            <span className="flex gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
                                <span className="w-2 h-2 rounded-full bg-emerald-500/40" />
                            </span>
                            <span className="text-slate-600 dark:text-slate-400">Intensité relative du planning</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Day Modal (portal) ── */}
            {showDayModal && selectedDate && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setShowDayModal(false)}>
                    <div
                        className="relative glass-morphism-premium rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] w-full max-w-2xl max-h-[90vh] flex flex-col border border-white/20 dark:border-white/10 dark:bg-slate-900 overflow-hidden transform transition-all duration-300 scale-100 animate-in zoom-in-95"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-8 sm:p-10 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-emerald-500 border-4 border-emerald-500/20 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shrink-0">
                                    {selectedDate.day}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">
                                        {fmtDate(selectedDate.key)}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">
                                            {appointmentsByDate[selectedDate.key]?.length || 0} Consultations
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setShowDayModal(false)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-95 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shrink-0">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Appointment list — scrollable */}
                        <div className="overflow-y-auto custom-scrollbar flex-1 p-6 sm:p-8 space-y-4 bg-white/40 dark:bg-slate-950/40 relative">
                            {/* Decorative background element inside list */}
                            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                            {(appointmentsByDate[selectedDate.key] || []).map((appt) => {
                                const s = STATUS_MAP[appt.status] || STATUS_MAP.pending;
                                return (
                                    <div key={appt.id} className="relative bg-white dark:bg-slate-900 rounded-[2rem] p-5 sm:p-6 border-2 border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all hover:shadow-xl hover:-translate-y-1 group z-10">
                                        <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
                                            <div className="flex items-center gap-4 sm:gap-5 flex-1 w-full">
                                                <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-lg shrink-0 border border-emerald-500/20">
                                                    {appt.patient_first_name?.[0]}{appt.patient_last_name?.[0]}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-black text-lg text-slate-900 dark:text-white truncate tracking-tight uppercase group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                        {appt.patient_first_name} {appt.patient_last_name}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                                                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-lg">
                                                            <Clock size={14} className="text-emerald-500" />
                                                            {appt.appointment_time?.substring(0, 5)}
                                                        </span>
                                                        {appt.reason && (
                                                            <span className="text-xs text-slate-500 font-medium truncate max-w-[200px] italic">
                                                                &quot;{appt.reason}&quot;
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${s.color.replace('text-', 'border-').replace('100', '200').replace('900/30', '800')} bg-white dark:bg-slate-900`}>
                                                    <span className={`w-2 h-2 rounded-full ${s.dot} animate-pulse`}></span>
                                                    {s.label}
                                                </span>
                                                <button
                                                    onClick={() => viewDetails(appt.id)}
                                                    className="w-12 h-12 rounded-[1.25rem] bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-rotate-3 active:scale-95"
                                                    title="Action Center"
                                                >
                                                    <Eye size={20} />
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
