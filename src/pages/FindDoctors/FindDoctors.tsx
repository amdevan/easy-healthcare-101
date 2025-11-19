import React, { useEffect, useMemo, useState } from 'react';
import Editable from '@/components/ui/Editable';
import { fetchDoctors, fetchSpecialties, DoctorDto, SpecialtyDto } from '@/controllers/api';

type Doctor = {
  id: number;
  name: string;
  location: string;
  experienceYears: number;
  rating: number;
  specialty?: string;
};

const toDoctor = (d: DoctorDto): Doctor => ({
  id: d.id,
  name: d.name,
  location: d.location ?? '',
  experienceYears: d.experience_years ?? 0,
  rating: d.rating ?? 0,
});

const Star: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Rating: React.FC<{ value: number }> = ({ value }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(value));
  return (
    <div className="flex items-center space-x-1">
      {stars.map((filled, idx) => (
        <Star key={idx} filled={filled} />
      ))}
      <span className="ml-2 text-sm text-brand-gray-500">{value.toFixed(1)}</span>
    </div>
  );
};

const FindDoctors: React.FC = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [specialties, setSpecialties] = useState<SpecialtyDto[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    Promise.all([
      fetchDoctors({ location: location || undefined, q: query || undefined }),
      fetchSpecialties(),
    ])
      .then(([docRes, specRes]) => {
        if (ignore) return;
        setDoctors(docRes.data.map(toDoctor));
        setSpecialties(specRes);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, [query, location]);

  const filtered = useMemo(() => {
    return doctors.filter(d => {
      const matchesQuery = query
        ? d.name.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesLocation = location ? d.location.toLowerCase().includes(location.toLowerCase()) : true;
      const matchesSpecialty = true; // doctor specialty not available yet in API
      return matchesQuery && matchesLocation && matchesSpecialty;
    });
  }, [query, location, specialty, doctors]);

  return (
    <section className="py-12 lg:py-20 bg-brand-gray-100">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <Editable tag="h1" id="find-doctors-title" className="text-3xl md:text-4xl font-extrabold text-brand-gray-900">Find Doctors Near You</Editable>
          <Editable tag="p" id="find-doctors-subtitle" className="mt-3 text-brand-gray-600">Search for top-rated specialists and book appointments with ease.</Editable>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <span className="px-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M12.9 14.32a8 8 0 111.414-1.414l3.387 3.387a1 1 0 01-1.414 1.414l-3.387-3.387zM8 14a6 6 0 100-12 6 6 0 000 12z" /></svg>
              </span>
              <input value={query} onChange={e => setQuery(e.target.value)} className="flex-1 p-3 focus:outline-none" placeholder="Search by name" />
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <span className="px-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18l-4.95-4.95a7 7 0 010-9.9zM10 9a2 2 0 100 4 2 2 0 000-4z" /></svg>
              </span>
              <input value={location} onChange={e => setLocation(e.target.value)} className="flex-1 p-3 focus:outline-none" placeholder="Location" />
            </div>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="w-full p-3 focus:outline-none">
                <option value="">All Specialties</option>
                {specialties.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {loading && (
            <div className="mt-6 text-brand-gray-600">Loading doctors...</div>
          )}
          {error && (
            <div className="mt-6 text-red-600">{error}</div>
          )}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(d => (
              <div key={d.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v2a6 6 0 006 6 6 6 0 006-6V8a6 6 0 00-6-6z" /></svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-brand-gray-900">{d.name}</h3>
                    <p className="text-brand-gray-600">{d.experienceYears} yrs exp</p>
                    <p className="text-brand-gray-500 text-sm">{d.location}</p>
                    <div className="mt-2"><Rating value={d.rating} /></div>
                    <div className="mt-4 flex space-x-2">
                      <button className="px-4 py-2 text-sm font-semibold text-white bg-brand-blue rounded-md hover:bg-brand-blue-dark">Book Appointment</button>
                      <button className="px-4 py-2 text-sm font-semibold text-brand-blue bg-blue-100 rounded-md hover:bg-blue-200">View Profile</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindDoctors;