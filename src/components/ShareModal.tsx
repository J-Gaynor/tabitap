import React, { useState } from 'react';
import { JapanMapData } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { X, Copy, Check, Users, Share2, Shield, QrCode } from 'lucide-react';
import { NativeService } from '../services/nativeService';

interface ShareModalProps {
  mapData: JapanMapData;
  currentUserId: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  mapData,
  currentUserId,
  onClose
}) => {
  const { t } = useLanguage();
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const roomCode = mapData.shareCode || 'JP-' + mapData.id.slice(4, 8).toUpperCase();
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?room=${roomCode}`
    : `https://tabitap.app/?room=${roomCode}`;

  const handleCopyLink = async () => {
    NativeService.triggerLightHaptic();
    const shared = await NativeService.shareMap(
      `TabiTap: ${mapData.title}`,
      `一緒に日本全国を塗ろう！参加コード: ${roomCode}`,
      shareUrl
    );
    if (!shared) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        padding: 16
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-slide-up"
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'var(--bg-card-solid)',
          borderRadius: 24,
          border: '1px solid var(--border-subtle)',
          padding: '24px 20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="btn btn-ghost btn-icon"
          onClick={onClose}
          style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%' }}
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(14, 165, 233, 0.15)',
              color: '#38bdf8',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8
            }}
          >
            <Share2 size={24} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            {t.shareMap}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: 4 }}>
            {t.shareDesc}
          </p>
        </div>

        {/* 1. Room Code Box */}
        <div
          style={{
            background: 'var(--bg-elevated)',
            borderRadius: 16,
            padding: '14px',
            marginBottom: 16,
            border: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}
        >
          <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4 }}>
            {t.roomCode}
          </span>
          <div
            style={{
              fontSize: '1.8rem',
              fontWeight: 900,
              fontFamily: 'monospace',
              letterSpacing: '3px',
              color: '#38bdf8',
              marginBottom: 10
            }}
          >
            {roomCode}
          </div>
          <button
            className="btn btn-secondary"
            onClick={handleCopyCode}
            style={{ width: '100%', fontSize: '0.82rem', padding: '9px 12px' }}
          >
            {copiedCode ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            <span>{copiedCode ? t.codeCopied : t.copyCode}</span>
          </button>
        </div>

        {/* 2. Direct Link Box */}
        <div style={{ marginBottom: 20 }}>
          <button
            className="btn btn-primary"
            onClick={handleCopyLink}
            style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
          >
            {copiedLink ? <Check size={18} /> : <QrCode size={18} />}
            <span>{copiedLink ? t.linkCopied : t.copyLink}</span>
          </button>
        </div>

        {/* 3. Collaborators Roster */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: 10 }}>
            <Users size={16} color="#38bdf8" />
            <span>{t.collaborators} ({mapData.collaborators.length})</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mapData.collaborators.map((c) => {
              const isYou = c.id === currentUserId;
              const isMaker = c.role === 'maker';

              return (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 12,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: c.avatarColor || '#38bdf8',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem'
                      }}
                    >
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{c.name}</span>
                        {isYou && (
                          <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.15)', padding: '1px 5px', borderRadius: 4, color: '#cbd5e1' }}>
                            {t.youBadge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {isMaker ? t.makerRole : t.collaboratorRole}
                      </div>
                    </div>
                  </div>

                  {isMaker && (
                    <span className="badge badge-maker" style={{ fontSize: '0.65rem' }}>
                      <Shield size={10} />
                      OWNER
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
