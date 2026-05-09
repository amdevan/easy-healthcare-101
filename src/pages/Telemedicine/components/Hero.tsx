import React from 'react';
import { ArrowRight, Video, ShieldCheck, Clock } from 'lucide-react';
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
  const defaultImage = 'https://images.unsplash.com/photo-1758691461916-dc7894eb8f94?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0';
  const imgSrc = image ? resolveSrc(image) : defaultImage;

  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span>Accessible Healthcare Anytime, Anywhere</span>
            </div>

            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {title ? (
                <div dangerouslySetInnerHTML={{ __html: title }} />
              ) : (
                <>
                  Expert Care, <br />
                  <span className="text-teal-600">Just a Click Away.</span>
                </>
              )}
            </div>

            <div className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
               {subtitle ? (
                 <div dangerouslySetInnerHTML={{ __html: subtitle }} />
               ) : (
                 "Experience the future of medicine with secure remote consultations, high-quality video calls, and instant digital prescriptions. Quality healthcare, now from the comfort of your home."
               )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                to={primary_button_link || "#cta"}
                target={primary_button_new_tab ? '_blank' : undefined}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white shadow-lg hover:shadow-teal-200"
              >
                <div dangerouslySetInnerHTML={{ __html: primary_button_text || "Book an Online Consultation" }} />
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                to={secondary_button_link || "#how-it-works"}
                target={secondary_button_new_tab ? '_blank' : undefined}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white text-gray-700 border-gray-200"
              >
                <div dangerouslySetInnerHTML={{ __html: secondary_button_text || "Learn How It Works" }} />
              </Button>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-teal-500" />
                <span>HD Video Calls</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-500" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-500" />
                <span>24/7 Availability</span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={imgSrc}
                alt="Online telemedicine consultation"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.src = 'https://picsum.photos/800/600?grayscale'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Doctor is online</div>
                  <div className="text-sm text-gray-500">General Physician • 15 years exp.</div>
                </div>
                <button className="ml-auto px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-full hover:bg-teal-700">
                  Connect
                </button>
              </div>
            </div>

            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-400 rounded-full opacity-20 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
