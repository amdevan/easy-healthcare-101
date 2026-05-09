import React from 'react';
import { CheckCircle2, Quote } from 'lucide-react';
import { resolveSrc } from '@/utils/url';

interface OurStoryProps {
  title?: string;
  subtitle?: string;
  description1?: string;
  description2?: string;
  quote?: string;
  image?: string;
  services?: string[];
}

const OurStory: React.FC<OurStoryProps> = ({ 
  title, subtitle, description1, description2, quote, image, services 
}) => {
  const displayImage = image ? resolveSrc(image) : "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200&auto=format&fit=crop";
  const displayServices = services || [
    "Clinical Care", 
    "Telemedicine", 
    "Pharmacy Services", 
    "Diagnostics", 
    "Medical Logistics"
  ];

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-100">
      <div className="w-full px-6 md:px-10 lg:px-16 max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Text */}
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-0.5 w-6 bg-blue-600 rounded-full"></span>
              <span className="text-blue-600 font-bold uppercase tracking-wider text-xs">{subtitle || "Who We Are"}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
              {title || "Transforming Healthcare Access in Nepal"}
            </h2>
            
            <div className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base max-w-2xl" dangerouslySetInnerHTML={{ __html: description1 || "Easy Health Care Pvt. Ltd. (Easy Health Care 101) is a forward-thinking healthcare organization dedicated to providing accessible, affordable, and high-quality health services to individuals, families, and communities." }} />
            <div className="text-slate-600 leading-relaxed mb-8 text-sm md:text-base max-w-2xl" dangerouslySetInnerHTML={{ __html: description2 || "We bridge the gap between patients and providers through a hybrid model of digital health and physical clinics, ensuring that care is always within reach." }} />
            
            <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm mb-6 relative max-w-xl">
               <Quote className="absolute top-4 left-4 w-6 h-6 text-blue-100 -z-10" />
               <div className="text-slate-800 font-medium italic pl-2 relative z-10 text-sm md:text-base" dangerouslySetInnerHTML={{ __html: `"${quote || "We bring together clinical care, telemedicine, pharmacy, and diagnostics under one seamless ecosystem."}"` }} />
            </div>

            <div className="grid sm:grid-cols-2 gap-3 max-w-lg">
               {displayServices.map((item, i) => (
                 <div key={i} className="flex items-center gap-2.5 group">
                    <CheckCircle2 size={18} className="text-green-500 shrink-0 group-hover:scale-110 transition-transform" />
                    <div className="text-slate-700 font-medium text-sm" dangerouslySetInnerHTML={{ __html: item }} />
                 </div>
               ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2">
             <div className="relative p-2 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 transform rotate-1 hover:rotate-0 transition-transform duration-500 ease-out">
                <img 
                   src={displayImage} 
                   alt="Medical Team Collaboration" 
                   className="w-full h-auto object-cover rounded-[1.75rem] aspect-[16/10]"
                   loading="lazy"
                   referrerPolicy="no-referrer"
                   onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/1200/800'; }}
                 />
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OurStory;
