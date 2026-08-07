// Salaah timings — the SCROLLING axis exploration.
//
// The shipped timeline (salaah-timeline.jsx) compresses the whole day onto one screen so nothing
// scrolls. That was chosen deliberately and it works, but it costs direct manipulation: at ~0.53px
// per minute a value cannot track the finger, so the drag runs at its own gain and the row moves at
// roughly 15% of the finger's speed.
//
// This variant takes the calendar-day model instead (flutter_calendar_view's `heightPerMinute`, and
// the booking block from schedule_selection): a real axis at 4px per minute, scrolled, with the value
// following the finger exactly. Three things fall out of that:
//
//   1. Rows sit at their TRUE positions. The whole displacement/leader-line machinery disappears —
//      it only existed because Maghrib and Isha collide on a compressed axis. Here they do not.
//   2. The iqama delay becomes a real length you can see and pull, not a 3px stub on a rail.
//   3. A vertical drag becomes ambiguous, and that is the cost this prototype exists to price.
//
// THE CONFLICT, AND HOW THIS RESOLVES IT
// The CARD takes the drag and moves the whole prayer with its delay intact; the IQAMA chip stops
// propagation and changes only the delay. Both are `touch-action:none`, and the scroller owns
// everything else (`touch-action:pan-y`) — so the day is scrolled from the gutter or the empty parts
// of a band, which is how a calendar has always been scrolled. No long-press gate: the ambiguity is
// resolved by WHERE the finger lands, not by how long it waits.
//
// What the shipped screen still does better: every prayer is visible at once. Here you scroll to see
// Isha from Fajr. That is the trade being judged.

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
const SST_NOW = SstMin(11, 2);
const SST_REACH = '1,284';

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

const sstInBreak = (mins) => SST_BREAKS.some((b) => mins > b.from && mins < b.to);

/* ═══ One prayer's row, positioned on the real axis ════════════════════════ */

