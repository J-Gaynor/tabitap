import { JapanMapData } from '../types';

type SyncListener = (map: JapanMapData) => void;

class SyncService {
  private channel: BroadcastChannel | null = null;
  private listeners: Map<string, Set<SyncListener>> = new Map();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('isshoitta_sync_channel');
        this.channel.onmessage = (event) => {
          const { type, data } = event.data || {};
          if (type === 'MAP_UPDATED' && data && data.id) {
            this.notifyListeners(data.id, data);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel not supported or restricted:', err);
      }
    }

    // Also listen to storage events for cross-tab sync
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'isshoitta_maps_store' && e.newValue) {
          try {
            const allMaps: JapanMapData[] = JSON.parse(e.newValue);
            allMaps.forEach((map) => {
              this.notifyListeners(map.id, map);
            });
          } catch (err) {
            console.error('Failed to parse storage sync data', err);
          }
        }
      });
    }
  }

  // Subscribe to live updates for a specific map
  public subscribe(mapId: string, listener: SyncListener): () => void {
    if (!this.listeners.has(mapId)) {
      this.listeners.set(mapId, new Set());
    }
    this.listeners.get(mapId)!.add(listener);

    return () => {
      const set = this.listeners.get(mapId);
      if (set) {
        set.delete(listener);
        if (set.size === 0) {
          this.listeners.delete(mapId);
        }
      }
    };
  }

  // Broadcast a map update to other tabs/sessions
  public broadcastUpdate(map: JapanMapData): void {
    if (this.channel) {
      this.channel.postMessage({
        type: 'MAP_UPDATED',
        data: map
      });
    }
    this.notifyListeners(map.id, map);
  }

  private notifyListeners(mapId: string, map: JapanMapData): void {
    const set = this.listeners.get(mapId);
    if (set) {
      set.forEach((listener) => listener(map));
    }
  }

  // Generate a random 6-character room code (e.g. JP-8492 or ISSHO7)
  public generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'JP-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}

export const syncService = new SyncService();
