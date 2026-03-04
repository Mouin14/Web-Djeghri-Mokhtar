
import { LOCAL_IMAGE_NAMES } from '../assets/local_images';

let ACTIVE_SOURCE = 'LOCAL';

const LOCAL_PATH = '/src/assets/'; // Adjusted path for Vite

const USER_LOCAL_ASSETS = {
    LOGO: `${LOCAL_PATH}${LOCAL_IMAGE_NAMES.LOGO}`,
    FACILITY: {
        ENTRANCE: `${LOCAL_PATH}${LOCAL_IMAGE_NAMES.FACILITY.ENTRANCE}`,
        EXTERIOR: `${LOCAL_PATH}${LOCAL_IMAGE_NAMES.FACILITY.EXTERIOR}`,
        RECEPTION: `${LOCAL_PATH}${LOCAL_IMAGE_NAMES.FACILITY.RECEPTION}`,
        WARD: `${LOCAL_PATH}${LOCAL_IMAGE_NAMES.FACILITY.WARD}`,
        STAFF_GROUP: `${LOCAL_PATH}${LOCAL_IMAGE_NAMES.FACILITY.STAFF_GROUP}`,
        THEATRE: `${LOCAL_PATH}${LOCAL_IMAGE_NAMES.FACILITY.EXTERIOR}`, // Fallback
        LAB: `${LOCAL_PATH}${LOCAL_IMAGE_NAMES.FACILITY.WARD}`, // Fallback
        MRI: `${LOCAL_PATH}${LOCAL_IMAGE_NAMES.FACILITY.RECEPTION}`, // Fallback
        RECOVERY: `${LOCAL_PATH}${LOCAL_IMAGE_NAMES.FACILITY.WARD}`, // Fallback
        CORRIDOR: `${LOCAL_PATH}${LOCAL_IMAGE_NAMES.FACILITY.WARD}`, // Fallback
        LOUNGE: `${LOCAL_PATH}${LOCAL_IMAGE_NAMES.FACILITY.RECEPTION}`, // Fallback
        INTENSIVE: `${LOCAL_PATH}${LOCAL_IMAGE_NAMES.FACILITY.WARD}`, // Fallback
    }
};

const PREMIUM_STOCK_ASSETS = {
    LOGO: 'logo.png',
    FACILITY: {
        ENTRANCE: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=95&w=2400',
        EXTERIOR: 'https://images.unsplash.com/photo-1586773860418-d374a5514175?auto=format&fit=crop&q=95&w=2400',
        RECEPTION: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=95&w=2400',
        WARD: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=95&w=2400',
        STAFF_GROUP: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=95&w=2400',
        THEATRE: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=95&w=2400',
        LAB: 'https://images.unsplash.com/photo-1579154235884-332c0d512a8e?auto=format&fit=crop&q=95&w=2400',
        MRI: 'https://images.unsplash.com/photo-1516549171189-1823160daef8?auto=format&fit=crop&q=95&w=2400',
        RECOVERY: 'https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?auto=format&fit=crop&q=95&w=2400',
        INTENSIVE: 'https://images.unsplash.com/photo-1538108190935-e10b5270b776?auto=format&fit=crop&q=95&w=2400',
        CORRIDOR: 'https://images.unsplash.com/photo-1504813184591-01592fd039d5?auto=format&fit=crop&q=95&w=2400',
        LOUNGE: 'https://images.unsplash.com/photo-1519494140681-891f9302e496?auto=format&fit=crop&q=95&w=2400'
    }
};

const DOCTOR_PORTRAITS = {
    CHIEF_SURGEON: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=95&w=1200",
    PEDIATRIC_CARDIOLOGIST: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=95&w=1200",
    ELECTROPHYSIOLOGIST: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=95&w=1200",
    INTERVENTIONAL_CARDIOLOGIST: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=95&w=1200",
    // Fallbacks for other roles if needed
};

export const ASSETS = {
    ...(ACTIVE_SOURCE === 'LOCAL' ? USER_LOCAL_ASSETS : PREMIUM_STOCK_ASSETS),
    DOCTORS: DOCTOR_PORTRAITS
};
