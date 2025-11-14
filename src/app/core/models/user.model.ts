export interface User {
  userId: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileIcon?: string;
  createdAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  sessionId: string;
  user: User;
}
