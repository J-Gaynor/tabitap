import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { StatusBar, Style } from '@capacitor/status-bar';

export class NativeService {
  // Trigger tactile haptic feedback on iOS/Android
  public static async triggerLightHaptic(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      // Fallback or web browser ignore
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
    }
  }

  public static async triggerSuccessHaptic(): Promise<void> {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([20, 40, 20]);
      }
    }
  }

  // Native share sheet fallback for iOS and Android
  public static async shareMap(title: string, text: string, url: string): Promise<boolean> {
    try {
      const canShare = await Share.canShare();
      if (canShare.value) {
        await Share.share({
          title,
          text,
          url,
          dialogTitle: 'TabiTap Map Share'
        });
        return true;
      }
    } catch {
      // Fallback
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return true;
      } catch {
        // user cancelled
      }
    }
    return false;
  }

  // Configure native status bar
  public static async configureStatusBar(): Promise<void> {
    try {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#090D16' });
    } catch {
      // ignore
    }
  }
}
