/**
 * NOTE:
 * This method deduplicates simultaneous profile requests.
 *
 * If multiple components call getProfile() at the same time,
 * only one API request is sent and all callers receive the same Promise.
 *
 * !To fetch fresh user data after profile updates, onboarding completion,
 * !avatar changes, or account changes, call:
 *
 *   authService.clearProfileCache();
 *   await authService.getProfile(true);
 *
 * forceRefresh=true bypasses the cache and always fetches from the server.
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

  private profileCache: any = null;
  private profileCacheTime = 0;

  private profilePromise: Promise<any> | null = null;

  private readonly CACHE_DURATION =
    5 * 60 * 1000; // 5 minutes


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

  async getProfile(forceRefresh = false) {
    const now = Date.now();

    if (!forceRefresh && this.profileCache &&
      now - this.profileCacheTime < this.CACHE_DURATION)
      return this.profileCache;

    if (!forceRefresh && this.profilePromise) return this.profilePromise;

    this.profilePromise = axiosInstance.get(AUTH_ENDPOINTS.PROFILE).then((response) => {
      this.profileCache = response.data;
      this.profileCacheTime = Date.now();
      return response.data;
    }).finally(() => {
      this.profilePromise = null;
    });

    return this.profilePromise;
  }

  clearProfileCache() {
    this.profileCache = null;
    this.profileCacheTime = 0;
    this.profilePromise = null;
  }
  async onboardingComplete() {
    const response = await axiosInstance.put(
      AUTH_ENDPOINTS.ONBOARDINGCOMPLETE
    );

    return response.data;
  }
}

export const authService = new AuthService();