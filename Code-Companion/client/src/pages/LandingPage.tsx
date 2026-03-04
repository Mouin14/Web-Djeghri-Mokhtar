import { useState, useEffect, useRef } from "react";
import {
  Heart, Sun, Moon, Menu, X, HeartPulse, Activity, Zap,
  Baby, Stethoscope, FileDigit, CalendarCheck, MapPin,
  Clock, Phone, ShieldCheck, Award, Globe, Smartphone,
  ArrowRight, ChevronUp, Image as ImageIcon, Users, Building
} from "lucide-react";
import { Button } from "@/components/ui/button";

const translations = {
  fr: {
    // Nav
    nav_home: "Accueil",
    nav_services: "Services",
    nav_gallery: "Galerie",
    nav_about: "À propos",
    nav_contact: "Contact",
    btn_appointment: "Prendre RDV",

    // Hero
    hero_title: "Soins Cardiaques d'Excellence",
    hero_subtitle: "Établissement Hospitalier Spécialisé en Chirurgie Cardiaque Dr. Djeghri Mokhtar. Des soins gratuits et de haute qualité pour tous les citoyens de l'Est algérien.",
    hero_btn_primary: "Rendez-vous en ligne",
    hero_btn_secondary: "Nos Services",
    hero_badge_1: "Missions de Réanimation",
    hero_badge_2: "Chirurgie de Pointe",
    hero_badge_3: "Urgence 24/7",

    // Stats
    stat_beds: "Lits d'hospitalisation",
    stat_icu: "Lits de réanimation",
    stat_exp: "Années d'expérience",
    stat_coverage: "Couverture: Est de l'Algérie",

    // Services
    services_title: "Nos Spécialités Médicales",
    services_subtitle: "Un pôle d'excellence dédié à la santé de votre cœur",
    srv_1_title: "Chirurgie à Cœur Ouvert",
    srv_1_desc: "Interventions complexes avec les dernières technologies médicales.",
    srv_2_title: "Chirurgie Vasculaire",
    srv_2_desc: "Traitement des affections des vaisseaux sanguins et pontage.",
    srv_3_title: "Cardiologie Interventionnelle",
    srv_3_desc: "Procédures mini-invasives, angiographie et angioplastie.",
    srv_4_title: "Chirurgie Congénitale",
    srv_4_desc: "Prise en charge spécialisée des malformations cardiaques.",
    srv_5_title: "Consultations Spécialisées",
    srv_5_desc: "Suivi post-opératoire et consultations d'experts.",
    srv_6_title: "Imagerie Médicale",
    srv_6_desc: "Équipements de pointe, écho-Doppler et diagnostics précis.",

    // Gallery
    gallery_title: "Notre Établissement en Images",
    gallery_subtitle: "Découvrez nos installations et notre environnement médical",
    gal_1: "Bloc Opératoire",
    gal_2: "Service de Réanimation",
    gal_3: "Salle de Consultation",
    gal_4: "Imagerie Médicale",
    gal_5: "Espace Patient",
    gal_6: "Vue Extérieure",
    gal_btn: "Voir plus",
    gal_badge: "📸 Photo",

    // How it works
    how_title: "Votre Parcours de Soins",
    how_1_title: "Consultation",
    how_1_desc: "Premier contact et évaluation médicale complète.",
    how_2_title: "Diagnostic",
    how_2_desc: "Examens approfondis et imagerie médicale.",
    how_3_title: "Intervention",
    how_3_desc: "Planification et réalisation de l'acte chirurgical.",
    how_4_title: "Suivi",
    how_4_desc: "Accompagnement post-opératoire et rééducation.",

    // Why us
    why_title: "Pourquoi Choisir Notre Établissement ?",
    why_1_title: "Soins Gratuits",
    why_1_desc: "Service public garantissant la gratuité totale des soins.",
    why_2_title: "Excellence Médicale",
    why_2_desc: "Équipe de chirurgiens et spécialistes hautement qualifiés.",
    why_3_title: "Couverture Régionale",
    why_3_desc: "Pôle de référence pour tout l'Est algérien.",
    why_4_title: "Système Numérique",
    why_4_desc: "Gestion moderne et prise de rendez-vous facilitée.",

    // About
    about_title: "À Propos de l'Hôpital",
    about_p1: "L'Établissement Hospitalier Spécialisé en Chirurgie Cardiaque de Constantine a été fondé par le décret exécutif N° 97/465 du 02 décembre 1997.",
    about_p2: "Il s'agit d'un établissement public à caractère administratif de Catégorie B, placé sous la tutelle du Ministère de la Santé.",
    about_p3: "L'hôpital porte fièrement le nom du Moudjahid Dr. Djeghri Mokhtar, en hommage à son engagement.",
    about_capacity: "Capacité d'Accueil",
    about_cap_total: "80 Lits au total",
    about_cap_icu: "10 Lits de réanimation",
    about_cap_men: "35 Lits (Pavillon Hommes)",
    about_cap_women: "35 Lits (Pavillon Femmes)",

    // Contact
    contact_title: "Contact & Accès",
    contact_address: "Adresse",
    contact_address_val: "Cité El Riad Benchicou, Constantine, Algérie",
    contact_hours: "Horaires d'Ouverture",
    contact_hours_val: "Lun-Ven: 08h00 - 16h00",
    contact_emergency: "Urgences",
    contact_emergency_val: "24h/24 et 7j/7",
    map_pin_1: "6 km du centre-ville",
    map_pin_2: "4 km de la gare routière",
    map_pin_3: "12 km de l'aéroport",

    // Footer
    footer_cta: "Prenez soin de votre cœur — Prenez rendez-vous aujourd'hui",
    footer_mission: "Notre mission est d'offrir des soins cardiaques de pointe à tous les citoyens, gratuitement et avec dévouement.",
    footer_quick_links: "Liens Rapides",
    footer_ministry: "Sous tutelle du Ministère de la Santé",
    footer_decree: "Décret exécutif N° 97/465",
    footer_rights: "Tous droits réservés.",
  },
  ar: {
    // Nav
    nav_home: "الرئيسية",
    nav_services: "خدماتنا",
    nav_gallery: "معرض الصور",
    nav_about: "عن المستشفى",
    nav_contact: "اتصل بنا",
    btn_appointment: "حجز موعد",

    // Hero
    hero_title: "رعاية قلبية بامتياز",
    hero_subtitle: "المؤسسة الاستشفائية المتخصصة في جراحة القلب الدكتور الجغري مختار. رعاية مجانية وعالية الجودة لجميع مواطني الشرق الجزائري.",
    hero_btn_primary: "موعد عبر الإنترنت",
    hero_btn_secondary: "خدماتنا الطبية",
    hero_badge_1: "مهام الإنعاش",
    hero_badge_2: "جراحة متطورة",
    hero_badge_3: "طوارئ 24/7",

    // Stats
    stat_beds: "سرير استشفاء",
    stat_icu: "سرير إنعاش",
    stat_exp: "سنوات من الخبرة",
    stat_coverage: "التغطية: شرق الجزائر",

    // Services
    services_title: "تخصصاتنا الطبية",
    services_subtitle: "مركز امتياز مكرس لصحة قلبك",
    srv_1_title: "جراحة القلب المفتوح",
    srv_1_desc: "تدخلات معقدة بأحدث التقنيات الطبية.",
    srv_2_title: "جراحة الأوعية الدموية",
    srv_2_desc: "علاج أمراض الأوعية الدموية وتغيير الشرايين.",
    srv_3_title: "أمراض القلب التداخلية",
    srv_3_desc: "إجراءات طفيفة التوغل، تصوير الأوعية والقسطرة.",
    srv_4_title: "جراحة التشوهات الخلقية",
    srv_4_desc: "رعاية متخصصة لتشوهات القلب.",
    srv_5_title: "استشارات متخصصة",
    srv_5_desc: "متابعة ما بعد الجراحة واستشارات الخبراء.",
    srv_6_title: "التصوير الطبي",
    srv_6_desc: "معدات متطورة، صدى دوبلر وتشخيص دقيق.",

    // Gallery
    gallery_title: "مؤسستنا في صور",
    gallery_subtitle: "اكتشف مرافقنا وبيئتنا الطبية",
    gal_1: "غرفة العمليات",
    gal_2: "مصلحة الإنعاش",
    gal_3: "قاعة الفحص",
    gal_4: "التصوير الطبي",
    gal_5: "مساحة المريض",
    gal_6: "الواجهة الخارجية",
    gal_btn: "عرض المزيد",
    gal_badge: "📸 صورة",

    // How it works
    how_title: "مسار الرعاية الخاص بك",
    how_1_title: "الاستشارة",
    how_1_desc: "الاتصال الأول والتقييم الطبي الشامل.",
    how_2_title: "التشخيص",
    how_2_desc: "فحوصات معمقة وتصوير طبي.",
    how_3_title: "التدخل",
    how_3_desc: "تخطيط وإجراء العملية الجراحية.",
    how_4_title: "المتابعة",
    how_4_desc: "مرافقة ما بعد الجراحة وإعادة التأهيل.",

    // Why us
    why_title: "لماذا تختار مؤسستنا؟",
    why_1_title: "رعاية مجانية",
    why_1_desc: "خدمة عامة تضمن مجانية العلاج بالكامل.",
    why_2_title: "امتياز طبي",
    why_2_desc: "فريق من الجراحين والمتخصصين ذوي الكفاءة العالية.",
    why_3_title: "تغطية إقليمية",
    why_3_desc: "مركز مرجعي لجميع أنحاء الشرق الجزائري.",
    why_4_title: "نظام رقمي",
    why_4_desc: "إدارة حديثة وتسهيل حجز المواعيد.",

    // About
    about_title: "عن المستشفى",
    about_p1: "تأسست المؤسسة الاستشفائية المتخصصة في جراحة القلب بقسنطينة بموجب المرسوم التنفيذي رقم 97/465 المؤرخ في 02 ديسمبر 1997.",
    about_p2: "وهي مؤسسة عمومية ذات طابع إداري من الفئة ب، تخضع لوصاية وزارة الصحة.",
    about_p3: "يحمل المستشفى بكل فخر اسم المجاهد الدكتور الجغري مختار، تكريماً لالتزامه.",
    about_capacity: "قدرة الاستيعاب",
    about_cap_total: "80 سرير إجمالاً",
    about_cap_icu: "10 أسرة إنعاش",
    about_cap_men: "35 سرير (جناح الرجال)",
    about_cap_women: "35 سرير (جناح النساء)",

    // Contact
    contact_title: "اتصل بنا والوصول",
    contact_address: "العنوان",
    contact_address_val: "حي الرياض بن شيكو، قسنطينة، الجزائر",
    contact_hours: "ساعات العمل",
    contact_hours_val: "الإثنين - الجمعة: 08:00 - 16:00",
    contact_emergency: "الطوارئ",
    contact_emergency_val: "24/24 ساعة و 7/7 أيام",
    map_pin_1: "6 كم عن وسط المدينة",
    map_pin_2: "4 كم عن محطة الحافلات",
    map_pin_3: "12 كم عن المطار",

    // Footer
    footer_cta: "اعتن بقلبك — احجز موعدك اليوم",
    footer_mission: "مهمتنا هي توفير رعاية قلبية متطورة لجميع المواطنين، مجانًا وبتفانٍ.",
    footer_quick_links: "روابط سريعة",
    footer_ministry: "تحت وصاية وزارة الصحة",
    footer_decree: "مرسوم تنفيذي رقم 97/465",
    footer_rights: "جميع الحقوق محفوظة.",
  },
  en: {
    // Nav
    nav_home: "Home",
    nav_services: "Services",
    nav_gallery: "Gallery",
    nav_about: "About",
    nav_contact: "Contact",
    btn_appointment: "Book Appointment",

    // Hero
    hero_title: "Excellence in Cardiac Care",
    hero_subtitle: "Dr. Djeghri Mokhtar Specialized Hospital for Cardiac Surgery. High-quality, free healthcare for all citizens of Eastern Algeria.",
    hero_btn_primary: "Online Appointment",
    hero_btn_secondary: "Our Services",
    hero_badge_1: "ICU Missions",
    hero_badge_2: "Advanced Surgery",
    hero_badge_3: "24/7 Emergency",

    // Stats
    stat_beds: "Hospital Beds",
    stat_icu: "ICU Beds",
    stat_exp: "Years Experience",
    stat_coverage: "Coverage: Eastern Algeria",

    // Services
    services_title: "Our Medical Specialties",
    services_subtitle: "A center of excellence dedicated to your heart's health",
    srv_1_title: "Open-Heart Surgery",
    srv_1_desc: "Complex interventions using the latest medical technologies.",
    srv_2_title: "Vascular Surgery",
    srv_2_desc: "Treatment of blood vessel conditions and bypass.",
    srv_3_title: "Interventional Cardiology",
    srv_3_desc: "Minimally invasive procedures, angiography and angioplasty.",
    srv_4_title: "Congenital Surgery",
    srv_4_desc: "Specialized care for heart defects.",
    srv_5_title: "Specialized Consultations",
    srv_5_desc: "Post-operative follow-up and expert consultations.",
    srv_6_title: "Medical Imaging",
    srv_6_desc: "Advanced equipment, echo-Doppler and precise diagnostics.",

    // Gallery
    gallery_title: "Our Facility in Pictures",
    gallery_subtitle: "Discover our installations and medical environment",
    gal_1: "Operating Room",
    gal_2: "ICU Department",
    gal_3: "Consultation Room",
    gal_4: "Medical Imaging",
    gal_5: "Patient Area",
    gal_6: "Exterior View",
    gal_btn: "View More",
    gal_badge: "📸 Photo",

    // How it works
    how_title: "Your Care Journey",
    how_1_title: "Consultation",
    how_1_desc: "Initial contact and comprehensive medical evaluation.",
    how_2_title: "Diagnosis",
    how_2_desc: "In-depth examinations and medical imaging.",
    how_3_title: "Intervention",
    how_3_desc: "Planning and execution of the surgical procedure.",
    how_4_title: "Follow-up",
    how_4_desc: "Post-operative support and rehabilitation.",

    // Why us
    why_title: "Why Choose Our Facility?",
    why_1_title: "Free Care",
    why_1_desc: "Public service guaranteeing completely free healthcare.",
    why_2_title: "Medical Excellence",
    why_2_desc: "Team of highly qualified surgeons and specialists.",
    why_3_title: "Regional Coverage",
    why_3_desc: "Reference center for all of Eastern Algeria.",
    why_4_title: "Digital System",
    why_4_desc: "Modern management and easy appointment booking.",

    // About
    about_title: "About the Hospital",
    about_p1: "The Specialized Hospital for Cardiac Surgery of Constantine was founded by Executive Decree No. 97/465 of December 2, 1997.",
    about_p2: "It is a Category B public establishment with an administrative character, under the supervision of the Ministry of Health.",
    about_p3: "The hospital proudly bears the name of Moudjahid Dr. Djeghri Mokhtar, in tribute to his commitment.",
    about_capacity: "Capacity",
    about_cap_total: "80 Total Beds",
    about_cap_icu: "10 ICU Beds",
    about_cap_men: "35 Beds (Men's Ward)",
    about_cap_women: "35 Beds (Women's Ward)",

    // Contact
    contact_title: "Contact & Access",
    contact_address: "Address",
    contact_address_val: "Cité El Riad Benchicou, Constantine, Algeria",
    contact_hours: "Opening Hours",
    contact_hours_val: "Mon-Fri: 08:00 AM - 04:00 PM",
    contact_emergency: "Emergencies",
    contact_emergency_val: "24/7",
    map_pin_1: "6 km from city center",
    map_pin_2: "4 km from bus station",
    map_pin_3: "12 km from airport",

    // Footer
    footer_cta: "Take care of your heart — Book an appointment today",
    footer_mission: "Our mission is to provide advanced cardiac care to all citizens, free of charge and with dedication.",
    footer_quick_links: "Quick Links",
    footer_ministry: "Under the supervision of the Ministry of Health",
    footer_decree: "Executive Decree No. 97/465",
    footer_rights: "All rights reserved.",
  }
};

