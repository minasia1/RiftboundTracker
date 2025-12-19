import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, ImageSourcePropType } from 'react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface PointCounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  flipped?: boolean;
  onBackgroundPress: () => void;
  backgroundColor: string;
  backgroundImage?: ImageSourcePropType;
}

// Component for outlined text effect
function OutlinedText({ value }: { value: number }) {
  const text = String(value);
  const outlineWidth = 4;

  return (
    <View style={styles.outlinedTextContainer}>
      {/* Black outline layers */}
      <Text style={[styles.valueText, styles.outline, { top: -outlineWidth }]}>{text}</Text>
      <Text style={[styles.valueText, styles.outline, { top: outlineWidth }]}>{text}</Text>
      <Text style={[styles.valueText, styles.outline, { left: -outlineWidth }]}>{text}</Text>
      <Text style={[styles.valueText, styles.outline, { left: outlineWidth }]}>{text}</Text>
      <Text style={[styles.valueText, styles.outline, { top: -outlineWidth, left: -outlineWidth }]}>{text}</Text>
      <Text style={[styles.valueText, styles.outline, { top: -outlineWidth, left: outlineWidth }]}>{text}</Text>
      <Text style={[styles.valueText, styles.outline, { top: outlineWidth, left: -outlineWidth }]}>{text}</Text>
      <Text style={[styles.valueText, styles.outline, { top: outlineWidth, left: outlineWidth }]}>{text}</Text>
      {/* White text on top */}
      <Text style={[styles.valueText, styles.mainText]}>{text}</Text>
    </View>
  );
}

export function PointCounter({
  value,
  onIncrement,
  onDecrement,
  flipped = false,
  onBackgroundPress,
  backgroundColor,
  backgroundImage,
}: PointCounterProps) {
  const handleIncrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onIncrement();
  };

  const handleDecrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDecrement();
  };

  const content = (
    <>
      {/* Up arrow (increment) at top */}
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={handleIncrement}
        activeOpacity={0.8}
      >
        <View style={styles.arrowPill}>
          <Text style={styles.arrowText}>+</Text>
        </View>
      </TouchableOpacity>

      {/* Score in the middle - white text with black outline */}
      <View style={styles.scoreContainer}>
        <OutlinedText value={value} />
      </View>

      {/* Down arrow (decrement) at bottom */}
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={handleDecrement}
        activeOpacity={0.8}
      >
        <View style={styles.arrowPill}>
          <Text style={styles.arrowText}>−</Text>
        </View>
      </TouchableOpacity>
    </>
  );

  if (backgroundImage) {
    return (
      <TouchableOpacity
        style={[styles.container, flipped && styles.flipped]}
        onPress={onBackgroundPress}
        activeOpacity={1}
      >
        <ImageBackground
          source={backgroundImage}
          style={[styles.imageBackground, { backgroundColor }]}
          imageStyle={styles.imageStyle}
          resizeMode="cover"
        >
          {content}
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }, flipped && styles.flipped]}
      onPress={onBackgroundPress}
      activeOpacity={1}
    >
      <View style={styles.contentWrapper}>
        {content}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  imageStyle: {
    opacity: 0.95,
  },
  flipped: {
    transform: [{ rotate: '180deg' }],
  },
  arrowButton: {
    padding: 8,
  },
  arrowPill: {
    width: width * 0.5,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 28,
  },
  arrowText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  scoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlinedTextContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 140,
    fontWeight: '900',
    includeFontPadding: false,
  },
  outline: {
    position: 'absolute',
    color: '#000',
  },
  mainText: {
    color: '#fff',
  },
});
