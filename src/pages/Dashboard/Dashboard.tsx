import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <section className="py-12 lg:py-20 bg-brand-gray-100">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-gray-900">Dashboard</h1>
          <p className="mt-4 text-brand-gray-600">Welcome to your dashboard.</p>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;