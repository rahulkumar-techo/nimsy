/**
 * Reset Password Screen
 */

import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from "react-native";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import {
    Controller,
    useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import AuthButton from "@/features/auth/components/AuthButton";
import AuthHeader from "@/features/auth/components/AuthHeader";
import PasswordInput from "@/features/auth/components/PasswordInput";



import { useAuthActions } from "@/hooks/useAuthActions";
import { ResetPasswordFormData, resetPasswordSchema } from "@/validations/auth.validation";

export default function ResetPasswordScreen() {
  const { email, otp } =
    useLocalSearchParams<{
      email: string;
      otp: string;
    }>();

  const {
    resetPassword,
    loading,
    error,
  } = useAuthActions();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(
      resetPasswordSchema
    ),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (
    data: ResetPasswordFormData
  ) => {
    try {
      await resetPassword({
        email,
        otp,
        password: data.password,
        confirmPassword:
          data.confirmPassword,
      });

      Alert.alert(
        "Success",
        "Password changed successfully"
      );

      router.replace("/success");
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
          title="Reset Password"
          subtitle="Create a new password"
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
          name="password"
          render={({ field }) => (
            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm password"
              value={field.value}
              onChangeText={field.onChange}
              error={
                errors.confirmPassword
                  ?.message
              }
            />
          )}
        />

        <AuthButton
          title="Reset Password"
          loading={loading}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}