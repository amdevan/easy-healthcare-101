import React from 'react';
import Editable from '@/components/ui/Editable';

const ContactPage: React.FC = () => {
  return (
    <section className="py-12 lg:py-20 bg-brand-gray-100">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="text-3xl md:text-4xl font-extrabold text-brand-gray-900">Contact Us</div>
          <div className="mt-4 text-brand-gray-600">
            Have questions? Reach out to our support team at support@easyhealthcare101.com.
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;