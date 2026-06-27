import React, { useEffect } from "react";
import { View, Text, Image, Dimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const AnimatedText = Animated.createAnimatedComponent(Text);

const LETTERS = [
  { char: "N", color: "text-violet-600" },
  { char: "I", color: "text-yellow-400" },
  { char: "M", color: "text-rose-400" },
  { char: "S", color: "text-blue-500" },
  { char: "Y", color: "text-purple-500" },
];

export default function NimsyLoadingScreen() {
  const logoTranslateX = useSharedValue(-80);

  const letterAnimations = LETTERS.map(() => useSharedValue(0));

  useEffect(() => {
    // Sliding Logo
    logoTranslateX.value = withRepeat(
      withSequence(
        withTiming(width - 170, {
          duration: 2200,
          easing: Easing.linear,
        }),
        withTiming(-80, {
          duration: 0,
        })
      ),
      -1,
      false
    );

    // Bouncing Letters
    letterAnimations.forEach((anim, index) => {
      anim.value = withDelay(
        index * 150,
        withRepeat(
          withSequence(
            withTiming(-12, { duration: 250 }),
            withTiming(0, { duration: 250 })
          ),
          -1,
          true
        )
      );
    });
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: logoTranslateX.value,
      },
    ],
  }));

  return (
    <View className="flex-1 bg-white items-center justify-center px-5">
      {/* Portrait Image */}
      <View className="mb-10 items-center">
        <Image
          source={require("../../assets/app-loading/nimsy-loading-app.png")}
          className="w-48 h-48 rounded-full border-4 border-violet-100"
          resizeMode="cover"
        />
      </View>

      {/* Loading Animation Track */}
      <View className="w-[88%] h-[90px] rounded-[28px] bg-[#FFF8EE] justify-center overflow-hidden shadow-lg shadow-black/10 elevation-5">
        {/* Sliding Logo */}
        <Animated.View
          style={[logoStyle]}
          className="absolute left-0 w-[60px] h-[60px] rounded-[18px] bg-violet-600 justify-center items-center"
        >
          <Text className="text-white text-[34px] font-black">N</Text>
        </Animated.View>

        {/* Bouncing Letters */}
        <View className="flex-row justify-center items-center">
          {LETTERS.map((item, index) => {
            const style = useAnimatedStyle(() => ({
              transform: [
                {
                  translateY: letterAnimations[index].value,
                },
              ],
            }));

            return (
              <AnimatedText
                key={item.char}
                style={[style]}
                className={`text-[40px] font-black mx-1.5 ${item.color}`}
              >
                {item.char}
              </AnimatedText>
            );
          })}
        </View>
      </View>

      {/* Loading Text */}
      <Text className="mt-6 text-gray-400 text-sm font-medium tracking-widest uppercase">
        Loading
      </Text>
    </View>
  );
}