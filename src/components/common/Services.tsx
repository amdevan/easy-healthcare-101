import React from 'react';
import Editable from '@/components/ui/Editable';
import { getIcon } from '@/utils/iconMapper';
import { Stethoscope } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  url?: string;
  newTab?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, url, newTab }) => {
  const content = (
    <>
      <div className="bg-blue-100 p-4 rounded-lg mb-4 sm:mb-0 lg:mb-4">
          {icon}
      </div>
      <div>
          <div className="text-xl font-bold text-brand-gray-900" dangerouslySetInnerHTML={{ __html: title }} />
              <div className="mt-2 text-brand-gray-500" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </>
  );

  if (url) {
    return (
      <a 
        href={url} 
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 text-center lg:text-left flex flex-col sm:flex-row lg:flex-col items-center sm:items-start lg:items-center space-x-6 sm:space-x-4 lg:space-x-0"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 text-center lg:text-left flex flex-col sm:flex-row lg:grid-col items-center sm:items-start lg:items-center space-x-6 sm:space-x-4 lg:space-x-0">
      {content}
    </div>
  );
};

export interface ServiceItem {
  title: string;
  description: string;
  icon?: string;
  url?: string;
  newTab?: boolean;
}

interface ServicesProps {
  items?: ServiceItem[];
}

const Services: React.FC<ServicesProps> = ({ items }) => {
  const defaultServices: Array<ServiceItem & { iconType: string }> = [
    {
      iconType: 'video',
      title: 'Instant Video Consultation',
      description: 'Connect with verified doctors online within 60 seconds from anywhere.'
    },
    {
      iconType: 'doctor',
      title: 'Find Doctors Near You',
      description: 'Discover and book confirmed appointments with highly rated doctors in your vicinity.'
    },
    {
      iconType: 'procedure',
      title: 'Surgeries & Procedures',
      description: 'Access safe and trusted surgery centers for various medical procedures.'
    }
  ];

  const servicesToRender = items && items.length > 0 
    ? items.map(item => ({ ...item, iconType: item.icon || 'doctor' })) 
    : defaultServices;

  const renderIcon = (type: string) => {
    let iconName = type;
    if (type.toLowerCase() === 'doctor') iconName = 'Stethoscope';
    if (type.toLowerCase() === 'procedure') iconName = 'Activity';
    
    const Icon = getIcon(iconName);
    if (Icon) return <Icon className="h-8 w-8 text-brand-blue" />;
    return <Stethoscope className="h-8 w-8 text-brand-blue" />;
  };

  return (
    <section className="bg-cyan-50 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesToRender.map((service, idx) => (
            <ServiceCard 
              key={idx} 
              icon={renderIcon(service.iconType)} 
              title={service.title} 
              description={service.description} 
              url={service.url}
              newTab={service.newTab}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
