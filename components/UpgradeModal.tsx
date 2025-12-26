import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { PurchasesPackage } from 'react-native-purchases';
import * as Haptics from 'expo-haptics';

interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchase: (pkg: PurchasesPackage) => Promise<boolean>;
  onRestore: () => Promise<boolean>;
  packages: PurchasesPackage[];
  isLoading: boolean;
  error: string | null;
}

export function UpgradeModal({
  visible,
  onClose,
  onPurchase,
  onRestore,
  packages,
  isLoading,
  error,
}: UpgradeModalProps) {
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePurchase = async (pkg: PurchasesPackage) => {
    setPurchasing(true);
    const success = await onPurchase(pkg);
    setPurchasing(false);
    if (success) {
      // Show success celebration
      setShowSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Close modal after celebration
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    const success = await onRestore();
    setRestoring(false);
    if (success) {
      Alert.alert('Success', 'Your purchases have been restored!');
      onClose();
    } else {
      Alert.alert('No Purchases Found', 'No previous purchases were found to restore.');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Upgrade to Pro</Text>
            <Text style={styles.subtitle}>
              Unlock all premium champions and features
            </Text>

            <View style={styles.features}>
              <Text style={styles.feature}>✨ 12+ premium champions</Text>
              <Text style={styles.feature}>🎨 Unique themed backgrounds</Text>
              <Text style={styles.feature}>💾 Persistent champion selection</Text>
              <Text style={styles.feature}>🚫 No ads, ever</Text>
              <Text style={styles.feature}>
                🔄 Works across all your devices
              </Text>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {isLoading ? (
              <ActivityIndicator size="large" color="#4CAF50" />
            ) : (
              <View style={styles.packagesContainer}>
                {packages.map((pkg, index) => {
                  const isLifetime = pkg.packageType === 'LIFETIME';
                  const isPopular = pkg.packageType === 'MONTHLY';

                  return (
                    <TouchableOpacity
                      key={pkg.identifier}
                      style={[
                        styles.packageButton,
                        isLifetime && styles.lifetimePackage,
                      ]}
                      onPress={() => handlePurchase(pkg)}
                      disabled={purchasing}
                    >
                      {isPopular && (
                        <View style={styles.popularBadge}>
                          <Text style={styles.popularText}>POPULAR</Text>
                        </View>
                      )}
                      {isLifetime && (
                        <View style={styles.bestValueBadge}>
                          <Text style={styles.bestValueText}>⭐ BEST VALUE</Text>
                        </View>
                      )}
                      <Text style={styles.packageTitle}>
                        {isLifetime ? 'Lifetime Access' : 'Monthly'}
                      </Text>
                      <Text style={styles.packagePrice}>
                        {pkg.product.priceString}
                      </Text>
                      <Text style={styles.packageDescription}>
                        {isLifetime
                          ? 'Pay once, own forever'
                          : 'Billed monthly, cancel anytime'}
                      </Text>
                      {pkg.product.introPrice && (
                        <Text style={styles.packageTrial}>
                          Try {pkg.product.introPrice.priceString} for{' '}
                          {pkg.product.introPrice.period}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {purchasing && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Processing...</Text>
              </View>
            )}

            {showSuccess && (
              <View style={styles.successOverlay}>
                <Text style={styles.successEmoji}>🎉</Text>
                <Text style={styles.successTitle}>Welcome to Pro!</Text>
                <Text style={styles.successMessage}>
                  All premium champions unlocked!
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestore}
              disabled={purchasing || restoring}
            >
              {restoring ? (
                <ActivityIndicator size="small" color="#4CAF50" />
              ) : (
                <Text style={styles.restoreButtonText}>Restore Purchases</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              disabled={purchasing || restoring}
            >
              <Text style={styles.closeButtonText}>Maybe Later</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Payment charged to App Store account. Subscription auto-renews
              unless cancelled 24 hours before period ends. Manage in Account
              Settings.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
    borderTopWidth: 2,
    borderColor: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 28,
    textAlign: 'center',
  },
  features: {
    width: '100%',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  feature: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 14,
    paddingLeft: 8,
  },
  errorContainer: {
    backgroundColor: '#4a1f1f',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d32f2f',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  errorIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  packagesContainer: {
    width: '100%',
    marginBottom: 24,
  },
  packageButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#444',
    position: 'relative',
  },
  lifetimePackage: {
    borderColor: '#FFD700',
    backgroundColor: '#2a2520',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  popularText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bestValueText: {
    color: '#000',
    fontSize: 11,
    fontWeight: 'bold',
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  packageDescription: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 4,
  },
  packageTrial: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  restoreButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginBottom: 12,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restoreButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  closeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
  },
  closeButtonText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 10,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 14,
  },
});
