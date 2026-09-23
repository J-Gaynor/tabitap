import React, { useState } from 'react';
import { JapanMapData } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { MAX_MAPS } from '../store/useMapStore';
import { Plus, Users, User, LogIn, ChevronLeft, Trash2, Smile } from 'lucide-react';
import { NativeService } from '../services/nativeService';

interface CreateMapPageProps {
  maps: JapanMapData[];
  currentUserId: string;
  currentUserName: string;
  activeMapIndex: number;
  onSelectMap: (index: number) => void;
  onBackToMap: () => void;
  onCreateMap: (title: string, description: string, emoji: string, isShared: boolean, creatorName?: string) => JapanMapData | null;
  onJoinMap: (code: string, joinerName: string) => { success: boolean; messageKey?: string };
  onDeleteMap: (mapId: string) => void;
}

const EMOJIS = ['🗺️', '🤝', '⛩️', '🌸', '🚄', '🍜', '🍱', '🏔️', '♨️', '🍶', '✈️', '🎒'];

export const CreateMapPage: React.FC<CreateMapPageProps> = ({
  maps,
  currentUserId,
  currentUserName,
  activeMapIndex,
  onSelectMap,
  onBackToMap,
  onCreateMap,
  onJoinMap,
  onDeleteMap
}) => {
  const { t } = useLanguage();

  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [mapType, setMapType] = useState<'personal' | 'shared'>('shared');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [emoji, setEmoji] = useState<string>('🤝');
  const [creatorName, setCreatorName] = useState<string>(currentUserName);

  // Join State
  const [joinCode, setJoinCode] = useState<string>('');
  const [joinerName, setJoinerName] = useState<string>(currentUserName);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isLimitReached = maps.length >= MAX_MAPS;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached) return;

    NativeService.triggerSuccessHaptic();
    const res = onCreateMap(title, description, emoji, mapType === 'shared', creatorName);
    if (res) {
      onBackToMap();
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    NativeService.triggerSuccessHaptic();
    const res = onJoinMap(joinCode, joinerName);
    if (res.success) {
      onBackToMap();
    } else {
      setErrorMsg(res.messageKey ? (t.createMapModal as unknown as Record<string, string>)[res.messageKey] || 'Error' : 'Error');
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        background: 'var(--bg-main)',
        paddingTop: 'max(16px, calc(env(safe-area-inset-top, 0px) + 8px))',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingBottom: 'max(32px, calc(env(safe-area-inset-bottom, 0px) + 24px))',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button
          className="btn btn-secondary"
          onClick={() => {
            NativeService.triggerLightHaptic();
            onBackToMap();
          }}
          style={{ padding: '6px 12px', fontSize: '0.82rem', gap: 4, color: 'var(--text-primary)' }}
        >
          <ChevronLeft size={16} />
          <span>{t.home}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {maps.length} / {MAX_MAPS} {t.mapActions.mapOf}
          </span>
        </div>
      </div>

      {/* 1. All User Maps Directory */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
          {t.myMaps}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {maps.map((map, idx) => {
            const isCurrent = activeMapIndex === idx;
            const isOwner = map.ownerId === currentUserId;
            const visitedCount = Object.values(map.prefectures).filter(
              (p) => p && p.status && p.status !== 'none'
            ).length;

            return (
              <div
                key={map.id}
                onClick={() => {
                  NativeService.triggerLightHaptic();
                  onSelectMap(idx);
                  onBackToMap();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 14,
                  background: isCurrent
                    ? 'rgba(244, 63, 94, 0.12)'
                    : 'var(--bg-card-solid)',
                  border: isCurrent ? '1.5px solid #f43f5e' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.4rem' }}>{map.emoji || '🗾'}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        {map.title}
                      </span>
                      {map.isShared && (
                        <span className="badge badge-shared" style={{ fontSize: '0.65rem' }}>
                          <Users size={10} />
                          {map.collaborators.length}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      {visitedCount}/47 都道府県 ({Math.round((visitedCount / 47) * 100)}%) • {isOwner ? t.makerRole : t.collaboratorRole}
                    </div>
                  </div>
                </div>

                {maps.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      NativeService.triggerLightHaptic();
                      if (window.confirm(t.deleteMapConfirm)) {
                        onDeleteMap(map.id);
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      padding: 6,
                      cursor: 'pointer'
                    }}
                    title={t.deleteMap}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Limit Reached Warning */}
      {isLimitReached && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 14,
            padding: '12px 14px',
            marginBottom: 20,
            fontSize: '0.82rem',
            color: '#dc2626'
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 2 }}>{t.mapLimitReached}</div>
          <div>{t.mapLimitDesc}</div>
        </div>
      )}

      {/* 2. Create or Join Tabs */}
      {!isLimitReached && (
        <div style={{ background: 'var(--bg-card-solid)', borderRadius: 20, padding: '18px 16px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => {
                NativeService.triggerLightHaptic();
                setTab('create');
                setErrorMsg(null);
              }}
              style={{
                padding: '9px',
                borderRadius: 12,
                fontSize: '0.85rem',
                fontWeight: tab === 'create' ? 800 : 600,
                background: tab === 'create' ? 'var(--bg-elevated)' : 'transparent',
                color: tab === 'create' ? 'var(--text-primary)' : 'var(--text-muted)',
                border: tab === 'create' ? '1.5px solid var(--border-highlight)' : 'none',
                cursor: 'pointer'
              }}
            >
              {t.createMapModal.createTab}
            </button>
            <button
              type="button"
              onClick={() => {
                NativeService.triggerLightHaptic();
                setTab('join');
                setErrorMsg(null);
              }}
              style={{
                padding: '9px',
                borderRadius: 12,
                fontSize: '0.85rem',
                fontWeight: tab === 'join' ? 800 : 600,
                background: tab === 'join' ? 'var(--bg-elevated)' : 'transparent',
                color: tab === 'join' ? 'var(--text-primary)' : 'var(--text-muted)',
                border: tab === 'join' ? '1.5px solid var(--border-highlight)' : 'none',
                cursor: 'pointer'
              }}
            >
              {t.createMapModal.joinTab}
            </button>
          </div>

          {/* CREATE FORM */}
          {tab === 'create' && (
            <form onSubmit={handleCreate}>
              {/* Type Picker: Shared vs Personal */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                <div
                  onClick={() => {
                    NativeService.triggerLightHaptic();
                    setMapType('shared');
                    setEmoji('🤝');
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: mapType === 'shared' ? 'rgba(14, 165, 233, 0.12)' : 'var(--bg-elevated)',
                    border: mapType === 'shared' ? '1.5px solid #0ea5e9' : '1px solid var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.85rem', color: mapType === 'shared' ? '#0284c7' : 'var(--text-primary)' }}>
                    <Users size={16} />
                    <span>{t.createMapModal.typeShared.split(' ')[0]}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    {t.createMapModal.typeSharedDesc}
                  </div>
                </div>

                <div
                  onClick={() => {
                    NativeService.triggerLightHaptic();
                    setMapType('personal');
                    setEmoji('🗺️');
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: mapType === 'personal' ? 'rgba(244, 63, 94, 0.12)' : 'var(--bg-elevated)',
                    border: mapType === 'personal' ? '1.5px solid #f43f5e' : '1px solid var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.85rem', color: mapType === 'personal' ? '#e11d48' : 'var(--text-primary)' }}>
                    <User size={16} />
                    <span>{t.createMapModal.typePersonal.split(' ')[0]}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    {t.createMapModal.typePersonalDesc}
                  </div>
                </div>
              </div>

              {/* Emoji Picker */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                  <Smile size={14} color="#f43f5e" />
                  <span>{t.mapEmoji}</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmoji(e)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        fontSize: '1.1rem',
                        background: emoji === e ? 'rgba(244, 63, 94, 0.2)' : 'var(--bg-elevated)',
                        border: emoji === e ? '1.5px solid #f43f5e' : '1px solid var(--border-subtle)',
                        cursor: 'pointer'
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {t.mapTitle}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={mapType === 'shared' ? '例: 2026年 温泉仲間旅' : '例: ラーメン全国制覇マップ'}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {t.mapDescription}
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.mapDescriptionPlaceholder}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              {/* Your Nickname */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {t.createMapModal.yourName}
                </label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder={t.createMapModal.yourNamePlaceholder}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    fontWeight: 600
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.92rem' }}
              >
                <Plus size={18} />
                <span>{t.createMapModal.createBtn}</span>
              </button>
            </form>
          )}

          {/* JOIN FORM */}
          {tab === 'join' && (
            <form onSubmit={handleJoin}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {t.roomCode}
                </label>
                <input
                  type="text"
                  required
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder={t.createMapModal.joinInputPlaceholder}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 12,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: '#0284c7',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    fontFamily: 'monospace',
                    letterSpacing: '2px',
                    textAlign: 'center'
                  }}
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {t.createMapModal.yourName}
                </label>
                <input
                  type="text"
                  value={joinerName}
                  onChange={(e) => setJoinerName(e.target.value)}
                  placeholder={t.createMapModal.yourNamePlaceholder}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    fontWeight: 600
                  }}
                />
              </div>

              {errorMsg && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: 12, textAlign: 'center' }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.92rem' }}
              >
                <LogIn size={18} />
                <span>{t.createMapModal.joinSubmit}</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
