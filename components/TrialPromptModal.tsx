import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

interface TrialPromptModalProps {
  visible: boolean;
  onStartTrial: () => void;
  onDismiss: () => void;
}

export function TrialPromptModal({
  visible,
  onStartTrial,
  onDismiss,
}: TrialPromptModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Unlock Premium Champions</Text>
          <Text style={styles.subtitle}>
            Try 1 week free, then $4.99/month
          </Text>

          <View style={styles.features}>
            <Text style={styles.feature}>✨ 12+ premium champions</Text>
            <Text style={styles.feature}>🎨 Unique themed backgrounds</Text>
            <Text style={styles.feature}>💾 Save your selections</Text>
            <Text style={styles.feature}>🚫 No ads, ever</Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={onStartTrial}>
            <Text style={styles.primaryButtonText}>Start Free Trial</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onDismiss}>
            <Text style={styles.secondaryButtonText}>
              Continue with Free Version
            </Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Auto-renews after trial. Cancel anytime.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 32,
    width: width * 0.85,
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 24,
    textAlign: 'center',
  },
  features: {
    width: '100%',
    marginBottom: 28,
  },
  feature: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 12,
    paddingLeft: 8,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  secondaryButtonText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 11,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
});
