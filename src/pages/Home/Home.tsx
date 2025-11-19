import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Services from '@/components/common/Services';
import OnlineConsultation from '@/components/common/OnlineConsultation';
import InClinicConsultation from '@/components/common/InClinicConsultation';
import HomeDiagnostics from '@/components/common/HomeDiagnostics';
import Articles from '@/components/common/Articles';
import Testimonials from '@/components/common/Testimonials';
import DownloadApp from '@/components/common/DownloadApp';
import Hero from '@/components/Hero';
import Editable from '@/components/ui/Editable';
import { getHomeHighlights } from '@/controllers/homeController';
import Icon from '@/components/ui/Icon';
import { fetchSpecialties, SpecialtyDto } from '@/controllers/api';

const Home: React.FC = () => {
  const highlights = getHomeHighlights();
  const [specialties, setSpecialties] = useState<SpecialtyDto[]>([]);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [specsError, setSpecsError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoadingSpecs(true);
    setSpecsError(null);
    fetchSpecialties()
      .then((res) => { if (!ignore) setSpecialties(res); })
      .catch((e) => setSpecsError(e.message))
      .finally(() => setLoadingSpecs(false));
    return () => { ignore = true; };
  }, []);
  return (
    <>
      <Hero />
      {/* Highlights */}
      <section className="bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map(h => (
              <div key={h.id} className="bg-cyan-50 border border-cyan-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <Editable tag="h3" id={`${h.id}-title`} className="text-lg font-bold text-brand-gray-900">{h.title}</Editable>
                <Editable tag="p" id={`${h.id}-desc`} className="mt-2 text-brand-gray-600">{h.description}</Editable>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Specialties */}
      <section className="py-12 lg:py-20 bg-brand-gray-100">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center justify-between">
              <Editable tag="h2" id="home-top-specialties-title" className="text-2xl md:text-3xl font-extrabold text-brand-gray-900">Top Specialties</Editable>
              <Link to="/find-doctors" className="hidden sm:inline-block px-5 py-2.5 border border-brand-blue text-brand-blue font-semibold rounded-lg hover:bg-blue-50 transition-colors">Browse All</Link>
            </div>
            {loadingSpecs && (
              <div className="mt-6 text-brand-gray-600">Loading specialties...</div>
            )}
            {specsError && (
              <div className="mt-6 text-red-600">{specsError}</div>
            )}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {specialties.map(s => (
                <div key={s.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-brand-blue transition-all duration-300 text-center">
                  <div className="bg-blue-50 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    {s.name ? (
                      <span className="text-2xl font-bold">{s.name.charAt(0)}</span>
                    ) : (
                      <Icon name="hospital" alt="Hospital" className="w-10 h-10" />
                    )}
                  </div>
                  <Editable tag="p" id={`spec-${s.slug}`} className="font-semibold text-brand-gray-800">{s.name}</Editable>
                  <Link to="/video-consult" className="mt-3 inline-block text-brand-blue font-bold text-sm hover:underline">CONSULT NOW</Link>
                </div>
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link to="/find-doctors" className="px-5 py-2.5 border border-brand-blue text-brand-blue font-semibold rounded-lg hover:bg-blue-50 transition-colors">Browse All</Link>
            </div>
          </div>
        </div>
      </section>
      <Services />
      <OnlineConsultation />
      <InClinicConsultation />
      <HomeDiagnostics />
      <Articles />
      <Testimonials />
      <DownloadApp />
    </>
  );
};

export default Home;