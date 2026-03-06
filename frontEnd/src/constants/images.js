import logoImg from '../assets/logo.png';
import image0 from '../assets/image_0.png';
import image1 from '../assets/image_1.png';
import image2 from '../assets/image_2.png';
import image3 from '../assets/image_3.png';
import image4 from '../assets/image_4.png';

let ACTIVE_SOURCE = 'LOCAL';

const USER_LOCAL_ASSETS = {
    LOGO: logoImg,
    FACILITY: {
        ENTRANCE: image0,
        EXTERIOR: image1,
        RECEPTION: image2,
        WARD: image3,
        STAFF_GROUP: image4,
        THEATRE: image1,   // Fallback
        LAB: image3,       // Fallback
        MRI: image2,       // Fallback
        RECOVERY: image3,  // Fallback
        CORRIDOR: image3,  // Fallback
        LOUNGE: image2,    // Fallback
        INTENSIVE: image3, // Fallback
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
