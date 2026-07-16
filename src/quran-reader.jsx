// Quran Reader — shared screen component + storyboard row for the "Quran" board.
//
// QuranReaderScreen is a pure presentational reader (app bar · surah-info bar · ayah
// list · View Settings sheet). It is driven by props so the SAME component renders in
// the static storyboard frames and in the live interactive device. `origin` selects the
// info-bar meta: 'surah' → "7 ayahs" (opened from the Surah list), 'juz' → the Juz range
// (opened from the Juz list) — the only visual difference between the two entry points.
//
// QuranReaderRow renders the board's static frames: a Home entry (HomeScreen + BottomNav,
// like dua-dikhr) followed by the three reader states (Surah, Juz, Settings open).

const QURAN_AYAHS = [
  { n: 1, arabic: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ١', translit: 'Bismi Allahi arrahmani arraheem', translation: 'In the name of Allah, the Compassionate, the Merciful.' },
  { n: 2, arabic: 'ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ ٢', translit: 'Alhamdu lillahi rabbi alAAalameen', translation: 'All praise unto Allah, the Lord of all the worlds.' },
  { n: 3, arabic: 'ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ٣', translit: 'Arrahmani arraheem', translation: 'The Compassionate, the Merciful.' },
  { n: 4, arabic: 'مَٰلِكِ يَوۡمِ ٱلدِّينِ ٤', translit: 'Maliki yawmi addeen', translation: 'Sovereign of the Day of Requital.' },
  { n: 5, arabic: 'إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ ٥', translit: 'Iyyaka naAAbudu wa-iyyaka nastaAAeen', translation: 'Thee alone do we worship and of Thee alone do we seek help.' },
  { n: 6, arabic: 'ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ ٦', translit: 'Ihdina alssirata almustaqeema', translation: 'Guide us to the straight path.' },
  { n: 7, arabic: 'صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ ٧', translit: 'Sirata allatheena anAAamta AAalayhim ghayri almaghdoobi AAalayhim wala alddalleen', translation: 'The path of those on whom Thou hast bestowed favors; not those who incurred Thy wrath, nor those who went astray.' }
];

function QuranReaderScreen({
  origin = 'juz',
  settingsOpen = false,
  showTranslit = true,
  showTranslation = true,
  arabicSize = 28,
  onBack,
  onToggleSettings,
  onCloseSettings,
  onToggleTranslit,
  onToggleTranslation,
  onIncFont,
  onDecFont
}) {
  const metaText = origin === 'surah' ? '7 ayahs' : 'Juz 1 | 1 - 7 ayahs';
  const last = QURAN_AYAHS.length - 1;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--color-surface-primary)' }}>

      {/* AppBar — DS .ib buttons; top padding clears the device status bar / dynamic island */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '54px 16px 10px', background: 'var(--color-surface-primary)' }}>
        <button className="ib ib-tonal md" onClick={onBack} aria-label="Back">
          <span className="mi" data-i="arrow_back"></span>
        </button>
        <div style={{ fontFamily: "'QWBWSurah',serif", fontSize: 22, color: 'var(--color-info-primary)', direction: 'rtl' }}>سُورَةُ الْفَاتِحَةِ</div>
        <button className="ib ib-tonal md" onClick={onToggleSettings} aria-label="View settings">
          <span className="mi" data-i="settings"></span>
        </button>
      </div>

      {/* Surah info bar */}
      <div style={{ flexShrink: 0, padding: '6px 20px 12px', borderBottom: '1px solid var(--color-neutral-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-info-primary)' }}>1. Al-Faatiha</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-info-secondary)' }}>{metaText}</span>
        </div>
      </div>

      {/* Ayahs */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {QURAN_AYAHS.map((a, i) => (
          <div key={a.n} style={{
            padding: i === last ? '20px 20px 32px' : '20px 20px 16px',
            borderBottom: i === last ? 'none' : '1px solid var(--color-neutral-border)'
          }}>
            <div style={{ textAlign: 'right', direction: 'rtl', fontFamily: "'AlQuranIndoPak',serif", fontSize: arabicSize, color: 'var(--color-info-primary)', lineHeight: 2, marginBottom: 10 }}>{a.arabic}</div>
            {showTranslit ? (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontStyle: 'italic', color: 'var(--color-action-primary)', marginBottom: 6 }}>{a.translit}</div>
            ) : null}
            {showTranslation ? (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-info-primary)', marginBottom: 8, lineHeight: 1.5 }}>{a.translation}</div>
            ) : null}
            <div style={{ display: 'inline-block', background: 'var(--color-action-background)', borderRadius: 6, padding: '2px 8px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: 'var(--color-info-secondary)' }}>{'1:' + a.n}</span>
            </div>
          </div>
        ))}
      </div>

      {/* View Settings bottom sheet */}
      {settingsOpen ? (
        <div className="dlg-scrim sheet" onClick={onCloseSettings}>
          <div className="dlg" onClick={(e) => e.stopPropagation()}>
            <div className="dlg-handle" />
            <div className="dlg-title">View Settings</div>
            <div className="dlg-desc">Customize your Quran reading experience</div>
            <div className="dlg-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--color-info-primary)' }}>Quran Transliteration</span>
                <div onClick={onToggleTranslit} className={`sw ${showTranslit ? 'on' : ''}`}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--color-info-primary)' }}>Quran Translation</span>
                <div onClick={onToggleTranslation} className={`sw ${showTranslation ? 'on' : ''}`}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--color-info-primary)' }}>Arabic Text Size</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button className="ib ib-tonal sm" onClick={onDecFont} aria-label="Decrease" style={{ opacity: arabicSize <= 22 ? 0.4 : 1 }}>
                    <span className="mi" data-i="remove"></span>
                  </button>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--color-info-primary)', minWidth: 22, textAlign: 'center' }}>{arabicSize}</span>
                  <button className="ib ib-tonal sm" onClick={onIncFont} aria-label="Increase" style={{ opacity: arabicSize >= 36 ? 0.4 : 1 }}>
                    <span className="mi" data-i="add"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
}

