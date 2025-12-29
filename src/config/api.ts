// API Configuration
// This file centralizes API URL configuration for different environments

const getApiUrl = (): string => {
    // In production (Docker), use environment variable or default to relative path
    if (import.meta.env.PROD) {
        return import.meta.env.VITE_API_URL || '/api';
    }

    // In development, use localhost backend
    return import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
};

export const API_URL = getApiUrl();

// Helper function for making API requests
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
