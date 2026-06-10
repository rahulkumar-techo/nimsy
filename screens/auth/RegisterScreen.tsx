/**
 * Register Screen
 */

import React from "react";
import {
  Alert,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthHeader from "@/components/auth/AuthHeader";
import AuthInput from "@/components/auth/AuthInput";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthFooter from "@/components/auth/AuthFooter";


import { useAuthActions } from "@/hooks/useAuthActions";
import { RegisterFormData, registerSchema } from "@/validations/auth.validation";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const { register, loading, error } =
    useAuthActions();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (
    data: RegisterFormData
  ) => {
    try {
        console.log("Register",data)
     const res = await register(data);

     
if (res.success){
     Alert.alert(
        "Success",
        "Account created successfully"
      );
      router.push({
        pathname:"/(auth)/verify-otp",
        params:{
          email:data.email
        }
      })
}
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
          title="Create Account"
          subtitle="Start your journey today"
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
          name="name"
          render={({ field }) => (
            <AuthInput
              label="Full Name"
              value={field.value}
              onChangeText={field.onChange}
              placeholder="Rahul Kumar"
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <AuthInput
              label="Email"
              value={field.value}
              onChangeText={field.onChange}
              placeholder="example@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <PasswordInput
              label="Password"
              value={field.value}
              onChangeText={field.onChange}
              placeholder="Create password"
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
              value={field.value}
              onChangeText={field.onChange}
              placeholder="Confirm password"
              error={
                errors.confirmPassword?.message
              }
            />
          )}
        />

        <AuthButton
          title="Create Account"
          loading={loading}
          onPress={handleSubmit(onSubmit)}
        />

        <AuthFooter
          text="Already have an account?"
          actionText="Login"
          onPress={() => router.push("/(auth)/login")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}