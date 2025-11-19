// Home controller: place shared data fetching and business logic here
export const getHomeHighlights = () => {
  return [
    { id: 'h1', title: 'Top Specialists', description: 'Find experts across specialties.' },
    { id: 'h2', title: 'Video Consults', description: 'Connect with doctors 24/7.' },
    { id: 'h3', title: 'In-Clinic Appointments', description: 'Book visits near you.' },
  ];
};