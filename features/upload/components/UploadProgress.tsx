// UploadProgressScreen.tsx
import React, { useEffect, useMemo } from "react";
import { View, Text, Animated, StatusBar, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { UploadStatus } from "../types/upload.types";
import { useUpload } from "../hooks/useUpload";


// ─── Types ───────────────────────────────────────────────────────────
interface UploadUIState {
  progress: number;
  uploadedBytes: number;
  totalBytes: number;
  activeParts: number;
  completedParts: number;
  totalParts: number;
  status: UploadStatus;
  completedBytes?: number;
  inFlightBytes?: number;
}

// ─── Constants ───────────────────────────────────────────────────────
const STATUS_CONFIG: Record<UploadStatus, {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}> = {
  IDLE:         { label: "Ready",              icon: "cloud-outline",        color: "#6B7280" },
  INITIALIZING: { label: "Preparing upload",   icon: "cloud-upload-outline", color: "#3B82F6" },
  INITIATED:    { label: "Starting upload",    icon: "cloud-upload-outline", color: "#3B82F6" },
  UPLOADING:    { label: "Uploading video",    icon: "cloud-upload-outline", color: "#3B82F6" },
  PAUSED:       { label: "Upload paused",      icon: "pause-circle-outline", color: "#F59E0B" },
  COMPLETING:   { label: "Finalizing",         icon: "sync-outline",         color: "#8B5CF6" },
  COMPLETED:    { label: "Upload complete",    icon: "checkmark-circle",     color: "#22C55E" },
  FAILED:       { label: "Upload failed",      icon: "alert-circle",         color: "#EF4444" },
  CANCELLED:    { label: "Upload cancelled",   icon: "close-circle-outline", color: "#6B7280" },
};

const COLORS = {
  bg: "#0A0A0A",
  surface: "rgba(255,255,255,0.06)",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.60)",
  textMuted: "rgba(255,255,255,0.35)",
  progressTrack: "rgba(255,255,255,0.08)",
  completed: "#22C55E",
  inFlight: "#3B82F6",
  pending: "rgba(255,255,255,0.15)",
};

