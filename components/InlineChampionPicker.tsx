import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { CHAMPIONS, Champion, FREE_CHAMPION } from '../constants/champions';
import { usePurchase } from '../hooks/usePurchase';
import { LockIcon } from './LockIcon';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 4; // 4 cards per row with gaps

interface InlineChampionPickerProps {
  onSelect: (champion: Champion) => void;
  onClose: () => void;
  currentChampion: Champion;
}

export function InlineChampionPicker({
  onSelect,
  onClose,
  currentChampion,
}: InlineChampionPickerProps) {
  const { isPro } = usePurchase();

  const handleSelect = (champion: Champion) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(champion);
    // Only close if champion is not premium or user is pro
    // Otherwise, parent component will show upgrade modal
    if (!champion.isPremium || isPro) {
      onClose();
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  // Include free champion and all premium champions
  const allChampions = [FREE_CHAMPION, ...CHAMPIONS];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header - readable from top */}
        <View style={styles.header}>
          <View style={styles.headerSticker}>
            <Text style={styles.headerText}>pick champion</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Champion Grid */}
        <ScrollView
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        >
          {allChampions.map((champion) => {
            const isSelected = currentChampion.id === champion.id;
            const isLocked = champion.isPremium && !isPro;
            return (
              <TouchableOpacity
                key={champion.id}
                onPress={() => handleSelect(champion)}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.championCard,
                    { backgroundColor: champion.color },
                    isSelected && styles.selected,
                    isLocked && styles.lockedCard,
                  ]}
                >
                  {champion.faceImage && (
                    <Image
                      source={champion.faceImage}
                      style={[
                        styles.championImage,
                        isLocked && styles.lockedImage,
                      ]}
                      resizeMode="cover"
                    />
                  )}
                  {/* Top text - readable from bottom of phone */}
                  <View style={[styles.namePill, styles.topText]}>
                    <Text style={styles.championName} numberOfLines={1}>
                      {champion.name}
                    </Text>
                  </View>
                  {/* Bottom text - readable from top of phone (flipped) */}
                  <View style={styles.namePill}>
                    <Text style={styles.championName} numberOfLines={1}>
                      {champion.name}
                    </Text>
                  </View>
                  {isSelected && !isLocked && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                  {isLocked && (
                    <View style={styles.lockOverlay}>
                      <LockIcon size={32} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 100,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerFlipped: {
    transform: [{ rotate: '180deg' }],
    marginBottom: 0,
    marginTop: 8,
  },
  headerSticker: {
    backgroundColor: '#C8F56A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#000',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000',
    textTransform: 'lowercase',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 10,
  },
  championCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#000',
    padding: 6,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  championImage: {
    position: 'absolute',
    width: CARD_SIZE * 1.4,
    height: CARD_SIZE * 1.4,
    top: -CARD_SIZE * 0.2,
    left: -CARD_SIZE * 0.2,
    borderRadius: 14,
  },
  selected: {
    borderWidth: 4,
  },
  namePill: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'center',
  },
  championName: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  topText: {
    transform: [{ rotate: '180deg' }],
  },
  checkmark: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#C8F56A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  checkmarkText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lockedCard: {
    opacity: 0.7,
  },
  lockedImage: {
    opacity: 0.3,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 11,
  },
});
