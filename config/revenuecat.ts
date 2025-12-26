/**
 * RevenueCat Configuration
 *
 * SECURITY: API keys are loaded from environment variables via app.config.js
 * Never hard-code API keys in source code!
 *
 * Setup:
 * 1. Add your keys to .env file (never commit to Git!)
 * 2. Keys are loaded via expo-constants at runtime
 * 3. See .env.example for required variables
 */

import Constants from 'expo-constants';

export const REVENUECAT_CONFIG = {
  // API Keys loaded from environment variables
  IOS_API_KEY: Constants.expoConfig?.extra?.revenueCatIosKey || '',
  ANDROID_API_KEY: Constants.expoConfig?.extra?.revenueCatAndroidKey || '',

  // Entitlement identifier - matches RevenueCat dashboard setup
  ENTITLEMENT_ID: 'pro',
};

/**
 * Product identifiers for in-app purchases
 * These are loaded from environment variables and should match:
 * - Apple App Store Connect product IDs (iOS)
 * - Google Play Console product IDs (Android)
 * - RevenueCat Dashboard product configuration
 */
export const PRODUCT_IDS = {
  MONTHLY_SUBSCRIPTION: Constants.expoConfig?.extra?.monthlyProductId || '',
  LIFETIME_PURCHASE: Constants.expoConfig?.extra?.lifetimeProductId || '',
};

/**
 * Setup Instructions:
 *
 * 1. ENVIRONMENT FILE (.env)
 *    - Copy .env.example to .env
 *    - Add your actual API keys and product IDs
 *    - NEVER commit .env to Git (already in .gitignore)
 *
 * 2. REVENUECAT DASHBOARD
 *    - Create account at https://www.revenuecat.com/
 *    - Create project and get API keys
 *    - Create 'pro' entitlement
 *    - Link your App Store/Play Store products
 *
 * 3. APP STORE CONNECT (iOS)
 *    - Create in-app purchase products
 *    - Auto-renewable subscription for monthly
 *    - Non-consumable for lifetime
 *
 * 4. GOOGLE PLAY CONSOLE (Android)
 *    - Create subscription product
 *    - Create in-app product for lifetime
 *
 * 5. TEST
 *    - Use sandbox accounts
 *    - iOS: Create sandbox testers in App Store Connect
 *    - Android: Use test accounts in Google Play Console
 */
