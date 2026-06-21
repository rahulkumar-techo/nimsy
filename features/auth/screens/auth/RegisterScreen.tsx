/**
 * Register Screen
 */

import {
    Alert,
    ScrollView,
    Text,
    View,
} from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import AuthButton from "@/features/auth/components/AuthButton";
import AuthFooter from "@/features/auth/components/AuthFooter";
import AuthHeader from "@/features/auth/components/AuthHeader";
import AuthInput from "@/features/auth/components/AuthInput";
import PasswordInput from "@/features/auth/components/PasswordInput";


import { useAuthActions } from "@/hooks/useAuthActions";
import { RegisterFormData, registerSchema } from "@/validations/auth.validation";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

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