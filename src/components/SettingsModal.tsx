import React, { useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { X, Globe, Crown, Download, Upload, RotateCcw, ShieldCheck, Sun, Moon, UserCheck, BookOpen } from 'lucide-react';
import { NativeService } from '../services/nativeService';

interface SettingsModalProps {
  isPro: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: (theme: 'light' | 'dark') => void;
  userAccount: {
    provider: 'google' | 'apple' | 'guest';
    name: string;
    email: string;
  };
  onOpenAuthModal: () => void;
  onOpenTutorial: () => void;
  onClose: () => void;
  onOpenProModal: () => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => boolean;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isPro,
  theme,
  onToggleTheme,
  userAccount,
  onOpenAuthModal,
  onOpenTutorial,
  onClose,
  onOpenProModal,
  onExportData,
  onImportData,
  onResetData
}) => {
  const { language, setLanguage, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = onImportData(content);
        if (success) {
          alert('Data imported successfully!');
          onClose();
        } else {
          alert('Failed to import data. Please check JSON format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm(t.settingsModal.resetConfirm)) {
      onResetData();
      onClose();
    }
  };

  const isGuest = userAccount.provider === 'guest';

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

        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>
          {t.settingsModal.title}
        </h2>

        {/* 1. Account Section */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <UserCheck size={16} color="#0ea5e9" />
            <span>{t.settingsModal.account}</span>
          </label>

          <div
            style={{
              background: 'var(--bg-elevated)',
              borderRadius: 14,
              padding: '12px 14px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {isGuest ? t.auth.guestUser : userAccount.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: isGuest ? '#ef4444' : 'var(--text-muted)' }}>
                {isGuest ? t.auth.guestUnsavedWarning : userAccount.email}
              </div>
            </div>

            {isGuest ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  onOpenAuthModal();
                }}
                style={{ padding: '6px 10px', fontSize: '0.74rem' }}
              >
                <span>{t.auth.linkAccount}</span>
              </button>
            ) : (
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                {userAccount.provider.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* 2. Theme Section (Light vs Dark Mode) */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <Sun size={16} color="#f59e0b" />
            <span>{t.settingsModal.theme}</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                NativeService.triggerLightHaptic();
                onToggleTheme('light');
              }}
              style={{
                padding: '10px',
                borderRadius: 12,
                fontSize: '0.82rem',
                fontWeight: theme === 'light' ? 800 : 500,
                background: theme === 'light' ? 'rgba(244, 63, 94, 0.15)' : 'var(--bg-elevated)',
                color: theme === 'light' ? '#f43f5e' : 'var(--text-primary)',
                border: theme === 'light' ? '1.5px solid #f43f5e' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <Sun size={15} />
              <span>{t.settingsModal.themeLight}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                NativeService.triggerLightHaptic();
                onToggleTheme('dark');
              }}
              style={{
                padding: '10px',
                borderRadius: 12,
                fontSize: '0.82rem',
                fontWeight: theme === 'dark' ? 800 : 500,
                background: theme === 'dark' ? 'rgba(244, 63, 94, 0.15)' : 'var(--bg-elevated)',
                color: theme === 'dark' ? '#f43f5e' : 'var(--text-primary)',
                border: theme === 'dark' ? '1.5px solid #f43f5e' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <Moon size={15} />
              <span>{t.settingsModal.themeDark}</span>
            </button>
          </div>
        </div>

        {/* 3. Language Section */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <Globe size={16} color="#38bdf8" />
            <span>{t.settingsModal.language}</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                NativeService.triggerLightHaptic();
                setLanguage('ja');
              }}
              style={{
                padding: '10px',
                borderRadius: 12,
                fontSize: '0.85rem',
                fontWeight: language === 'ja' ? 800 : 500,
                background: language === 'ja' ? 'rgba(244, 63, 94, 0.15)' : 'var(--bg-elevated)',
                color: language === 'ja' ? '#f43f5e' : 'var(--text-primary)',
                border: language === 'ja' ? '1.5px solid #f43f5e' : '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}
            >
              🇯🇵 日本語
            </button>
            <button
              type="button"
              onClick={() => {
                NativeService.triggerLightHaptic();
                setLanguage('en');
              }}
              style={{
                padding: '10px',
                borderRadius: 12,
                fontSize: '0.85rem',
                fontWeight: language === 'en' ? 800 : 500,
                background: language === 'en' ? 'rgba(244, 63, 94, 0.15)' : 'var(--bg-elevated)',
                color: language === 'en' ? '#f43f5e' : 'var(--text-primary)',
                border: language === 'en' ? '1.5px solid #f43f5e' : '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* 4. Membership Status */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <Crown size={16} color="#f59e0b" />
            <span>{t.settingsModal.proPlan}</span>
          </label>
          {isPro ? (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 12,
                padding: '10px 14px',
                color: '#10b981',
                fontSize: '0.84rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <ShieldCheck size={18} />
              <span>{t.settingsModal.proActive}</span>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onOpenProModal();
              }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#ffffff',
                padding: '10px',
                fontSize: '0.86rem',
                fontWeight: 800
              }}
            >
              <Crown size={16} />
              <span>{t.settingsModal.proUpgrade}</span>
            </button>
          )}
        </div>

        {/* 5. Tutorial / User Guide */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <BookOpen size={16} color="#8b5cf6" />
            <span>{t.settingsModal.tutorialTitle}</span>
          </label>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              NativeService.triggerLightHaptic();
              onClose();
              onOpenTutorial();
            }}
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: 14,
              fontSize: '0.86rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <BookOpen size={16} color="#8b5cf6" />
            <span>{t.settingsModal.tutorialBtn}</span>
          </button>
        </div>

        {/* 6. Data Backup / Export */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
            {t.settingsModal.exportData}
          </label>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: 8 }}>
            {t.settingsModal.exportDesc}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onExportData}
              style={{ fontSize: '0.8rem', padding: '8px' }}
            >
              <Download size={15} />
              <span>{t.settingsModal.exportBtn}</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              style={{ fontSize: '0.8rem', padding: '8px' }}
            >
              <Upload size={15} />
              <span>{t.settingsModal.importBtn}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* 6. Reset All Data */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleReset}
            style={{ width: '100%', color: '#ef4444', fontSize: '0.82rem', gap: 6 }}
          >
            <RotateCcw size={15} />
            <span>{t.settingsModal.resetBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
