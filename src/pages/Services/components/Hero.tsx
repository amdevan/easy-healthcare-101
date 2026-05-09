import React from 'react';
import Button from '@/components/ui/Button';

interface HeroProps {
  title: string;
  subtitle: string;
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
  primary_button_text,
  primary_button_link,
  primary_button_new_tab,
  secondary_button_text,
  secondary_button_link,
  secondary_button_new_tab
}) => {
  return (
    <section className="border-b">
      <div className="container mx-auto px-4 py-12 md:py-16 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-blue bg-blue-50 px-3 py-1 rounded-full">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L6.5 20l2-7L3 9h7l2-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          WORLD CLASS CARE
        </span>
        <div className="mt-3 text-3xl md:text-4xl font-extrabold text-brand-gray-900" dangerouslySetInnerHTML={{ __html: title }} />
        <div className="mt-3 text-brand-gray-600 max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: subtitle }} />
        
        {(primary_button_text || secondary_button_text) && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {primary_button_text && (
              <Button 
                to={primary_button_link} 
                target={primary_button_new_tab ? "_blank" : undefined}
                variant="primary"
              >
                <div dangerouslySetInnerHTML={{ __html: primary_button_text }} />
              </Button>
            )}
            {secondary_button_text && (
              <Button 
                to={secondary_button_link} 
                target={secondary_button_new_tab ? "_blank" : undefined}
                variant="outline"
              >
                <div dangerouslySetInnerHTML={{ __html: secondary_button_text }} />
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
