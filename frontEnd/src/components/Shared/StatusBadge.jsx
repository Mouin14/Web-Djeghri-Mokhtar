import { memo, useMemo } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

/**
 * StatusBadge — reusable appointment status pill.
 * Supports both the "simple" (patient card) and "detailed" (doctor table) styles.
 *
 * @param {{ status: string, variant?: 'simple'|'detailed' }} props
 */
const statusConfig = {
    pending: { simple: 'bg-yellow-100 text-yellow-800 border-yellow-200', Icon: Clock, bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
    confirmed: { simple: 'bg-green-100 text-green-800 border-green-200', Icon: CheckCircle, bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
    cancelled: { simple: 'bg-red-100 text-red-800 border-red-200', Icon: XCircle, bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
    completed: { simple: 'bg-blue-100 text-blue-800 border-blue-200', Icon: CheckCircle, bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
};

const defaultConfig = {
    simple: 'bg-gray-100 text-gray-800 border-gray-200',
    Icon: AlertCircle,
    bg: 'bg-gray-100 dark:bg-gray-700',
    text: 'text-gray-700 dark:text-gray-300',
};

const StatusBadge = memo(({ status, variant = 'simple' }) => {
    const config = useMemo(() => statusConfig[status] ?? defaultConfig, [status]);

    if (variant === 'detailed') {
        const { Icon, bg, text } = config;
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
                <Icon className="w-3 h-3" />
                {status}
            </span>
        );
    }

    return (
        <div className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-xl ${config.simple}`}>
            {status}
        </div>
    );
});

StatusBadge.displayName = 'StatusBadge';
export default StatusBadge;
