import React from 'react';
import { getIcon } from '@/utils/iconMapper';
import { Stethoscope, Activity, ShieldCheck, Baby, Microscope, Heart, Pill, UserPlus } from 'lucide-react';

interface ServiceItem { title: string; description: string; icon?: React.ReactNode }

const servicesList: ServiceItem[] = [
  { title: 'General Outpatient', description: 'Comprehensive diagnosis and treatment for common illnesses, infections, and minor injuries with minimal wait times.', icon: <Stethoscope className="w-8 h-8 text-white" /> },
  { title: 'Chronic Disease Management', description: 'Ongoing support for diabetes, hypertension, asthma, and other long-term conditions to ensure stable health.', icon: <Activity className="w-8 h-8 text-white" /> },
  { title: 'Preventive Care', description: 'Regular health screenings, immunizations, and wellness check-ups to catch issues before they become serious.', icon: <ShieldCheck className="w-8 h-8 text-white" /> },
  { title: 'Pediatric & Family Care', description: 'Gentle, specialized care for children and comprehensive health plans for the entire family unit.', icon: <Baby className="w-8 h-8 text-white" /> },
  { title: 'Diagnostic Labs', description: 'On-site blood work and sample collection for rapid diagnosis and faster treatment planning.', icon: <Microscope className="w-8 h-8 text-white" /> },
  { title: 'Cardiovascular Health', description: 'Monitoring heart health, blood pressure management, and cholesterol screenings.', icon: <Heart className="w-8 h-8 text-white" /> },
  { title: 'Pharmacy Services', description: 'Convenient access to prescription medications and expert pharmacist consultations.', icon: <Pill className="w-8 h-8 text-white" /> },
  { title: 'Mental Wellness', description: 'Basic counseling and referrals for mental health support, treating the mind alongside the body.', icon: <UserPlus className="w-8 h-8 text-white" /> },
];

interface ServicesProps {
  title?: string;
  subtitle?: string;
  description?: string;
  items?: { title: string; description: string; icon?: string }[];
}

const Services: React.FC<ServicesProps> = ({ title, subtitle, description, items }) => {
  const displayItems = items && items.length > 0 
    ? items.map((item, index) => {
        const IconComponent = getIcon(item.icon);
        const fallbackIcon = servicesList[index % servicesList.length].icon;
        
        return {
          ...item,
          icon: IconComponent ? <IconComponent className="w-8 h-8 text-white" /> : fallbackIcon
        };
      })
    : servicesList;

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-sm font-bold text-teal-600 uppercase tracking-wide mb-2" dangerouslySetInnerHTML={{ __html: subtitle || "Our Capabilities" }} />
          <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" dangerouslySetInnerHTML={{ __html: title || "Holistic Clinical Services" }} />
          <div className="text-slate-600 text-lg" dangerouslySetInnerHTML={{ __html: description || "We provide a wide range of primary care services designed to be affordable and accessible. Our focus is on your continuous well-being." }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayItems.map((service, index) => (
            <div key={index} className="group p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-50 transition-all duration-300">
              <div className="w-14 h-14 bg-teal-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-teal-200 group-hover:scale-110 transition-transform">{service.icon as React.ReactNode}</div>
              <div className="text-xl font-bold text-slate-900 mb-3" dangerouslySetInnerHTML={{ __html: service.title }} />
              <div className="text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: service.description }} />
            </div>
          ))}
        </div>
        <div className="mt-16 bg-blue-600 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="relative z-10 max-w-2xl">
             <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Quality Healthcare Shouldn't Break the Bank</h3>
             <div className="text-blue-100 text-lg">We offer transparent pricing, sliding scale options, and accept most major insurance plans. No hidden fees, just honest care.</div>
           </div>
           <div className="relative z-10 shrink-0">
             <a href="#appointment" className="px-8 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors">Check Our Rates</a>
           </div>
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
           <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Services;
