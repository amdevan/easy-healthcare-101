import React from 'react';
import { resolveSrc } from '@/utils/url';

interface AboutProps {
  title?: string;
  subtitle?: string;
  description?: string;
  images?: string[];
  image1?: string;
  image2?: string;
}

const About: React.FC<AboutProps> = ({ title, subtitle, description, images, image1, image2 }) => {
  const img1 = image1 ? resolveSrc(image1) : (images && images[0] ? resolveSrc(images[0]) : "https://picsum.photos/400/500?grayscale");
  const img2 = image2 ? resolveSrc(image2) : (images && images[1] ? resolveSrc(images[1]) : "https://picsum.photos/400/500?blur=2");

  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <img src={img1} alt="Clinic Interior" className="rounded-2xl shadow-lg mt-8" referrerPolicy="no-referrer" onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/400/500?blur=2'; }} />
              <img src={img2} alt="Happy Patient" className="rounded-2xl shadow-lg mb-8" referrerPolicy="no-referrer" onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/400/500'; }} />
            </div>
          </div>
          <div className="md:w-1/2 space-y-6">
            <div className="text-teal-600 font-bold uppercase tracking-wide" dangerouslySetInnerHTML={{ __html: subtitle || "About Primary Health Care" }} />
            <div className="text-3xl md:text-4xl font-bold text-slate-900" dangerouslySetInnerHTML={{ __html: title || "Dedicated to Continuous & Affordable Care" }} />
            <div className="text-slate-600 text-lg leading-relaxed">
              {description ? (
                <div dangerouslySetInnerHTML={{ __html: description }} />
              ) : (
                <>
                  <div className="mb-4">Founded on the belief that healthcare should be a right, not a privilege, our Primary Health Care service focuses on reducing barriers to quality medical attention. We specialize in general outpatient services designed to fit your busy life.</div>
                  <div>Our "Continuity of Care" model ensures you see the same team of professionals who know your history, preferences, and health goals. From minor check-ups to managing complex chronic conditions, we walk the journey with you.</div>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div><h3 className="text-3xl font-bold text-teal-600">15k+</h3><div className="text-slate-500">Patients Served</div></div>
              <div><h3 className="text-3xl font-bold text-teal-600">98%</h3><div className="text-slate-500">Satisfaction Rate</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
