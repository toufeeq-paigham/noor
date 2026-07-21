// Shared screen components for the Dua & Dikhr flow.
// Used by both the static storyboard row (dua-row.jsx) and the live interactive device (Dua & Dikhr.dc.html).
// Layout classes (.cat-card, .dua-item, .dua-block, .audio-dock …) and the AlQuranIndoPak @font-face
// live in the board page helmet, so both the live device and the static frames share them.

// ── Hisnul Muslim categories — the same twelve assets and slugs used by Compose ──
const DUA_CATEGORIES = [
  ['all', 'All'], ['food_drink', 'Food and Drink'], ['good_etiquette', 'Good etiquette'],
  ['hajj_umrah', 'Hajj and Umrah'], ['home_family', 'Home and Family'],
  ['joy_distress', 'Joy and Distress'], ['morning_evening_remembrance', 'Morning and Evening Remembrance'],
  ['nature', 'Nature'], ['praising_allah', 'Praising Allah'], ['prayer', 'Prayer'],
  ['sickness_death', 'Sickness and Death'], ['travel', 'Travel']
].map(([slug, name]) => ({ slug, name, image: `./assets/${slug}.webp` }));

function StateLoading({ kind = 'list' }) {
  const count = kind === 'grid' ? 6 : kind === 'reader' ? 2 : 5;
  return (
    <div className={`dua-loading ${kind}`} role="status" aria-label="Loading content">
      {Array.from({ length: count }, (_, i) => <div key={i} className={`skeleton dua-skeleton ${kind}`}></div>)}
    </div>
  );
}

function StateEmpty({ icon, title, description, action, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon"><span className="mi" data-i={icon}></span></div>
      <div className="empty-state-title">{title}</div>
      <div className="empty-state-description">{description}</div>
      {action ? <button className="btn btn-tonal md empty-state-action" onClick={onAction}>{action}</button> : null}
    </div>
  );
}

function ErrorSheet({ message, onRetry, onDismiss }) {
  return (
    <div className="dlg-scrim sheet" role="alertdialog" aria-modal="true">
      <div className="dlg">
        <div className="dlg-handle"></div>
        <div className="dlg-title">We couldn't load this content</div>
        <div className="dlg-desc">{message || 'Check your connection and try again.'}</div>
        <div className="dlg-actions">
          <button className="btn btn-tonal md" onClick={onDismiss}>Dismiss</button>
          <button className="btn btn-filled md" onClick={onRetry}>Retry</button>
        </div>
      </div>
    </div>
  );
}

