import React from 'react';
import { usePageContent } from '@/hooks/usePageContent';
import Hero from './components/Hero';
import ProgramsGrid from './components/ProgramsGrid';
import Events from './components/Events';
import VolunteerForm from './components/VolunteerForm';
import Skeleton from '@/components/ui/Skeleton';

const CommunityHealth: React.FC = () => {
  const { data: pageData, loading } = usePageContent('community-health');
  const heroBlock = pageData?.content?.find(b => b.type === 'hero_section');
  const programsBlock = pageData?.content?.find(b => b.type === 'programs_section');
  const eventsBlock = pageData?.content?.find(b => b.type === 'events_section');
  const volunteerBlock = pageData?.content?.find(b => b.type === 'volunteer_section');

  const heroProps = {
    title: heroBlock?.data?.title,
    subtitle: heroBlock?.data?.subtitle,
    image: heroBlock?.data?.image,
    primary_button_text: heroBlock?.data?.primary_button_text,
    primary_button_link: heroBlock?.data?.primary_button_link,
    primary_button_new_tab: heroBlock?.data?.primary_button_new_tab,
    secondary_button_text: heroBlock?.data?.secondary_button_text,
    secondary_button_link: heroBlock?.data?.secondary_button_link,
    secondary_button_new_tab: heroBlock?.data?.secondary_button_new_tab
  };

  const programsProps = {
    title: programsBlock?.data?.title,
    subtitle: programsBlock?.data?.subtitle,
    description: programsBlock?.data?.description,
    programs: programsBlock?.data?.items
  };

  const eventsProps = {
    title: eventsBlock?.data?.title,
    ctaText: eventsBlock?.data?.ctaText,
    events: eventsBlock?.data?.items
  };

  const volunteerProps = {
    title: volunteerBlock?.data?.title,
    subtitle: volunteerBlock?.data?.description,
    successTitle: volunteerBlock?.data?.success_title,
    successMessage: volunteerBlock?.data?.success_message,
    labels: volunteerBlock?.data?.labels,
    placeholders: volunteerBlock?.data?.placeholders
  };

  if (loading) {
    return (
      <main>
        {/* Hero Skeleton */}
        <div className="relative bg-slate-900 h-[500px] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl space-y-6">
              <Skeleton className="w-2/3 h-16 rounded-lg bg-slate-800" />
              <Skeleton className="w-full h-24 rounded-lg bg-slate-800" />
            </div>
          </div>
        </div>

        {/* Programs Grid Skeleton */}
        <div className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <Skeleton className="w-64 h-10 mx-auto rounded-lg" />
              <Skeleton className="w-full max-w-2xl h-16 mx-auto rounded-lg" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <Skeleton className="w-full h-48" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="w-3/4 h-8" />
                    <Skeleton className="w-full h-20" />
                    <Skeleton className="w-1/3 h-6" />
                  </div>
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
      <ProgramsGrid {...programsProps} />
      <Events {...eventsProps} />
      <VolunteerForm {...volunteerProps} />
    </main>
  );
};

export default CommunityHealth;
