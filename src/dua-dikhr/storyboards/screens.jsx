// Shared screen components for the Dua & Dikhr flow.
// Used by both the static storyboard row (dua-row.jsx) and the live interactive device (Dua & Dikhr.dc.html).
// Layout classes (.cat-card, .dua-item, .dua-block, .audio-dock …) and the AlQuranIndoPak @font-face
// live in the board page helmet, so both the live device and the static frames share them.

// ── Hisnul Muslim categories (gradients stand in for the photo tiles; whitelisted as imagery) ──
const DUA_CATEGORIES = [
  { name: 'All', grad: 'linear-gradient(160deg,#B85A10 0%,#6B2A05 60%,#2A1005 100%)' },
  { name: 'Travel', grad: 'linear-gradient(160deg,#3A7A20 0%,#1A5010 50%,#0A2A08 100%)' },
  { name: 'Prayer', grad: 'linear-gradient(160deg,#C07020 0%,#703010 50%,#2A0A05 100%)' },
  { name: 'Morning and Evening Remembrance', grad: 'linear-gradient(160deg,#C08020 0%,#804010 50%,#2A1808 100%)' },
  { name: 'Hajj and Umrah', grad: 'linear-gradient(160deg,#3A2810 0%,#1A1208 50%,#0A0804 100%)' },
  { name: 'Joy and Distress', grad: 'linear-gradient(160deg,#1A3050 0%,#0A1828 60%,#050810 100%)' },
  { name: 'Nature', grad: 'linear-gradient(160deg,#2A6820 0%,#1A4010 50%,#0A1808 100%)' },
  { name: 'Good etiquette', grad: 'linear-gradient(160deg,#8A9A50 0%,#5A6830 50%,#2A3010 100%)' },
  { name: 'Home and Family', grad: 'linear-gradient(160deg,#6A5040 0%,#3A2818 50%,#1A1008 100%)' },
  { name: 'Food and Drink', grad: 'linear-gradient(160deg,#8A5020 0%,#503010 50%,#201008 100%)' }
];

// ── "All" chapter list (source: Dua List.dc.html) ──
const DUA_LIST = [
  'When waking up',
  'When wearing a garment',
  'When wearing a new garment',
  'To someone wearing a new garment',
  'Before undressing',
  'Before entering the bathroom',
  'After leaving the bathroom',
  'Before ablution',
  'Upon completing the ablution',
  'Remembrance when leaving the home',
  'Remembrance upon entering the home',
  "Du'a for travelling"
];

// ── "When waking up" reader (source: Dua Detail.dc.html) ──
const DUA_DETAIL = {
  title: 'When waking up',
  duas: [
    {
      arabic: 'اَلْحَمْدُلِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
      translit: "Alhamdu lillaahil-lathee 'ahyaanaa ba'da maa 'amaatanaa wa'ilayhin-nushoor.",
      translation: 'Praise is to Allah Who gives us life after He has caused us to die and to Him is the return.',
      source: 'Al-Bukhari, cf. Al-Asqalani, Fathul-Bari 11/113; Muslim 4/2083 · Hisnul Muslim 1'
    },
    {
      arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. سُبْحَانَ اللَّهِ، وَالْحَمْدُلِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ، رَبِّ اغْفِرْ لِي',
      translit: "Laa 'illaha 'illallahu wahdahu la shareeka lahu, lahul-mulku wa lahul-hamdu, wa Huwa 'alaa kulli shay'in Qadeer Subhaanallahi, walhamdu lillaahi, wa laa 'ilaha 'illallahu, wallaahu 'akbar, wa laa hawla wa laa Quwwata 'illaa billaahil-'Aliyyil-'Adheem, Rabbighfir lee.",
      translation: 'There is none worth of worship but Allah alone, Who has no partner, His is the dominion and to Him belongs all praise, and He is able to do all things. Glory is to Allah. Praise is to Allah. There is none worthy of worship but Allah. Allah is the Most Great. There is no might and no power except with Allah, the Most High, the Most Great. O my Lord, forgive me.',
      source: 'Al-Bukhari · Hisnul Muslim 2'
    }
  ]
};

// ── Audio player (DS .aplayer molecule) helpers — shared by live device + static frame ──
const AUDIO_TOTAL = 23; // seconds
const AUDIO_AMP = Array.from({ length: 40 }, (_, i) =>
  28 + Math.round(Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.33)) * 68));
function audioBars(frac) {
  const played = Math.round(AUDIO_AMP.length * frac);
  return AUDIO_AMP.map((h, i) => ({ h: h + '%', on: i < played }));
}
function fmtTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return m + ':' + s;
}

// Shared top app bar — DS .app-bar (transparent, progressive-blur haze) like the Home screen.
// Content scrolls UNDER it; the ::before mask fades the blur out toward the bottom edge.
const APPBAR_H = 96;        // title-only bar
const APPBAR_H_TABS = 150;  // title bar + pinned tab row
function AppBar({ title, onBack, tabs }) {
  // With `tabs`, the tab row is pinned INSIDE the app bar (never scrolls);
  // the .app-bar children stay crisp while the ::before blur haze fades behind them.
  return (
    <div className="app-bar" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 0, height: tabs ? APPBAR_H_TABS : APPBAR_H, padding: '52px 16px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="ib ib-tonal md" onClick={onBack} aria-label="Back">
          <span className="mi" data-i="arrow_back"></span>
        </button>
        <div className="ab-title">{title}</div>
      </div>
      {tabs ? <div style={{ marginTop: 12 }}>{tabs}</div> : null}
    </div>
  );
}

