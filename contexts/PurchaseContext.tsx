import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases';
import { REVENUECAT_CONFIG } from '../config/revenuecat';

interface PurchaseContextType {
  isPro: boolean;
  isLoading: boolean;
  isPurchasing: boolean;
  packages: PurchasesPackage[];
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  error: string | null;
}

export const PurchaseContext = createContext<PurchaseContextType>({
  isPro: false,
  isLoading: true,
  isPurchasing: false,
  packages: [],
  purchasePackage: async () => false,
  restorePurchases: async () => false,
  error: null,
});

interface PurchaseProviderProps {
  children: ReactNode;
}

export function PurchaseProvider({ children }: PurchaseProviderProps) {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializePurchases();

    // Re-validate purchase status when app resumes
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  /**
   * Re-validate customer info when app becomes active
   * Prevents stale state exploitation
   */
  function handleAppStateChange(nextAppState: AppStateStatus) {
    if (nextAppState === 'active') {
      Purchases.getCustomerInfo()
        .then(updateCustomerInfo)
        .catch(err => console.error('Error refreshing customer info:', err));
    }
  }

  /**
   * Initialize RevenueCat SDK
   */
  async function initializePurchases() {
    try {
      // SECURITY: Only enable debug logging in development
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      } else {
        Purchases.setLogLevel(LOG_LEVEL.ERROR);
      }

      // Configure SDK with API keys
      const apiKey = Platform.select({
        ios: REVENUECAT_CONFIG.IOS_API_KEY,
        android: REVENUECAT_CONFIG.ANDROID_API_KEY,
      });

      if (!apiKey || apiKey.includes('YOUR_')) {
        console.warn(
          '⚠️ RevenueCat API keys not configured. Please update config/revenuecat.ts with your actual API keys.'
        );
        // For development: Allow app to run without API keys
        // User will be in free mode until keys are added
        setIsLoading(false);
        return;
      }

      // Initialize Purchases SDK
      await Purchases.configure({ apiKey });

      // Listen for customer info updates
      Purchases.addCustomerInfoUpdateListener((info) => {
        updateCustomerInfo(info);
      });

      // Get initial customer info
      const customerInfo = await Purchases.getCustomerInfo();
      updateCustomerInfo(customerInfo);

      // Fetch available packages
      await fetchPackages();

      setIsLoading(false);
    } catch (err) {
      console.error('Error initializing purchases:', err);
      setError('Failed to initialize purchases');
      setIsLoading(false);
    }
  }

  /**
   * Update customer info and pro status
   */
  function updateCustomerInfo(info: CustomerInfo) {
    const entitlement = info.entitlements.active[REVENUECAT_CONFIG.ENTITLEMENT_ID];
    const hasProEntitlement = typeof entitlement !== 'undefined';

    // Additional validation: Check if entitlement is actually active
    if (hasProEntitlement && entitlement) {
      const isValid = entitlement.isActive;
      setIsPro(isValid);
    } else {
      setIsPro(false);
    }
  }

  /**
   * Sanitize error messages for user display
   * SECURITY: Prevents leaking internal error details
   */
  function sanitizeError(err: any): string {
    // Map internal errors to user-friendly messages
    const errorMap: { [key: string]: string } = {
      NETWORK_ERROR: 'Please check your internet connection and try again.',
      INVALID_CREDENTIALS: 'Purchase validation failed. Please try again.',
      PRODUCT_NOT_AVAILABLE: 'This product is currently unavailable.',
      PAYMENT_CANCELLED: 'Payment was cancelled.',
      PAYMENT_INVALID: 'Payment method declined. Please check your payment details.',
      STORE_PROBLEM: 'App Store connection issue. Please try again later.',
      PURCHASE_NOT_ALLOWED: 'Purchases are not allowed on this device.',
      PURCHASE_INVALID: 'Invalid purchase. Please try again.',
    };

    // Log detailed error for debugging (only in development)
    if (__DEV__) {
      console.error('Purchase error details:', {
        code: err.code,
        message: err.message,
        underlyingErrorMessage: err.underlyingErrorMessage,
      });
    }

    // Return sanitized message
    return errorMap[err.code] || 'Something went wrong. Please try again later.';
  }

  /**
   * Fetch available packages
   */
  async function fetchPackages() {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current?.availablePackages) {
        setPackages(offerings.current.availablePackages);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
    }
  }

  /**
   * Purchase a package
   * SECURITY: Includes purchase locking to prevent race conditions
   */
  async function purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
    // Prevent concurrent purchases (SECURITY FIX)
    if (isPurchasing) {
      console.warn('Purchase already in progress');
      return false;
    }

    try {
      setIsPurchasing(true);
      setError(null);

      const { customerInfo } = await Purchases.purchasePackage(pkg);
      updateCustomerInfo(customerInfo);

      const hasProEntitlement =
        typeof customerInfo.entitlements.active[
          REVENUECAT_CONFIG.ENTITLEMENT_ID
        ] !== 'undefined';
      return hasProEntitlement;
    } catch (err: any) {
      if (!err.userCancelled) {
        // Use sanitized error message (SECURITY FIX)
        const userMessage = sanitizeError(err);
        setError(userMessage);
      }
      return false;
    } finally {
      // Always unlock purchases
      setIsPurchasing(false);
    }
  }

  /**
   * Restore previous purchases
   */
  async function restorePurchases(): Promise<boolean> {
    try {
      setError(null);
      const customerInfo = await Purchases.restorePurchases();
      updateCustomerInfo(customerInfo);

      const hasProEntitlement =
        typeof customerInfo.entitlements.active[
          REVENUECAT_CONFIG.ENTITLEMENT_ID
        ] !== 'undefined';
      return hasProEntitlement;
    } catch (err: any) {
      // Use sanitized error message (SECURITY FIX)
      const userMessage = sanitizeError(err);
      setError(userMessage);
      return false;
    }
  }

  return (
    <PurchaseContext.Provider
      value={{
        isPro,
        isLoading,
        isPurchasing,
        packages,
        purchasePackage,
        restorePurchases,
        error,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}