// ─── Utilities ───────────────────────────────────────────────────────
function formatBytes(bytes?: number): string {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return i === 0 ? `${Math.round(value)} ${units[i]}` : `${value.toFixed(1)} ${units[i]}`;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

// ─── Components ──────────────────────────────────────────────────────

function ChunkDots({
  completedParts,
  activeParts,
  totalParts,
}: {
  completedParts: number;
  activeParts: number;
  totalParts: number;
}) {
  if (totalParts <= 0) return null;

  const dots = [];
  const maxDots = Math.min(totalParts, 24);

  for (let i = 0; i < maxDots; i++) {
    const isCompleted = i < completedParts;
    const isActive = !isCompleted && i < completedParts + activeParts;

    dots.push(
      <View
        key={i}
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: isCompleted
            ? COLORS.completed
            : isActive
              ? COLORS.inFlight
              : COLORS.pending,
          margin: 2,
        }}
      />
    );
  }

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", maxWidth: 200 }}>
      {dots}
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────
export default function UploadProgressScreen() {
  const ui: UploadUIState = useSelector((state: RootState) => state.uploadUI);
  const { cancelUpload } = useUpload();

  //  // Auto-pause on background, resume on foreground
  // useAppStateUploadHandler({
  //   enabled: true,
  //   onPause: () => console.log("[AppState] Upload paused — app backgrounded"),
  //   onResume: () => console.log("[AppState] Upload resumed — app active"),
  // });
  const {
    progress,
    uploadedBytes,
    totalBytes,
    activeParts,
    completedParts,
    totalParts,
    status,
    completedBytes = 0,
    inFlightBytes = 0,
  } = ui;

  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.UPLOADING;
  const safeProgress = clamp(Number.isFinite(progress) ? progress : 0, 0, 100);

  const isFinalizing = status === "COMPLETING";
  const isFailed = status === "FAILED";
  const isDone = status === "COMPLETED";
  // FIX: Don't show "0% uploading" during INITIALIZING/INITIATED
  // Only show progress bar when actually UPLOADING or later
  const showProgress = status === "UPLOADING" || status === "PAUSED" || status === "COMPLETING";
  const isActive = status === "UPLOADING";
  const isPreparing = status === "INITIALIZING" || status === "INITIATED";
  const isCancellable = showProgress || isPreparing ;

  const remainingBytes = Math.max((totalBytes || 0) - (uploadedBytes || 0), 0);

  // ── FIX: useMemo for Animated.Value, not useRef().current ──
  const pulse = useMemo(() => new Animated.Value(1), []);
  const spin = useMemo(() => new Animated.Value(0), []);

  // Breathing pulse while actively uploading
  useEffect(() => {
    if (!isActive) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isActive, pulse]);

  // Spin while finalizing
  useEffect(() => {
    if (!isFinalizing) {
      spin.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1000, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [isFinalizing, spin]);

  // FIX: useMemo for interpolate, not during render with ref
  const spinDeg = useMemo(
    () => spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }),
    [spin]
  );

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.bg,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
        zIndex: 50,
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* ── Icon ── */}
      <Animated.View
        style={{
          transform: [
            { scale: isFinalizing ? 1 : pulse },
            { rotate: isFinalizing ? spinDeg : "0deg" },
          ],
        }}
      >
        <Ionicons name={config.icon} size={56} color={config.color} />
      </Animated.View>

      {/* ── Status Label ── */}
      <Text style={{ color: COLORS.textPrimary, fontSize: 18, fontWeight: "600", marginTop: 20 }}>
        {config.label}
      </Text>

      {/* ── Subtext for preparing state (no percentage shown) ── */}
      {isPreparing && (
        <Text style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 8 }}>
          Getting things ready...
        </Text>
      )}

      {/* ── Big Percentage (only when actually uploading) ── */}
      {showProgress && (
        <Text style={{ color: config.color, fontSize: 48, fontWeight: "800", marginTop: 8 }}>
          {Math.round(safeProgress)}%
        </Text>
      )}

      {/* ── Progress Bar (only when actually uploading) ── */}
      {showProgress && (
        <View style={{ width: "100%", marginTop: 24 }}>
          <View
            style={{
              height: 8,
              width: "100%",
              borderRadius: 4,
              backgroundColor: COLORS.progressTrack,
              overflow: "hidden",
              flexDirection: "row",
            }}
          >
            {/* Completed */}
            <View
              style={{
                width: `${totalBytes > 0 ? (completedBytes / totalBytes) * 100 : 0}%`,
                height: "100%",
                backgroundColor: COLORS.completed,
              }}
            />
            {/* In Flight */}
            <View
              style={{
                width: `${totalBytes > 0 ? (inFlightBytes / totalBytes) * 100 : 0}%`,
                height: "100%",
                backgroundColor: COLORS.inFlight,
                opacity: 0.7,
              }}
            />
          </View>
        </View>
      )}

      {/* ── Bytes Detail (only when actually uploading) ── */}
      {showProgress && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginTop: 12,
          }}
        >
          <Text style={{ color: COLORS.textSecondary, fontSize: 13 }}>
            {formatBytes(uploadedBytes)} uploaded
          </Text>
          <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>
            {formatBytes(remainingBytes)} left
          </Text>
        </View>
      )}

      {/* ── Chunk Info (only when actually uploading) ── */}
      {showProgress && totalParts > 0 && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: COLORS.surface,
          }}
        >
          <Ionicons name="layers-outline" size={14} color={COLORS.textMuted} />
          <Text style={{ color: COLORS.textSecondary, fontSize: 12, marginLeft: 6 }}>
            {completedParts}/{totalParts} chunks done
            {activeParts > 0 && (
              <Text style={{ color: COLORS.inFlight }}>
                {" · "}{activeParts} uploading
              </Text>
            )}
          </Text>
        </View>
      )}

      {/* ── Chunk Dots (only when actually uploading) ── */}
      {isActive && totalParts > 0 && (
        <View style={{ marginTop: 16 }}>
          <ChunkDots
            completedParts={completedParts}
            activeParts={activeParts}
            totalParts={totalParts}
          />
        </View>
      )}

      {/* ── Byte Breakdown (3 cards) ── */}
      {showProgress && (
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            gap: 8,
            marginTop: 24,
          }}
        >
          <StatCard
            label="Verified"
            value={formatBytes(completedBytes)}
            color={COLORS.completed}
          />
          <StatCard
            label="Uploading"
            value={formatBytes(inFlightBytes)}
            color={COLORS.inFlight}
          />
          <StatCard
            label="Pending"
            value={formatBytes(Math.max(0, (totalBytes || 0) - completedBytes - inFlightBytes))}
            color={COLORS.textMuted}
          />
        </View>
      )}

      {/* ── Cancel Button ── */}
      {isCancellable && (
        <TouchableOpacity
          onPress={cancelUpload}
          style={{
            marginTop: 24,
            paddingVertical: 12,
            paddingHorizontal: 28,
            borderRadius: 12,
            backgroundColor: "rgba(239,68,68,0.15)",
            borderWidth: 1,
            borderColor: "rgba(239,68,68,0.3)",
          }}
        >
          <Text style={{ color: "#EF4444", fontSize: 14, fontWeight: "600" }}>
            Cancel Upload
          </Text>
        </TouchableOpacity>
      )}

      {/* ── Failed State ── */}
      {isFailed && (
        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ color: COLORS.textSecondary, fontSize: 14, textAlign: "center" }}>
            Something went wrong. You can retry the upload.
          </Text>
        </View>
      )}

      {/* ── Success State ── */}
      {isDone && (
        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ color: COLORS.completed, fontSize: 14, fontWeight: "600" }}>
            {formatBytes(totalBytes)} uploaded successfully
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 12,
        backgroundColor: COLORS.surface,
      }}
    >
      <Text style={{ color, fontSize: 13, fontWeight: "700" }}>{value}</Text>
      <Text style={{ color: COLORS.textMuted, fontSize: 10, marginTop: 2 }}>{label}</Text>
    </View>
  );
}