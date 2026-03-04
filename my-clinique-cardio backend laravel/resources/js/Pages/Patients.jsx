import React from 'react';

const Patients = () => {
    return (
        <div>
            {/* Search and Actions Bar */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Search */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Rechercher un patient (nom, CIN, téléphone)..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center">
                            <i className="fas fa-filter mr-2"></i>
                            Filtrer
                        </button>
                        <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center">
                            <i className="fas fa-download mr-2"></i>
                            Exporter
                        </button>
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center font-semibold">
                            <i className="fas fa-plus mr-2"></i>
                            Nouveau Patient
                        </button>
                    </div>
                </div>
            </div>

            {/* Patients Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Patient
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    CIN
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Téléphone
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Date Naissance
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Dernière Visite
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-blue-600 font-semibold">MA</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">Mohammed Alami</p>
                                            <p className="text-sm text-gray-500">Homme, 45 ans</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-700">AB123456</td>
                                <td className="px-6 py-4 text-gray-700">0612345678</td>
                                <td className="px-6 py-4 text-gray-700">m.alami@email.com</td>
                                <td className="px-6 py-4 text-gray-700">15/03/1979</td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-600">12/01/2024</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Voir">
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Modifier">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Supprimer">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {/* More rows can be added here or mapped from data */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Patients;
