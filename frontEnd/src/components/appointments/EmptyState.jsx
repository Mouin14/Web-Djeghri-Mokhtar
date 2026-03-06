import { memo } from 'react';
import { Calendar } from 'lucide-react';

/**
 * EmptyState — shown when the appointments list is empty.
 *
 * @param {{ title?: string, message?: string }} props
 */
const EmptyState = memo(({ title = 'Vacant Registry', message = 'Your medical appointment timeline is currently sterilized. No scheduled visits found.' }) => (
    <div className="text-center py-40 glass-morphism-premium rounded-[4rem] border-2 border-dashed border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <Calendar size={80} className="mx-auto text-slate-200 dark:text-slate-800 mb-8" />
        <h3 className="text-4xl font-black text-slate-400 dark:text-slate-300 mb-4 tracking-tight uppercase">{title}</h3>
        <p className="text-xl font-medium text-slate-400 dark:text-slate-300 max-w-md mx-auto">{message}</p>
    </div>
));

EmptyState.displayName = 'EmptyState';
export default EmptyState;
