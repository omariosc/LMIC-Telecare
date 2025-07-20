// API client for making authenticated requests to the backend
import type { ApiResponse } from '../types/api';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://telecare-platform-api.developer-04b.workers.dev';

class ApiError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Base API client
class BaseApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || 'Request failed',
          response.status,
          data.error,
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or parsing errors
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        undefined,
        'NETWORK_ERROR',
        error
      );
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }

  // Set authorization token
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Remove authorization token
  clearAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }
}

// Authentication API client
class AuthApiClient extends BaseApiClient {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.post<LoginResponse>('/api/v1/auth/login', credentials);
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return this.post<RegisterResponse>('/api/v1/auth/register', userData);
  }

  async logout(): Promise<ApiResponse<{ sessionDestroyed: boolean }>> {
    return this.post<{ sessionDestroyed: boolean }>('/api/v1/auth/logout');
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: any }>> {
    return this.get<{ user: any }>('/api/v1/auth/me');
  }

  async refreshToken(): Promise<ApiResponse<{ token: string; expiresAt: string }>> {
    return this.post<{ token: string; expiresAt: string }>('/api/v1/auth/refresh');
  }
}

// Cases API client
class CasesApiClient extends BaseApiClient {
  async getCases(params?: {
    page?: number;
    limit?: number;
    status?: string;
    urgency?: string;
    specialty?: string;
  }): Promise<ApiResponse<{ cases: any[] }>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/api/v1/cases${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.get<{ cases: any[] }>(endpoint);
  }

  async getCase(id: string): Promise<ApiResponse<{ case: any }>> {
    return this.get<{ case: any }>(`/api/v1/cases/${id}`);
  }

  async createCase(caseData: any): Promise<ApiResponse<{ case: any }>> {
    return this.post<{ case: any }>('/api/v1/cases', caseData);
  }

  async updateCase(id: string, caseData: any): Promise<ApiResponse<{ case: any }>> {
    return this.put<{ case: any }>(`/api/v1/cases/${id}`, caseData);
  }
}

// Users API client
class UsersApiClient extends BaseApiClient {
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    specialty?: string;
    status?: string;
  }): Promise<ApiResponse<{ users: any[] }>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/api/v1/users${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.get<{ users: any[] }>(endpoint);
  }

  async getUser(id: string): Promise<ApiResponse<{ user: any }>> {
    return this.get<{ user: any }>(`/api/v1/users/${id}`);
  }

  async updateUser(id: string, userData: any): Promise<ApiResponse<{ user: any }>> {
    return this.put<{ user: any }>(`/api/v1/users/${id}`, userData);
  }
}

// Main API client instance
class ApiClient {
  public auth: AuthApiClient;
  public cases: CasesApiClient;
  public users: UsersApiClient;

  constructor(baseURL?: string) {
    this.auth = new AuthApiClient(baseURL);
    this.cases = new CasesApiClient(baseURL);
    this.users = new UsersApiClient(baseURL);
  }

  // Set auth token for all clients
  setAuthToken(token: string) {
    this.auth.setAuthToken(token);
    this.cases.setAuthToken(token);
    this.users.setAuthToken(token);
  }

  // Clear auth token from all clients
  clearAuthToken() {
    this.auth.clearAuthToken();
    this.cases.clearAuthToken();
    this.users.clearAuthToken();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export classes for testing
export { ApiClient, ApiError, AuthApiClient, CasesApiClient, UsersApiClient };

// Export types
export type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse };