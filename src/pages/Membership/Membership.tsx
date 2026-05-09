import React from 'react';
import { usePageContent } from '@/hooks/usePageContent';
import { resolveSrc } from '@/utils/url';
import Hero from './components/Hero';
import Features from './components/Features';
import ValueProp from './components/ValueProp';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Skeleton from '@/components/ui/Skeleton';
import { defaultMembershipData } from './defaultData';

interface MembershipProps {
  slug?: string;
}

const Membership: React.FC<MembershipProps> = ({ slug }) => {
  const [pageSlug, setPageSlug] = React.useState(slug || 'easy-care-365');
  const { data: apiData, loading, error } = usePageContent(pageSlug);

  // Use API data if available, otherwise fallback to default data for easy-care-365
  const pageData = apiData || (pageSlug === 'easy-care-365' ? defaultMembershipData : null);

  const heroBlock = pageData?.content?.find((b: any) => b.type === 'hero_section');
  const featuresBlock = pageData?.content?.find((b: any) => b.type === 'features_section');
  const valuePropBlock = pageData?.content?.find((b: any) => b.type === 'value_prop_section');
  const pricingBlock = pageData?.content?.find((b: any) => b.type === 'pricing_section');
  const faqBlock = pageData?.content?.find((b: any) => b.type === 'faq_section');
  const testimonialsBlock = pageData?.content?.find((b: any) => b.type === 'testimonials_section');

  React.useEffect(() => {
    // Only try to switch slug if we don't have fallback data
    if (error && pageSlug === 'easy-care-365' && !pageData) {
      setPageSlug('membership');
    }
  }, [error, pageSlug, pageData]);

  const heroProps = {
    title: heroBlock?.data?.title,
    subtitle: heroBlock?.data?.description,
    image: heroBlock?.data?.image ? resolveSrc(heroBlock.data.image) : undefined,
  };

  const featuresProps = {
    title: featuresBlock?.data?.title,
    subtitle: featuresBlock?.data?.subtitle,
    description: featuresBlock?.data?.description,
    items: featuresBlock?.data?.items,
  };

  const valuePropProps = {
    title: valuePropBlock?.data?.title,
    subtitle: valuePropBlock?.data?.subtitle,
    items: valuePropBlock?.data?.items,
  };

  const pricingProps = {
    title: pricingBlock?.data?.title,
    subtitle: pricingBlock?.data?.subtitle,
    description: pricingBlock?.data?.description,
    plans: pricingBlock?.data?.plans,
    customPackageTitle: pricingBlock?.data?.customPackageTitle,
    customPackageDescription: pricingBlock?.data?.customPackageDescription,
    customPackageButtonText: pricingBlock?.data?.customPackageButtonText,
  };
  
  const testimonialItems = Array.isArray(testimonialsBlock?.data?.testimonials)
    ? testimonialsBlock.data.testimonials
        .map((t: any, idx: number) => ({
          id: typeof t?.id === 'number' ? t.id : idx,
          content: String(t?.content ?? ''),
          author_name: String(t?.author_name ?? ''),
          location: t?.location ? String(t.location) : null,
          author_role: t?.author_role ? String(t.author_role) : null,
          image_url: t?.image ? resolveSrc(String(t.image)) : null,
          rating: typeof t?.rating === 'number' ? t.rating : null,
        }))
        .filter((t: any) => t.content && t.author_name)
    : undefined;

  if (loading) {
    return (
      <main className="bg-white">
        {/* Hero Skeleton */}
        <div className="relative bg-teal-900 py-24 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-6">
              <Skeleton className="w-2/3 h-16 rounded-lg bg-teal-800" />
              <Skeleton className="w-full h-24 rounded-lg bg-teal-800" />
              <div className="flex gap-4 pt-4">
                <Skeleton className="w-40 h-12 rounded-xl bg-teal-800" />
                <Skeleton className="w-40 h-12 rounded-xl bg-teal-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Value Prop Skeleton */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="text-center space-y-4">
                  <Skeleton variant="circular" width={80} height={80} className="mx-auto" />
                  <Skeleton className="w-3/4 h-8 mx-auto" />
                  <Skeleton className="w-full h-20 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Skeleton */}
        <div className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <Skeleton className="w-64 h-10 mx-auto" />
              <Skeleton className="w-full max-w-2xl h-16 mx-auto" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm h-[500px] flex flex-col">
                  <Skeleton className="w-1/2 h-8 mb-4" />
                  <Skeleton className="w-3/4 h-16 mb-8" />
                  <div className="space-y-4 flex-1">
                    {[1, 2, 3, 4, 5].map(j => (
                      <Skeleton key={j} className="w-full h-6" />
                    ))}
                  </div>
                  <Skeleton className="w-full h-12 rounded-xl mt-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !pageData) {
    return (
      <main className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="text-xl text-slate-600">Failed to load page.</div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <Hero {...heroProps} />
      <ValueProp {...valuePropProps} />
      <Features {...featuresProps} />
      <Testimonials
        title={testimonialsBlock?.data?.title}
        subtitle={testimonialsBlock?.data?.subtitle}
        limit={typeof testimonialsBlock?.data?.limit === 'number' ? testimonialsBlock.data.limit : undefined}
        items={testimonialItems}
      />
      <Pricing {...pricingProps} />
      <FAQ
        title={faqBlock?.data?.title}
        subtitle={faqBlock?.data?.subtitle}
        items={faqBlock?.data?.items}
        ctaText={faqBlock?.data?.cta_text}
        ctaLink={faqBlock?.data?.cta_link}
        ctaNewTab={faqBlock?.data?.cta_new_tab}
      />
    </main>
  );
};

export default Membership;
