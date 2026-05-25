import { memo, useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { QualitySource, VideoQuality } from '@/types/video';
import { SafeAreaView } from 'react-native-safe-area-context';

type QualityModalProps = {
  visible: boolean;
  qualities: QualitySource[];
  selectedQuality: VideoQuality;
  onSelect: (quality: QualitySource) => void;
  onClose: () => void;
};

function QualityModal({
  visible,
  qualities,
  selectedQuality,
  onSelect,
  onClose,
}: QualityModalProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, { duration: 180 });
  }, [progress, visible]);

  const sheetStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 24 }],
  }));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.modalRoot}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
          <Animated.View style={[styles.sheet, sheetStyle]}>
            <Text style={styles.heading}>Video quality</Text>
            {qualities.map((quality) => {
              const selected = quality.label === selectedQuality;

              return (
                <Pressable
                  key={quality.label}
                  style={[styles.row, selected && styles.selectedRow]}
                  onPress={() => {
                    onSelect(quality);
                    onClose();
                  }}
                >
                  <Text style={[styles.label, selected && styles.selectedLabel]}>
                    {quality.label}
                  </Text>
                  {selected ? <Text style={styles.check}>Active</Text> : null}
                </Pressable>
              );
            })}
          </Animated.View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.52)',
  },
  sheet: {
    marginHorizontal: 18,
    marginBottom: 18,
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#121722',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heading: {
    color: '#aab2c5',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  row: {
    minHeight: 44,
    borderRadius: 7,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedRow: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  label: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  selectedLabel: {
    color: '#7dd3fc',
  },
  check: {
    color: '#7dd3fc',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default memo(QualityModal);
