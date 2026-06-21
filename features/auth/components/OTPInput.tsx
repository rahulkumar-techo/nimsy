/**
 * OTP Input Component
 */

import React, { useRef } from "react";
import {
  TextInput,
  View,
} from "react-native";

interface OTPInputProps {
  value: string;
  onChange: (otp: string) => void;
}

export default function OTPInput({
  value,
  onChange,
}: OTPInputProps) {
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (
    text: string,
    index: number
  ) => {
    const otp = value.split("");
    otp[index] = text;

    const otpValue = otp.join("");

    onChange(otpValue);

    if (
      text &&
      index < inputs.current.length - 1
    ) {
      inputs.current[index + 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-between">
      {Array.from({ length: 6 }).map(
        (_, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) {
                inputs.current[index] = ref;
              }
            }}
            value={value[index] || ""}
            onChangeText={(text) =>
              handleChange(text, index)
            }
            maxLength={1}
            keyboardType="number-pad"
            className="h-14 w-14 rounded-2xl border border-gray-300 text-center text-xl dark:border-zinc-700 dark:text-white"
          />
        )
      )}
    </View>
  );
}