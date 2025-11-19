import React from 'react';
import Editable from '@/components/ui/Editable';

const Testimonials: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="container mx-auto px-4 text-center">
        <Editable tag="h2" id="testimonials-title" className="text-3xl font-extrabold text-brand-gray-900">What our users have to say</Editable>
        <div className="mt-10 max-w-3xl mx-auto relative">
          <button className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors">&lt;</button>
          
          <div className="p-8">
            <Editable tag="p" id="testimonial-quote-1" className="text-lg text-brand-gray-700 italic">"Very good app. Well thought out about booking/rescheduling/canceling an appointment. Also, Doctor's feedback mechanism is good and describes all the basics in a good way."</Editable>
            <div className="mt-8 flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-lg">DS</div>
              <div>
                <Editable tag="p" id="testimonial-author-1" className="font-bold text-brand-gray-900">Devan Sharma</Editable>
              </div>
            </div>
            <div className="mt-6 flex justify-center space-x-2">
              <span className="w-2.5 h-2.5 bg-brand-blue rounded-full"></span>
              <span className="w-2.5 h-2.5 bg-gray-300 rounded-full"></span>
              <span className="w-2.5 h-2.5 bg-gray-300 rounded-full"></span>
            </div>
          </div>

          <button className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors">&gt;</button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
