import AsyncStorage from '@react-native-async-storage/async-storage';
import { CHAMPIONS, FREE_CHAMPION } from '../constants/champions';

/**
 * Storage keys used throughout the app
 */
export const STORAGE_KEYS = {
  APP_OPENS_COUNT: '@riftbound:appOpensCount',
  HAS_SEEN_TRIAL_PROMPT: '@riftbound:hasSeenTrialPrompt',
  TRIAL_DISMISSED: '@riftbound:trialDismissed',
  LAST_TOP_CHAMPION_ID: '@riftbound:lastTopChampionId',
  LAST_BOTTOM_CHAMPION_ID: '@riftbound:lastBottomChampionId',
} as const;

/**
 * Get app opens count
 * SECURITY: Validates parsed value to prevent NaN/corruption issues
 */
export async function getAppOpensCount(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.APP_OPENS_COUNT);
    if (!value) return 0;

    const parsed = parseInt(value, 10);

    // Validate the parsed value
    if (isNaN(parsed) || parsed < 0) {
      console.warn('Invalid app opens count, resetting to 0');
      await AsyncStorage.setItem(STORAGE_KEYS.APP_OPENS_COUNT, '0');
      return 0;
    }

    return parsed;
  } catch (error) {
    console.error('Error reading app opens count:', error);
    return 0;
  }
}

/**
 * Increment app opens count
 */
export async function incrementAppOpensCount(): Promise<number> {
  try {
    const currentCount = await getAppOpensCount();
    const newCount = currentCount + 1;
    await AsyncStorage.setItem(STORAGE_KEYS.APP_OPENS_COUNT, newCount.toString());
    return newCount;
  } catch (error) {
    console.error('Error incrementing app opens count:', error);
    return 0;
  }
}

/**
 * Check if user has seen trial prompt
 */
export async function hasSeenTrialPrompt(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_TRIAL_PROMPT);
    return value === 'true';
  } catch (error) {
    console.error('Error reading trial prompt status:', error);
    return false;
  }
}

/**
 * Mark trial prompt as seen
 */
export async function setTrialPromptSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_TRIAL_PROMPT, 'true');
  } catch (error) {
    console.error('Error setting trial prompt seen:', error);
  }
}

/**
 * Check if user dismissed trial
 */
export async function hasTrialDismissed(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.TRIAL_DISMISSED);
    return value === 'true';
  } catch (error) {
    console.error('Error reading trial dismissed status:', error);
    return false;
  }
}

/**
 * Mark trial as dismissed
 */
export async function setTrialDismissed(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TRIAL_DISMISSED, 'true');
  } catch (error) {
    console.error('Error setting trial dismissed:', error);
  }
}

/**
 * Get last selected champion for top player
 */
export async function getLastTopChampion(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.LAST_TOP_CHAMPION_ID);
  } catch (error) {
    console.error('Error reading last top champion:', error);
    return null;
  }
}

/**
 * Save last selected champion for top player
 * SECURITY: Validates champion ID before storing
 */
export async function setLastTopChampion(championId: string): Promise<void> {
  try {
    // Validate championId
    if (!championId || typeof championId !== 'string') {
      console.warn('Invalid champion ID provided');
      return;
    }

    // Limit length to prevent storage abuse
    if (championId.length > 50) {
      console.warn('Champion ID too long, truncating');
      championId = championId.substring(0, 50);
    }

    // Verify it's a valid champion ID
    const validChampionIds = [...CHAMPIONS.map((c) => c.id), FREE_CHAMPION.id];
    if (!validChampionIds.includes(championId)) {
      console.warn('Unknown champion ID:', championId);
      return;
    }

    await AsyncStorage.setItem(STORAGE_KEYS.LAST_TOP_CHAMPION_ID, championId);
  } catch (error) {
    console.error('Error saving last top champion:', error);
  }
}

/**
 * Get last selected champion for bottom player
 */
export async function getLastBottomChampion(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.LAST_BOTTOM_CHAMPION_ID);
  } catch (error) {
    console.error('Error reading last bottom champion:', error);
    return null;
  }
}

/**
 * Save last selected champion for bottom player
 * SECURITY: Validates champion ID before storing
 */
export async function setLastBottomChampion(championId: string): Promise<void> {
  try {
    // Validate championId
    if (!championId || typeof championId !== 'string') {
      console.warn('Invalid champion ID provided');
      return;
    }

    // Limit length to prevent storage abuse
    if (championId.length > 50) {
      console.warn('Champion ID too long, truncating');
      championId = championId.substring(0, 50);
    }

    // Verify it's a valid champion ID
    const validChampionIds = [...CHAMPIONS.map((c) => c.id), FREE_CHAMPION.id];
    if (!validChampionIds.includes(championId)) {
      console.warn('Unknown champion ID:', championId);
      return;
    }

    await AsyncStorage.setItem(STORAGE_KEYS.LAST_BOTTOM_CHAMPION_ID, championId);
  } catch (error) {
    console.error('Error saving last bottom champion:', error);
  }
}

/**
 * Clear all app data (useful for testing)
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
}
