export type VisitStatus = 'visited' | 'want_to_go' | 'lived' | 'passed' | 'none';

export type UserRole = 'maker' | 'collaborator';

export type Language = 'ja' | 'en';

export type RegionId =
  | 'hokkaido'
  | 'tohoku'
  | 'kanto'
  | 'chubu'
  | 'kansai'
  | 'chugoku'
  | 'shikoku'
  | 'kyushu'
  | 'okinawa';

export interface PrefectureMeta {
  id: number;
  code: string;
  nameJa: string;
  nameEn: string;
  kana: string;
  region: RegionId;
  capitalJa: string;
  capitalEn: string;
  highlightJa: string;
  highlightEn: string;
  path: string;
  labelX: number;
  labelY: number;
}

export interface PrefectureVisitData {
  status: VisitStatus;
  color: string;
  visitDate?: string;
  rating?: number; // 1 to 5
  notes?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface Collaborator {
  id: string;
  name: string;
  role: UserRole;
  avatarColor: string;
  joinedAt: string;
  isOnline?: boolean;
}

export interface JapanMapData {
  id: string;
  title: string;
  description?: string;
  emoji?: string;
  ownerId: string;
  ownerName: string;
  isShared: boolean;
  shareCode?: string;
  createdAt: string;
  updatedAt: string;
  prefectures: Record<number, PrefectureVisitData>;
  collaborators: Collaborator[];
}

export interface ColorPreset {
  nameJa: string;
  nameEn: string;
  hex: string;
}
