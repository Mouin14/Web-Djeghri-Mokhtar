import React from 'react';

const Appointments = () => {
    return (
        <div>
            {/* View Toggle and Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">
                            <i className="fas fa-calendar-alt mr-2"></i>Calendrier
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                            <i className="fas fa-list mr-2"></i>Liste
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg">
                            <button className="text-gray-600 hover:text-gray-800">
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <span className="font-semibold text-gray-800 px-3">Janvier 2026</span>
                            <button className="text-gray-600 hover:text-gray-800">
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                            <i className="fas fa-filter mr-2"></i>Filtrer
                        </button>
                        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                            <i className="fas fa-plus mr-2"></i>Nouveau RDV
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar View */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                        <div key={day} className="p-4 text-center font-semibold text-gray-700 border-r border-gray-200 last:border-r-0">{day}</div>
                    ))}
                </div>

                {/* Calendar Grid (Mockup for first week) */}
                <div className="grid grid-cols-7">
                    {/* Previous month days */}
                    {[29, 30, 31].map(d => (
                        <div key={d} className="min-h-[100px] border border-gray-100 p-2 bg-gray-50">
                            <div className="text-sm text-gray-400 mb-1">{d}</div>
                        </div>
                    ))}

                    {/* Current month days */}
                    <div className="min-h-[100px] border border-gray-100 p-2 hover:bg-gray-50">
                        <div className="text-sm font-semibold text-gray-800 mb-1">1</div>
                        <div className="space-y-1">
                            <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                10:00 - M. Alami
                            </div>
                        </div>
                    </div>
                    {/* ... other days ... */}
                    {[2, 3, 4, 5, 6, 7].map(d => (
                        <div key={d} className="min-h-[100px] border border-gray-100 p-2 hover:bg-gray-50">
                            <div className="text-sm font-semibold text-gray-800 mb-1">{d}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Appointments;
