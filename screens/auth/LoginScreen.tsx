/**
 * Login Screen
 */
import {
  Alert,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import { Link, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthHeader from "@/components/auth/AuthHeader";
import AuthInput from "@/components/auth/AuthInput";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthFooter from "@/components/auth/AuthFooter";
import SocialButton from "@/components/auth/SocialButton";



import { useAuthActions } from "@/hooks/useAuthActions";
import { LoginFormData, loginSchema } from "@/validations/auth.validation";
import { SafeAreaView } from "react-native-safe-area-context";
import { authStorage } from "@/utils/auth-storage";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const { login, loading, error } = useAuthActions();
  const router = useRouter();
  const { setUser , setHasCompletedOnboarding,} = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (
    data: LoginFormData
  ) => {
    try {
      const res = await login(data);

      // save credentails locally 
      const { accessToken, refreshToken } = res.tokens;
      await authStorage.save({ accessToken, refreshToken })


setUser(res.user);
setHasCompletedOnboarding(res.user.onboardingCompleted);

      // Alert.alert(
      //   "Success",
      //   "Logged in successfully"
      // );

      router.push("/(tabs)/home")
    } catch { }
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
          title="Welcome Back"
          subtitle="Login to continue"
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
              value={field.value}
              onChangeText={field.onChange}
              placeholder="Enter your email"
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
              placeholder="Enter password"
              error={errors.password?.message}
            />
          )}
        />

        <Link href="/forgot-password" asChild>
          <TouchableOpacity className="mb-6 self-end">
            <Text className="font-semibold text-blue-600">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </Link>

        <AuthButton
          title="Login"
          loading={loading}
          onPress={handleSubmit(onSubmit)}
        />

        <View className="my-6 flex-row items-center">
          <View className="h-px flex-1 bg-gray-300" />
          <Text className="mx-3 text-gray-500">
            OR
          </Text>
          <View className="h-px flex-1 bg-gray-300" />
        </View>

        <SocialButton
          title="Continue with Google"
          onPress={() => {
            Alert.alert(
              "Coming Soon",
              "Google login not implemented"
            );
          }}
        />

        <AuthFooter
          text="Don't have an account?"
          actionText="Register"
          onPress={() => router.push("/(auth)/register")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}