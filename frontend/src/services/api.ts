// Base API configuration and storage bridge
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function fetchWithFallback<T>(endpoint: string, fallbackData: T, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) {
      return fallbackData;
    }
    return (await res.json()) as T;
  } catch {
    // Graceful offline / demo fallback
    return fallbackData;
  }
}
