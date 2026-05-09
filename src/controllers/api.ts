// Simple API client for backend modules


import { API_URL } from '../config/api';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: any;
  patient?: any;
}

export async function loginUser(credentials: any): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message || `Login failed: ${res.status}`);
  }
  return res.json();
}

export async function registerUser(data: any): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message || `Registration failed: ${res.status}`);
  }
  return res.json();
}

export async function logoutUser(token: string): Promise<void> {
  await fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
}

export async function fetchCurrentUser(token: string): Promise<any> {
  const res = await fetch(`${API_URL}/me`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);
  return res.json();
}

export type MyProfileResponse = {
  user: any;
  patient: any;
};

const authHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json',
});

export async function fetchMyProfile(token: string): Promise<MyProfileResponse> {
  const res = await fetch(`${API_URL}/my/profile`, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || `Failed to fetch profile: ${res.status}`);
  }
  return res.json();
}

export async function updateMyProfile(token: string, data: any): Promise<MyProfileResponse> {
  const res = await fetch(`${API_URL}/my/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify(data ?? {}),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || `Failed to update profile: ${res.status}`);
  }
  return res.json();
}

export async function fetchMyAppointments(
  token: string,
  params?: { status?: string; page?: number }
): Promise<Paginated<any>> {
  const sp = new URLSearchParams();
  if (params?.status) sp.set('status', params.status);
  if (params?.page) sp.set('page', String(params.page));
  const url = `${API_URL}/my/appointments${sp.toString() ? `?${sp.toString()}` : ''}`;
  const res = await fetch(url, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || `Failed to fetch appointments: ${res.status}`);
  }
  return res.json();
}

export async function cancelMyAppointment(token: string, id: number | string): Promise<any> {
  const res = await fetch(`${API_URL}/my/appointments/${id}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || `Failed to cancel appointment: ${res.status}`);
  }
  return res.json();
}

export async function fetchMyPrescriptions(token: string, params?: { page?: number }): Promise<Paginated<any>> {
  const sp = new URLSearchParams();
  if (params?.page) sp.set('page', String(params.page));
  const url = `${API_URL}/my/prescriptions${sp.toString() ? `?${sp.toString()}` : ''}`;
  const res = await fetch(url, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || `Failed to fetch prescriptions: ${res.status}`);
  }
  return res.json();
}

export async function fetchMyLabAppointments(token: string, params?: { page?: number }): Promise<Paginated<any>> {
  const sp = new URLSearchParams();
  if (params?.page) sp.set('page', String(params.page));
  const url = `${API_URL}/my/lab-appointments${sp.toString() ? `?${sp.toString()}` : ''}`;
  const res = await fetch(url, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || `Failed to fetch lab appointments: ${res.status}`);
  }
  return res.json();
}

export interface DoctorDto {
  id: number;
  name: string;
  location: string | null;
  experience_years: number | null;
  rating: number | null;
  profile_photo_path?: string | null;
  profile_photo_url?: string | null;
  specialization?: string | null;
  appointment_type?: string[] | null;
  consultation_fee_clinic?: number | null;
  consultation_fee_online?: number | null;
  consultation_fee_home?: number | null;
  nmc_no?: string | null;
  position?: string | null;
  hospitals?: string[] | null;
}

export interface DoctorDetailDto {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  profile_photo_path?: string | null;
  profile_photo_url?: string | null;
  position?: string | null;
  specialization?: string | null;
  appointment_type?: string[] | null;
  consultation_fee_clinic?: number | null;
  consultation_fee_online?: number | null;
  consultation_fee_home?: number | null;
  nmc_no?: string | null;
  specialty_id?: number | null;
  content?: string | null;
  availability?: any;
  hospital_name?: string | null;
  hospitals?: string[] | null;
  is_active?: boolean;
  location?: string | null;
  experience_years?: number | null;
  rating?: number | string | null;
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
  icon_path?: string | null;
  icon_url?: string | null;
}

export interface ArticleDto {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  published_at: string | null;
}

