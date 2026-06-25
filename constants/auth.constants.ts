/**
 * Authentication Constants
 */

export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh",
  FORGOT_PASSWORD: "/auth/forgot-password",
  VERIFY_OTP: "/auth/verify-email-otp",
  RESEND_OTP: "/auth/resend-email-otp",
  RESET_PASSWORD: "/auth/reset-password",
  PROFILE: "/auth/me",
  ONBOARDINGCOMPLETE: "/auth/onboardingComplete",
} as const;

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
} as const;

export const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 32,
};

export const OTP_LENGTH = 6;

export const OTP_RESEND_TIME = 60;