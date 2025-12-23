import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { CHAMPIONS, Champion } from '../constants/champions';

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
  const handleSelect = (champion: Champion) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(champion);
    onClose();
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

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
          {CHAMPIONS.map((champion) => {
            const isSelected = currentChampion.id === champion.id;
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
                  ]}
                >
                  {/* Top text - readable from bottom of phone */}
                  <Text style={[styles.championName, styles.topText]} numberOfLines={1}>
                    {champion.name}
                  </Text>
                  {/* Bottom text - readable from top of phone (flipped) */}
                  <Text style={[styles.championName, styles.bottomText]} numberOfLines={1}>
                    {champion.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
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
  },
  selected: {
    borderWidth: 4,
  },
  championName: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
  },
  topText: {
    transform: [{ rotate: '180deg' }],
  },
  bottomText: {
    // Normal orientation
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
});
