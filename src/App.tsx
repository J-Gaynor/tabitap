import React, { useState, useEffect } from 'react';
import { useMapStore } from './store/useMapStore';
import { PrefectureMeta } from './types';
import { JapanMap } from './components/JapanMap';
import { StatsBar } from './components/StatsBar';
import { MapHeader } from './components/MapHeader';
import { AdBanner } from './components/AdBanner';
import { SwipeContainer } from './components/SwipeContainer';
import { PrefectureModal } from './components/PrefectureModal';
import { ShareModal } from './components/ShareModal';
import { MapSettingsModal } from './components/MapSettingsModal';
import { ProUpgradeModal } from './components/ProUpgradeModal';
import { SettingsModal } from './components/SettingsModal';
import { CreateMapPage } from './components/CreateMapPage';
import { AuthModal } from './components/AuthModal';
import { TutorialModal } from './components/TutorialModal';
import { NativeService } from './services/nativeService';
import { adService } from './services/adService';

export const App: React.FC = () => {
  const {
    userId,
    userName,
    userAccount,
    setUserAccount,
    theme,
    setTheme,
    isPro,
    setIsPro,
    maps,
    activeMap,
    activeMapIndex,
    setActiveMapIndex,
    isOwner,
    updatePrefecture,
    clearPrefecture,
    createMap,
    joinMapByCode,
    updateMapSettings,
    deleteMap,
    exportAllData,
    importData,
    resetAllData,
    deleteAccount
  } = useMapStore();

  // Navigation / View state
  const [view, setView] = useState<'map' | 'directory'>('map');

  // Modal States
  const [selectedPrefecture, setSelectedPrefecture] = useState<PrefectureMeta | null>(null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showMapSettingsModal, setShowMapSettingsModal] = useState<boolean>(false);
  const [showProModal, setShowProModal] = useState<boolean>(false);
  const [showGlobalSettingsModal, setShowGlobalSettingsModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showTutorialModal, setShowTutorialModal] = useState<boolean>(false);

  // Check URL query parameters for shared room invite and auto-show tutorial on first launch
  useEffect(() => {
    NativeService.configureStatusBar();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const openPro = params.get('openPro') === 'true';
      if (openPro) {
        setShowProModal(true);
      } else {
        const seen = localStorage.getItem('issho_tutorial_seen');
        if (seen !== 'true') {
          setShowTutorialModal(true);
        }
      }

      const room = params.get('room');
      if (room) {
        joinMapByCode(room, userName);
        // Clear param after joining
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [joinMapByCode, userName]);

  useEffect(() => {
    adService.showBanner(isPro);
  }, [isPro]);

  // Swipe navigation handler
  const handleSwipeLeft = () => {
    // Only navigate to next existing map (never swipe into new map screen)
    if (activeMapIndex < maps.length - 1) {
      setActiveMapIndex(activeMapIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    // Previous map
    if (view === 'directory') {
      setView('map');
    } else if (activeMapIndex > 0) {
      setActiveMapIndex(activeMapIndex - 1);
    }
  };

  const currentVisitData = activeMap && selectedPrefecture
    ? activeMap.prefectures[selectedPrefecture.id]
    : undefined;

  return (
    <main className="app-container">
      <div className="mobile-frame">
        {/* Main Content Area */}
        {view === 'map' && activeMap ? (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
            {/* Header */}
            <MapHeader
              activeMap={activeMap}
              mapsCount={maps.length}
              activeMapIndex={activeMapIndex}
              isOwner={isOwner}
              isPro={isPro}
              onOpenShare={() => setShowShareModal(true)}
              onOpenMapSettings={() => setShowMapSettingsModal(true)}
              onOpenGlobalSettings={() => setShowGlobalSettingsModal(true)}
              onOpenProModal={() => setShowProModal(true)}
            />

            {/* Stats Bar */}
            <StatsBar mapData={activeMap} />

            {/* Swipeable Interactive Map Area */}
            <SwipeContainer
              currentIndex={activeMapIndex}
              totalCount={maps.length}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onOpenCreatePage={() => setView('directory')}
            >
              <JapanMap
                mapData={activeMap}
                onSelectPrefecture={(pref) => setSelectedPrefecture(pref)}
                selectedPrefId={selectedPrefecture?.id}
              />
            </SwipeContainer>

            {/* Mobile Banner Ad (Only rendered if free tier) */}
            <AdBanner
              isPro={isPro}
              onOpenProModal={() => setShowProModal(true)}
            />
          </div>
        ) : (
          <CreateMapPage
            maps={maps}
            currentUserId={userId}
            currentUserName={userName}
            activeMapIndex={activeMapIndex}
            onSelectMap={(idx) => {
              setActiveMapIndex(idx);
              setView('map');
            }}
            onBackToMap={() => setView('map')}
            onCreateMap={createMap}
            onJoinMap={joinMapByCode}
            onDeleteMap={deleteMap}
          />
        )}

        {/* MODALS */}
        {selectedPrefecture && (
          <PrefectureModal
            prefecture={selectedPrefecture}
            currentData={currentVisitData}
            onClose={() => setSelectedPrefecture(null)}
            onSave={(prefId, data) => updatePrefecture(prefId, data)}
            onClear={(prefId) => clearPrefecture(prefId)}
          />
        )}

        {showShareModal && activeMap && (
          <ShareModal
            mapData={activeMap}
            currentUserId={userId}
            onClose={() => setShowShareModal(false)}
          />
        )}

        {showMapSettingsModal && activeMap && (
          <MapSettingsModal
            mapData={activeMap}
            isOwner={isOwner}
            onClose={() => setShowMapSettingsModal(false)}
            onSave={(title, desc, emoji) => updateMapSettings(activeMap.id, title, desc, emoji)}
            onDelete={() => {
              deleteMap(activeMap.id);
              setShowMapSettingsModal(false);
            }}
          />
        )}

        {showProModal && (
          <ProUpgradeModal
            isPro={isPro}
            onClose={() => setShowProModal(false)}
            onUpgradeSuccess={() => setIsPro(true)}
            onRestoreSuccess={() => setIsPro(true)}
          />
        )}

        {showGlobalSettingsModal && (
          <SettingsModal
            isPro={isPro}
            theme={theme}
            onToggleTheme={setTheme}
            userAccount={userAccount}
            onOpenAuthModal={() => setShowAuthModal(true)}
            onOpenTutorial={() => setShowTutorialModal(true)}
            onClose={() => setShowGlobalSettingsModal(false)}
            onOpenProModal={() => setShowProModal(true)}
            onExportData={() => {
              const data = exportAllData();
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `tabitap_backup_${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
            }}
            onImportData={importData}
            onResetData={resetAllData}
            onDeleteAccount={deleteAccount}
          />
        )}

        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            currentProvider={userAccount.provider}
            onClose={() => setShowAuthModal(false)}
            onLoginSuccess={(provider, name, email) => {
              setUserAccount(provider, name, email);
            }}
            onContinueGuest={() => {
              setUserAccount('guest', 'ゲスト (Guest)', '');
            }}
          />
        )}

        {/* User Onboarding & Re-accessible Tutorial */}
        <TutorialModal
          isOpen={showTutorialModal}
          onClose={() => setShowTutorialModal(false)}
        />
      </div>
    </main>
  );
};
