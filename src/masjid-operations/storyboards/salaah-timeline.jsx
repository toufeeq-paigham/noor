// Salaah timings — Timeline of the Day. The masjid's salaah CONFIGURATION screen (the console's
// Salaah destination), not the reading surface. Home's Salaah tab is a different screen and is
// untouched by this.
//
// THE THREE VALUES
//   start   calculated from location and date, and it slides all year — Asr can open at 3:50 in one
//           season and 4:10 in another. Never settable; shown as an immovable tick.
//   azaan   when the masjid actually calls it, some way after start. THIS is what the committee
//           sets (SalaahConfig.salaahTime).
//   iqama   minutes from azaan to jamaat (SalaahConfig.iqamaDelay). Jamaat is derived: azaan + delay.
//
// So there are two settings per prayer, not one, and the row is split into two drag zones for them:
//
//   ·  drag the LEFT half  (name, START, AZAAN) → the whole prayer moves; the delay is preserved
//   ·  drag the RIGHT half (IQAMA, ENDS)        → only the delay changes
//
// The segment between the two dots on the rail IS the iqama delay. You lengthen it by pulling its far
// end, which is the most literal representation available and needs no separate control.
//
// ONE THING THE PORT HAS TO SOLVE THAT THIS POC DOES NOT
// The value drag is vertical, and so is scrolling. With the zones covering the whole card, a downward
// swipe is ambiguous: move Asr later, or scroll the list? A mouse has no such ambiguity, so the POC
// demonstrates the design correctly and hides the conflict. Compose must gate the drag — a long press
// to engage (~160ms) with the row lifting to confirm is the standard resolution, and it is what the
// touch case needs; `touch-action` alone cannot express it, because it is evaluated when the gesture
// starts, before intent is known.
//
// WHAT IS NOT ASKED
// FIXED / ON_TIME / VARIES_WITH_ON_TIME never appears. The taxonomy is a storage concern and a
// single edit cannot distinguish the modes anyway. Default to fixed, then learn: a masjid that keeps
// nudging Asr's azaan to track its sliding start is describing VARIES_WITH_ON_TIME, and the service
// can see that in the deltas after a few edits and OFFER it. It must never silently rewrite a
// published time — 1,284 musalleen act on these, so learning proposes and a human still publishes.
//
// JUMAH is weekly and replaces Zohar, so it cannot sit honestly on a spine showing today. It gets
// its own Friday block under the spine: always visible so it is never left unset, never pretending
// to be today.

