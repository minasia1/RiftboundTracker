import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PointCounter } from './components/PointCounter';
import { SideMenu } from './components/SideMenu';
import { Champion, DEFAULT_CHAMPION } from './constants/champions';

type PlayerSide = 'top' | 'bottom';

export default function App() {
  const [topScore, setTopScore] = useState(0);
  const [bottomScore, setBottomScore] = useState(0);
  const [topChampion, setTopChampion] = useState<Champion>(DEFAULT_CHAMPION);
  const [bottomChampion, setBottomChampion] = useState<Champion>(DEFAULT_CHAMPION);

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

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Top player (rotated 180°) */}
      <View style={styles.playerSection}>
        <PointCounter
          value={topScore}
          onIncrement={() => handleIncrement('top')}
          onDecrement={() => handleDecrement('top')}
          currentChampion={topChampion}
          onChampionChange={setTopChampion}
          flipped
        />
      </View>

      {/* Bottom player */}
      <View style={styles.playerSection}>
        <PointCounter
          value={bottomScore}
          onIncrement={() => handleIncrement('bottom')}
          onDecrement={() => handleDecrement('bottom')}
          currentChampion={bottomChampion}
          onChampionChange={setBottomChampion}
        />
      </View>

      {/* Side menu */}
      <SideMenu onReset={handleReset} />
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
});
