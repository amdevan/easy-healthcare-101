import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home/Home';
import About from '@/pages/About/About';
import Contact from '@/pages/Contact/Contact';
import FindDoctors from '@/pages/FindDoctors/FindDoctors';
import VideoConsult from '@/pages/VideoConsult/VideoConsult';
import LabTests from '@/pages/LabTests/LabTests';
import Pharmacy from '@/pages/Pharmacy/Pharmacy';
import Services from '@/pages/Services/Services';
import ClinicsLocations from '@/pages/ClinicsLocations/ClinicsLocations';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import Dashboard from '@/pages/Dashboard/Dashboard';
import { AuthProvider } from '@/context/AuthContext';
import { AdminProvider } from '@/context/AdminContext';
import ProtectedRoute from '@/routes/ProtectedRoute';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdminToggle from '@/components/layout/AdminToggle';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <Header />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-doctors" element={<FindDoctors />} />
          <Route path="/video-consult" element={<VideoConsult />} />
          <Route path="/lab-tests" element={<LabTests />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/services" element={<Services />} />
          <Route path="/clinics-locations" element={<ClinicsLocations />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          </Routes>
          <Footer />
          <AdminToggle />
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;