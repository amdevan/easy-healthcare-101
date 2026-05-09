import React from 'react';
import { HeartHandshake, ShieldCheck, Users, Megaphone } from 'lucide-react';
import { resolveSrc } from '@/utils/url';
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
  const defaultImage = "https://plus.unsplash.com/premium_photo-1663050906605-faa2aa0e5ff8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const imgSrc = image ? resolveSrc(image) : defaultImage;

  return (
    <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3 text-teal-700 mb-10">
          <HeartHandshake className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">Community Health Programs</span>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight" dangerouslySetInnerHTML={{ __html: title || "Health For All, Together" }} />
            <div className="text-lg text-slate-600 max-w-xl" dangerouslySetInnerHTML={{ __html: subtitle || "Collaborative outreach, preventive screenings, and awareness campaigns that bring essential healthcare closer to neighborhoods and families." }} />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                to={primary_button_link || "#programs"}
                target={primary_button_new_tab ? '_blank' : undefined}
                variant="primary"
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                <div dangerouslySetInnerHTML={{ __html: primary_button_text || "Explore Programs" }} />
              </Button>
              <Button
                to={secondary_button_link || "#volunteer"}
                target={secondary_button_new_tab ? '_blank' : undefined}
                variant="outline"
                size="lg"
                className="bg-white text-slate-700 border-slate-200"
              >
                <div dangerouslySetInnerHTML={{ __html: secondary_button_text || "Become a Volunteer" }} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 pt-2 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2"><ShieldCheck className="text-teal-500 h-5 w-5" /><span>Screenings & Preventive Care</span></div>
              <div className="flex items-center gap-2"><Users className="text-teal-500 h-5 w-5" /><span>Community Partnerships</span></div>
              <div className="flex items-center gap-2"><Megaphone className="text-teal-500 h-5 w-5" /><span>Health Awareness</span></div>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-teal-100">
              <img
                src={imgSrc}
                alt="Community health outreach"
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://plus.unsplash.com/premium_photo-1663050906605-faa2aa0e5ff8?q=60&w=1600&auto=format&fit=crop'; }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
