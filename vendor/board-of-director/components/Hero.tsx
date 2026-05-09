import React, { useEffect, useState } from 'react';
import { ShieldCheck, Users, Briefcase, TrendingUp } from 'lucide-react';
import { STORAGE_URL } from '@/config/api';

type PageValue = { title?: string; subtitle?: string };

interface HeroProps {
  title?: string;
  subtitle?: string;
  image?: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, image }) => {
  const [page, setPage] = useState<PageValue>({});

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/frontend');
      const json = await res.json();
      const p = (json.pages || []).find((x: any) => x.key === 'page.board-of-director');
      setPage(p?.value || {});
    };
    load();
  }, []);

  const resolveImage = (img?: string) => {
    if (!img) return "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1600";
    if (img.startsWith('http')) return img;
    return `${STORAGE_URL}/${img}`;
  };

  return (
    <section className="relative bg-white pt-6 pb-12 lg:pt-12 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {title || page.title || 'Board of Director'}
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {subtitle || page.subtitle || 'Leadership team' }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a href="#board-members" className="px-8 py-4 rounded-full bg-brand-blue text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 hover:-translate-y-1 transition-all text-center">
                Meet the Board
              </a>
              <a href="/about/management-team" className="px-8 py-4 rounded-full bg-white text-gray-700 border border-gray-200 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
                Meet the Management
              </a>
            </div>
          </div>
          <div className="relative lg:h-[450px] flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/5 to-brand-yellow/5 rounded-[2rem] transform rotate-3"></div>
             <img 
               src={resolveImage(image)} 
               alt="Board of Directors Meeting" 
               referrerPolicy="no-referrer"
               onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=60&w=1200'; }}
               className="relative rounded-2xl shadow-2xl object-cover h-full w-full z-10"
             />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
