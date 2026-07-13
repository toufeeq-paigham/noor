// Shared screen components for the Hijri flow.
// These are used both by the static storyboard rows (calendar-row.jsx) and the live interactive device (Hijri.dc.html).

const MONTHS_DATA = [
  {
    name: 'Dhul Hijjah 1447',
    gregorian: 'May – June 2026',
    days: [
      { g: '17', h: '29', muted: true }, { g: '18', h: '1' }, { g: '19', h: '2' }, { g: '20', h: '3' }, { g: '21', h: '4' }, { g: '22', h: '5' }, { g: '23', h: '6' },
      { g: '24', h: '7' }, { g: '25', h: '8' }, { g: '26', h: '9' }, { g: '27', h: '10' }, { g: '28', h: '11' }, { g: '29', h: '12' }, { g: '30', h: '13' },
      { g: '31', h: '14' }, { g: '1', h: '15', muted: true }, { g: '2', h: '16', muted: true }, { g: '3', h: '17', muted: true }, { g: '4', h: '18', muted: true }, { g: '5', h: '19', muted: true }, { g: '6', h: '20', muted: true },
      { g: '7', h: '21', muted: true }, { g: '8', h: '22', muted: true }, { g: '9', h: '23', muted: true }, { g: '10', h: '24', muted: true }, { g: '11', h: '25', muted: true }, { g: '12', h: '26', muted: true }, { g: '13', h: '27', muted: true },
      { g: '14', h: '28', muted: true }, { g: '15', h: '29', muted: true }, { g: '16', h: '30', muted: true }, { g: '17', h: '1', muted: true }, { g: '18', h: '2', muted: true }, { g: '19', h: '3', muted: true }, { g: '20', h: '4', muted: true }
    ],
    events: [
      { num: '9', title: 'Day of Arafah', sub: 'The holiest day in Islam, day of fasting' },
      { num: '10', title: 'Eid al-Adha', sub: 'Festival of Sacrifice' }
    ]
  },
  {
    name: 'Muharram 1448',
    gregorian: 'Jun – July 2026',
    days: [
      { g: '27', h: '14', muted: true }, { g: '28', h: '15', muted: true }, { g: '29', h: '16', muted: true },
      { g: '1', h: '17' }, { g: '2', h: '18' }, { g: '3', h: '19' }, { g: '4', h: '20' },
      { g: '5', h: '21' }, { g: '6', h: '22' }, { g: '7', h: '23' }, { g: '8', h: '24' },
      { g: '9', h: '25' }, { g: '10', h: '26' }, { g: '11', h: '27' },
      { g: '12', h: '28' }, { g: '13', h: '29' }, { g: '14', h: '30' }, { g: '15', h: 'Jul 1' },
      { g: '16', h: '2' }, { g: '17', h: '3' }, { g: '18', h: '4' },
      { g: '19', h: '5' }, { g: '20', h: '6' }, { g: '21', h: '7' }, { g: '22', h: '8' },
      { g: '23', h: '9' }, { g: '24', h: '10' }, { g: '25', h: '11' },
      { g: '26', h: '12' }, { g: '27', h: '13' }, { g: '28', h: '14' }, { g: '29', h: '15' },
      { g: '1', h: '16', muted: true }, { g: '2', h: '17', muted: true }, { g: '3', h: '18', muted: true }
    ],
    events: [
      { num: '1', title: 'Islamic New Year', sub: 'Beginning of the Islamic calendar year' },
      { num: '10', title: 'Day of Ashura', sub: 'Day of remembrance and fasting' }
    ]
  },
  {
    name: 'Safar 1448',
    gregorian: 'July – August 2026',
    days: [
      { g: '12', h: '27', muted: true }, { g: '13', h: '28', muted: true }, { g: '14', h: '29', muted: true }, { g: '15', h: '30', muted: true }, { g: '16', h: '1' }, { g: '17', h: '2' }, { g: '18', h: '3' },
      { g: '19', h: '4' }, { g: '20', h: '5' }, { g: '21', h: '6' }, { g: '22', h: '7' }, { g: '23', h: '8' }, { g: '24', h: '9' }, { g: '25', h: '10' },
      { g: '26', h: '11' }, { g: '27', h: '12' }, { g: '28', h: '13' }, { g: '29', h: '14' }, { g: '30', h: '15' }, { g: '31', h: '16' }, { g: '1', h: '17' },
      { g: '2', h: '18' }, { g: '3', h: '19' }, { g: '4', h: '20' }, { g: '5', h: '21' }, { g: '6', h: '22' }, { g: '7', h: '23' }, { g: '8', h: '24' },
      { g: '9', h: '25' }, { g: '10', h: '26' }, { g: '11', h: '27' }, { g: '12', h: '28' }, { g: '13', h: '29' }, { g: '14', h: '30' }, { g: '15', h: '1', muted: true }
    ],
    events: [
      { num: '20', title: "Arba'een", sub: "Remembrance of the martyrdom of Husayn ibn Ali" }
    ]
  }
];

function CalendarScreen({
  monthIdx = 1,
  selectedIdx = 11,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
  onBack
}) {
  const currentMonth = MONTHS_DATA[monthIdx] || MONTHS_DATA[1];
  const days = currentMonth.days;
  const events = currentMonth.events;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--color-surface-primary)' }}>
      
      {/* AppBar (uses tokens, no hardcoded colors, theme-aware) */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14, padding: '62px 16px 8px' }}>
        <button className="ib ib-tonal md" onClick={onBack} aria-label="Back">
          <span className="mi" data-i="arrow_back"></span>
        </button>
        <div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 24, fontWeight: 800, color: 'var(--color-info-primary)', lineHeight: 1.1 }}>
            {currentMonth.name}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-info-secondary)', marginTop: 2 }}>
            {currentMonth.gregorian}
          </div>
        </div>
      </div>

      {/* Content wrapper */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '12px 16px 24px' }}>
        
        {/* Calendar Card */}
        <div className="cal-card">
          <div className="cal-hdr">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>
          <div className="cal-grid">
            {days.map((c, i) => {
              const isRow0 = i < 7;
              const isSelected = i === selectedIdx;
              const cellClass = `cal-cell${isRow0 ? ' row0' : ''}${c.muted ? ' muted' : ''}${isSelected ? ' today' : ''}`;
              
              return (
                <div key={i} className={cellClass} onClick={() => onSelectDay && onSelectDay(i)}>
                  <div className="cal-g">{c.g}</div>
                  <div className="cal-h">{c.h}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Month Navigation Buttons (prev and next buttons are to navigate between the months) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '18px 6px 0' }}>
          <button className="ib ib-tonal" onClick={onPrevMonth} aria-label="Previous Month">
            <span className="mi" data-i="chevron_left"></span>
          </button>
          <button className="ib ib-tonal" onClick={onNextMonth} aria-label="Next Month">
            <span className="mi" data-i="chevron_right"></span>
          </button>
        </div>

        {/* Events list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 22 }}>
          {events.map((evt, idx) => (
            <div key={idx} className="evt-card">
              <div className="evt-num">{evt.num}</div>
              <div>
                <div className="evt-title">{evt.title}</div>
                <div className="evt-sub">{evt.sub}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// Export on window scope for dynamic board imports
Object.assign(window, { CalendarScreen, MONTHS_DATA });
