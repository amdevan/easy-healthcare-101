import React from 'react';
import { useParams } from 'react-router-dom';
import { usePageContent } from '@/hooks/usePageContent';
import { fetchGeneralSetting, fetchSpecialties, SpecialtyDto } from '@/controllers/api';
import { getIcon } from '@/utils/iconMapper';
import { resolveSrc } from '@/utils/url';

// About Page Components
import AboutHero from '@/components/about/Hero';
import CoreValues from '@/components/about/CoreValues';
import OurStory from '@/components/about/OurStory';
import Ecosystem from '@/components/about/Ecosystem';
import Impact from '@/components/about/Impact';
import FutureDirection from '@/components/about/FutureDirection';
import AboutCTA from '@/components/about/CTA';

// Primary Health Components
import PrimaryHero from '@/pages/PrimaryHealth/components/Hero';
import PrimaryServices from '@/pages/PrimaryHealth/components/Services';
import PrimaryAbout from '@/pages/PrimaryHealth/components/About';
import AppointmentForm from '@/pages/PrimaryHealth/components/AppointmentForm';

// NEMT Components
import NEMTServices from '@/pages/NEMT/components/ServicesSection';
import FleetSection from '@/pages/NEMT/components/FleetSection';
import NEMTPricing from '@/pages/NEMT/components/PricingSection';
import NEMTBooking from '@/pages/NEMT/components/BookingForm';

// Community Health Components
import CommunityHero from '@/pages/CommunityHealth/components/Hero';
import CommunityPrograms from '@/pages/CommunityHealth/components/ProgramsGrid';
import CommunityEvents from '@/pages/CommunityHealth/components/Events';
import CommunityVolunteer from '@/pages/CommunityHealth/components/VolunteerForm';

// Services Page Components
import ServiceGrid from '@/pages/Services/components/ServiceGrid';
import Stats from '@/pages/Services/components/Stats';
import ServicesHero from '@/pages/Services/components/Hero';
import ServicesCTA from '@/pages/Services/components/CTA';

// Telemedicine Components
import TeleHero from '@/pages/Telemedicine/components/Hero';
import TeleOverview from '@/pages/Telemedicine/components/Overview';
import TeleFeatures from '@/pages/Telemedicine/components/Features';
import TeleBenefits from '@/pages/Telemedicine/components/Benefits';
import TeleSpecializedPrograms from '@/pages/Telemedicine/components/SpecializedPrograms';
import TeleTechPlatform from '@/pages/Telemedicine/components/TechPlatform';
import TeleHowItWorks from '@/pages/Telemedicine/components/HowItWorks';
import TeleImpact from '@/pages/Telemedicine/components/Impact';
import TeleCTA from '@/pages/Telemedicine/components/CTA';

// Common Components (used in Home)
import Services from '@/components/common/Services';
import OnlineConsultation from '@/components/common/OnlineConsultation';
import InClinicConsultation from '@/components/common/InClinicConsultation';
import HomeDiagnostics from '@/components/common/HomeDiagnostics';
import Articles from '@/components/common/Articles';
import Testimonials from '@/components/common/Testimonials';
import DownloadApp from '@/components/common/DownloadApp';
import TextBlock from '@/components/common/TextBlock';
import MainHero from '@/components/Hero';
import PackageCard from '@/pages/Products/components/PackageCard';
import PackageModal from '@/pages/Products/components/PackageModal';
import { HealthPackage } from '@/pages/Products/types';

interface DynamicPageProps {
  slugProp?: string;
  isHome?: boolean;
  checkHomeSlug?: string | null;
}

