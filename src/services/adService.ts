import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// Official Google AdMob Test Ad Unit IDs
const TEST_IOS_BANNER = 'ca-app-pub-3940256099942544/2934735716';
const TEST_ANDROID_BANNER = 'ca-app-pub-3940256099942544/6300978111';

class AdService {
  private isInitialized = false;
  private isBannerVisible = false;

  public async initialize(): Promise<void> {
    if (this.isInitialized || !Capacitor.isNativePlatform()) {
      return;
    }

    const isProduction = !!import.meta.env.VITE_ADMOB_IOS_BANNER_ID || !!import.meta.env.VITE_ADMOB_ANDROID_BANNER_ID;

    try {
      await AdMob.initialize({
        initializeForTesting: !isProduction
      });
      this.isInitialized = true;
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.warn('AdMob initialization failed:', error);
    }
  }

  public async showBanner(isPro: boolean): Promise<void> {
    if (isPro) {
      await this.removeBanner();
      return;
    }

    if (!Capacitor.isNativePlatform()) {
      return;
    }

    if (!this.isInitialized) {
      await this.initialize();
    }

    const platform = Capacitor.getPlatform();
    let adId = '';
    let isTesting = false;

    if (platform === 'ios') {
      adId = import.meta.env.VITE_ADMOB_IOS_BANNER_ID || TEST_IOS_BANNER;
      isTesting = !import.meta.env.VITE_ADMOB_IOS_BANNER_ID;
    } else if (platform === 'android') {
      adId = import.meta.env.VITE_ADMOB_ANDROID_BANNER_ID || TEST_ANDROID_BANNER;
      isTesting = !import.meta.env.VITE_ADMOB_ANDROID_BANNER_ID;
    }

    if (!adId) return;

    const options: BannerAdOptions = {
      adId,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting
    };

    try {
      await AdMob.showBanner(options);
      this.isBannerVisible = true;
    } catch (error) {
      console.warn('Error showing AdMob banner:', error);
    }
  }

  public async hideBanner(): Promise<void> {
    if (!Capacitor.isNativePlatform() || !this.isBannerVisible) return;
    try {
      await AdMob.hideBanner();
      this.isBannerVisible = false;
    } catch (error) {
      console.warn('Error hiding AdMob banner:', error);
    }
  }

  public async removeBanner(): Promise<void> {
    if (!Capacitor.isNativePlatform() || !this.isBannerVisible) return;
    try {
      await AdMob.removeBanner();
      this.isBannerVisible = false;
    } catch (error) {
      console.warn('Error removing AdMob banner:', error);
    }
  }
}

export const adService = new AdService();
