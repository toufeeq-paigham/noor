// Shared screen components for the Asma ul Husna flow.
// Used by storyboard rows (names-row.jsx) and the live device (Asma ul Husna.dc.html).

const NAMES = [
  { num: 1, ar: "ٱلرَّحْمَٰنُ", latin: "Ar-Raḥmān", meaning: "The Most or Entirely Merciful" },
  { num: 2, ar: "ٱلرَّحِيمُ", latin: "Ar-Raḥīm", meaning: "The Especially Merciful" },
  { num: 3, ar: "ٱلْمَلِكُ", latin: "Al-Malik", meaning: "The King and Owner of Dominion" },
  { num: 4, ar: "ٱلْقُدُّوسُ", latin: "Al-Quddus", meaning: "The Absolutely Pure" },
  { num: 5, ar: "ٱلسَّلَامُ", latin: "As-Salām", meaning: "The Perfection and Giver of Peace" },
  { num: 6, ar: "ٱلْمُؤْمِنُ", latin: "Al-Mu'min", meaning: "The One Who gives Emaan and Security" },
  { num: 7, ar: "ٱلْمُهَيْمِنُ", latin: "Al-Muhaymin", meaning: "The Guardian, The Witness, The Overseer" },
  { num: 8, ar: "ٱلْعَزِيزُ", latin: "Al-'Azeez", meaning: "The Almighty" },
  { num: 9, ar: "ٱلْجَبَّارُ", latin: "Al-Jabbār", meaning: "The Compeller, The Restorer" },
  { num: 10, ar: "ٱلْمُتَكَبِّرُ", latin: "Al-Mutakabbir", meaning: "The Supreme, The Majestic" },
  { num: 11, ar: "ٱلْخَٰلِقُ", latin: "Al-Khāliq", meaning: "The Creator, The Maker" },
  { num: 12, ar: "ٱلْبَارِئُ", latin: "Al-Bāriʾ", meaning: "The Originator" },
  { num: 13, ar: "ٱلْمُصَوِّرُ", latin: "Al-Muṣawwir", meaning: "The Fashioner" },
  { num: 14, ar: "ٱلْغَفَّارُ", latin: "Al-Ghaffār", meaning: "The Constant Forgiver" },
  { num: 15, ar: "ٱلْقَهَّارُ", latin: "Al-Qahhār", meaning: "The Subduer, The Ever-Dominating" },
  { num: 16, ar: "ٱلْوَهَّابُ", latin: "Al-Wahhāb", meaning: "The Giver of Gifts" },
  { num: 17, ar: "ٱلرَّزَّاقُ", latin: "Ar-Razzāq", meaning: "The Ever-Providing" },
  { num: 18, ar: "ٱلْفَتَّاحُ", latin: "Al-Fattāḥ", meaning: "The Opener, The Judge" },
  { num: 19, ar: "ٱلْعَلِيمُ", latin: "Al-ʿAlīm", meaning: "The All-Knowing, The Omniscient" },
  { num: 20, ar: "ٱلْقَابِضُ", latin: "Al-Qābiḍ", meaning: "The Withholder" },
  { num: 21, ar: "ٱلْبَاسِطُ", latin: "Al-Bāsiṭ", meaning: "The Extender" },
  { num: 22, ar: "ٱلْخَافِضُ", latin: "Al-Khāfiḍ", meaning: "The Reducer, The Abaser" },
  { num: 23, ar: "ٱلْرَّافِعُ", latin: "Ar-Rāfiʿ", meaning: "The Exalter" },
  { num: 24, ar: "ٱلْمُعِزُّ", latin: "Al-Muʿizz", meaning: "The Honourer" },
  { num: 25, ar: "ٱلْمُذِلُّ", latin: "Al-Mudhill", meaning: "The Dishonourer, The Humiliator" },
  { num: 26, ar: "ٱلسَّمِيعُ", latin: "As-Samīʿ", meaning: "The All-Hearing" },
  { num: 27, ar: "ٱلْبَصِيرُ", latin: "Al-Baṣīr", meaning: "The All-Seeing" },
  { num: 28, ar: "ٱلْحَكَمُ", latin: "Al-Ḥakam", meaning: "The Judge, The Giver of Justice" },
  { num: 29, ar: "ٱلْعَدْلُ", latin: "Al-'Adl", meaning: "The Utterly Just" },
  { num: 30, ar: "ٱللَّطِيفُ", latin: "Al-Laṭīf", meaning: "The Subtle One, The Most Gentle" },
  { num: 31, ar: "ٱلْخَبِيرُ", latin: "Al-Khabīr", meaning: "The Acquainted, The All-Aware" },
  { num: 32, ar: "ٱلْحَلِيمُ", latin: "Al-Ḥalīm", meaning: "The Most Forbearing" },
  { num: 33, ar: "ٱلْعَظِيمُ", latin: "Al-ʿAẓīm", meaning: "The Magnificent, The Supreme" },
  { num: 34, ar: "ٱلْغَفُورُ", latin: "Al-Ghafūr", meaning: "The Forgiving, The Exceedingly Forgiving" },
  { num: 35, ar: "ٱلشَّكُورُ", latin: "Ash-Shakūr", meaning: "The Most Appreciative" },
  { num: 36, ar: "ٱلْعَلِيُّ", latin: "Al-ʿAlī", meaning: "The Most High, The Exalted" },
  { num: 37, ar: "ٱلْكَبِيرُ", latin: "Al-Kabīr", meaning: "The Greatest, The Most Grand" },
  { num: 38, ar: "ٱلْحَفِيظُ", latin: "Al-Ḥafīẓ", meaning: "The Preserver, The All-Heedful and All-Protecting" },
  { num: 39, ar: "ٱلْمُقِيتُ", latin: "Al-Muqīt", meaning: "The Sustainer, The Maintainer" },
  { num: 40, ar: "ٱلْحَسِيبُ", latin: "Al-Ḥasīb", meaning: "The Reckoner" },
  { num: 41, ar: "ٱلْجَلِيلُ", latin: "Al-Jalīl", meaning: "The Majestic" },
  { num: 42, ar: "ٱلْكَرِيمُ", latin: "Al-Karīm", meaning: "The Most Generous, The Most Esteemed" },
  { num: 43, ar: "ٱلْرَّقِيبُ", latin: "Ar-Raqīb", meaning: "The Watchful, The All-Watchful" },
  { num: 44, ar: "ٱلْمُجِيبُ", latin: "Al-Mujīb", meaning: "The Responsive, The Answerer" },
  { num: 45, ar: "ٱلْوَاسِعُ", latin: "Al-Wāsiʿ", meaning: "The All-Encompassing, the Boundless" },
  { num: 46, ar: "ٱلْحَكِيمُ", latin: "Al-Ḥakīm", meaning: "The All-Wise" },
  { num: 47, ar: "ٱلْوَدُودُ", latin: "Al-Wadūd", meaning: "The Most Loving" },
  { num: 48, ar: "ٱلْمَجِيدُ", latin: "Al-Majīd", meaning: "The Glorious, The Most Honorable" },
  { num: 49, ar: "ٱلْبَاعِثُ", latin: "Al-Bāʿith", meaning: "The Infuser of New Life" },
  { num: 50, ar: "ٱلْشَّهِيدُ", latin: "As-Shahīd", meaning: "The All-Witnessing" },
  { num: 51, ar: "ٱلْحَقُّ", latin: "Al-Ḥaqq", meaning: "The Absolute Truth" },
  { num: 52, ar: "ٱلْوَكِيلُ", latin: "Al-Wakīl", meaning: "The Trustee, The Disposer of Affairs" },
  { num: 53, ar: "ٱلْقَوِيُّ", latin: "Al-Qawiyy", meaning: "The All-Strong" },
  { num: 54, ar: "ٱلْمَتِينُ", latin: "Al-Matīn", meaning: "The Firm, The Steadfast" },
  { num: 55, ar: "ٱلْوَلِيُ", latin: "Al-Walī", meaning: "The Protecting Associate" },
  { num: 56, ar: "ٱلْحَمِيدُ", latin: "Al-Ḥamīd", meaning: "The Praiseworthy" },
  { num: 57, ar: "ٱلْمُحْصِي", latin: "Al-Muḥṣī", meaning: "The All-Enumerating, The Counter" },
  { num: 58, ar: "ٱلْمُبْدِئُ", latin: "Al-Mubdiʾ", meaning: "The Originator, The Initiator" },
  { num: 59, ar: "ٱلْمُعِيدُ", latin: "Al-Muʿīd", meaning: "The Restorer, The Reinstater" },
  { num: 60, ar: "ٱلْمُحْيِي", latin: "Al-Muḥyī", meaning: "The Giver of Life" },
  { num: 61, ar: "ٱلْمُمِيتُ", latin: "Al-Mumīt", meaning: "The Creator of Death" },
  { num: 62, ar: "ٱلْحَيُّ", latin: "Al-Hayy", meaning: "The Ever-Living" },
  { num: 63, ar: "ٱلْقَيُّومُ", latin: "Al-Qayyūm", meaning: "The Sustainer, The Self-Subsisting" },
  { num: 64, ar: "ٱلْوَاجِدُ", latin: "Al-Wājid", meaning: "The Perceiver" },
  { num: 65, ar: "ٱلْمَاجِدُ", latin: "Al-Mājid", meaning: "The Illustrious, The Magnificent" },
  { num: 66, ar: "ٱلْوَاحِدُ", latin: "Al-Wāḥid", meaning: "The One, The Indivisible" },
  { num: 67, ar: "ٱلْأَحَدُ", latin: "Al-Aḥad", meaning: "The Unique, The Only One" },
  { num: 68, ar: "ٱلصَّمَدُ", latin: "Aṣ-Ṣamad", meaning: "The Eternal, Satisfier of Needs" },
  { num: 69, ar: "ٱلْقَادِرُ", latin: "Al-Qādir", meaning: "The Omnipotent" },
  { num: 70, ar: "ٱلْمُقْتَدِرُ", latin: "Al-Muqtadir", meaning: "The Powerful" },
  { num: 71, ar: "ٱلْمُقَدِّمُ", latin: "Al-Muqaddim", meaning: "The Expediter, The Promoter" },
  { num: 72, ar: "ٱلْمُؤَخِّرُ", latin: "Al-Muʾakhkhir", meaning: "The Delayer" },
  { num: 73, ar: "ٱلْأوَّلُ", latin: "Al-Awwal", meaning: "The First" },
  { num: 74, ar: "ٱلْآخِرُ", latin: "Al-Ākhir", meaning: "The Last, The Utmost" },
  { num: 75, ar: "ٱلظَّٰهِرُ", latin: "Aẓ-Ẓāhir", meaning: "The Manifest, The All-Surpassing" },
  { num: 76, ar: "ٱلْبَاطِنُ", latin: "Al-Bāṭin", meaning: "The Hidden One, Knower of the Hidden" },
  { num: 77, ar: "ٱلْوَالِي", latin: "Al-Wālī", meaning: "The Sole Governor" },
  { num: 78, ar: "ٱلْمُتَعَالِي", latin: "Al-Mutaʿālī", meaning: "The Self-Exalted" },
  { num: 79, ar: "ٱلْبَرُّ", latin: "Al-Barr", meaning: "The Source of All Goodness" },
  { num: 80, ar: "ٱلتَّوَابُ", latin: "At-Tawwāb", meaning: "The Ever-Pardoning" },
  { num: 81, ar: "ٱلْمُنْتَقِمُ", latin: "Al-Muntaqim", meaning: "The Avenger" },
  { num: 82, ar: "ٱلْعَفُوُّ", latin: "Al-ʿAfūw", meaning: "The Pardoner" },
  { num: 83, ar: "ٱلْرَّؤُوفُ", latin: "Ar-Raʾūf", meaning: "The Most Kind" },
  { num: 84, ar: "مَالِكُ ٱلْمُلْكِ", latin: "Mālik al-Mulk", meaning: "Master of the Dominion, Owner of the Kingdom" },
  { num: 85, ar: "ذُو ٱلْجَلَالِ وَٱلْإِكْرَامِ", latin: "Dhū al-Jalāli wa'l-Ikrām", meaning: "Possessor of Glory and Honour" },
  { num: 86, ar: "ٱلْمُقْسِطُ", latin: "Al-Muqsiṭ", meaning: "The Just One" },
  { num: 87, ar: "ٱلْجَامِعُ", latin: "Al-Jāmiʿ", meaning: "The Gatherer, the Uniter" },
  { num: 88, ar: "ٱلْغَنِيُّ", latin: "Al-Ghaniyy", meaning: "The Self-Sufficient, The Wealthy" },
  { num: 89, ar: "ٱلْمُغْنِيُ", latin: "Al-Mughnī", meaning: "The Enricher" },
  { num: 90, ar: "ٱلْمَانِعُ", latin: "Al-Māniʿ", meaning: "The Withholder" },
  { num: 91, ar: "ٱلضَّارُّ", latin: "Aḍ-Ḍārr", meaning: "The Distresser" },
  { num: 92, ar: "ٱلنَّافِعُ", latin: "An-Nāfiʿ", meaning: "The Propitious, The Benefactor" },
  { num: 93, ar: "ٱلْنُورُ", latin: "An-Nūr", meaning: "The Light" },
  { num: 94, ar: "ٱلْهَادِي", latin: "Al-Hādī", meaning: "The Guide" },
  { num: 95, ar: "ٱلْبَدِيعُ", latin: "Al-Badīʿ", meaning: "The Incomparable Originator" },
  { num: 96, ar: "ٱلْبَاقِي", latin: "Al-Bāqī", meaning: "The Ever-Lasting" },
  { num: 97, ar: "ٱلْوَارِثُ", latin: "Al-Wāriṯ", meaning: "The Inheritor" },
  { num: 98, ar: "ٱلرَّشِيدُ", latin: "Ar-Rashīd", meaning: "The Guide to the Right Path" },
  { num: 99, ar: "ٱلصَّبُورُ", latin: "Aṣ-Ṣabūr", meaning: "The Patient" },
];