// ── Static storyboard row: Home → Surah/Juz index → 3 reader states ─────────
// The index frames reuse the shared QuranScreen listing (from the Home board's
// screens.jsx) — no duplicate listing markup.
const QURAN_READER_FRAMES = [
  { name: 'Home tab — Quran card', kind: 'home' },
  { name: 'Quran — Surah index', kind: 'listing', quranTab: 0 },
  { name: 'Quran — Juz index', kind: 'listing', quranTab: 1 },
  { name: 'Reader — opened from Surah', kind: 'reader', origin: 'surah' },
  { name: 'Reader — opened from Juz', kind: 'reader', origin: 'juz' },
  { name: 'Reader — View Settings sheet', kind: 'reader', origin: 'surah', settingsOpen: true }
];

function QuranReaderRow({ active = -1, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="auto_stories"></span>
        01 · Quran — Home → Surah/Juz index → reader · {QURAN_READER_FRAMES.length} states
      </div>
      <div className="poc-board">
        {QURAN_READER_FRAMES.map((f, i) => {
          const ringClass = active === i ? 'is-active' : '';

          let screenContent = null;
          if (f.kind === 'home') {
            const { HomeScreen, BottomNav } = window;
            screenContent = (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                  {HomeScreen ? <HomeScreen /> : <div style={{ padding: 20, color: 'var(--color-info-secondary)' }}>Loading Home...</div>}
                </div>
                {BottomNav ? <BottomNav activeIndex={0} /> : null}
              </div>
            );
          } else if (f.kind === 'listing') {
            const { QuranScreen, BottomNav } = window;
            screenContent = (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                  {QuranScreen ? <QuranScreen activeTab={f.quranTab} /> : <div style={{ padding: 20, color: 'var(--color-info-secondary)' }}>Loading Quran...</div>}
                </div>
                {BottomNav ? <BottomNav activeIndex={2} /> : null}
              </div>
            );
          } else {
            screenContent = (
              <QuranReaderScreen origin={f.origin} settingsOpen={!!f.settingsOpen} />
            );
          }

          return (
            <div key={i} className="poc-board-item" onClick={() => onSelectFrame && onSelectFrame(i)}>
              <div className={`noor-frame ${ringClass}`} style={{ '--s': '0.46', cursor: onSelectFrame ? 'pointer' : 'default' }}>
                <div className="noor-frame-inner">
                  <div className="noor-screen">
                    <div className="noor-island"></div>
                    {screenContent}
                    <div className="noor-home"></div>
                  </div>
                </div>
              </div>
              <div className="poc-frame-caption">{i + 1} · {f.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { QuranReaderScreen, QuranReaderRow, QURAN_AYAHS, QURAN_READER_FRAMES });
