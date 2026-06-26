// UploadProgressScreen.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { UploadStatus } from "../types/upload.types";

const STATUS_LABEL: Record<UploadStatus, string> = {
  IDLE: "",
  INITIALIZING: "Preparing upload",
  INITIATED: "Starting upload",
  UPLOADING: "Uploading video",
  PAUSED: "Upload paused",
  COMPLETING: "Finalizing upload",
  COMPLETED: "Upload complete",
  FAILED: "Upload failed",
  CANCELLED: "Upload cancelled",
};

const STATUS_ICON: Record<UploadStatus, keyof typeof Ionicons.glyphMap> = {
  IDLE: "cloud-outline",
  INITIALIZING: "cloud-upload-outline",
  INITIATED: "cloud-upload-outline",
  UPLOADING: "cloud-upload-outline",
  PAUSED: "pause-circle-outline",
  COMPLETING: "sync-outline",
  COMPLETED: "checkmark-circle",
  FAILED: "alert-circle",
  CANCELLED: "close-circle-outline",
};

function formatBytes(bytes?: number): string {
  if (bytes == null || !Number.isFinite(bytes)) return "0 MB";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(1)} ${units[i]}`;
}

export default function UploadProgressScreen() {
  const { progress, uploadedBytes, totalBytes, activeParts, completedParts, totalParts, status } =
    useSelector((state: RootState) => state.uploadUI);

  const pulse = useRef(new Animated.Value(1)).current;
  const spin = useRef(new Animated.Value(0)).current;

  const safeProgress = Number.isFinite(progress) ? Math.max(0, Math.min(progress, 100)) : 0;
  const isFinalizing = status === "COMPLETING";
  const isFailed = status === "FAILED";
  const isDone = status === "COMPLETED";
  const isActive = !isDone && !isFailed;

  const label = STATUS_LABEL[status] ?? "Uploading";
  const icon = STATUS_ICON[status] ?? "cloud-upload-outline";
  const accentColor = isFailed ? "#EF4444" : isDone ? "#22C55E" : "#3B82F6";

  const remainingBytes =
    totalBytes != null && uploadedBytes != null ? Math.max(totalBytes - uploadedBytes, 0) : undefined;

  // Breathing pulse while actively uploading
  useEffect(() => {
    if (!isActive || isFinalizing) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isActive, isFinalizing]);

  // Spin while finalizing (no measurable progress at this stage)
  useEffect(() => {
    if (!isFinalizing) {
      spin.setValue(0);
      return;
    }
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 1100, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [isFinalizing]);

  const spinDeg = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <View className="absolute inset-0 z-50 bg-black items-center justify-center px-8">
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Icon */}
      <Animated.View
        style={{
          transform: [
            { scale: isFinalizing ? 1 : pulse },
            { rotate: isFinalizing ? spinDeg : "0deg" },
          ],
        }}
      >
        <Ionicons name={icon} size={56} color={accentColor} />
      </Animated.View>

      {/* Status label */}
      <Text className="font-semibold text-lg mt-5" style={{ color: "#fff" }}>
        {label}
      </Text>

      {/* Big percentage */}
      {isActive && !isFinalizing && (
        <Text className="font-bold text-5xl mt-2" style={{ color: accentColor }}>
          {Math.round(safeProgress)}%
        </Text>
      )}

      {isFinalizing && (
        <Text className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.55)" }}>
          Almost there...
        </Text>
      )}

      {/* Progress bar */}
      {isActive && (
        <View className="h-2 w-full rounded-full overflow-hidden mt-8" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
          <View
            className="h-full rounded-full"
            style={{
              width: isFinalizing ? "100%" : `${safeProgress}%`,
              backgroundColor: accentColor,
              opacity: isFinalizing ? 0.5 : 1,
            }}
          />
        </View>
      )}

      {/* Byte detail: uploaded / remaining */}
      {isActive && !isFinalizing && (
        <View className="flex-row justify-between w-full mt-3">
          <Text className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
            {formatBytes(uploadedBytes)} uploaded
          </Text>
          <Text className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
            {remainingBytes != null ? `${formatBytes(remainingBytes)} left` : ""}
          </Text>
        </View>
      )}

      {/* Part-level detail (chunks) */}
      {isActive && !isFinalizing && totalParts > 0 && (
        <View className="flex-row items-center mt-6 px-4 py-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
          <Ionicons name="layers-outline" size={14} color="rgba(255,255,255,0.55)" />
          <Text className="text-xs ml-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
            {completedParts}/{totalParts} chunks done · {activeParts} uploading now
          </Text>
        </View>
      )}

      {/* Failure detail */}
      {isFailed && (
        <Text className="text-sm mt-2 text-center" style={{ color: "rgba(255,255,255,0.6)" }}>
          Something went wrong. You can retry the upload.
        </Text>
      )}

      {/* Success detail */}
      {isDone && (
        <Text className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.6)" }}>
          {formatBytes(totalBytes)} uploaded successfully
        </Text>
      )}
    </View>
  );
}