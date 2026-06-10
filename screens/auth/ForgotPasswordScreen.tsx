/**
 * Forgot Password Screen
 */

import React from "react";
import {
  Alert,

  ScrollView,
  Text,
  View,
} from "react-native";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";

import AuthHeader from "@/components/auth/AuthHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthFooter from "@/components/auth/AuthFooter";



import { useAuthActions } from "@/hooks/useAuthActions";
import { ForgotPasswordFormData, forgotPasswordSchema } from "@/validations/auth.validation";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const {
    forgotPassword,
    loading,
    error,
  } = useAuthActions();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(
      forgotPasswordSchema
    ),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (
    data: ForgotPasswordFormData
  ) => {
    try {
      await forgotPassword(data.email);

      Alert.alert(
        "OTP Sent",
        "Please check your email"
      );

      router.push({
        pathname: "/(auth)/verify-otp",
        params: {
          email: data.email,
        },
      });
    } catch {}
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 24,
          flexGrow: 1,
        }}
      >
        <AuthHeader
          title="Forgot Password"
          subtitle="Enter your email to receive OTP"
        />

        {error && (
          <View className="mb-4 rounded-xl bg-red-100 p-3">
            <Text className="text-red-600">
              {error}
            </Text>
          </View>
        )}

        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <AuthInput
              label="Email"
              placeholder="john@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.email?.message}
            />
          )}
        />

        <AuthButton
          title="Send OTP"
          loading={loading}
          onPress={handleSubmit(onSubmit)}
        />

        <AuthFooter
          text="Remember your password?"
          actionText="Login"
          onPress={() =>
            router.replace("/(auth)/login")
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}