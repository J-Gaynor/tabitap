const topojson = require('topojson-client');
const atlas = require('jpn-atlas/japan/japan.json');
const d3Geo = require('d3-geo');
const fs = require('fs');
const path = require('path');

const pathGen = d3Geo.geoPath();
const geojson = topojson.feature(atlas, atlas.objects.prefectures);

const geoMap = {};
geojson.features.forEach((f) => {
  const id = parseInt(f.id, 10);
  const pathD = pathGen(f);

  let center = pathGen.centroid(f);
  if (f.geometry.type === 'MultiPolygon') {
    let maxArea = 0;
    f.geometry.coordinates.forEach((coords) => {
      const subPoly = { type: 'Polygon', coordinates: coords };
      const bounds = pathGen.bounds(subPoly);
      const subArea = Math.abs((bounds[1][0] - bounds[0][0]) * (bounds[1][1] - bounds[0][1]));
      if (subArea > maxArea) {
        maxArea = subArea;
        center = pathGen.centroid(subPoly);
      }
    });
  }

  // Adjust centroids if needed for specific narrow prefectures
  let lx = Math.round(center[0]);
  let ly = Math.round(center[1]);
  if (id === 13) {
    // Tokyo mainland centroid
    lx = 453;
    ly = 308;
  } else if (id === 47) {
    // Okinawa main island centroid
    lx = 116;
    ly = 587;
  }

  geoMap[id] = {
    path: pathD,
    labelX: lx,
    labelY: ly
  };
});

