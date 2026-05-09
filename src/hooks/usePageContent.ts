import { useState, useEffect } from 'react';
import { API_URL } from '@/config/api';

export interface PageContentBlock {
  type: string;
  data: any;
}

export interface PageData {
  id: number;
  title: string;
  slug: string;
  content: PageContentBlock[];
  hero_image?: string;
  seo_title?: string;
  seo_description?: string;
  is_active?: boolean;
  open_in_new_tab?: boolean;
}

export const usePageContent = (slug: string) => {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const fetchPage = async () => {
      try {
        setLoading(true);
        // Using API_URL from config
        const response = await fetch(`${API_URL}/pages/${slug}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch page: ${response.statusText}`);
        }
        const jsonData = await response.json();
        if (!ignore) {
          setData(jsonData);
        }
      } catch (err: any) {
        if (!ignore) {
          console.error(`Error fetching page ${slug}:`, err);
          setError(err.message || 'Failed to fetch page content');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchPage();

    return () => {
      ignore = true;
    };
  }, [slug]);

  return { data, loading, error };
};
