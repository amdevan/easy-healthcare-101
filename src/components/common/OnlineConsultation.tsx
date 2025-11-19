import React from 'react';
import Editable from '@/components/ui/Editable';
import Icon from '@/components/ui/Icon';

const OnlineConsultation: React.FC = () => {
  const concerns = [
    { name: 'Period doubts or Pregnancy', icon: 'pregnancy' },
    { name: 'Acne, pimple or skin issues', icon: 'acne' },
    { name: 'Performance issues in bed', icon: 'bed' },
    { name: 'Cold, cough or fever', icon: 'fever' },
    { name: 'Child not feeling well', icon: 'baby' },
    { name: 'Depression or anxiety', icon: 'depression' },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <Editable tag="h2" id="online-consult-title" className="text-3xl font-extrabold text-brand-gray-900">Consult top doctors online for any health concern</Editable>
            <Editable tag="p" id="online-consult-subtitle" className="mt-2 text-brand-gray-500">Private online consultations with verified doctors in all specialties.</Editable>
          </div>
          <a href="#" className="hidden sm:inline-block px-5 py-2.5 border border-brand-blue text-brand-blue font-semibold rounded-lg hover:bg-blue-50 transition-colors">
            View All Specialties
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {concerns.map((concern, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-brand-blue transition-all duration-300 flex flex-col items-center justify-between">
              <div className="bg-purple-100 rounded-lg w-16 h-16 flex items-center justify-center mb-4">
                <Icon name={concern.icon} alt={concern.name} className="w-10 h-10" />
              </div>
              <Editable tag="p" id={`concern-name-${index}`} className="font-semibold text-brand-gray-800 flex-grow">{concern.name}</Editable>
              <a href="#" className="mt-4 text-brand-blue font-bold text-sm hover:underline">
                CONSULT NOW
              </a>
            </div>
          ))}
        </div>
        <div className="text-center mt-8 sm:hidden">
           <a href="#" className="px-5 py-2.5 border border-brand-blue text-brand-blue font-semibold rounded-lg hover:bg-blue-50 transition-colors">
            View All Specialties
          </a>
        </div>
      </div>
    </section>
  );
};

export default OnlineConsultation;
