/**
 * Full screen upload overlay
 */

import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { UploadProgressCircle } from "./UploadProgressCircle";

interface Props {
  visible: boolean;
  progress: number;
  message: string;
}

export default function UploadOverlay({
  visible,
  progress,
  message,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <UploadProgressCircle progress={progress} />

          <Text style={styles.title}>
            Uploading Video
          </Text>

          <Text style={styles.message}>
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    alignItems: "center",
    gap: 24,
    paddingHorizontal: 32,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },

  message: {
    color: "#A1A1AA",
    textAlign: "center",
    fontSize: 15,
  },
});