const meta = [
  { id: 1, code: '01', nameJa: '北海道', nameEn: 'Hokkaido', kana: 'ほっかいどう', region: 'hokkaido', capitalJa: '札幌市', capitalEn: 'Sapporo', highlightJa: '富良野ラベンダー、海鮮丼、ニセコスキー、時計台', highlightEn: 'Furano Lavender, Fresh Seafood, Niseko Powder Snow' },
  { id: 2, code: '02', nameJa: '青森県', nameEn: 'Aomori', kana: 'あおもりけん', region: 'tohoku', capitalJa: '青森市', capitalEn: 'Aomori', highlightJa: 'ねぶた祭、十和田湖、奥入瀬渓流、青森りんご', highlightEn: 'Nebuta Festival, Lake Towada, Oirase Stream, Apples' },
  { id: 3, code: '03', nameJa: '岩手県', nameEn: 'Iwate', kana: 'いわてけん', region: 'tohoku', capitalJa: '盛岡市', capitalEn: 'Morioka', highlightJa: '中尊寺金色堂、わんこそば、三陸海岸、小岩井農場', highlightEn: 'Chuson-ji Golden Hall, Wanko Soba, Sanriku Coast' },
  { id: 4, code: '04', nameJa: '宮城県', nameEn: 'Miyagi', kana: 'みやぎけん', region: 'tohoku', capitalJa: '仙台市', capitalEn: 'Sendai', highlightJa: '松島（日本三景）、牛タン、仙台七夕まつり、瑞鳳殿', highlightEn: 'Matsushima Bay, Gyutan Beef Tongue, Tanabata Festival' },
  { id: 5, code: '05', nameJa: '秋田県', nameEn: 'Akita', kana: 'あきたけん', region: 'tohoku', capitalJa: '秋田市', capitalEn: 'Akita', highlightJa: '田沢湖、角館武家屋敷、きりたんぽ、乳頭温泉郷', highlightEn: 'Lake Tazawa, Kakunodate Samurai District, Nyuto Onsen' },
  { id: 6, code: '06', nameJa: '山形県', nameEn: 'Yamagata', kana: 'やまがたけん', region: 'tohoku', capitalJa: '山形市', capitalEn: 'Yamagata', highlightJa: '銀山温泉、蔵王樹氷、山寺（立石寺）、米沢牛', highlightEn: 'Ginzan Onsen, Zao Snow Monsters, Yamadera Temple, Yonezawa Beef' },
  { id: 7, code: '07', nameJa: '福島県', nameEn: 'Fukushima', kana: 'ふくしまけん', region: 'tohoku', capitalJa: '福島市', capitalEn: 'Fukushima', highlightJa: '大内宿、会津若松城（鶴ヶ城）、磐梯山、猪苗代湖', highlightEn: 'Ouchi-juku, Tsuruga Castle, Mt. Bandai, Lake Inawashiro' },
  { id: 8, code: '08', nameJa: '茨城県', nameEn: 'Ibaraki', kana: 'いばらきけん', region: 'kanto', capitalJa: '水戸市', capitalEn: 'Mito', highlightJa: '国営ひたち海浜公園のネモフィラ、偕楽園、筑波山', highlightEn: 'Hitachi Seaside Park Nemophila, Kairakuen Garden, Mt. Tsukuba' },
  { id: 9, code: '09', nameJa: '栃木県', nameEn: 'Tochigi', kana: 'とちぎけん', region: 'kanto', capitalJa: '宇都宮市', capitalEn: 'Utsunomiya', highlightJa: '日光東照宮、華厳の滝、宇都宮餃子、あしかがフラワーパーク', highlightEn: 'Nikko Toshogu, Kegon Falls, Utsunomiya Gyoza, Wisteria Park' },
  { id: 10, code: '10', nameJa: '群馬県', nameEn: 'Gunma', kana: 'ぐんまけん', region: 'kanto', capitalJa: '前橋市', capitalEn: 'Maebashi', highlightJa: '草津温泉、伊香保温泉、富岡製糸場、焼きまんじゅう', highlightEn: 'Kusatsu Onsen, Ikaho Onsen, Tomioka Silk Mill' },
  { id: 11, code: '11', nameJa: '埼玉県', nameEn: 'Saitama', kana: 'さいたまけん', region: 'kanto', capitalJa: 'さいたま市', capitalEn: 'Saitama', highlightJa: '川越小江戸の蔵造り、長瀞ライン下り、鉄道博物館', highlightEn: 'Kawagoe Little Edo, Nagatoro River Boating, Railway Museum' },
  { id: 12, code: '12', nameJa: '千葉県', nameEn: 'Chiba', kana: 'ちばけん', region: 'kanto', capitalJa: '千葉市', capitalEn: 'Chiba', highlightJa: '東京ディズニーリゾート、成田山新勝寺、鴨川シーワールド', highlightEn: 'Tokyo Disney Resort, Naritasan Shinshoji, Kamogawa Sea World' },
  { id: 13, code: '13', nameJa: '東京都', nameEn: 'Tokyo', kana: 'とうきょうと', region: 'kanto', capitalJa: '新宿区', capitalEn: 'Shinjuku', highlightJa: '東京タワー、浅草寺、渋谷スクランブル交差点、スカイツリー', highlightEn: 'Tokyo Tower, Senso-ji Temple, Shibuya Crossing, Skytree' },
  { id: 14, code: '14', nameJa: '神奈川県', nameEn: 'Kanagawa', kana: 'かながわけん', region: 'kanto', capitalJa: '横浜市', capitalEn: 'Yokohama', highlightJa: '横浜みなとみらい、箱根温泉、鎌倉大仏、江の島', highlightEn: 'Yokohama Minato Mirai, Hakone Onsen, Kamakura Great Buddha, Enoshima' },
  { id: 15, code: '15', nameJa: '新潟県', nameEn: 'Niigata', kana: 'にいがたけん', region: 'chubu', capitalJa: '新潟市', capitalEn: 'Niigata', highlightJa: '魚沼産コシヒカリ、佐渡金山、湯沢温泉リゾート、日本酒', highlightEn: 'Koshihikari Rice, Sado Island, Yuzawa Ski Resort, Premium Sake' },
  { id: 16, code: '16', nameJa: '富山県', nameEn: 'Toyama', kana: 'とやまけん', region: 'chubu', capitalJa: '富山市', capitalEn: 'Toyama', highlightJa: '立山黒部アルペンルートの雪の大谷、黒部ダム、富山湾の白えび', highlightEn: 'Tateyama Kurobe Alpine Route Snow Wall, Kurobe Dam, Toyama Bay' },
  { id: 17, code: '17', nameJa: '石川県', nameEn: 'Ishikawa', kana: 'いしかわけん', region: 'chubu', capitalJa: '金沢市', capitalEn: 'Kanazawa', highlightJa: '兼六園、金沢21世紀美術館、東茶屋街、能登半島', highlightEn: 'Kenroku-en Garden, 21st Century Museum, Higashi Chaya, Noto' },
  { id: 18, code: '18', nameJa: '福井県', nameEn: 'Fukui', kana: 'ふくいけん', region: 'chubu', capitalJa: '福井市', capitalEn: 'Fukui', highlightJa: '福井県立恐竜博物館、東尋坊、永平寺、越前ガニ', highlightEn: 'Fukui Dinosaur Museum, Tojinbo Cliffs, Eihei-ji Temple, Echizen Crab' },
  { id: 19, code: '19', nameJa: '山梨県', nameEn: 'Yamanashi', kana: 'やまなしけん', region: 'chubu', capitalJa: '甲府市', capitalEn: 'Kofu', highlightJa: '富士山、富士五湖、ほうとう、甲州ぶどう・ワイナリー', highlightEn: 'Mt. Fuji, Fuji Five Lakes, Hoto Noodles, Koshu Wineries' },
  { id: 20, code: '20', nameJa: '長野県', nameEn: 'Nagano', kana: 'ながのけん', region: 'chubu', capitalJa: '長野市', capitalEn: 'Nagano', highlightJa: '上高地、松本城、善光寺、白馬スノーリゾート、軽井沢', highlightEn: 'Kamikochi, Matsumoto Castle, Zenkoji, Hakuba Ski Resort, Karuizawa' },
  { id: 21, code: '21', nameJa: '岐阜県', nameEn: 'Gifu', kana: 'ぎふけん', region: 'chubu', capitalJa: '岐阜市', capitalEn: 'Gifu', highlightJa: '白川郷合掌造り集落、飛騨高山、下呂温泉、飛騨牛', highlightEn: 'Shirakawa-go Historic Village, Hida Takayama, Gero Onsen, Hida Beef' },
  { id: 22, code: '22', nameJa: '静岡県', nameEn: 'Shizuoka', kana: 'しずおかけん', region: 'chubu', capitalJa: '静岡市', capitalEn: 'Shizuoka', highlightJa: '富士山南麓、伊豆半島温泉郷、三島スカイウォーク、静岡茶', highlightEn: 'Mt. Fuji South, Izu Peninsula Onsen, Shizuoka Green Tea' },
  { id: 23, code: '23', nameJa: '愛知県', nameEn: 'Aichi', kana: 'あいちけん', region: 'chubu', capitalJa: '名古屋市', capitalEn: 'Nagoya', highlightJa: '名古屋城、ジブリパーク、熱田神宮、ひつまぶし、手羽先', highlightEn: 'Nagoya Castle, Ghibli Park, Atsuta Shrine, Hitsumabushi Eel' },
  { id: 24, code: '24', nameJa: '三重県', nameEn: 'Mie', kana: 'みえけん', region: 'kansai', capitalJa: '津市', capitalEn: 'Tsu', highlightJa: '伊勢神宮、志摩スペイン村、鈴鹿サーキット、松阪牛', highlightEn: 'Ise Grand Shrine, Shima Coast, Suzuka Circuit, Matsusaka Beef' },
  { id: 25, code: '25', nameJa: '滋賀県', nameEn: 'Shiga', kana: 'しがけん', region: 'kansai', capitalJa: '大津市', capitalEn: 'Otsu', highlightJa: '琵琶湖、彦根城、比叡山延暦寺、近江牛', highlightEn: 'Lake Biwa, Hikone Castle, Mt. Hiei Enryakuji, Omi Beef' },
  { id: 26, code: '26', nameJa: '京都府', nameEn: 'Kyoto', kana: 'きょうとふ', region: 'kansai', capitalJa: '京都市', capitalEn: 'Kyoto', highlightJa: '伏見稲荷大社、金閣寺、清水寺、嵐山竹林、天橋立', highlightEn: 'Fushimi Inari Shrine, Kinkaku-ji, Kiyomizu-dera, Arashiyama, Amanohashidate' },
  { id: 27, code: '27', nameJa: '大阪府', nameEn: 'Osaka', kana: 'おおさかふ', region: 'kansai', capitalJa: '大阪市', capitalEn: 'Osaka', highlightJa: '道頓堀、ユニバーサル・スタジオ・ジャパン、大阪城、たこ焼き', highlightEn: 'Dotonbori, Universal Studios Japan (USJ), Osaka Castle, Takoyaki' },
  { id: 28, code: '28', nameJa: '兵庫県', nameEn: 'Hyogo', kana: 'ひょうごけん', region: 'kansai', capitalJa: '神戸市', capitalEn: 'Kobe', highlightJa: '姫路城（世界遺産）、神戸ハーバーランド、有馬温泉、神戸牛', highlightEn: 'Himeji Castle, Kobe Harborland, Arima Onsen, Kobe Beef' },
  { id: 29, code: '29', nameJa: '奈良県', nameEn: 'Nara', kana: 'ならけん', region: 'kansai', capitalJa: '奈良市', capitalEn: 'Nara', highlightJa: '奈良公園の鹿、東大寺大仏殿、法隆寺、吉野千本桜', highlightEn: 'Nara Deer Park, Todai-ji Great Buddha, Horyu-ji, Yoshino Cherry Blossoms' },
  { id: 30, code: '30', nameJa: '和歌山県', nameEn: 'Wakayama', kana: 'わかやまけん', region: 'kansai', capitalJa: '和歌山市', capitalEn: 'Wakayama', highlightJa: '高野山壇上伽藍、熊野古道、白良浜ビーチ、那智の滝', highlightEn: 'Mt. Koya, Kumano Kodo Pilgrimage, Shirahama Beach, Nachi Falls' },
  { id: 31, code: '31', nameJa: '鳥取県', nameEn: 'Tottori', kana: 'とっとりけん', region: 'chugoku', capitalJa: '鳥取市', capitalEn: 'Tottori', highlightJa: '鳥取砂丘、水木しげるロード、大山、松葉ガニ', highlightEn: 'Tottori Sand Dunes, Mizuki Shigeru Road, Mt. Daisen, Snow Crab' },
  { id: 32, code: '32', nameJa: '島根県', nameEn: 'Shimane', kana: 'しまねけん', region: 'chugoku', capitalJa: '松江市', capitalEn: 'Matsue', highlightJa: '出雲大社、松江城、足立美術館日本庭園、石見銀山', highlightEn: 'Izumo Grand Shrine, Matsue Castle, Adachi Museum of Art, Iwami Ginzan' },
  { id: 33, code: '33', nameJa: '岡山県', nameEn: 'Okayama', kana: 'おかやまけん', region: 'chugoku', capitalJa: '岡山市', capitalEn: 'Okayama', highlightJa: '倉敷美観地区、後楽園、岡山城、白桃・マスカット', highlightEn: 'Kurashiki Bikan Historical Quarter, Korakuen Garden, White Peaches' },
  { id: 34, code: '34', nameJa: '広島県', nameEn: 'Hiroshima', kana: 'ひろしまけん', region: 'chugoku', capitalJa: '広島市', capitalEn: 'Hiroshima', highlightJa: '厳島神社（宮島大鳥居）、原爆ドーム、しまなみ海道、お好み焼き', highlightEn: 'Miyajima Itsukushima Shrine, Peace Memorial, Shimanami Kaido, Okonomiyaki' },
  { id: 35, code: '35', nameJa: '山口県', nameEn: 'Yamaguchi', kana: 'やまぐちけん', region: 'chugoku', capitalJa: '山口市', capitalEn: 'Yamaguchi', highlightJa: '角島大橋、元乃隅神社、秋吉台・秋芳洞、錦帯橋、下関ふぐ', highlightEn: 'Tsunoshima Bridge, Motonosumi Shrine, Akiyoshidai Karst, Kintaikyo Bridge' },
  { id: 36, code: '36', nameJa: '徳島県', nameEn: 'Tokushima', kana: 'とくしまけん', region: 'shikoku', capitalJa: '徳島市', capitalEn: 'Tokushima', highlightJa: '阿波おどり、鳴門の渦潮、祖谷のかずら橋、すだち', highlightEn: 'Awa Odori Dance Festival, Naruto Whirlpools, Iya Valley Vine Bridge' },
  { id: 37, code: '37', nameJa: '香川県', nameEn: 'Kagawa', kana: 'かがわけん', region: 'shikoku', capitalJa: '高松市', capitalEn: 'Kagawa', highlightJa: '讃岐うどん巡り、金刀比羅宮（こんぴらさん）、栗林公園、直島アート', highlightEn: 'Sanuki Udon Tour, Kotohira Shrine, Ritsurin Garden, Naoshima Art Island' },
  { id: 38, code: '38', nameJa: '愛媛県', nameEn: 'Ehime', kana: 'えひめけん', region: 'shikoku', capitalJa: '松山市', capitalEn: 'Matsuyama', highlightJa: '道後温泉本館、松山城、しまなみ海道サイクリング、みかん', highlightEn: 'Dogo Onsen Honkan, Matsuyama Castle, Shimanami Cycling, Mikan Citrus' },
  { id: 39, code: '39', nameJa: '高知県', nameEn: 'Kochi', kana: 'こうちけん', region: 'shikoku', capitalJa: '高知市', capitalEn: 'Kochi', highlightJa: '桂浜、高知城、仁淀川（仁淀ブルー）、四万十川、カツオのたたき', highlightEn: 'Katsurahama Beach, Niyodo River Blue, Shimanto River, Seared Bonito' },
  { id: 40, code: '40', nameJa: '福岡県', nameEn: 'Fukuoka', kana: 'ふくおかけん', region: 'kyushu', capitalJa: '福岡市', capitalEn: 'Fukuoka', highlightJa: '中洲の屋台街、太宰府天満宮、博多ラーメン、もつ鍋、明太子', highlightEn: 'Nakasu Yatai Food Stalls, Dazaifu Tenmangu, Hakata Tonkotsu Ramen' },
  { id: 41, code: '41', nameJa: '佐賀県', nameEn: 'Saga', kana: 'さがけん', region: 'kyushu', capitalJa: '佐賀市', capitalEn: 'Saga', highlightJa: '吉野ヶ里歴史公園、有田焼・伊万里焼、武雄温泉、佐賀牛', highlightEn: 'Yoshinogari Historical Park, Arita & Imari Ceramics, Takeo Onsen' },
  { id: 42, code: '42', nameJa: '長崎県', nameEn: 'Nagasaki', kana: 'ながさきけん', region: 'kyushu', capitalJa: '長崎市', capitalEn: 'Nagasaki', highlightJa: 'ハウステンボス、軍艦島、グラバー園、稲佐山夜景、長崎ちゃんぽん', highlightEn: 'Huis Ten Bosch, Gunkanjima, Glover Garden, Mt. Inasa Night View' },
  { id: 43, code: '43', nameJa: '熊本県', nameEn: 'Kumamoto', kana: 'くまもとけん', region: 'kyushu', capitalJa: '熊本市', capitalEn: 'Kumamoto', highlightJa: '熊本城、阿蘇山カルデラ、黒川温泉、天草諸島、馬刺し', highlightEn: 'Kumamoto Castle, Mt. Aso Caldera, Kurokawa Onsen, Amakusa Islands' },
  { id: 44, code: '44', nameJa: '大分県', nameEn: 'Oita', kana: 'おおいたけん', region: 'kyushu', capitalJa: '大分市', capitalEn: 'Oita', highlightJa: '別府温泉地獄めぐり、由布院温泉、宇佐神宮、とり天', highlightEn: 'Beppu Onsen Hells, Yufuin Floral Village, Usa Grand Shrine, Toriten' },
  { id: 45, code: '45', nameJa: '宮崎県', nameEn: 'Miyazaki', kana: 'みやざきけん', region: 'kyushu', capitalJa: '宮崎市', capitalEn: 'Miyazaki', highlightJa: '高千穂峡、青島神社、サンメッセ日南モアイ像、チキン南蛮', highlightEn: 'Takachiho Gorge, Aoshima Shrine, Nichinan Coast, Chicken Nanban' },
  { id: 46, code: '46', nameJa: '鹿児島県', nameEn: 'Kagoshima', kana: 'かごしまけん', region: 'kyushu', capitalJa: '鹿児島市', capitalEn: 'Kagoshima', highlightJa: '桜島、指宿砂むし温泉、霧島神宮、屋久島縄文杉、黒豚しゃぶしゃぶ', highlightEn: 'Sakurajima Volcano, Ibusuki Sand Bath, Yakushima Island Cedar' },
  { id: 47, code: '47', nameJa: '沖縄県', nameEn: 'Okinawa', kana: 'おきなわけん', region: 'okinawa', capitalJa: '那覇市', capitalEn: 'Naha', highlightJa: '沖縄美ら海水族館、首里城公園、古宇利島、宮古島ブルー、沖縄そば', highlightEn: 'Okinawa Churaumi Aquarium, Shurijo Castle, Miyakojima Beaches, Okinawa Soba' }
];

