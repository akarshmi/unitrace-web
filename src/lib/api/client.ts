/**
 * Shared transport for the Spring Boot API.
 *
 * The refresh token is an HTTP-only cookie owned by the backend. The browser
 * sends it through credentials mode; JavaScript only stores the access token.
 */

const API_BASE_URL = (
  import.meta.env.VITE_SPRING_BOOT_API_URL || '/api/uni/v1'
).replace(/\/+$/, '');
const REFRESH_ENDPOINT = '/auth/refresh';
const NO_REFRESH_ENDPOINTS = new Set([
  '/auth/login',
  '/auth/registration/initiation',
  '/auth/registration/verification',
]);

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status = 500, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export interface BackendErrorResponse {
  message?: string;
  status?: string;
  statusCode?: number;
  timestamp?: string;
  path?: string;
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

let refreshRequest: Promise<string> | null = null;

const getErrorMessage = (data: unknown, fallback: string): string => {
  if (typeof data === 'object' && data !== null && 'message' in data) {
    const message = (data as BackendErrorResponse).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }
  return fallback;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return (await response.text()) as T;
  }

  return (await response.json()) as T;
};

const requestAccessTokenRefresh = async (): Promise<string> => {
  if (!refreshRequest) {
    refreshRequest = fetch(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
      .then(async response => {
        const data = await parseResponse<{
          accessToken?: string;
        }>(response);

        if (!response.ok) {
          throw new ApiError(
            getErrorMessage(data, 'Session refresh failed.'),
            response.status,
            data
          );
        }

        if (!data.accessToken) {
          throw new ApiError('Session refresh returned no access token.', 401, data);
        }

        setAuthToken(data.accessToken);
        return data.accessToken;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
};

const executeRequest = async <T>(
  endpoint: string,
  options: RequestInit,
  allowRefresh: boolean
): Promise<T> => {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: options.credentials || 'include',
      headers,
    });
  } catch (error) {
    throw new ApiError('Unable to reach the UniTrace API.', 0, error);
  }

  if (
    response.status === 401 &&
    allowRefresh &&
    endpoint !== REFRESH_ENDPOINT &&
    !NO_REFRESH_ENDPOINTS.has(endpoint)
  ) {
    try {
      await requestAccessTokenRefresh();
      return executeRequest<T>(endpoint, options, false);
    } catch (refreshError) {
      removeAuthToken();
      throw refreshError;
    }
  }

  const data = await parseResponse<unknown>(response);
  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data, response.statusText || 'API request failed.'),
      response.status,
      data
    );
  }

  return data as T;
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  return executeRequest<T>(endpoint, options, true);
}
