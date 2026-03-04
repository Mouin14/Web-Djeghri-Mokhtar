import React, { useState } from 'react';

const DoctorReview = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const openReviewModal = (patient) => {
        setSelectedPatient(patient);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeReviewModal = () => {
        setIsModalOpen(false);
        setSelectedPatient(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">En Attente</p>
                            <p className="text-2xl font-bold text-gray-800">8</p>
                        </div>
                        <i className="fas fa-clock text-3xl text-yellow-500"></i>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">En Révision</p>
                            <p className="text-2xl font-bold text-gray-800">3</p>
                        </div>
                        <i className="fas fa-eye text-3xl text-blue-500"></i>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Approuvées</p>
                            <p className="text-2xl font-bold text-gray-800">24</p>
                        </div>
                        <i className="fas fa-check-circle text-3xl text-green-500"></i>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Rejetées</p>
                            <p className="text-2xl font-bold text-gray-800">2</p>
                        </div>
                        <i className="fas fa-times-circle text-3xl text-red-500"></i>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">
                            Toutes (37)
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                            En Attente (8)
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                            Urgentes (2)
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Rechercher un patient..."
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                            <i className="fas fa-filter mr-2"></i>Filtrer
                        </button>
                    </div>
                </div>
            </div>

            {/* Cards List */}
            <div className="space-y-4">
                {/* Card 1 */}
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition border-l-4 border-red-500">
                    <div className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-red-600 font-bold text-lg">MA</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <h3 className="text-lg font-bold text-gray-800">Mohammed Alami</h3>
                                        <span className="ml-3 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                                            <i className="fas fa-exclamation-triangle mr-1"></i>URGENT
                                        </span>
                                        <span className="ml-2 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                                            En Attente
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                                        <div><p className="text-gray-500">CIN</p><p className="font-semibold text-gray-800">AB123456</p></div>
                                        <div><p className="text-gray-500">Âge</p><p className="font-semibold text-gray-800">45 ans</p></div>
                                        <div><p className="text-gray-500">Téléphone</p><p className="font-semibold text-gray-800">0612345678</p></div>
                                        <div><p className="text-gray-500">Demande du</p><p className="font-semibold text-gray-800">20/01/2024</p></div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                        <p className="text-sm text-gray-600 mb-1"><strong>Motif:</strong></p>
                                        <p className="text-sm text-gray-800">Douleurs thoraciques intenses depuis 2 jours, essoufflement au repos, antécédents familiaux de maladies cardiaques.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 ml-4">
                                <button onClick={() => openReviewModal('Mohammed Alami')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
                                    <i className="fas fa-eye mr-2"></i>Réviser
                                </button>
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold">
                                    <i className="fas fa-check mr-2"></i>Approuver
                                </button>
                                <button className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-semibold">
                                    <i className="fas fa-times mr-2"></i>Rejeter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={(e) => e.target === e.currentTarget && closeReviewModal()}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Révision de la Demande</h2>
                                <p className="text-sm text-gray-500">Patient: {selectedPatient}</p>
                            </div>
                            <button onClick={closeReviewModal} className="text-gray-500 hover:text-gray-700">
                                <i className="fas fa-times text-2xl"></i>
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Details Logic Here (Simplified for brevity as per HTML source) */}
                                <div className="lg:col-span-1 space-y-6">
                                    <div className="bg-blue-50 rounded-xl p-6">
                                        <h3 className="font-bold text-gray-800 mb-4">Informations Patient</h3>
                                        <div className="space-y-3 text-sm">
                                            <div><p className="text-gray-600">Nom Complet</p><p className="font-semibold text-gray-800">Mohammed Alami</p></div>
                                            {/* ... */}
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                                        <h3 className="font-bold text-gray-800 mb-4">Motif de Consultation</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Douleurs thoraciques intenses depuis 2 jours...
                                        </p>
                                    </div>
                                    {/* Action Buttons in Modal */}
                                    <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                                        <button onClick={closeReviewModal} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold">
                                            Annuler
                                        </button>
                                        <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">
                                            <i className="fas fa-times-circle mr-2"></i>Rejeter la Demande
                                        </button>
                                        <button className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-lg">
                                            <i className="fas fa-calendar-check mr-2"></i>Approuver et Planifier
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorReview;
