import React from 'react';
import { usePageContent } from '@/hooks/usePageContent';
import { resolveSrc } from '@/utils/url';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import FleetSection from './components/FleetSection';
import PricingSection from './components/PricingSection';
import BookingForm from './components/BookingForm';
import Skeleton from '@/components/ui/Skeleton';

const NEMT: React.FC = () => {
  const { data: pageData, loading } = usePageContent('nemt');
  const heroBlock = pageData?.content?.find(b => b.type === 'hero_section');
  const servicesBlock = pageData?.content?.find(b => b.type === 'services_section');
  const fleetBlock = pageData?.content?.find(b => b.type === 'vehicles_list');
  const pricingBlock = pageData?.content?.find(b => b.type === 'pricing_section');
  const bookingBlock = pageData?.content?.find(b => b.type === 'booking_section');

  const heroProps = {
    title: heroBlock?.data?.title,
    subtitle: heroBlock?.data?.subtitle || heroBlock?.data?.description,
    image: heroBlock?.data?.image ? resolveSrc(heroBlock.data.image) : undefined,
  };

  const servicesProps = {
    label: servicesBlock?.data?.label,
    title: servicesBlock?.data?.title,
    description: servicesBlock?.data?.description,
    services: servicesBlock?.data?.items,
  };

  const fleetProps = {
    label: fleetBlock?.data?.label,
    title: fleetBlock?.data?.title,
    description: fleetBlock?.data?.description,
    featuresLabel: fleetBlock?.data?.features_label,
    ctaText: fleetBlock?.data?.cta_text,
    vehicles: fleetBlock?.data?.vehicles?.map((v: any) => ({
      ...v,
      image: resolveSrc(v.image)
    })),
  };

  const pricingProps = {
    label: pricingBlock?.data?.label,
    title: pricingBlock?.data?.title,
    description: pricingBlock?.data?.description,
    tiers: pricingBlock?.data?.tiers || pricingBlock?.data?.items,
    ctaText: pricingBlock?.data?.ctaText,
    disclaimer: pricingBlock?.data?.disclaimer,
  };

  const bookingProps = {
    title: bookingBlock?.data?.title,
    subtitle: bookingBlock?.data?.description,
    steps: {
      journey: bookingBlock?.data?.step_journey_label,
      vehicle: bookingBlock?.data?.step_vehicle_label,
      details: bookingBlock?.data?.step_details_label,
    },
    labels: bookingBlock?.data?.labels,
    placeholders: bookingBlock?.data?.placeholders,
    success: {
      title: bookingBlock?.data?.success_title,
      messageTemplate: bookingBlock?.data?.success_message,
      contactTemplate: bookingBlock?.data?.success_contact,
      buttonText: bookingBlock?.data?.success_button,
    },
    vehicles: fleetProps.vehicles,
    pricingTiers: pricingProps.tiers,
  };

  if (loading) {
    return (
      <main>
        {/* Hero Skeleton */}
        <div className="relative bg-slate-900 h-[600px] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl space-y-6">
              <Skeleton className="w-3/4 h-16 rounded-lg bg-slate-800" />
              <Skeleton className="w-full h-24 rounded-lg bg-slate-800" />
              <div className="flex gap-4 pt-4">
                <Skeleton className="w-40 h-12 rounded-lg bg-slate-800" />
                <Skeleton className="w-40 h-12 rounded-lg bg-slate-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Services Skeleton */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <Skeleton className="w-32 h-6 mx-auto rounded-full" />
              <Skeleton className="w-3/4 h-10 mx-auto rounded-lg" />
              <Skeleton className="w-full h-16 mx-auto rounded-lg" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 space-y-4">
                  <Skeleton className="w-14 h-14 rounded-xl" />
                  <Skeleton className="w-1/2 h-6 rounded-lg" />
                  <Skeleton className="w-full h-20 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Hero {...heroProps} />
      <ServicesSection {...servicesProps} />
      <FleetSection {...fleetProps} />
      <PricingSection {...pricingProps} />
      <BookingForm {...bookingProps} />
    </main>
  );
};

export default NEMT;