// 1. CATEGORIES — Hisnul Muslim hub (tabs pinned in app bar + photo grid)
function CategoriesScreen({ activeTab = 'dua', onSelectTab, onSelectCategory, onBack }) {
  const tabBar = (
    <div className="tbar">
      <div className={`tab ${activeTab === 'dua' ? 'active' : ''}`} onClick={() => onSelectTab && onSelectTab('dua')}>DU'A</div>
      <div className={`tab ${activeTab === 'fav' ? 'active' : ''}`} onClick={() => onSelectTab && onSelectTab('fav')}>FAVOURITES</div>
    </div>
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--color-surface-primary)' }}>

      {/* Scroll layer — runs full-bleed under the app bar (which holds the pinned tabs) */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingTop: APPBAR_H_TABS }}>
        <div style={{ padding: '4px 16px 24px' }}>
          {activeTab === 'fav' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 320, textAlign: 'center', padding: '0 24px' }}>
              <span className="mi" style={{ fontSize: 40, color: 'var(--color-info-faint)' }} data-i="favorite"></span>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, color: 'var(--color-info-primary)' }}>No favourites yet</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-info-secondary)', lineHeight: 1.5 }}>Tap the heart on any dua to save it here for quick access.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {DUA_CATEGORIES.map((c, i) => (
                <div key={i} className="cat-card" onClick={() => onSelectCategory && onSelectCategory(i)} style={{ background: c.grad }}>
                  <div className="cat-scrim"></div>
                  <div className="cat-label">{c.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AppBar title="Hisnul Muslim" onBack={onBack} tabs={tabBar} />
    </div>
  );
}

// 2. DUA LIST — numbered chapter list
function DuaListScreen({ categoryName = 'All', onSelectDua, onBack }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--color-surface-primary)' }}>

      {/* Scroll layer — runs full-bleed under the floating app bar */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingTop: APPBAR_H }}>
        <div style={{ padding: '6px 16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DUA_LIST.map((title, i) => (
            <div key={i} className="dua-item" onClick={() => onSelectDua && onSelectDua(i)}>
              <div className="dua-num">{i + 1}</div>
              <span className="dua-item-title">{title}</span>
            </div>
          ))}
        </div>
      </div>

      <AppBar title={categoryName} onBack={onBack} />
    </div>
  );
}

// 3. DUA DETAIL — reader with favourite/share/play + docked audio player (.aplayer)
function DuaDetailScreen({
  title = 'When waking up',
  favorites = {},
  onToggleFav,
  audioIdx = -1,          // index of the dua currently loaded in the player (-1 = none)
  audioPlaying = false,   // is the loaded dua currently playing
  audioProgress = 0,      // seconds elapsed
  onToggleAudio,          // (i) → per-dua play button
  onToggleAp,             // dock play/pause
  onCloseAudio,
  onBack
}) {
  const duas = DUA_DETAIL.duas;
  const audioOpen = audioIdx >= 0;
  const frac = Math.min(1, audioProgress / AUDIO_TOTAL);
  const bars = audioBars(frac);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--color-surface-primary)' }}>

      {/* Reader scroll layer — runs full-bleed under the floating app bar.
          Extra bottom padding when the player is docked so the last line clears it. */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingTop: APPBAR_H, paddingBottom: audioOpen ? 80 : 0 }}>
        {duas.map((d, i) => {
          const isFav = !!favorites[i];
          const isPlaying = audioIdx === i && audioPlaying;
          return (
            <div key={i} className="dua-block">
              <div className="dua-ar">{d.arabic}</div>
              <div className="dua-tr">{d.translit}</div>
              <div className="dua-en">{d.translation}</div>
              <div className="dua-src">{d.source}</div>
              <div className="dua-acts">
                <span
                  className="mi"
                  onClick={() => onToggleFav && onToggleFav(i)}
                  style={{ fontSize: 22, cursor: 'pointer', color: isFav ? 'var(--color-action-primary)' : 'var(--color-info-secondary)', fontVariationSettings: `'FILL' ${isFav ? 1 : 0}` }}
                  data-i="favorite"
                ></span>
                <span className="mi" style={{ fontSize: 22, color: 'var(--color-info-secondary)', cursor: 'pointer' }} data-i="share"></span>
                <div style={{ flex: 1 }}></div>
                <button className={`ib ${isPlaying ? 'ib-filled' : 'ib-tonal'} sm`} onClick={() => onToggleAudio && onToggleAudio(i)} aria-label={isPlaying ? 'Pause' : 'Play'}>
                  <span className="mi" data-i={isPlaying ? 'pause' : 'play_arrow'}></span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <AppBar title={title} onBack={onBack} />

      {/* Docked audio player — DS .aplayer molecule pinned to the bottom edge */}
      {audioOpen && (
        <div className="aplayer dock-bottom">
          <button className="ap-toggle" onClick={onToggleAp} aria-label={audioPlaying ? 'Pause' : 'Play'}>
            <span className="mi fill" data-i={audioPlaying ? 'pause' : 'play_arrow'}></span>
          </button>
          <span className="ap-time">{fmtTime(audioProgress)}</span>
          <div className="ap-wave">
            {bars.map((b, i) => (
              <i key={i} className={b.on ? 'on' : ''} style={{ '--h': b.h }}></i>
            ))}
            <div className="ap-head" style={{ left: Math.round(frac * 100) + '%' }}></div>
          </div>
          <button className="ap-close" onClick={onCloseAudio} aria-label="Close player">
            <span className="mi" data-i="close"></span>
          </button>
        </div>
      )}

    </div>
  );
}

// Export on window scope for dynamic board imports
Object.assign(window, { CategoriesScreen, DuaListScreen, DuaDetailScreen, DUA_CATEGORIES, DUA_LIST, DUA_DETAIL, AUDIO_TOTAL });