const FAVOURITE_ITEMS = [
  { id: '1:1', number: 1, title: 'When waking up', subtitle: 'Praise is to Allah Who gives us life after sleep.' },
  { id: '10:1', number: 1, title: 'Remembrance when leaving the home', subtitle: 'In the name of Allah, I place my trust in Allah.' }
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
function AppBar({ title, onBack, tabs, titleTransitionName }) {
  // With `tabs`, the tab row is pinned INSIDE the app bar (never scrolls);
  // the .app-bar children stay crisp while the ::before blur haze fades behind them.
  return (
    <div className="app-bar" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 0, height: tabs ? APPBAR_H_TABS : APPBAR_H, padding: '52px 16px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="ib ib-tonal md" onClick={onBack} aria-label="Back">
          <span className="mi" data-i="arrow_back"></span>
        </button>
        <div className="ab-title" style={titleTransitionName ? { viewTransitionName: titleTransitionName } : undefined}>{title}</div>
      </div>
      {tabs ? <div style={{ marginTop: 12 }}>{tabs}</div> : null}
    </div>
  );
}

// 1. CATEGORIES — Hisnul Muslim hub (tabs pinned in app bar + photo grid)
function CategoriesScreen({ activeTab = 'dua', state = 'content', favourites = [], onSelectTab, onSelectCategory, onSelectFavourite, onRetry, onBack }) {
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
          {state === 'loading' ? <StateLoading kind={activeTab === 'dua' ? 'grid' : 'list'} /> : activeTab === 'fav' ? (
            favourites.length === 0 ? <StateEmpty icon="favorite" title="No favourites yet" description="Tap the heart on any dua to save it here for quick access." /> :
            <div className="dua-list-stack">{favourites.map((item) => (
              <button key={item.id} className="list-row-emphasized" onClick={() => onSelectFavourite && onSelectFavourite(item.id)}>
                <span className="list-row-emphasized-number">{item.number}</span>
                <span className="list-row-emphasized-body"><span className="list-row-emphasized-title">{item.title}</span><span className="list-row-emphasized-subtitle">{item.subtitle}</span></span>
              </button>
            ))}</div>
          ) : state === 'empty' ? (
            <StateEmpty icon="volunteer_activism" title="No categories available" description="Please try again in a moment." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {DUA_CATEGORIES.map((c) => (
                <button key={c.slug} className="media-tile" onClick={() => onSelectCategory && onSelectCategory(c.slug)} aria-label={`Open ${c.name} duas`}>
                  <img src={c.image} alt="" />
                  <span className="media-tile-label" style={{ viewTransitionName: `dua-category-${c.slug}` }}>{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <AppBar title="Hisnul Muslim" onBack={onBack} tabs={tabBar} />
      {state === 'error' ? <ErrorSheet onRetry={onRetry} /> : null}
    </div>
  );
}

// 2. DUA LIST — numbered chapter list
function DuaListScreen({ categoryName = 'All', categorySlug = 'all', state = 'content', onSelectDua, onRetry, onBack }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--color-surface-primary)' }}>

      {/* Scroll layer — runs full-bleed under the floating app bar */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingTop: APPBAR_H }}>
        <div style={{ padding: '6px 16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {state === 'loading' ? <StateLoading /> : state === 'empty' ?
            <StateEmpty icon="menu_book" title="No duas available" description="Please try again in a moment." /> :
            DUA_LIST.map((title, i) => (
              <button key={title} className="list-row-emphasized" onClick={() => onSelectDua && onSelectDua(i)}>
                <span className="list-row-emphasized-number">{i + 1}</span>
                <span className="list-row-emphasized-body"><span className="list-row-emphasized-title">{title}</span></span>
              </button>
            ))}
        </div>
      </div>

      <AppBar title={categoryName} onBack={onBack} titleTransitionName={`dua-category-${categorySlug}`} />
      {state === 'error' ? <ErrorSheet onRetry={onRetry} /> : null}
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
  audioLoading = false,
  state = 'content',
  audioError,
  onToggleAudio,          // (i) → per-dua play button
  onToggleAp,             // dock play/pause
  onCloseAudio,
  onDismissAudioError,
  onRetry,
  onShare,
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
        {state === 'loading' ? <StateLoading kind="reader" /> : state === 'empty' ?
          <StateEmpty icon="menu_book" title="No duas available" description="Please try again in a moment." /> : duas.map((d, i) => {
          const isFav = !!favorites[i];
          const isPlaying = audioIdx === i && audioPlaying;
          return (
            <div key={i} className="dua-block">
              <div className="dua-ar">{d.arabic}</div>
              <div className="dua-tr">{d.translit}</div>
              <div className="dua-en">{d.translation}</div>
              <div className="dua-src">{d.source}</div>
              <div className="dua-acts">
                <button
                  className="ib ib-link md"
                  onClick={() => onToggleFav && onToggleFav(i)}
                  aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}><span className="mi" style={{ color: isFav ? 'var(--color-action-primary)' : 'var(--color-info-secondary)', fontVariationSettings: `'FILL' ${isFav ? 1 : 0}` }} data-i="favorite"></span></button>
                <button className="ib ib-link md" onClick={() => onShare && onShare(i)} aria-label="Share dua"><span className="mi" style={{ color: 'var(--color-info-secondary)' }} data-i="share"></span></button>
                <div style={{ flex: 1 }}></div>
                <button className={`ib ${isPlaying ? 'ib-filled' : 'ib-tonal'} sm`} onClick={() => onToggleAudio && onToggleAudio(i)} aria-label={audioLoading && audioIdx === i ? 'Loading audio' : isPlaying ? 'Pause' : 'Play'} disabled={audioLoading && audioIdx === i}>
                  {audioLoading && audioIdx === i ? <span className="btn-spinner"></span> : <span className="mi" data-i={isPlaying ? 'pause' : 'play_arrow'}></span>}
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
            {audioLoading ? <span className="btn-spinner"></span> : <span className="mi fill" data-i={audioPlaying ? 'pause' : 'play_arrow'}></span>}
          </button>
          <span className="ap-time">{fmtTime(audioProgress)}</span>
          <div className="ap-wave" role="slider" aria-label="Audio progress" aria-valuemin="0" aria-valuemax={AUDIO_TOTAL} aria-valuenow={audioProgress}>
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
      {state === 'error' ? <ErrorSheet onRetry={onRetry} /> : null}
      {audioError ? <ErrorSheet message={audioError} onRetry={onRetry} onDismiss={onDismissAudioError} /> : null}

    </div>
  );
}

// Export on window scope for dynamic board imports
Object.assign(window, { CategoriesScreen, DuaListScreen, DuaDetailScreen, DUA_CATEGORIES, DUA_LIST, DUA_DETAIL, FAVOURITE_ITEMS, AUDIO_TOTAL });
