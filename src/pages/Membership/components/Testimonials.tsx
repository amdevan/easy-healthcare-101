import React, { useEffect, useState } from 'react';
import { Quote, Star } from 'lucide-react';
import { apiRequest } from '@/config/api';

interface Testimonial {
  id: number;
  content: string;
  author_name: string;
  location: string | null;
  author_role: string | null;
  image_url: string | null;
  rating: number | null;
}

interface TestimonialsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  items?: Array<{
    id?: number;
    content: string;
    author_name: string;
    location?: string | null;
    author_role?: string | null;
    image_url?: string | null;
    rating?: number | null;
  }>;
}

const Testimonials: React.FC<TestimonialsProps> = ({ title, subtitle, limit, items }) => {
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([]);
  const [sectionData, setSectionData] = useState({ title: 'Success Stories', subtitle: 'Trusted by Families' });
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);

    if (Array.isArray(items) && items.length > 0) {
      const normalized = items.map((t, idx) => ({
        id: typeof t.id === 'number' ? t.id : idx,
        content: t.content,
        author_name: t.author_name,
        location: t.location ?? null,
        author_role: t.author_role ?? null,
        image_url: t.image_url ?? null,
        rating: t.rating ?? null,
      }));

      setAllTestimonials(normalized);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [testimonialsData, settingsData] = await Promise.all([
            apiRequest('/testimonials'),
            apiRequest('/settings/testimonial_section').catch(() => null)
        ]);

        if (Array.isArray(testimonialsData)) {
            setAllTestimonials(testimonialsData);
        } else {
            console.error('Invalid testimonials data format:', testimonialsData);
        }

        if (settingsData && settingsData.value) {
            setSectionData({
                title: settingsData.value.title || 'Success Stories',
                subtitle: settingsData.value.subtitle || 'Trusted by Families'
            });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [items, limit]);

  const canToggle = typeof limit === 'number' && allTestimonials.length > limit;
  const displayTestimonials = typeof limit === 'number' && !expanded ? allTestimonials.slice(0, limit) : allTestimonials;

  if (loading) {
    return (
        <div className="bg-white py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <div className="h-4 bg-slate-200 w-32 mx-auto mb-2 rounded animate-pulse"></div>
                    <div className="h-10 bg-slate-200 w-96 mx-auto rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-slate-50 rounded-3xl p-8 h-80 animate-pulse">
                             <div className="h-4 bg-slate-200 w-full mb-4 rounded"></div>
                             <div className="h-4 bg-slate-200 w-3/4 mb-4 rounded"></div>
                             <div className="mt-auto flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                                <div>
                                    <div className="h-4 bg-slate-200 w-24 mb-2 rounded"></div>
                                    <div className="h-3 bg-slate-200 w-16 rounded"></div>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
  }

  if (displayTestimonials.length === 0) {
    return null;
  }

  return (
    <div className="bg-white py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-10 right-10 text-slate-100">
          <Quote size={400} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-teal-600 tracking-widest uppercase mb-2">{title || sectionData.title}</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            {subtitle || sectionData.subtitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id || index} 
              className="bg-slate-50 rounded-3xl p-8 relative hover:shadow-xl transition-shadow duration-300 border border-slate-100 flex flex-col"
            >
              <div className="absolute -top-6 left-8 bg-teal-500 text-white p-3 rounded-2xl shadow-lg transform rotate-3">
                <Quote size={20} fill="currentColor" />
              </div>

              <div className="flex gap-1 mb-6 text-amber-400">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              <div className="text-slate-600 leading-relaxed mb-8 italic flex-grow" dangerouslySetInnerHTML={{ __html: `"${testimonial.content}"` }} />

              <div className="flex items-center gap-4 mt-auto">
                {testimonial.image_url ? (
                  <img 
                    src={testimonial.image_url} 
                    alt={testimonial.author_name} 
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-100"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold ring-2 ring-teal-100 text-lg">
                    {testimonial.author_name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-slate-900">{testimonial.author_name}</h4>
                  {testimonial.location && (
                    <div className="text-xs font-medium text-teal-600 uppercase tracking-wide" dangerouslySetInnerHTML={{ __html: testimonial.location }} />
                  )}
                  {testimonial.author_role && (
                    <div className="text-xs text-slate-500" dangerouslySetInnerHTML={{ __html: testimonial.author_role }} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {canToggle && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setExpanded(v => !v)}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all"
            >
              {expanded ? 'Remove' : 'See more'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;
