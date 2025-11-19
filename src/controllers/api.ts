// Simple API client for backend modules
export interface DoctorDto {
  id: number;
  name: string;
  location: string | null;
  experience_years: number | null;
  rating: number | null;
}

export interface LabTestDto {
  id: number;
  name: string;
  code: string | null;
  description: string | null;
  price: number | null;
  duration_minutes: number | null;
  home_collection_available: boolean | null;
}

export interface SpecialtyDto {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

export interface ArticleDto {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  published_at: string | null;
}

type Paginated<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

const API_BASE = 'http://127.0.0.1:8000/api';

export async function fetchDoctors(params?: { location?: string; q?: string; page?: number }): Promise<Paginated<DoctorDto>> {
  const url = new URL(`${API_BASE}/doctors`);
  if (params?.location) url.searchParams.set('location', params.location);
  if (params?.q) url.searchParams.set('q', params.q);
  if (params?.page) url.searchParams.set('page', String(params.page));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch doctors: ${res.status}`);
  return res.json();
}

export async function fetchLabTests(params?: { q?: string; page?: number }): Promise<Paginated<LabTestDto>> {
  const url = new URL(`${API_BASE}/lab-tests`);
  if (params?.q) url.searchParams.set('q', params.q);
  if (params?.page) url.searchParams.set('page', String(params.page));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch lab tests: ${res.status}`);
  return res.json();
}

export async function fetchSpecialties(): Promise<SpecialtyDto[]> {
  const res = await fetch(`${API_BASE}/specialties`);
  if (!res.ok) throw new Error(`Failed to fetch specialties: ${res.status}`);
  return res.json();
}

export async function fetchArticles(params?: { page?: number }): Promise<Paginated<ArticleDto>> {
  const url = new URL(`${API_BASE}/articles`);
  if (params?.page) url.searchParams.set('page', String(params.page));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch articles: ${res.status}`);
  return res.json();
}

// UI Settings
export interface HeaderSettingDto {
  logo_url?: string | null;
  cta?: { label?: string | null; href?: string | null } | null;
  links?: { label: string; href: string }[];
}

export async function fetchHeaderSetting(): Promise<HeaderSettingDto> {
  const res = await fetch(`${API_BASE}/settings/header`);
  if (!res.ok) throw new Error(`Failed to fetch header setting: ${res.status}`);
  return res.json();
}

// Contact
export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function submitContact(payload: ContactPayload): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Failed to submit contact: ${res.status}`);
  }
  return res.json();
}