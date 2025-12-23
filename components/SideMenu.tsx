import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';

const MENU_WIDTH = 200;

interface SideMenuProps {
  onReset: () => void;
}

export function SideMenu({
  onReset,
}: SideMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(MENU_WIDTH));

  const toggleMenu = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const toValue = isOpen ? MENU_WIDTH : 0;
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
    setIsOpen(!isOpen);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onReset();
  };

  return (
    <>
      {/* Menu toggle button */}
      <TouchableOpacity
        style={[styles.toggleButton, isOpen && styles.toggleButtonOpen]}
        onPress={toggleMenu}
        activeOpacity={0.8}
      >
        <Text style={styles.toggleIcon}>{isOpen ? '✕' : '☰'}</Text>
      </TouchableOpacity>

      {/* Slide-out menu */}
      <Animated.View
        style={[
          styles.menuContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.menuContent}>
          <Text style={styles.menuTitle}>menu</Text>

          {/* Reset button */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
              activeOpacity={0.8}
            >
              <Text style={styles.resetButtonText}>↻ reset scores</Text>
            </TouchableOpacity>
          </View>

          {/* Hint text */}
          <Text style={styles.hintText}>
            tap score to change champion
          </Text>
        </View>
      </Animated.View>

      {/* Overlay when menu is open */}
      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -25,
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    borderWidth: 3,
    borderColor: '#000',
  },
  toggleButtonOpen: {
    right: MENU_WIDTH + 16,
  },
  toggleIcon: {
    color: '#000',
    fontSize: 22,
    fontWeight: '700',
  },
  menuContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: '#FFF9E6',
    zIndex: 99,
    borderLeftWidth: 3,
    borderLeftColor: '#000',
  },
  menuContent: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 16,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
    marginBottom: 30,
    textTransform: 'lowercase',
  },
  section: {
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: '#FF8FAB',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  resetButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: MENU_WIDTH,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 98,
  },
  hintText: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.4)',
    textAlign: 'center',
    marginTop: 20,
    textTransform: 'lowercase',
  },
});
