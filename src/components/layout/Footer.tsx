import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Phone, Mail, MapPin, ArrowUpRight, ShieldCheck, Facebook, Twitter, Linkedin, Instagram, Youtube, Globe } from 'lucide-react';
import { fetchFooterSetting, FooterSettingDto, FooterColumn, resolveStorageUrl } from '@/controllers/api';

const FooterLinkColumn: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h4 className="font-bold text-brand-gray-900 mb-4">{title}</h4>
    <ul className="space-y-2">{children}</ul>
  </div>
);

const Footer: React.FC = () => {
  const [footerSetting, setFooterSetting] = useState<FooterSettingDto | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchFooterSetting()
      .then(data => {
        if (mounted) setFooterSetting(data);
      })
      .catch(console.error);

    return () => { mounted = false; };
  }, []);

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setSubscribed('Please enter a valid email'); return; }
    setSubscribed('Subscribed successfully');
    setEmail('');
  };

  const {
      logo,
      logo_height = 48,
      title = 'Easy Healthcare 101',
      description = 'Your trusted partner for accessible and comprehensive healthcare solutions.',
      phone = '+977 1-4510101',
      email: contactEmail = 'support@easyhealthcare101.com',
      address = 'Kathmandu Nepal',
      copyright = `© ${new Date().getFullYear()} Easy Healthcare 101. All rights reserved.`,
      security_label = 'HIPAA-aware and privacy-focused',
      columns = [],
      social_links = [],
      android_app_link,
      ios_app_link,
      android_app_badge,
      ios_app_badge,
      newsletter_title = 'Stay Updated',
      newsletter_description,
      download_app_title
  } = footerSetting || {};

  // Default columns fallback
  const defaultColumns: FooterColumn[] = [
    {
      title: 'For Patients',
      links: [
        { label: 'Find Doctors', url: '/find-doctors' },
        { label: 'Video Consult', url: '/telemedicine' },
        { label: 'Lab Tests', url: '/lab-tests' },
        { label: 'Pharmacy', url: '/pharmacy' },
        { label: 'Primary Health', url: '/primary-health' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', url: '/about' },
        { label: 'Board of Director', url: '/about/board-of-director' },
        { label: 'Meet the Management', url: '/about/management-team' },
        { label: 'Clinics & Locations', url: '/clinics-locations' },
        { label: 'Contact', url: '/contact' },
      ]
    }
  ];

  const displayColumns = columns && columns.length > 0 ? columns : defaultColumns;

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <footer className="bg-brand-gray-200 text-brand-gray-800">
      <div className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-4 gap-8 items-start">
            <div>
              {logo && (
                 <img 
                   src={resolveStorageUrl(logo)} 
                   alt={title} 
                   className="object-contain mb-3"
                   style={{ height: `${logo_height}px`, width: 'auto' }}
                 />
              )}
              <h3 className="text-2xl font-extrabold text-brand-gray-900">{title}</h3>
              <div 
                className="mt-2 text-brand-gray-600 prose prose-sm max-w-none [&>p]:mb-0" 
                dangerouslySetInnerHTML={{ __html: description }} 
              />
              
              {phone && (
                <div className="mt-4 flex items-center gap-3 text-brand-gray-700">
                  <Phone className="w-4 h-4" />
                  <span>{phone}</span>
                </div>
              )}
              {contactEmail && (
                <div className="mt-2 flex items-center gap-3 text-brand-gray-700">
                  <Mail className="w-4 h-4" />
                  <span>{contactEmail}</span>
                </div>
              )}
              {address && (
                <div className="mt-2 flex items-center gap-3 text-brand-gray-700">
                  <MapPin className="w-4 h-4" />
                  <span>{address}</span>
                </div>
              )}
              
              {security_label && (
              <div className="mt-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-blue" />
                <span className="text-sm text-brand-gray-600">{security_label}</span>
              </div>
              )}

              {social_links && social_links.length > 0 && (
                <div className="mt-6 flex items-center gap-4">
                  {social_links.map((link, idx) => (
                    <a 
                      key={idx} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-gray-600 hover:text-brand-blue transition-colors"
                    >
                      {getSocialIcon(link.platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {displayColumns.map((col, idx) => (
              <FooterLinkColumn key={idx} title={col.title}>
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link 
                      to={link.url} 
                      target={link.new_tab ? '_blank' : undefined}
                      className="hover:text-brand-blue"
                    >
                      <div dangerouslySetInnerHTML={{ __html: link.label }} />
                    </Link>
                  </li>
                ))}
              </FooterLinkColumn>
            ))}

            <div>
              <h4 className="font-bold text-brand-gray-900 mb-4">{newsletter_title}</h4>
              {newsletter_description && (
                <div 
                  className="mb-4 text-sm text-brand-gray-600 prose prose-sm max-w-none [&>p]:mb-0" 
                  dangerouslySetInnerHTML={{ __html: newsletter_description }} 
                />
              )}
              <form onSubmit={onSubscribe} className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Enter your email"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <Button variant="primary" size="md">Subscribe</Button>
              </form>
              {subscribed && (
                <div className="mt-2 text-sm text-brand-gray-700">{subscribed}</div>
              )}
              
              <h4 className="font-bold text-brand-gray-900 mt-8 mb-4">{download_app_title || 'Download our App'}</h4>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {ios_app_link && (
                    <a href={ios_app_link} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={ios_app_badge ? resolveStorageUrl(ios_app_badge) : 'https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg'} 
                          alt="Download on the App Store" 
                          className="h-12"
                        />
                    </a>
                )}
                {(!ios_app_link && !footerSetting) && (
                    <a href="#">
                        <img 
                          src='https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg' 
                          alt="Download on the App Store" 
                          className="h-12"
                        />
                    </a>
                )}

                {android_app_link && (
                    <a href={android_app_link} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={android_app_badge ? resolveStorageUrl(android_app_badge) : 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'} 
                          alt="Get it on Google Play" 
                          className="h-16"
                        />
                    </a>
                )}
                {(!android_app_link && !footerSetting) && (
                    <a href="#">
                        <img 
                          src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png' 
                          alt="Get it on Google Play" 
                          className="h-16"
                        />
                    </a>
                )}
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm text-brand-gray-600">
                <Link to="/privacy" className="hover:text-brand-blue">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-brand-blue">Terms & Conditions</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-4 text-center md:text-left md:flex justify-between items-center text-sm text-brand-gray-700">
          <div dangerouslySetInnerHTML={{ __html: copyright }} />
          <div className="mt-2 md:mt-0 flex items-center gap-4">
            <span className="text-brand-gray-700">
              Designed &amp; Developed By{' '}
              <a
                href="https://itrelevant.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-blue hover:underline"
              >
                IT Relevant
              </a>
            </span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-brand-blue text-brand-blue rounded-md hover:bg-blue-50"
            >
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
