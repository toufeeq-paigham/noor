// Shared bottom nav bar — single source for the app tab list + markup.
// Used by BOTH the live interactive device (Home Screen.dc.html, via <x-import>)
// and every static storyboard frame (tabs-row.jsx renders <BottomNav/> directly).
// Styling comes from the shared `.nb-bar` / `.nb-item` kit in _theme/components.css.
//
// Props:
//   activeIndex — index (0-4) of the highlighted tab; also drives the glow position.
//   onSelect    — optional (index) => void. When omitted the bar is non-interactive
//                 (used by the storyboard, where the whole frame is the click target).

const NAV_TABS = [
  { label: 'Home', icon: 'home' },
  { label: 'Qaum', icon: 'group' },
  { label: 'Quran', icon: 'menu_book' },
  { label: 'Salaah', icon: 'mosque' },
  { label: 'Profile', icon: 'person' }
];

function BottomNav({ activeIndex = 0, onSelect }) {
  const idx = Number(activeIndex) || 0;
  const glowLeft = idx * (100 / NAV_TABS.length) + '%';
  return (
    <div className="nb-bar">
      <div className="nb-glow" style={{ left: glowLeft }}></div>
      <div className="nb-nav">
        {NAV_TABS.map((t, i) => (
          <div
            key={i}
            className={`nb-item ${i === idx ? 'active' : ''}`}
            onClick={onSelect ? () => onSelect(i) : undefined}
          >
            <span className="material-symbols-rounded">{t.icon}</span>
            <span>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { BottomNav, NAV_TABS });
