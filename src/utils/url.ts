
import { API_URL } from '../config/api';

export const resolveSrc = (p: string): string => {
  const s = String(p || '').trim();
  if (!s) return '';
  
  // Use API_URL to determine the backend root
  const base = API_URL.replace(/\/api\/?$/, '');

  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith('/storage/')) return `${base}${s}`;
  if (s.startsWith('storage/')) return `${base}/${s}`;
  if (s.startsWith('/')) return s;
  return `${base}/storage/${s}`;
};

export const normalizeHref = (input?: string | null): string | undefined => {
  const s = String(input ?? '').trim();
  if (!s) return undefined;

  if (s.startsWith('#') || s.startsWith('/')) return s;

  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(s)) return s;

  if (s.startsWith('//')) return s;

  if (s.startsWith('www.') || /[a-z0-9-]+\.[a-z]{2,}([/:?#]|$)/i.test(s)) {
    return `https://${s}`;
  }

  return s;
};
