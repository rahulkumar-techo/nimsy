/**
 * VideoActionsSheet
 * Reusable bottom action sheet (dropdown menu) for video cards.
 * Options: Edit, Save to Device, Share, Delete.
 *
 * Location: src/components/profile/VideoActionsSheet.tsx
 */

import React from "react";
import { View, Text, Modal, Pressable } from "react-native";
import { Pencil, Download, Share2, Trash2 } from "lucide-react-native";

export interface VideoActionsSheetProps {
  visible: boolean;
  onClose: () => void;

  onEdit?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
}

export default function VideoActionsSheet({
  visible,
  onClose,
  onEdit,
  onDownload,
  onShare,
  onDelete,
}: VideoActionsSheetProps) {
  const handle = (action?: () => void) => {
    onClose();
    action?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/40" onPress={onClose}>
        <View className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white px-4 pb-8 pt-4">
          <View className="mb-5 h-1.5 w-12 self-center rounded-full bg-zinc-300" />

          <ActionItem
            icon={<Pencil size={20} />}
            title="Edit Video"
            onPress={() => handle(onEdit)}
          />

          <ActionItem
            icon={<Download size={20} />}
            title="Save To Device"
            onPress={() => handle(onDownload)}
          />

          <ActionItem
            icon={<Share2 size={20} />}
            title="Share Video"
            onPress={() => handle(onShare)}
          />

          <ActionItem
            icon={<Trash2 size={20} color="#ef4444" />}
            title="Delete Video"
            danger
            onPress={() => handle(onDelete)}
          />
        </View>
      </Pressable>
    </Modal>
  );
}

function ActionItem({
  icon,
  title,
  danger,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  danger?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center py-4">
      {icon}
      <Text
        className={`ml-3 text-base font-medium ${
          danger ? "text-red-500" : "text-zinc-900"
        }`}
      >
        {title}
      </Text>
    </Pressable>
  );
}