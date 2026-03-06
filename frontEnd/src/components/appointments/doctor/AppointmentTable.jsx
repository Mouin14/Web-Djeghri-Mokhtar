import { memo } from 'react';
import { Image as ImageIcon, Eye } from 'lucide-react';
import StatusBadge from '../../Shared/StatusBadge';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
};

/**
 * AppointmentTable — full appointments table for the doctor page.
 * Accepts an `onViewDetails` callback wrapped in useCallback at the parent.
 *
 * @param {{ appointments: object[], onViewDetails: (id: number) => void }} props
 */
const AppointmentTable = memo(({ appointments, onViewDetails }) => (
    <div className="glass-morphism rounded-3xl border border-white/50 dark:border-white/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-brand-primary/10 dark:border-white/10 bg-brand-primary/5 dark:bg-white/5">
                        {['Patient', 'Date & Heure', 'Statut', 'Motif', 'Images', 'Actions'].map(col => (
                            <th key={col} className="px-6 py-4 text-left text-xs font-bold text-brand-primary dark:text-brand-primary-light uppercase tracking-wider">{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-brand-primary/5 dark:divide-white/5">
                    {appointments.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-contrast-muted">Aucun rendez-vous trouvé.</td>
                        </tr>
                    ) : (
                        appointments.map((appointment) => (
                            <AppointmentRow key={appointment.id} appointment={appointment} onViewDetails={onViewDetails} />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
));

const AppointmentRow = memo(({ appointment, onViewDetails }) => (
    <tr className="hover:bg-brand-primary/5 dark:hover:bg-white/5 transition-colors">
        <td className="px-6 py-4">
            <div className="font-semibold text-contrast-heading">{appointment.patient_first_name} {appointment.patient_last_name}</div>
            <div className="text-sm text-contrast-muted">{appointment.patient_phone || 'N/A'}</div>
        </td>
        <td className="px-6 py-4">
            <div className="text-sm text-contrast-heading font-medium">{formatDate(appointment.appointment_date)}</div>
            <div className="text-xs text-contrast-muted">{appointment.appointment_time?.substring(0, 5)}</div>
        </td>
        <td className="px-6 py-4">
            <StatusBadge status={appointment.status} variant="detailed" />
        </td>
        <td className="px-6 py-4">
            <p className="text-sm text-contrast-body max-w-[200px] truncate">{appointment.reason}</p>
        </td>
        <td className="px-6 py-4">
            {appointment.images_count > 0 ? (
                <span className="inline-flex items-center gap-1 text-sm text-brand-primary dark:text-brand-primary-light font-bold">
                    <ImageIcon className="w-4 h-4" />
                    {appointment.images_count}
                </span>
            ) : (
                <span className="text-sm text-contrast-muted opacity-50">-</span>
            )}
        </td>
        <td className="px-6 py-4">
            <button
                onClick={() => onViewDetails(appointment.id)}
                className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                title="Voir détails"
            >
                <Eye className="w-5 h-5" />
            </button>
        </td>
    </tr>
));

AppointmentTable.displayName = 'AppointmentTable';
AppointmentRow.displayName = 'AppointmentRow';
export default AppointmentTable;