const prefecturesOut = meta.map((m) => {
  const g = geoMap[m.id];
  return {
    ...m,
    path: g ? g.path : '',
    labelX: g ? g.labelX : 0,
    labelY: g ? g.labelY : 0
  };
});

const content = `import { PrefectureMeta, ColorPreset } from '../types';

export const COLOR_PRESETS: ColorPreset[] = [
  { nameJa: '桜ピンク', nameEn: 'Sakura Pink', hex: '#F43F5E' },
  { nameJa: '夕日コーラル', nameEn: 'Sunset Coral', hex: '#F97316' },
  { nameJa: '京都ゴールド', nameEn: 'Kyoto Gold', hex: '#EAB308' },
  { nameJa: '宇治抹茶', nameEn: 'Matcha Green', hex: '#10B981' },
  { nameJa: '富士藍色', nameEn: 'Fuji Indigo', hex: '#0EA5E9' },
  { nameJa: '瑠璃ネイビー', nameEn: 'Deep Cobalt', hex: '#6366F1' },
  { nameJa: '富良野ラベンダー', nameEn: 'Lavender', hex: '#A855F7' },
  { nameJa: '牡丹マゼンタ', nameEn: 'Peony Magenta', hex: '#EC4899' },
  { nameJa: 'ミントグリーン', nameEn: 'Fresh Mint', hex: '#14B8A6' },
  { nameJa: 'スレートグレー', nameEn: 'Slate Minimal', hex: '#64748B' }
];

// High-precision authentic geographic vector dataset for all 47 Japanese prefectures
export const PREFECTURES: PrefectureMeta[] = ${JSON.stringify(prefecturesOut, null, 2)};

export const REGIONS: { id: PrefectureMeta['region']; nameJa: string; nameEn: string; color: string }[] = [
  { id: 'hokkaido', nameJa: '北海道', nameEn: 'Hokkaido', color: '#0284C7' },
  { id: 'tohoku', nameJa: '東北', nameEn: 'Tohoku', color: '#0D9488' },
  { id: 'kanto', nameJa: '関東', nameEn: 'Kanto', color: '#E11D48' },
  { id: 'chubu', nameJa: '中部', nameEn: 'Chubu', color: '#D97706' },
  { id: 'kansai', nameJa: '関西', nameEn: 'Kansai', color: '#7C3AED' },
  { id: 'chugoku', nameJa: '中国', nameEn: 'Chugoku', color: '#2563EB' },
  { id: 'shikoku', nameJa: '四国', nameEn: 'Shikoku', color: '#059669' },
  { id: 'kyushu', nameJa: '九州', nameEn: 'Kyushu', color: '#DC2626' },
  { id: 'okinawa', nameJa: '沖縄', nameEn: 'Okinawa', color: '#DB2777' }
];
`;

fs.writeFileSync(path.join(__dirname, 'src/data/prefectures.ts'), content, 'utf8');
console.log('Successfully updated src/data/prefectures.ts with high-precision paths!');
