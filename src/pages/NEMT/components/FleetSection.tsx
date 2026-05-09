import React from 'react';
import { VEHICLES } from '../constants';
import { Check } from 'lucide-react';

interface FleetVehicle {
  id: number | string;
  name: string;
  description: string;
  image: string;
  features: string[];
  verified_text?: string;
  button_text?: string;
  button_url?: string;
  button_new_tab?: boolean;
}

interface FleetSectionProps {
  label?: string;
  title?: string;
  description?: string;
  vehicles?: FleetVehicle[];
  featuresLabel?: string;
  ctaText?: string;
}

const FleetSection: React.FC<FleetSectionProps> = ({
  label,
  title,
  description,
  vehicles,
  featuresLabel = "Key Features",
  ctaText = "Select this Vehicle"
}) => {
  const displayVehicles = vehicles || VEHICLES;

  return (
    <section id="fleet" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-slate-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
           <div className="inline-block text-blue-600 font-bold tracking-wider uppercase text-sm bg-blue-50 px-3 py-1 rounded-full" dangerouslySetInnerHTML={{ __html: label || "Our Fleet" }} />
          <div className="mt-4 text-3xl md:text-4xl font-bold text-slate-900" dangerouslySetInnerHTML={{ __html: title || "Safety on Wheels" }} />
          <div className="mt-4 max-w-2xl text-lg text-slate-600 mx-auto" dangerouslySetInnerHTML={{ __html: description || "Each vehicle is medically equipped, sanitized before every trip, and driven by BLS-certified professionals." }} />
        </div>

        <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
          {displayVehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex flex-col rounded-3xl overflow-hidden shadow-lg bg-white transition-transform duration-300 hover:scale-[1.02] border border-slate-100">
              <div className="relative h-56 bg-slate-200">
                <img 
                    className="h-full w-full object-cover" 
                    src={vehicle.image} 
                    alt={vehicle.name} 
                />
                {vehicle.verified_text && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm uppercase tracking-wide">
                      <div dangerouslySetInnerHTML={{ __html: vehicle.verified_text }} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 p-8 flex flex-col">
                <div className="text-2xl font-bold text-slate-900 mb-2" dangerouslySetInnerHTML={{ __html: vehicle.name }} />
                <div className="text-slate-600 mb-6 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: vehicle.description }} />
                
                <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3" dangerouslySetInnerHTML={{ __html: featuresLabel }} />
                    <ul className="space-y-3 mb-8">
                        {vehicle.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                            <div className="flex-shrink-0 bg-green-100 rounded-full p-0.5">
                                <Check className="h-3.5 w-3.5 text-green-600" />
                            </div>
                            <div className="ml-3 text-sm text-slate-700 font-medium" dangerouslySetInnerHTML={{ __html: feature }} />
                        </li>
                        ))}
                    </ul>
                </div>

                {(() => {
                  const btnText = vehicle.button_text || ctaText;
                  const btnUrl = vehicle.button_url || "#booking";
                  const isComingSoon = btnText.toLowerCase().includes('coming soon');
                  const isBookingLink = btnUrl === '#booking';

                  return (
                    <a 
                      href={btnUrl}
                      target={vehicle.button_new_tab ? "_blank" : undefined}
                      rel={vehicle.button_new_tab ? "noopener noreferrer" : undefined}
                      onClick={(e) => {
                        if (isComingSoon) {
                          e.preventDefault();
                          return;
                        }
                        if (isBookingLink) {
                          e.preventDefault();
                          document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className={`block w-full text-center py-3 px-4 border font-semibold rounded-xl transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-teal-500
                        ${isComingSoon 
                          ? 'border-slate-300 text-slate-400 cursor-not-allowed bg-slate-50' 
                          : 'border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white'
                        }
                      `}
                    >
                      <div dangerouslySetInnerHTML={{ __html: btnText }} />
                    </a>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FleetSection;