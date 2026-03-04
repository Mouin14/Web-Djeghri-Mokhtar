import '../css/app.css';
import './bootstrap';

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './Layouts/MainLayout';
// Import Pages
import Dashboard from './Pages/Dashboard';
import Login from './Auth/Login';
import Patients from './Pages/Patients';
import Appointments from './Pages/Appointments';
import ConsultationForm from './Pages/ConsultationForm';
import Landing from './Pages/Landing';
import DoctorReview from './Pages/DoctorReview';

if (document.getElementById('app')) {
    const root = createRoot(document.getElementById('app'));
    root.render(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes (Wrapped in MainLayout) */}
                <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
                <Route path="/doctor/review" element={<MainLayout><DoctorReview /></MainLayout>} />
                <Route path="/patients" element={<MainLayout><Patients /></MainLayout>} />
                <Route path="/appointments" element={<MainLayout><Appointments /></MainLayout>} />
                <Route path="/consultations/create" element={<MainLayout><ConsultationForm /></MainLayout>} />
                <Route path="/consultations" element={<MainLayout><ConsultationForm /></MainLayout>} /> {/* Placeholder */}

            </Routes>
        </BrowserRouter>
    );
}
