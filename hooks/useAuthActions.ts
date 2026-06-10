

/**
 * Centralized Authentication Hook
 */

import { useState } from "react";

import authService from "@/services/auth/auth.service";

import {
    LoginPayload,
    RegisterPayload,
    ResetPasswordPayload,
} from "@/types/auth.types";

export function useAuthActions() {
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(
        null
    );

    const clearError = () => {
        setError(null);
    };

    const login = async (
        payload: LoginPayload
    ) => {
        try {
            setLoading(true);
            setError(null);

            return await authService.login(payload);
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "Login failed";

            setError(message);

            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (
        payload: RegisterPayload
    ) => {
        try {
            console.log("hook", payload)
            setLoading(true);
            setError(null);

            return await authService.register({ name: payload.name, email: payload.email, password: payload.password });
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "Registration failed";

            setError(message);

            throw error;
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (
        email: string
    ) => {
        try {
            setLoading(true);
            setError(null);

            return await authService.forgotPassword({
                email,
            });
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "Failed to send OTP";

            setError(message);

            throw error;
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (
        email: string,
        otp: string
    ) => {
        try {
            setLoading(true);
            setError(null);

            return await authService.verifyOTP({
                email,
                otp,
            });
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "OTP verification failed";

            setError(message);

            throw error;
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async (
        email: string
    ) => {
        try {
            setLoading(true);
            setError(null);

            return await authService.resendOTP({
                email,
            });
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "Failed to resend OTP";

            setError(message);

            throw error;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (
        payload: ResetPasswordPayload
    ) => {
        try {
            setLoading(true);
            setError(null);

            return await authService.resetPassword(
                payload
            );
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "Password reset failed";

            setError(message);

            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            setError(null);

            return await authService.logout();
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "Logout failed";

            setError(message);

            throw error;
        } finally {
            setLoading(false);
        }
    };

    const me = async () => {
        try {
            setLoading(true);
            setError(null);

            return await authService.getProfile();
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "userFetched failed";

            setError(message);

            throw error;
        } finally {
            setLoading(false);
        }
    }
    const onboardingComplete = async () => {
        try {
            setLoading(true);
            setError(null);

            return await authService.onboardingComplete();
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "onboardingComplete failed";

            setError(message);

            throw error;
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        error,
        clearError,

        login,
        register,

        forgotPassword,
        verifyOTP,
        resendOTP,
        resetPassword,

        logout,
        me,
        onboardingComplete
    };
}