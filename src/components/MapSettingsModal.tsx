import React, { useState } from 'react';
import { JapanMapData } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { X, Trash2, Save, Download, Lock, Smile } from 'lucide-react';
import { toPng } from 'html-to-image';
import { NativeService } from '../services/nativeService';

interface MapSettingsModalProps {
  mapData: JapanMapData;
  isOwner: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, emoji: string) => void;
  onDelete: () => void;
}

const EMOJI_OPTIONS = ['🗾', '🗺️', '⛩️', '🌸', '🚄', '🍜', '🍱', '🍙', '🏔️', '♨️', '🍶', '✈️', '🎒', '🧳'];

export const MapSettingsModal: React.FC<MapSettingsModalProps> = ({
  mapData,
  isOwner,
  onClose,
  onSave,
  onDelete
}) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState<string>(mapData.title);
  const [description, setDescription] = useState<string>(mapData.description || '');
  const [emoji, setEmoji] = useState<string>(mapData.emoji || '🗾');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleSave = () => {
    if (!isOwner) return;
    NativeService.triggerSuccessHaptic();
    onSave(title, description, emoji);
    onClose();
  };

  const handleDelete = () => {
    NativeService.triggerLightHaptic();
    if (window.confirm(t.deleteMapConfirm)) {
      onDelete();
      onClose();
    }
  };

  const handleDownloadImage = async () => {
    const mapElement = document.querySelector('.map-viewport') as HTMLElement;
    if (!mapElement) return;

    try {
      setIsExporting(true);
      const dataUrl = await toPng(mapElement, {
        quality: 0.95,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `${mapData.title.replace(/\s+/g, '_')}_map.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export map image', err);
    } finally {
      setIsExporting(false);
    }
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
        background: 'rgba(0, 0, 0, 0.65)',
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
          boxShadow: 'var(--shadow-lg)',
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

        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>
          {t.mapSettings}
        </h2>

        {!isOwner && (
          <div
            style={{
              background: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              borderRadius: 12,
              padding: '10px 12px',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.78rem',
              color: '#d97706'
            }}
          >
            <Lock size={16} />
            <span>Only the creator (maker) has permissions to modify map settings.</span>
          </div>
        )}

        {/* Emoji Selector */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            <Smile size={14} color="#f43f5e" />
            <span>{t.mapEmoji}</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                type="button"
                disabled={!isOwner}
                onClick={() => setEmoji(e)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  fontSize: '1.2rem',
                  background: emoji === e ? 'rgba(244, 63, 94, 0.2)' : 'var(--bg-elevated)',
                  border: emoji === e ? '1.5px solid #f43f5e' : '1px solid var(--border-subtle)',
                  cursor: isOwner ? 'pointer' : 'default',
                  opacity: !isOwner ? 0.6 : 1
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Title Input */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            {t.mapTitle}
          </label>
          <input
            type="text"
            value={title}
            disabled={!isOwner}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.mapTitlePlaceholder}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 12,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: 600,
              opacity: !isOwner ? 0.7 : 1
            }}
          />
        </div>

        {/* Description Input */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            {t.mapDescription}
          </label>
          <textarea
            value={description}
            disabled={!isOwner}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.mapDescriptionPlaceholder}
            rows={2}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 12,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              resize: 'none',
              opacity: !isOwner ? 0.7 : 1
            }}
          />
        </div>

        {/* Export Image button */}
        <div style={{ marginBottom: 20 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleDownloadImage}
            disabled={isExporting}
            style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem' }}
          >
            <Download size={16} />
            <span>{isExporting ? 'Generating Image...' : 'Export Map Image (PNG)'}</span>
          </button>
        </div>

        {/* Save & Delete Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {isOwner && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              style={{ width: '100%', padding: '12px', fontSize: '0.92rem' }}
            >
              <Save size={18} />
              <span>{t.saveChanges}</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleDelete}
            style={{ color: '#ef4444', fontSize: '0.84rem' }}
          >
            <Trash2 size={16} />
            <span>{isOwner ? t.deleteMap : 'Leave / Remove from My Maps'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
