import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { CHAMPIONS, Champion } from '../constants/champions';

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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Choose Champion</Text>
          <ScrollView contentContainerStyle={styles.grid}>
            {CHAMPIONS.map((champion) => (
              <TouchableOpacity
                key={champion.id}
                style={[
                  styles.championCard,
                  { backgroundColor: champion.color },
                  currentChampion.id === champion.id && styles.selected,
                ]}
                onPress={() => {
                  onSelect(champion);
                  onClose();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.championName}>{champion.name}</Text>
                <Text style={styles.championTitle}>{champion.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  championCard: {
    width: '47%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 4,
  },
  selected: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  championName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  championTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});
