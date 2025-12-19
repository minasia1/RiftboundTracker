import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PointCounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  flipped?: boolean;
  onBackgroundPress: () => void;
}

export function PointCounter({
  value,
  onIncrement,
  onDecrement,
  flipped = false,
  onBackgroundPress,
}: PointCounterProps) {
  return (
    <TouchableOpacity
      style={[styles.container, flipped && styles.flipped]}
      onPress={onBackgroundPress}
      activeOpacity={1}
    >
      <View style={styles.counterRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={onDecrement}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>

        <Text style={styles.valueText}>{value.toString().padStart(2, '0')}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={onIncrement}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipped: {
    transform: [{ rotate: '180deg' }],
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  valueText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#fff',
    minWidth: 180,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});
