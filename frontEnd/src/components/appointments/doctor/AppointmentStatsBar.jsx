import React, { memo, useMemo } from 'react';
import { Calendar, CheckCircle, FileText } from 'lucide-react';

/**
 * AppointmentStatsBar — 3-card stats grid for the doctor page.
 * Uses useMemo to avoid re-computing stats on every render.
 *
 * @param {{ appointments: object[] }} props
 */
const AppointmentStatsBar = memo(({ appointments }) => {
    const stats = useMemo(() => ({
        total: appointments.length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        completed: appointments.filter(a => a.status === 'completed').length,
    }), [appointments]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard icon={<Calendar className="w-16 h-16 text-brand-primary" />} label="Total Rendez-vous" value={stats.total} valueClass="text-contrast-heading" />
            <StatCard icon={<CheckCircle className="w-16 h-16 text-emerald-500" />} label="Confirmés" value={stats.confirmed} valueClass="text-emerald-600 dark:text-emerald-400" />
            <StatCard icon={<FileText className="w-16 h-16 text-blue-500" />} label="Complétés" value={stats.completed} valueClass="text-blue-600 dark:text-blue-400" />
        </div>
    );
});

const StatCard = memo(({ icon, label, value, valueClass }) => (
    <div className="glass-morphism rounded-2xl p-6 border border-white/50 dark:border-white/10 relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">{icon}</div>
        <p className="text-sm font-medium text-contrast-muted">{label}</p>
        <p className={`text-3xl font-bold mt-2 ${valueClass}`}>{value}</p>
    </div>
));

AppointmentStatsBar.displayName = 'AppointmentStatsBar';
StatCard.displayName = 'StatCard';
export default AppointmentStatsBar;
