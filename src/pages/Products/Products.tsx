import React, { useState } from 'react';
import { usePageContent } from '@/hooks/usePageContent';
import { HEALTH_PACKAGES, ADDITIONAL_SERVICES } from './constants';
import PackageCard from './components/PackageCard';
import PackageModal from './components/PackageModal';
import Hero from './components/Hero';
import { HealthPackage } from './types';
import { Plus, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';

const Products: React.FC = () => {
  const [selected, setSelected] = useState<HealthPackage | null>(null);
  const [currency, setCurrency] = useState<'USD' | 'NPR'>('USD');
  const { data: pageData, loading } = usePageContent('health-package');
  
  const heroBlock = pageData?.content?.find(b => b.type === 'hero_section');
  const basicsBlock = pageData?.content?.find(b => b.type === 'basics_section');
  const ctaBlock = pageData?.content?.find(b => b.type === 'cta_section');
  const packagesBlock = pageData?.content?.find(b => b.type === 'packages_section');

  const packages = (packagesBlock?.data?.packages || HEALTH_PACKAGES) as HealthPackage[];

  const hasNpr = packages.some(p => p.price !== undefined && p.price !== null);
  const hasUsd = packages.some(p => p.priceUsd !== undefined && p.priceUsd !== null);

  // Effect to ensure correct currency is selected if one is missing
  React.useEffect(() => {
    if (!hasUsd && hasNpr) {
        setCurrency('NPR');
    } else if (hasUsd && !hasNpr) {
        setCurrency('USD');
    }
  }, [hasUsd, hasNpr]);

  const showCurrencyToggle = hasUsd && hasNpr;
  
  // Handle additional services which might be strings or objects in CMS
  const rawServices = basicsBlock?.data?.services || basicsBlock?.data?.items || ADDITIONAL_SERVICES;
  const additionalServices = Array.isArray(rawServices) 
    ? rawServices.map(s => typeof s === 'string' ? s : s.title || s.name || '')
    : ADDITIONAL_SERVICES;

  const scrollToPackages = () => {
    const element = document.getElementById('packages');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="pt-0 pb-8 lg:pb-12 bg-brand-gray-100">
        <div className="container mx-auto px-4">
          <div className="mb-8 pt-12">
            <div className="max-w-4xl mx-auto text-center">
               <Skeleton className="w-64 h-12 mx-auto mb-4 bg-gray-300" />
               <Skeleton className="w-full max-w-2xl h-6 mx-auto mb-8 bg-gray-300" />
               <Skeleton className="w-40 h-12 mx-auto rounded-full bg-gray-300" />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto mt-12">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <Skeleton className="w-16 h-16 rounded-full mb-4" />
                <Skeleton className="w-3/4 h-8 mb-2" />
                <Skeleton className="w-1/2 h-6 mb-6" />
                <div className="space-y-3 mb-8">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                </div>
                <Skeleton className="w-full h-12 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-0 pb-8 lg:pb-12 bg-brand-gray-100">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Hero
            title={heroBlock?.data?.title || "Health Packages Designed Around Your Life"}
            subtitle={heroBlock?.data?.description || "Browse preventive, family, and chronic-care packages. Simple, clear inclusions and pricing."}
            primaryCtaText="Browse Packages"
            onPrimaryCtaClick={scrollToPackages}
          />
        </div>

        {showCurrencyToggle && (
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-xl border border-gray-200 inline-flex shadow-sm">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  currency === 'USD' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('NPR')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  currency === 'NPR' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                NPR (Rs)
              </button>
            </div>
          </div>
        )}

        <div id="packages" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {packages.map((pkg) => (
            <PackageCard 
              key={pkg.id} 
              pkg={pkg} 
              onSelect={(p) => setSelected(p)} 
              currency={currency}
            />
          ))}
        </div>

        {/* Beyond the Basics: Additional premium add-on services as cards */}
        <div className="mt-14 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-teal-700">Comprehensive Care</div>
              <div className="mt-1 text-2xl font-bold text-brand-gray-900" dangerouslySetInnerHTML={{ __html: basicsBlock?.data?.title || "Beyond the Basics" }} />
              <div className="mt-2 text-brand-gray-600 max-w-2xl" dangerouslySetInnerHTML={{ __html: basicsBlock?.data?.description || "Personalize your healthcare experience with our premium add-on services available across all packages." }} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {additionalServices.map((svc: string, idx: number) => (
              <div key={idx} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-teal-50 text-teal-600">
                    <Plus className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-medium text-brand-gray-900" dangerouslySetInnerHTML={{ __html: svc }} />
                    <div className="text-xs text-brand-gray-500 mt-1">Available on request</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA banner */}
        <div className="mt-16">
          <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-800 p-10 text-center text-white shadow-xl">
            <div className="text-2xl md:text-3xl font-bold" dangerouslySetInnerHTML={{ __html: ctaBlock?.data?.title || "Your Health Journey Starts Here" }} />
            <div className="mt-3 text-sm md:text-base text-slate-300" dangerouslySetInnerHTML={{ __html: ctaBlock?.data?.description || "Join thousands who trust Vitality Health for preventive and chronic care needs. Simple, transparent, and effective." }} />
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button to={ctaBlock?.data?.primary_button_url || "/video-consult"} variant="primary" size="md">{ctaBlock?.data?.primary_button_text || "Book Consultation"}</Button>
              <Button to={ctaBlock?.data?.secondary_button_url || "/contact"} variant="subtle" size="md">{ctaBlock?.data?.secondary_button_text || "Contact Sales"}</Button>
            </div>
          </div>
        </div>
      </div>

      {selected && <PackageModal selected={selected} onClose={() => setSelected(null)} />}
    </section>
  );
};


export default Products;
