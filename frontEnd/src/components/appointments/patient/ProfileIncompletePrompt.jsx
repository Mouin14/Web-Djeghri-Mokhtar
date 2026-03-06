import { memo } from 'react';
import { UserCircle } from 'lucide-react';

/**
 * ProfileIncompletePrompt — warns the patient to complete their profile
 * before they can book an appointment.
 *
 * @param {{ onNavigate: () => void }} props
 */
const ProfileIncompletePrompt = memo(({ onNavigate }) => (
    <div className="mb-16 glass-morphism-premium rounded-[3rem] p-12 border border-yellow-400/30 shadow-2xl animate-in slide-in-from-top duration-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-[100px] -z-10" />
        <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="w-24 h-24 bg-yellow-400/10 rounded-[2rem] flex items-center justify-center text-yellow-600 dark:text-yellow-400 shadow-inner">
                <UserCircle size={48} />
            </div>
            <div className="flex-1 text-center lg:text-left">
                <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                    Identity Verification Required
                </h3>
                <p className="text-xl font-medium text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    Before accessing the cardiac registry, please finalize your medical identity profile for regulatory compliance.
                </p>
            </div>
            <button
                onClick={onNavigate}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:shadow-yellow-500/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 active:scale-95"
            >
                <UserCircle size={20} />
                Update Registry
            </button>
        </div>
    </div>
));

ProfileIncompletePrompt.displayName = 'ProfileIncompletePrompt';
export default ProfileIncompletePrompt;