const DynamicPage: React.FC<DynamicPageProps> = ({ slugProp, isHome, checkHomeSlug }) => {
    const params = useParams<{ slug: string }>();
    const slug = slugProp || params.slug;
    
    const isHomePage = isHome || (checkHomeSlug && slug === checkHomeSlug);
    const { data: pageData, loading, error } = usePageContent(slug || '');
    
    const [specialties, setSpecialties] = React.useState<SpecialtyDto[]>([]);
    const [loadingSpecialties, setLoadingSpecialties] = React.useState(false);
    const [selectedPkg, setSelectedPkg] = React.useState<HealthPackage | null>(null);

    React.useEffect(() => {
        if (pageData?.content?.some((b: any) => b.type === 'in_clinic_consultation_section')) {
            setLoadingSpecialties(true);
            fetchSpecialties()
                .then(setSpecialties)
                .catch(err => console.error("Failed to fetch specialties", err))
                .finally(() => setLoadingSpecialties(false));
        }
    }, [pageData]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
            </div>
        );
    }

    if (error || !pageData) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <div className="text-xl text-gray-600">Page not found</div>
            </div>
        );
    }

    const blocks = pageData.content || [];

    const renderBlock = (block: any, idx: number) => {
        const t = block?.type;
        const d = block?.data || {};

        switch (t) {
            // -- Generic / Home Blocks --
            case 'hero_section':
                // Check for Primary Health style
                if (slug === 'primary-health') {
                     return <PrimaryHero key={idx} title={d.title} subtitle={d.subtitle} image={d.image} primary_button_text={d.primary_button_text} primary_button_link={d.primary_button_link} primary_button_new_tab={d.primary_button_new_tab} secondary_button_text={d.secondary_button_text} secondary_button_link={d.secondary_button_link} secondary_button_new_tab={d.secondary_button_new_tab} />;
                }
                // Check for Community Health style
                if (slug === 'community-health') {
                     return <CommunityHero key={idx} title={d.title} subtitle={d.subtitle} image={d.image} primary_button_text={d.primary_button_text} primary_button_link={d.primary_button_link} primary_button_new_tab={d.primary_button_new_tab} secondary_button_text={d.secondary_button_text} secondary_button_link={d.secondary_button_link} secondary_button_new_tab={d.secondary_button_new_tab} />;
                }
                // Check for Telemedicine style
                if (slug === 'telemedicine') {
                     return <TeleHero key={idx} title={d.title} subtitle={d.subtitle || d.description} image={d.image} primary_button_text={d.primary_button_text} primary_button_link={d.primary_button_link} primary_button_new_tab={d.primary_button_new_tab} secondary_button_text={d.secondary_button_text} secondary_button_link={d.secondary_button_link} secondary_button_new_tab={d.secondary_button_new_tab} />;
                }
                // Check for Services style
                if (slug === 'services') {
                     return <ServicesHero key={idx} title={d.title} subtitle={d.subtitle || d.description} primary_button_text={d.primary_button_text} primary_button_link={d.primary_button_link} primary_button_new_tab={d.primary_button_new_tab} secondary_button_text={d.secondary_button_text} secondary_button_link={d.secondary_button_link} secondary_button_new_tab={d.secondary_button_new_tab} />;
                }
                // Check if it's the "About" style hero or "Home" style hero
                if (slug === 'about' || d.primary_button_text || d.stats) {
                    return <AboutHero key={idx} title={d.title} subtitle={d.subtitle} description={d.description} image={d.image} badge={d.badge} primaryButtonText={d.primary_button_text} primaryButtonLink={d.primary_button_link} primaryButtonNewTab={d.primary_button_new_tab} secondaryButtonText={d.secondary_button_text} secondaryButtonLink={d.secondary_button_link} secondaryButtonNewTab={d.secondary_button_new_tab} stats={d.stats} />;
                }
                // NEMT Hero style fallback (if needed, otherwise MainHero)
                return <MainHero key={idx} title={d.title} subtitle={d.subtitle} image={d.image} />;

            case 'services_section':
                // Primary Health Services
                if (slug === 'primary-health' || (d.items && !d.services)) { 
                     return <PrimaryServices key={idx} title={d.title} subtitle={d.subtitle} description={d.description} items={d.items} />;
                }
                // NEMT Services
                if (slug === 'nemt' || d.services || d.label) {
                     return <NEMTServices key={idx} label={d.label} title={d.title} description={d.description} services={d.services || d.items} />;
                }
                return <PrimaryServices key={idx} title={d.title} subtitle={d.subtitle} description={d.description} items={d.items} />;

            case 'about_section':
                 if (slug === 'primary-health') {
                     return <PrimaryAbout key={idx} title={d.title} subtitle={d.subtitle} description={d.description} images={d.images} image1={d.image_1} image2={d.image_2} />;
                 }
                 // Generic About Section (for About page)
                 {
                    const img1 = d.image_1 ? resolveSrc(d.image_1) : (Array.isArray(d.images) && d.images[0] ? resolveSrc(d.images[0]) : "https://picsum.photos/400/500?grayscale");
                    const img2 = d.image_2 ? resolveSrc(d.image_2) : (Array.isArray(d.images) && d.images[1] ? resolveSrc(d.images[1]) : "https://picsum.photos/400/500?blur=2");
                    return (
                        <section key={idx} className="py-20 bg-slate-50">
                            <div className="container mx-auto px-4 md:px-6">
                                <div className="flex flex-col md:flex-row items-center gap-16">
                                    <div className="md:w-1/2">
                                        <div className="grid grid-cols-2 gap-4">
                                            <img src={img1} alt={d.title || "About"} className="rounded-2xl shadow-lg mt-8" referrerPolicy="no-referrer" onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/400/500?blur=2'; }} />
                                            <img src={img2} alt={d.title || "About"} className="rounded-2xl shadow-lg mb-8" referrerPolicy="no-referrer" onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/400/500'; }} />
                                        </div>
                                    </div>
                                    <div className="md:w-1/2 space-y-6">
                                        <div className="text-teal-600 font-bold uppercase tracking-wide" dangerouslySetInnerHTML={{ __html: d.subtitle || "About Easy Health Care" }} />
                                        <div className="text-3xl md:text-4xl font-bold text-slate-900" dangerouslySetInnerHTML={{ __html: d.title || "Dedicated to Continuous & Affordable Care" }} />
                                        <div className="text-slate-600 text-lg leading-relaxed">
                                            {d.description ? <div dangerouslySetInnerHTML={{ __html: d.description }} /> : "We bring together clinical care ..."}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    );
                 }

            case 'appointment_section':
                 return <AppointmentForm key={idx} title={d.title} subtitle={d.subtitle} successTitle={d.success_title} successMessage={d.success_message} contactInfo={d.contact_info} labels={d.labels} placeholders={d.placeholders} />;

            // -- NEMT Specific --
            case 'vehicles_list':
                 return <FleetSection key={idx} label={d.label} title={d.title} description={d.description} featuresLabel={d.features_label} ctaText={d.cta_text} vehicles={d.vehicles?.map((v: any) => ({ ...v, image: resolveSrc(v.image) }))} />;

            case 'pricing_section':
                 return <NEMTPricing key={idx} label={d.label} title={d.title} description={d.description} tiers={d.tiers || d.items} ctaText={d.ctaText} disclaimer={d.disclaimer} />;

            case 'booking_section':
                 return <NEMTBooking key={idx} title={d.title} subtitle={d.description} steps={d.steps} labels={d.labels} placeholders={d.placeholders} success={d.success} vehicles={d.vehicles} />;

            // -- Community Health Specific --
            case 'programs_section':
                 if (slug === 'community-health') {
                     return <CommunityPrograms key={idx} title={d.title} subtitle={d.subtitle} description={d.description} programs={d.items} />;
                 }
                 if (slug === 'telemedicine') {
                     return <TeleSpecializedPrograms key={idx} title={d.title} description={d.description} items={d.items} />;
                 }
                 return null;

            case 'events_section':
                 return <CommunityEvents key={idx} title={d.title} ctaText={d.ctaText} events={d.items} />;

            case 'volunteer_section':
                 return <CommunityVolunteer key={idx} title={d.title} subtitle={d.description} successTitle={d.success_title} successMessage={d.success_message} labels={d.labels} placeholders={d.placeholders} />;

            // -- Telemedicine Specific --
            case 'overview_section':
                 return <TeleOverview key={idx} title={d.title} description={d.description} items={d.items} />;
            
            case 'features_section':
                 return <TeleFeatures key={idx} title={d.title} subtitle={d.subtitle} items={d.items} />;

            case 'benefits_section':
                 return <TeleBenefits key={idx} title={d.title} description={d.description} image={d.image} imageCaption={d.imageCaption} items={d.items} />;

            case 'tech_platform':
                 return <TeleTechPlatform key={idx} title={d.title} description={d.description} image={d.image} items={d.items} />;

            case 'how_it_works':
                 return <TeleHowItWorks key={idx} title={d.title} subtitle={d.subtitle} steps={d.steps} />;
            
            case 'impact_section':
                 if (slug === 'telemedicine') {
                     return <TeleImpact key={idx} title={d.title} items={d.items} />;
                 }
                 // Default to About Impact
                 return <Impact 
                    key={idx} 
                    title={d.title} 
                    subtitle={d.subtitle} 
                    description={d.description} 
                    stats={d.stats} 
                    areas={d.areas || d.items} 
                    areasTitle={d.areas_title} 
                    areasDescription={d.areas_description} 
                 />;
            
            case 'cta_section':
                 if (slug === 'telemedicine') {
                     return <TeleCTA key={idx} title={d.title} description={d.description} buttonText={d.buttonText || d.button_text || d.primary_button_text} buttonUrl={d.primary_button_url || d.primary_button_link || d.button_url} buttonNewTab={d.primary_button_new_tab || d.button_new_tab} supportText={d.supportText} />;
                 }
                 if (slug === 'services') {
                     return <ServicesCTA key={idx} title={d.title} description={d.description} primaryButtonText={d.primary_button_text || d.buttonText || d.button_text} primaryButtonUrl={d.primary_button_link || d.buttonLink || d.button_url} primaryButtonNewTab={d.primary_button_new_tab} secondaryButtonText={d.secondary_button_text} secondaryButtonUrl={d.secondary_button_link} secondaryButtonNewTab={d.secondary_button_new_tab} />;
                 }
                 return <AboutCTA key={idx} badge={d.badge} title={d.title} description={d.description} primaryButtonText={d.primary_button_text || d.buttonText || d.button_text} primaryButtonLink={d.primary_button_link || d.button_url} primaryButtonNewTab={d.primary_button_new_tab || d.button_new_tab} secondaryLinks={d.secondary_links} />;

            case 'features_list':
                if (slug === 'services') {
                     // Map items to match ServiceGrid expectation if needed
                     const serviceItems = d.features?.map((f: any, i: number) => ({
                        id: f.id || `service-${i}`,
                        title: f.title,
                        desc: f.description,
                        href: f.url || '#',
                        newTab: f.new_tab,
                        iconName: f.icon,
                        // Add default styles to cycle through
                        iconBg: ['bg-blue-100', 'bg-green-100', 'bg-rose-100', 'bg-amber-100', 'bg-indigo-100', 'bg-emerald-100'][i % 6],
                        decor: ['from-blue-200', 'from-green-200', 'from-rose-200', 'from-amber-200', 'from-indigo-200', 'from-emerald-200'][i % 6]
                     }));
                     return <ServiceGrid key={idx} items={serviceItems} />;
                }
                const serviceItems = d.features?.map((f: any) => ({
                    title: f.title,
                    description: f.description,
                    icon: f.icon,
                    url: f.url,
                    newTab: f.new_tab
                }));
                return <Services key={idx} items={serviceItems} />;

            case 'stats_section':
                 return <Stats key={idx} items={d.items} />;

            case 'online_consultation_section':
                return <OnlineConsultation key={idx} title={d.title} description={d.description} />;

            case 'in_clinic_consultation_section':
                return <InClinicConsultation 
                    key={idx} 
                    loading={loadingSpecialties}
                    items={specialties.map(s => ({
                        icon: s.slug || 'doctor',
                        icon_path: s.icon_path || undefined,
                        icon_url: s.icon_url || undefined,
                        name: s.name,
                        description: s.description || `Expert consultation for ${s.name}`
                    }))} 
                    title={d.title} 
                    subtitle={d.subtitle} 
                />;

            case 'diagnostics_section':
                return <HomeDiagnostics key={idx} title={d.title} subtitle={d.subtitle} image={d.image} benefits={d.benefits} />;

            case 'articles_section':
                return <Articles key={idx} title={d.title} subtitle={d.subtitle} defaultImage={d.default_image} />;

            case 'testimonials_list':
                const testimonialItems = d.testimonials?.map((t: any) => ({
                    quote: t.quote,
                    author: t.author,
                    role: t.role
                }));
                return <Testimonials key={idx} items={testimonialItems} title={d.title} />;

            case 'download_app_section':
                return <DownloadApp key={idx} title={d.title} description={d.description} cta_text={d.cta_text} google_play_badge={d.google_play_badge} app_store_badge={d.app_store_badge} image={d.image} />;

            case 'text_block':
                return <TextBlock key={idx} content={d.content} />;

            case 'core_values':
                return <CoreValues key={idx} mission={d.mission} vision={d.vision} values={d.values} />;

            case 'our_story':
                return <OurStory key={idx} title={d.title} subtitle={d.subtitle} description1={d.description_1} description2={d.description_2} quote={d.quote} image={d.image} services={d.services} />;

            case 'ecosystem_section':
                return <Ecosystem key={idx} title={d.title} subtitle={d.subtitle} description={d.description} items={d.items} />;

            // Duplicate impact_section handled above for Telemedicine, check generic here if not Telemedicine
            // But switch case matches only once. Telemedicine uses 'impact_section' too.
            // We need to check slug or data structure.
            // Let's modify the impact_section case above.
            
            case 'health_packages_section':
                return (
                    <section key={idx} className="py-16 bg-white">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-900 mb-4" dangerouslySetInnerHTML={{ __html: d.title || "Health Packages Designed Around Your Life" }} />
                                <p className="text-lg text-brand-gray-600 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: d.subtitle || "Browse preventive, family, and chronic-care packages." }} />
                            </div>
                            
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
                                {d.packages?.map((pkg: any) => (
                                    <PackageCard 
                                        key={pkg.id} 
                                        pkg={pkg} 
                                        onSelect={(p) => setSelectedPkg(p)} 
                                        currency="USD"
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                );

            case 'future_section':
                return <FutureDirection key={idx} title={d.title} subtitle={d.subtitle} description={d.description} steps={d.steps} />;

            // cta_section is also duplicated. 
            // Telemedicine uses it. About uses it.
            // We should merge them.
            
            case 'call_to_action':
                 return <AboutCTA key={idx} badge={d.badge} title={d.title} description={d.description} primaryButtonText={d.button_text} primaryButtonLink={d.button_url} primaryButtonNewTab={d.button_new_tab} secondaryLinks={d.secondary_links} />;

            default:
                console.warn(`Unknown block type: ${t}`, block);
                return null;
        }
    };

    return (
        <main>
            {blocks.map((block: any, idx: number) => renderBlock(block, idx))}
            {selectedPkg && <PackageModal selected={selectedPkg} onClose={() => setSelectedPkg(null)} />}
        </main>
    );
};

export default DynamicPage;
