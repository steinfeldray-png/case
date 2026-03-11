// API Configuration
// В production этот URL будет вашим VPS сервером на Timeweb
// В development - локальный сервер

// В dev без VITE_API_URL используем пустой base — Vite proxy перенаправит /api/* на localhost:3000
// В production задай VITE_API_URL=https://your-backend-url
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const API_ENDPOINTS = {
  projects: `${API_BASE_URL}/api/projects`,
  projectBySlug: (slug: string) => `${API_BASE_URL}/api/projects/${slug}`,
  projectById: (id: number) => `${API_BASE_URL}/api/projects/${id}`,
  profile: `${API_BASE_URL}/api/profile`,
  upload: `${API_BASE_URL}/api/upload`,
  init: `${API_BASE_URL}/api/init`,
  health: `${API_BASE_URL}/health`,
};

// Default headers for API requests
export const API_HEADERS = {
  'Content-Type': 'application/json',
};

// Helper function for API requests
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...API_HEADERS,
        ...options?.headers,
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
