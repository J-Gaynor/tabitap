import { Language, RegionId, VisitStatus } from '../types';

export interface Translations {
  appName: string;
  appTagline: string;
  home: string;
  myMaps: string;
  createMap: string;
  joinMap: string;
  mapLimitReached: string;
  mapLimitDesc: string;
  settings: string;
  share: string;
  shareMap: string;
  shareDesc: string;
  copyLink: string;
  linkCopied: string;
  roomCode: string;
  copyCode: string;
  codeCopied: string;
  enterRoomCode: string;
  joinButton: string;
  collaborators: string;
  makerRole: string;
  collaboratorRole: string;
  youBadge: string;
  mapSettings: string;
  mapTitle: string;
  mapTitlePlaceholder: string;
  mapDescription: string;
  mapDescriptionPlaceholder: string;
  mapEmoji: string;
  deleteMap: string;
  deleteMapConfirm: string;
  saveChanges: string;
  cancel: string;
  close: string;
  auth: {
    title: string;
    subtitle: string;
    continueGoogle: string;
    continueApple: string;
    continueGuest: string;
    guestWarningTitle: string;
    guestWarningDesc: string;
    guestProceed: string;
    linkAccount: string;
    accountLinked: string;
    signOut: string;
    loggedInAs: string;
    guestUser: string;
    guestUnsavedWarning: string;
  };
  stats: {
    visited: string;
    percentage: string;
    targetTitle: string;
    levelMaster: string;
    levelAdvanced: string;
    levelIntermediate: string;
    levelBeginner: string;
    levelStarter: string;
    zoomHint: string;
  };
  statuses: Record<VisitStatus, string>;
  regions: Record<RegionId, string>;
  prefectureModal: {
    visitedTitle: string;
    selectColor: string;
    customColor: string;
    visitDate: string;
    rating: string;
    notes: string;
    notesPlaceholder: string;
    capital: string;
    famousFor: string;
    save: string;
    clear: string;
    savedSuccess: string;
  };
  palette: {
    sakura: string;
    matcha: string;
    fuji: string;
    coral: string;
    gold: string;
    lavender: string;
    tangerine: string;
    slate: string;
  };
  createMapModal: {
    title: string;
    typePersonal: string;
    typePersonalDesc: string;
    typeShared: string;
    typeSharedDesc: string;
    yourName: string;
    yourNamePlaceholder: string;
    createBtn: string;
    joinTab: string;
    createTab: string;
    joinInputPlaceholder: string;
    joinSubmit: string;
    mapNotFound: string;
    alreadyJoined: string;
  };
  pro: {
    badge: string;
    title: string;
    subtitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    feature4Title: string;
    feature4Desc: string;
    price: string;
    unlockBtn: string;
    activeStatus: string;
    restoreBtn: string;
    restoredSuccess: string;
    activatedSuccess: string;
  };
  ads: {
    sponsored: string;
    removeAds: string;
    sampleAd1Title: string;
    sampleAd1Desc: string;
    sampleAd2Title: string;
    sampleAd2Desc: string;
    sampleAd3Title: string;
    sampleAd3Desc: string;
  };
  settingsModal: {
    title: string;
    account: string;
    language: string;
    japanese: string;
    english: string;
    theme: string;
    themeDark: string;
    themeLight: string;
    proPlan: string;
    proActive: string;
    proUpgrade: string;
    exportData: string;
    exportDesc: string;
    exportBtn: string;
    importBtn: string;
    resetAll: string;
    resetDesc: string;
    resetBtn: string;
    resetConfirm: string;
    deleteAccountBtn: string;
    deleteAccountConfirm: string;
    tutorialTitle: string;
    tutorialBtn: string;
  };
  tutorial: {
    skip: string;
    next: string;
    prev: string;
    getStarted: string;
    slide1Badge: string;
    slide1Title: string;
    slide1Desc: string;
    slide1Highlight1: string;
    slide1Highlight2: string;
    slide2Badge: string;
    slide2Title: string;
    slide2Desc: string;
    slide2Highlight1: string;
    slide2Highlight2: string;
    slide3Badge: string;
    slide3Title: string;
    slide3Desc: string;
    slide3Highlight1: string;
    slide3Highlight2: string;
    slide4Badge: string;
    slide4Title: string;
    slide4Desc: string;
    slide4Highlight1: string;
    slide4Highlight2: string;
  };
  mapActions: {
    zoomIn: string;
    zoomOut: string;
    resetZoom: string;
    swipeLeft: string;
    swipeRight: string;
    mapOf: string;
  };
}

