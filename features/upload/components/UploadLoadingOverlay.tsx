// UploadLoadingOverlay.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Animated } from "react-native";
import UploadProgress from "./UploadProgress";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export function UploadLoadingOverlay() {
  const status = useSelector((state: RootState) => state.uploadUI.status);
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const [mounted, setMounted] = useState(false);

  const shouldShow = status !== "IDLE" && status !== "CANCELLED";

  useEffect(() => {
    if (shouldShow) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 8, tension: 80 }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(fade, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.9, duration: 180, useNativeDriver: true }),
      ]).start(() => setMounted(false));
    }
  }, [shouldShow]);

  // Auto-dismiss a short while after success/failure instead of staying open forever
  useEffect(() => {
    if (status === "COMPLETED" || status === "FAILED") {
      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fade, { toValue: 0, duration: 180, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.9, duration: 180, useNativeDriver: true }),
        ]).start(() => setMounted(false));
      }, 1600);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  if (!mounted) return null;

  return (
    <Animated.View
      pointerEvents="auto"
      style={{ opacity: fade }}
      className="absolute inset-0 z-50 items-center justify-center bg-black/70"
    >
      <Animated.View
        style={{ opacity: fade, transform: [{ scale }] }}
        className="items-center justify-center rounded-3xl px-8 py-9"
      >
        <UploadProgress />
      </Animated.View>
    </Animated.View>
  );
}