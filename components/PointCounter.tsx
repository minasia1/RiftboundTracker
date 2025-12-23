import React, { useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground, ImageSourcePropType, TouchableOpacity, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Text as SvgText, Circle, Path } from 'react-native-svg';
import { InlineChampionPicker } from './InlineChampionPicker';
import { Champion } from '../constants/champions';

interface PointCounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  currentChampion: Champion;
  onChampionChange: (champion: Champion) => void;
  flipped?: boolean;
}

// Minimalist person icon using SVG
function PersonIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24">
      <Circle cx={12} cy={7} r={4} stroke="#000" strokeWidth={2.5} fill="none" />
      <Path d="M5 21c0-4.5 3.5-7.5 7-7.5s7 3 7 7.5" stroke="#000" strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </Svg>
  );
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
  currentChampion,
  onChampionChange,
  flipped = false,
}: PointCounterProps) {
  const [topPressed, setTopPressed] = useState(false);
  const [bottomPressed, setBottomPressed] = useState(false);
  const [showPersonIcon, setShowPersonIcon] = useState(false);
  const [showChampionPicker, setShowChampionPicker] = useState(false);
  const iconFadeAnim = useRef(new Animated.Value(0)).current;
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const backgroundColor = currentChampion.color;
  const backgroundImage = currentChampion.image;

  const handleIncrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onIncrement();
  };

  const handleDecrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDecrement();
  };

  const handleBackgroundTap = () => {
    // Single tap shows the person icon
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPersonIcon(true);
    Animated.timing(iconFadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Clear any existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    // Auto-hide after 3 seconds
    hideTimeoutRef.current = setTimeout(() => {
      hidePersonIcon();
    }, 3000);
  };

  const hidePersonIcon = () => {
    Animated.timing(iconFadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowPersonIcon(false);
    });
  };

  const handlePersonIconPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    hidePersonIcon();
    setShowChampionPicker(true);
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

      {/* Score in the middle - tap to show person icon */}
      <Pressable style={styles.scoreContainer} onPress={handleBackgroundTap}>
        <OutlinedText value={value} />
      </Pressable>

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

      {/* Person icon on right side */}
      {showPersonIcon && (
        <Animated.View style={[styles.personIconContainer, { opacity: iconFadeAnim }]}>
          <TouchableOpacity
            style={styles.personIconButton}
            onPress={handlePersonIconPress}
            activeOpacity={0.8}
          >
            <PersonIcon />
          </TouchableOpacity>
        </Animated.View>
      )}
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
        {showChampionPicker && (
          <InlineChampionPicker
            currentChampion={currentChampion}
            onSelect={onChampionChange}
            onClose={() => setShowChampionPicker(false)}
          />
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }, flipped && styles.flipped]}>
      <View style={styles.contentWrapper}>
        {content}
      </View>
      {showChampionPicker && (
        <InlineChampionPicker
          currentChampion={currentChampion}
          onSelect={onChampionChange}
          onClose={() => setShowChampionPicker(false)}
        />
      )}
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  outlinedTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  personIconContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -25,
    zIndex: 10,
  },
  personIconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
  },
});
