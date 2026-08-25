// Salaah timings — the scrolling day. The axis the Salaah Timing Rules board is built on.
//
// This module owns the axis, the row and the clamping rules; the screen is built around them from
// its own store (`salaah-rules-screens.jsx`, `SrlTimingsBody`), and the same `SstDay` draws the
// Friday block. One implementation, so the day cannot drift between whoever renders it.
//
// It replaced a compressed spine that fitted the whole day on one phone at ~0.53px per minute. That
// fitted, but it cost direct manipulation: at half a pixel a minute a value cannot track the finger,
// so the drag ran at its own gain and the row crawled at ~15% of the finger's speed. The calendar-day
// model (flutter_calendar_view's `heightPerMinute`, and the booking block from schedule_selection)
// buys three things back:
//
//   1. Rows sit at their TRUE positions. The whole displacement/leader-line machinery is gone — it
//      only existed because Maghrib and Isha collide on a compressed axis. Here they do not.
//   2. The iqama delay is a real length you can see and pull, not a 3px stub on a rail.
//   3. The value follows the finger exactly, 1:1.
//
// THE CONFLICT, AND HOW IT IS RESOLVED
// A vertical drag now means two things. The CARD takes the drag and moves the whole prayer with its
// delay intact; the IQAMA chip stops propagation and changes only the delay. Both are
// `touch-action:none`, and the scroller owns everything else (`touch-action:pan-y`) — so the day is
// scrolled from the gutter or the empty parts of a band, which is how a calendar has always been
// scrolled. No long-press gate: the ambiguity is resolved by WHERE the finger lands, not by how long
// it waits.
//
// What it gives up, stated rather than hidden: every prayer is no longer visible at once. You scroll
// to see Isha from Fajr.

