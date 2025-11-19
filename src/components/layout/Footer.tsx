import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Editable from '@/components/ui/Editable';
import Button from '@/components/ui/Button';

const FooterLinkColumn: React.FC<{ title: string; links: string[] }> = ({ title, links }) => (
  <div>
    <h4 className="font-bold text-white mb-4">{title}</h4>
    <ul className="space-y-3">
      {links.map(link => (
        <li key={link}><a href="#" className="hover:underline">{link}</a></li>
      ))}
    </ul>
  </div>
);

const Footer: React.FC = () => {
  const linkData = {
    About: ["About Us", "Blog", "Careers", "Press", "Contact Us"],
    "For Patients": ["Search for Doctors", "Search for Clinics", "Search for Hospitals", "Easy Healthcare Plus", "Easy Care Clinics", "Read Health Articles", "Read About Medicines", "Health App"],
    "For Doctors": ["Easy Healthcare Profile", "Easy Healthcare Reach", "Easy Healthcare Pro"],
    "For Hospitals": ["Insta by Easy Healthcare", "Qikwell by Easy Healthcare", "Easy Healthcare Profile", "Easy Healthcare Reach"],
    "For Clinics": [],
    More: ["Help", "Developers", "Privacy Policy", "Terms & Conditions", "PCS T&C", "Healthcare Directory"],
  };

  const [email, setEmail] = useState('');

  return (
    <footer className="bg-gradient-to-b from-brand-blue to-brand-blue-dark text-blue-100">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
          <div className="col-span-2 lg:col-span-2 pr-8">
            <Editable tag="h3" id="footer-title" className="font-extrabold text-2xl text-white mb-4">Easy Health Care 101</Editable>
            <Editable tag="p" id="footer-desc" className="mb-6">Your trusted partner for accessible and comprehensive healthcare solutions, anytime, anywhere.</Editable>
            <form
              onSubmit={(e) => { e.preventDefault(); /* could integrate with backend later */ }}
              className="mt-4 flex items-center gap-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Subscribe with your email"
                aria-label="Subscribe with your email"
                className="w-full max-w-xs px-3 py-2 rounded-lg bg-white/20 placeholder-blue-100 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/70"
              />
              <Button variant="outline" size="md">Subscribe</Button>
            </form>
            <div className="mt-6 flex items-center gap-3 text-white">
              <a href="#" aria-label="Facebook" className="p-2 rounded-full bg-white/10 hover:bg-white/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="#" aria-label="Twitter" className="p-2 rounded-full bg-white/10 hover:bg-white/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.46 6c-.77.34-1.6.57-2.46.67a4.29 4.29 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 12 8.28c0 .34.04.67.11.98A12.15 12.15 0 0 1 3.15 5.14a4.28 4.28 0 0 0 1.32 5.71c-.66-.02-1.28-.2-1.82-.5v.05a4.28 4.28 0 0 0 3.44 4.2c-.31.08-.64.12-.98.12-.24 0-.48-.02-.71-.07a4.29 4.29 0 0 0 4 2.97A8.6 8.6 0 0 1 2 19.54a12.14 12.14 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19-.01-.37-.02-.56A8.73 8.73 0 0 0 22.46 6z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-full bg-white/10 hover:bg-white/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V22h-4zM8.5 8.5h3.8v1.84h.05c.53-1 1.82-2.06 3.74-2.06 4 0 4.74 2.63 4.74 6.05V22h-4v-5.6c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95V22h-4z"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/find-doctors" className="hover:underline">Find Doctors</Link></li>
              <li><Link to="/video-consult" className="hover:underline">Video Consult</Link></li>
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 mt-8">
            <div className="col-span-2 lg:col-span-2"></div>
            <div></div>
             <div>
                <ul className="space-y-3">
                    {linkData["For Patients"].slice(5).map(link => (
                        <li key={link}><a href="#" className="hover:underline">{link}</a></li>
                    ))}
                </ul>
            </div>
             <div></div>
             <div>
                <ul className="space-y-3">
                    {linkData["For Hospitals"].slice(3).map(link => (
                        <li key={link}><a href="#" className="hover:underline">{link}</a></li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-6 text-center md:text-left md:flex justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Easy Healthcare 101. All rights reserved.</p>
          <p className="mt-2 md:mt-0">By IT Relevant</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
