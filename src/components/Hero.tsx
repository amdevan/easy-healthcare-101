import React, { useEffect, useState } from 'react';
import Editable from '@/components/ui/Editable';
import Button from '@/components/ui/Button';
import Slider from '@/components/ui/Slider';
import { getSetting } from '@/controllers/adminController';
import type { Slide } from '@/components/ui/Slider';
import { resolveSrc } from '@/utils/url';
import { fetchSpecialties, SpecialtyDto } from '@/controllers/api';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

const LocationIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

interface HeroProps {
  title?: string;
  subtitle?: string;
  image?: string;
  showSearch?: boolean;
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
  showSearch = false,
  primary_button_text,
  primary_button_link,
  primary_button_new_tab,
  secondary_button_text,
  secondary_button_link,
  secondary_button_new_tab
}) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [specialties, setSpecialties] = useState<SpecialtyDto[]>([]);

  const POPULAR_LOCATIONS = [
    'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Biratnagar', 
    'Birgunj', 'Dharan', 'Bharatpur', 'Janakpur', 'Butwal', 'Hetauda', 
    'Nepalgunj', 'Itahari', 'Dhangadhi'
  ];

  useEffect(() => {
    fetchSpecialties().then(setSpecialties).catch(() => {});
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (query) params.append('q', query);
    if (specialty) params.append('specialty', specialty);
    navigate(`/find-doctors?${params.toString()}`);
  };

  // Clear stale hero-title from localStorage to ensure default blue color shows
  useEffect(() => {
    localStorage.removeItem('hero-title');
  }, []);

  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-br from-brand-cyan-light/40 to-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            {title ? (
              <div className="text-4xl md:text-6xl font-extrabold text-brand-gray-900 leading-tight" dangerouslySetInnerHTML={{ __html: title }} />
            ) : (
              <div
                className="text-4xl md:text-6xl font-extrabold text-brand-gray-900 leading-tight"
              >
                Your Trusted Partner for <span className="text-brand-blue">Easy Healthcare</span>
              </div>
            )}

            {subtitle ? (
              <div className="mt-6 text-lg text-brand-gray-500 max-w-xl mx-auto lg:mx-0" dangerouslySetInnerHTML={{ __html: subtitle }} />
            ) : (
              <div
                className="mt-6 text-lg text-brand-gray-500 max-w-xl mx-auto lg:mx-0"
              >
                Connecting you with top doctors, online consultations, and trusted clinics for all your health needs.
              </div>
            )}

            <div className="mt-8 space-y-4 max-w-md mx-auto lg:mx-0">
              {showSearch && (
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LocationIcon />
                    </div>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      list="hero-locations"
                      placeholder="Select your city (e.g., Kathmandu)"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm shadow-sm"
                    />
                    <datalist id="hero-locations">
                      {POPULAR_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc} />
                      ))}
                    </datalist>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon />
                    </div>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search doctors, clinics, hospitals etc."
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm shadow-sm"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon />
                    </div>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      list="hero-specialties"
                      placeholder="Select Specialty"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm shadow-sm"
                    />
                    <datalist id="hero-specialties">
                      {specialties.map((s) => (
                        <option key={s.id} value={s.name} />
                      ))}
                    </datalist>
                  </div>
                  <button
                    onClick={handleSearch}
                    className="w-full bg-brand-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-blue-dark transition-colors shadow-lg shadow-brand-blue/20"
                  >
                    Find Doctors
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8 space-y-4 max-w-md mx-auto lg:mx-0">
              {(primary_button_text || secondary_button_text) ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  {primary_button_text && (
                    <Button
                      to={primary_button_link}
                      target={primary_button_new_tab ? '_blank' : undefined}
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      <div dangerouslySetInnerHTML={{ __html: primary_button_text }} />
                    </Button>
                  )}
                  {secondary_button_text && (
                    <Button
                      to={secondary_button_link}
                      target={secondary_button_new_tab ? '_blank' : undefined}
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      <div dangerouslySetInnerHTML={{ __html: secondary_button_text }} />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button to="/telemedicine" variant="outline" size="lg">Video Consult</Button>
                </div>
              )}
            </div>
          </div>
          <div className="hidden lg:block">
            {image ? (
              <img
                src={resolveSrc(image)}
                alt={title || "Hero Image"}
                className="w-full h-auto rounded-xl shadow-lg object-cover max-h-[500px]"
              />
            ) : (
              <HomeSlider />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

const HomeSlider: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [autoPlay, setAutoPlay] = useState(false);
  const [intervalMs, setIntervalMs] = useState(4500);
  const [pauseOnHover, setPauseOnHover] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const [buttonText, setButtonText] = useState('View');

  useEffect(() => {
    let ignore = false;
    getSetting('home.slider')
      .then((value) => {
        if (ignore || !value) return;
        const arr = Array.isArray(value) ? value : (value?.slides ?? null);
        if (Array.isArray(arr) && arr.length > 0) {
          const safe: Slide[] = arr.map((s: any) => ({ src: resolveSrc(String(s.src || '')), alt: s.alt ? String(s.alt) : undefined, href: s.href ? String(s.href) : undefined }))
            .filter((s) => !!s.src);
          if (safe.length > 0) setSlides(safe);
        }
        const opts = (value && !Array.isArray(value) ? (value as any)?.options : null) ?? null;
        if (opts) {
          setAutoPlay(Boolean(opts.autoPlay ?? false));
          const n = Number(opts.intervalMs ?? 4500);
          setIntervalMs(Number.isFinite(n) && n > 0 ? n : 4500);
          setPauseOnHover(Boolean(opts.pauseOnHover ?? true));
          setShowCaptions(Boolean(opts.showCaptions ?? true));
          setShowButton(Boolean(opts.showButton ?? true));
          setButtonText(typeof opts.buttonText === 'string' && opts.buttonText.trim() ? String(opts.buttonText) : 'View');
        }
      })
      .catch(() => { })
      .finally(() => { });
    return () => { ignore = true; };
  }, []);

  if (slides.length === 0) return null;
  return (
    <Slider slides={slides} autoPlay={autoPlay} intervalMs={intervalMs} className="w-[600px] h-[400px]" pauseOnHover={pauseOnHover} showCaptions={showCaptions} showButton={showButton} buttonText={buttonText} />
  );
};
