import React from 'react';
import { normalizeHref, resolveSrc } from '@/utils/url';

const ArrowRightIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

export interface HeroProps {
  title?: string;
  subtitle?: string;
  image?: string;
  badge?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  primaryButtonNewTab?: boolean;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  secondaryButtonNewTab?: boolean;
}

const Hero: React.FC<HeroProps> = ({ 
  title, 
  subtitle, 
  image,
  badge,
  primaryButtonText,
  primaryButtonLink,
  primaryButtonNewTab,
  secondaryButtonText,
  secondaryButtonLink,
  secondaryButtonNewTab
}) => {
  const defaultImage = "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?auto=format&fit=crop&q=80&w=2000";
  const imgSrc = image ? resolveSrc(image) : defaultImage;
  const primaryHref = normalizeHref(primaryButtonLink) || "#locations";
  const secondaryHref = normalizeHref(secondaryButtonLink) || "#infrastructure";
  const primaryTarget = primaryButtonNewTab ? "_blank" : undefined;
  const secondaryTarget = secondaryButtonNewTab ? "_blank" : undefined;
  const primaryRel = primaryButtonNewTab ? "noopener noreferrer" : undefined;
  const secondaryRel = secondaryButtonNewTab ? "noopener noreferrer" : undefined;
  
  return (
  <div className="relative bg-slate-900 overflow-hidden">
    <div className="absolute inset-0">
      <img
        src={imgSrc}
        alt="Hospital Lobby"
        className="w-full h-full object-cover opacity-30"
        referrerPolicy="no-referrer"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/2000/900?blur=2'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
    </div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div className="max-w-2xl">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-medium text-sm">
          {badge ? <div dangerouslySetInnerHTML={{ __html: badge }} /> : "Leading Medical Infrastructure & Technology"}
        </div>
        <div className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {title ? <div dangerouslySetInnerHTML={{ __html: title }} /> : (
            <>
              World-Class Care,<br />
              <span className="text-blue-400">Powered by Innovation</span>
            </>
          )}
        </div>
        <div className="text-lg text-slate-300 mb-8 leading-relaxed">
          {subtitle ? <div dangerouslySetInnerHTML={{ __html: subtitle }} /> : "Experience state-of-the-art infrastructure and advanced medical technology across our network of accredited clinics and specialized centers."}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href={primaryHref} target={primaryTarget} rel={primaryRel} className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50">
            <div dangerouslySetInnerHTML={{ __html: primaryButtonText || "Find Nearest Clinic" }} /> <ArrowRightIcon className="w-4 h-4" />
          </a>
          <a href={secondaryHref} target={secondaryTarget} rel={secondaryRel} className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all">
            <div dangerouslySetInnerHTML={{ __html: secondaryButtonText || "Explore Technology" }} />
          </a>
        </div>
      </div>
    </div>
  </div>
);
};

export default Hero;
