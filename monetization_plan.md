# Monetization Implementation Plan

## Overview
Add RevenueCat IAP with:
- Trial prompt after 3 app opens
- Free mode: single flat color (#666)
- Premium: $4.99/month or $20 lifetime
- 1-week free trial
- Persist champion selections

## User Flow
```
App Launch 1-2 → Track opens, continue
App Launch 3 → Show trial modal
  ├─ Dismiss → Lock to free mode (FREE_CHAMPION only)
  └─ Start Trial → Navigate to paywall → Purchase → Unlock all champions
```

## Dependencies
```bash
npx expo install react-native-purchases @react-native-async-storage/async-storage
eas build --platform all --profile development  # Required for RevenueCat
```

## RevenueCat Setup (Before Coding)
1. Create RevenueCat account, add iOS + Android apps
2. Create entitlement: `pro_access`
3. Create products:
   - `monthly_499`: $4.99/month (1-week trial)
   - `lifetime_2000`: $20 lifetime
4. Map both to `pro_access` entitlement
5. Configure in App Store Connect + Google Play Console
6. Get API keys (iOS + Android)

## AsyncStorage Schema
```typescript
STORAGE_KEYS = {
  APP_OPENS_COUNT: 'app_opens_count',              // number
  HAS_SEEN_TRIAL_PROMPT: 'has_seen_trial_prompt', // boolean
  TRIAL_DISMISSED: 'trial_dismissed',             // boolean
  LAST_TOP_CHAMPION_ID: 'last_top_champion_id',   // string
  LAST_BOTTOM_CHAMPION_ID: 'last_bottom_champion_id', // string
}
```

## Implementation Steps

### 1. Storage Foundation
**File: `/utils/storage.ts` (NEW)**
- Exports: getAppOpens, incrementAppOpens, hasSeenTrialPrompt, markTrialPromptSeen, getLastChampion, saveLastChampion, isTrialDismissed, markTrialDismissed
- Simple get/set wrappers with JSON parsing

### 2. Purchase Context
**File: `/contexts/PurchaseContext.tsx` (NEW)**
- Initialize RevenueCat with API key
- State: isPro (from entitlement check), isLoading, offerings
- Methods: purchasePackage, restorePurchases, checkProStatus
- CustomerInfoUpdateListener for real-time updates

**File: `/hooks/usePurchase.ts` (NEW)**
- Returns: { isPro, isLoading, offerings, purchasePackage, restorePurchases }

**File: `/config/revenuecat.ts` (NEW)**
```typescript
export const REVENUECAT_API_KEY = Platform.select({
  ios: 'appl_YOUR_IOS_API_KEY',
  android: 'goog_YOUR_ANDROID_API_KEY',
});
```

### 3. Champion Lock Logic
**File: `/constants/champions.ts` (MODIFY)**
```typescript
export interface Champion {
  // ... existing fields
  isPremium: boolean;  // NEW
}

// Mark all champions as premium
export const CHAMPIONS: Champion[] = [
  { id: 'kaisa', ..., isPremium: true },
  // ... all isPremium: true
];

// NEW: Free fallback
export const FREE_CHAMPION: Champion = {
  id: 'free_default',
  name: 'Default',
  title: 'Free',
  color: '#666666',
  isPremium: false,
};

export const DEFAULT_CHAMPION = FREE_CHAMPION;
```

### 4. UI Components
**File: `/components/TrialPromptModal.tsx` (NEW)**
- Props: visible, onDismiss, onStartTrial
- Design: "Unlock All Champions", show pricing, "Start Free Trial" button + "Maybe Later"
- On dismiss → markTrialPromptSeen + markTrialDismissed (lock to free)

**File: `/components/UpgradeModal.tsx` (NEW)**
- Props: visible, onClose, onUpgrade
- Shown when tapping locked champion
- "Upgrade to Pro" button

**File: `/components/LockIcon.tsx` (NEW)**
- Simple lock overlay (🔒 or SVG)

**File: `/components/PaywallScreen.tsx` (NEW)**
- Full screen showing offerings
- Display $4.99/month (with "1 WEEK FREE" badge) + $20 lifetime
- Purchase buttons calling purchasePackage

### 5. Modify Existing Files

**File: `/App.tsx` (MODIFY)**
```typescript
// Wrap with PurchaseProvider
// Track app opens in useEffect
// Show TrialPromptModal after 3 opens (if not seen)
// Restore last champions from AsyncStorage

useEffect(() => {
  const init = async () => {
    await incrementAppOpens();
    const opens = await getAppOpens();
    const hasSeen = await hasSeenTrialPrompt();
    if (opens >= 3 && !hasSeen) setShowTrialModal(true);

    // Restore champions
    const topId = await getLastChampion('top');
    const bottomId = await getLastChampion('bottom');
    // Set champions (with free fallback if premium && !isPro)
  };
  init();
}, []);

// Save champion on change
const handleTopChampionChange = async (champion: Champion) => {
  setTopChampion(champion);
  await saveLastChampion('top', champion.id);
};
```

**File: `/components/PointCounter.tsx` (MODIFY)**
```typescript
import { usePurchase } from '../hooks/usePurchase';
import { FREE_CHAMPION } from '../constants/champions';

export function PointCounter({ currentChampion, ... }) {
  const { isPro } = usePurchase();

  // If not pro and champion is premium, show free default
  const displayChampion = (!isPro && currentChampion.isPremium)
    ? FREE_CHAMPION
    : currentChampion;

  // Use displayChampion.color and displayChampion.image
}
```

**File: `/components/InlineChampionPicker.tsx` (MODIFY)**
```typescript
import { usePurchase } from '../hooks/usePurchase';
import { LockIcon } from './LockIcon';

export function InlineChampionPicker({ ... }) {
  const { isPro } = usePurchase();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleSelect = (champion: Champion) => {
    if (champion.isPremium && !isPro) {
      setShowUpgradeModal(true);  // Show upgrade instead
      return;
    }
    onSelect(champion);
    onClose();
  };

  // Render lock overlay on premium champions if !isPro
  {champion.isPremium && !isPro && (
    <View style={styles.lockOverlay}>
      <LockIcon size={24} />
    </View>
  )}
}
```

**File: `/components/SideMenu.tsx` (MODIFY)**
- Add "Restore Purchases" button
- Add "Upgrade to Pro" button (if !isPro)

### 6. Configuration
**File: `/app.json` (MODIFY)**
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.anonymous.RiftboundTracker"
    },
    "android": {
      "package": "com.anonymous.riftboundtracker"
    },
    "plugins": [
      [
        "react-native-purchases",
        {
          "apiKey": {
            "ios": "YOUR_IOS_API_KEY",
            "android": "YOUR_ANDROID_API_KEY"
          }
        }
      ]
    ]
  }
}
```

## Testing Checklist
- [ ] Trial prompt appears on 3rd launch
- [ ] Dismissing trial locks to free mode
- [ ] Free mode shows only #666 color
- [ ] Lock icons appear on premium champions
- [ ] Tapping locked champion shows UpgradeModal
- [ ] Purchase flow works (sandbox)
- [ ] Restore purchases works
- [ ] Champion selections persist across restarts
- [ ] Trial expiry locks to free mode
- [ ] Offline mode works with cached isPro state

## Edge Cases
1. **Trial expires**: isPro → false, champions lock, show gentle reminder
2. **Restore purchases**: RevenueCat.restorePurchases() syncs from Apple/Google
3. **Offline mode**: Uses cached CustomerInfo, syncs when online
4. **Mid-session upgrade**: CustomerInfoUpdateListener updates isPro real-time
5. **Last champion is premium (sub expired)**: Override with FREE_CHAMPION on restore

## Critical Files
1. `/contexts/PurchaseContext.tsx` - RevenueCat integration
2. `/App.tsx` - App open tracking, trial modal, persistence
3. `/components/InlineChampionPicker.tsx` - Lock overlays, upgrade prompt
4. `/components/PointCounter.tsx` - Champion lock display logic
5. `/constants/champions.ts` - Add isPremium, FREE_CHAMPION

## Unresolved Questions
1. RevenueCat API keys - need account setup first?
2. Android package name - confirm `com.anonymous.riftboundtracker`?
3. "Restore Purchases" placement - SideMenu only or also in paywall?
4. Trial prompt action - navigate to full paywall or inline purchase UI?
5. Premium champion selection persistence after dismissing trial - remember it if they upgrade later?
6. "Upgrade to Pro" button - always in SideMenu or only when !isPro?
