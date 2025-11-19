import React from 'react';
import Editable from '@/components/ui/Editable';

const About: React.FC = () => {
  return (
    <section className="py-12 lg:py-20 bg-brand-gray-100">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <Editable tag="h1" id="about-title" className="text-3xl md:text-4xl font-extrabold text-brand-gray-900">About Easy Healthcare 101</Editable>
          <Editable tag="p" id="about-desc" className="mt-4 text-brand-gray-600">
            We simplify access to quality healthcare through online consultations, in-clinic visits, and home diagnostics. Our mission is to make healthcare more accessible and efficient.
          </Editable>
        </div>
      </div>
    </section>
  );
};

export default About;