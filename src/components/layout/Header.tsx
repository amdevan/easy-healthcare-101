
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchHeaderSetting, HeaderSettingDto } from '@/controllers/api';
import Button from '@/components/ui/Button';

const Logo: React.FC = () => (
  <Link to="/" className="flex items-center space-x-2">
    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
      <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    </div>
    <span className="font-bold text-lg text-brand-gray-900">
      Easy <span className="font-extrabold text-brand-blue">Healthcare101</span>
    </span>
  </Link>
);


const Header: React.FC = () => {
  const [headerSetting, setHeaderSetting] = useState<HeaderSettingDto | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesMenuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const fallbackLinks = [
    { label: 'Video Consult', href: '/video-consult' },
    { label: 'Lab Tests', href: '/lab-tests' },
  ];

  // Services dropdown items (map to existing routes where sensible)
  const servicesMenu = [
    { label: 'Primary Health Care', href: '#' },
    { label: 'Digital Health & Telemedicine', href: '/video-consult' },
    { label: 'Diagnostics & Laboratory', href: '/lab-tests' },
    { label: 'Pharmacy Services', href: '/pharmacy' },
    { label: 'Non-Emergency Medical Transport (NEMT)', href: '#' },
    { label: 'Community Health Programs', href: '#' },
  ];


  // Split links so that "About" appears on the right next to Contact (desktop)
  const linksSource = (headerSetting?.links ?? fallbackLinks).filter((l) => {
    const lbl = l.label?.trim().toLowerCase() ?? '';
    return l.href !== '/find-doctors' && !lbl.includes('find doctors');
  });
  const normalizeLabel = (label?: string) => {
    const l = label?.trim().toLowerCase();
    return l === 'find doctors' ? 'Find Doctors & Clinics' : (label ?? '');
  };
  const links = linksSource.map(l => ({ ...l, label: normalizeLabel(l.label) }));
  const hasPharmacyLink = links.some(
    (l) => l.href === '/pharmacy' || (l.label && l.label.toLowerCase().includes('pharmacy'))
  );
  const linksAugmented = hasPharmacyLink ? links : [...links, { label: 'Easy Pharmacy', href: '/pharmacy' }];

  // Insert "Products" link immediately to the right of "Easy Pharmacy"
  const hasProductsLink = linksAugmented.some(
    (l) => l.href === '/products' || (l.label && l.label.toLowerCase().includes('products'))
  );
  let linksWithProducts = linksAugmented;
  if (!hasProductsLink) {
    const pharmacyIndex = linksAugmented.findIndex(
      (l) => l.href === '/pharmacy' || (l.label && l.label.toLowerCase().includes('pharmacy'))
    );
    if (pharmacyIndex >= 0) {
      linksWithProducts = [
        ...linksAugmented.slice(0, pharmacyIndex + 1),
        { label: 'Products', href: '/products' },
        ...linksAugmented.slice(pharmacyIndex + 1),
      ];
    } else {
      linksWithProducts = [...linksAugmented, { label: 'Products', href: '/products' }];
    }
  }
  const aboutIndex = linksWithProducts.findIndex(
    (l) => l.label?.toLowerCase() === 'about' || l.href === '/about'
  );
  const aboutLink = aboutIndex >= 0 ? linksWithProducts[aboutIndex] : null;
  const leftLinks = aboutIndex >= 0
    ? [...linksWithProducts.slice(0, aboutIndex), ...linksWithProducts.slice(aboutIndex + 1)]
    : linksWithProducts;

  useEffect(() => {
    let mounted = true;
    fetchHeaderSetting()
      .then((data) => {
        if (mounted) setHeaderSetting(data);
      })
      .catch(() => {
        // keep fallback on error
      });
    return () => { mounted = false; };
  }, []);
  // Close mobile menu on route changes
  useEffect(() => {
    if (mobileOpen) setMobileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
  const toggleMobile = () => setMobileOpen((v) => !v);
  const closeMobile = () => setMobileOpen(false);

  // Close services dropdown on outside click
  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!servicesOpen) return;
      const target = e.target as Node;
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(target)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [servicesOpen]);

  // Keyboard navigation within services dropdown
  const handleServicesKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!servicesOpen) return;
    const items = servicesMenuRef.current?.querySelectorAll('[role="menuitem"]');
    if (!items || items.length === 0) return;
    const itemsArr = Array.from(items) as HTMLElement[];
    const currentIndex = itemsArr.findIndex((el) => el === document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % itemsArr.length : 0;
      itemsArr[nextIndex].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex >= 0 ? (currentIndex - 1 + itemsArr.length) % itemsArr.length : itemsArr.length - 1;
      itemsArr[prevIndex].focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      itemsArr[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      itemsArr[itemsArr.length - 1].focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setServicesOpen(false);
    }
  };
  
  const isActive = (href?: string) => {
    if (!href) return false;
    if (!href.startsWith('/')) return false;
    // Treat top-level paths as active when current path starts with them
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200/70">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Logo />
          <nav className="hidden lg:flex items-center space-x-6">
            {leftLinks.map(({ label, href }) => {
              const isInternal = href?.startsWith('/');
              if (isInternal) {
                return (
                  <Link
                    key={`${label}-${href}`}
                    to={href}
                    className={`px-2 py-2 rounded-md transition-colors duration-200 ${isActive(href) ? 'text-brand-blue font-semibold bg-blue-50' : 'text-brand-gray-700 hover:text-brand-blue hover:bg-gray-50'}`}
                  >
                    {label}
                  </Link>
                );
              }
              return (
                <a key={`${label}-${href}`} href={href} className="px-2 py-2 rounded-md text-brand-gray-700 hover:text-brand-blue hover:bg-gray-50 transition-colors duration-200">{label}</a>
              );
            })}
            {/* Our Services dropdown (desktop, accessible) */}
            <div className="relative" onMouseLeave={() => setServicesOpen(false)}>
              <button
                aria-haspopup="true"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setServicesOpen((v) => !v);
                  if (e.key === 'Escape') setServicesOpen(false);
                }}
                className={`flex items-center gap-1 px-2 py-2 rounded-md transition-colors duration-200 ${servicesOpen ? 'text-brand-blue bg-blue-50' : 'text-brand-gray-700 hover:text-brand-blue hover:bg-gray-50'}`}
              >
                Our Services
                <svg className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {servicesOpen && (
              <div
                ref={servicesMenuRef}
                className="absolute left-0 mt-2 w-96 bg-white border rounded-md shadow-lg focus:outline-none"
                onKeyDown={handleServicesKeyDown}
              >
                <ul className="py-2" role="menu" aria-label="Our Services">
                  {servicesMenu.map(({ label, href }) => {
                    const isInternal = href?.startsWith('/');
                    if (isInternal) {
                      return (
                        <li key={`${label}-${href}`} role="none">
                          <Link to={href} role="menuitem" className="flex items-center gap-2 px-4 py-2 text-sm text-brand-gray-700 hover:bg-gray-50 focus:bg-blue-50 focus:text-brand-blue">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" aria-hidden="true"></span>
                            {label}
                          </Link>
                        </li>
                      );
                    }
                    return (
                      <li key={`${label}-${href}`} role="none">
                        <a href={href} role="menuitem" className="flex items-center gap-2 px-4 py-2 text-sm text-brand-gray-700 hover:bg-gray-50 focus:bg-blue-50 focus:text-brand-blue">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" aria-hidden="true"></span>
                          {label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <div className="border-t px-4 py-2">
                  <Link to="/services" role="menuitem" className="block text-sm font-semibold text-brand-blue hover:underline">Explore all services</Link>
                </div>
              </div>
              )}
            </div>
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center space-x-2">
            {aboutLink && (
              aboutLink.href?.startsWith('/') ? (
                <Link
                  to={aboutLink.href}
                  className={`px-2 py-2 text-sm rounded-md transition-colors ${isActive(aboutLink.href) ? 'text-brand-blue font-semibold bg-blue-50' : 'text-brand-gray-700 hover:bg-gray-100'}`}
                >
                  {aboutLink.label}
                </Link>
              ) : (
                <a href={aboutLink.href} className="px-2 py-2 text-sm text-brand-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  {aboutLink.label}
                </a>
              )
            )}
            <Link
              to="/contact"
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${isActive('/contact') ? 'text-brand-blue bg-blue-50' : 'text-brand-gray-700 hover:bg-gray-100'}`}
            >
              Contact
            </Link>
          </div>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={toggleMobile}
            className="lg:hidden p-2 rounded-md text-brand-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {headerSetting?.cta?.href ? (
            <Button to={headerSetting.cta.href || '/auth/login'} size="md" variant="primary">
              {headerSetting.cta.label || 'Login / Signup'}
            </Button>
          ) : (
            <Button to="/auth/login" size="md" variant="primary">Login / Signup</Button>
          )}
          <Button to="/auth/login" size="md" variant="primary">
            Patient Login
          </Button>
        </div>
      </div>
          {mobileOpen && (
            <>
              {/* Overlay to close on outside click */}
              <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={closeMobile} />
              {/* Dropdown panel */}
              <div className="lg:hidden absolute left-0 right-0 top-full bg-white border-b shadow-sm z-50">
                <nav className="px-4 py-3 space-y-1">
                  {linksAugmented.map(({ label, href }) => {
                    const isInternal = href?.startsWith('/');
                    if (isInternal) {
                      return (
                        <Link
                          key={`${label}-${href}`}
                          to={href}
                          onClick={closeMobile}
                          className={`block px-2 py-2 rounded-md transition-colors ${isActive(href) ? 'text-brand-blue bg-blue-50' : 'text-brand-gray-700 hover:bg-gray-50'}`}
                        >
                          {label}
                        </Link>
                      );
                    }
                    return (
                      <a
                        key={`${label}-${href}`}
                        href={href}
                        onClick={closeMobile}
                        className="block px-2 py-2 rounded-md text-brand-gray-700 hover:bg-gray-50"
                      >
                        {label}
                      </a>
                    );
                  })}
                  {/* Our Services (mobile section) */}
                  <div className="mt-2">
                    <div className="px-2 py-2 text-sm font-semibold text-brand-gray-900">Our Services</div>
                    {servicesMenu.map(({ label, href }) => {
                      const isInternal = href?.startsWith('/');
                      if (isInternal) {
                        return (
                          <Link
                            key={`${label}-${href}`}
                            to={href}
                            onClick={closeMobile}
                            className="block px-2 py-2 rounded-md text-brand-gray-700 hover:bg-gray-50"
                          >
                            {label}
                          </Link>
                        );
                      }
                      return (
                        <a
                          key={`${label}-${href}`}
                          href={href}
                          onClick={closeMobile}
                          className="block px-2 py-2 rounded-md text-brand-gray-700 hover:bg-gray-50"
                        >
                          {label}
                        </a>
                      );
                    })}
                  </div>
                  <Link to="/contact" onClick={closeMobile} className={`block px-2 py-2 rounded-md transition-colors ${isActive('/contact') ? 'text-brand-blue bg-blue-50' : 'text-brand-gray-700 hover:bg-gray-50'}`}>Contact</Link>
                  <Link to="/auth/login" onClick={closeMobile} className="block px-2 py-2 rounded-md text-brand-blue hover:bg-blue-50">Login / Signup</Link>
                </nav>
              </div>
            </>
          )}
    </header>
  );
};

export default Header;
