// Calendar view — static storyboard row (4 states: starting with Home Screen, then navigating months).
// Rendered on the Hijri board via:
//   <x-import component="CalendarRow" from="./storyboards/calendar-row.jsx" active="{{ calendarActive }}">
// `active` = index of the frame the live device currently shows (-1 = none).

const STORYBOARD_FRAMES = [
  { name: 'Home tab — Islamic tools link', isHome: true },
  { name: 'Muharram 1448 (Today selected)', monthIdx: 1, selectedIdx: 11 },
  { name: 'Safar 1448 view', monthIdx: 2, selectedIdx: -1 },
  { name: 'Dhul Hijjah 1447 view', monthIdx: 0, selectedIdx: -1 }
];

function CalendarRow({ active = -1, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="calendar_month"></span>
        01 · Calendar View — Month Grid &amp; Selection states · {STORYBOARD_FRAMES.length} states
      </div>
      <div className="poc-board">
        {STORYBOARD_FRAMES.map((f, i) => {
          const isActive = active === i;
          const ringClass = isActive ? 'is-active' : '';
          
          let screenContent = null;
          if (f.isHome) {
            const { HomeScreen, BottomNav } = window;
            screenContent = (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                  {HomeScreen ? <HomeScreen /> : <div style={{ padding: 20, color: 'var(--color-info-secondary)' }}>Loading Home...</div>}
                </div>
                {BottomNav ? <BottomNav activeIndex={0} /> : null}
              </div>
            );
          } else {
            const { CalendarScreen } = window;
            screenContent = CalendarScreen && (
              <CalendarScreen
                monthIdx={f.monthIdx}
                selectedIdx={f.selectedIdx}
              />
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

Object.assign(window, { CalendarRow, CALENDAR_STORYBOARD_FRAMES: STORYBOARD_FRAMES });
