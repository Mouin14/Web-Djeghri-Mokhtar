import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        // Allow default form submission for now to handle Laravel Auth session
        // or implement axios post if using Sanctum
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#667eea] to-[#764ba2]">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-4 p-4">
                        <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Clinic Cardio</h1>
                    <p className="text-blue-100">Système de Gestion Cardiologique</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Connexion</h2>

                    <form action="/login" method="POST">
                        <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')} />

                        {/* Email */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <i className="fas fa-envelope mr-2 text-gray-400"></i>Adresse Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                                placeholder="votre@email.com"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <i className="fas fa-lock mr-2 text-gray-400"></i>Mot de Passe
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between mb-6">
                            <label className="flex items-center">
                                <input type="checkbox" name="remember" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                <span className="ml-2 text-sm text-gray-600">Se souvenir</span>
                            </label>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition">
                                Mot de passe oublié?
                            </a>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Se Connecter
                            <i className="fas fa-arrow-right ml-2"></i>
                        </button>
                    </form>
                </div>

                <div className="text-center mt-6 text-white text-sm">
                    <p>&copy; 2026 Clinic Cardio. Tous droits réservés.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
