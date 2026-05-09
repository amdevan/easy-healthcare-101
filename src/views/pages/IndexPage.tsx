import React from 'react';
import Hero from '@/components/Hero';
import Services from '@/components/common/Services';
import OnlineConsultation from '@/components/common/OnlineConsultation';
import InClinicConsultation from '@/components/common/InClinicConsultation';
import HomeDiagnostics from '@/components/common/HomeDiagnostics';
import Articles from '@/components/common/Articles';
import Testimonials from '@/components/common/Testimonials';
import DownloadApp from '@/components/common/DownloadApp';

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
