import React from 'react';
import IndexPage from '@/views/pages/IndexPage';
import FindDoctors from '@/components/FindDoctors';
import AboutPage from '@/views/pages/AboutPage';
import ContactPage from '@/views/pages/ContactPage';

export interface AppRoute {
  path: string;
  element: React.ReactElement;
}

export const webRoutes: AppRoute[] = [
  { path: '/', element: <IndexPage /> },
  { path: '/find-doctors', element: <FindDoctors /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/contact', element: <ContactPage /> },
];