const SstMin = (h, m) => h * 60 + m;
const SstHM = (mins) => {
  const m = ((Math.round(mins) % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  return { h12: h24 % 12 === 0 ? 12 : h24 % 12, mm: String(m % 60).padStart(2, '0'), pm: h24 >= 12 };
};
const SstFmt = (mins) => { const t = SstHM(mins); return `${t.h12}:${t.mm} ${t.pm ? 'PM' : 'AM'}`; };
const SstShort = (mins) => { const t = SstHM(mins); return `${t.h12}:${t.mm}`; };

// The scale a minute is drawn at. 3px keeps a one-minute notch comfortably above finger tremor, which
// is what lets the chip track the finger exactly.
//
// 1.5px/min: an hour in 90px, the day in ~1,300px. The hard floor is ~0.8px/min, set by collision
// rather than taste — Maghrib and Isha are 85 minutes apart against a 62px row, so below that the two
// overlap and the displacement pass and leader lines have to come back, which is the shipped screen
// reached from the other direction. 1.5 keeps every row at its true position with room to spare, and
// the rest of the scroll is paid for by collapsing the day's one dead stretch.
const SST_PX_PER_MIN = 1.5;

// True 1:1 — the drag reads the axis itself, so the value under the finger IS the value the finger is
// on and the row keeps pace with it exactly.
//
// The cost, stated rather than hidden: at 1.5px a minute, one notch is smaller than finger tremor
// (2-3px), so a hand resting mid-drag will wander a minute or two. SST_ENGAGE_PX below is what stops
// that becoming a phantom edit on a tap or a hold; it cannot stop drift once you are genuinely
// dragging. Raising the axis is the only real fix for that, and it buys the scroll straight back.
const SST_DRAG_PX_PER_MIN = SST_PX_PER_MIN;

// Nothing moves until the gesture is unambiguously a drag. Without it, at this scale, simply putting
// a finger on a chip was enough to change the time.
const SST_ENGAGE_PX = 4;

// A gutter label's own height. Anything within this of another label is crowding it, so the yield
// distance is measured rather than picked — 16px was tuned when an hour was 180px tall and stopped
// being enough the moment the axis was compacted.
const SST_LABEL_H = 22;

// The shortest the card can be and still hold its two chips.
const SST_ROW_MIN_H = 46;

// The chip's own painted height, and the card's inset around it. The card grows to contain the iqama
// chip using these, and stops at its window close.
const SST_SLOT_H = 37;
const SST_ROW_PAD = 4;

// The day has exactly ONE dead stretch: Fajr closes at 6:14 and Zohar does not open until 12:28, so
// 374 minutes — nearly a third of the axis — carry nothing at all. Everything from Zohar onwards is
// contiguous, each window opening where the last one closed. Collapsing that single gap to a labelled
// break is worth ~1,100px on its own, and it costs no precision where the editing happens, because
// there is nothing to edit inside it. The break is drawn and named rather than hidden: an axis that
// silently skips six hours is lying about the day.
const SST_BREAK_HEIGHT = 56;
const SST_SPAN_FROM = SstMin(4, 0);
const SST_SPAN_TO = SstMin(24, 0);
const SST_STEP = 1;
// The only ceiling on a delay is the window it has to finish inside; an arbitrary 90-minute cap
// refused timings that were never wrong.
const SST_IQAMA_MIN = 5;
// How long the jamaat itself takes, and so how far before the close it must START. A window is when
// the prayer may be prayed: a Fajr jamaat called on sunrise finishes after sunrise.
const SST_JAMAAT_MIN = 10;
const SST_NOW = SstMin(11, 2);

const SST_PRAYERS = [
  { key: 'fajr', label: 'Fajr', opens: SstMin(4, 52), closes: SstMin(6, 14), ends: 'sunrise', azaan: SstMin(5, 30), iqama: 20 },
  { key: 'zohar', label: 'Zohar', opens: SstMin(12, 28), closes: SstMin(16, 12), ends: 'Asr', azaan: SstMin(13, 15), iqama: 15 },
  { key: 'asr', label: 'Asr', opens: SstMin(16, 12), closes: SstMin(18, 48), ends: 'sunset', azaan: SstMin(16, 30), iqama: 15 },
  { key: 'maghrib', label: 'Maghrib', opens: SstMin(18, 48), closes: SstMin(19, 58), ends: 'Isha', azaan: SstMin(18, 50), iqama: 5 },
  { key: 'isha', label: 'Isha', opens: SstMin(19, 58), closes: SstMin(23, 59), ends: 'midnight', azaan: SstMin(20, 15), iqama: 15 },
];

const SST_JUMAH = {
  key: 'jumah', label: 'Jumah', opens: SstMin(12, 28), closes: SstMin(16, 12),
  ends: 'Asr', azaan: SstMin(13, 20), iqama: 20,
};

const SST_ALL = SST_PRAYERS.concat([SST_JUMAH]);
const sstPrayer = (key) => SST_ALL.find((p) => p.key === key);

// Every stretch of day that no prayer window covers and that is long enough to be worth collapsing.
// Derived from the windows rather than hard-coded, so a season that closes the gap closes the break.
const SST_BREAKS = (() => {
  const out = [];
  const sorted = SST_PRAYERS.slice().sort((a, b) => a.opens - b.opens);
  let cursor = SST_SPAN_FROM;
  sorted.forEach((p) => {
    if (p.opens - cursor > 90) out.push({ from: cursor, to: p.opens });
    cursor = Math.max(cursor, p.closes);
  });
  return out;
})();

// Minutes → pixels, with the dead stretches compressed. Inside a break the mapping stays monotonic and
// proportional, so `now` landing in the empty morning still sits in the right place within it.
//
// A factory rather than one function, because the Friday block is a second axis: the same scale and
// the same vocabulary, scoped to Jumah's single window. Everything positional takes its mapping as an
// argument so the two can never drift to different pixels-per-minute.
const sstAxis = (from, to, breaks = []) => (mins) => {
  const m = Math.min(Math.max(mins, from), to);
  let y = (m - from) * SST_PX_PER_MIN;
  breaks.forEach((b) => {
    const span = b.to - b.from;
    if (m >= b.to) y -= (span * SST_PX_PER_MIN) - SST_BREAK_HEIGHT;
    else if (m > b.from) {
      const into = m - b.from;
      y -= (into * SST_PX_PER_MIN) - ((into / span) * SST_BREAK_HEIGHT);
    }
  });
  return y;
};

const sstY = sstAxis(SST_SPAN_FROM, SST_SPAN_TO, SST_BREAKS);

/* ═══ One prayer's row, positioned on the real axis ════════════════════════ */

function SstRow({ p, cfg, published, scan, drag, bad, live, onGrab, floating = true, yOf = sstY, landing = false }) {
  // Only while the iqama is being dragged: the card stretches from the azaan to the jamaat so the
  // delay is read as the length it is. `SST_ROW_MIN_H` keeps it holding its chips when the delay is
  // shorter than the card can be.
  const jamaat = cfg.azaan + cfg.iqama;
  const movedAzaan = cfg.azaan !== published.azaan;
  const movedIqama = cfg.iqama !== published.iqama;
  const grabbing = drag && drag.key === p.key ? drag.handle : null;
  // Two ways a row is wrong, and they look the same because they ARE the same: a move the clamp just
  // refused, and a value that is ALREADY outside its window. The second arrives from stored data — a
  // FIXED azaan overtaken by a start that slid across the season — and it used to render in ordinary
  // ink, so the screen named a prayer in its refusal that looked perfectly fine on the axis. Compose
  // has drawn it red since it shipped; this is Noor catching up (2026-08-16).
  const outOfWindow = cfg.azaan < p.opens || jamaat > p.closes - SST_JAMAAT_MIN;
  const isBad = (bad && bad.key === p.key) || outOfWindow;
  // A board reading is not the value: it is worded beside it (`BOARD 5:12`, the same shape as
  // `WAS 5:30`) and becomes the value only when added to the draft. Its amber is mixed toward the
  // ink so it may letter — the raw token never does — and red says the reading cannot exist.
  const proposedAzaan = scan && scan.azaan !== cfg.azaan ? scan.azaan : null;
  const proposedIqama = scan && scan.iqama !== cfg.iqama ? scan.iqama : null;
  const propEm = scan && scan.fault ? 'is-prop is-fault' : 'is-prop';

  // The card CONTAINS its iqama chip, always. Nothing overhangs.
  //
  // Letting the chip break the bottom edge was tried and rejected on 2026-08-07: capping the card at
  // the window close and spilling the chip past it looked like a rendering fault rather than a
  // deliberate handle, whichever way the overhang was tuned. A card that runs a little into the next
  // prayer's band is the better trade, and the jamaat bound already keeps a jamaat ten minutes clear
  // of its close, so the reach is bounded. An engaged card takes `z-index` above its neighbours, which
  // is what keeps the row under the finger readable when two do overlap.
  //
  // `SST_ROW_MIN_H` is the floor — a five-minute delay is 7.5px of span, which cannot hold a chip.
  const spanPx = cfg.iqama * SST_PX_PER_MIN;
  const wantPx = spanPx + SST_SLOT_H + (SST_ROW_PAD * 2);
  const style = floating
    ? { top: `${yOf(cfg.azaan)}px`, height: `${Math.max(wantPx, SST_ROW_MIN_H)}px` }
    : undefined;

  return (
    <div
      // The whole card moves the prayer, delay intact — the booking-block model, where the body drags
      // and a handle resizes. The iqama chip stops propagation, so it still changes only the delay.
      onPointerDown={live && floating ? onGrab(p, 'azaan') : undefined}
      data-key={p.key}
      className={[
        'sst-row',
        isBad ? 'is-bad' : '',
        grabbing ? 'is-dragging' : '',
        movedAzaan || movedIqama ? 'is-changed' : '',
        scan ? (scan.fault ? 'is-scanfault' : 'is-scanned') : '',
        // The companion walk's amber flash: this reading is landing NOW. Transient — the row
        // settles into the ordinary green `is-changed` the moment the value commits.
        landing ? 'is-landing' : '',
        floating ? 'is-spanning' : '',
      ].filter(Boolean).join(' ')}
      style={style}
    >
      {/* Both the name and the bounds live outside the card on the day — the name beside its band, the
          bounds at the edges they are — so the card carries only the two values you can change. The
          Friday block has no axis behind it, so Jumah keeps all three inline. */}
      {floating ? null : <span className="sst-name">{p.label}</span>}

      {floating ? null : (
        <span className="sst-edge">
          <em>START</em>
          <span>{SstFmt(p.opens)}</span>
        </span>
      )}

      {/* The chip IS the control and the chip IS the drag target. Everything outside it belongs to
          the scroller, which is the entire resolution of the scroll-versus-drag conflict. */}
      <span
        className={['sst-slot', floating ? 'is-azaan' : '', grabbing === 'azaan' ? 'is-grab' : '',
          movedAzaan ? 'is-moved' : '',
          isBad && (movedAzaan || grabbing === 'azaan') ? 'is-bad' : ''].filter(Boolean).join(' ')}
        onPointerDown={live && !floating ? onGrab(p, 'azaan') : undefined}
        role="slider"
        aria-label={`${p.label} azaan, ${SstFmt(cfg.azaan)}. Drag the card to move the prayer.`}
      >
        <em className={proposedAzaan != null ? propEm : undefined}>{proposedAzaan != null
          ? `BOARD ${SstShort(proposedAzaan)}`
          : movedAzaan ? `WAS ${SstShort(published.azaan)}` : 'AZAAN'}
          {live ? <i className="mi" data-i="unfold_more"></i> : null}</em>
        <span className="sst-val"><b>{SstFmt(cfg.azaan)}</b></span>
      </span>

      {/* Centred ON the jamaat, so it travels down as the delay is dragged and the value and its
          position are the same thing. Positioned rather than laid out: the chip has to be free to
          overhang the card's bottom edge, which is the jamaat it marks. */}
      <span
        // The chip's TOP is the jamaat, so the gap between the two chips IS the delay — five minutes
        // apart reads as five minutes apart. Centring the chip on the jamaat instead was tried and
        // reverted: half a chip is 18.5px against a five-minute span of 7.5px, so a short delay put
        // the two values on the same line, and a clamp to stop the chip floating off the top of the
        // card only made that worse.
        style={floating ? { top: `${SST_ROW_PAD + spanPx}px` } : undefined}
        className={['sst-slot', floating ? 'is-iqama' : '', grabbing === 'iqama' ? 'is-grab' : '',
          movedIqama ? 'is-moved' : '',
          isBad && (movedIqama || grabbing === 'iqama') ? 'is-bad' : ''].filter(Boolean).join(' ')}
        onPointerDown={live ? onGrab(p, 'iqama') : undefined}
        role="slider"
        aria-label={`${p.label} iqama, ${SstFmt(jamaat)}, ${cfg.iqama} minutes after azaan. Drag to change.`}
      >
        <em className={proposedIqama != null ? propEm : undefined}>{proposedIqama != null
          ? `BOARD ${SstShort(scan.azaan + scan.iqama)}`
          : movedIqama ? `WAS ${SstShort(published.azaan + published.iqama)}` : 'IQAMA'}
          {live ? <i className="mi" data-i="unfold_more"></i> : null}</em>
        <span className="sst-val"><b>{SstFmt(jamaat)}</b></span>
      </span>

      {floating ? null : (
        <span className="sst-edge">
          <em>ENDS</em>
          <span>{SstFmt(p.closes)}</span>
        </span>
      )}
    </div>
  );
}

/* ═══ The drag — 1:1 with the axis ═════════════════════════════════════════
   The whole reason this variant exists: `minutes = dy / SST_PX_PER_MIN`, with no separate gain. The
   value under the finger is the value the finger is on. Clamping is unchanged from the shipped
   screen — azaan cannot precede the calculated start, and azaan + delay cannot cross the close. */

function useSstDrag({ cfgOf, onCommit, onSettle, live, prayerOf = sstPrayer }) {
  const [drag, setDrag] = React.useState(null);
  const [bad, setBad] = React.useState(null);
  const grab = React.useRef(null);
  const badTimer = React.useRef(null);

  const flashBad = (key, why) => {
    setBad({ key, why });
    if (badTimer.current) clearTimeout(badTimer.current);
    badTimer.current = setTimeout(() => setBad(null), 2600);
  };

  const onGrab = (p, handle) => (e) => {
    if (!live) return;
    e.stopPropagation();
    e.preventDefault();
    grab.current = { key: p.key, handle, startY: e.clientY, from: cfgOf(p), moved: false };
    setDrag({ key: p.key, handle });
    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onMove = (e) => {
    const g = grab.current;
    if (!g) return;
    const p = prayerOf(g.key);
    const dy = e.clientY - g.startY;
    // The engage threshold. Once crossed the drag stays engaged for the rest of the gesture, so
    // crossing it does not then jump the value by four pixels' worth of minutes.
    if (!g.moved && Math.abs(dy) < SST_ENGAGE_PX) return;
    g.moved = true;
    const step = Math.round(dy / SST_DRAG_PX_PER_MIN / SST_STEP) * SST_STEP;

    // A window is when the prayer may be PRAYED, so the jamaat has to FINISH inside it: the last
    // minute it may be called is the close less the time a jamaat takes.
    const latest = p.closes - SST_JAMAAT_MIN;
    const tooLate = `Jamaat must finish before ${p.ends}, so it cannot start after ${SstFmt(latest)}`;

    if (g.handle === 'azaan') {
      // The JAMAAT stays where the masjid put it. Moving the azaan changes the gap, not the prayer:
      // the delay absorbs the difference until it reaches its floor, and only then does the whole
      // card travel. Carrying the delay along instead moved the iqama on every azaan nudge, which
      // made a one-minute correction to the call silently rewrite the jamaat too.
      const jamaat = g.from.azaan + g.from.iqama;
      const raw = g.from.azaan + step;
      let azaan = raw;
      let why = null;
      if (raw < p.opens) { azaan = p.opens; why = `${p.label} does not begin until ${SstFmt(p.opens)}`; }
      else if (raw + SST_IQAMA_MIN > latest) { azaan = latest - SST_IQAMA_MIN; why = tooLate; }
      g.current = { azaan, iqama: Math.max(jamaat - azaan, SST_IQAMA_MIN) };
      onCommit(g.key, g.current, { field: 'azaan' });
      if (why) flashBad(g.key, why); else setBad(null);
    } else {
      const raw = g.from.iqama + step;
      let iqama = raw;
      let why = null;
      if (raw < SST_IQAMA_MIN) { iqama = SST_IQAMA_MIN; why = `Iqama is at least ${SST_IQAMA_MIN} minutes after azaan`; }
      else if (g.from.azaan + raw > latest) { iqama = latest - g.from.azaan; why = tooLate; }
      g.current = { azaan: g.from.azaan, iqama };
      onCommit(g.key, g.current, { field: 'iqama' });
      if (why) flashBad(g.key, why); else setBad(null);
    }
  };

  const onRelease = () => {
    const g = grab.current;
    if (g && g.moved && g.current && onSettle) onSettle(g.key, g.current, { field: g.handle });
    grab.current = null;
    setDrag(null);
  };

  return { drag, bad, onGrab, onMove, onRelease };
}

/* ═══ The day ══════════════════════════════════════════════════════════════ */

function SstDay({
  prayers = SST_PRAYERS, cfgOf, pubOf, scanOf, drag, bad, live, onGrab, landingKey = null,
  spanFrom = SST_SPAN_FROM, spanTo = SST_SPAN_TO, breaks = SST_BREAKS, showNow = true,
  // Optional per-prayer rule action, in a rail to the right of the cards. `ruleOf(key)` returns
  // `{ icon, label }`. Opt-in, and it stays opt-in with one caller: a rail whose button does nothing
  // is a lie, so a host with no rules to open passes nothing and the rail does not exist. It lives
  // here rather than in the caller so it can use this module's own axis mapping — a button aligned
  // by a second copy of `sstY` would drift.
  ruleOf, onRule,
}) {
  const scan = scanOf || (() => null);
  const sstY = sstAxis(spanFrom, spanTo, breaks);
  const height = sstY(spanTo);
  const hours = [];
  for (let h = Math.ceil(spanFrom / 60); h <= spanTo / 60; h += 1) hours.push(h);
  // Every calculated bound on the day, collapsed to one entry per distinct minute. `shared` marks a
  // minute that is simultaneously one window's close and the next one's open.
  const boundaries = (() => {
    const byMinute = new Map();
    prayers.forEach((p) => {
      const open = byMinute.get(p.opens) || { at: p.opens, opens: null, closes: false };
      open.opens = p.label;
      byMinute.set(p.opens, open);
      const close = byMinute.get(p.closes) || { at: p.closes, opens: null, closes: false };
      close.closes = true;
      byMinute.set(p.closes, close);
    });
    return [...byMinute.values()].sort((a, b) => a.at - b.at);
  })();
  const bounds = boundaries.map((b) => b.at);

  return (
    <div className={`sst-day${onRule ? ' has-rule' : ''}`} style={{ height: `${height}px` }}>
      {/* Gridlines first: a 4700px column with nothing on it has no scale, and the rows would float. */}
      {hours.filter((h) => !breaks.some((b) => h * 60 > b.from && h * 60 < b.to)).map((h) => (
        <div key={`h${h}`} className="sst-hour" style={{ top: `${sstY(h * 60)}px` }}>
          {/* The hairline always runs — it is the rhythm that makes a 4800px column readable. The
              LABEL yields when a window bound is within ~16px, because the bound is the number that
              matters and two times stacked in a 56px gutter is just noise. */}
          <span>{bounds.concat(showNow ? [SST_NOW] : []).some((b) => Math.abs(sstY(b) - sstY(h * 60)) < SST_LABEL_H)
            ? '' : SstFmt(h * 60 === 1440 ? 1439 : h * 60).replace(':00', '')}</span>
        </div>
      ))}

      {/* Each boundary once, at the minute it is.
          Deduped, because the day is contiguous from Zohar onwards: Zohar closes at 4:12 PM and Asr
          OPENS at 4:12 PM, so drawing per-prayer stacked ENDS and STARTS on the same pixel. One
          boundary, one label — and where a window both closes and opens, neither word is true on its
          own, so the eyebrow drops and the time speaks for itself. */}
      {boundaries.map((b) => (
        <div className="sst-bound" key={`b${b.at}`} style={{ top: `${sstY(b.at)}px` }}>
          {/* A boundary that OPENS a prayer is named by it. One that only closes the day carries the
              time alone — nothing starts there, so there is nothing to name. */}
          {b.opens ? <em className="sst-bound-name">{b.opens}</em> : null}
          <span>{SstFmt(b.at)}</span>
        </div>
      ))}

      {/* Each prayer's legal window, as a band the row sits inside. At this scale the runway is
          literal — Maghrib's 68 minutes before Isha is visibly short. */}
      {prayers.map((p) => (
        <span key={`w${p.key}`} className="sst-window"
          style={{ top: `${sstY(p.opens)}px`, height: `${sstY(p.closes) - sstY(p.opens)}px` }}></span>
      ))}

      {/* The delay, drawn as the length of day it actually occupies. */}
      {prayers.map((p) => {
        const c = cfgOf(p);
        const pub = pubOf(p);
        const sc = scan(p);
        return (
          <React.Fragment key={`d${p.key}`}>
            {c.azaan !== pub.azaan ? (
              <span className="sst-ghost" style={{ top: `${sstY(pub.azaan)}px` }}></span>
            ) : null}
            {sc ? (
              <span className={`sst-scandot ${sc.fault ? 'is-fault' : ''}`}
                style={{ top: `${sstY(sc.azaan)}px` }}></span>
            ) : null}
            <span
              className={`sst-delay ${drag && drag.key === p.key && drag.handle === 'iqama' ? 'is-live' : ''}`}
              style={{
                top: `${sstY(c.azaan)}px`,
                height: `${Math.max(c.iqama * SST_PX_PER_MIN, 4)}px`,
              }}></span>
          </React.Fragment>
        );
      })}

      {breaks.map((b) => (
        <div key={`br${b.from}`} className="sst-break"
          style={{ top: `${sstY(b.from)}px`, height: `${SST_BREAK_HEIGHT}px` }}>
          <span>{Math.round((b.to - b.from) / 60)} quiet hours</span>
        </div>
      ))}

      {showNow ? (
        <div className="sst-now" style={{ top: `${sstY(SST_NOW)}px` }}><span>NOW</span></div>
      ) : null}

      {/* True positions. No displacement pass, no leaders — there is room for everyone. */}
      {prayers.map((p) => (
        <SstRow key={p.key} p={p} cfg={cfgOf(p)} published={pubOf(p)} scan={scan(p)}
          drag={drag} bad={bad} live={live} onGrab={onGrab} yOf={sstY}
          landing={landingKey === p.key} />
      ))}

      {/* The rule rail. The glyph IS the statement that this prayer follows a rule — sun for the
          prayer's own start, clock-and-arrow for a rounded one, pin for a clock time — so the day
          says which prayers are seasonal without a legend above it. Aligned to the azaan chip and
          outside the card, because the card's right side belongs to the iqama chip at every delay
          short enough to matter. `pointerdown` is stopped so the rail can never begin a drag. */}
      {onRule ? prayers.map((p) => {
        const rule = ruleOf ? ruleOf(p.key) : null;
        return (
          <button
            type="button"
            key={`rule${p.key}`}
            className="sst-rule"
            style={{ top: `${sstY(cfgOf(p).azaan) + SST_ROW_PAD}px` }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onRule(p.key)}
            aria-label={rule && rule.label ? rule.label : `${p.label} timing rule`}
          >
            <span className="mi" data-i={rule && rule.icon ? rule.icon : 'settings'} aria-hidden="true"></span>
          </button>
        );
      }) : null}
    </div>
  );
}

/* ═══ Module loader ════════════════════════════════════════════════════════ */

// The page x-imports this so the module's window exports exist before its own screens read them.
// It renders nothing: the day is drawn by SrlTimingsBody, from the rules board's store.
function SalaahScrollKit() { return null; }

// The screen hosts the day from its own store, so the parts it needs are shared rather than
// reimplemented — one axis, one row, one set of clamping rules.
Object.assign(window, {
  SalaahScrollKit,
  SstDay, SstRow, useSstDrag,
  SstMinutes: SstMin,
  SstFormat: SstFmt,
  // The day fixture, for the rules board's own store and its board reading.
  SstPrayerWindows: SST_PRAYERS,
  SstJumahWindow: SST_JUMAH,
});
