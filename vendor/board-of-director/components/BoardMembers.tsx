import React, { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { listBoardMembers, type BoardMemberDto } from '@/controllers/api';
import { API_URL, STORAGE_URL } from '@/config/api';

type Member = BoardMemberDto;

interface BoardMembersProps {
  title?: string;
  description?: string;
  members?: any[];
}

const DEFAULT_MEMBERS: Member[] = [
    {
        id: 1,
        name: 'Dr. Sarah Johnson',
        role: 'Chairperson',
        bio: 'Dr. Johnson brings over 25 years of medical and administrative experience to the board.',
        photo_path: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=500',
        photo_url: null,
        email: null,
        phone: null,
        order: 1,
        is_active: true,
        links: [{ label: 'LinkedIn', href: '#' }]
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Finance Director',
        bio: 'Michael is a certified public accountant with a decade of experience in healthcare finance.',
        photo_path: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=500',
        photo_url: null,
        email: null,
        phone: null,
        order: 2,
        is_active: true,
        links: [{ label: 'LinkedIn', href: '#' }]
    },
    {
        id: 3,
        name: 'Emily Davis',
        role: 'Community Outreach',
        bio: 'Emily dedicates her time to building strong relationships between the hospital and the community.',
        photo_path: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=500',
        photo_url: null,
        email: null,
        phone: null,
        order: 3,
        is_active: true,
        links: []
    },
    {
        id: 4,
        name: 'James Wilson',
        role: 'Legal Advisor',
        bio: 'James specializes in healthcare law and ensures compliance with all regulations.',
        photo_path: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=500',
        photo_url: null,
        email: null,
        phone: null,
        order: 4,
        is_active: true,
        links: [{ label: 'LinkedIn', href: '#' }]
    }
];

const BoardMembers: React.FC<BoardMembersProps> = ({ title, description, members: propMembers }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<any>({});

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await listBoardMembers();
      if (res.data && res.data.length > 0) {
        setMembers(res.data);
      } else {
        // Try fallback or use defaults if empty
        throw new Error('No members found in API');
      }

      const contentRes = await fetch(`${API_URL}/frontend`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!contentRes.ok) throw new Error(`Failed to fetch frontend content: ${contentRes.status}`);

      const contentText = await contentRes.text();
      let json: any;
      try {
        json = JSON.parse(contentText);
      } catch (parseErr) {
        throw new Error(`Invalid frontend JSON response: ${contentText.substring(0, 150)}`);
      }
      const p = (json.pages || []).find((x: any) => x.key === 'page.board-of-director');
      setPage(p?.value || {});
    } catch (e: any) {
      console.warn('BoardMembers load warning:', e);
      try {
        const agg = await fetch(`${API_URL}/frontend`, {
          headers: { 'Accept': 'application/json' }
        });
        if (!agg.ok) throw new Error(`Fallback failed: ${agg.status}`);
        
        const text = await agg.text();
        let aj;
        try {
           aj = JSON.parse(text);
        } catch (parseErr) {
           throw new Error(`Fallback Invalid JSON: ${text.substring(0, 100)}`);
        }

        const list: Member[] = aj.boardMembers || [];
        if (list.length > 0) {
            setMembers(list);
        } else {
            // If API and Frontend both return empty, use defaults
            console.log('Using default hardcoded members');
            setMembers(DEFAULT_MEMBERS as any[]);
        }
        
        const p = (aj.pages || []).find((x: any) => x.key === 'page.board-of-director');
        setPage(p?.value || {});
      } catch (fallbackErr: any) {
        const msg = e instanceof Error ? e.message : String(e);
        const fbMsg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
        // Even if fallback fails, show defaults
        console.error(`Failed to load: ${msg}. Fallback: ${fbMsg}`);
        setMembers(DEFAULT_MEMBERS as any[]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propMembers && propMembers.length > 0) {
      const mapped: Member[] = propMembers.map((pm: any, idx: number) => ({
        id: idx,
        name: pm.name,
        role: pm.role,
        photo_path: pm.image,
        photo_url: pm.image ? (pm.image.startsWith('http') ? pm.image : `${STORAGE_URL}/${pm.image}`) : null,
        bio: pm.bio,
        email: pm.email,
        phone: null,
        links: pm.linkedin_url ? [{ label: 'LinkedIn', href: pm.linkedin_url }] : [],
        order: idx,
        is_active: true
      }));
      setMembers(mapped);
      setLoading(false);
    } else {
      load();
    }
  }, [propMembers]);

  const resolveImage = (m: any) => {
    const viaBackend = m.photo_url as string | undefined;
    if (viaBackend && viaBackend.length > 0) return viaBackend;
    const p = (m.photo_path as string | undefined) || '';
    return p.startsWith('http') ? p : p ? `${STORAGE_URL}/${p}` : 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&q=80&w=400&h=500';
  };

  return (
    <div className="py-24 bg-white" id="board-members">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-brand-blue font-bold tracking-wide uppercase text-sm mb-3">Leadership</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">{title || page.members_title || 'Meet Our Board of Directors'}</h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            {description || page.members_description || 'Guided by experienced leaders committed to healthcare accessibility, quality, and patient satisfaction.'}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] rounded-2xl bg-gray-100 mb-4" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {(members.length > 0 ? members : (DEFAULT_MEMBERS as Member[])).map((member) => (
              <div key={member.id || Math.random()} className="group relative flex flex-col">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 mb-4 relative">
                  <img
                    src={resolveImage(member)}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = resolveImage(member); }}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-darkBlue/90 via-brand-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex gap-2 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {member.email ? (
                        <a href={`mailto:${member.email}`} className="hover:text-brand-yellow transition-colors p-1.5 hover:bg-white/10 rounded-full"><Mail className="w-4 h-4" /></a>
                      ) : null}
                    </div>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-0.5">{member.name}</h4>
                <p className="text-brand-blue font-medium text-sm mb-2">{member.role}</p>
                <div
                  className="text-gray-500 text-xs leading-relaxed line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: member.bio ?? '' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardMembers;
