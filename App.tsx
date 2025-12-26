import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { PointCounter } from './components/PointCounter';
import { SideMenu } from './components/SideMenu';
import { TrialPromptModal } from './components/TrialPromptModal';
import { UpgradeModal } from './components/UpgradeModal';
import { ChampionPreviewModal } from './components/ChampionPreviewModal';
import { Champion, DEFAULT_CHAMPION, CHAMPIONS, FREE_CHAMPION } from './constants/champions';
import { PurchaseProvider } from './contexts/PurchaseContext';
import { usePurchase } from './hooks/usePurchase';
import {
  incrementAppOpensCount,
  hasSeenTrialPrompt,
  setTrialPromptSeen,
  hasTrialDismissed,
  setTrialDismissed,
  getLastTopChampion,
  getLastBottomChampion,
  setLastTopChampion,
  setLastBottomChampion,
} from './utils/storage';

type PlayerSide = 'top' | 'bottom';

function AppContent() {
  const { isPro, isLoading, packages, purchasePackage, restorePurchases, error } = usePurchase();
  const [topScore, setTopScore] = useState(0);
  const [bottomScore, setBottomScore] = useState(0);
  const [topChampion, setTopChampion] = useState<Champion>(DEFAULT_CHAMPION);
  const [bottomChampion, setBottomChampion] = useState<Champion>(DEFAULT_CHAMPION);
  const [showTrialPrompt, setShowTrialPrompt] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [previewChampion, setPreviewChampion] = useState<Champion | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    // Save top champion selection when it changes
    if (topChampion.id !== DEFAULT_CHAMPION.id) {
      setLastTopChampion(topChampion.id);
    }
  }, [topChampion]);

  useEffect(() => {
    // Save bottom champion selection when it changes
    if (bottomChampion.id !== DEFAULT_CHAMPION.id) {
      setLastBottomChampion(bottomChampion.id);
    }
  }, [bottomChampion]);

  async function initializeApp() {
    // Restore previous champion selections
    const [lastTopId, lastBottomId] = await Promise.all([
      getLastTopChampion(),
      getLastBottomChampion(),
    ]);

    if (lastTopId) {
      const champion = CHAMPIONS.find((c) => c.id === lastTopId) || FREE_CHAMPION;
      setTopChampion(champion);
    }

    if (lastBottomId) {
      const champion = CHAMPIONS.find((c) => c.id === lastBottomId) || FREE_CHAMPION;
      setBottomChampion(champion);
    }

    // Handle trial prompt logic
    const appOpens = await incrementAppOpensCount();
    const seenPrompt = await hasSeenTrialPrompt();
    const dismissed = await hasTrialDismissed();

    // Show trial prompt on 2nd app open if not seen and not dismissed (improved timing for conversion)
    if (appOpens === 2 && !seenPrompt && !dismissed) {
      setShowTrialPrompt(true);
      await setTrialPromptSeen();
    }
    // Re-engagement: Show upgrade modal every 10 opens for dismissed users (if not pro)
    else if (dismissed && appOpens % 10 === 0 && !isPro) {
      setShowUpgradeModal(true);
    }
  }

  function handleStartTrial() {
    setShowTrialPrompt(false);
    setShowUpgradeModal(true);
  }

  async function handleDismissTrial() {
    setShowTrialPrompt(false);
    await setTrialDismissed();
  }

  function handleTopChampionChange(champion: Champion) {
    // If champion is premium and user is not pro, show preview modal
    if (champion.isPremium && !isPro) {
      setPreviewChampion(champion);
      setShowPreview(true);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTopChampion(champion);
  }

  function handleBottomChampionChange(champion: Champion) {
    // If champion is premium and user is not pro, show preview modal
    if (champion.isPremium && !isPro) {
      setPreviewChampion(champion);
      setShowPreview(true);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBottomChampion(champion);
  }

  function handlePreviewUpgrade() {
    setShowPreview(false);
    setShowUpgradeModal(true);
  }

  function handlePreviewClose() {
    setShowPreview(false);
    setPreviewChampion(null);
  }

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

  // Get display champion (free champion if not pro and selected premium)
  const displayTopChampion =
    topChampion.isPremium && !isPro ? FREE_CHAMPION : topChampion;
  const displayBottomChampion =
    bottomChampion.isPremium && !isPro ? FREE_CHAMPION : bottomChampion;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Top player (rotated 180°) */}
      <View style={styles.playerSection}>
        <PointCounter
          value={topScore}
          onIncrement={() => handleIncrement('top')}
          onDecrement={() => handleDecrement('top')}
          currentChampion={displayTopChampion}
          onChampionChange={handleTopChampionChange}
          flipped
        />
      </View>

      {/* Bottom player */}
      <View style={styles.playerSection}>
        <PointCounter
          value={bottomScore}
          onIncrement={() => handleIncrement('bottom')}
          onDecrement={() => handleDecrement('bottom')}
          currentChampion={displayBottomChampion}
          onChampionChange={handleBottomChampionChange}
        />
      </View>

      {/* Side menu */}
      <SideMenu
        onReset={handleReset}
        onUpgrade={() => setShowUpgradeModal(true)}
      />

      {/* Trial prompt modal */}
      <TrialPromptModal
        visible={showTrialPrompt}
        onStartTrial={handleStartTrial}
        onDismiss={handleDismissTrial}
      />

      {/* Champion preview modal */}
      <ChampionPreviewModal
        visible={showPreview}
        champion={previewChampion}
        onClose={handlePreviewClose}
        onUpgrade={handlePreviewUpgrade}
      />

      {/* Upgrade modal */}
      <UpgradeModal
        visible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onPurchase={purchasePackage}
        onRestore={restorePurchases}
        packages={packages}
        isLoading={isLoading}
        error={error}
      />
    </View>
  );
}

export default function App() {
  return (
    <PurchaseProvider>
      <AppContent />
    </PurchaseProvider>
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
