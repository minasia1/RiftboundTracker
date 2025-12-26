import { useContext } from 'react';
import { PurchaseContext } from '../contexts/PurchaseContext';

/**
 * Hook to access purchase state and methods
 *
 * Usage:
 * const { isPro, purchasePackage, restorePurchases } = usePurchase();
 */
export function usePurchase() {
  const context = useContext(PurchaseContext);

  if (!context) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }

  return context;
}
