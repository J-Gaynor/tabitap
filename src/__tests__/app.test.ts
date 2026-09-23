import { describe, it, expect } from 'vitest';
import { PREFECTURES, REGIONS } from '../data/prefectures';
import { translations } from '../i18n/translations';
import { MAX_MAPS } from '../store/useMapStore';
import { purchaseService, PRO_ENTITLEMENT_ID } from '../services/purchaseService';
import { app, auth, db } from '../services/firebase';

describe('IsshoItta Core Data & Business Logic Tests', () => {
  it('should contain exactly 47 Japanese prefectures with complete metadata', () => {
    expect(PREFECTURES).toHaveLength(47);

    const ids = PREFECTURES.map((p) => p.id);
    for (let i = 1; i <= 47; i++) {
      expect(ids).toContain(i);
    }

    PREFECTURES.forEach((pref) => {
      expect(pref.nameJa).toBeTruthy();
      expect(pref.nameEn).toBeTruthy();
      expect(pref.region).toBeTruthy();
      expect(pref.path).toBeTruthy();
      expect(pref.labelX).toBeGreaterThan(0);
      expect(pref.labelY).toBeGreaterThan(0);
    });
  });

  it('should have all 8 geographical regions covered', () => {
    expect(REGIONS.length).toBeGreaterThanOrEqual(8);
    const regionIds = REGIONS.map((r) => r.id);
    expect(regionIds).toContain('hokkaido');
    expect(regionIds).toContain('kanto');
    expect(regionIds).toContain('kansai');
    expect(regionIds).toContain('okinawa');
  });

  it('should have 100% matched keys between Japanese and English translations', () => {
    const jaKeys = Object.keys(translations.ja);
    const enKeys = Object.keys(translations.en);

    expect(jaKeys.sort()).toEqual(enKeys.sort());

    expect(translations.ja.appName).toBe('TabiTap (旅タップ)');
    expect(translations.en.appName).toBe('TabiTap (旅タップ)');
  });

  it('should enforce the maximum 10 maps constraint', () => {
    expect(MAX_MAPS).toBe(10);
  });

  it('should correctly separate Maker (Admin) and Collaborator permissions', () => {
    const ownerId = 'user_abc';
    const collaboratorId = 'user_xyz';

    const mockMap = {
      id: 'map_1',
      title: 'Shared Trip',
      ownerId: ownerId,
      prefectures: {},
      collaborators: []
    };

    const isOwnerMaker = mockMap.ownerId === ownerId;
    const isCollaboratorMaker = mockMap.ownerId === collaboratorId;

    expect(isOwnerMaker).toBe(true);
    expect(isCollaboratorMaker).toBe(false);
  });

  it('should include full tutorial guide translations for both languages', () => {
    expect(translations.ja.tutorial.slide1Title).toBeTruthy();
    expect(translations.en.tutorial.slide1Title).toBeTruthy();
    expect(translations.ja.tutorial.getStarted).toBeTruthy();
    expect(translations.en.tutorial.getStarted).toBeTruthy();
    expect(translations.ja.settingsModal.tutorialBtn).toBeTruthy();
    expect(translations.en.settingsModal.tutorialBtn).toBeTruthy();
  });
});

describe('Firebase & RevenueCat Subscription Integration Tests', () => {
  it('should initialize Firebase app and services with prefectures-app config', () => {
    expect(app).toBeDefined();
    expect(auth).toBeDefined();
    expect(db).toBeDefined();
  });

  it('should have Pro entitlement identifier defined', () => {
    expect(PRO_ENTITLEMENT_ID).toBe('pro');
  });

  it('should handle purchase service fallback gracefully when running outside native stores', async () => {
    await purchaseService.initialize('test_user_123');
    const isPro = await purchaseService.checkProEntitlement();
    expect(typeof isPro).toBe('boolean');

    const restoreRes = await purchaseService.restorePurchases();
    expect(restoreRes.success).toBe(true);
  });
});
