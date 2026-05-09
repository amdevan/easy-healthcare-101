import React from 'react';
import { HandHeart, School, Baby, Activity, Leaf, Megaphone, ArrowRight } from 'lucide-react';
import { getIcon } from '@/utils/iconMapper';

interface ProgramItem { 
  icon?: string; 
  title: string; 
  description: string; 
  link?: string;
  new_tab?: boolean;
}

const programsList: ProgramItem[] = [
  { icon: 'hand-heart', title: 'Free Health Camps', description: 'Neighborhood-based camps offering basic checkups, BP and sugar tests.' },
  { icon: 'school', title: 'School Health', description: 'Awareness, dental hygiene, nutrition talks, and growth tracking.' },
  { icon: 'baby', title: 'Maternal & Child Care', description: 'Antenatal guidance, vaccinations, and postnatal follow-ups.' },
  { icon: 'activity', title: 'NCD Screening', description: 'Diabetes, hypertension, BMI and lifestyle counseling.' },
  { icon: 'leaf', title: 'Wellness & Nutrition', description: 'Diet support, fitness clubs, and mental well-being circles.' },
  { icon: 'megaphone', title: 'Awareness Drives', description: 'Street plays, workshops, and digital campaigns for prevention.' },
];

interface ProgramsGridProps {
  title?: string;
  subtitle?: string;
  description?: string;
  programs?: ProgramItem[];
}

const ProgramsGrid: React.FC<ProgramsGridProps> = ({ title, subtitle, description, programs }) => {
  const displayPrograms = programs && programs.length > 0 ? programs : programsList;

  const renderIcon = (iconName: string | undefined, index: number) => {
    const Icon = getIcon(iconName);
    // Fallback icons if getIcon returns null or iconName is undefined
    const fallbackIcons = [HandHeart, School, Baby, Activity, Leaf, Megaphone];
    const FallbackIcon = fallbackIcons[index % fallbackIcons.length];
    
    if (Icon) return <Icon className="h-8 w-8 text-white" />;
    return <FallbackIcon className="h-8 w-8 text-white" />;
  };

  return (
    <section id="programs" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-sm font-bold text-teal-600 uppercase tracking-wide mb-2" dangerouslySetInnerHTML={{ __html: subtitle || "Our Initiatives" }} />
          <div className="text-3xl md:text-4xl font-bold text-slate-900" dangerouslySetInnerHTML={{ __html: title || "Programs That Create Impact" }} />
          <div className="text-slate-600 text-lg" dangerouslySetInnerHTML={{ __html: description || "Designed with local communities to improve access, awareness, and outcomes." }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPrograms.map((p, i) => (
            <div key={i} className="group p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-50 transition-all duration-300">
              <div className="w-14 h-14 bg-teal-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-teal-200">
                {renderIcon(p.icon, i)}
              </div>
              <div className="text-xl font-bold text-slate-900 mb-2" dangerouslySetInnerHTML={{ __html: p.title }} />
              <div className="text-slate-600 mb-4" dangerouslySetInnerHTML={{ __html: p.description }} />
              
              {p.link && (
                <a 
                  href={p.link} 
                  target={p.new_tab ? "_blank" : undefined}
                  rel={p.new_tab ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center text-teal-600 font-semibold hover:text-teal-700 group/link"
                >
                  Learn More 
                  <ArrowRight size={16} className="ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsGrid;
