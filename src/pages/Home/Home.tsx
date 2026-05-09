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
import Button from '@/components/ui/Button';
import Editable from '@/components/ui/Editable';
import { getHomeHighlights } from '@/controllers/homeController';
import Icon from '@/components/ui/Icon';
import { fetchSpecialties, SpecialtyDto, resolveStorageUrl } from '@/controllers/api';
import { usePageContent } from '@/hooks/usePageContent';
import * as HeroIcons from 'lucide-react'; 
import { getIcon } from '@/utils/iconMapper';
import Skeleton from '@/components/ui/Skeleton';
import Pricing from '../Membership/components/Pricing';
import PackageCard from '../Products/components/PackageCard';
import PackageModal from '../Products/components/PackageModal';
import { HealthPackage } from '../Products/types';

const Home: React.FC = () => {
  const { data: pageData, loading: pageLoading } = usePageContent('home');
  const fallbackHighlights = getHomeHighlights();
  
  const [specialties, setSpecialties] = useState<SpecialtyDto[]>([]);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [specsError, setSpecsError] = useState<string | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<HealthPackage | null>(null);
  const [pkgCurrency, setPkgCurrency] = useState<'USD' | 'NPR'>('USD');

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

  // Extract blocks from page content
  const heroBlock = pageData?.content?.find(b => b.type === 'hero_section');
  const featuresBlock = pageData?.content?.find(b => b.type === 'features_list');
  const ctaBlock = pageData?.content?.find(b => b.type === 'call_to_action');
  
  const onlineConsultBlock = pageData?.content?.find(b => b.type === 'online_consultation_section');
  const inClinicBlock = pageData?.content?.find(b => b.type === 'in_clinic_consultation_section');
  const diagnosticsBlock = pageData?.content?.find(b => b.type === 'diagnostics_section');
  const articlesBlock = pageData?.content?.find(b => b.type === 'articles_section');
  const downloadAppBlock = pageData?.content?.find(b => b.type === 'download_app_section');
  const pricingBlock = pageData?.content?.find(b => b.type === 'pricing_section');
  const packagesBlock = pageData?.content?.find(b => b.type === 'health_packages_section');

  // Determine what to show
  const heroProps = heroBlock ? {
    title: heroBlock.data.title,
    subtitle: heroBlock.data.subtitle,
    image: heroBlock.data.image,
    showSearch: true,
    primary_button_text: heroBlock.data.primary_button_text,
    primary_button_link: heroBlock.data.primary_button_link,
    primary_button_new_tab: heroBlock.data.primary_button_new_tab,
    secondary_button_text: heroBlock.data.secondary_button_text,
    secondary_button_link: heroBlock.data.secondary_button_link,
    secondary_button_new_tab: heroBlock.data.secondary_button_new_tab
  } : {
    showSearch: true
  };

  // Features/Services
  const serviceItems = featuresBlock?.data?.features?.map((f: any) => ({
    title: f.title,
    description: f.description,
    icon: f.icon
  }));

  const testimonialsBlock = pageData?.content?.find(b => b.type === 'testimonials_list');
  const testimonialItems = testimonialsBlock?.data?.testimonials?.map((t: any) => ({
    quote: t.quote,
    author: t.author,
    role: t.role
  }));
  
  if (pageLoading) {
    return (
      <>
        <div className="relative bg-slate-900 h-[600px] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl space-y-6">
              <Skeleton className="w-3/4 h-16 rounded-lg bg-slate-800" />
              <Skeleton className="w-full h-24 rounded-lg bg-slate-800" />
              <Skeleton className="w-full h-12 rounded-lg bg-slate-800" />
            </div>
          </div>
        </div>
        <div className="py-20 bg-brand-gray-100">
           <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                 {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-6 rounded-xl h-40">
                       <Skeleton className="w-12 h-12 rounded-full mb-4" />
                       <Skeleton className="w-3/4 h-6" />
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Hero {...heroProps} />
      
      {/* Features / Services List */}
      {featuresBlock && <Services items={serviceItems} />}

      {/* Health Packages Section */}
      {packagesBlock && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-900 mb-4" dangerouslySetInnerHTML={{ __html: packagesBlock.data.title || "Health Packages Designed Around Your Life" }} />
              <p className="text-lg text-brand-gray-600 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: packagesBlock.data.subtitle || "Browse preventive, family, and chronic-care packages." }} />
              
              {(packagesBlock.data.packages?.some((p: any) => p.priceUsd) && packagesBlock.data.packages?.some((p: any) => p.price)) && (
                <div className="flex justify-center mt-6">
                  <div className="bg-gray-100 p-1 rounded-xl border border-gray-200 inline-flex shadow-sm">
                    <button
                      onClick={() => setPkgCurrency('USD')}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                        pkgCurrency === 'USD' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      onClick={() => setPkgCurrency('NPR')}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                        pkgCurrency === 'NPR' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      NPR (Rs)
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
              {packagesBlock.data.packages?.map((pkg: HealthPackage) => (
                <PackageCard 
                  key={pkg.id} 
                  pkg={pkg} 
                  onSelect={(p) => setSelectedPkg(p)} 
                  currency={pkgCurrency}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Specialities */}
      <section className="py-12 lg:py-20 bg-brand-gray-100">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center justify-between">
              <div className="text-2xl md:text-3xl font-extrabold text-brand-gray-900">Top Specialities</div>
              <Button to="/find-doctors" variant="outline" className="hidden sm:inline-block px-5 py-2.5 border border-brand-blue text-brand-blue font-semibold rounded-lg hover:bg-blue-50 transition-colors">Browse All</Button>
            </div>
            {loadingSpecs && (
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
                    <Skeleton variant="circular" width={64} height={64} className="mx-auto mb-4" />
                    <Skeleton variant="text" height={20} className="mx-auto w-3/4" />
                  </div>
                ))}
              </div>
            )}
            {!loadingSpecs && specsError && (
              <div className="mt-6 text-red-600">{specsError}</div>
            )}
            {!loadingSpecs && !specsError && (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {specialties.map(s => (
                <div key={s.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-brand-blue transition-all duration-300 text-center">
                  <div className="bg-blue-50 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    {s.icon_url ? (
                      <img
                        src={s.icon_url}
                        alt={s.name}
                        className="w-8 h-8 object-contain"
                        loading="lazy"
                      />
                    ) : ((s.icon_url || s.icon_path) ? (
                      <img
                        src={s.icon_url || resolveStorageUrl(s.icon_path)}
                        alt={s.name}
                        className="w-8 h-8 object-contain"
                        loading="lazy"
                      />
                    ) : (() => {
                        const LucideIcon = getIcon(s.slug) || getIcon(s.name);
                        if (LucideIcon) return <LucideIcon className="w-8 h-8 text-brand-blue" />;
                        if (s.name) return <span className="text-2xl font-bold">{s.name.charAt(0)}</span>;
                        return <Icon name="hospital" alt="Hospital" className="w-10 h-10" />;
                    })())}
                  </div>
                  <div className="font-semibold text-brand-gray-800" dangerouslySetInnerHTML={{ __html: s.name }} />
                <Button to="/video-consult" variant="outline" size="sm" className="mt-3 text-brand-blue font-bold border-none hover:bg-transparent hover:underline">CONSULT NOW</Button>
              </div>
              ))}
            </div>
            )}
            <div className="text-center mt-8 sm:hidden">
              <Button to="/find-doctors" variant="outline" className="px-5 py-2.5 border border-brand-blue text-brand-blue font-semibold rounded-lg hover:bg-blue-50 transition-colors">Browse All</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Block from Page Content */}
      {ctaBlock && (
        <section className="py-16 bg-brand-blue text-white">
            <div className="container mx-auto px-4 text-center">
                <div className="text-3xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: ctaBlock?.data?.title || '' }} />
                <div className="text-xl mb-8 opacity-90" dangerouslySetInnerHTML={{ __html: ctaBlock?.data?.description || '' }} />
                <Button 
                  to={ctaBlock?.data?.button_url || '#'} 
                  target={ctaBlock?.data?.button_new_tab ? "_blank" : undefined}
                  variant="subtle"
                  className="bg-white text-brand-blue font-bold px-8 py-3 hover:bg-gray-100 transition-colors"
                >
                    <div dangerouslySetInnerHTML={{ __html: ctaBlock?.data?.button_text || 'Learn More' }} />
                </Button>
            </div>
        </section>
      )}

      {onlineConsultBlock && (
        <OnlineConsultation 
          title={onlineConsultBlock?.data?.title}
          description={onlineConsultBlock?.data?.description}
        />
      )}
      
      {inClinicBlock && (
        <InClinicConsultation 
          items={specialties.map(s => ({
            icon: s.slug || 'doctor',
            icon_path: s.icon_path || undefined,
            icon_url: s.icon_url || undefined,
            name: s.name,
            description: s.description || `Expert consultation for ${s.name}`
          }))} 
          title={inClinicBlock?.data?.title}
          subtitle={inClinicBlock?.data?.subtitle}
        />
      )}
      
      {diagnosticsBlock && (
        <HomeDiagnostics 
          title={diagnosticsBlock?.data?.title}
          subtitle={diagnosticsBlock?.data?.subtitle}
          image={diagnosticsBlock?.data?.image}
          benefits={diagnosticsBlock?.data?.benefits}
        />
      )}
      
      {articlesBlock && (
        <Articles 
          title={articlesBlock?.data?.title}
          subtitle={articlesBlock?.data?.subtitle}
          defaultImage={articlesBlock?.data?.default_image}
        />
      )}

      {pricingBlock && (
        <Pricing 
          title={pricingBlock?.data?.title}
          subtitle={pricingBlock?.data?.subtitle}
          description={pricingBlock?.data?.description}
          plans={pricingBlock?.data?.plans}
          customPackageTitle={pricingBlock?.data?.customPackageTitle}
          customPackageDescription={pricingBlock?.data?.customPackageDescription}
          customPackageButtonText={pricingBlock?.data?.customPackageButtonText}
        />
      )}
      
      {testimonialsBlock && <Testimonials items={testimonialItems} title={testimonialsBlock?.data?.title} />}
      
      {downloadAppBlock && (
        <DownloadApp 
          title={downloadAppBlock?.data?.title}
          description={downloadAppBlock?.data?.description}
          cta_text={downloadAppBlock?.data?.cta_text}
          google_play_badge={downloadAppBlock?.data?.google_play_badge}
          app_store_badge={downloadAppBlock?.data?.app_store_badge}
          image={downloadAppBlock?.data?.image}
        />
      )}

      {selectedPkg && <PackageModal selected={selectedPkg} onClose={() => setSelectedPkg(null)} />}
    </>
  );
};

export default Home;
