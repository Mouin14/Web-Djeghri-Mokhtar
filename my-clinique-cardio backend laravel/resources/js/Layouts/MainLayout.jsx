import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MainLayout = ({ children, user }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Mock user if not provided, for UI dev purposes
    const currentUser = user || {
        full_name: 'Utilisateur Test',
        prenom: 'Admin',
        nom: 'User',
        role: 'admin', // doctor, patient, admin
        unreadNotifications: [],
        medecin: { specialite: 'Cardiologie' }
    };

    const isRoute = (route) => location.pathname === route;

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-2xl z-40 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="p-6">
                    {/* Logo */}
                    <div className="flex items-center mb-8">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3 p-2">
                            <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Clinic Cardio</h1>
                            <p className="text-xs text-blue-200">Gestion Médicale</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2">
                        <Link to="/dashboard"
                            className={`flex items-center px-4 py-3 rounded-lg hover:bg-blue-700 transition ${isRoute('/dashboard') ? 'bg-blue-700' : ''}`}>
                            <i className="fas fa-th-large w-5"></i>
                            <span className="ml-3">Tableau de Bord</span>
                        </Link>

                        <Link to="/doctor/review"
                            className={`flex items-center px-4 py-3 rounded-lg hover:bg-blue-700 transition ${isRoute('/doctor/review') ? 'bg-blue-700' : ''}`}>
                            <i className="fas fa-user-clock w-5"></i>
                            <span className="ml-3">Demandes</span>
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">8</span>
                        </Link>

                        {/* Add other links similarly */}
                        <Link to="/patients"
                            className={`flex items-center px-4 py-3 rounded-lg hover:bg-blue-700 transition ${isRoute('/patients') ? 'bg-blue-700' : ''}`}>
                            <i className="fas fa-user-injured w-5"></i>
                            <span className="ml-3">Patients</span>
                        </Link>

                        <Link to="/appointments"
                            className={`flex items-center px-4 py-3 rounded-lg hover:bg-blue-700 transition ${isRoute('/appointments') ? 'bg-blue-700' : ''}`}>
                            <i className="fas fa-calendar-check w-5"></i>
                            <span className="ml-3">Rendez-vous</span>
                        </Link>
                    </nav>

                    {/* Logout */}
                    <div className="absolute bottom-6 left-6 right-6">
                        <form method="POST" action="/logout">
                            <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')} />
                            <button type="submit" className="w-full flex items-center px-4 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition">
                                <i className="fas fa-sign-out-alt w-5"></i>
                                <span className="ml-3">Déconnexion</span>
                            </button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`ml-0 md:ml-64 min-h-screen transition-all duration-300`}>
                {/* Navbar */}
                <header className="bg-white shadow-sm sticky top-0 z-30">
                    <div className="flex items-center justify-between px-8 py-4">
                        <div className="flex items-center">
                            <button className="md:hidden mr-4 text-gray-600" onClick={toggleSidebar}>
                                <i className="fas fa-bars text-xl"></i>
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Page</h2>
                            </div>
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3 border-l pl-4">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-800">{currentUser.full_name}</p>
                                    <p className="text-xs text-gray-500">{currentUser.role === 'doctor' ? currentUser.medecin?.specialite : 'Utilisateur'}</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {currentUser.prenom[0]}{currentUser.nom[0]}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
