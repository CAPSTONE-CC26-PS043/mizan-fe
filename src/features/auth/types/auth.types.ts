export interface User {
  id: number;
  email: string;
  name: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  } | null;
  message: string;
  statusCode: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface RefreshResponse {
  success: boolean;
  data: {
    accessToken: string;
  } | null;
  message: string;
  statusCode: number;
}
