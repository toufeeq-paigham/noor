// Shared screen components for the Asma ul Husna flow.
// Used by storyboard rows (names-row.jsx) and the live device (Asma ul Husna.dc.html).

const NAMES = [
  { num: 1, ar: 'اَلرَّحۡمَٰنُ', latin: 'Ar-Rahmān', meaning: 'The Most Gracious', grad: 'linear-gradient(160deg,#006B30 0%,#003D1C 100%)', color: 'rgba(0,201,80,0.9)' },
  { num: 2, ar: 'اَلرَّحِيمُ', latin: 'Ar-Rahīm', meaning: 'The Most Merciful', grad: 'linear-gradient(160deg,#7A5A10 0%,#402E08 100%)', color: 'rgba(201,173,123,0.9)' },
  { num: 3, ar: 'اَلْمَلِكُ', latin: 'Al-Malik', meaning: 'The King, The Sovereign', grad: 'linear-gradient(160deg,#1A3080 0%,#0A1840 100%)', color: 'rgba(120,160,255,0.9)' },
  { num: 4, ar: 'اَلْقُدُّوسُ', latin: 'Al-Quddus', meaning: 'The Most Sacred, The Most Holy', grad: 'linear-gradient(160deg,#7A1020 0%,#3A080E 100%)', color: 'rgba(255,100,120,0.9)' },
  { num: 5, ar: 'اَلسَّلَامُ', latin: 'As-Salām', meaning: 'The Source of Peace', grad: 'linear-gradient(160deg,#4A1880 0%,#260C40 100%)', color: 'rgba(180,120,255,0.9)' },
  { num: 6, ar: 'اَلْمُؤْمِنُ', latin: "Al-Mu'min", meaning: 'The Granter of Security', grad: 'linear-gradient(160deg,#7A5510 0%,#3A2808 100%)', color: 'rgba(220,180,80,0.9)' },
  { num: 7, ar: 'اَلْمُهَيْمِنُ', latin: 'Al-Muhaymin', meaning: 'The Guardian, The Witness, The Overseer', grad: 'linear-gradient(160deg,#005A45 0%,#003028 100%)', color: 'rgba(0,201,150,0.9)' },
  { num: 8, ar: 'اَلْعَزِيزُ', latin: "Al-'Azeez", meaning: 'The Almighty, The Self-Sufficient', grad: 'linear-gradient(160deg,#605020 0%,#302810 100%)', color: 'rgba(201,173,123,0.9)' },
  { num: 9, ar: 'اَلْجَبَّارُ', latin: 'Al-Jabbār', meaning: 'The Compeller, The Restorer', grad: 'linear-gradient(160deg,#102060 0%,#081030 100%)', color: 'rgba(100,140,255,0.9)' },
  { num: 10, ar: 'اَلْمُتَكَبِّرُ', latin: 'Al-Mutakabbir', meaning: 'The Supreme, The Majestic', grad: 'linear-gradient(160deg,#600818 0%,#30040C 100%)', color: 'rgba(255,90,110,0.9)' },
  { num: 11, ar: 'اَلْخَالِقُ', latin: 'Al-Khāliq', meaning: 'The Creator', grad: 'linear-gradient(160deg,#3A1060 0%,#1C0830 100%)', color: 'rgba(160,100,255,0.9)' },
  { num: 12, ar: 'اَلْبَارِئُ', latin: "Al-Bāri'", meaning: 'The Evolver, The Fashioner of Forms', grad: 'linear-gradient(160deg,#7A5A08 0%,#3C2C04 100%)', color: 'rgba(220,175,60,0.9)' },
  { num: 13, ar: 'اَلْمُصَوِّرُ', latin: 'Al-Musawwir', meaning: 'The Fashioner, The Bestower of Forms', grad: 'linear-gradient(160deg,#004838 0%,#002420 100%)', color: 'rgba(0,180,130,0.9)' },
  { num: 14, ar: 'اَلْغَفَّارُ', latin: 'Al-Ghaffār', meaning: 'The Ever-Forgiving', grad: 'linear-gradient(160deg,#6A4A10 0%,#362508 100%)', color: 'rgba(200,165,80,0.9)' },
  { num: 15, ar: 'اَلْقَهَّارُ', latin: 'Al-Qahhār', meaning: 'The Subduer, The Ever-Dominating', grad: 'linear-gradient(160deg,#0C1C5A 0%,#060E2E 100%)', color: 'rgba(90,130,240,0.9)' },
  { num: 16, ar: 'اَلْوَهَّابُ', latin: 'Al-Wahhāb', meaning: 'The Bestower, The Ever-Giving', grad: 'linear-gradient(160deg,#580810 0%,#2C0408 100%)', color: 'rgba(240,80,100,0.9)' },
  { num: 17, ar: 'اَلرَّزَّاقُ', latin: 'Ar-Razzāq', meaning: 'The Provider, The Sustainer', grad: 'linear-gradient(160deg,#321058 0%,#19082C 100%)', color: 'rgba(150,80,240,0.9)' },
  { num: 18, ar: 'اَلْفَتَّاحُ', latin: 'Al-Fattāh', meaning: 'The Opener, The Judge', grad: 'linear-gradient(160deg,#6A4808 0%,#342404 100%)', color: 'rgba(200,160,70,0.9)' },
];

