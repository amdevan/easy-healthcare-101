import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  primaryCtaText?: string;
  onPrimaryCtaClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, primaryCtaText, onPrimaryCtaClick }) => {
  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <div 
          className="text-4xl md:text-5xl font-extrabold text-brand-gray-900 mb-4 tracking-tight"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <div 
          className="text-lg md:text-xl text-brand-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
        {primaryCtaText && (
          <button
            onClick={onPrimaryCtaClick}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-blue hover:bg-blue-700 transition-colors duration-200"
          >
            <div dangerouslySetInnerHTML={{ __html: primaryCtaText }} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Hero;
