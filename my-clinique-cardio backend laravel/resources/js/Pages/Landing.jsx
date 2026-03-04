import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Custom Style workaround for specific landing page overlap */}
            <style>{`
                .hero-gradient {
                    background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
                }
                .card-hover {
                    transition: all 0.3s ease;
                }
                .card-hover:hover {
                    transform: translateY(-5px);
                }
            `}</style>

            {/* Navigation */}
            <nav className="bg-white shadow-md fixed w-full top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                <i className="fas fa-heartbeat text-white text-xl"></i>
                            </div>
                            <span className="text-xl font-bold text-gray-800">Clinique Cardiologique</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#accueil" className="text-gray-700 hover:text-blue-600 transition">Accueil</a>
                            <a href="#services" className="text-gray-700 hover:text-blue-600 transition">Services</a>
                            <a href="#equipements" className="text-gray-700 hover:text-blue-600 transition">Équipements</a>
                            <a href="#avantages" className="text-gray-700 hover:text-blue-600 transition">Avantages</a>
                            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Connexion</Link>
                            <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                                Prendre RDV
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="accueil" className="hero-gradient text-white pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-5xl font-bold mb-6 leading-tight">
                                Excellence en Soins Cardiovasculaires
                            </h1>
                            <p className="text-xl text-blue-100 mb-8">
                                Notre clinique spécialisée offre des traitements de pointe pour les maladies cardiaques avec une équipe médicale hautement qualifiée.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/login" className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-bold text-center shadow-lg">
                                    <i className="fas fa-calendar-plus mr-2"></i>
                                    Réserver une Consultation
                                </Link>
                                <a href="#services" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition font-bold text-center">
                                    <i className="fas fa-info-circle mr-2"></i>
                                    En Savoir Plus
                                </a>
                            </div>
                        </div>
                        <div className="hidden lg:block relative">
                            <img src="/images/Illustrations/exterior-1.jpg" alt="Clinique Exterior" className="rounded-2xl shadow-2xl relative z-10 border-4 border-white/20" />
                            <div className="absolute -bottom-6 -left-6 w-full h-full bg-blue-500/20 rounded-2xl -z-0"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Nos Services Spécialisés</h2>
                        <p className="text-xl text-gray-600">Des soins complets pour votre santé cardiaque</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Services blocks (simplified for brevity) */}
                        <div className="bg-white rounded-xl shadow-md p-8 card-hover">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <i className="fas fa-heartbeat text-3xl text-blue-600"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Consultation Cardiologique</h3>
                            <p className="text-gray-600 mb-4">Évaluation complète de votre santé cardiovasculaire avec nos cardiologues experts.</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-8 card-hover">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <i className="fas fa-user-md text-3xl text-red-600"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Chirurgie Cardiaque</h3>
                            <p className="text-gray-600 mb-4">Interventions chirurgicales avancées avec les dernières techniques médicales.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
