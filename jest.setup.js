// Mock Expo winter runtime and structuredClone
global.__ExpoImportMetaRegistry = {
  register: jest.fn(),
};

if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Mock expo modules
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock Platform and AppState module more comprehensively
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  return {
    ...RN,
    Platform: {
      ...RN.Platform,
      select: jest.fn((obj) => obj.default || obj.native || obj.ios),
    },
    AppState: {
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      removeEventListener: jest.fn(),
      currentState: 'active',
    },
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    multiRemove: jest.fn(() => Promise.resolve()),
    getAllKeys: jest.fn(() => Promise.resolve([])),
    clear: jest.fn(() => Promise.resolve()),
  },
}));

// Mock RevenueCat Purchases
jest.mock('react-native-purchases', () => ({
  __esModule: true,
  default: {
    configure: jest.fn(() => Promise.resolve()),
    getCustomerInfo: jest.fn(() => Promise.resolve({
      entitlements: { active: {} },
      activeSubscriptions: [],
    })),
    getOfferings: jest.fn(() => Promise.resolve({
      current: null,
      all: {},
    })),
    purchasePackage: jest.fn(() => Promise.resolve({
      customerInfo: {
        entitlements: { active: {} },
        activeSubscriptions: [],
      },
    })),
    restorePurchases: jest.fn(() => Promise.resolve({
      entitlements: { active: {} },
      activeSubscriptions: [],
    })),
    setLogLevel: jest.fn(),
    addCustomerInfoUpdateListener: jest.fn(),
  },
  LOG_LEVEL: {
    VERBOSE: 'VERBOSE',
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
  },
}));

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