function SstRow({ p, cfg, published, scan, drag, bad, live, onGrab, floating = true, yOf = sstY }) {
  // Only while the iqama is being dragged: the card stretches from the azaan to the jamaat so the
  // delay is read as the length it is. `SST_ROW_MIN_H` keeps it holding its chips when the delay is
  // shorter than the card can be.
  const jamaat = cfg.azaan + cfg.iqama;
  const movedAzaan = cfg.azaan !== published.azaan;
  const movedIqama = cfg.iqama !== published.iqama;
  const grabbing = drag && drag.key === p.key ? drag.handle : null;
  const isBad = bad && bad.key === p.key;
  // A board reading is not the value: it is named beside it and becomes the value only when added to
  // the draft. Amber locates, red says the reading cannot exist; neither ever carries the text.
  const proposedAzaan = scan && scan.azaan !== cfg.azaan ? scan.azaan : null;
  const proposedIqama = scan && scan.iqama !== cfg.iqama ? scan.iqama : null;
  const scanMark = scan && scan.fault ? 'sst-scanmark is-fault' : 'sst-scanmark';

  // The card is ALWAYS its own span now, not only while dragging. Growing on grab and collapsing on
  // release made the growth read as a glitch: nothing tracked the finger, so the collapse looked like
  // the edit being undone. Top edge is the azaan, and the iqama chip rides the jamaat.
  const spanPx = cfg.iqama * SST_PX_PER_MIN;
  const style = floating ? { top: `${yOf(cfg.azaan)}px` } : undefined;

  return (
    <div
      // The whole card moves the prayer, delay intact — the booking-block model, where the body drags
      // and a handle resizes. The iqama chip stops propagation, so it still changes only the delay.
      onPointerDown={live && floating ? onGrab(p, 'azaan') : undefined}
      className={[
        'sst-row',
        isBad ? 'is-bad' : '',
        grabbing ? 'is-dragging' : '',
        movedAzaan || movedIqama ? 'is-changed' : '',
        scan ? (scan.fault ? 'is-scanfault' : 'is-scanned') : '',
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
        className={['sst-slot', grabbing === 'azaan' ? 'is-grab' : '', movedAzaan ? 'is-moved' : '',
          isBad && (movedAzaan || grabbing === 'azaan') ? 'is-bad' : ''].filter(Boolean).join(' ')}
        onPointerDown={live && !floating ? onGrab(p, 'azaan') : undefined}
        role="slider"
        aria-label={`${p.label} azaan, ${SstFmt(cfg.azaan)}. Drag the card to move the prayer.`}
      >
        <em>{proposedAzaan != null
          ? <React.Fragment><i className={scanMark}></i>{SstShort(proposedAzaan)}</React.Fragment>
          : movedAzaan ? `WAS ${SstShort(published.azaan)}` : 'AZAAN'}
          {live ? <i className="mi" data-i="unfold_more"></i> : null}</em>
        <span className="sst-val"><b>{SstFmt(cfg.azaan)}</b></span>
      </span>

      {/* Offset by the delay itself, so the chip sits ON the jamaat and travels down as the delay is
          dragged — the value and its position are the same thing. The card grows to contain it. */}
      <span
        style={floating ? { marginTop: `${Math.max(spanPx, 0)}px` } : undefined}
        className={['sst-slot', grabbing === 'iqama' ? 'is-grab' : '', movedIqama ? 'is-moved' : '',
          isBad && (movedIqama || grabbing === 'iqama') ? 'is-bad' : ''].filter(Boolean).join(' ')}
        onPointerDown={live ? onGrab(p, 'iqama') : undefined}
        role="slider"
        aria-label={`${p.label} iqama, ${SstFmt(jamaat)}, ${cfg.iqama} minutes after azaan. Drag to change.`}
      >
        <em>{proposedIqama != null
          ? <React.Fragment><i className={scanMark}></i>{SstShort(scan.azaan + scan.iqama)}</React.Fragment>
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

function useSstDrag({ cfgOf, onCommit, live, prayerOf = sstPrayer }) {
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

    if (g.handle === 'azaan') {
      const raw = g.from.azaan + step;
      let azaan = raw;
      let why = null;
      if (raw < p.opens) { azaan = p.opens; why = `${p.label} does not begin until ${SstFmt(p.opens)}`; }
      else if (raw + g.from.iqama > p.closes) {
        azaan = p.closes - g.from.iqama;
        why = `Iqama would fall past ${p.ends}, at ${SstFmt(p.closes)}`;
      }
      onCommit(g.key, { azaan, iqama: g.from.iqama });
      if (why) flashBad(g.key, why); else setBad(null);
    } else {
      const raw = g.from.iqama + step;
      let iqama = raw;
      let why = null;
      if (raw < SST_IQAMA_MIN) { iqama = SST_IQAMA_MIN; why = `Iqama is at least ${SST_IQAMA_MIN} minutes after azaan`; }
      else if (g.from.azaan + raw > p.closes) {
        iqama = p.closes - g.from.azaan;
        why = `Iqama would fall past ${p.ends}, at ${SstFmt(p.closes)}`;
      }
      onCommit(g.key, { azaan: g.from.azaan, iqama });
      if (why) flashBad(g.key, why); else setBad(null);
    }
  };

  const onRelease = () => { grab.current = null; setDrag(null); };

  return { drag, bad, onGrab, onMove, onRelease };
}

/* ═══ The day ══════════════════════════════════════════════════════════════ */

function SstDay({
  prayers = SST_PRAYERS, cfgOf, pubOf, scanOf, drag, bad, live, onGrab,
  spanFrom = SST_SPAN_FROM, spanTo = SST_SPAN_TO, breaks = SST_BREAKS, showNow = true,
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
    <div className="sst-day" style={{ height: `${height}px` }}>
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
          drag={drag} bad={bad} live={live} onGrab={onGrab} yOf={sstY} />
      ))}
    </div>
  );
}

/* ═══ The screen ═══════════════════════════════════════════════════════════ */

function SstScreen({ preset = {}, live = false }) {
  const [draft, setDraft] = React.useState(preset.draft || {});
  const scrollRef = React.useRef(null);

  const pubOf = (p) => ({ azaan: p.azaan, iqama: p.iqama });
  const cfgOf = (p) => Object.assign(pubOf(p), draft[p.key] || {});
  const changed = Object.keys(draft).filter((k) => {
    const p = sstPrayer(k);
    const c = Object.assign(pubOf(p), draft[k]);
    return c.azaan !== p.azaan || c.iqama !== p.iqama;
  });
  const dirty = changed.length > 0;

  const commit = (key, value) => setDraft((d) => Object.assign({}, d, { [key]: value }));
  const { drag, bad, onGrab, onMove, onRelease } = useSstDrag({ cfgOf, onCommit: commit, live });
  const dragState = preset.drag && !drag ? preset.drag : drag;

  // Open on the current prayer rather than at 4 AM: a tall axis that starts at dawn asks every user
  // to scroll before they can do anything, and the thing they came to change is almost always near
  // now. The shipped screen never needed this because the whole day was already on screen.
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = Math.max(0, sstY(preset.focus == null ? SST_NOW : preset.focus) - 180);
  }, []);

  return (
    <main className="sst-screen"
      onPointerMove={live ? onMove : undefined}
      onPointerUp={live ? onRelease : undefined}
      onPointerCancel={live ? onRelease : undefined}
    >
      <div className="app-bar sst-bar">
        <button className="ib ib-tonal" aria-label="Back"><span className="mi" data-i="arrow_back"></span></button>
        <div className="sst-bar-copy">
          <strong>Salaah timings</strong>
          <small>Masjid E Bilal</small>
        </div>
        <button className="btn sm btn-tonal" aria-label="Scan the timing board">
          <span className="mi" data-i="photo_camera"></span>
          Scan board
        </button>
      </div>

      <div className="sst-scroll" ref={scrollRef}>
        <SstDay cfgOf={cfgOf} pubOf={pubOf} drag={dragState} bad={bad || preset.bad || null}
          live={live} onGrab={onGrab} />

        {/* Jumah gets the SAME treatment, not a leftover inline row: its own axis over the window it
            shares with Zohar, at the same scale, with the same gutter, delay bar and drag. It is a
            second axis rather than a place on today's, because the prayer is weekly. */}
        <div className="sst-friday">
          <div className="sst-friday-head">
            <span className="sst-eyebrow">EVERY FRIDAY</span>
            <small>Replaces Zohar</small>
          </div>
          <SstDay
            prayers={[SST_JUMAH]}
            cfgOf={cfgOf} pubOf={pubOf}
            spanFrom={SST_JUMAH.opens} spanTo={SST_JUMAH.closes} breaks={[]} showNow={false}
            drag={dragState} bad={bad || preset.bad || null} live={live} onGrab={onGrab}
          />
        </div>
      </div>

      <div className="sst-publish">
        {(bad || preset.bad) ? (
          <div className="sst-refuse" role="alert">
            <span className="mi" data-i="error" aria-hidden="true"></span>
            <span>{(bad || preset.bad).why}</span>
          </div>
        ) : null}
        <div className="sst-publish-note">
          {dirty ? (
            <React.Fragment>
              <strong>{changed.length} {changed.length === 1 ? 'prayer' : 'prayers'} changed</strong>
              <span>{SST_REACH} musalleen see this the moment you publish</span>
            </React.Fragment>
          ) : (
            <span>Drag a prayer to move it. Drag its iqama to change the delay.</span>
          )}
        </div>
        <button className="btn btn-filled lg">{`Publish to ${SST_REACH} musalleen`}</button>
      </div>
    </main>
  );
}

