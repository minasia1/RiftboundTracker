import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground, ImageSourcePropType } from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Text as SvgText } from 'react-native-svg';

interface PointCounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  flipped?: boolean;
  backgroundColor: string;
  backgroundImage?: ImageSourcePropType;
}

// Component for outlined text with transparent fill using SVG
function OutlinedText({ value }: { value: number }) {
  const text = String(value);
  const fontSize = 140;
  const strokeWidth = 6;
  // Width needs to accommodate 1 or 2 digits properly
  const svgWidth = text.length === 1 ? 120 : 200;

  return (
    <View style={styles.outlinedTextContainer}>
      <Svg height={fontSize + 20} width={svgWidth}>
        {/* Stroke layer - drawn first, behind */}
        <SvgText
          x="50%"
          y={fontSize}
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="900"
          fill="none"
          stroke="#000"
          strokeWidth={strokeWidth * 2}
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          {text}
        </SvgText>
        {/* Fill layer - drawn on top */}
        <SvgText
          x="50%"
          y={fontSize}
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="900"
          fill="rgba(255, 255, 255, .9)"
          stroke="none"
        >
          {text}
        </SvgText>
      </Svg>
    </View>
  );
}

export function PointCounter({
  value,
  onIncrement,
  onDecrement,
  flipped = false,
  backgroundColor,
  backgroundImage,
}: PointCounterProps) {
  const [topPressed, setTopPressed] = useState(false);
  const [bottomPressed, setBottomPressed] = useState(false);

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
      {/* Top tap zone (increment) */}
      <Pressable
        style={[styles.tapZone, topPressed && styles.tapZonePressed]}
        onPress={handleIncrement}
        onPressIn={() => setTopPressed(true)}
        onPressOut={() => setTopPressed(false)}
      >
        <View style={[styles.arrowIndicator, topPressed && styles.arrowIndicatorPressed]}>
          <Text style={[styles.arrowText, topPressed && styles.arrowTextPressed]}>▲</Text>
        </View>
        {topPressed && <View style={styles.pressOverlay} />}
      </Pressable>

      {/* Score in the middle */}
      <View style={styles.scoreContainer}>
        <OutlinedText value={value} />
      </View>

      {/* Bottom tap zone (decrement) */}
      <Pressable
        style={[styles.tapZone, bottomPressed && styles.tapZonePressed]}
        onPress={handleDecrement}
        onPressIn={() => setBottomPressed(true)}
        onPressOut={() => setBottomPressed(false)}
      >
        <View style={[styles.arrowIndicator, bottomPressed && styles.arrowIndicatorPressed]}>
          <Text style={[styles.arrowText, bottomPressed && styles.arrowTextPressed]}>▼</Text>
        </View>
        {bottomPressed && <View style={styles.pressOverlay} />}
      </Pressable>
    </>
  );

  if (backgroundImage) {
    return (
      <View style={[styles.container, flipped && styles.flipped]}>
        <ImageBackground
          source={backgroundImage}
          style={[styles.imageBackground, { backgroundColor }]}
          imageStyle={styles.imageStyle}
          resizeMode="cover"
        >
          {content}
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }, flipped && styles.flipped]}>
      <View style={styles.contentWrapper}>
        {content}
      </View>
    </View>
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
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageStyle: {
    opacity: 1
  },
  flipped: {
    transform: [{ rotate: '180deg' }],
  },
  tapZone: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tapZonePressed: {
    // Visual feedback when pressed
  },
  pressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 0,
  },
  arrowIndicator: {
    opacity: 0.3,
    zIndex: 1,
  },
  arrowIndicatorPressed: {
    opacity: 1,
  },
  arrowText: {
    fontSize: 32,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  arrowTextPressed: {
    color: '#fff',
    fontSize: 38,
  },
  scoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  outlinedTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
