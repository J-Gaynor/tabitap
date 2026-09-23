import { useState, useEffect, useCallback } from 'react';
import { JapanMapData, PrefectureVisitData, UserRole } from '../types';
import { syncService } from '../services/syncService';
import {
  subscribeToAuth,
  syncMapToCloud,
  fetchUserMapsFromCloud,
  logout as firebaseLogout
} from '../services/firebase';
import { purchaseService } from '../services/purchaseService';

const STORAGE_KEY_MAPS = 'isshoitta_maps_store';
const STORAGE_KEY_ACTIVE_INDEX = 'isshoitta_active_map_index';
const STORAGE_KEY_USER_ID = 'isshoitta_user_id';
const STORAGE_KEY_USER_NAME = 'isshoitta_user_name';
const STORAGE_KEY_USER_EMAIL = 'isshoitta_user_email';
const STORAGE_KEY_USER_PROVIDER = 'isshoitta_user_provider';
const STORAGE_KEY_IS_PRO = 'isshoitta_is_pro';
const STORAGE_KEY_THEME = 'isshoitta_theme';

export const MAX_MAPS = 10;

export interface UserAccountState {
  provider: 'google' | 'apple' | 'guest';
  name: string;
  email: string;
  uid?: string;
}

// Helper to get or create persistent anonymous user id
export const getOrCreateUserId = (): string => {
  let userId = localStorage.getItem(STORAGE_KEY_USER_ID);
  if (!userId) {
    userId = 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEY_USER_ID, userId);
  }
  return userId;
};

export const getStoredUserName = (): string => {
  return localStorage.getItem(STORAGE_KEY_USER_NAME) || 'トラベラー (Traveler)';
};

export const setStoredUserName = (name: string): void => {
  localStorage.setItem(STORAGE_KEY_USER_NAME, name);
};

const createInitialDefaultMap = (userId: string, userName: string): JapanMapData => {
  return {
    id: 'map_personal_default',
    title: 'マイ日本全国マップ (My Travel Map)',
    description: '自分の行った都道府県をコレクション',
    emoji: '🗾',
    ownerId: userId,
    ownerName: userName,
    isShared: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    prefectures: {
      13: { status: 'visited', color: '#F43F5E', visitDate: '2025-01', rating: 5, notes: '浅草寺、東京タワー' },
      26: { status: 'visited', color: '#EAB308', visitDate: '2024-11', rating: 5, notes: '伏見稲荷、金閣寺' },
      27: { status: 'visited', color: '#F97316', visitDate: '2024-10', rating: 4, notes: '道頓堀たこ焼き' }
    },
    collaborators: [
      {
        id: userId,
        name: userName,
        role: 'maker',
        avatarColor: '#F43F5E',
        joinedAt: new Date().toISOString(),
        isOnline: true
      }
    ]
  };
};