const SCHEMES = [
  { gradient: 'var(--gradient-emerald)', accent: 'var(--noor-jade-green)' },
  { gradient: 'var(--gradient-brand)', accent: 'var(--noor-brand)' },
  { gradient: 'var(--gradient-sapphire)', accent: 'var(--noor-sapphire-blue)' },
  { gradient: 'var(--gradient-coral)', accent: 'var(--noor-scarlet-red)' },
  { gradient: 'var(--gradient-amethyst)', accent: 'var(--noor-amethyst-purple)' },
  { gradient: 'var(--gradient-tangerine)', accent: 'var(--noor-tangerine)' },
];

const screenStyle = {
  width: '100%', height: '100%', position: 'relative',
  background: 'var(--color-surface-primary)', overflow: 'hidden'
};
const headerHeight = 'calc(var(--control-h-lg) * 2 + var(--size-max) * 2 + var(--size-2xl))';

function schemeStyle(index) {
  const scheme = SCHEMES[index % SCHEMES.length];
  return { '--surface-gradient': scheme.gradient, '--surface-accent': scheme.accent };
}

function normalized(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function visibleNames(query) {
  const needle = normalized(query);
  if (!needle) return NAMES;
  return NAMES.filter((name) => normalized(`${name.num} ${name.ar} ${name.latin} ${name.meaning}`).includes(needle));
}

function NamesHeader({ query = '', onQueryChange, onBack, disabled = false }) {
  const SearchBar = window.SearchBar;
  return (
    <div className="app-bar" style={{ height: headerHeight, padding: 'calc(var(--size-max) + var(--size-huge)) var(--size-2xl) var(--size-md)', flexDirection: 'column', alignItems: 'stretch', gap: 'var(--size-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--size-xl)', minHeight: 'var(--control-h-lg)' }}>
        <button className="ib ib-tonal" onClick={onBack} aria-label="Back">
          <span className="mi" data-i="arrow_back" aria-hidden="true"></span>
        </button>
        <span className="ab-title">Asma ul Husna</span>
      </div>
      {SearchBar ? (
        <SearchBar
          value={query}
          placeholder="Search by name, meaning, or number"
          ariaLabel="Search the 99 Names"
          disabled={disabled}
          onChange={onQueryChange}
        />
      ) : null}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="gradient-collection" role="status" aria-label="Loading the 99 Names">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="gradient-tile skeleton" aria-hidden="true"></div>
      ))}
    </div>
  );
}

