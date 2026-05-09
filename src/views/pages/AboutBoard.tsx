import React from 'react';
import Hero from '../../../vendor/board-of-director/components/Hero';
import BoardMembers from '../../../vendor/board-of-director/components/BoardMembers';
import { usePageContent } from '@/hooks/usePageContent';

const AboutBoard: React.FC = () => {
  const { data: pageData } = usePageContent('board-of-director');
  const blocks = pageData?.content || [];

  const renderBlock = (block: any, idx: number) => {
    const t = block?.type;
    const d = block?.data || {};

    if (t === 'hero_section') {
        // Use block image if available. 
        // If block image is empty OR it is the default unsplash image AND a custom page hero exists, use the page hero.
        let heroImg = d.image;
        const isDefaultUnsplash = heroImg && typeof heroImg === 'string' && heroImg.includes('unsplash.com');
        
        if (!heroImg || (isDefaultUnsplash && pageData?.hero_image)) {
            if (pageData?.hero_image) {
                heroImg = pageData.hero_image;
            }
        }
        
        return <Hero key={idx} title={d.title} subtitle={d.subtitle} image={heroImg} />; 
    }
    if (t === 'board_members_section') {
        return (
            <section key={idx} id="board-members" className="scroll-mt-10">
                <BoardMembers title={d.title} description={d.description} members={d.members} />
            </section>
        );
    }
    return null;
  };

  if (blocks.length > 0) {
      return (
        <main className="bg-white">
            {blocks.map((b: any, idx: number) => renderBlock(b, idx))}
        </main>
      );
  }

  return (
    <main className="bg-white">
      <Hero image={pageData?.hero_image} />
      <section id="board-members" className="scroll-mt-10">
        <BoardMembers />
      </section>
    </main>
  );
};

export default AboutBoard;
