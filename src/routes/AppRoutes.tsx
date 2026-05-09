import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Home/Home';
import Contact from '@/pages/Contact/Contact';
import FindDoctors from '@/pages/FindDoctors/FindDoctors';
import DoctorProfile from '@/pages/FindDoctors/DoctorProfile';
import VideoConsult from '@/pages/VideoConsult/VideoConsult';
import Services from '@/pages/Services/Services';
import NEMT from '@/pages/NEMT/NEMT';
import ClinicsLocations from '@/pages/ClinicsLocations/ClinicsLocations';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import VerifyOTP from '@/pages/Auth/VerifyOTP';
import LoginPhone from '@/pages/Auth/LoginPhone';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Products from '@/pages/Products/Products';
import Membership from '@/pages/Membership/Membership';
import Telemedicine from '@/pages/Telemedicine/Telemedicine';
import Pharmacy from '@/pages/Pharmacy/Pharmacy';
import AboutPage from '@/views/pages/AboutPage';
import AboutBoard from '@/views/pages/AboutBoard';
import ManagementTeam from '@/views/pages/ManagementTeam';
import PrimaryHealth from '@/pages/PrimaryHealth/PrimaryHealth';
import CommunityHealth from '@/pages/CommunityHealth/CommunityHealth';
import LabTests from '@/pages/LabTests/LabTests';
import DynamicPage from '@/pages/DynamicPage';
import { AuthProvider } from '@/context/AuthContext';
import { AdminProvider } from '@/context/AdminContext';
import ProtectedRoute from '@/routes/ProtectedRoute';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdminToggle from '@/components/layout/AdminToggle';
import PopupBanner from '@/components/layout/PopupBanner';
import AIAssistant from '../../vendor/amdevan-package/components/AIAssistant';
import { fetchGeneralSetting } from '@/controllers/api';

const AppRoutes: React.FC = () => {
  const [homeSlug, setHomeSlug] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchGeneralSetting()
      .then(settings => {
        if (settings && settings.home_page_slug) {
          setHomeSlug(settings.home_page_slug);
        }
      })
      .catch(err => {
        console.error("Failed to fetch general settings", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <Header />
          <Routes>
            <Route 
              path="/" 
              element={
                (() => {
                  if (!homeSlug || homeSlug === 'home') return <Home />;
                  
                  // For pages that have dedicated hardcoded components (active routes),
                  // we render them directly to ensure exact appearance.
                  switch(homeSlug) {
                    case 'nemt': return <NEMT />;
                    case 'lab-tests': return <LabTests />;
                    case 'pharmacy': return <Pharmacy />;
                    case 'health-package': return <Products />;
                    case 'products': return <Products />;
                    case 'easy-care-365': return <Membership slug="easy-care-365" />;
                    case 'membership': return <Membership slug="easy-care-365" />;
                    case 'clinics-locations': return <ClinicsLocations />;
                    case 'contact': return <Contact />;
                    case 'find-doctors': return <FindDoctors />;
                    // For everything else (including primary-health, about, etc. which are now dynamic),
                    // use DynamicPage
                    default: return <DynamicPage slugProp={homeSlug} isHome={true} />;
                  }
                })()
              } 
            />
            <Route path="/find-doctors" element={<FindDoctors />} />
            <Route path="/find-doctors/:slug" element={<DoctorProfile />} />
            {/* <Route path="/video-consult" element={<Telemedicine />} /> */}
            {/* <Route path="/services" element={<Services />} /> */}
            {/* <Route path="/primary-health" element={<PrimaryHealth />} /> */}
            {/* <Route path="/community-health" element={<CommunityHealth />} /> */}
            <Route path="/nemt" element={<NEMT />} />
            <Route path="/health-package" element={<Products />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/easy-care-365" element={<Membership slug="easy-care-365" />} />
            <Route path="/membership" element={<Navigate to="/easy-care-365" replace />} />
            {/* <Route path="/telemedicine" element={<Telemedicine />} /> */}
            <Route path="/lab-tests" element={<LabTests />} />
            {/* <Route path="/about" element={<AboutPage />} /> */}
            <Route path="/about/board-of-director" element={<AboutBoard />} />
            <Route path="/about/management-team" element={<ManagementTeam />} />
            <Route path="/clinics-locations" element={<ClinicsLocations />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/login-phone" element={<LoginPhone />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/verify-otp" element={<VerifyOTP />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/videos" element={<VideoConsult />} />
            {/* Dynamic Page Route - Must be last */}
            <Route path="/:slug" element={<DynamicPage checkHomeSlug={homeSlug} />} />
          </Routes>
          {/* Global AI Assistant */}
          <AdminToggle />
          <AIAssistant />
          <PopupBanner />
          <Footer />
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