const stlMin = (h, m) => h * 60 + m;
const stlHM = (mins) => {
  const m = ((Math.round(mins) % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  return { h12: h24 % 12 === 0 ? 12 : h24 % 12, mm: String(m % 60).padStart(2, '0'), pm: h24 >= 12 };
};
const stlFmt = (mins) => { const t = stlHM(mins); return `${t.h12}:${t.mm} ${t.pm ? 'PM' : 'AM'}`; };
// The struck previous value is a reference, not a statement, so it drops the meridiem — which also
// keeps a changed value inside its column instead of overflowing it.
const stlShort = (mins) => { const t = stlHM(mins); return `${t.h12}:${t.mm}`; };

// `opens` is the calculated start; `closes` is where the window shuts and `ends` names what shuts it.
// Both times derive from the day the app already fetches (SalaahTime.startTime and the next prayer's
// start), so no new backend contract — SalaahPeriodResolution already models windowStart/windowEnd.
// `ends` is a bare noun so it reads in both places it is used: "until sunrise", "past sunrise".
const STL_PRAYERS = [
  { key: 'fajr', label: 'Fajr', opens: stlMin(4, 52), closes: stlMin(6, 14),
    ends: 'sunrise', azaan: stlMin(5, 30), iqama: 20 },
  { key: 'zohar', label: 'Zohar', opens: stlMin(12, 28), closes: stlMin(16, 12),
    ends: 'Asr', azaan: stlMin(13, 15), iqama: 15 },
  { key: 'asr', label: 'Asr', opens: stlMin(16, 12), closes: stlMin(18, 48),
    ends: 'sunset', azaan: stlMin(16, 30), iqama: 15 },
  { key: 'maghrib', label: 'Maghrib', opens: stlMin(18, 48), closes: stlMin(19, 58),
    ends: 'Isha', azaan: stlMin(18, 50), iqama: 5 },
  { key: 'isha', label: 'Isha', opens: stlMin(19, 58), closes: stlMin(23, 59),
    ends: 'midnight', azaan: stlMin(20, 15), iqama: 15 },
];

// Weekly, and it takes Zohar's window because it takes Zohar's place.
const STL_JUMAH = {
  key: 'jumah', label: 'Jumah', opens: stlMin(12, 28), closes: stlMin(16, 12),
  ends: 'Asr', azaan: stlMin(13, 20), iqama: 20,
};

const STL_ALL = STL_PRAYERS.concat([STL_JUMAH]);
const stlPrayer = (key) => STL_ALL.find((p) => p.key === key);

const STL_NOW = stlMin(11, 2);
const STL_REACH = '1,284';
const STL_BY = 'Ayaan Khan';
const STL_AGO = '12 days ago';

// The axis has to reach midnight, not 9 PM: Isha's window closes at midnight, so a shorter axis both
// clipped its window band — understating the bound the screen exists to show — and left Isha's dot at
// 95% of the spine, where its row could only be placed by running past the bottom into the Friday
// block. Ending the axis where the last window ends fixes both without a taller screen.
const STL_SPAN_FROM = stlMin(4, 30);
const STL_SPAN_TO = stlMin(23, 59);
const STL_SPINE_H = 620;           // must match .stl-spine height in salaah-timeline.css
const STL_ROW_H = 62;              // measured in the browser: the four-value strip, nothing else
const STL_ROW_GAP = 6;
const STL_STEP = 5;                // masjids set azaan and iqama in 5-minute increments
const STL_PX_PER_MIN = 2.5;
const STL_IQAMA_MIN = 5;           // a jamaat called the same minute as azaan is not a thing
const STL_IQAMA_MAX = 90;

const stlPct = (mins) =>
  ((Math.min(Math.max(mins, STL_SPAN_FROM), STL_SPAN_TO) - STL_SPAN_FROM) /
    (STL_SPAN_TO - STL_SPAN_FROM)) * 100;
const stlPx = (mins) => (stlPct(mins) / 100) * STL_SPINE_H;

// Maghrib and Isha sit ~85 minutes apart in a ~16.5 hour day, so at true proportional spacing their
// rows collide at any spine height that fits a phone. The DOTS stay exactly where the times fall;
// the ROW is pushed down by the minimum needed to clear its neighbour and joined by a leader. Same
// answer a map gives when two place names land on each other.
const stlLayout = (cfgOf, prayers) => {
  let floor = -Infinity;
  return (prayers || STL_PRAYERS).map((p) => {
    const c = cfgOf(p);
    const dot = stlPx(c.azaan);
    const wanted = dot - STL_ROW_H / 2;
    const top = Math.max(wanted, floor);
    floor = top + STL_ROW_H + STL_ROW_GAP;
    return { key: p.key, dot, jamaatDot: stlPx(c.azaan + c.iqama), top, shift: top - wanted };
  });
};

/* ═══ One prayer's row ═════════════════════════════════════════════════════ */

function StlRow({ p, cfg, published, scan, drag, bad, live, onGrab }) {
  const jamaat = cfg.azaan + cfg.iqama;
  const movedAzaan = cfg.azaan !== published.azaan;
  const movedIqama = cfg.iqama !== published.iqama;
  const grabbing = drag && drag.key === p.key ? drag.handle : null;
  // A scanned proposal is not the value. The board says one thing, the masjid still publishes another,
  // so the proposal is named beside the live value and only becomes the value when it is added to the
  // draft. Amber cannot carry it as text — #FE9A00 measures 2.05:1 on this card — so the marker is a
  // dot and the words stay dark.
  const proposedAzaan = scan && scan.azaan !== cfg.azaan ? scan.azaan : null;
  const proposedIqama = scan && scan.iqama !== cfg.iqama ? scan.iqama : null;
  // A reading that cannot exist is drawn as impossible, not as a suggestion. Red, not amber: LED boards
  // drop digits, so "Fajr at 4:45" when Fajr opens at 4:52 is an ordinary misread and the screen has to
  // say so rather than offer it.
  const faultMark = scan && scan.fault ? 'stl-scanmark is-fault' : 'stl-scanmark';
  return (
    <div
      className={[
        'stl-row',
        bad ? 'is-bad' : '',
        grabbing ? 'is-dragging' : '',
        movedAzaan || movedIqama ? 'is-changed' : '',
        scan ? (scan.fault ? 'is-scanfault' : 'is-scanned') : '',
      ].filter(Boolean).join(' ')}
    >
      {/* All four values on one line, in the order the day runs them. START and ENDS are the prayer's
          boundary, stated plainly — neither a tray around the settable pair nor a hairline spanning
          them survived, because inside a card each read as decoration rather than as the bound. What
          separates settable from calculated is darkness and size: AZAAN and IQAMA are near-black,
          large, and carry the drag glyph; START and ENDS are grey and small. One line and not two —
          the name on its own row cost 13px, and at ~110px a row the spine cannot place five prayers
          without collisions. */}
      {/* The row is two drag zones, not two small handles: the left half — name, START and AZAAN —
          moves the azaan, the right half — IQAMA and ENDS — changes the delay. Each is ~150 x 62
          rather than 66 x 43, so the target is the card, and the calculated value each zone contains
          names the bound that zone's drag is measured against.
          The five columns are declared ONCE on the strip and the zones adopt them with
          `grid-template-columns: subgrid`. Restating the widths inside each zone would align only for
          as long as two sets of numbers agreed — subgrid makes one grid the single source. */}
      <span className="stl-strip">
        <button
          className={[
            'stl-zone', 'is-azaan',
            grabbing === 'azaan' ? 'is-grab' : '', movedAzaan ? 'is-moved' : '',
          ].filter(Boolean).join(' ')}
          onPointerDown={live ? onGrab(p, 'azaan') : undefined}
          aria-label={`${p.label} azaan, ${stlFmt(cfg.azaan)}${movedAzaan ? `, was ${stlFmt(published.azaan)}` : ''}. ${p.label} starts ${stlFmt(p.opens)}. Drag to change the azaan.`}
        >
          <span className="stl-name">{p.label}</span>
          <span className="stl-edge">
            <em>START</em>
            <span>{stlFmt(p.opens)}</span>
          </span>
          {/* Was → is lives in the label row, not beside the value: a second time on the value line
              overflows the column, and once a value has moved "WAS 5:30" is worth more than repeating
              the column header its position already gives you. */}
          <span className="stl-slot">
            <em>{proposedAzaan != null
              ? <React.Fragment><i className={faultMark}></i>{stlShort(proposedAzaan)}</React.Fragment>
              : movedAzaan ? `WAS ${stlShort(published.azaan)}` : 'AZAAN'}
              {live ? <i className="mi" data-i="unfold_more"></i> : null}</em>
            <span className="stl-val"><b>{stlFmt(cfg.azaan)}</b></span>
          </span>
        </button>

        <button
          className={[
            'stl-zone', 'is-iqama',
            grabbing === 'iqama' ? 'is-grab' : '', movedIqama ? 'is-moved' : '',
          ].filter(Boolean).join(' ')}
          onPointerDown={live ? onGrab(p, 'iqama') : undefined}
          aria-label={`${p.label} iqama, ${stlFmt(jamaat)}, ${cfg.iqama} minutes after azaan${movedIqama ? `, was ${published.iqama}` : ''}. Window closes ${stlFmt(p.closes)}. Drag to change the delay.`}
        >
          <span className="stl-slot">
            <em>{proposedIqama != null
              ? <React.Fragment><i className={faultMark}></i>{stlShort(scan.azaan + scan.iqama)}</React.Fragment>
              : movedIqama ? `WAS ${stlShort(published.azaan + published.iqama)}` : 'IQAMA'}
              {live ? <i className="mi" data-i="unfold_more"></i> : null}</em>
            <span className="stl-val"><b>{stlFmt(jamaat)}</b></span>
          </span>
          <span className="stl-edge">
            <em>ENDS</em>
            <span>{stlFmt(p.closes)}</span>
          </span>
        </button>
      </span>

    </div>
  );
}

/* ═══ The drag, as a hook ══════════════════════════════════════════════════
   Owned here rather than by whichever screen hosts the timeline, so the clamping rules — azaan cannot
   precede the calculated start, iqama cannot cross the window close — live in exactly one place. The
   in-flight gesture stays local state and never reaches the console's store: it is a frame-rate stream,
   and the project's Qibla rule already settled that those do not travel through MVI. Only the committed
   value goes out, through onCommit. */

function useStlDrag({ cfgOf, prayerOf, onCommit, live, spineRef }) {
  const [drag, setDrag] = React.useState(null);
  const [bad, setBad] = React.useState(null);
  const grab = React.useRef(null);
  const badTimer = React.useRef(null);

  const scaleOf = () => {
    const el = spineRef.current;
    if (!el) return 1;
    const h = el.getBoundingClientRect().height;
    return h > 0 ? h / STL_SPINE_H : 1;
  };

  const flashBad = (key, why) => {
    setBad({ key, why });
    if (badTimer.current) clearTimeout(badTimer.current);
    // Feedback, not state: it clears itself so a row never sits red forever.
    badTimer.current = setTimeout(() => setBad(null), 1600);
  };

  const onGrab = (p, handle) => (e) => {
    if (!live) return;
    e.stopPropagation();
    grab.current = { key: p.key, handle, startY: e.clientY, from: cfgOf(p), moved: false };
    setDrag({ key: p.key, handle });
    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onMove = (e) => {
    const g = grab.current;
    if (!g) return;
    const dy = (e.clientY - g.startY) / scaleOf();
    if (!g.moved && Math.abs(dy) < 4) return;
    g.moved = true;
    const p = prayerOf(g.key);
    const step = Math.round(dy / STL_PX_PER_MIN / STL_STEP) * STL_STEP;

    if (g.handle === 'azaan') {
      const raw = g.from.azaan + step;
      let azaan = raw;
      let why = null;
      // Azaan cannot precede the calculated start, and jamaat has to land inside the window too.
      if (raw < p.opens) { azaan = p.opens; why = `${p.label} does not begin until ${stlFmt(p.opens)}`; }
      else if (raw + g.from.iqama > p.closes) {
        azaan = p.closes - g.from.iqama;
        why = `Iqama would fall past ${p.ends}, at ${stlFmt(p.closes)}`;
      }
      onCommit(g.key, { azaan, iqama: g.from.iqama });
      if (why) flashBad(g.key, why); else setBad(null);
    } else {
      const raw = g.from.iqama + step;
      let iqama = raw;
      let why = null;
      if (raw < STL_IQAMA_MIN) { iqama = STL_IQAMA_MIN; why = `Iqama is at least ${STL_IQAMA_MIN} minutes after azaan`; }
      else if (raw > STL_IQAMA_MAX) { iqama = STL_IQAMA_MAX; why = `Iqama tops out at ${STL_IQAMA_MAX} minutes`; }
      else if (g.from.azaan + raw > p.closes) {
        iqama = p.closes - g.from.azaan;
        why = `Iqama would fall past ${p.ends}, at ${stlFmt(p.closes)}`;
      }
      onCommit(g.key, { azaan: g.from.azaan, iqama });
      if (why) flashBad(g.key, why); else setBad(null);
    }
  };

  const onRelease = () => { grab.current = null; setDrag(null); };

  return { drag, bad, setBad, onGrab, onMove, onRelease };
}

/* ═══ The timeline ═════════════════════════════════════════════════════════
   Presentational, so the console and the standalone board render the same screen from different state
   owners. `scanOf(p)` returns a scanned proposal for a prayer or null; a proposal is drawn as an amber
   locator on the rail and named in the row, and it is NOT the value — nothing moves until the proposal
   is added to the draft, and nothing publishes until Publish. */

function StlTimeline({ prayers, jumah, cfgOf, pubOf, scanOf, drag, bad, live, onGrab, spineRef, now }) {
  const places = stlLayout(cfgOf, prayers);
  const spineOverflow = Math.max(0, places[places.length - 1].top + STL_ROW_H - STL_SPINE_H);
  const badFor = (key) => (bad && bad.key === key ? bad : null);
  const scan = scanOf || (() => null);

  return (
    <React.Fragment>
      {/* The rail is exactly the axis and no longer, but a displaced last row can sit below its end —
          Asr dragged to the edge of its window cascades past it. The overflow is absorbed as margin so
          whatever follows the spine is always pushed clear, rather than by stretching the rail past
          midnight, which would make the axis lie. */}
      <div className="stl-spine" ref={spineRef}
        style={{ marginBottom: `calc(var(--size-max) + ${spineOverflow}px)` }}>
        <div className="stl-rail"></div>

        {prayers.map((p) => (
          <span key={`win-${p.key}`} className={`stl-window ${drag && drag.key === p.key ? 'is-live' : ''}`}
            style={{ top: `${stlPx(p.opens)}px`, height: `${stlPx(p.closes) - stlPx(p.opens)}px` }}></span>
        ))}

        {/* The calculated start: an immovable tick, so the runway's beginning is never mistaken for
            something the committee chose. */}
        {prayers.map((p) => (
          <span key={`st-${p.key}`} className="stl-start" style={{ top: `${stlPx(p.opens)}px` }}></span>
        ))}

        {/* The iqama delay drawn as what it is: the length of rail between azaan and jamaat. */}
        {prayers.map((p, i) => {
          const c = cfgOf(p);
          const pub = pubOf(p);
          const sc = scan(p);
          const a = places[i].dot;
          const b = places[i].jamaatDot;
          return (
            <React.Fragment key={`seg-${p.key}`}>
              {c.azaan !== pub.azaan ? (
                <span className="stl-ghost" style={{ top: `${stlPx(pub.azaan)}px` }}></span>
              ) : null}
              {/* A scanned proposal: where the board says this azaan is, and the distance from where it
                  is now. The row states the times; this only says where on the day it lands. */}
              {sc ? (
                <React.Fragment>
                  <span className={`stl-travel ${sc.fault ? 'is-fault' : ''}`} style={{
                    top: `${Math.min(a, stlPx(sc.azaan))}px`,
                    height: `${Math.max(Math.abs(stlPx(sc.azaan) - a), 2)}px`,
                  }}></span>
                  <span className={`stl-scandot ${sc.fault ? 'is-fault' : ''}`} style={{ top: `${stlPx(sc.azaan)}px` }}></span>
                </React.Fragment>
              ) : null}
              <span className="stl-delay" style={{ top: `${a}px`, height: `${Math.max(b - a, 3)}px` }}></span>
              <span className={`stl-dot ${drag && drag.key === p.key ? 'is-live' : ''}`} style={{ top: `${a}px` }}></span>
              <span className="stl-dot is-jamaat" style={{ top: `${b}px` }}></span>
            </React.Fragment>
          );
        })}

        {/* Rail annotations live in a 46px gutter, so they are glyphs and never words: the labels they
            used to carry ("sunrise 6:14 AM", "now 11:02 AM") ran underneath the row cards and rendered
            clipped to "SU". Both times are already stated in the rows themselves — Fajr ENDS 6:14 AM is
            sunrise, Asr ENDS 6:48 PM is sunset — so nothing is lost. */}
        <div className="stl-daymark" title="sunrise 6:14 AM" style={{ top: `${stlPx(stlMin(6, 14))}px` }}>
          <i className="mi" data-i="wb_sunny"></i>
        </div>
        <div className="stl-daymark" title="sunset 6:48 PM" style={{ top: `${stlPx(stlMin(18, 48))}px` }}>
          <i className="mi" data-i="bedtime"></i>
        </div>
        <div className="stl-now" title={`now ${stlFmt(now == null ? STL_NOW : now)}`}
          style={{ top: `${stlPx(now == null ? STL_NOW : now)}px` }}>
          <span>NOW</span>
        </div>

        {prayers.map((p, i) => (
          <div key={p.key} className="stl-node">
            {places[i].shift > 3 ? (
              <span className="stl-leader"
                style={{ top: `${places[i].dot}px`, height: `${places[i].shift + STL_ROW_H / 2}px` }}></span>
            ) : null}
            <div className="stl-body" style={{ top: `${places[i].top}px` }}>
              <StlRow p={p} cfg={cfgOf(p)} published={pubOf(p)} scan={scan(p)} drag={drag}
                bad={badFor(p.key)} live={live} onGrab={onGrab} />
            </div>
          </div>
        ))}
      </div>

      {/* Jumah is weekly and takes Zohar's place, so it gets its own block rather than a false position
          on today's spine — and stays visible so it is never left unset. */}
      {jumah ? (
        <div className="stl-friday">
          <div className="stl-friday-head">
            <span className="stl-eyebrow">EVERY FRIDAY</span>
            <small>Replaces Zohar</small>
          </div>
          <StlRow p={jumah} cfg={cfgOf(jumah)} published={pubOf(jumah)} scan={scan(jumah)}
            drag={drag} bad={badFor(jumah.key)} live={live} onGrab={onGrab} />
        </div>
      ) : null}
    </React.Fragment>
  );
}

/* ═══ The standalone board's screen ════════════════════════════════════════ */

function StlScreen({ preset = {}, live = false }) {
  const [draft, setDraft] = React.useState(preset.draft || {});
  const [publishing, setPublishing] = React.useState(!!preset.publishing);
  const [published, setPublished] = React.useState(false);
  const spineRef = React.useRef(null);

  const pubOf = (p) => ({ azaan: p.azaan, iqama: p.iqama });
  const cfgOf = (p) => Object.assign(pubOf(p), draft[p.key] || {});
  const changedKeys = Object.keys(draft).filter((k) => {
    const p = stlPrayer(k);
    const c = Object.assign(pubOf(p), draft[k]);
    return c.azaan !== p.azaan || c.iqama !== p.iqama;
  });
  const dirty = changedKeys.length > 0;

  const commit = (key, value) => {
    setPublished(false);
    setDraft((d) => Object.assign({}, d, { [key]: value }));
  };
  const { drag, bad, onGrab, onMove, onRelease } =
    useStlDrag({ cfgOf, prayerOf: stlPrayer, onCommit: commit, live, spineRef });
  const dragState = preset.drag && !drag ? preset.drag : drag;

  const doPublish = () => {
    if (!dirty || publishing) return;
    setPublishing(true);
    setTimeout(() => { setPublishing(false); setPublished(true); setDraft({}); }, 1400);
  };

  return (
    <main
      className="stl-screen"
      onPointerMove={live ? onMove : undefined}
      onPointerUp={live ? onRelease : undefined}
      onPointerCancel={live ? onRelease : undefined}
    >
      <div className="app-bar stl-bar">
        <button className="ib ib-tonal" aria-label="Back">
          <span className="mi" data-i="arrow_back"></span>
        </button>
        <div className="stl-bar-copy">
          <strong>Salaah timings</strong>
          <small>Masjid E Bilal</small>
        </div>
        {/* Scan lives in the app bar, not on a FAB: the bottom bar belongs to Publish, and a floating
            action above a full-width fixed action stacks two primaries that then compete. They are
            different tiers — scanning proposes values, Publish commits them. Labelled rather than a
            bare glyph, because photographing the board is the fast path in. */}
        <button className="btn sm btn-tonal stl-scan" aria-label="Scan the timing board">
          <span className="mi" data-i="photo_camera"></span>
          Scan board
        </button>
      </div>

      <div className="stl-scroll">
        <div className="stl-lede">
          <span className="stl-eyebrow">PUBLISHED NOW</span>
          <span className="stl-sign">
            <span className="mi" data-i="edit"></span>
            Last changed by <b>{STL_BY}</b> · {STL_AGO}
          </span>
        </div>

        {published ? (
          <div className="stl-done" role="status">
            <span className="mi" data-i="check_circle"></span>
            <span><strong>Published</strong>{STL_REACH} musalleen have the new timings.</span>
          </div>
        ) : null}

        <StlTimeline
          prayers={STL_PRAYERS} jumah={STL_JUMAH}
          cfgOf={cfgOf} pubOf={pubOf} scanOf={(p) => (preset.scan || {})[p.key] || null}
          drag={dragState} bad={bad || preset.bad || null}
          live={live} onGrab={onGrab} spineRef={spineRef}
        />
      </div>

      <div className="stl-publish">
        {/* The refusal used to live on a line inside the row, which meant every row reserved 22px for a
            message it almost never showed — and the line's idle content ("iqama +15 min · ends at Asr")
            was arithmetic the four visible times already give you. It sits here instead, pinned above
            the action and overlaying content rather than displacing it, because a strip that reflows the
            page mid-drag moves the thing under your finger. The row still shakes and its values still
            turn red, so which prayer refused is never in doubt. */}
        {(bad || preset.bad) ? (
          <div className="stl-refuse" role="alert">
            <span className="mi" data-i="error"></span>
            <span>{(bad || preset.bad).why}</span>
          </div>
        ) : null}
        <div className="stl-publish-note">
          {dirty ? (
            <React.Fragment>
              <strong>{changedKeys.length} {changedKeys.length === 1 ? 'prayer' : 'prayers'} changed</strong>
              <span>{STL_REACH} musalleen see this the moment you publish</span>
            </React.Fragment>
          ) : (
            <span>Nothing changed yet. Drag a prayer's azaan, or its iqama, to correct it.</span>
          )}
        </div>
        <button className="btn btn-filled lg" disabled={!dirty || publishing} onClick={doPublish}>
          {publishing ? <span className="btn-spinner"></span> : null}
          {publishing ? 'Publishing…' : `Publish to ${STL_REACH} musalleen`}
        </button>
      </div>
    </main>
  );
}

/* ═══ States ═══════════════════════════════════════════════════════════════ */

const STL_STATES = [
  { name: 'Reading · nothing changed',
    note: 'Start ticks, azaan dots, and the iqama delay as a length of rail. No config to answer.',
    preset: {} },
  { name: 'Dragging Asr azaan',
    note: 'The prayer moves and keeps its delay. The subtitle names the start and the window.',
    preset: { drag: { key: 'asr', handle: 'azaan' }, draft: { asr: { azaan: stlMin(16, 45), iqama: 15 } } } },
  { name: 'Dragging Asr iqama',
    note: 'Only the delay changes — the segment on the rail gets longer. azaan stays put.',
    preset: { drag: { key: 'asr', handle: 'iqama' }, draft: { asr: { azaan: stlMin(16, 30), iqama: 35 } } } },
  { name: 'Azaan before the start',
    note: 'Clamped to the calculated start and told why. Asr does not exist before 4:12.',
    preset: { drag: { key: 'asr', handle: 'azaan' }, draft: { asr: { azaan: stlMin(16, 12), iqama: 15 } },
      bad: { key: 'asr', why: 'Asr does not begin until 4:12 PM' } } },
  // Maghrib and not Asr: this state has to show the WINDOW clamping the delay, and Asr's window is
  // wide enough that STL_IQAMA_MAX bites first. Maghrib has only 68 minutes before Isha begins, so
  // the window is the binding limit and azaan stays put — which is the whole point of this handle.
  { name: 'Iqama past the window',
    note: 'The delay is clamped so iqama cannot cross into Isha. Azaan never moves. Same refusal, other handle.',
    preset: { drag: { key: 'maghrib', handle: 'iqama' }, draft: { maghrib: { azaan: stlMin(18, 50), iqama: 68 } },
      bad: { key: 'maghrib', why: 'Iqama would fall past Isha, at 7:58 PM' } } },
  { name: 'Jumah · the Friday block',
    note: 'Weekly, takes Zohar’s window, set the same way. Never on today’s spine.',
    preset: { drag: { key: 'jumah', handle: 'azaan' }, draft: { jumah: { azaan: stlMin(13, 30), iqama: 20 } } } },
  { name: 'Two changed',
    note: 'Ghost dots mark where each azaan was published; the changed labels read WAS 5:30.',
    preset: { draft: { fajr: { azaan: stlMin(5, 20), iqama: 20 }, isha: { azaan: stlMin(20, 30), iqama: 15 } } } },
  { name: 'Publishing',
    note: 'Progress sits above the action, never inside the button.',
    preset: { draft: { fajr: { azaan: stlMin(5, 20), iqama: 20 } }, publishing: true } },
];

function SalaahTimelineBoard({ active = -1, onSelect }) {
  return (
    <div className="stl-board">
      {STL_STATES.map((s, i) => (
        <div className="stl-board-item" key={s.name} onClick={() => onSelect && onSelect(i)}>
          <div className={`noor-frame ${active === i ? 'is-active' : ''}`} style={{ '--s': '0.58', cursor: 'pointer' }}>
            <div className="noor-frame-inner">
              <div className="noor-screen">
                <div className="noor-island"></div>
                <StlScreen preset={s.preset} />
                <div className="noor-home"></div>
              </div>
            </div>
          </div>
          <div className="stl-board-cap">
            <strong>{i + 1} · {s.name}</strong>
            <small>{s.note}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

// `key` remounts the screen when the selection changes, so picking a frame resets the live device to
// that state instead of leaving whatever was dragged a moment ago.
function SalaahTimelineLive({ index = 0 }) {
  const i = Math.max(0, Math.min(index, STL_STATES.length - 1));
  return <StlScreen key={i} preset={STL_STATES[i].preset} live />;
}

Object.assign(window, {
  SalaahTimelineBoard,
  SalaahTimelineLive,
  STL_STATES,
  // The console hosts the same timeline from its own store, so the parts it needs are shared rather
  // than reimplemented — one set of clamping rules, one row, one spine.
  StlTimeline,
  useStlDrag,
  StlPrayerWindows: STL_PRAYERS,
  StlJumahWindow: STL_JUMAH,
  stlMinutes: stlMin,
  stlFormat: stlFmt,
  stlShortFormat: stlShort,
  STL_IQAMA_LIMITS: { min: STL_IQAMA_MIN, max: STL_IQAMA_MAX },
});
