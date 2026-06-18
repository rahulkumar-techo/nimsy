/**
 * Nimsy Video Player — NativeWind v4
 */

import { View, StyleSheet, StatusBar, BackHandler, TouchableOpacity, Text, Platform } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface NimsyVideoPlayerProps {
    uri: string;
    title?: string;
    onBack?: () => void;
    autoPlay?: boolean;
    loop?: boolean;
}

export default function NimsyVideoPlayer({
    uri,
    title = "",
    onBack,
    autoPlay = true,
    loop = false,
}: NimsyVideoPlayerProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(true);
    const videoRef = useRef<VideoView>(null);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const insets = useSafeAreaInsets();

    // ─── Player ───────────────────────────────────────────────
    const player = useVideoPlayer(uri, (p) => {
        p.loop = loop;
        p.staysActiveInBackground = true;
        if (autoPlay) p.play();
    });

    // ─── PiP readiness ────────────────────────────────────────
    useEffect(() => {
        const sub = player.addListener("statusChange", ({ status }) => {
            if (status === "readyToPlay") setIsReady(true);
        });
        return () => sub.remove();
    }, [player]);

    // ─── Status bar ───────────────────────────────────────────
    useEffect(() => {
        StatusBar.setHidden(isFullscreen, "fade");
    }, [isFullscreen]);

    useEffect(() => {
        return () => StatusBar.setHidden(false, "fade");
    }, []);

    // ─── Android back ─────────────────────────────────────────
    useEffect(() => {
        if (!isFullscreen) return;
        const handler = BackHandler.addEventListener("hardwareBackPress", () => {
            videoRef.current?.exitFullscreen();
            return true;
        });
        return () => handler.remove();
    }, [isFullscreen]);

    // ─── Auto-hide overlay ────────────────────────────────────
    const resetHideTimer = () => {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        setControlsVisible(true);
        hideTimer.current = setTimeout(() => setControlsVisible(false), 3500);
    };

    useEffect(() => {
        resetHideTimer();
        return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
    }, [isFullscreen]);

    const handleOverlayPress = () => {
        if (controlsVisible) {
            setControlsVisible(false);
            if (hideTimer.current) clearTimeout(hideTimer.current);
        } else {
            resetHideTimer();
        }
    };

    // ─── Back handler ─────────────────────────────────────────
    const handleBack = () => {
        if (isFullscreen) videoRef.current?.exitFullscreen();
        else onBack?.();
    };

    const showOverlay = !isFullscreen || controlsVisible;

    const topOffset = isFullscreen ? Math.max(insets.top, Platform.OS === "android" ? 12 : 16) : 12;
    const leftOffset = isFullscreen ? Math.max(insets.left, 16) : 12;
    const rightOffset = isFullscreen ? Math.max(insets.right, 16) : 12;

    return (
        <View className="w-full bg-black" style={{ aspectRatio: 16 / 9 }}>

            {/* Video */}
            <VideoView
                ref={videoRef}
                player={player}
                style={StyleSheet.absoluteFill}
                nativeControls
                contentFit="contain"
                fullscreenOptions={{ enable: true, orientation: "landscape", autoExitOnRotate: true }}
                allowsPictureInPicture={isReady}
                startsPictureInPictureAutomatically={isReady}
                allowsVideoFrameAnalysis
                onFullscreenEnter={() => { setIsFullscreen(true); resetHideTimer(); }}
                onFullscreenExit={() => setIsFullscreen(false)}
                buttonOptions={{
                    showSettings: false, // Hides the settings gear icon completely on Android
                    showSubtitles:true,
                    showBottomBar:true
                }}

            />

            

            {/* Fullscreen tap-to-toggle overlay */}
            {isFullscreen && (
                <TouchableOpacity
                    className="absolute inset-0"
                    activeOpacity={1}
                    onPress={handleOverlayPress}
                />
            )}

            {/* Top bar: back + title */}
            {showOverlay && (
                <View
                    className="absolute flex-row items-center gap-x-2"
                    style={{ top: topOffset, left: leftOffset, right: rightOffset }}
                    pointerEvents="box-none"
                >
                    <TouchableOpacity
                        className="w-9 h-9 rounded-full bg-black/50 items-center justify-center"
                        onPress={handleBack}
                        activeOpacity={0.75}
                    >
                        <Ionicons
                            name={isFullscreen ? "chevron-down" : "chevron-back"}
                            size={22}
                            color="#fff"
                        />
                    </TouchableOpacity>

                    {!!title && (
                        <Text
                            className="flex-1 text-white text-sm font-semibold"
                            style={{
                                textShadowColor: "rgba(0,0,0,0.8)",
                                textShadowOffset: { width: 0, height: 1 },
                                textShadowRadius: 4,
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {title}
                        </Text>
                    )}
                </View>
            )}
        </View>
    );
}