export interface BoardMemberDto {
  id: number;
  name: string;
  role: string | null;
  photo_path: string | null;
  photo_url: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  links: { label: string; href: string }[] | null;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ManagementTeamDto {
  id: number;
  name: string;
  role: string | null;
  photo_path: string | null;
  photo_url: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  links: { label: string; href: string }[] | null;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentSettings {
  esewa: { enabled: boolean; merchant_id: string; secret_key?: string; environment: string };
  khalti: { enabled: boolean; public_key: string; secret_key?: string; environment: string };
  fonepay: { enabled: boolean; merchant_code: string; secret_key?: string; environment: string };
  stripe: { enabled: boolean; publishable_key: string; secret_key?: string; environment: string };
}

export interface HeaderSettingDto {
  top_bar: {
    enabled: boolean;
    address: string;
    phone: string;
    login_label: string;
    login_href: string;
    action_buttons: Array<{ label: string; href: string; variant: string; new_tab?: boolean }>;
  };
  logo_url?: string;
  logo_href?: string;
  logo_height?: number;
  brand_name?: string;
  show_brand_name?: boolean;
  links?: Array<{ label: string; href: string; type?: string; desc?: string; new_tab?: boolean }>;
  services_menu?: Array<{ label: string; href: string; new_tab?: boolean }>;
  about_menu?: Array<{ label: string; href: string; desc?: string; new_tab?: boolean }>;
}

export interface BannerDto {
  id: number;
  title: string;
  subtitle?: string | null;
  image?: string | null;
  image_url?: string | null;
  display_image_url?: string | null;
  link_url?: string | null;
  new_tab?: boolean;
  button_text?: string | null;
  pages?: string[] | null;
  show_on_all_pages: boolean;
  order: number;
  is_active: boolean;
}

export interface FooterLink {
  label: string;
  url: string;
  new_tab?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface FooterSettingDto {
  logo?: string;
  logo_height?: number;
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  copyright?: string;
  security_label?: string;
  columns?: FooterColumn[];
  social_links?: SocialLink[];
  android_app_link?: string;
  ios_app_link?: string;
  android_app_badge?: string;
  ios_app_badge?: string;
  download_app_title?: string;
  newsletter_title?: string;
  newsletter_description?: string;
}

type Paginated<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export async function fetchDoctors(params?: { location?: string; q?: string; page?: number }): Promise<Paginated<DoctorDto>> {
  const sp = new URLSearchParams();
  if (params?.location) sp.set('location', params.location);
  if (params?.q) sp.set('q', params.q);
  if (params?.page) sp.set('page', String(params.page));
  const url = `${API_URL}/doctors${sp.toString() ? `?${sp.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch doctors: ${res.status}`);
  return res.json();
}

export async function getDoctor(id: number): Promise<DoctorDetailDto> {
  const res = await fetch(`${API_URL}/doctors/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch doctor ${id}: ${res.status}`);
  return res.json();
}

export async function getDoctorBySlug(slug: string): Promise<DoctorDetailDto> {
  const res = await fetch(`${API_URL}/doctors/slug/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error(`Failed to fetch doctor ${slug}: ${res.status}`);
  return res.json();
}

export async function fetchSpecialties(): Promise<SpecialtyDto[]> {
  const res = await fetch(`${API_URL}/specialties`);
  if (!res.ok) throw new Error(`Failed to fetch specialties: ${res.status}`);
  return res.json();
}

export async function fetchLabTests(): Promise<LabTestDto[]> {
  const res = await fetch(`${API_URL}/lab-tests`);
  if (!res.ok) throw new Error(`Failed to fetch lab tests: ${res.status}`);
  const json = await res.json();
  return Array.isArray(json) ? json : (json.data || []);
}

export async function fetchArticles(): Promise<ArticleDto[]> {
  const res = await fetch(`${API_URL}/articles`);
  if (!res.ok) throw new Error(`Failed to fetch articles: ${res.status}`);
  const json = await res.json();
  return Array.isArray(json) ? json : (json.data || []);
}

export async function getArticle(id: number): Promise<ArticleDto> {
  const res = await fetch(`${API_URL}/articles/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch article ${id}: ${res.status}`);
  return res.json();
}

export async function createAppointment(data: any): Promise<any> {
  const res = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message || `Failed to create appointment: ${res.status}`);
  }
  return res.json();
}

export async function fetchDoctorAvailability(doctorId: number, date: string): Promise<{ slots: string[] }> {
    const sp = new URLSearchParams({ date });
    const res = await fetch(`${API_URL}/doctors/${doctorId}/availability?${sp.toString()}`);
    if (!res.ok) throw new Error(`Failed to fetch availability: ${res.status}`);
    return res.json();
}

export async function fetchPaymentSettings(): Promise<PaymentSettings> {
  const res = await fetch(`${API_URL}/settings/payment_gateway`);
  
  const defaults: PaymentSettings = {
    esewa: { enabled: false, merchant_id: '', environment: 'test' },
    khalti: { enabled: false, public_key: '', environment: 'test' },
    fonepay: { enabled: false, merchant_code: '', environment: 'test' },
    stripe: { enabled: false, publishable_key: '', environment: 'test' }
  };

  if (!res.ok) {
    // If 404, return defaults (all disabled)
    if (res.status === 404) {
      return defaults;
    }
    throw new Error(`Failed to fetch payment settings: ${res.status}`);
  }
  
  const data = await res.json();
  // Merge with defaults to ensure all keys exist
  return {
    esewa: { ...defaults.esewa, ...(data.esewa || {}) },
    khalti: { ...defaults.khalti, ...(data.khalti || {}) },
    fonepay: { ...defaults.fonepay, ...(data.fonepay || {}) },
    stripe: { ...defaults.stripe, ...(data.stripe || {}) }
  };
}

export interface GeneralSettingDto {
  home_page_slug?: string;
}

export async function fetchGeneralSetting(): Promise<GeneralSettingDto> {
  const res = await fetch(`${API_URL}/settings/general`);
  if (!res.ok) {
     if (res.status === 404) return {};
     throw new Error(`Failed to fetch general settings: ${res.status}`);
  }
  return res.json();
}

export async function fetchHeaderSetting(): Promise<HeaderSettingDto> {
  const res = await fetch(`${API_URL}/settings/header`);
  if (!res.ok) {
    if (res.status === 404) {
       // Return defaults if not found
       return {
         top_bar: {
           enabled: true,
           address: 'Kathmandu, Nepal',
           phone: '+977 1-4510101',
           login_label: 'Patient Login',
           login_href: '/auth/login',
           action_buttons: []
         },
         links: []
       };
    }
    throw new Error(`Failed to fetch header settings: ${res.status}`);
  }
  return res.json();
}

export async function fetchBanners(): Promise<BannerDto[]> {
  const res = await fetch(`${API_URL}/banners`);
  if (!res.ok) throw new Error(`Failed to fetch banners: ${res.status}`);
  return res.json();
}

export async function fetchServerTime(): Promise<{ now: string }> {
  // Mock implementation since we don't have a dedicated endpoint yet
  // In a real app, this should come from the server
  return { now: new Date().toISOString() };
}

export async function fetchFooterSetting(): Promise<FooterSettingDto> {
  const res = await fetch(`${API_URL}/settings/footer`);
  if (!res.ok) {
    if (res.status === 404) {
       return {};
    }
    throw new Error(`Failed to fetch footer settings: ${res.status}`);
  }
  return res.json();
}

export const resolveStorageUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  const s = String(path).trim();
  if (!s) return '';
  
  const base = API_URL.replace(/\/api\/?$/, '');

  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith('/storage/')) return `${base}${s}`;
  if (s.startsWith('storage/')) return `${base}/${s}`;
  if (s.startsWith('/')) return s;
  return `${base}/storage/${s}`;
};