type Lang = "fr" | "ar" | "en";

function AnimatedCounter({ end, duration = 2000 }: { end: number, duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTimestamp: number;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>("fr");
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative">
      {/* SECTION 0 — GOVERNMENT BANNER */}
      <div className="hidden md:flex items-center justify-center h-10 w-full relative z-50 overflow-hidden bg-[#F0F0F0] dark:bg-gray-900 border-b border-border">
        {/* Algerian Flag Colors Strip behind */}
        <div className="absolute inset-0 flex opacity-10 dark:opacity-20 pointer-events-none">
          <div className="w-1/3 h-full bg-[#006233]"></div>
          <div className="w-1/3 h-full bg-white dark:bg-transparent"></div>
          <div className="w-1/3 h-full bg-[#D21034]"></div>
        </div>

        <div className="flex items-center gap-3 relative z-10 font-bold text-[11px] text-[#1E3A5F] dark:text-gray-200">
          <span className="text-[#006233] text-lg leading-none">☪</span>
          <span>الجمهورية الجزائرية الديمقراطية الشعبية | République Algérienne Démocratique et Populaire</span>
        </div>
      </div>

      {/* SECTION 1 — NAVBAR */}
      <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm" : "bg-white dark:bg-[#111827]"
        }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-secondary/10 p-2 rounded-xl text-secondary">
                <HeartPulse className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight text-primary dark:text-white">EHS Dr. Djeghri Mokhtar</span>
                <span className="text-xs text-muted-foreground">Chirurgie Cardiaque Constantine</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8 font-medium text-sm">
              <button onClick={() => scrollTo('hero')} className="hover:text-secondary transition-colors">{t.nav_home}</button>
              <button onClick={() => scrollTo('services')} className="hover:text-secondary transition-colors">{t.nav_services}</button>
              <button onClick={() => scrollTo('gallery')} className="hover:text-secondary transition-colors">{t.nav_gallery}</button>
              <button onClick={() => scrollTo('about')} className="hover:text-secondary transition-colors">{t.nav_about}</button>
              <button onClick={() => scrollTo('contact')} className="hover:text-secondary transition-colors">{t.nav_contact}</button>
            </nav>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Language Switcher */}
              <div className="flex bg-muted/50 rounded-lg p-1">
                {(['fr', 'ar', 'en'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === l ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-white' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {l === 'ar' ? '🇩🇿 AR' : l === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
                  </button>
                ))}
              </div>

              {/* Dark Mode Toggle */}
              <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Toggle dark mode">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <Button
                onClick={() => window.location.href = 'http://192.168.100.50'}
                className="bg-secondary hover:bg-secondary/90 text-white shadow-md hover:shadow-lg transition-all rounded-full px-6"
              >
                {t.btn_appointment}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 w-full bg-white dark:bg-gray-900 shadow-xl border-b border-border flex flex-col p-4 animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-4 mb-6">
              <button onClick={() => scrollTo('hero')} className="text-start py-2 font-medium border-b border-border/50">{t.nav_home}</button>
              <button onClick={() => scrollTo('services')} className="text-start py-2 font-medium border-b border-border/50">{t.nav_services}</button>
              <button onClick={() => scrollTo('gallery')} className="text-start py-2 font-medium border-b border-border/50">{t.nav_gallery}</button>
              <button onClick={() => scrollTo('about')} className="text-start py-2 font-medium border-b border-border/50">{t.nav_about}</button>
              <button onClick={() => scrollTo('contact')} className="text-start py-2 font-medium border-b border-border/50">{t.nav_contact}</button>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {(['fr', 'ar', 'en'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-3 py-2 text-xs font-bold rounded-md border ${lang === l ? 'bg-primary text-white border-primary' : 'bg-transparent border-border'}`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              <button onClick={toggleDarkMode} className="p-2 border border-border rounded-md">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
            <Button onClick={() => window.location.href = 'http://192.168.100.50'} className="w-full bg-secondary text-white py-6 text-lg">{t.btn_appointment}</Button>
          </div>
        )}
      </header>

      {/* SECTION 2 — HERO */}
      <section id="hero" className="relative min-h-[90vh] flex items-center pt-10 pb-20 overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#1a4a7a] to-[#2196A6]">
        {/* Subtle watermark pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\\"60\\" height=\\"60\\" viewBox=\\"0 0 60 60\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cg fill=\\"none\\" fill-rule=\\"evenodd\\"%3E%3Cg fill=\\"%23ffffff\\" fill-opacity=\\"1\\"%3E%3Cpath d=\\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-white">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Col */}
            <div className="flex-1 w-full flex flex-col gap-6 lg:w-[60%]">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full w-max text-sm text-green-50 shadow-sm mb-4">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span>مؤسسة عمومية ذات طابع إداري | Établissement Public</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                {t.hero_title}
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed drop-shadow-sm">
                {t.hero_subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <Button onClick={() => window.location.href = 'http://192.168.100.50'} size="lg" className="bg-white text-[#1E3A5F] hover:bg-gray-100 rounded-full text-base font-semibold px-8 h-14 shadow-lg flex items-center gap-2">
                  {t.hero_btn_primary}
                  <ArrowRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 rounded-full text-base font-semibold px-8 h-14">
                  {t.hero_btn_secondary}
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-white/20 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" /> <span>{t.hero_badge_1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" /> <span>{t.hero_badge_2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" /> <span>{t.hero_badge_3}</span>
                </div>
              </div>
            </div>

            {/* Right Col */}
            <div className="w-full lg:w-[40%] flex justify-center mt-12 lg:mt-0">
              <div className="relative w-full max-w-md aspect-square bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/20 p-8 shadow-2xl flex flex-col items-center justify-center group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <svg className="w-full h-auto text-white drop-shadow-lg" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M0,50 L40,50 L50,20 L70,80 L80,50 L200,50"
                    className="animate-[dash_3s_linear_infinite]"
                    strokeDasharray="400" strokeDashoffset="400">
                    <animate attributeName="stroke-dashoffset" values="400;0" dur="2.5s" repeatCount="indefinite" />
                  </path>
                </svg>
                <div className="mt-8 text-center animate-pulse">
                  <HeartPulse className="w-16 h-16 text-red-400 mx-auto mb-4 drop-shadow-lg" />
                  <p className="text-2xl font-bold tracking-widest text-blue-50">EHS CONSTANTINE</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Curved wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.95,123.3,191.75,108.9C236.7,98.6,281.7,77.7,321.39,56.44Z" className="fill-background"></path>
          </svg>
        </div>
      </section>

      {/* SECTION 3 — STATS BAR */}
      <section className="relative z-20 -mt-10 md:-mt-16 container mx-auto px-4 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: 80, label: t.stat_beds, icon: FileDigit, color: "border-t-[#1E3A5F]" },
            { value: 10, label: t.stat_icu, icon: Activity, color: "border-t-[#C62828]" },
            { value: 25, label: t.stat_exp, icon: Award, color: "border-t-[#006233]", plus: true },
            { value: 1, label: t.stat_coverage, icon: MapPin, color: "border-t-[#2196A6]" }
          ].map((stat, i) => (
            <div key={i} className={`bg-card rounded-2xl shadow-xl p-8 border border-border border-t-4 ${stat.color} flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300`}>
              <div className="bg-muted p-4 rounded-full mb-4">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-4xl font-extrabold text-foreground mb-2 flex items-center">
                <AnimatedCounter end={stat.value} />
                {stat.plus && <span className="text-2xl ml-1">+</span>}
              </h3>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — SERVICES */}
      <section id="services" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-wider text-secondary uppercase mb-3">{t.services_subtitle}</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-primary dark:text-white">{t.services_title}</h3>
            <div className="w-24 h-1 bg-secondary mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: t.srv_1_title, desc: t.srv_1_desc, icon: Heart, color: "bg-[#C62828]" },
              { title: t.srv_2_title, desc: t.srv_2_desc, icon: Activity, color: "bg-[#2196A6]" },
              { title: t.srv_3_title, desc: t.srv_3_desc, icon: Zap, color: "bg-[#F9A825]" },
              { title: t.srv_4_title, desc: t.srv_4_desc, icon: Baby, color: "bg-[#1B6B3A]" },
              { title: t.srv_5_title, desc: t.srv_5_desc, icon: Stethoscope, color: "bg-[#1E3A5F]" },
              { title: t.srv_6_title, desc: t.srv_6_desc, icon: FileDigit, color: "bg-[#006233]" }
            ].map((srv, i) => (
              <div key={i} className="group bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <div className={`w-14 h-14 rounded-2xl ${srv.color} flex items-center justify-center text-white mb-6 transform group-hover:rotate-12 transition-transform duration-300`}>
                  <srv.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">{srv.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{srv.desc}</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-border to-transparent group-hover:via-secondary transition-all"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — PHOTO GALLERY */}
      <section id="gallery" className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-wider text-secondary uppercase mb-3">{t.gallery_subtitle}</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-primary dark:text-white">{t.gallery_title}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Replace gradient divs with <img> tags */}
            {[
              { title: t.gal_1, img: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1000", icon: Heart, span: "lg:col-span-2 lg:row-span-2" },
              { title: t.gal_2, img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1000", icon: Activity, span: "" },
              { title: t.gal_3, img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000", icon: Stethoscope, span: "" },
              { title: t.gal_4, img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1000", icon: FileDigit, span: "" },
              { title: t.gal_5, img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000", icon: Users, span: "md:col-span-2" },
              { title: t.gal_6, img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000", icon: Building, span: "" }
            ].map((item, i) => (
              <div key={i} className={`relative rounded-3xl overflow-hidden group cursor-pointer ${item.span}`}>
                <img
                  src={item.img}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Decorative Pattern overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30"></div>

                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="self-end bg-black/30 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                    {t.gal_badge}
                  </div>

                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <item.icon className="w-8 h-8 text-white/80 mb-3" />
                    <h4 className="text-white text-xl font-bold mb-2">{item.title}</h4>
                    <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 text-xs">
                      {t.gal_btn}
                    </Button>
                  </div>
                </div>
                {/* Overlay gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — HOW IT WORKS */}
      <section className="py-24 bg-card border-y border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-primary dark:text-white mb-20">{t.how_title}</h3>

          <div className="flex flex-col lg:flex-row relative">
            {/* Desktop connecting line */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-border border-dashed border-2"></div>

            {/* Mobile connecting line */}
            <div className="lg:hidden absolute top-[10%] bottom-[10%] left-[39px] w-0.5 bg-border border-dashed border-2"></div>

            {[
              { step: 1, title: t.how_1_title, desc: t.how_1_desc },
              { step: 2, title: t.how_2_title, desc: t.how_2_desc },
              { step: 3, title: t.how_3_title, desc: t.how_3_desc },
              { step: 4, title: t.how_4_title, desc: t.how_4_desc }
            ].map((step, i) => (
              <div key={i} className="flex-1 flex lg:flex-col items-start lg:items-center relative z-10 mb-12 lg:mb-0 gap-6 lg:gap-0">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-background shadow-xl lg:mb-8 shrink-0">
                  {step.step}
                </div>
                <div className="lg:text-center mt-2 lg:mt-0">
                  <h4 className="text-xl font-bold text-foreground mb-2">{step.title}</h4>
                  <p className="text-muted-foreground text-sm max-w-xs">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — WHY CHOOSE US */}
      <section className="py-24 bg-[#1E3A5F] text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-16">{t.why_title}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: t.why_1_title, desc: t.why_1_desc, icon: ShieldCheck },
              { title: t.why_2_title, desc: t.why_2_desc, icon: Award },
              { title: t.why_3_title, desc: t.why_3_desc, icon: Globe },
              { title: t.why_4_title, desc: t.why_4_desc, icon: Smartphone }
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-colors">
                <item.icon className="w-10 h-10 text-[#2196A6] mb-6" />
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-blue-100/80 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — ABOUT */}
      <section id="about" className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-8">{t.about_title}</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                <p>{t.about_p1}</p>
                <p>{t.about_p2}</p>
                <p className="font-medium text-foreground p-4 bg-muted/50 rounded-xl border-l-4 border-secondary">
                  {t.about_p3}
                </p>
              </div>

              <div className="mt-12 space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary shrink-0 font-bold">1997</div>
                  <div>
                    <h5 className="font-bold text-foreground">Décret N°97/465</h5>
                    <p className="text-sm text-muted-foreground">Création officielle de l'établissement</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Building className="text-secondary" /> {t.about_capacity}
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{t.about_cap_total}</span>
                    <span className="font-bold text-primary">80</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-primary h-3 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{t.about_cap_icu}</span>
                    <span className="font-bold text-red-500">10</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-red-500 h-3 rounded-full" style={{ width: '12.5%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{t.about_cap_men}</span>
                    <span className="font-bold text-secondary">35</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-secondary h-3 rounded-full" style={{ width: '43.75%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{t.about_cap_women}</span>
                    <span className="font-bold text-amber-500">35</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-amber-500 h-3 rounded-full" style={{ width: '43.75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — CONTACT */}
      <section id="contact" className="py-24 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-primary dark:text-white">{t.contact_title}</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-2xl border border-border flex gap-6 items-center shadow-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{t.contact_address}</h4>
                  <p className="text-muted-foreground">{t.contact_address_val}</p>
                </div>
              </div>

              <div className="bg-card p-6 rounded-2xl border border-border flex gap-6 items-center shadow-sm">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center text-secondary shrink-0">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{t.contact_hours}</h4>
                  <p className="text-muted-foreground">{t.contact_hours_val}</p>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-2xl border border-red-200 dark:border-red-900 flex gap-6 items-center shadow-sm">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center text-red-600 shrink-0">
                  <Phone className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-red-700 dark:text-red-400">{t.contact_emergency}</h4>
                  <p className="text-red-600/80 dark:text-red-400/80 font-medium">{t.contact_emergency_val}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-3xl border border-border shadow-md overflow-hidden relative min-h-[400px] flex items-center justify-center">
              {/* Map Placeholder */}
              <div className="absolute inset-0 bg-[#e5e3df] dark:bg-[#262626]">
                <div className="w-full h-full opacity-30 dark:opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiMwMDAiLz48L3N2Zz4=')]"></div>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-4 shadow-xl animate-bounce">
                  <MapPin className="w-8 h-8" />
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl text-center border border-border">
                  <p className="font-bold mb-2">EHS Dr. Djeghri Mokhtar</p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{t.map_pin_1}</span>
                    <span>{t.map_pin_2}</span>
                    <span>{t.map_pin_3}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10 — FOOTER */}
      <footer className="bg-[#0F1923] text-white pt-16">
        {/* Top CTA Band */}
        <div className="container mx-auto px-4 lg:px-8 mb-16">
          <div className="bg-gradient-to-r from-secondary to-primary rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <HeartPulse className="w-64 h-64" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold relative z-10">{t.footer_cta}</h3>
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 rounded-full shrink-0 relative z-10">
              {t.btn_appointment}
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-12">
            {/* Col 1 */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <HeartPulse className="w-8 h-8 text-secondary" />
                <span className="font-bold text-xl">EHS Constantine</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                {t.footer_mission}
              </p>
              <div className="inline-block bg-[#1B6B3A]/20 border border-[#1B6B3A]/50 text-[#1B6B3A] px-4 py-2 rounded-lg font-medium text-sm">
                {lang === 'ar' ? 'علاج مجاني 100%' : 'Soins 100% Gratuits'}
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="font-bold text-lg mb-6">{t.footer_quick_links}</h4>
              <ul className="space-y-4 text-gray-400">
                <li><button onClick={() => scrollTo('services')} className="hover:text-white transition-colors">{t.nav_services}</button></li>
                <li><button onClick={() => scrollTo('gallery')} className="hover:text-white transition-colors">{t.nav_gallery}</button></li>
                <li><button onClick={() => scrollTo('about')} className="hover:text-white transition-colors">{t.nav_about}</button></li>
                <li><button onClick={() => scrollTo('contact')} className="hover:text-white transition-colors">{t.nav_contact}</button></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="font-bold text-lg mb-6">Informations Officielles</h4>
              <div className="space-y-4 text-gray-400 text-sm">
                <p className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                  {t.footer_ministry}
                </p>
                <p className="flex items-center gap-2">
                  <FileDigit className="w-5 h-5 text-secondary" />
                  {t.footer_decree}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} EHS Dr. Djeghri Mokhtar. {t.footer_rights}</p>
            <div className="flex items-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Algeria.svg/20px-Flag_of_Algeria.svg.png" alt="Algérie" />
              <span>Ministère de la Santé — Algérie</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 w-12 h-12 bg-secondary text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 hover:bg-secondary/90 hover:scale-110 ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
        aria-label="Back to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

    </div>
  );
}