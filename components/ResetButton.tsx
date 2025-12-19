import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ResetButtonProps {
  onPress: () => void;
}

export function ResetButton({ onPress }: ResetButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.text}>RESET</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
