import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Crown, CheckCircle, Sparkles, X, Shield, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { purchaseService } from '../services/purchaseService';
import { PurchasesPackage } from '@revenuecat/purchases-capacitor';

interface ProUpgradeModalProps {
  isPro: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
  onRestoreSuccess: () => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isPro,
  onClose,
  onUpgradeSuccess,
  onRestoreSuccess
}) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [proPackage, setProPackage] = useState<PurchasesPackage | null>(null);
  const [displayPrice, setDisplayPrice] = useState<string>(t.pro.price);

  useEffect(() => {
    purchaseService.getOfferings().then((offerings) => {
      if (offerings && offerings.current && offerings.current.availablePackages.length > 0) {
        const pkg = offerings.current.availablePackages[0];
        setProPackage(pkg);
        if (pkg.product && pkg.product.priceString) {
          setDisplayPrice(pkg.product.priceString);
        }
      }
    });
  }, [t.pro.price]);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      if (proPackage) {
        const res = await purchaseService.purchasePackage(proPackage);
        if (res.success) {
          onUpgradeSuccess();
          try {
            confetti({
              particleCount: 80,
              spread: 80,
              origin: { y: 0.6 }
            });
          } catch {
            // ignore
          }
          setToastMsg(t.pro.activatedSuccess);
          setTimeout(() => {
            setToastMsg(null);
            onClose();
          }, 1200);
        }
      } else {
        // Fallback for dev / unconfigured store keys
        const res = await purchaseService.purchasePackage(null as any);
        if (res.success) {
          onUpgradeSuccess();
          try {
            confetti({
              particleCount: 80,
              spread: 80,
              origin: { y: 0.6 }
            });
          } catch {
            // ignore
          }
          setToastMsg(t.pro.activatedSuccess);
          setTimeout(() => {
            setToastMsg(null);
            onClose();
          }, 1200);
        }
      }
    } catch (e) {
      console.error('Purchase failed', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const res = await purchaseService.restorePurchases();
      if (res.isPro) {
        onRestoreSuccess();
        setToastMsg(t.pro.restoredSuccess);
        setTimeout(() => {
          setToastMsg(null);
          onClose();
        }, 1200);
      } else {
        setToastMsg('No active subscription found');
        setTimeout(() => setToastMsg(null), 2000);
      }
    } catch (e) {
      console.error('Restore failed', e);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Shield size={20} color="#f59e0b" />,
      title: t.pro.feature1Title,
      desc: t.pro.feature1Desc
    }
  ];

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
          maxWidth: 390,
          background: 'var(--bg-card-solid)',
          borderRadius: 24,
          border: '1px solid var(--border-subtle)',
          padding: '26px 20px 22px',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative'
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

        {/* Hero Crown & Title */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
              marginBottom: 10
            }}
          >
            <Crown size={28} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            {t.pro.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: 4, lineHeight: 1.4 }}>
            {t.pro.subtitle}
          </p>
        </div>

        {/* Perks list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {features.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                background: 'var(--bg-elevated)',
                padding: '12px 14px',
                borderRadius: 14,
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ marginTop: 2 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action button */}
        {isPro ? (
          <div
            style={{
              textAlign: 'center',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 14,
              padding: '12px',
              color: '#10b981',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            <CheckCircle size={18} />
            <span>{t.pro.activeStatus}</span>
          </div>
        ) : (
          <div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePurchase}
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '0.95rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#ffffff',
                boxShadow: '0 4px 18px rgba(245, 158, 11, 0.4)',
                borderRadius: 14,
                gap: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>{`${t.pro.unlockBtn} • ${displayPrice}`}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleRestore}
              disabled={loading}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.76rem',
                cursor: 'pointer',
                marginTop: 10,
                textAlign: 'center'
              }}
            >
              {t.pro.restoreBtn}
            </button>
          </div>
        )}

        {/* Toast Feedback */}
        {toastMsg && (
          <div
            className="animate-fade-in"
            style={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              right: 20,
              background: '#10b981',
              color: '#ffffff',
              padding: '10px 14px',
              borderRadius: 10,
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '0.82rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
            }}
          >
            {toastMsg}
          </div>
        )}
      </div>
    </div>
  );
};
