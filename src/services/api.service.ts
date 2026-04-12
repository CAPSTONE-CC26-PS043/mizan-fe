import { apiConfig } from '@/config/api.config';
import { useAuthStore } from '@/features/auth/store/auth.store';

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = apiConfig.baseURL;
    this.timeout = apiConfig.timeout;
    console.log('[ApiService] Initialized with baseURL:', this.baseURL);
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const state = useAuthStore.getState();
    const token = state.accessToken;
    const userId = state.user?.id;
    
    console.log('[ApiService] Getting headers - token exists:', !!token, 'userId:', userId);
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response, endpoint: string): Promise<T> {
    console.log('[ApiService] Response for', endpoint, ':', response.status, response.statusText);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      console.error('[ApiService] Error response:', error);
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    console.log('[ApiService] GET request to:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response, endpoint);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    console.log('[ApiService] POST request to:', `${this.baseURL}${endpoint}`, 'data:', data);

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response, endpoint);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response, endpoint);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response, endpoint);
  }
}

export const apiService = new ApiService();
