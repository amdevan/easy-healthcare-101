import React from 'react';
import Editable from '@/components/ui/Editable';
import OnlineConsultation from '@/components/common/OnlineConsultation';

const VideoConsult: React.FC = () => {
  return (
    <section className="py-12 lg:py-20 bg-brand-gray-100">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <Editable tag="h1" id="video-consult-title" className="text-3xl md:text-4xl font-extrabold text-brand-gray-900">
            Instant Video Consultation
          </Editable>
          <Editable tag="p" id="video-consult-desc" className="mt-4 text-brand-gray-600">
            Connect with verified doctors online within minutes for private, secure consultations.
          </Editable>
        </div>
        <div className="mt-8">
          <OnlineConsultation />
        </div>
      </div>
    </section>
  );
};

export default VideoConsult;