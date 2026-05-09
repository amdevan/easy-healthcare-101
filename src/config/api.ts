const getApiUrl = (): string => {
    const env = (import.meta as any).env || {};
    if (env.DEV) {
        return env.VITE_API_URL || '/api';
    }

    if (typeof window !== 'undefined' && (window as any).APP_CONFIG && (window as any).APP_CONFIG.API_URL) {
        return (window as any).APP_CONFIG.API_URL;
    }

    const url = env.VITE_API_URL || 'https://admin.easyhealthcare101.com/api';
    return url;
};

export const API_URL = getApiUrl();

export const STORAGE_URL = API_URL.replace(/\/api$/, '') + '/storage';

export const apiRequest = async (endpoint: string, options?: RequestInit) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
};
