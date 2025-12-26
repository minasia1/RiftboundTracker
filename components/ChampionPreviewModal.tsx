import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Champion } from '../constants/champions';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

interface ChampionPreviewModalProps {
  visible: boolean;
  champion: Champion | null;
  onClose: () => void;
  onUpgrade: () => void;
}

export function ChampionPreviewModal({
  visible,
  champion,
  onClose,
  onUpgrade,
}: ChampionPreviewModalProps) {
  useEffect(() => {
    if (visible && champion) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [visible, champion]);

  if (!champion) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.preview, { backgroundColor: champion.color }]}>
          {champion.image && (
            <Image
              source={champion.image}
              style={styles.championImage}
              resizeMode="cover"
            />
          )}

          <View style={styles.content}>
            <View style={styles.lockBadge}>
              <Text style={styles.lockEmoji}>🔒</Text>
              <Text style={styles.lockText}>PREMIUM</Text>
            </View>

            <Text style={styles.championName}>{champion.name}</Text>
            <Text style={styles.championTitle}>{champion.title}</Text>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.upgradeButton]}
                onPress={onUpgrade}
              >
                <Text style={styles.upgradeButtonText}>Unlock Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: width * 0.85,
    height: height * 0.7,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#000',
  },
  championImage: {
    width: '100%',
    height: '60%',
    opacity: 0.6,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginBottom: 16,
  },
  lockEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  lockText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  championName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  championTitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#666',
  },
  closeButtonText: {
    color: '#888',
    fontSize: 16,
  },
});
