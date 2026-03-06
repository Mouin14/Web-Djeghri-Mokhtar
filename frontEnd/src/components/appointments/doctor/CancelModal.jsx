import { memo } from 'react';
import { X, XCircle } from 'lucide-react';

/**
 * CancelModal — doctor cancels an appointment with a mandatory reason.
 *
 * @param {{ appointment: object|null, cancelReason: string, setCancelReason: function, cancelLoading: boolean, onSubmit: function, onClose: function }} props
 */
const CancelModal = memo(({ appointment, cancelReason, setCancelReason, cancelLoading, onSubmit, onClose }) => {
    if (!appointment) return null;

    return (
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-red-100 dark:border-red-900/30 flex justify-between items-center bg-red-50/50 dark:bg-red-900/10">
                <h2 className="text-xl font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                    <XCircle className="w-5 h-5" /> Annuler le Rendez-vous
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-5">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Vous êtes sur le point d&apos;annuler le rendez-vous de{' '}
                    <span className="font-bold text-gray-900 dark:text-white">
                        {appointment.patient_first_name} {appointment.patient_last_name}
                    </span>.
                </p>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Motif d&apos;annulation <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        required
                        maxLength={1000}
                        rows={4}
                        placeholder="Expliquez la raison de l'annulation..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all resize-none"
                    />
                    <p className="text-xs text-right text-gray-400 mt-1">{cancelReason.length}/1000</p>
                </div>

                <div className="flex gap-3 pt-1">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        Retour
                    </button>
                    <button
                        type="submit"
                        disabled={cancelLoading || !cancelReason.trim()}
                        className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {cancelLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Annulation...
                            </>
                        ) : (
                            <>
                                <XCircle className="w-4 h-4" /> Confirmer l&apos;annulation
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
});

CancelModal.displayName = 'CancelModal';
export default CancelModal;