export const translations: Record<Language, Translations> = {
  ja: {
    appName: 'TabiTap (旅タップ)',
    appTagline: '旅タップ - 日本全国47都道府県トラベルマップ',
    home: 'マップ',
    myMaps: 'マイマップ一覧',
    createMap: '新しいマップを作成',
    joinMap: '参加する',
    mapLimitReached: 'マップ上限（最大10個）に達しました',
    mapLimitDesc: '新しいマップを作成するには、不要なマップを削除してください。',
    settings: '設定',
    share: '共有',
    shareMap: 'マップを友達と共有',
    shareDesc: 'このマップの招待コードやリンクを友達に送ると、みんなで一緒に訪問履歴を記録・編集できます。',
    copyLink: '招待リンクをコピー',
    linkCopied: 'リンクをコピーしました！',
    roomCode: '共有コード',
    copyCode: 'コードをコピー',
    codeCopied: 'コードをコピーしました！',
    enterRoomCode: '6桁のコードを入力',
    joinButton: 'マップに参加',
    collaborators: '参加メンバー',
    makerRole: '作成者（管理者）',
    collaboratorRole: '編集メンバー',
    youBadge: 'あなた',
    mapSettings: 'マップ設定',
    mapTitle: 'マップ名',
    mapTitlePlaceholder: '例: 2026年 温泉巡り旅',
    mapDescription: '説明・メモ',
    mapDescriptionPlaceholder: '例: 夫婦で巡った温泉地の記録',
    mapEmoji: 'アイコン絵文字',
    deleteMap: 'マップを削除',
    deleteMapConfirm: 'このマップを削除してもよろしいですか？この操作は取り消せません。',
    saveChanges: '設定を保存',
    cancel: 'キャンセル',
    close: '閉じる',
    auth: {
      title: 'アカウント連携・ログイン',
      subtitle: 'ログインすると複数のスマホやタブレットでマップをリアルタイム同期・バックアップできます。',
      continueGoogle: 'Google アカウントで続ける',
      continueApple: 'Apple でサインイン',
      continueGuest: 'アカウント連携せずに使う（ゲスト）',
      guestWarningTitle: 'ゲスト利用に関するご注意',
      guestWarningDesc: 'アカウント連携を行わない場合、機種変更やアプリ削除時にマップデータが失われる可能性があります。いつでも設定画面からアカウントを連携できます。',
      guestProceed: 'データを保存せずゲストとして進む',
      linkAccount: 'アカウントを連携する',
      accountLinked: 'アカウント連携済み',
      signOut: 'ログアウト',
      loggedInAs: 'ログイン中',
      guestUser: 'ゲスト（未ログイン）',
      guestUnsavedWarning: '未連携のゲストデータです。設定から連携してください。'
    },
    stats: {
      visited: '訪問済み都道府県',
      percentage: '制覇率',
      targetTitle: '47都道府県制覇',
      levelMaster: '全国制覇マスター',
      levelAdvanced: '日本探検家',
      levelIntermediate: '週末トラベラー',
      levelBeginner: '旅のビギナー',
      levelStarter: '旅立ちの第一歩',
      zoomHint: 'ピンチで拡大・縮小'
    },
    statuses: {
      visited: '行った！',
      want_to_go: '行きたい！',
      lived: '住んでいた',
      passed: '通過した',
      none: '未設定'
    },
    regions: {
      hokkaido: '北海道地方',
      tohoku: '東北地方',
      kanto: '関東地方',
      chubu: '中部地方',
      kansai: '関西地方',
      chugoku: '中国地方',
      shikoku: '四国地方',
      kyushu: '九州地方',
      okinawa: '沖縄地方'
    },
    prefectureModal: {
      visitedTitle: '訪問ステータス',
      selectColor: 'マップのカラーを選択',
      customColor: 'カスタム色',
      visitDate: '訪問年月 (任意)',
      rating: 'おすすめ度・お気に入り度',
      notes: '旅の思い出・メモ',
      notesPlaceholder: '訪れた観光地、美味しかった名物、楽しかったエピソードなど...',
      capital: '県庁所在地',
      famousFor: '名所・名物',
      save: '記録を保存する',
      clear: 'この都道府県をリセット',
      savedSuccess: '記録を保存しました！'
    },
    palette: {
      sakura: '桜色 (Sakura)',
      matcha: '抹茶 (Matcha)',
      fuji: '富士藍 (Indigo)',
      coral: '珊瑚 (Coral)',
      gold: '黄金 (Gold)',
      lavender: '富良野紫 (Lavender)',
      tangerine: '蜜柑 (Orange)',
      slate: '利休鼠 (Slate)'
    },
    createMapModal: {
      title: '新しいマップを作成',
      typePersonal: '個人用マップ',
      typePersonalDesc: '自分だけの旅行記録・行った場所マップ',
      typeShared: '共有マップ (TabiTap)',
      typeSharedDesc: '恋人・友達・家族を招待して一緒に編集できるマップ',
      yourName: 'あなたのニックネーム',
      yourNamePlaceholder: '例: たろう',
      createBtn: 'マップを作成する',
      joinTab: 'コードで参加',
      createTab: '新規作成',
      joinInputPlaceholder: '例: JP-8921',
      joinSubmit: '参加する',
      mapNotFound: '指定されたコードのマップが見つかりませんでした。',
      alreadyJoined: '既にこのマップに参加しています。'
    },
    pro: {
      badge: 'PRO',
      title: '広告非表示 (Ad-Free)',
      subtitle: 'すべての画面のバナー広告を消去して快適に利用',
      feature1Title: '広告の完全非表示',
      feature1Desc: '画面上下のすべてのバナー広告やPR表示を消去して、地図を広く快適に楽しめます。',
      feature2Title: '',
      feature2Desc: '',
      feature3Title: '',
      feature3Desc: '',
      feature4Title: '',
      feature4Desc: '',
      price: '¥500（買い切り）',
      unlockBtn: '広告を非表示にする',
      activeStatus: '広告非表示プラン有効中（広告なし）',
      restoreBtn: '購入履歴を復元',
      restoredSuccess: '購入履歴を復元しました！',
      activatedSuccess: '広告非表示プランが有効になりました！ありがとうございます🎉'
    },
    ads: {
      sponsored: 'スポンサー PR',
      removeAds: '広告を外す (Pro)',
      sampleAd1Title: '【全国対応】JR乗り放題パス＆新幹線チケット予約',
      sampleAd1Desc: '日本全国をお得に巡ろう！最大30%OFFキャンペーン実施中。',
      sampleAd2Title: '【厳選旅館】露天風呂付き客室で過ごす極上のひととき',
      sampleAd2Desc: '今だけの直前割プラン掲載中。全国の人気温泉宿をチェック。',
      sampleAd3Title: '【日本旅行eSIM】高速データ無制限・即日開通',
      sampleAd3Desc: '旅先でもサクサク快適！QRコード読み取りだけで簡単設定。'
    },
    settingsModal: {
      title: 'アプリ設定',
      account: 'アカウント管理',
      language: '表示言語 (Language)',
      japanese: '日本語 (Japanese)',
      english: 'English (英語)',
      theme: '外観テーマ (Appearance)',
      themeDark: '🌙 ダークモード (ナイト)',
      themeLight: '☀️ ライトモード (標準・おすすめ)',
      proPlan: 'プラン状態',
      proActive: 'PRO 会員（広告非表示）',
      proUpgrade: 'PRO にアップグレード（広告を消す）',
      exportData: 'データ管理',
      exportDesc: 'すべてのマップデータをJSONファイルとしてバックアップします。',
      exportBtn: 'データをエクスポート',
      importBtn: 'データをインポート',
      resetAll: 'データ初期化',
      resetDesc: 'すべてのマップと記録を初期状態に戻します。',
      resetBtn: '全データを初期化',
      resetConfirm: 'すべてのデータが消去されます。本当によろしいですか？',
      deleteAccountBtn: 'アカウントを削除してデータを全消去',
      deleteAccountConfirm: 'アカウント情報およびクラウド・端末上のすべてのマップデータが完全に削除されます。本当に削除しますか？',
      tutorialTitle: '使い方ガイド',
      tutorialBtn: '使い方ガイド・チュートリアルを見る'
    },
    tutorial: {
      skip: 'スキップ',
      next: '次へ',
      prev: '前へ',
      getStarted: 'さっそくはじめる！',
      slide1Badge: '🗾 日本全国トラベルマップ',
      slide1Title: 'TabiTap (旅タップ) へようこそ！',
      slide1Desc: '訪れたことのある都道府県をカラフルに記録できる、旅の思い出アプリです。47都道府県の制覇を目指しましょう！',
      slide1Highlight1: '🗾 公式境界データに基づく正確で美しい日本地図',
      slide1Highlight2: '📊 制覇率・レベルバッジがリアルタイムで更新',
      slide2Badge: '🎨 タップでかんたん記録',
      slide2Title: '都道府県をタップして彩ろう',
      slide2Desc: '地図上の都道府県をタップすると詳細画面が開きます。「行った」「住んでいた」「行きたい」などのステータスを選び、お好みの和風カラーで地図を染められます。',
      slide2Highlight1: '🌸 10色の和風プリセット＋自由なカラーパレット',
      slide2Highlight2: '⭐ 訪問日、おすすめ度星評価、旅のメモも記録可能',
      slide3Badge: '🗺️ 最大10個のマップ & 共有',
      slide3Title: '旅仲間や家族と一緒に記録',
      slide3Desc: '右にスワイプするとマップ一覧画面へ。用途に合わせて最大10個のマップを作成できます。6桁の招待コードを共有すれば、友達と一緒にリアルタイムで色塗りを楽しめます！',
      slide3Highlight1: '👥 共有コードで簡単招待・みんなで同時更新',
      slide3Highlight2: '🔒 作成者（管理者）と編集メンバーの安心権限管理',
      slide4Badge: '🔍 ズーム操作 & いつでも再確認',
      slide4Title: '快適な操作と安心のデータ保存',
      slide4Desc: 'ピンチ操作や拡大ボタンで小さな都道府県もらくらく確認。言語切替（日本語/英語）やダークモードも設定可能。このガイドは設定画面からいつでも見返せます！',
      slide4Highlight1: '📱 片手でも操作しやすいスマホ最適化UI',
      slide4Highlight2: '💾 バックアップとクラウド同期でデータも安心'
    },
    mapActions: {
      zoomIn: '拡大',
      zoomOut: '縮小',
      resetZoom: '全体表示',
      swipeLeft: '前のマップ',
      swipeRight: '次のマップ',
      mapOf: 'マップ'
    }
  },
  en: {
    appName: 'TabiTap (旅タップ)',
    appTagline: 'TabiTap - Japan 47 Prefectures Travel Map',
    home: 'Map',
    myMaps: 'All Maps',
    createMap: 'Create New Map',
    joinMap: 'Join Map',
    mapLimitReached: 'Map limit reached (Max 10 maps)',
    mapLimitDesc: 'To create a new map, please delete an existing one first.',
    settings: 'Settings',
    share: 'Share',
    shareMap: 'Share Map with Friends',
    shareDesc: 'Send this invite code or link to friends so everyone can mark and color prefectures together in real-time.',
    copyLink: 'Copy Invite Link',
    linkCopied: 'Link copied to clipboard!',
    roomCode: 'Join Code',
    copyCode: 'Copy Code',
    codeCopied: 'Code copied to clipboard!',
    enterRoomCode: 'Enter 6-digit room code',
    joinButton: 'Join Map',
    collaborators: 'Collaborators',
    makerRole: 'Creator (Admin)',
    collaboratorRole: 'Editor',
    youBadge: 'You',
    mapSettings: 'Map Settings',
    mapTitle: 'Map Title',
    mapTitlePlaceholder: 'e.g. 2026 Onsen Trip',
    mapDescription: 'Description / Notes',
    mapDescriptionPlaceholder: 'e.g. Travel memories across Japan',
    mapEmoji: 'Icon Emoji',
    deleteMap: 'Delete Map',
    deleteMapConfirm: 'Are you sure you want to delete this map? This action cannot be undone.',
    saveChanges: 'Save Settings',
    cancel: 'Cancel',
    close: 'Close',
    auth: {
      title: 'Account & Cloud Backup',
      subtitle: 'Sign in to automatically sync and backup your maps across your iPhone, iPad, and devices.',
      continueGoogle: 'Continue with Google',
      continueApple: 'Sign in with Apple',
      continueGuest: 'Continue without Account (Guest)',
      guestWarningTitle: 'Guest Mode Notice',
      guestWarningDesc: 'Maps created in guest mode are stored locally. If you delete the app or switch devices, data might be lost unless you link an account.',
      guestProceed: 'Proceed as Guest',
      linkAccount: 'Link Account',
      accountLinked: 'Account Linked',
      signOut: 'Sign Out',
      loggedInAs: 'Signed In',
      guestUser: 'Guest (Local Only)',
      guestUnsavedWarning: 'Unlinked guest data. Link account in Settings.'
    },
    stats: {
      visited: 'Visited Prefectures',
      percentage: 'Conquest Rate',
      targetTitle: 'All 47 Prefectures',
      levelMaster: 'National Master',
      levelAdvanced: 'Japan Explorer',
      levelIntermediate: 'Weekend Traveler',
      levelBeginner: 'Travel Novice',
      levelStarter: 'First Step',
      zoomHint: 'Pinch to zoom in / out'
    },
    statuses: {
      visited: 'Visited!',
      want_to_go: 'Want to Go!',
      lived: 'Lived Here',
      passed: 'Passed Through',
      none: 'Unmarked'
    },
    regions: {
      hokkaido: 'Hokkaido',
      tohoku: 'Tohoku',
      kanto: 'Kanto',
      chubu: 'Chubu',
      kansai: 'Kansai',
      chugoku: 'Chugoku',
      shikoku: 'Shikoku',
      kyushu: 'Kyushu',
      okinawa: 'Okinawa'
    },
    prefectureModal: {
      visitedTitle: 'Visit Status',
      selectColor: 'Select Map Color',
      customColor: 'Custom Color',
      visitDate: 'Visit Date (Optional)',
      rating: 'Rating & Recommendation',
      notes: 'Travel Notes & Memories',
      notesPlaceholder: 'Places visited, local delicacies, memorable moments...',
      capital: 'Capital City',
      famousFor: 'Highlights & Specialities',
      save: 'Save Changes',
      clear: 'Reset Prefecture',
      savedSuccess: 'Prefecture record saved!'
    },
    palette: {
      sakura: 'Sakura Pink',
      matcha: 'Matcha Green',
      fuji: 'Fuji Indigo',
      coral: 'Sunset Coral',
      gold: 'Kyoto Gold',
      lavender: 'Furano Lavender',
      tangerine: 'Mikan Orange',
      slate: 'Sleek Grey'
    },
    createMapModal: {
      title: 'Create New Map',
      typePersonal: 'Personal Map',
      typePersonalDesc: 'Your own private Japan travel scratch map',
      typeShared: 'Shared Map (TabiTap)',
      typeSharedDesc: 'Invite friends, partner, or family to mark and color together',
      yourName: 'Your Nickname',
      yourNamePlaceholder: 'e.g. Alex',
      createBtn: 'Create Map',
      joinTab: 'Join with Code',
      createTab: 'New Map',
      joinInputPlaceholder: 'e.g. JP-8921',
      joinSubmit: 'Join Map',
      mapNotFound: 'No map found with this invite code.',
      alreadyJoined: 'You are already a member of this map.'
    },
    pro: {
      badge: 'PRO',
      title: 'Remove Ads (Ad-Free)',
      subtitle: 'Remove all banner ads across the app for a distraction-free experience',
      feature1Title: '100% Ad-Free Experience',
      feature1Desc: 'Removes all banner ads and sponsored blocks, keeping the map clean and immersive.',
      feature2Title: '',
      feature2Desc: '',
      feature3Title: '',
      feature3Desc: '',
      feature4Title: '',
      feature4Desc: '',
      price: '$2.99 (One-time purchase)',
      unlockBtn: 'Remove Ads',
      activeStatus: 'Ad-Free Plan Active (No Ads)',
      restoreBtn: 'Restore Purchases',
      restoredSuccess: 'Purchases restored successfully!',
      activatedSuccess: 'Ad-Free plan unlocked! Thank you for your support🎉'
    },
    ads: {
      sponsored: 'Sponsored PR',
      removeAds: 'Remove Ads (Pro)',
      sampleAd1Title: '【Japan Travel】JR Rail Pass & Shinkansen Booking',
      sampleAd1Desc: 'Explore Japan with unlimited train rides. Special seasonal discounts.',
      sampleAd2Title: '【Luxury Ryokan】Authentic Onsen & Kaiseki Experience',
      sampleAd2Desc: 'Book top-rated traditional Japanese hot spring inns with private onsen.',
      sampleAd3Title: '【Japan eSIM】Unlimited 5G Data & Instant Activation',
      sampleAd3Desc: 'Stay connected everywhere across all 47 prefectures with zero roaming fees.'
    },
    settingsModal: {
      title: 'Settings',
      account: 'Account & Sync',
      language: 'Language',
      japanese: '日本語 (Japanese)',
      english: 'English',
      theme: 'Theme & Appearance',
      themeDark: '🌙 Dark Mode (Night)',
      themeLight: '☀️ Light Mode (Default)',
      proPlan: 'Membership',
      proActive: 'PRO Active (No Ads)',
      proUpgrade: 'Upgrade to PRO (Remove Ads)',
      exportData: 'Data Management',
      exportDesc: 'Backup all your maps and travel notes into a JSON file.',
      exportBtn: 'Export All Maps',
      importBtn: 'Import Maps JSON',
      resetAll: 'Reset All Data',
      resetDesc: 'Clear all local maps and start fresh.',
      resetBtn: 'Reset All Data',
      resetConfirm: 'All maps and notes will be deleted. Are you sure?',
      deleteAccountBtn: 'Delete Account & Erase All Data',
      deleteAccountConfirm: 'Your account and all associated maps/records will be permanently deleted. Are you sure you want to proceed?',
      tutorialTitle: 'How to Use',
      tutorialBtn: 'View App Tutorial & Guide'
    },
    tutorial: {
      skip: 'Skip',
      next: 'Next',
      prev: 'Back',
      getStarted: 'Get Started!',
      slide1Badge: '🗾 Japan Travel Scratch Map',
      slide1Title: 'Welcome to TabiTap!',
      slide1Desc: 'Track visited prefectures across all 47 regions of Japan. Create personalized travel memories with vibrant colors and journal notes!',
      slide1Highlight1: '🗾 Authentic, high-precision vector Japan map',
      slide1Highlight2: '📊 Real-time prefecture count & achievement badges',
      slide2Badge: '🎨 Tap to Record & Color',
      slide2Title: 'Mark & Personalize Prefectures',
      slide2Desc: 'Tap any prefecture on the map to open its details. Mark your status (Visited, Want to go, Lived, Passed through) and paint the map with 10 aesthetic Japanese color presets or custom hues.',
      slide2Highlight1: '🌸 10 Japanese color presets & full custom color picker',
      slide2Highlight2: '⭐ Add visit dates, 1-5 star ratings, and journal notes',
      slide3Badge: '🗺️ Up to 10 Maps & Sharing',
      slide3Title: 'Collaborate with Friends & Family',
      slide3Desc: 'Swipe right to view your maps directory and create up to 10 unique maps (solo trips, onsen bucket list, family memories). Share a 6-digit room code with travel buddies to color together in real-time!',
      slide3Highlight1: '👥 Real-time co-op marking with simple 6-digit room codes',
      slide3Highlight2: '🔒 Secure Maker (Admin) vs Collaborator role permissions',
      slide4Badge: '🔍 Zoom, Themes & Offline Ready',
      slide4Title: 'Seamless Navigation & Re-access',
      slide4Desc: 'Pinch or use zoom controls to easily see smaller prefectures. Switch between English & Japanese, toggle Dark Mode, and backup data. You can re-open this tutorial anytime from Settings!',
      slide4Highlight1: '📱 Drag to pan smoothly; tap to open details',
      slide4Highlight2: '⚙️ Re-access this guide anytime from the Settings menu'
    },
    mapActions: {
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      resetZoom: 'Fit Map',
      swipeLeft: 'Previous Map',
      swipeRight: 'Next Map',
      mapOf: 'Map'
    }
  }
};