function GridScreen({ mode = 'loaded', query = '', onQueryChange, onSelectName, onBack, onRetry }) {
  const EmptyState = window.EmptyState;
  const names = mode === 'empty' ? [] : visibleNames(query);
  const body = (() => {
    if (mode === 'loading') return <SkeletonGrid />;
    if (mode === 'error') return (
      <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {EmptyState ? <EmptyState icon="error" title="We couldn't load the 99 Names" description="Check your connection and try again." /> : null}
        <button className="btn btn-filled lg" style={{ alignSelf: 'center' }} onClick={onRetry}>Try again</button>
      </div>
    );
    if (!NAMES.length || mode === 'empty') return EmptyState ? (
      <EmptyState icon="menu_book" title="The 99 Names aren't available" description="Please try again in a moment." />
    ) : null;
    if (!names.length) return (
      <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {EmptyState ? <EmptyState icon="search_off" title={`No names match “${query}”`} description="Try a name, meaning, or number." /> : null}
        <button className="btn btn-tonal lg" style={{ alignSelf: 'center' }} onClick={() => onQueryChange && onQueryChange('')}>Clear search</button>
      </div>
    );
    return (
      <div className="gradient-collection">
        {names.map((name) => {
          const index = NAMES.findIndex((candidate) => candidate.num === name.num);
          return (
            <button
              key={name.num}
              className="gradient-tile"
              style={schemeStyle(index)}
              onClick={() => onSelectName && onSelectName(index)}
              aria-label={`${name.num}. ${name.latin}. ${name.meaning}`}
            >
              <span className="gradient-tile-number" aria-hidden="true">{name.num}</span>
              <span className="gradient-tile-arabic" aria-hidden="true">{name.ar}</span>
              <span className="gradient-tile-label" aria-hidden="true">{name.latin}</span>
            </button>
          );
        })}
      </div>
    );
  })();

  return (
    <div style={screenStyle}>
      <NamesHeader query={query} onQueryChange={onQueryChange} onBack={onBack} disabled={mode === 'loading'} />
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: `${headerHeight} var(--size-xl) var(--size-huge)`, boxSizing: 'border-box' }}>
        {body}
      </div>
    </div>
  );
}

