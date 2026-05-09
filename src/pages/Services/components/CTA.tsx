import React from 'react';
import Button from '@/components/ui/Button';

interface CTAProps {
  title: string;
  description: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  primaryButtonNewTab?: boolean;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  secondaryButtonNewTab?: boolean;
}

const CTA: React.FC<CTAProps> = ({ 
  title, 
  description,
  primaryButtonText = "Schedule Visit",
  primaryButtonUrl = "/video-consult",
  primaryButtonNewTab = false,
  secondaryButtonText = "Contact Support",
  secondaryButtonUrl = "/contact",
  secondaryButtonNewTab = false
}) => {
  return (
    <section className="container mx-auto px-4 pb-12">
      <div className="rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-8 md:p-12 shadow-md">
        <div className="text-xl md:text-2xl font-extrabold text-center" dangerouslySetInnerHTML={{ __html: title }} />
        <div className="mt-3 text-sm md:text-base text-center max-w-2xl mx-auto opacity-90" dangerouslySetInnerHTML={{ __html: description }} />
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button to={primaryButtonUrl} size="md" variant="primary" className="bg-white text-brand-blue hover:bg-blue-50" target={primaryButtonNewTab ? "_blank" : undefined}>
            {primaryButtonText ? <div dangerouslySetInnerHTML={{ __html: primaryButtonText }} /> : "Schedule Visit"}
          </Button>
          <Button to={secondaryButtonUrl} size="md" variant="outline" className="border-white text-white hover:bg-white/10" target={secondaryButtonNewTab ? "_blank" : undefined}>
            {secondaryButtonText ? <div dangerouslySetInnerHTML={{ __html: secondaryButtonText }} /> : "Contact Support"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
