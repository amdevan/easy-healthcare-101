import React, { useEffect, useState } from 'react';
import Editable from '@/components/ui/Editable';
import { fetchLabTests, LabTestDto } from '@/controllers/api';

type LabTest = {
  id: number;
  name: string;
  description: string;
  price: number;
};

const toLabTest = (t: LabTestDto): LabTest => ({
  id: t.id,
  name: t.name,
  description: t.description ?? '',
  price: t.price ?? 0,
});

const LabTests: React.FC = () => {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    fetchLabTests()
      .then((res) => {
        if (ignore) return;
        setTests(res.data.map(toLabTest));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, []);

  return (
    <section className="py-12 lg:py-20 bg-brand-gray-100">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
          <Editable tag="h1" id="lab-tests-title" className="text-3xl md:text-4xl font-extrabold text-brand-gray-900">Lab Tests at Home</Editable>
          <Editable tag="p" id="lab-tests-subtitle" className="mt-3 text-brand-gray-600">Book trusted diagnostic tests with home sample collection and digital reports.</Editable>

          {loading && (
            <div className="mt-6 text-brand-gray-600">Loading lab tests...</div>
          )}
          {error && (
            <div className="mt-6 text-red-600">{error}</div>
          )}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map(test => (
              <div key={test.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white">
                <Editable tag="h3" id={`lab-${test.id}-title`} className="text-lg font-bold text-brand-gray-900">{test.name}</Editable>
                <Editable tag="p" id={`lab-${test.id}-desc`} className="mt-2 text-brand-gray-600">{test.description}</Editable>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-brand-blue font-semibold">Rs. {test.price?.toFixed(0)}</p>
                  <button className="px-4 py-2 text-sm font-semibold text-white bg-brand-blue rounded-md hover:bg-brand-blue-dark">Book Test</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a href="#" className="px-6 py-3 border border-brand-blue text-brand-blue font-semibold rounded-lg hover:bg-blue-50">View All Tests</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LabTests;