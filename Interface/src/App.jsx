import { useState, useEffect, useRef, useCallback } from "react";
import { translations } from "@/lib/translations";
import {
    Heart,
    Menu,
    X,
    Sun,
    Moon,
    ArrowRight,
    Bed,
    Clock,
    MapPin,
    Activity,
    Zap,
    Baby,
    Stethoscope,
    Scan,
    Building2,
    Users,
    ChevronUp,
    Phone,
    Gift,
    Award,
    Globe,
    Monitor,
    Calendar,
    FileText,
    CheckCircle,
    User,
    Stethoscope as ScanIcon // Avoid scan naming conflict if any
} from "lucide-react";
import { Button } from "@/components/ui/button";

const LOGIN_URL = "http://localhost:5173/login";

export default function App() {
    const [lang, setLang] = useState("fr");
    const [darkMode, setDarkMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);

    const t = translations[lang];
    const isRtl = lang === "ar";

    // Stats counter refs
    const statsRef = useRef(null);
    const [statsVisible, setStatsVisible] = useState(false);
    const [counters, setCounters] = useState({ beds: 0, icu: 0, years: 0, free: 0 });

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            setShowBackToTop(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Handle dark mode
    useEffect(() => {
        const saved = localStorage.getItem("darkMode");
        if (saved) setDarkMode(JSON.parse(saved));
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    // Handle language direction
    useEffect(() => {
        document.documentElement.dir = isRtl ? "rtl" : "ltr";
        document.documentElement.lang = lang;
        // Apply fonts correctly in standard CSS or HTML if needed, but here it's classes
    }, [lang, isRtl]);

    // Stats counter animation
    const animateCounters = useCallback(() => {
        const targets = { beds: 80, icu: 10, years: 25, free: 100 };
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            setCounters({
                beds: Math.floor(targets.beds * progress),
                icu: Math.floor(targets.icu * progress),
                years: Math.floor(targets.years * progress),
                free: Math.floor(targets.free * progress),
            });
            if (step >= steps) clearInterval(timer);
        }, interval);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !statsVisible) {
                    setStatsVisible(true);
                    animateCounters();
                }
            },
            { threshold: 0.3 }
        );
        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, [statsVisible, animateCounters]);

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
    };

    const navLinks = [
        { id: "hero", label: t.home },
        { id: "services", label: t.services },
        { id: "gallery", label: t.gallery },
        { id: "about", label: t.about },
        { id: "contact", label: t.contact },
    ];

    return (
        <div className={`min-h-screen ${isRtl ? "font-arabic" : "font-sans"} ${darkMode ? 'dark' : ''} bg-background text-foreground transition-colors duration-300`}>
            {/* Government Banner */}
            <div className="hidden md:flex h-10 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex">
                    <div className="w-8 bg-[#006233]" />
                    <div className="flex-1 bg-white" />
                    <div className="w-8 bg-[#D21034]" />
                </div>
                <div className="relative z-10 flex items-center gap-3 text-[11px] text-[#1E3A5F]">
                    <span className="text-[#006233] text-lg">&#9770;</span>
                    <span className="font-medium">{t.governmentBanner}</span>
                </div>
            </div>

            {/* Navbar */}
            <nav
                className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
                    ? "glass shadow-lg py-2"
                    : "bg-transparent py-4"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-destructive animate-heartbeat" />
                            </div>
                            <div className={`${isRtl ? "text-right" : "text-left"}`}>
                                <div className="font-bold text-xs sm:text-sm text-foreground leading-tight truncate max-w-[120px] sm:max-w-none">{t.hospitalName}</div>
                                <div className="text-[10px] sm:text-xs text-muted-foreground hidden xs:block">{t.hospitalSubname}</div>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollToSection(link.id)}
                                    className="text-sm font-medium text-foreground hover:text-secondary transition-colors"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Language Switcher */}
                            <div className="flex items-center rounded-lg border border-border overflow-hidden">
                                {["ar", "fr", "en"].map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setLang(l)}
                                        className={`px-2 py-1 text-xs font-medium transition-colors ${lang === l
                                            ? "bg-secondary text-secondary-foreground"
                                            : "text-foreground hover:bg-muted"
                                            }`}
                                    >
                                        {l === "ar" ? "AR" : l === "fr" ? "FR" : "EN"}
                                    </button>
                                ))}
                            </div>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 rounded-lg hover:bg-muted transition-all duration-300"
                                aria-label="Toggle dark mode"
                            >
                                {darkMode ? (
                                    <Sun className="w-5 h-5 text-yellow-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
                                ) : (
                                    <Moon className="w-5 h-5 text-foreground transition-transform duration-300 hover:-rotate-12" />
                                )}
                            </button>

                            {/* CTA Button */}
                            <Button
                                onClick={() => window.location.href = LOGIN_URL}
                                className="hidden sm:flex bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                            >
                                {t.bookAppointment}
                            </Button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-muted"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu - Island Style */}
                {
                    mobileMenuOpen && (
                        <div className="lg:hidden fixed inset-x-4 top-20 z-50">
                            <div className="glass rounded-3xl p-6 shadow-2xl animate-fade-in-up border-primary/10">
                                <div className="grid grid-cols-1 gap-2">
                                    {navLinks.map((link, i) => (
                                        <button
                                            key={link.id}
                                            onClick={() => scrollToSection(link.id)}
                                            className={`flex items-center gap-4 w-full py-4 px-5 text-foreground hover:bg-primary/5 rounded-2xl transition-all active:scale-95 ${isRtl ? "flex-row-reverse text-right" : ""}`}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-sm font-bold text-primary/60">
                                                {String(i + 1).padStart(2, '0')}
                                            </div>
                                            <span className="font-semibold text-lg">{link.label}</span>
                                        </button>
                                    ))}

                                    <div className="h-px bg-border my-4" />

                                    <Button
                                        onClick={() => window.location.href = LOGIN_URL}
                                        className="w-full bg-secondary hover:bg-secondary/90 text-white py-8 text-xl rounded-2xl shadow-xl shadow-secondary/20"
                                    >
                                        <Calendar className="w-6 h-6 mr-3" />
                                        {t.bookAppointment}
                                    </Button>
                                </div>
                            </div>
                            {/* Overlay to close */}
                            <div
                                className="fixed inset-0 -z-10 bg-black/20 backdrop-blur-sm lg:hidden"
                                onClick={() => setMobileMenuOpen(false)}
                            />
                        </div>
                    )
                }
            </nav >

            {/* Hero Section */}
            < section id="hero" className="relative min-h-[85vh] sm:min-h-[90vh] overflow-hidden" >
                {/* Background Image */}
                < div className="absolute inset-0" >
                    <img
                        src={darkMode
                            ? "https://images.unsplash.com/photo-1542884748-2b87b36c6b90?w=1920&h=1080&fit=crop" // Night building image
                            : "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1920&h=1080&fit=crop" // Day building image
                        }
                        alt="Modern hospital building exterior"
                        className="w-full h-full object-cover scale-105 animate-pulse-slow"
                    />
                    {/* Gradient overlay adapting to dark mode to spotlight the center slowly */}
                    <div className={`absolute inset-0 transition-colors duration-1000 ${darkMode
                        ? "bg-gradient-to-b sm:bg-gradient-to-r from-[#0F1923]/95 via-[#0F1923]/70 to-[#0F1923]/40"
                        : "bg-gradient-to-b sm:bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40"
                        }`} />
                </div >

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[65vh] sm:min-h-[70vh]">
                        {/* Left Column - Content */}
                        <div className={`text-white ${isRtl ? "text-right" : "text-left"}`}>
                            {/* Official Badge */}
                            <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6 sm:mb-8 ${isRtl ? "flex-row-reverse" : ""}`}>
                                <span className="text-[#006233] text-base sm:text-lg">&#9770;</span>
                                <span className="text-[10px] sm:text-xs font-medium">{t.officialSealTop}</span>
                            </div>

                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-balance">
                                {t.heroTitle}
                            </h1>
                            <p className="text-base sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-xl leading-relaxed">
                                {t.heroSubtitle}
                            </p>

                            {/* CTA Buttons - Stack on mobile */}
                            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 ${isRtl ? "sm:justify-end" : "sm:justify-start"}`}>
                                <Button
                                    size="lg"
                                    className="bg-secondary hover:bg-secondary/90 text-white font-bold shadow-2xl shadow-secondary/30 w-full sm:w-auto py-8 sm:py-6 text-lg rounded-2xl transition-all hover:scale-105 active:scale-95"
                                    onClick={() => window.location.href = LOGIN_URL}
                                >
                                    {t.heroCta1}
                                    <ArrowRight className={`w-6 h-6 ${isRtl ? "mr-3 rotate-180" : "ml-3"}`} />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-white/30 text-white bg-white/5 backdrop-blur-md hover:bg-white/10 w-full sm:w-auto py-8 sm:py-6 text-lg rounded-2xl transition-all"
                                    onClick={() => scrollToSection("services")}
                                >
                                    {t.heroCta2}
                                </Button>
                            </div>

                            {/* Stats Row - Improved mobile layout */}
                            <div className={`grid grid-cols-1 sm:flex sm:flex-wrap gap-3 sm:gap-4 ${isRtl ? "sm:justify-end" : "sm:justify-start"}`}>
                                {[
                                    { icon: Bed, label: t.heroStat1 },
                                    { icon: Clock, label: t.heroStat2 },
                                    { icon: MapPin, label: t.heroStat3 },
                                ].map((stat, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                                        <stat.icon className="w-5 h-5 text-[#2196A6]" />
                                        <span className="text-sm font-medium text-white">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Featured Card */}
                        <div className="hidden lg:flex items-center justify-center">
                            <div className="relative">
                                {/* Main Image Card */}
                                <div className="w-80 h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                                    <img
                                        src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=800&fit=crop"
                                        alt="Cardiac surgery team"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Floating Stats Card */}
                                <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-xl p-5 w-48 border border-border/50">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                                            <Heart className="w-6 h-6 text-accent" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-foreground">25+</div>
                                            <div className="text-xs text-muted-foreground">{t.statYears}</div>
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-secondary/20 rounded-full overflow-hidden">
                                        <div className="h-full w-full bg-gradient-to-r from-accent to-secondary rounded-full" />
                                    </div>
                                </div>

                                {/* ECG Animation Overlay */}
                                <div className="absolute -top-4 -right-4 bg-primary dark:bg-slate-800 rounded-xl p-3 shadow-xl border border-border/50">
                                    <svg viewBox="0 0 100 40" className="w-20 h-8">
                                        <path
                                            d="M0,20 L15,20 L20,10 L25,30 L30,5 L35,35 L40,20 L55,20 L60,10 L65,30 L70,5 L75,35 L80,20 L100,20"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="animate-ecg text-destructive"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Stats Section */}
            < section ref={statsRef} className="py-20 sm:py-32 bg-background relative overflow-hidden" >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                        {[
                            { value: counters.beds, label: t.statBeds, icon: Bed, color: "#2196A6", bgColor: "#2196A6" },
                            { value: counters.icu, label: t.statIcu, icon: Activity, color: "#C62828", bgColor: "#C62828" },
                            { value: `${counters.years}+`, label: t.statYears, icon: Award, color: "#006233", bgColor: "#006233" },
                            { value: `${counters.free}%`, label: t.statFree, icon: Gift, color: "#F9A825", bgColor: "#F9A825" },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md sm:shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 border border-border group"
                            >
                                <div className="flex items-center sm:items-start gap-3 sm:gap-0 sm:flex-col">
                                    <div
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shrink-0 sm:mb-4"
                                        style={{ backgroundColor: `${stat.bgColor}15` }}
                                    >
                                        <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: stat.color }} />
                                    </div>
                                    <div>
                                        <div className="text-xl sm:text-4xl font-bold font-mono text-foreground mb-0 sm:mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Services Section */}
            < section id="services" className="py-24 sm:py-32 bg-muted/30" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
                        <div className={isRtl ? "text-right" : ""}>
                            <span className="text-[#2196A6] font-semibold text-sm uppercase tracking-wider mb-4 block">{t.services}</span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t.servicesTitle}</h2>
                            <p className="text-lg text-muted-foreground">{t.servicesSubtitle}</p>
                        </div>
                        <div className="relative hidden lg:block">
                            <div className="rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src="https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=500&fit=crop"
                                    alt="Cardiac surgery team in operation"
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground px-6 py-3 rounded-xl shadow-lg border border-border/50">
                                <div className="flex items-center gap-2">
                                    <Heart className="w-5 h-5" />
                                    <span className="font-semibold">6 {t.services}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Heart, title: t.service1Title, desc: t.service1Desc, color: "#C62828" },
                            { icon: Activity, title: t.service2Title, desc: t.service2Desc, color: "#2196A6" },
                            { icon: Zap, title: t.service3Title, desc: t.service3Desc, color: "#F9A825" },
                            { icon: Baby, title: t.service4Title, desc: t.service4Desc, color: "#1B6B3A" },
                            { icon: Stethoscope, title: t.service5Title, desc: t.service5Desc, color: "#1E3A5F" },
                            { icon: Scan, title: t.service6Title, desc: t.service6Desc, color: "#006233" },
                        ].map((service, i) => (
                            <div
                                key={i}
                                className="group bg-card rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#2196A6]/30"
                            >
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: `${service.color}15` }}
                                >
                                    <service.icon className="w-7 h-7" style={{ color: service.color }} />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                                <div className="mt-4 flex items-center text-[#2196A6] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span>{t.viewMore}</span>
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Gallery Section */}
            < section id="gallery" className="py-24 sm:py-32 bg-background" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t.galleryTitle}</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.gallerySubtitle}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Main Photo - Spans 2 columns */}
                        <div className="md:col-span-2 md:row-span-2 group relative min-h-[400px] rounded-2xl overflow-hidden shadow-xl">
                            <img
                                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&h=800&fit=crop"
                                alt="Cardiac surgery operating room"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 dark:from-background/95 dark:via-background/50 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                <span className="px-4 py-1.5 bg-secondary rounded-full text-xs font-medium mb-4 inline-block shadow-sm">{t.photo1Badge}</span>
                                <h3 className="text-2xl font-bold mb-2">{t.photo1Title}</h3>
                                <p className="text-sm text-white/80 max-w-md">{t.photo1Desc}</p>
                            </div>
                        </div>

                        {/* Other Photos */}
                        {[
                            { title: t.photo2Title, image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&h=400&fit=crop", alt: "Surgical operating room" },
                            { title: t.photo3Title, image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=400&fit=crop", alt: "Intensive care unit" },
                            { title: t.photo4Title, image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600&h=400&fit=crop", alt: "Doctor consultation" },
                            { title: t.photo5Title, image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&h=400&fit=crop", alt: "Medical imaging equipment" },
                            { title: t.photo6Title, image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop", alt: "Hospital patient area" },
                        ].map((photo, i) => (
                            <div
                                key={i}
                                className="group relative min-h-[200px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <img
                                    src={photo.image}
                                    alt={photo.alt}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 dark:from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-sm font-semibold">{photo.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* How It Works Section */}
            < section className="py-20 bg-muted/30" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t.howItWorksTitle}</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.howItWorksSubtitle}</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                        {/* Connecting Line - Desktop */}
                        <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-[2px] border-t-2 border-dashed border-[#2196A6]/40" />

                        {[
                            { icon: User, title: t.step1Title, desc: t.step1Desc },
                            { icon: Calendar, title: t.step2Title, desc: t.step2Desc },
                            { icon: FileText, title: t.step3Title, desc: t.step3Desc },
                            { icon: CheckCircle, title: t.step4Title, desc: t.step4Desc },
                        ].map((step, i) => (
                            <div key={i} className="relative text-center">
                                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary dark:from-slate-800 dark:to-secondary/50 flex items-center justify-center mb-6 shadow-lg relative z-10 border border-border/50">
                                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center shadow-md">
                                        {i + 1}
                                    </span>
                                    <step.icon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* About Section */}
            < section id="about" className="py-20 bg-background" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left - Image Grid */}
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="rounded-2xl overflow-hidden shadow-lg h-48">
                                        <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop" alt="Medical team" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-lg h-64">
                                        <img src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&h=400&fit=crop" alt="Cardiologist" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-8">
                                    <div className="rounded-2xl overflow-hidden shadow-lg h-64">
                                        <img src="https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=400&h=400&fit=crop" alt="Heart surgery" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-lg h-48">
                                        <img src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400&h=300&fit=crop" alt="Equipment" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                            {/* Experience Badge */}
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-primary dark:bg-slate-800 text-primary-foreground dark:text-white px-8 py-4 rounded-2xl shadow-xl border border-border/50">
                                <div className="text-center">
                                    <div className="text-3xl font-bold">25+</div>
                                    <div className="text-xs text-white/80">{t.statYears}</div>
                                </div>
                            </div>
                        </div>

                        {/* Right - Content */}
                        <div className={isRtl ? "text-right" : ""}>
                            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t.aboutTitle}</h2>
                            <p className="text-lg text-muted-foreground mb-8">{t.aboutSubtitle}</p>
                            <div className="space-y-4 mb-10 text-muted-foreground">
                                <p className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                    <span>{t.aboutFoundation}</span>
                                </p>
                                <p className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                    <span>{t.aboutCategory}</span>
                                </p>
                                <p className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                    <span>{t.aboutNaming}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Contact Section */}
            < section id="contact" className="py-20 bg-muted/30" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t.contactTitle}</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.contactSubtitle}</p>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            {[
                                { icon: MapPin, label: t.addressLabel, value: t.address, sub: t.addressDetails, color: "#2196A6" },
                                { icon: Clock, label: t.hoursLabel, value: t.hours, color: "#006233" },
                                { icon: Activity, label: t.emergencyLabel, value: t.emergency, badge: true, color: "#C62828" },
                                { icon: Phone, label: t.phoneLabel, value: t.phone, color: "#3B82F6" },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className={`bg-card rounded-xl p-5 shadow-md flex items-start gap-4 ${isRtl ? "flex-row-reverse text-right" : ""}`}
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: `${item.color}20` }}
                                    >
                                        <item.icon className="w-6 h-6" style={{ color: item.color }} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.label}</div>
                                        <div className="font-semibold text-foreground flex items-center gap-2">
                                            {item.value}
                                            {item.badge && <span className="px-2 py-0.5 bg-destructive text-white text-[10px] rounded-full">24/7</span>}
                                        </div>
                                        {item.sub && <div className="text-xs text-muted-foreground mt-1">{item.sub}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <a
                            href="https://maps.app.goo.gl/dCb24xvc4cZuaSkH6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative rounded-2xl overflow-hidden shadow-xl min-h-[350px] bg-muted group block border-2 border-transparent hover:border-[#2196A6]/30 transition-all duration-300 cursor-pointer"
                        >
                            {/* Embedded Google Map */}
                            <iframe
                                src="https://maps.google.com/maps?q=Plateau+Mansourah,+Constantine,+DZ&t=&z=14&ie=UTF8&iwloc=&output=embed"
                                className="absolute inset-0 w-full h-full border-0 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-300 z-0 grayscale-[20%] group-hover:grayscale-0"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Map Location"
                            ></iframe>

                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent z-10 group-hover:via-background/40 transition-colors duration-300"></div>

                            {/* Interactive UI Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center z-20 pb-8">
                                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-2xl mb-4 group-hover:scale-110 group-active:scale-95 transition-transform duration-500 ring-4 ring-white/20 dark:ring-slate-800/20 translate-y-4 group-hover:translate-y-0 opacity-80 group-hover:opacity-100">
                                    <MapPin className="w-7 h-7 text-[#C62828] group-hover:animate-bounce" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-[#2196A6] transition-colors">{t.hospitalName}</h3>
                                <p className="text-sm font-medium text-foreground drop-shadow-md">{t.address}</p>

                                <div className="mt-3 flex items-center gap-2 px-6 py-2.5 bg-[#2196A6] text-white text-sm font-semibold rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#1a7a87]">
                                    <Globe className="w-4 h-4" />
                                    <span>Google Maps</span>
                                    <ArrowRight className="w-4 h-4 ml-1 -rotate-45" />
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </section >

            {/* Footer */}
            < footer className="bg-[#1E3A5F] dark:bg-[#06090e] text-white py-16 border-t border-white/5" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                        <div className="flex items-center gap-3">
                            <Heart className="w-8 h-8 text-destructive animate-heartbeat" />
                            <span className="text-2xl font-bold tracking-tight">EHS Dr. Djeghri Mokhtar</span>
                        </div>
                        <div className="flex gap-6">
                            {navLinks.map(link => (
                                <button key={link.id} onClick={() => scrollToSection(link.id)} className="text-sm font-medium hover:text-secondary-foreground transition-colors">
                                    {link.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-px bg-white/10 mb-8" />
                    <div className="text-center text-white/60 text-sm max-w-xl mx-auto leading-relaxed">
                        <p className="mb-2">Under the supervision of the Ministry of Health — Algeria</p>
                        <p>&copy; {new Date().getFullYear()} {t.hospitalName}. {t.copyright}</p>
                    </div>
                </div>
            </footer >

            {/* Floating Emergency Button */}
            < div className={`fixed bottom-8 ${isRtl ? "left-8" : "right-8"} z-[60] flex flex-col items-center gap-2 group`
            }>
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl whitespace-nowrap pointer-events-none">
                    {t.emergency} 24/7
                </div>
                <a
                    href="tel:+213123456789"
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-destructive text-white rounded-full flex items-center justify-center shadow-2xl shadow-destructive/40 animate-emergency transition-transform active:scale-90 relative"
                    aria-label="Appel d'urgence"
                >
                    <Phone className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-white text-destructive text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-destructive animate-pulse">
                        SOS
                    </span>
                </a>
            </div >

            {/* Scroll Progress Bar */}
            < div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none" >
                <div
                    className="h-full bg-secondary transition-all duration-150"
                    style={{ width: `${Math.min((statsVisible ? 100 : 0) + (scrolled ? 30 : 0), 100)}%` }} // Simple progress estimate
                />
            </div >
        </div >
    );
}
