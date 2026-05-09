import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';

interface CTAProps {
  badge?: string;
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  primaryButtonNewTab?: boolean;
  secondaryLinks?: Array<{ label: string; href: string; }>;
}

const CTA: React.FC<CTAProps> = ({ 
  badge, 
  title, 
  description, 
  primaryButtonText, 
  primaryButtonLink,
  primaryButtonNewTab,
  secondaryLinks 
}) => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-blue-600 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-blue-600/20">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            {badge && (
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-bold mb-8 backdrop-blur-md">
                <div dangerouslySetInnerHTML={{ __html: badge }} />
              </span>
            )}
            
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
              {title ? (
                <div dangerouslySetInnerHTML={{ __html: title }} />
              ) : (
                <>Ready to Experience the <span className="text-blue-200">Future of Healthcare?</span></>
              )}
            </h2>
            
            <p className="text-xl text-blue-100 mb-12 opacity-90 leading-relaxed">
              {description ? (
                <div dangerouslySetInnerHTML={{ __html: description }} />
              ) : (
                "Join thousands of satisfied patients who have found a better way to manage their health. Start your journey with Easy Healthcare 101 today."
              )}
            </p>
            
            <div className="flex flex-col items-center gap-8">
              <Button
                to={primaryButtonLink || "/find-doctors"}
                target={primaryButtonNewTab ? '_blank' : undefined}
                variant="primary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-4 rounded-full text-lg shadow-xl shadow-black/10"
              >
                <div dangerouslySetInnerHTML={{ __html: primaryButtonText || "Get Started Now" }} />
                <ArrowRight size={20} className="ml-2" />
              </Button>
              
              {secondaryLinks && secondaryLinks.length > 0 && (
                <div className="flex flex-wrap justify-center gap-8">
                  {secondaryLinks.map((link, idx) => (
                    <Link 
                      key={idx}
                      to={link.href}
                      className="text-white/80 hover:text-white font-medium flex items-center gap-2 transition-colors border-b border-white/20 hover:border-white pb-1"
                    >
                      <Mail size={18} />
                      <div dangerouslySetInnerHTML={{ __html: link.label }} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
