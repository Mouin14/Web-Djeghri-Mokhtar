import React from 'react';

const ConsultationForm = () => {
    return (
        <form action="/consultations" method="POST">
            <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Patient Info & Vital Signs */}
                <div className="space-y-6">
                    {/* Patient Selection */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <i className="fas fa-user-injured text-blue-600 mr-2"></i>
                            Information Patient
                        </h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sélectionner Patient *
                            </label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required>
                                <option value="">Choisir un patient...</option>
                                <option value="1">Mohammed Alami - AB123456</option>
                                <option value="2">Fatima Zahra - CD789012</option>
                                <option value="3">Hassan Idrissi - EF345678</option>
                            </select>
                        </div>

                        {/* Patient Quick Info */}
                        <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                            <div className="flex items-center text-sm">
                                <i className="fas fa-calendar text-blue-600 w-6"></i>
                                <span className="text-gray-700">Âge: <strong>45 ans</strong></span>
                            </div>
                            <div className="flex items-center text-sm">
                                <i className="fas fa-venus-mars text-blue-600 w-6"></i>
                                <span className="text-gray-700">Sexe: <strong>Homme</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Vital Signs */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <i className="fas fa-heartbeat text-red-600 mr-2"></i>
                            Signes Vitaux
                        </h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Tension (mmHg)
                                    </label>
                                    <input type="text" placeholder="120/80" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Pouls (bpm)
                                    </label>
                                    <input type="number" placeholder="72" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle & Right Columns - Consultation Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Symptoms */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <i className="fas fa-notes-medical text-green-600 mr-2"></i>
                            Motif de Consultation
                        </h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Symptômes Rapportés *
                            </label>
                            <textarea rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Douleurs thoraciques, essoufflement, palpitations..." required></textarea>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-4 bg-white rounded-xl shadow-sm p-6">
                        <button type="button" className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition">
                            <i className="fas fa-times mr-2"></i>
                            Annuler
                        </button>
                        <button type="submit" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 font-semibold shadow-lg transition">
                            <i className="fas fa-check-circle mr-2"></i>
                            Enregistrer Consultation
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ConsultationForm;
