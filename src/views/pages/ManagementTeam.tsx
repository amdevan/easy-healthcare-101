import React, { useEffect, useState } from 'react';
import { fetchManagementTeams, ManagementTeamDto } from '@/controllers/api';
import { resolveSrc } from '@/utils/url';
import { usePageContent } from '@/hooks/usePageContent';

const ManagementTeam: React.FC = () => {
  const [members, setMembers] = useState<ManagementTeamDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: pageData } = usePageContent('management-team');

  useEffect(() => {
    fetchManagementTeams().then(data => {
      setMembers(data);
      setLoading(false);
    });
  }, []);

  const content = pageData?.content?.find((b: any) => b.type === 'value_prop_section')?.data;
  const title = content?.title || 'Meet the Management';
  const subtitle = content?.subtitle || 'Our leadership team drives execution across clinical, digital, operations, and partnerships.';

  return (
    <main className="bg-white">
      <section className="container mx-auto px-4 py-12">
        <div className="text-3xl md:text-4xl font-extrabold text-brand-gray-900" dangerouslySetInnerHTML={{ __html: title }} />
        <div className="mt-4 text-brand-gray-700 max-w-3xl" dangerouslySetInnerHTML={{ __html: subtitle }} />
      </section>

      <section className="container mx-auto px-4 pb-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          [1,2,3,4].map((i) => (
            <div key={i} className="border rounded-lg p-3 shadow-sm animate-pulse text-center">
              <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg mb-3" />
              <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
            </div>
          ))
        ) : members.length > 0 ? (
          members.map((member) => (
            <div key={member.id} className="border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-48 h-48 mx-auto mb-3 overflow-hidden rounded-lg bg-gray-100">
                {member.photo_url ? (
                  <img 
                    src={resolveSrc(member.photo_url)} 
                    alt={member.name}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="text-xl font-bold text-gray-900" dangerouslySetInnerHTML={{ __html: member.name }} />
              <div className="text-sm font-medium text-teal-600 mb-2" dangerouslySetInnerHTML={{ __html: member.role }} />
              {member.bio && (
                <div 
                  className="text-sm text-gray-600 line-clamp-4 mb-4 prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: member.bio }} 
                />
              )}
              {member.links && member.links.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto justify-center">
                  {member.links.map((link, idx) => (
                    <a 
                      key={idx}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No management team members found.
          </div>
        )}
      </section>
    </main>
  );
};

export default ManagementTeam;