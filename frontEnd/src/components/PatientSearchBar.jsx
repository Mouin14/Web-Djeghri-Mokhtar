import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import axios from '../lib/axios';
import {
    Search, X, User, Mail, Phone, MapPin, Calendar,
    Clock, CheckCircle, XCircle, ChevronRight
} from 'lucide-react';

/* ─── helpers ──────────────────────────────────────────────────────────── */

const STATUS_MAP = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', Icon: Clock },
    confirmed: { label: 'Confirmé', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', Icon: CheckCircle },
    cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', Icon: XCircle },
    completed: { label: 'Complété', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', Icon: CheckCircle },
};

const fmtDate = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

/* ─── PatientSearchBar ──────────────────────────────────────────────────── */

const PatientSearchBar = ({ accentColor = 'brand-primary', inputClass = '' }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showDrop, setShowDrop] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);

    const [patient, setPatient] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);

    const debounceRef = useRef(null);
    const wrapperRef = useRef(null);

    /* close dropdown on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowDrop(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    /* debounced search */
    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        clearTimeout(debounceRef.current);

        if (!val.trim()) {
            setResults([]);
            setShowDrop(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setLoadingSearch(true);
            try {
                const res = await axios.get('/api/patients/search', { params: { q: val.trim() } });
                if (res.data.success) {
                    setResults(res.data.data);
                    setShowDrop(true);
                }
            } catch {
                setResults([]);
            } finally {
                setLoadingSearch(false);
            }
        }, 300);
    };

    /* fetch patient details on click */
    const selectPatient = useCallback(async (id) => {
        setShowDrop(false);
        setQuery('');
        setResults([]);
        setLoadingModal(true);
        setShowModal(true);
        try {
            const res = await axios.get(`/api/patients/${id}/overview`);
            if (res.data.success) setPatient(res.data.data);
        } catch {
            setPatient(null);
        } finally {
            setLoadingModal(false);
        }
    }, []);

    const closeModal = () => { setShowModal(false); setPatient(null); };

    return (
        <>
            {/* ── Search Input ── */}
            <div ref={wrapperRef} className="relative hidden sm:block">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={18}
                />
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onFocus={() => results.length > 0 && setShowDrop(true)}
                    placeholder="Rechercher un patient..."
                    className={`bg-slate-100 dark:bg-slate-800/60 rounded-full py-3 pl-12 pr-10 text-sm font-medium outline-none border border-transparent focus:border-${accentColor} transition-all w-80 dark:text-white ${inputClass}`}
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setResults([]); setShowDrop(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                    >
                        <X size={15} />
                    </button>
                )}

                {/* ── Dropdown ── */}
                {showDrop && (
                    <div className="absolute top-full mt-2 left-0 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-50">
                        {loadingSearch ? (
                            <div className="flex items-center justify-center py-6">
                                <div className="w-5 h-5 border-2 border-slate-300 border-t-brand-primary rounded-full animate-spin" />
                            </div>
                        ) : results.length === 0 ? (
                            <p className="text-center text-sm text-slate-400 py-6">Aucun résultat</p>
                        ) : (
                            <ul>
                                {results.map((p) => (
                                    <li key={p.id}>
                                        <button
                                            onClick={() => selectPatient(p.id)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left"
                                        >
                                            <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black text-sm flex-shrink-0">
                                                {p.prenom?.[0]}{p.nom?.[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-slate-800 dark:text-white truncate">
                                                    {p.prenom} {p.nom}
                                                </p>
                                                <p className="text-xs text-slate-400 truncate">{p.email}</p>
                                            </div>
                                            <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* ── Modal — rendered via portal so it escapes the sticky/backdrop-filter header ── */}
            {showModal && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <div
                        className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <User className="w-5 h-5 text-brand-primary" /> Dossier Patient
                            </h2>
                            <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-[calc(90vh-72px)]">
                            {loadingModal ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                                </div>
                            ) : !patient ? (
                                <p className="text-center text-slate-400 py-20">Impossible de charger le dossier.</p>
                            ) : (
                                <div className="p-6 space-y-6">
                                    {/* Patient Info */}
                                    <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/20">
                                        <div className="flex items-center gap-5 mb-5">
                                            <div className="w-16 h-16 rounded-2xl bg-brand-primary text-white flex items-center justify-center text-2xl font-black flex-shrink-0">
                                                {patient.prenom?.[0]}{patient.nom?.[0]}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                                    {patient.prenom} {patient.nom}
                                                </h3>
                                                {patient.sexe && (
                                                    <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">
                                                        {patient.sexe === 'M' ? 'Homme' : patient.sexe === 'F' ? 'Femme' : patient.sexe}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <InfoRow icon={Mail} label="Email" value={patient.email} />
                                            <InfoRow icon={Phone} label="Téléphone" value={patient.telephone || '—'} />
                                            <InfoRow icon={Calendar} label="Date de naissance" value={patient.date_naissance || '—'} />
                                            {patient.adresse && <InfoRow icon={MapPin} label="Adresse" value={patient.adresse} />}
                                        </div>
                                    </div>

                                    {/* Appointments */}
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Rendez-vous ({patient.appointments?.length ?? 0})
                                        </h4>

                                        {!patient.appointments?.length ? (
                                            <div className="text-center py-10 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-slate-400 text-sm">
                                                Aucun rendez-vous enregistré.
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {patient.appointments.map((appt) => {
                                                    const s = STATUS_MAP[appt.status] ?? STATUS_MAP.pending;
                                                    const SIcon = s.Icon;
                                                    return (
                                                        <div key={appt.id} className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/10">
                                                            <div className="flex items-start justify-between gap-3 flex-wrap">
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
                                                                        <Calendar className="w-4 h-4 text-brand-primary" />
                                                                        {appt.appointment_date ? fmtDate(appt.appointment_date) : 'Date à définir'}
                                                                        {appt.appointment_time && (
                                                                            <span className="text-slate-400 font-medium">
                                                                                à {appt.appointment_time?.substring(0, 5)}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {appt.doctor_id && (
                                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                            Dr. {appt.doctor_first_name} {appt.doctor_last_name}
                                                                            {appt.doctor_specialty && ` — ${appt.doctor_specialty}`}
                                                                        </p>
                                                                    )}
                                                                    {appt.reason && (
                                                                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                                                                            &quot;{appt.reason}&quot;
                                                                        </p>
                                                                    )}
                                                                    {appt.status === 'cancelled' && appt.cancellation_reason && (
                                                                        <p className="text-xs text-red-500 font-medium">
                                                                            Annulé: {appt.cancellation_reason}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${s.color}`}>
                                                                    <SIcon className="w-3 h-3" />
                                                                    {s.label}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 bg-white dark:bg-white/5 px-4 py-3 rounded-xl border border-blue-100 dark:border-blue-800/20">
        <Icon className="w-4 h-4 text-brand-primary flex-shrink-0" />
        <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{value}</p>
        </div>
    </div>
);

export default PatientSearchBar;
