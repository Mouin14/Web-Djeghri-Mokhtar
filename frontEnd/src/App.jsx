import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ClientDashboard from './pages/ClientDashboard';
import PatientProfile from './pages/PatientProfile';
import Layout from './components/Layout';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

/**
 * Dashboard routes have their own full-page sidebar layout.
 * Public routes (Landing, Login) are wrapped in Layout with Navbar + Footer.
 */
const AppRoutes = () => {
  const location = useLocation();
  const isDashboard = ['/admin/dashboard', '/doctor/dashboard', '/client/dashboard', '/client/profile'].includes(location.pathname);

  if (isDashboard) {
    return (
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/client/profile" element={<PatientProfile />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};


import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <AppRoutes />
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