export async function submitContact(data: any): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message || `Failed to submit contact form: ${res.status}`);
  }
  return res.json();
}

export async function submitVolunteer(data: any): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/volunteer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message || `Failed to submit volunteer form: ${res.status}`);
  }
  return res.json();
}

export async function listBoardMembers(): Promise<Paginated<BoardMemberDto>> {
  const res = await fetch(`${API_URL}/board-members?active=1&per_page=100`, {
    headers: { 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error(`Failed to fetch board members: ${res.status}`);
  
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON response: ${text.substring(0, 150)}`);
  }
}

export async function fetchBoardMembers(): Promise<BoardMemberDto[]> {
    try {
        const paginated = await listBoardMembers();
        return paginated.data || [];
    } catch (e) {
        // Fallback or ignore
        return [];
    }
}

export async function listManagementTeams(): Promise<Paginated<ManagementTeamDto>> {
  const res = await fetch(`${API_URL}/management-teams?active=1&per_page=100`);
  if (!res.ok) throw new Error(`Failed to fetch management teams: ${res.status}`);
  return res.json();
}

export async function fetchManagementTeams(): Promise<ManagementTeamDto[]> {
    try {
        const paginated = await listManagementTeams();
        return paginated.data || [];
    } catch (e) {
        // Fallback or ignore
        return [];
    }
}