/* ═══ States ═══════════════════════════════════════════════════════════════ */

const SST_STATES = [
  { name: 'The day, at true scale',
    note: 'Opens on now. Every prayer sits exactly where its azaan falls, inside the window band it must stay in — no displacement, no leader lines, because at 4px a minute there is room for everyone.',
    preset: {} },
  { name: 'Dragging an azaan 1:1',
    note: 'True 1:1 — a minute is 1.5 pixels on the axis and 1.5 pixels of finger, so the row keeps pace exactly. A 4px threshold engages the drag so a resting finger cannot edit by itself.',
    preset: { drag: { key: 'asr', handle: 'azaan' }, draft: { asr: { azaan: SstMin(16, 47), iqama: 15 } }, focus: SstMin(16, 30) } },
  { name: 'The delay as a real length',
    note: 'Maghrib has 68 minutes before Isha opens. Dragging the iqama chip lengthens a bar you can actually see against that window, rather than a 3px stub on a rail.',
    preset: { drag: { key: 'maghrib', handle: 'iqama' }, draft: { maghrib: { azaan: SstMin(18, 50), iqama: 43 } }, focus: SstMin(18, 48) } },
  { name: 'Clamped at the window',
    note: 'Same two bounds as the shipped screen. The value clamps, the row shakes, the refused chip turns red and the strip above the action names the bound.',
    preset: { drag: { key: 'maghrib', handle: 'iqama' }, draft: { maghrib: { azaan: SstMin(18, 50), iqama: 68 } },
      bad: { key: 'maghrib', why: 'Iqama would fall past Isha, at 7:58 PM' }, focus: SstMin(18, 48) } },
];

function SalaahScrollBoard({ active = -1, onSelect }) {
  return (
    <div className="sst-board">
      {SST_STATES.map((s, i) => (
        <div className="sst-board-item" key={s.name} onClick={() => onSelect && onSelect(i)}>
          <div className={`noor-frame ${active === i ? 'is-active' : ''}`} style={{ '--s': '0.58', cursor: 'pointer' }}>
            <div className="noor-frame-inner">
              <div className="noor-screen">
                <div className="noor-island"></div>
                <SstScreen preset={s.preset} />
                <div className="noor-home"></div>
              </div>
            </div>
          </div>
          <div className="sst-board-cap">
            <strong>{i + 1} · {s.name}</strong>
            <small>{s.note}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

function SalaahScrollLive({ index = 0 }) {
  const i = Math.max(0, Math.min(index, SST_STATES.length - 1));
  return <SstScreen key={i} preset={SST_STATES[i].preset} live />;
}

// The console hosts the same day from its own store, so the parts it needs are shared rather than
// reimplemented — one axis, one row, one set of clamping rules.
Object.assign(window, {
  SalaahScrollBoard, SalaahScrollLive, SST_STATES,
  SstDay, SstRow, useSstDrag,
  SstMinutes: SstMin,
  SstFormat: SstFmt,
  // The day fixture, for the console's own store and its scan parser.
  SstPrayerWindows: SST_PRAYERS,
  SstJumahWindow: SST_JUMAH,
});
