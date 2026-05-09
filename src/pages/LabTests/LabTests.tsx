import Hero from './components/Hero';
import Features from './components/Features';
import Process from './components/Process';
import { usePageContent } from '@/hooks/usePageContent';
import { resolveSrc } from '@/utils/url';
import Skeleton from '@/components/ui/Skeleton';

export default function LabTests() {
  const { data: pageData, loading } = usePageContent('lab-tests');
  const heroBlock = pageData?.content?.find(b => b.type === 'hero_section');
  const featuresBlock = pageData?.content?.find(b => b.type === 'features_section');
  const processBlock = pageData?.content?.find(b => b.type === 'process_section');
  
  const heroImg = heroBlock?.data?.image 
    ? resolveSrc(heroBlock.data.image) 
    : undefined;

  const heroProps = {
    title: heroBlock?.data?.title,
    subtitle: heroBlock?.data?.subtitle || heroBlock?.data?.description,
    image: heroImg,
    stats: heroBlock?.data?.stats,
    primaryButtonText: heroBlock?.data?.primary_button_text,
    primaryButtonLink: heroBlock?.data?.primary_button_link,
    primaryButtonNewTab: heroBlock?.data?.primary_button_new_tab,
    secondaryButtonText: heroBlock?.data?.secondary_button_text,
    secondaryButtonLink: heroBlock?.data?.secondary_button_link,
    secondaryButtonNewTab: heroBlock?.data?.secondary_button_new_tab,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main>
          {/* Hero Skeleton */}
          <div className="bg-white py-20">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 w-full space-y-6">
                  <Skeleton className="w-3/4 h-12 rounded-lg" />
                  <Skeleton className="w-full h-24 rounded-lg" />
                  <div className="flex gap-4">
                    <Skeleton className="w-40 h-12 rounded-lg" />
                    <Skeleton className="w-40 h-12 rounded-lg" />
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <Skeleton className="w-full h-80 rounded-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Features Skeleton */}
          <div className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <Skeleton className="w-1/2 h-10 mx-auto rounded-lg" />
                <Skeleton className="w-3/4 h-6 mx-auto rounded-lg" />
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <Skeleton className="w-3/4 h-6 rounded-lg" />
                    <Skeleton className="w-full h-16 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        <Hero {...heroProps} />
        <Features 
          title={featuresBlock?.data?.title} 
          description={featuresBlock?.data?.description}
          items={featuresBlock?.data?.items}
        />
        <Process 
          title={processBlock?.data?.title} 
          description={processBlock?.data?.description}
          steps={processBlock?.data?.steps}
        />
      </main>
    </div>
  );
}
