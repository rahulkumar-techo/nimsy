/**
 * Onboarding Screen (7 Steps - Scalable)
 */

import React, { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { ImageBackground, Pressable, Text, View } from "react-native"
import { useAuth } from "@/context/AuthContext"
import { useAuthActions } from "@/hooks/useAuthActions"

const ONBOARDING_DATA = [
  {
    title: "Welcome to Story World",
    subtitle: "A magical place to read, learn and grow",
    image: require("../assets/obboarding/screen-1.png"),
    button: "Get Started",
  },
  {
    title: "Discover Amazing Stories",
    subtitle: "Explore thousands of stories",
    image: require("../assets/obboarding/screen-2.png"),
    button: "Next",
  },
  {
    title: "Watch & Learn",
    subtitle: "Fun and meaningful videos",
    image: require("../assets/obboarding/screen-3.png"),
    button: "Next",
  },
  {
    title: "Learn Good Values",
    subtitle: "Stories that build character",
    image: require("../assets/obboarding/screen-4.png"),
    button: "Next",
  },
  {
    title: "Safe & Secure",
    subtitle: "100% safe for kids",
    image: require("../assets/obboarding/screen-5.png"),
    button: "Next",
  },
  {
    title: "Parental Controls",
    subtitle: "Manage screen time easily",
    image: require("../assets/obboarding/screen-6.png"),
    button: "Next",
  },
  {
    title: "Let’s Begin!",
    subtitle: "Start your learning journey",
    image: require("../assets/obboarding/screen-7.png"),
    button: "Start Exploring",
  },
]

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0)
  const isLastStep = step === ONBOARDING_DATA.length - 1

  const current = ONBOARDING_DATA[step]

  const { onboardingComplete, loading } = useAuthActions();
  const { refreshUser } = useAuth();


  const next = async () => {
    if (!isLastStep) {
      setStep((currentStep) => currentStep + 1)
      return
    }

    const { setUser } = useAuth();

    const response = await onboardingComplete();

    setUser(response.data);
    router.replace("/(tabs)/home")
  }

  const prev = () => {
    if (step > 0) {
      setStep((currentStep) => currentStep - 1)
    }
  }

  return (
    <ImageBackground
      source={current.image}
      resizeMode="cover"
      className="flex-1"
    >
      <View className="flex-1 bg-black/35 px-6 pt-10">

        {/* Top Bar */}
        <View className="flex-row justify-between items-center mb-6">
          {step > 0 ? (
            <Pressable onPress={prev}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </Pressable>
          ) : (
            <View />
          )}

          {isLastStep ? <View /> : (
            <Pressable onPress={() => setStep(ONBOARDING_DATA.length - 1)}>
              <Text className="text-white">Skip</Text>
            </Pressable>
          )}
        </View>

        <View className="flex-1" />

        {/* Text */}
        <View className="items-center pb-8">
          <Text className="text-4xl font-bold text-center text-white">
            {current.title}
          </Text>

          <Text className="text-white/85 text-center mt-3 px-4 text-base">
            {current.subtitle}
          </Text>
        </View>

        {/* Dots */}
        <View className="flex-row justify-center mb-6 gap-2">
          {ONBOARDING_DATA.map((_, i) => (
            <View
              key={i}
              className={`h-2 w-2 rounded-full ${i === step ? "bg-white w-6" : "bg-white/40"
                }`}
            />
          ))}
        </View>

        {/* Button */}
        <Pressable
          onPress={next}
          className="mb-8 rounded-xl items-center bg-white py-4"
        >
          {
            loading ? <Text className="font-semibold text-slate-900">
              {"Finishing..."}
            </Text> : <Text className="font-semibold text-slate-900">
              {current.button}
            </Text>
          }
        </Pressable>
      </View>
    </ImageBackground>
  )
}
