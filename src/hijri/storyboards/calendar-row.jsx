// Calendar view — deterministic loading, selection, navigation, empty, and recovery states.
// Rendered on the Hijri board via:
//   <x-import component="CalendarRow" from="./storyboards/calendar-row.jsx" active="{{ calendarActive }}">
// `active` = index of the frame the live device currently shows (-1 = none).

const STORYBOARD_FRAMES = [
  { name: 'Loading current month', monthIdx: 1, selectedIdx: 11, mode: 'loading' },
  { name: 'Muharram — today selected', monthIdx: 1, selectedIdx: 11, mode: 'loaded' },
  { name: 'Muharram — another date selected', monthIdx: 1, selectedIdx: 17, mode: 'loaded' },
  { name: 'Safar — next month', monthIdx: 2, selectedIdx: -1, mode: 'loaded' },
  { name: 'Dhul Hijjah — previous month', monthIdx: 0, selectedIdx: -1, mode: 'loaded' },
  { name: 'Month with no events', monthIdx: 2, selectedIdx: -1, mode: 'empty' },
  { name: 'Load failure — retry sheet', monthIdx: 1, selectedIdx: 11, mode: 'error' }
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
          const { CalendarScreen } = window;
          screenContent = CalendarScreen && (
            <CalendarScreen
              monthIdx={f.monthIdx}
              selectedIdx={f.selectedIdx}
              mode={f.mode}
            />
          );

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