export function useMapStore() {
  const [userId, setUserIdState] = useState<string>(getOrCreateUserId);
  const [userName, setUserNameState] = useState<string>(getStoredUserName);
  const [userAccount, setUserAccountState] = useState<UserAccountState>(() => {
    const provider = (localStorage.getItem(STORAGE_KEY_USER_PROVIDER) as 'google' | 'apple' | 'guest') || 'guest';
    const email = localStorage.getItem(STORAGE_KEY_USER_EMAIL) || '';
    const name = localStorage.getItem(STORAGE_KEY_USER_NAME) || 'ゲスト (Guest)';
    const uid = localStorage.getItem(STORAGE_KEY_USER_ID) || undefined;
    return { provider, name, email, uid };
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [isPro, setIsProState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_IS_PRO) === 'true';
  });

  const [maps, setMaps] = useState<JapanMapData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MAPS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to read maps from localStorage:', err);
    }
    const init = [createInitialDefaultMap(getOrCreateUserId(), getStoredUserName())];
    localStorage.setItem(STORAGE_KEY_MAPS, JSON.stringify(init));
    return init;
  });

  const [activeMapIndex, setActiveMapIndexState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_INDEX);
    const parsed = saved ? parseInt(saved, 10) : 0;
    return isNaN(parsed) ? 0 : parsed;
  });

  // Keep active index within bounds
  const safeActiveIndex = Math.min(Math.max(0, activeMapIndex), Math.max(0, maps.length - 1));
  const activeMap: JapanMapData | undefined = maps[safeActiveIndex] || maps[0];

  // Initialize RevenueCat and listen to subscriptions
  useEffect(() => {
    purchaseService.initialize(userId).then(async () => {
      const proStatus = await purchaseService.checkProEntitlement();
      setIsProState(proStatus);
      localStorage.setItem(STORAGE_KEY_IS_PRO, proStatus ? 'true' : 'false');
    });

    const removeListener = purchaseService.addCustomerInfoListener((active) => {
      setIsProState(active);
      localStorage.setItem(STORAGE_KEY_IS_PRO, active ? 'true' : 'false');
    });

    return () => {
      removeListener();
    };
  }, [userId]);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribeAuth = subscribeToAuth(async (firebaseUser) => {
      if (firebaseUser) {
        const isAnonymous = firebaseUser.isAnonymous;
        const providerData = firebaseUser.providerData[0];
        let provider: 'google' | 'apple' | 'guest' = 'guest';

        if (providerData) {
          if (providerData.providerId.includes('google')) provider = 'google';
          else if (providerData.providerId.includes('apple')) provider = 'apple';
        } else if (isAnonymous) {
          provider = 'guest';
        }

        const effectiveName = firebaseUser.displayName || (isAnonymous ? 'ゲスト (Guest)' : 'トラベラー (Traveler)');
        const effectiveEmail = firebaseUser.email || '';
        const currentUid = firebaseUser.uid;

        setUserIdState(currentUid);
        setUserNameState(effectiveName);
        setUserAccountState({
          provider,
          name: effectiveName,
          email: effectiveEmail,
          uid: currentUid
        });

        localStorage.setItem(STORAGE_KEY_USER_ID, currentUid);
        localStorage.setItem(STORAGE_KEY_USER_NAME, effectiveName);
        localStorage.setItem(STORAGE_KEY_USER_EMAIL, effectiveEmail);
        localStorage.setItem(STORAGE_KEY_USER_PROVIDER, provider);

        // Identify with RevenueCat
        await purchaseService.initialize(currentUid);

        // Fetch user maps from Firestore
        try {
          const cloudMaps = await fetchUserMapsFromCloud(currentUid);
          if (cloudMaps && cloudMaps.length > 0) {
            setMaps(cloudMaps);
          }
        } catch (err) {
          console.warn('Could not sync initial cloud maps:', err);
        }
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Save maps to localStorage & Cloud Firestore whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MAPS, JSON.stringify(maps));
    } catch (err) {
      console.error('Error saving maps to localStorage', err);
    }

    // Sync active map to Firestore in background
    if (activeMap) {
      syncMapToCloud(activeMap).catch((e) => console.warn('Background cloud sync:', e));
    }
  }, [maps, activeMap]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_INDEX, safeActiveIndex.toString());
  }, [safeActiveIndex]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = useCallback((t: 'light' | 'dark') => {
    setThemeState(t);
  }, []);

  const setUserAccount = useCallback(
    (provider: 'google' | 'apple' | 'guest', name: string, email: string, uid?: string) => {
      const targetUid = uid || userId;
      const updated: UserAccountState = { provider, name, email, uid: targetUid };
      setUserAccountState(updated);
      setUserNameState(name);
      setUserIdState(targetUid);
      localStorage.setItem(STORAGE_KEY_USER_PROVIDER, provider);
      localStorage.setItem(STORAGE_KEY_USER_NAME, name);
      localStorage.setItem(STORAGE_KEY_USER_EMAIL, email);
      localStorage.setItem(STORAGE_KEY_USER_ID, targetUid);
      purchaseService.initialize(targetUid);
    },
    [userId]
  );

  // Sync listener for real-time changes across tabs or sessions
  useEffect(() => {
    if (!activeMap) return;
    const unsubscribe = syncService.subscribe(activeMap.id, (incomingMap) => {
      setMaps((prevMaps) => {
        const index = prevMaps.findIndex((m) => m.id === incomingMap.id);
        if (index === -1) {
          return [...prevMaps, incomingMap];
        }
        if (new Date(incomingMap.updatedAt).getTime() > new Date(prevMaps[index].updatedAt).getTime()) {
          const updated = [...prevMaps];
          updated[index] = incomingMap;
          return updated;
        }
        return prevMaps;
      });
    });
    return unsubscribe;
  }, [activeMap?.id]);

  const setUserName = useCallback((name: string) => {
    setUserNameState(name);
    setStoredUserName(name);
  }, []);

  const setIsPro = useCallback((val: boolean) => {
    setIsProState(val);
    localStorage.setItem(STORAGE_KEY_IS_PRO, val ? 'true' : 'false');
  }, []);

  const setActiveMapIndex = useCallback((index: number) => {
    setActiveMapIndexState(index);
  }, []);

  // Update prefecture for active map
  const updatePrefecture = useCallback(
    (prefId: number, data: Partial<PrefectureVisitData>) => {
      if (!activeMap) return;

      const currentVisit = activeMap.prefectures[prefId] || {
        status: 'none',
        color: '#E2E8F0'
      };

      const newVisit: PrefectureVisitData = {
        ...currentVisit,
        ...data,
        updatedBy: userName,
        updatedAt: new Date().toISOString()
      };

      const updatedPrefectures = {
        ...activeMap.prefectures,
        [prefId]: newVisit
      };

      const updatedMap: JapanMapData = {
        ...activeMap,
        prefectures: updatedPrefectures,
        updatedAt: new Date().toISOString()
      };

      setMaps((prev) => {
        const next = [...prev];
        next[safeActiveIndex] = updatedMap;
        return next;
      });

      // Broadcast update & sync cloud
      syncService.broadcastUpdate(updatedMap);
      syncMapToCloud(updatedMap);
    },
    [activeMap, safeActiveIndex, userName]
  );

  // Clear prefecture mark
  const clearPrefecture = useCallback(
    (prefId: number) => {
      if (!activeMap) return;
      const updatedPrefectures = { ...activeMap.prefectures };
      delete updatedPrefectures[prefId];

      const updatedMap: JapanMapData = {
        ...activeMap,
        prefectures: updatedPrefectures,
        updatedAt: new Date().toISOString()
      };

      setMaps((prev) => {
        const next = [...prev];
        next[safeActiveIndex] = updatedMap;
        return next;
      });

      syncService.broadcastUpdate(updatedMap);
      syncMapToCloud(updatedMap);
    },
    [activeMap, safeActiveIndex]
  );

  // Create new map (Up to MAX_MAPS)
  const createMap = useCallback(
    (title: string, description: string, emoji: string, isShared: boolean, creatorName?: string): JapanMapData | null => {
      if (maps.length >= MAX_MAPS) {
        return null;
      }

      const effectiveName = creatorName || userName;
      if (creatorName && creatorName !== userName) {
        setUserName(creatorName);
      }

      const mapId = 'map_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      const shareCode = isShared ? syncService.generateRoomCode() : undefined;

      const newMap: JapanMapData = {
        id: mapId,
        title: title.trim() || (isShared ? 'みんなの日本マップ' : '新しいトラベルマップ'),
        description: description.trim(),
        emoji: emoji || (isShared ? '🤝' : '🗺️'),
        ownerId: userId,
        ownerName: effectiveName,
        isShared,
        shareCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        prefectures: {},
        collaborators: [
          {
            id: userId,
            name: effectiveName,
            role: 'maker',
            avatarColor: '#F43F5E',
            joinedAt: new Date().toISOString(),
            isOnline: true
          }
        ]
      };

      setMaps((prev) => {
        const next = [...prev, newMap];
        return next;
      });

      setActiveMapIndexState(maps.length);
      syncService.broadcastUpdate(newMap);
      syncMapToCloud(newMap);
      return newMap;
    },
    [maps.length, userId, userName, setUserName]
  );

  // Join shared map by code
  const joinMapByCode = useCallback(
    (code: string, joinerName: string): { success: boolean; messageKey?: string; map?: JapanMapData } => {
      const normalizedCode = code.trim().toUpperCase();
      let targetMap = maps.find((m) => m.shareCode?.toUpperCase() === normalizedCode);

      if (!targetMap) {
        try {
          const rawAll = localStorage.getItem('isshoitta_shared_registry');
          if (rawAll) {
            const registry: Record<string, JapanMapData> = JSON.parse(rawAll);
            if (registry[normalizedCode]) {
              targetMap = registry[normalizedCode];
            }
          }
        } catch {
          // ignore
        }
      }

      if (!targetMap) {
        targetMap = {
          id: 'map_shared_' + normalizedCode.replace(/[^A-Z0-9]/g, ''),
          title: `共有マップ (${normalizedCode})`,
          description: '友達と一緒に編集する共有マップ',
          emoji: '🗾',
          ownerId: 'remote_owner',
          ownerName: '作成者 (Creator)',
          isShared: true,
          shareCode: normalizedCode,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          prefectures: {},
          collaborators: [
            {
              id: 'remote_owner',
              name: '作成者 (Creator)',
              role: 'maker',
              avatarColor: '#10B981',
              joinedAt: new Date().toISOString()
            }
          ]
        };
      }

      if (maps.some((m) => m.id === targetMap!.id)) {
        const existingIdx = maps.findIndex((m) => m.id === targetMap!.id);
        setActiveMapIndexState(existingIdx);
        return { success: true, messageKey: 'alreadyJoined', map: targetMap };
      }

      if (maps.length >= MAX_MAPS) {
        return { success: false, messageKey: 'mapLimitReached' };
      }

      const effectiveName = joinerName.trim() || userName;
      if (joinerName && joinerName !== userName) {
        setUserName(joinerName);
      }

      const existingCollab = targetMap.collaborators.find((c) => c.id === userId);
      const updatedCollaborators = existingCollab
        ? targetMap.collaborators
        : [
            ...targetMap.collaborators,
            {
              id: userId,
              name: effectiveName,
              role: 'collaborator' as UserRole,
              avatarColor: '#0EA5E9',
              joinedAt: new Date().toISOString(),
              isOnline: true
            }
          ];

      const joinedMap: JapanMapData = {
        ...targetMap,
        collaborators: updatedCollaborators,
        updatedAt: new Date().toISOString()
      };

      setMaps((prev) => [...prev, joinedMap]);
      setActiveMapIndexState(maps.length);
      syncService.broadcastUpdate(joinedMap);
      syncMapToCloud(joinedMap);

      return { success: true, map: joinedMap };
    },
    [maps, userId, userName, setUserName]
  );

  // Update map settings (Title, Description, Emoji)
  const updateMapSettings = useCallback(
    (mapId: string, title: string, description: string, emoji: string): boolean => {
      const targetMap = maps.find((m) => m.id === mapId);
      if (!targetMap) return false;

      const isOwner = targetMap.ownerId === userId;
      if (!isOwner) {
        return false;
      }

      const updatedMap: JapanMapData = {
        ...targetMap,
        title: title.trim() || targetMap.title,
        description: description.trim(),
        emoji: emoji || targetMap.emoji,
        updatedAt: new Date().toISOString()
      };

      setMaps((prev) => prev.map((m) => (m.id === mapId ? updatedMap : m)));
      syncService.broadcastUpdate(updatedMap);
      syncMapToCloud(updatedMap);
      return true;
    },
    [maps, userId]
  );

  // Delete a map
  const deleteMap = useCallback(
    (mapId: string): boolean => {
      if (maps.length <= 1) {
        const fresh = createInitialDefaultMap(userId, userName);
        setMaps([fresh]);
        setActiveMapIndexState(0);
        return true;
      }

      setMaps((prev) => {
        const next = prev.filter((m) => m.id !== mapId);
        return next;
      });

      setActiveMapIndexState((prev) => Math.max(0, prev - 1));
      return true;
    },
    [maps.length, userId, userName]
  );

  // Export JSON
  const exportAllData = useCallback((): string => {
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        maps,
        isPro
      },
      null,
      2
    );
  }, [maps, isPro]);

  // Import JSON
  const importData = useCallback(
    (jsonStr: string): boolean => {
      try {
        const data = JSON.parse(jsonStr);
        if (Array.isArray(data.maps) && data.maps.length > 0) {
          setMaps(data.maps.slice(0, MAX_MAPS));
          setActiveMapIndexState(0);
          if (data.isPro !== undefined) {
            setIsProState(Boolean(data.isPro));
          }
          return true;
        }
      } catch (err) {
        console.error('Import failed:', err);
      }
      return false;
    },
    []
  );

  // Reset all
  const resetAllData = useCallback(async () => {
    const init = [createInitialDefaultMap(userId, userName)];
    setMaps(init);
    setActiveMapIndexState(0);
    localStorage.setItem(STORAGE_KEY_MAPS, JSON.stringify(init));
    await firebaseLogout().catch(() => {});
  }, [userId, userName]);

  // Calculate current user's role for active map
  const isOwner = Boolean(activeMap && activeMap.ownerId === userId);
  const currentUserRole: UserRole = isOwner ? 'maker' : 'collaborator';

  return {
    userId,
    userName,
    setUserName,
    userAccount,
    setUserAccount,
    theme,
    setTheme,
    isPro,
    setIsPro,
    maps,
    activeMap,
    activeMapIndex: safeActiveIndex,
    setActiveMapIndex,
    isOwner,
    currentUserRole,
    updatePrefecture,
    clearPrefecture,
    createMap,
    joinMapByCode,
    updateMapSettings,
    deleteMap,
    exportAllData,
    importData,
    resetAllData
  };
}
