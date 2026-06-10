/**
 * Authentication Types
 */

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  //   confirmPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOTPPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export interface ResendOTPPayload {
  email: string;
}