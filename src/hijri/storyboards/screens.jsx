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
  mode = 'loaded',
  onSelectDay,
  onPrevMonth,
  onNextMonth,
  onBack,
  onRetry,
  onDismissError
}) {
  const currentMonth = MONTHS_DATA[monthIdx] || MONTHS_DATA[1];
  const days = currentMonth.days;
  const events = mode === 'empty' ? [] : currentMonth.events;
  const Dialog = window.Dialog;
  const EmptyState = window.EmptyState;
  const loading = mode === 'loading';

  return (
    <div className="hijri-screen">
      <div className="hijri-appbar">
        <button className="ib ib-tonal md" onClick={onBack} aria-label="Back">
          <span className="mi" data-i="arrow_back" aria-hidden="true"></span>
        </button>
        <div className="hijri-appbar-copy">
          <div className="hijri-title">{loading ? 'Hijri Calendar' : currentMonth.name}</div>
          <div className="hijri-subtitle">{loading ? 'Preparing the current month' : currentMonth.gregorian}</div>
        </div>
      </div>

      <div className="hijri-content">
        {loading ? (
          <div className="hijri-loading" role="status" aria-label="Loading Hijri calendar">
            <div className="skeleton hijri-calendar-skeleton" aria-hidden="true"></div>
            <div className="skeleton hijri-event-skeleton" aria-hidden="true"></div>
            <div className="skeleton hijri-event-skeleton" aria-hidden="true"></div>
          </div>
        ) : (
          <>
            <div className="hijri-calendar-card">
              <div className="hijri-weekdays" aria-hidden="true">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div key={day} className="hijri-weekday">{day}</div>)}
              </div>
              <div className="hijri-grid" role="grid" aria-label={currentMonth.name}>
                {days.map((day, index) => {
                  const selected = index === selectedIdx;
                  const today = monthIdx === 1 && index === 11;
                  const className = `hijri-day${index < 7 ? ' row-first' : ''}${day.muted ? ' muted' : ''}${selected ? ' selected' : ''}${today ? ' today' : ''}`;
                  return (
                    <button
                      key={`${day.g}:${day.h}:${index}`}
                      className={className}
                      disabled={day.muted}
                      onClick={() => onSelectDay && onSelectDay(index)}
                      aria-pressed={selected}
                      aria-label={`Gregorian ${day.g}, Hijri ${day.h}${today ? ', today' : ''}`}
                    >
                      <span className="hijri-day-gregorian" aria-hidden="true">{day.g}</span>
                      <span className="hijri-day-hijri" aria-hidden="true">{day.h}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="hijri-month-actions">
              <button className="ib ib-tonal" disabled={monthIdx === 0} onClick={onPrevMonth} aria-label="Previous month">
                <span className="mi" data-i="chevron_left" aria-hidden="true"></span>
              </button>
              <button className="ib ib-tonal" disabled={monthIdx === MONTHS_DATA.length - 1} onClick={onNextMonth} aria-label="Next month">
                <span className="mi" data-i="chevron_right" aria-hidden="true"></span>
              </button>
            </div>

            <div className={`hijri-events${events.length ? '' : ' hijri-events-empty'}`} aria-label="Islamic events">
              {events.length ? events.map((event) => (
                <button key={`${event.num}:${event.title}`} className="list-row-emphasized">
                  <span className="list-row-emphasized-number" aria-hidden="true">{event.num}</span>
                  <span className="list-row-emphasized-body">
                    <span className="list-row-emphasized-title">{event.title}</span>
                    <span className="list-row-emphasized-subtitle">{event.sub}</span>
                  </span>
                </button>
              )) : EmptyState ? (
                <EmptyState icon="event_busy" title={`No events for ${currentMonth.name}`} description="Swipe or use the month controls to explore another month." />
              ) : null}
            </div>
          </>
        )}
      </div>

      {Dialog ? (
        <Dialog
          mode="sheet"
          isOpen={mode === 'error'}
          onClose={onDismissError}
          title="We couldn't load the Hijri calendar"
          description="Your last calendar view is still here. Check your connection and try again."
          primary={{ text: 'Try again', onClick: onRetry }}
          secondary={{ text: 'Dismiss', onClick: onDismissError }}
        />
      ) : null}
    </div>
  );
}

// Export on window scope for dynamic board imports
Object.assign(window, { CalendarScreen, MONTHS_DATA });
