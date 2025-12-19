import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PointCounter } from './components/PointCounter';
import { ChampionPicker } from './components/ChampionPicker';
import { ResetButton } from './components/ResetButton';
import { Champion, DEFAULT_CHAMPION } from './constants/champions';

type PlayerSide = 'top' | 'bottom';

export default function App() {
  const [topScore, setTopScore] = useState(0);
  const [bottomScore, setBottomScore] = useState(0);
  const [topChampion, setTopChampion] = useState<Champion>(DEFAULT_CHAMPION);
  const [bottomChampion, setBottomChampion] = useState<Champion>(DEFAULT_CHAMPION);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [activeSide, setActiveSide] = useState<PlayerSide>('top');

  const handleIncrement = (side: PlayerSide) => {
    if (side === 'top') {
      setTopScore((prev) => Math.min(prev + 1, 99));
    } else {
      setBottomScore((prev) => Math.min(prev + 1, 99));
    }
  };

  const handleDecrement = (side: PlayerSide) => {
    if (side === 'top') {
      setTopScore((prev) => Math.max(prev - 1, 0));
    } else {
      setBottomScore((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleReset = () => {
    setTopScore(0);
    setBottomScore(0);
  };

  const handleBackgroundPress = (side: PlayerSide) => {
    setActiveSide(side);
    setPickerVisible(true);
  };

  const handleChampionSelect = (champion: Champion) => {
    if (activeSide === 'top') {
      setTopChampion(champion);
    } else {
      setBottomChampion(champion);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Top player (rotated 180°) */}
      <View style={styles.playerSection}>
        <PointCounter
          value={topScore}
          onIncrement={() => handleIncrement('top')}
          onDecrement={() => handleDecrement('top')}
          flipped
          onBackgroundPress={() => handleBackgroundPress('top')}
          backgroundColor={topChampion.color}
          backgroundImage={topChampion.image}
        />
      </View>

      {/* Reset button in the middle */}
      <View style={styles.resetContainer}>
        <ResetButton onPress={handleReset} />
      </View>

      {/* Bottom player */}
      <View style={styles.playerSection}>
        <PointCounter
          value={bottomScore}
          onIncrement={() => handleIncrement('bottom')}
          onDecrement={() => handleDecrement('bottom')}
          onBackgroundPress={() => handleBackgroundPress('bottom')}
          backgroundColor={bottomChampion.color}
          backgroundImage={bottomChampion.image}
        />
      </View>

      {/* Champion picker modal */}
      <ChampionPicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={handleChampionSelect}
        currentChampion={activeSide === 'top' ? topChampion : bottomChampion}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  playerSection: {
    flex: 1,
  },
  resetContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'box-none',
    zIndex: 10,
  },
});
