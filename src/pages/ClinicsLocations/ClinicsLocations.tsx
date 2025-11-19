import React from 'react';
import Editable from '@/components/ui/Editable';

const ClinicsLocations: React.FC = () => {
  return (
    <section className="py-12 lg:py-20 bg-brand-gray-100">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <Editable tag="h1" id="clinics-locations-title" className="text-3xl md:text-4xl font-extrabold text-brand-gray-900">Clinics & Locations</Editable>
          <Editable tag="p" id="clinics-locations-desc" className="mt-4 text-brand-gray-600">Explore our clinics and service locations. Detailed listings coming soon.</Editable>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
                <Editable tag="h3" id={`clinic-card-${i}-title`} className="text-lg font-semibold text-brand-gray-900">Clinic #{i}</Editable>
                <Editable tag="p" id={`clinic-card-${i}-desc`} className="mt-2 text-brand-gray-600">Address and hours placeholder.</Editable>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinicsLocations;