/**
 * UniTrace API Client
 * Interacts with Spring Boot backend via JWT Bearer auth,
 * with complete local persistence support.
 */

const API_BASE_URL = import.meta.env.VITE_SPRING_BOOT_API_URL || '/api/v1';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number = 500, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('unitrace_jwt_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('unitrace_jwt_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('unitrace_jwt_token');
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      throw new ApiError(errorData.message || 'API request failed', response.status, errorData);
    }

    return await response.json();
  } catch (err: any) {
    // If external Spring Boot server is not actively connected, log once and bubble or fallback
    throw err;
  }
}
