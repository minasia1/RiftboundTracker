import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { CHAMPIONS, Champion } from '../constants/champions';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

interface ChampionPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (champion: Champion) => void;
  currentChampion: Champion;
}

export function ChampionPicker({
  visible,
  onClose,
  onSelect,
  currentChampion,
}: ChampionPickerProps) {
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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header sticker */}
          <View style={styles.headerSticker}>
            <Text style={styles.headerText}>pick your champion</Text>
          </View>

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
                    <Text style={styles.championName}>{champion.name}</Text>
                    <View style={styles.titlePill}>
                      <Text style={styles.championTitle}>{champion.title}</Text>
                    </View>
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

          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFF9E6',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    paddingTop: 30,
    maxHeight: '85%',
  },
  headerSticker: {
    backgroundColor: '#C8F56A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#000',
    transform: [{ rotate: '-2deg' }],
  },
  headerText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    textTransform: 'lowercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    paddingBottom: 10,
  },
  championCard: {
    width: CARD_WIDTH,
    padding: 16,
    borderRadius: 20,
    marginBottom: 4,
    borderWidth: 3,
    borderColor: '#000',
    minHeight: 100,
  },
  selected: {
    borderWidth: 4,
    borderColor: '#000',
  },
  championName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  titlePill: {
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  championTitle: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  checkmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C8F56A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  checkmarkText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#000',
    borderRadius: 30,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
});
