import React from 'react';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import OnlineConsultation from '@/components/OnlineConsultation';
import InClinicConsultation from '@/components/InClinicConsultation';
import HomeDiagnostics from '@/components/HomeDiagnostics';
import Articles from '@/components/Articles';
import Testimonials from '@/components/Testimonials';
import DownloadApp from '@/components/DownloadApp';

const IndexPage: React.FC = () => {
  return (
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
  );
};

export default IndexPage;