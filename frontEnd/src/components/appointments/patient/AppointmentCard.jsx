import React, { memo } from 'react';
import {
    Calendar, Clock, FileText, Image as ImageIcon,
    Trash2, CheckCircle, AlertCircle,
} from 'lucide-react';
import StatusBadge from '../../Shared/StatusBadge';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
};

const DoctorAssignedIcon = memo(({ exists }) =>
    exists ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />
);

/**
 * AppointmentCard — a single patient appointment card.
 *
 * @param {{ rdv: object, onDelete: (id, status) => void, onViewDossier: (rdv) => void }} props
 */
const AppointmentCard = memo(({ rdv, onDelete, onViewDossier }) => (
    <div className="glass-morphism-premium rounded-[3.5rem] p-10 border border-white/40 dark:border-white/5 hover:shadow-[0_40px_80px_-20px_rgba(5,102,141,0.25)] transition-all duration-700 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-[60px] -z-10 group-hover:bg-brand-primary/15 transition-colors" />

        {/* Header — status + delete */}
        <div className="flex justify-between items-start mb-10">
            <StatusBadge status={rdv.status} variant="simple" />
            {['pending', 'cancelled'].includes(rdv.status) && (
                <button
                    onClick={() => onDelete(rdv.id, rdv.status)}
                    className="w-12 h-12 bg-white/50 dark:bg-slate-800/50 flex items-center justify-center rounded-2xl hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all active:scale-95 shadow-lg border border-white/20"
                    title="Supprimer"
                >
                    <Trash2 size={18} />
                </button>
            )}
        </div>

        <div className="space-y-8">
            {/* Doctor info */}
            <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl border border-white/40 ${rdv.doctor_id ? 'bg-brand-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <DoctorAssignedIcon exists={!!rdv.doctor_id} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-[0.3em] mb-1">Clinical Specialist</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                        {rdv.doctor_id ? `Dr. ${rdv.doctor_first_name} ${rdv.doctor_last_name}` : 'PENDING ASSIGNMENT'}
                    </p>
                    {rdv.doctor_specialty && (
                        <p className="text-xs text-brand-success font-black uppercase tracking-widest mt-2">{rdv.doctor_specialty}</p>
                    )}
                </div>
            </div>

            {/* Date / Time */}
            <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="glass-morphism-premium p-6 rounded-[2rem] border border-white/20 shadow-inner">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar size={14} className="text-brand-primary" />
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">Entry Date</p>
                    </div>
                    <p className="font-black text-slate-900 dark:text-white text-sm">
                        {rdv.appointment_date ? formatDate(rdv.appointment_date) : 'UNCONFIRMED'}
                    </p>
                </div>
                <div className="glass-morphism-premium p-6 rounded-[2rem] border border-white/20 shadow-inner">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock size={14} className="text-brand-success" />
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">TIME SLOT</p>
                    </div>
                    <p className="font-black text-slate-900 dark:text-white text-sm">
                        {rdv.appointment_time ? rdv.appointment_time.substring(0, 5) : 'PENDING'}
                    </p>
                </div>
            </div>

            {/* Reason + images count */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 italic">
                    "{rdv.reason}"
                </p>
                {rdv.images?.length > 0 && (
                    <div className="flex items-center gap-3 mt-4 text-[10px] font-black text-brand-primary dark:text-brand-success uppercase tracking-widest">
                        <ImageIcon size={14} />
                        {rdv.images.length} DIAGNOSTIC IMAGES
                    </div>
                )}
                {rdv.status === 'cancelled' && rdv.cancellation_reason && (
                    <div className="mt-4 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                        <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">Motif d'annulation</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">{rdv.cancellation_reason}</p>
                    </div>
                )}
            </div>
        </div>

        {/* Archive dossier button (completed only) */}
        {rdv.status === 'completed' && (
            <button
                onClick={() => onViewDossier(rdv)}
                className="w-full mt-8 bg-slate-900 dark:bg-brand-primary text-white py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-brand-primary transition-all active:scale-95 flex items-center justify-center gap-4"
            >
                <FileText size={18} />
                ARCHIVE DOSSIER
            </button>
        )}
    </div>
));

AppointmentCard.displayName = 'AppointmentCard';
export default AppointmentCard;
