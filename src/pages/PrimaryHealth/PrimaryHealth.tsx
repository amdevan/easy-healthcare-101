import React, { useState } from 'react';
import { usePageContent } from '@/hooks/usePageContent';
import { normalizeHref, resolveSrc } from '@/utils/url';
import { getIcon } from '@/utils/iconMapper';
import { ArrowRight, CheckCircle2, Stethoscope, Pill, Baby, Activity, Heart, ShieldCheck, Microscope, UserPlus } from 'lucide-react';
import AppointmentForm from './components/AppointmentForm';

interface HeroProps {
  title?: string;
  subtitle?: string;
  image?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  primaryButtonNewTab?: boolean;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  secondaryButtonNewTab?: boolean;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, image, primaryButtonText, primaryButtonLink, primaryButtonNewTab, secondaryButtonText, secondaryButtonLink, secondaryButtonNewTab }) => {
  const defaultImage = 'https://plus.unsplash.com/premium_photo-1663050906605-faa2aa0e5ff8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0';
  const imgSrc = image ? resolveSrc(image) : defaultImage;
  const primaryHref = normalizeHref(primaryButtonLink) || '#appointment';
  const secondaryHref = normalizeHref(secondaryButtonLink) || '#services';
  const primaryTarget = primaryButtonNewTab ? '_blank' : undefined;
  const secondaryTarget = secondaryButtonNewTab ? '_blank' : undefined;
  const primaryRel = primaryButtonNewTab ? 'noopener noreferrer' : undefined;
  const secondaryRel = secondaryButtonNewTab ? 'noopener noreferrer' : undefined;

  return (
    <section id="home" className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden bg-slate-50">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="#0d9488" />
          </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full text-teal-700 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span>Accepting New Patients</span>
            </div>
            {title ? (
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight" dangerouslySetInnerHTML={{ __html: title }} />
            ) : (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Primary Care Built on <span className="text-teal-600">Trust</span> & <span className="text-teal-600">Continuity</span>
              </h1>
            )}
            <div className="text-lg text-slate-600 max-w-xl" dangerouslySetInnerHTML={{ __html: subtitle || "Accessible, affordable, and high-quality general outpatient services. We believe in building long-term relationships for better health outcomes." }} />
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={primaryHref} target={primaryTarget} rel={primaryRel} className="inline-flex justify-center items-center px-8 py-3.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-200">
                {primaryButtonText ? <div dangerouslySetInnerHTML={{ __html: primaryButtonText }} /> : 'Schedule Visit'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a href={secondaryHref} target={secondaryTarget} rel={secondaryRel} className="inline-flex justify-center items-center px-8 py-3.5 bg-white text-slate-700 border border-slate-200 font-semibold rounded-lg hover:bg-slate-50 transition-all">
                {secondaryButtonText ? <div dangerouslySetInnerHTML={{ __html: secondaryButtonText }} /> : 'View Services'}
              </a>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row gap-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2"><CheckCircle2 className="text-teal-500 h-5 w-5" /><span>Walk-ins Welcome</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 className="text-teal-500 h-5 w-5" /><span>Affordable Plans</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 className="text-teal-500 h-5 w-5" /><span>Expert Physicians</span></div>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-teal-100">
              <img
                src={imgSrc}
                alt="Doctor consulting with patient"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://plus.unsplash.com/premium_photo-1663050906605-faa2aa0e5ff8?q=60&w=1600&auto=format&fit=crop'; }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                <div className="font-medium">"Continuous care is the cornerstone of lifelong health."</div>
                <div className="text-sm opacity-80 mt-1">- Lead Physician</div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 md:bottom-8 md:-left-12 bg-white p-4 rounded-xl shadow-xl border border-slate-100 max-w-xs hidden md:block">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Comprehensive Care</div>
                  <div className="text-xs text-slate-500">From diagnosis to recovery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

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
        // Fallback to hardcoded list icons if dynamic icon is not found or not provided
        // We use modulo to cycle through hardcoded icons if we have more dynamic items than hardcoded icons
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
              <div className="w-14 h-14 bg-teal-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-teal-200 group-hover:scale-110 transition-transform">{service.icon}</div>
              <div className="text-xl font-bold text-slate-900 mb-3" dangerouslySetInnerHTML={{ __html: service.title }} />
              <div className="text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: service.description }} />
            </div>
          ))}
        </div>
        <div className="mt-16 bg-blue-600 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="relative z-10 max-w-2xl">
             <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Quality Healthcare Shouldn't Break the Bank</h3>
             <p className="text-blue-100 text-lg">We offer transparent pricing, sliding scale options, and accept most major insurance plans. No hidden fees, just honest care.</p>
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

