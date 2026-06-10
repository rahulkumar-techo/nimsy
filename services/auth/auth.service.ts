/**
 * Authentication Service
 */

import axiosInstance from "@/lib/api";

import {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResendOTPPayload,
  ResetPasswordPayload,
  VerifyOTPPayload,
} from "@/types/auth.types";

import { AUTH_ENDPOINTS } from "@/constants/auth.constants";

class AuthService {
  async register(payload: RegisterPayload) {
    const response = await axiosInstance.post<AuthResponse>(
      AUTH_ENDPOINTS.REGISTER,
      payload
    );

    console.log(response)

    return response.data;
  }

/**
 * Login API Service
 */

async login(payload: LoginPayload) {
  const response = await axiosInstance.post(
    AUTH_ENDPOINTS.LOGIN,
    payload
  );

  const { accessToken, refreshToken, user } =
    response.data.data;

  return {
    tokens: {
      accessToken,
      refreshToken,
    },
    user,
  };
}

  async forgotPassword(payload: ForgotPasswordPayload) {
    const response = await axiosInstance.post(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      payload
    );

    return response.data;
  }

  async verifyOTP(payload: VerifyOTPPayload) {
    const response = await axiosInstance.post(
      AUTH_ENDPOINTS.VERIFY_OTP,
      payload
    );

    return response.data;
  }

  async resendOTP(payload: ResendOTPPayload) {
    const response = await axiosInstance.post(
      AUTH_ENDPOINTS.RESEND_OTP,
      payload
    );

    return response.data;
  }

  async resetPassword(payload: ResetPasswordPayload) {
    const response = await axiosInstance.post(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      payload
    );

    return response.data;
  }

  async logout() {
    const response = await axiosInstance.post(
      AUTH_ENDPOINTS.LOGOUT
    );

    return response.data;
  }

  async getProfile() {
    const response = await axiosInstance.get(
      AUTH_ENDPOINTS.PROFILE
    );

    return response.data;
  }
  async onboardingComplete() {
    const response = await axiosInstance.put(
      AUTH_ENDPOINTS.ONBOARDINGCOMPLETE
    );

    return response.data;
  }
}

export const authService = new AuthService();