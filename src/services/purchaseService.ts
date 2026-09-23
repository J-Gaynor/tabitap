import { Purchases, CustomerInfo, PurchasesOfferings, PurchasesPackage } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

export const PRO_ENTITLEMENT_ID = import.meta.env.VITE_REVENUECAT_ENTITLEMENT_ID || 'pro';

class PurchaseService {
  private initialized = false;

  public async initialize(appUserID?: string): Promise<void> {
    if (this.initialized) {
      if (appUserID) {
        await this.identifyUser(appUserID);
      }
      return;
    }

    const platform = Capacitor.getPlatform();
    let apiKey = '';

    if (platform === 'ios') {
      apiKey = import.meta.env.VITE_REVENUECAT_APPLE_API_KEY || '';
    } else if (platform === 'android') {
      apiKey = import.meta.env.VITE_REVENUECAT_GOOGLE_API_KEY || '';
    }

    if (!apiKey || apiKey.includes('your_') || !Capacitor.isNativePlatform()) {
      console.log('RevenueCat: Running on non-native platform or API key not yet configured.');
      this.initialized = true;
      return;
    }

    try {
      await Purchases.configure({
        apiKey,
        appUserID: appUserID || null
      });
      this.initialized = true;
      console.log('RevenueCat initialized successfully for platform:', platform);
    } catch (error) {
      console.warn('RevenueCat configuration failed:', error);
    }
  }

  public async identifyUser(appUserID: string): Promise<CustomerInfo | null> {
    if (!Capacitor.isNativePlatform()) return null;
    try {
      const result = await Purchases.logIn({ appUserID });
      return result.customerInfo;
    } catch (error) {
      console.warn('RevenueCat logIn error:', error);
      return null;
    }
  }

  public async logOut(): Promise<CustomerInfo | null> {
    if (!Capacitor.isNativePlatform()) return null;
    try {
      const result = await Purchases.logOut();
      return result.customerInfo;
    } catch (error) {
      console.warn('RevenueCat logOut error:', error);
      return null;
    }
  }

  public async getOfferings(): Promise<PurchasesOfferings | null> {
    if (!Capacitor.isNativePlatform()) return null;
    try {
      const offerings = await Purchases.getOfferings();
      return offerings;
    } catch (error) {
      console.warn('Error fetching RevenueCat offerings:', error);
      return null;
    }
  }

  public async checkProEntitlement(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      // In web/dev mode, check localStorage fallback
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('isshoitta_is_pro') === 'true';
      }
      return false;
    }

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return this.hasProEntitlement(customerInfo.customerInfo);
    } catch (error) {
      console.warn('Error checking RevenueCat Pro entitlement:', error);
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('isshoitta_is_pro') === 'true';
      }
      return false;
    }
  }

  public async purchasePackage(aPackage: PurchasesPackage): Promise<{ success: boolean; customerInfo?: CustomerInfo }> {
    if (!Capacitor.isNativePlatform()) {
      // Dev/Simulator mock purchase
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('isshoitta_is_pro', 'true');
      }
      return { success: true };
    }

    try {
      const result = await Purchases.purchasePackage({ aPackage });
      const isPro = this.hasProEntitlement(result.customerInfo);
      return { success: isPro, customerInfo: result.customerInfo };
    } catch (error: any) {
      if (error.userCancelled) {
        console.log('User cancelled purchase.');
      } else {
        console.error('Purchase failed:', error);
      }
      return { success: false };
    }
  }

  public async restorePurchases(): Promise<{ success: boolean; isPro: boolean }> {
    if (!Capacitor.isNativePlatform()) {
      const isPro = typeof localStorage !== 'undefined' ? localStorage.getItem('isshoitta_is_pro') === 'true' : false;
      return { success: true, isPro };
    }

    try {
      const customerInfo = await Purchases.restorePurchases();
      const isPro = this.hasProEntitlement(customerInfo.customerInfo);
      return { success: true, isPro };
    } catch (error) {
      console.error('Restore purchases failed:', error);
      return { success: false, isPro: false };
    }
  }

  public addCustomerInfoListener(callback: (isPro: boolean) => void): () => void {
    if (!Capacitor.isNativePlatform()) {
      return () => {};
    }

    Purchases.addCustomerInfoUpdateListener((info) => {
      const isPro = this.hasProEntitlement(info);
      callback(isPro);
    });

    return () => {
      // Listener registered
    };
  }

  private hasProEntitlement(customerInfo: CustomerInfo | undefined): boolean {
    if (!customerInfo || !customerInfo.entitlements || !customerInfo.entitlements.active) {
      return false;
    }
    return Boolean(customerInfo.entitlements.active[PRO_ENTITLEMENT_ID]);
  }
}

export const purchaseService = new PurchaseService();