interface AboutProps {
  title?: string;
  subtitle?: string;
  description?: string;
  images?: string[];
}

const About: React.FC<AboutProps> = ({ title, subtitle, description, images }) => {
  const img1 = images && images[0] ? resolveSrc(images[0]) : "https://picsum.photos/400/500?grayscale";
  const img2 = images && images[1] ? resolveSrc(images[1]) : "https://picsum.photos/400/500?blur=2";

  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <img src={img1} alt="Clinic Interior" className="rounded-2xl shadow-lg mt-8" referrerPolicy="no-referrer" onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/400/500?blur=2'; }} />
              <img src={img2} alt="Happy Patient" className="rounded-2xl shadow-lg mb-8" referrerPolicy="no-referrer" onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/400/500'; }} />
            </div>
          </div>
          <div className="md:w-1/2 space-y-6">
            <div className="text-teal-600 font-bold uppercase tracking-wide" dangerouslySetInnerHTML={{ __html: subtitle || "About Primary Health Care" }} />
            <div className="text-3xl md:text-4xl font-bold text-slate-900" dangerouslySetInnerHTML={{ __html: title || "Dedicated to Continuous & Affordable Care" }} />
            <div className="text-slate-600 text-lg leading-relaxed">
              {description ? (
                <div dangerouslySetInnerHTML={{ __html: description }} />
              ) : (
                <>
                  <div className="mb-4">Founded on the belief that healthcare should be a right, not a privilege, our Primary Health Care service focuses on reducing barriers to quality medical attention. We specialize in general outpatient services designed to fit your busy life.</div>
                  <div>Our "Continuity of Care" model ensures you see the same team of professionals who know your history, preferences, and health goals. From minor check-ups to managing complex chronic conditions, we walk the journey with you.</div>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div><h3 className="text-3xl font-bold text-teal-600">15k+</h3><div className="text-slate-500">Patients Served</div></div>
              <div><h3 className="text-3xl font-bold text-teal-600">98%</h3><div className="text-slate-500">Satisfaction Rate</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



const PrimaryHealth: React.FC = () => {
  const { data: pageData } = usePageContent('primary-health');
  const heroBlock = pageData?.content?.find((b: any) => b.type === 'hero_section');
  const servicesBlock = pageData?.content?.find((b: any) => b.type === 'services_section');
  const aboutBlock = pageData?.content?.find((b: any) => b.type === 'about_section');
  const appointmentBlock = pageData?.content?.find((b: any) => b.type === 'appointment_section');

  const heroProps = {
    title: heroBlock?.data?.title,
    subtitle: heroBlock?.data?.subtitle,
    image: heroBlock?.data?.image,
    primaryButtonText: heroBlock?.data?.primary_button_text,
    primaryButtonLink: heroBlock?.data?.primary_button_link,
    primaryButtonNewTab: heroBlock?.data?.primary_button_new_tab,
    secondaryButtonText: heroBlock?.data?.secondary_button_text,
    secondaryButtonLink: heroBlock?.data?.secondary_button_link,
    secondaryButtonNewTab: heroBlock?.data?.secondary_button_new_tab,
  };

  const servicesProps = {
    title: servicesBlock?.data?.title,
    subtitle: servicesBlock?.data?.subtitle,
    description: servicesBlock?.data?.description,
    items: servicesBlock?.data?.items,
  };

  const aboutProps = {
    title: aboutBlock?.data?.title,
    subtitle: aboutBlock?.data?.subtitle,
    description: aboutBlock?.data?.description,
    images: aboutBlock?.data?.images
  };

  const appointmentProps = {
    title: appointmentBlock?.data?.title,
    subtitle: appointmentBlock?.data?.subtitle || appointmentBlock?.data?.description,
    successTitle: appointmentBlock?.data?.success_title,
    successMessage: appointmentBlock?.data?.success_message,
    contactInfo: appointmentBlock?.data?.contact_info,
    labels: appointmentBlock?.data?.labels,
    placeholders: appointmentBlock?.data?.placeholders,
  };

  return (
    <main>
      <Hero {...heroProps} />
      <Services {...servicesProps} />
      <About {...aboutProps} />
      <AppointmentForm {...appointmentProps} />
    </main>
  );
};

export default PrimaryHealth;
