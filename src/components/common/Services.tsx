import React from 'react';
import Editable from '@/components/ui/Editable';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 text-center lg:text-left flex flex-col sm:flex-row lg:flex-col items-center sm:items-start lg:items-center space-x-6 sm:space-x-4 lg:space-x-0">
    <div className="bg-blue-100 p-4 rounded-lg mb-4 sm:mb-0 lg:mb-4">
        {icon}
    </div>
    <div>
        <Editable tag="h3" id={`service-title-${title.replace(/\s+/g, '-')}`} className="text-xl font-bold text-brand-gray-900">{title}</Editable>
        <Editable tag="p" id={`service-desc-${title.replace(/\s+/g, '-')}`} className="mt-2 text-brand-gray-500">{description}</Editable>
    </div>
  </div>
);

const VideoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const DoctorIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-blue" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0110 9c-1.55 0-2.958.68-3.93 1.67A6.97 6.97 0 004.5 16c0 .34.024.673.07 1h8.86zM8 20a1 1 0 01-1-1v-2.5a2 2 0 00-2-2H3a1 1 0 01-1-1V12a1 1 0 011-1h2a2 2 0 002-2V6.5a1 1 0 011-1h2a1 1 0 011 1V9a2 2 0 002 2h2a1 1 0 011 1v1.5a1 1 0 01-1 1h-2a2 2 0 00-2 2V19a1 1 0 01-1 1h-2z" />
    </svg>
);

const ProcedureIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const Services: React.FC = () => {
  const services = [
    {
      icon: <VideoIcon />,
      title: 'Instant Video Consultation',
      description: 'Connect with verified doctors online within 60 seconds from anywhere.'
    },
    {
      icon: <DoctorIcon />,
      title: 'Find Doctors Near You',
      description: 'Discover and book confirmed appointments with highly rated doctors in your vicinity.'
    },
    {
      icon: <ProcedureIcon />,
      title: 'Surgeries & Procedures',
      description: 'Access safe and trusted surgery centers for various medical procedures.'
    }
  ];

  return (
    <section className="bg-cyan-50 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(service => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