function DetailScreen({ selectedIdx = 6, mode = 'loaded', onPrev, onNext, onBack, onRetry }) {
  const EmptyState = window.EmptyState;
  const safeIndex = Math.min(Math.max(Number(selectedIdx) || 0, 0), Math.max(NAMES.length - 1, 0));
  const name = NAMES[safeIndex];

  if (mode !== 'loaded' || !name) {
    const title = mode === 'error' ? "We couldn't load this name" : mode === 'empty' ? "The 99 Names aren't available" : 'Loading name';
    return (
      <div style={screenStyle}>
        <div className="app-bar" style={{ padding: 'calc(var(--size-max) + var(--size-huge)) var(--size-2xl) var(--size-md)', height: 'calc(var(--control-h-lg) + var(--size-max) + var(--size-huge))' }}>
          <button className="ib ib-tonal" onClick={onBack} aria-label="Back"><span className="mi" data-i="arrow_back" aria-hidden="true"></span></button>
        </div>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--size-huge)', boxSizing: 'border-box' }}>
          {mode === 'loading' ? <div className="btn-spinner" role="status" aria-label="Loading name"></div> : EmptyState ? <EmptyState icon={mode === 'error' ? 'error' : 'menu_book'} title={title} description="Please try again in a moment." /> : null}
          {mode === 'error' ? <button className="btn btn-filled lg" onClick={onRetry}>Try again</button> : null}
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...screenStyle, display: 'flex', flexDirection: 'column' }}>
      <div className="app-bar" style={{ padding: 'calc(var(--size-max) + var(--size-huge)) var(--size-2xl) var(--size-md)', height: 'calc(var(--control-h-lg) + var(--size-max) + var(--size-huge))' }}>
        <button className="ib ib-tonal" onClick={onBack} aria-label="Back to all names"><span className="mi" data-i="arrow_back" aria-hidden="true"></span></button>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'calc(var(--control-h-lg) + var(--size-max) + var(--size-huge)) var(--size-huge) var(--size-2xl)', boxSizing: 'border-box', overflowY: 'auto' }}>
        <article className="gradient-detail-card" style={schemeStyle(safeIndex)} aria-label={`${name.num} of ${NAMES.length}. ${name.latin}. ${name.meaning}`}>
          <div className="gradient-tile-number" aria-hidden="true">{name.num}</div>
          <div className="arabic body-h1" style={{ color: 'var(--surface-accent)' }} aria-hidden="true">{name.ar}</div>
          <div className="gradient-detail-divider" aria-hidden="true"></div>
          <div className="body-h3 fw-bold" style={{ color: 'var(--color-action-primary)' }}>{name.latin}</div>
          <div className="body-m" style={{ color: 'var(--color-info-secondary)', marginTop: 'var(--size-xl)' }}>{name.meaning}</div>
        </article>
      </div>
      <nav aria-label="Browse the 99 Names" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--size-2xl) var(--size-huge) var(--size-max)' }}>
        <button className="ib ib-filled" onClick={onPrev} disabled={safeIndex <= 0} aria-label={safeIndex > 0 ? `Previous: ${NAMES[safeIndex - 1].latin}` : 'No previous name'}>
          <span className="mi" data-i="arrow_back" aria-hidden="true"></span>
        </button>
        <div className="chip tonal" aria-live="polite">{safeIndex + 1} / {NAMES.length}</div>
        <button className="ib ib-filled" onClick={onNext} disabled={safeIndex >= NAMES.length - 1} aria-label={safeIndex < NAMES.length - 1 ? `Next: ${NAMES[safeIndex + 1].latin}` : 'No next name'}>
          <span className="mi" data-i="arrow_forward" aria-hidden="true"></span>
        </button>
      </nav>
    </div>
  );
}

Object.assign(window, {
  GridScreen,
  DetailScreen,
  ASMA_NAMES: NAMES,
  ASMA_VISIBLE_NAMES: visibleNames,
});
