import React from 'react';
import { resolveSrc } from '@/utils/url';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface HeroProps {
  title?: string;
  subtitle?: string;
  image?: string;
  primary_button_text?: string;
  primary_button_link?: string;
  primary_button_new_tab?: boolean;
  secondary_button_text?: string;
  secondary_button_link?: string;
  secondary_button_new_tab?: boolean;
}

const Hero: React.FC<HeroProps> = ({ 
  title, 
  subtitle, 
  image,
  primary_button_text,
  primary_button_link,
  primary_button_new_tab,
  secondary_button_text,
  secondary_button_link,
  secondary_button_new_tab
}) => {
  const defaultImage = 'https://plus.unsplash.com/premium_photo-1663050906605-faa2aa0e5ff8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0';
  const imgSrc = image ? resolveSrc(image) : defaultImage;

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
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight" dangerouslySetInnerHTML={{ __html: title || "Primary Care Built on <span class=\"text-teal-600\">Trust</span> & <span class=\"text-teal-600\">Continuity</span>" }} />
            <div className="text-lg text-slate-600 max-w-xl" dangerouslySetInnerHTML={{ __html: subtitle || "Accessible, affordable, and high-quality general outpatient services. We believe in building long-term relationships for better health outcomes." }} />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                to={primary_button_link || "#appointment"}
                target={primary_button_new_tab ? '_blank' : undefined}
                variant="primary"
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                <div dangerouslySetInnerHTML={{ __html: primary_button_text || "Schedule Visit" }} />
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                to={secondary_button_link || "#services"}
                target={secondary_button_new_tab ? '_blank' : undefined}
                variant="outline"
                size="lg"
                className="bg-white text-slate-700 border-slate-200"
              >
                <div dangerouslySetInnerHTML={{ __html: secondary_button_text || "View Services" }} />
              </Button>
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

export default Hero;
