/**
 * Verify OTP Screen
 */

import {
    useEffect,
    useState,
} from "react";

import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import AuthButton from "@/features/auth/components/AuthButton";
import AuthHeader from "@/features/auth/components/AuthHeader";
import OTPInput from "@/features/auth/components/OTPInput";

import { useAuthActions } from "@/hooks/useAuthActions";

const RESEND_SECONDS = 60;

export default function VerifyOTPScreen() {
  const { email } =
    useLocalSearchParams<{
      email: string;
    }>();

  const {
    verifyOTP,
    resendOTP,
    loading,
    error,
  } = useAuthActions();

  const [otp, setOtp] = useState("");

  const [seconds, setSeconds] =
    useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert(
        "Invalid OTP",
        "OTP must be 6 digits"
      );

      return;
    }

    try {
      await verifyOTP(email, otp);

      router.push({
        pathname: "/(auth)/login",
        params: {
          email
        },
      });
    } catch {}
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP(email);

      Alert.alert(
        "Success",
        "OTP resent successfully"
      );

      setSeconds(RESEND_SECONDS);
    } catch {}
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          flexGrow: 1,
        }}
      >
        <AuthHeader
          title="Verify OTP"
          subtitle={`Code sent to ${email}`}
        />

        {error && (
          <View className="mb-4 rounded-xl bg-red-100 p-3">
            <Text className="text-red-600">
              {error}
            </Text>
          </View>
        )}

        <View className="mb-8">
          <OTPInput
            value={otp}
            onChange={setOtp}
          />
        </View>

        <AuthButton
          title="Verify OTP"
          loading={loading}
          onPress={handleVerify}
        />

        <View className="mt-8 items-center">
          {seconds > 0 ? (
            <Text className="text-gray-500">
              Resend OTP in {seconds}s
            </Text>
          ) : (
            <TouchableOpacity
              onPress={handleResendOTP}
            >
              <Text className="font-semibold text-blue-600">
                Resend OTP
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="mt-4"
            onPress={() =>
              router.back()
            }
          >
            <Text className="font-medium text-gray-600">
              Change Email
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}