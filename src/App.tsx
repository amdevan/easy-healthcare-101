import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import OnlineConsultation from '@/components/OnlineConsultation';
import InClinicConsultation from '@/components/InClinicConsultation';
import Articles from '@/components/Articles';
import Testimonials from '@/components/Testimonials';
import DownloadApp from '@/components/DownloadApp';
import Footer from '@/components/Footer';
import { AdminProvider } from '@/contexts/AdminContext';
import AdminToggle from '@/components/AdminToggle';
import HomeDiagnostics from '@/components/HomeDiagnostics';
import FindDoctors from '@/components/FindDoctors';
import { Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <AdminProvider>
      <div className="bg-white font-sans text-brand-gray-700">
        <Header />
        <main>
          <Routes>
            <Route
              path="/"
              element={(
                <>
                  <Hero />
                  <Services />
                  <OnlineConsultation />
                  <InClinicConsultation />
                  <HomeDiagnostics />
                  <Articles />
                  <Testimonials />
                  <DownloadApp />
                </>
              )}
            />
            <Route path="/find-doctors" element={<FindDoctors />} />
          </Routes>
        </main>
        <Footer />
        <AdminToggle />
      </div>
    </AdminProvider>
  );
};

export default App;