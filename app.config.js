module.exports = {
  expo: {
    name: "RiftboundTracker",
    slug: "RiftboundTracker",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.RiftboundTracker"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      [
        "react-native-purchases",
        {
          iosUseStoreKit2: true
        }
      ]
    ],
    extra: {
      revenueCatIosKey: process.env.REVENUECAT_IOS_API_KEY,
      revenueCatAndroidKey: process.env.REVENUECAT_ANDROID_API_KEY,
      monthlyProductId: process.env.REVENUECAT_MONTHLY_PRODUCT_ID,
      lifetimeProductId: process.env.REVENUECAT_LIFETIME_PRODUCT_ID,
    }
  }
};