// ── Grid Screen ──────────────────────────────────────────────────────────────
function GridScreen({ onSelectName, onBack }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: 'var(--color-surface-primary)', overflow: 'hidden' }}>

      {/* AppBar with progressive blur */}
      <div className="app-bar" style={{ padding: '62px 16px 10px', height: 110 }}>
        <button className="ib ib-tonal md" onClick={onBack} aria-label="Back">
          <span className="mi" data-i="arrow_back"></span>
        </button>
        <span className="ab-title">Asma ul Husna</span>
      </div>

      {/* 3-column grid (scrolling under the blurred app bar) */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '120px 12px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {NAMES.map((n, i) => (
            <div
              key={i}
              onClick={() => onSelectName && onSelectName(i)}
              style={{
                borderRadius: 14, overflow: 'hidden', background: n.grad,
                padding: '12px 8px', textAlign: 'center', minHeight: 100,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                cursor: onSelectName ? 'pointer' : 'default'
              }}
            >
              <div style={{ fontFamily: "'AlQuranIndoPak',serif", fontSize: 18, color: n.color, direction: 'rtl', lineHeight: 1.8 }}>{n.ar}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: n.color.replace('0.9', '0.8') }}>{n.latin}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ── Detail Screen ────────────────────────────────────────────────────────────
function DetailScreen({ selectedIdx = 6, onPrev, onNext, onBack }) {
  const name = NAMES[selectedIdx] || NAMES[0];
  // Extract the hue from the gradient for the detail card border glow
  const glowMatch = name.color.match(/rgba?\(([^)]+)\)/);
  const glowRgb = glowMatch ? glowMatch[1].split(',').slice(0, 3).join(',') : '0,201,80';

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: 'var(--color-surface-primary)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* AppBar with progressive blur */}
      <div className="app-bar" style={{ padding: '62px 16px 10px', height: 110 }}>
        <button className="ib ib-tonal md" onClick={onBack} aria-label="Back">
          <span className="mi" data-i="arrow_back"></span>
        </button>
      </div>

      {/* Detail card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 16px' }}>
        <div style={{
          width: '100%', borderRadius: 24,
          background: name.grad,
          padding: '48px 24px', textAlign: 'center',
          border: `1px solid rgba(${glowRgb},0.2)`,
          boxShadow: `0 16px 48px rgba(${glowRgb},0.4)`
        }}>
          <div style={{ fontFamily: "'AlQuranIndoPak',serif", fontSize: 42, color: name.color, direction: 'rtl', lineHeight: 1.6, marginBottom: 20 }}>{name.ar}</div>
          <div style={{ width: '60%', height: 1, background: `rgba(${glowRgb},0.3)`, margin: '0 auto 20px' }}></div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 22, fontWeight: 700, color: 'var(--color-action-primary)', marginBottom: 12 }}>{name.latin}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--color-info-secondary)', lineHeight: 1.6 }}>{name.meaning}</div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px 28px' }}>
        <button
          onClick={onPrev}
          disabled={selectedIdx <= 0}
          style={{
            width: 52, height: 52, borderRadius: '50%', border: 'none',
            background: selectedIdx > 0 ? 'var(--color-action-primary)' : 'var(--color-surface-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: selectedIdx > 0 ? '0 4px 16px rgba(0,201,80,0.4)' : 'none',
            cursor: selectedIdx > 0 ? 'pointer' : 'default', opacity: selectedIdx > 0 ? 1 : 0.4
          }}
        >
          <span className="mi" style={{ fontSize: 26, color: '#fff' }} data-i="arrow_back"></span>
        </button>
        <div style={{
          background: 'var(--color-surface-secondary)', borderRadius: 20,
          padding: '8px 18px', border: '1px solid var(--color-neutral-border)'
        }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-info-secondary)' }}>{selectedIdx + 1} / {NAMES.length}</span>
        </div>
        <button
          onClick={onNext}
          disabled={selectedIdx >= NAMES.length - 1}
          style={{
            width: 52, height: 52, borderRadius: '50%', border: 'none',
            background: selectedIdx < NAMES.length - 1 ? 'var(--color-action-primary)' : 'var(--color-surface-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: selectedIdx < NAMES.length - 1 ? '0 4px 16px rgba(0,201,80,0.4)' : 'none',
            cursor: selectedIdx < NAMES.length - 1 ? 'pointer' : 'default', opacity: selectedIdx < NAMES.length - 1 ? 1 : 0.4
          }}
        >
          <span className="mi" style={{ fontSize: 26, color: '#fff' }} data-i="arrow_forward"></span>
        </button>
      </div>

    </div>
  );
}

Object.assign(window, { GridScreen, DetailScreen, ASMA_NAMES: NAMES });
