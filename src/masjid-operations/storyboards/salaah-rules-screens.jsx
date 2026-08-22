// Salaah timing rules — the two pages that own how a masjid's timings update through the year.
//
//   Salaah timings  ──info──▶  How timings update  ──prayer row──▶  Prayer timing rule
//
// Both pages edit ONE draft and neither publishes: the docked `Publish timings` action on the
// timings screen stays the single moment six rules become public (spec §2.5). That is why this
// page's only footer is a sentence, not a button — a second publish affordance here would make
// the same change reachable two ways and land it from a screen that cannot show its result.
//
// Everything is rendered from `buildSrData` in ./salaah-rules-state.js, the same assembly the
// storyboard frames use, so a static frame cannot drift from the live device.
//
// Construction comes from the kit: `.list-group`/`.list-item` for the summary rows,
// `.choice-card.rich` for the three rule choices, `.summary-hero` for the live preview,
// `.empty-state` for the full-page load states, `.snack`, `.skeleton`. This module adds only the
// feature's own marks (see ./salaah-rules.css).

const SRL_APPBAR_H = 114; // 54px status inset + 48px control row + 12px bottom
const SRL_VARIANTS = window.SR_VARIANTS || { ON_TIME: 'ON_TIME', FIXED: 'FIXED', VARIES: 'VARIES_WITH_ON_TIME' };

const srFmt = (mins) => (window.srFormat ? window.srFormat(mins) : '—');
const srFmtShort = (mins) => (window.srFormatShort ? window.srFormatShort(mins) : '—');

// ══════════════════════════════════════════════════════════════════════
// Shell
// ══════════════════════════════════════════════════════════════════════

function SrlShell({ children }) {
  return <div className="srl-shell">{children}</div>;
}

// The app bar floats over the body and the body carries its height as a top inset, so content
// scrolls UNDER the haze rather than starting after it — the fade only reads with something behind it.
function SrlAppBar({ title, subtitle, subtitleAccent, onBack, trailing }) {
  return (
    <div className="app-bar" style={{
      alignItems: 'center', gap: 12, minHeight: SRL_APPBAR_H,
      padding: '54px 16px 12px', boxSizing: 'border-box',
    }}>
      {/* The kit's `.ab-haze`, which OCCLUDES. `.app-bar::before` only blurs, and a blur with no
          surface behind it leaves near-black body text legible straight through the title — on a page
          this scrollable that reads as the screen being broken. The haze carries a real surface and
          fades out at its bottom edge, so content still passes under the bar rather than being cut
          off at a hard line. */}
      <div className="ab-haze" style={{ height: '100%', zIndex: -1 }} aria-hidden="true"></div>
      <button type="button" className="ib ib-tonal" onClick={onBack} aria-label="Back">
        <span className="mi" data-i="arrow_back" aria-hidden="true"></span>
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* The row height is a MINIMUM: at larger dynamic-text scales a two-line title has to be
            allowed to grow rather than be clipped. */}
        <div className="ab-title" style={{ fontSize: 22, lineHeight: 1.15 }}>{title}</div>
        {subtitle ? (
          <div
            className={subtitleAccent ? 'srl-appbar-state' : undefined}
            style={{ fontSize: 12, marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--color-info-secondary)' }}
          >{subtitle}</div>
        ) : null}
      </div>
      {trailing || <div style={{ width: 48, flexShrink: 0 }} />}
    </div>
  );
}

function SrlBody({ children, gap = 14, bottomInset = 40 }) {
  return (
    <div className="srl-body" style={{ gap, paddingTop: SRL_APPBAR_H + 14, paddingBottom: bottomInset }}>
      {children}
    </div>
  );
}

function SrlSnack({ snack, onClose }) {
  if (!snack) return null;
  return (
    <div className="snack docked" role="status">
      <span className={`mi snack-icon ${snack.tone === 'error' ? 'error' : ''}`} data-i={snack.tone === 'error' ? 'error' : 'check_circle'} aria-hidden="true"></span>
      <span className="snack-copy">{snack.message}</span>
      <button type="button" className="snack-close" onClick={onClose} aria-label="Dismiss">
        <span className="mi" data-i="close" aria-hidden="true"></span>
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// Load states — full pages, because none of them leaves anything to read behind them
// ══════════════════════════════════════════════════════════════════════

// A structure-matching skeleton, not a spinner on empty space: the lead line and six rows inside
// one card, in the geometry they will occupy, so the arrival of the real rules moves nothing.
function SrlSkeletonSummary() {
  return (
    <SrlBody>
      <span className="skeleton" style={{ width: '86%', height: 15, borderRadius: 'var(--radius-sm)' }} aria-hidden="true"></span>
      <span className="skeleton" style={{ width: '54%', height: 15, borderRadius: 'var(--radius-sm)' }} aria-hidden="true"></span>
      <div className="srl-skeleton-rows" role="status" aria-label="Loading timing rules">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div className="srl-skeleton-row" key={i}>
            <span className="skeleton" style={{ width: 22, height: 22, borderRadius: 'var(--radius-circle)' }}></span>
            <span className="srl-skeleton-copy">
              <span className="skeleton" style={{ width: '38%', height: 13, borderRadius: 'var(--radius-sm)' }}></span>
              <span className="skeleton" style={{ width: '72%', height: 11, borderRadius: 'var(--radius-sm)' }}></span>
            </span>
            <span className="skeleton" style={{ width: 54, height: 15, borderRadius: 'var(--radius-sm)' }}></span>
          </div>
        ))}
      </div>
    </SrlBody>
  );
}

function SrlFullState({ icon, tone, title, description, action }) {
  const { EmptyState } = window;
  if (!EmptyState) return null;
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', paddingTop: SRL_APPBAR_H }}>
      <EmptyState icon={icon} tone={tone} title={title} description={description} action={action} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 1 · Salaah timings — the scrolling day, dragged by rule
//
// The axis, the rows and the gesture come from ./salaah-scroll-timeline.jsx: one day, one set of
// clamping rules, shared with the shipped editor. What is different here is the COMMIT. The
// timeline reports a raw minute under the finger; `srCommitDrag` turns it into a parameter of the
// prayer's own rule, so a rounded prayer stays rounded and a sunset prayer cannot be nudged into a
// clock time. That is the whole reason this screen exists alongside the console's.
// ══════════════════════════════════════════════════════════════════════

// The docked action. Publish is never disabled: the two reasons it can refuse need completely
// different things from the reader, and a grey button says something is wrong without saying what.
function SrlPublishBar({ data }) {
  const { dirty, needsFirstPublish, changedCount, reachText, saving, guideSeen, onPublish } = data;
  const note = (() => {
    if (saving) return null;
    if (needsFirstPublish && !dirty) return 'This setup has never been published. Publishing makes it the masjid’s timings.';
    if (dirty) return `${changedCount} ${changedCount === 1 ? 'prayer' : 'prayers'} changed · publishing updates musalleen and records your name.`;
    if (!guideSeen) return 'Drag a prayer’s card to move its azaan, or its iqama chip to change the delay.';
    return 'Nothing has changed yet.';
  })();
  return (
    <div className="docked-action bordered">
      {saving ? (
        <div className="inline-loading-status" role="status">
          <span className="btn-spinner" aria-hidden="true"></span>
          Publishing timings…
        </div>
      ) : null}
      <button type="button" className="btn btn-filled lg" onClick={onPublish} disabled={saving}>
        {reachText ? `Publish to ${reachText} musalleen` : 'Publish timings'}
      </button>
      {note ? <div className="docked-action-note">{note}</div> : null}
    </div>
  );
}

function SrlTimingsBody({ data }) {
  const {
    timelinePrayers = [], timelineJumah, cfgOf, pubOf, dragFeel,
    dayStatus, needsFirstPublish, blocked = [], onDragCommit, onDragSettle, onOpenRules, onOpenPrayer,
  } = data;

  // Each prayer's rule, as the glyph in its rail button. This is how the day states that a prayer
  // is seasonal without a table above it — and the tap opens that one prayer's rule.
  const ruleOf = (key) => {
    const feel = dragFeel ? dragFeel(key) : null;
    const row = (data.rows || []).find((r) => r.key === key);
    if (!feel) return null;
    return { icon: feel.icon, label: `${row ? row.label : key} timing rule — ${row ? row.copy.short : feel.text}` };
  };

  const { SstDay, useSstDrag } = window;
  const byKey = {};
  timelinePrayers.concat(timelineJumah ? [timelineJumah] : []).forEach((p) => { byKey[p.key] = p; });

  // The gesture is the timeline's; the translation is ours. `onCommit` fires on every move, so the
  // card's position comes straight back out of the rule it just wrote — which is what makes a
  // rounded prayer JUMP between its legal slots under the finger instead of sliding and snapping
  // only on release.
  const drag = (useSstDrag || (() => ({})))({
    cfgOf,
    prayerOf: (key) => byKey[key],
    onCommit: (key, value, meta) => onDragCommit && onDragCommit(key, value, meta),
    onSettle: (key, value, meta) => onDragSettle && onDragSettle(key, value, meta),
    live: true,
  });

  if (dayStatus !== 'loaded') {
    return (
      <>
        <SrlBody>
          <div className="srl-context" role="status">
            <span className="mi" data-i="schedule" aria-hidden="true"></span>
            <div className="srl-context-copy">
              <strong>{dayStatus === 'loading' ? 'Working out today’s prayer times…' : 'Today’s prayer times are unavailable'}</strong>
              <span>
                {dayStatus === 'loading'
                  ? 'The day is drawn from the calculated prayer starts, so the axis waits for them rather than guessing at a position.'
                  : 'The saved rules are readable from the info action, but nothing can be placed on a day we cannot calculate.'}
              </span>
            </div>
          </div>
          {dayStatus === 'loading' ? (
            <span className="skeleton" style={{ width: '100%', height: 320, borderRadius: 'var(--radius-card)' }} aria-hidden="true"></span>
          ) : null}
          <button type="button" className="btn btn-tonal lg" onClick={onOpenRules} style={{ marginTop: 4 }}>
            <span className="mi" data-i="info" style={{ fontSize: 20 }} aria-hidden="true"></span>
            How timings update
          </button>
        </SrlBody>
        <SrlPublishBar data={data} />
      </>
    );
  }

  return (
    <>
      <div
        style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}
        onPointerMove={drag.onMove}
        onPointerUp={drag.onRelease}
        onPointerCancel={drag.onRelease}
      >
        {/* pan-y so the day scrolls from the gutter and the empty bands, while the cards' own
            touch-action:none keeps the drag. Touch the prayer and you move it; touch anywhere else
            and you move the day. */}
        <div className="srl-body" style={{ gap: 12, paddingTop: SRL_APPBAR_H + 12, paddingBottom: 16, touchAction: 'pan-y' }}>
          {needsFirstPublish ? (
            <div className="srl-context seed" role="status">
              <span className="mi" data-i="info" aria-hidden="true"></span>
              <div className="srl-context-copy">
                <strong>Not published yet</strong>
                <span>These are the timings we found for this masjid. Publish them to make them the masjid’s own.</span>
              </div>
            </div>
          ) : null}

          {blocked.length ? (
            <div className="srl-context blocked" role="alert">
              <span className="mi" data-i="error" aria-hidden="true"></span>
              <div className="srl-context-copy">
                <strong>{blocked[0].label} can no longer be called at that time</strong>
                <span>
                  {blocked[0].malformed
                    ? blocked[0].malformed
                    : `${blocked[0].fault.text} Drag it back inside its window, or change how it updates so it follows the prayer.`}
                </span>
              </div>
            </div>
          ) : null}

          {SstDay ? (
            <SstDay
              prayers={timelinePrayers}
              cfgOf={cfgOf} pubOf={pubOf}
              drag={drag.drag} bad={drag.bad} live onGrab={drag.onGrab}
              ruleOf={ruleOf} onRule={onOpenPrayer}
            />
          ) : null}

          {/* Jumah is weekly and takes Zohar's place, so it gets its own axis at the same scale
              rather than a position on a day that is showing today. */}
          {timelineJumah && SstDay ? (
            <div className="sst-friday">
              <div className="sst-friday-head">
                <span className="sst-eyebrow">EVERY FRIDAY</span>
                <small>Replaces Zohar</small>
              </div>
              <SstDay
                prayers={[timelineJumah]}
                cfgOf={cfgOf} pubOf={pubOf}
                spanFrom={timelineJumah.opens} spanTo={timelineJumah.closes} breaks={[]} showNow={false}
                drag={drag.drag} bad={drag.bad} live onGrab={drag.onGrab}
                ruleOf={ruleOf} onRule={onOpenPrayer}
              />
            </div>
          ) : null}
        </div>
      </div>
      <SrlPublishBar data={data} />
    </>
  );
}

// A landed publish takes the whole screen. A toast sliding off a view that still looks mid-edit
// does not say that the masjid's times just changed for everyone.
function SrlPublishedBody({ data }) {
  const { reachText, onDone } = data;
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 24px', gap: 12 }}>
      <div className="empty-state-icon" style={{ background: 'color-mix(in oklab,var(--color-status-success) 14%,transparent)', color: 'var(--color-status-success)' }} aria-hidden="true">
        <span className="mi fill" data-i="check_circle"></span>
      </div>
      <div className="empty-state-title" role="status">Timings published</div>
      <div className="empty-state-description">
        All {reachText} musalleen see the new azaan and iqama times now, and the change is recorded in your name.
      </div>
      <div className="empty-state-action">
        <button type="button" className="btn btn-filled lg" onClick={onDone}>Done</button>
      </div>
    </div>
  );
}

// The read-only record. Timings are public and nothing is reviewed, so the record IS the safeguard.
function SrlHistorySheet({ data }) {
  const { Dialog } = window;
  if (!Dialog) return null;
  const { history = [], historyOpen, onCloseHistory } = data;
  return (
    <Dialog
      mode="sheet"
      isOpen={!!historyOpen}
      onClose={onCloseHistory}
      title="Timing changes"
      description="Every published change, and who published it."
      primary={null}
      secondary={null}
    >
      <div className="list-group flush" role="list">
        {history.map((entry) => (
          <div className="list-item" role="listitem" key={entry.id}>
            <span className="list-item-copy">
              <span className="list-item-title">{entry.by}</span>
              <span className="list-item-subtitle">{entry.role} · {entry.when}<br />{entry.changes.join(' · ')}</span>
            </span>
          </div>
        ))}
      </div>
    </Dialog>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 2 · How timings update — the readable summary, and the way into every rule
// ══════════════════════════════════════════════════════════════════════

// The row's right-hand column: today's answer. It states nothing when the calculated day has not
// resolved, because a rule page that invents a time is worse than one that admits it is waiting.
function SrlRowTime({ row, dayStatus }) {
  if (row.malformed) {
    return <span className="srl-row-time bad"><b>—</b><small>needs a fix</small></span>;
  }
  if (dayStatus === 'loading' || (!row.dayReady && dayStatus !== 'error')) {
    return (
      <span className="srl-row-time" aria-label="Loading today’s time">
        <span className="skeleton" style={{ width: 52, height: 14, borderRadius: 'var(--radius-sm)' }}></span>
      </span>
    );
  }
  if (!row.dayReady || row.resolved.azaan == null) {
    // A fixed rule still knows its own clock time with no calculated day; the others do not.
    const cfg = row.cfg || {};
    if (cfg.variant === SRL_VARIANTS.FIXED && cfg.salaahTime) {
      return <span className="srl-row-time"><b>{srFmt(window.srToMinutes(cfg.salaahTime))}</b><small>every day</small></span>;
    }
    return <span className="srl-row-time"><b>—</b><small>day unavailable</small></span>;
  }
  // The azaan alone. The jamaat was here too and made every row a four-value read; it belongs on
  // the prayer's own page, where there is room for it and a control beside it.
  return <span className={`srl-row-time ${row.fault ? 'bad' : ''}`}><b>{srFmt(row.resolved.azaan)}</b></span>;
}

// One prayer's rule, as a LABEL. It used to run "Next quarter-hour after Fajr begins · not before
// 4:45 · iqama 20 min" — three facts and a clause, six times over, which is a page nobody reads.
// The rule's own name is what distinguishes the rows; everything else lives one tap in.
const srlRowSubtitle = (row) => row.copy.short;

function SrlSummaryBody({ data }) {
  const { rows = [], dayStatus, origin, needsFirstPublish, changedCount, blocked = [], onOpenPrayer, focusPrayer, onFocused } = data;
  const rowRefs = React.useRef({});

  // Focus returns to the row a rule page was opened from (spec §15). Without this, leaving a
  // detail page drops focus at the top of the document and a keyboard or switch user has to walk
  // the whole list back to where they were.
  React.useEffect(() => {
    if (!focusPrayer) return;
    const node = rowRefs.current[focusPrayer];
    if (node && node.focus) node.focus({ preventScroll: false });
    if (onFocused) onFocused();
  }, [focusPrayer]);

  return (
    <SrlBody>
      {needsFirstPublish ? (
        <div className="srl-context seed" role="status">
          <span className="mi" data-i="info" aria-hidden="true"></span>
          <div className="srl-context-copy">
            <strong>Not published yet</strong>
            <span>{origin === 'sourced' ? 'Found for this masjid. No musalli sees these yet.' : 'Paigham’s starting setup for a new masjid.'}</span>
          </div>
        </div>
      ) : null}

      {blocked.length ? (
        <div className="srl-context blocked" role="alert">
          <span className="mi" data-i="error" aria-hidden="true"></span>
          <div className="srl-context-copy">
            <strong>
              {blocked.length === 1
                ? `${blocked[0].label} cannot be published as it stands`
                : `${blocked.length} prayers cannot be published as they stand`}
            </strong>
            <span>Open it to correct it. Publishing is refused until then.</span>
          </div>
        </div>
      ) : null}

      {changedCount ? (
        <div className="srl-context changed" role="status">
          <span className="mi" data-i="edit" aria-hidden="true"></span>
          <div className="srl-context-copy">
            <strong>{changedCount === 1 ? '1 rule changed' : `${changedCount} rules changed`}</strong>
            <span>Nothing has reached musalleen yet.</span>
          </div>
        </div>
      ) : null}

      {dayStatus === 'error' ? (
        <div className="srl-context" role="status">
          <span className="mi" data-i="error" aria-hidden="true"></span>
          <div className="srl-context-copy">
            <strong>Today’s prayer times are unavailable</strong>
            <span>The rules below are exactly what is saved; today’s answers cannot be shown.</span>
          </div>
        </div>
      ) : null}

      <div className="list-group flush" role="list" style={{ marginTop: 4 }}>
        {rows.map((row) => (
          <React.Fragment key={row.key}>
            <button
              type="button"
              role="listitem"
              ref={(node) => { rowRefs.current[row.key] = node; }}
              className={`list-item actionable srl-row ${row.changed ? 'changed' : ''} ${row.fault || row.malformed ? 'bad' : ''}`}
              onClick={() => onOpenPrayer && onOpenPrayer(row.key)}
              aria-label={`${row.label} — ${row.copy.title}. ${row.changed ? 'Changed. ' : ''}Open timing rule`}
            >
              <span className="list-item-copy">
                <span className="list-item-title">{row.label}</span>
                <span className="srl-row-rule">
                  <small>{srlRowSubtitle(row)}</small>
                </span>
              </span>
              <SrlRowTime row={row} dayStatus={dayStatus} />
              <span className="mi list-item-chevron" data-i="chevron_right" aria-hidden="true"></span>
            </button>
            {row.malformed || row.fault ? (
              <div className="srl-row-fault">
                <span className="mi" data-i="error" aria-hidden="true"></span>
                <span>{row.malformed || row.fault.text}</span>
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>

      <p className="srl-foot">Changes stay in your draft until you publish timings.</p>
    </SrlBody>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 2 · Prayer timing rule — one prayer, three choices, only the fields its rule owns
// ══════════════════════════════════════════════════════════════════════

/**
 * The kit's select: a `.picker-field` that opens a `.dd-menu`. It replaced a −5/−1/+1/+5 button row
 * — five controls per value, twenty on the screen, and none of them said what the value could be.
 * A select states the value, opens the real options, and is the same control the rest of the app
 * uses for a choice.
 */
function SrlSelect({ label, value, options, open, onOpen, onPick, error, maxHeight = 200 }) {
  const menu = React.useRef(null);
  // Open ON the chosen option. A 100-entry menu that starts at the top makes the reader hunt for the
  // value the field is already showing them.
  React.useEffect(() => {
    if (!open || !menu.current) return;
    const chosen = menu.current.querySelector('.dd-item.selected');
    if (chosen) chosen.scrollIntoView({ block: 'center' });
  }, [open]);
  return (
    <div className="field">
      {label ? <div className="flabel">{label}</div> : null}
      <button
        type="button"
        className={`picker-field ${error ? 'error' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={!!open}
        onClick={() => onOpen(!open)}
      >
        <span className="picker-field-value">{(options.find((o) => o.value === value) || {}).label || value}</span>
        <span className="mi" data-i="expand_more" aria-hidden="true"></span>
      </button>
      {open ? (
        <div className="dd-menu" role="listbox" ref={menu} style={{ maxHeight, overflowY: 'auto' }}>
          {options.map((o) => (
            <div
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={`dd-item ${o.value === value ? 'selected' : ''}`}
              onClick={() => { onPick(o.value); onOpen(false); }}
            >
              {o.value === value ? <span className="mi" data-i="check" aria-hidden="true"></span> : null}
              {o.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/**
 * A time inside a known window — hour and minute, and NO meridiem picker.
 *
 * The window already decides it. Fajr's runs 4:52 AM to 5:44 AM, so `5` can only be AM and offering
 * AM/PM is a third control that can only ever be set wrong. The hour options carry their own
 * meridiem instead (`12 PM`, `1 PM`), which also disambiguates the windows that genuinely straddle
 * noon — Zohar opens at 12:28 PM.
 *
 * Both lists are cut to the bounds, so a picker can never present a value the screen would then
 * refuse. `SrlFault` still exists for the values that arrive from STORED data, which is the case
 * a control cannot prevent.
 */
function SrlBoundedTimeSelect({ label, minutes, min, max, menuKey, openMenu, setOpenMenu, onPick, error }) {
  const hourOf = (m) => Math.floor(m / 60);
  const hourLabel = (h24) => `${((h24 + 11) % 12) + 1} ${h24 < 12 ? 'AM' : 'PM'}`;
  const current = Math.min(Math.max(minutes, min), max);
  const h = hourOf(current);

  const hours = [];
  for (let hh = hourOf(min); hh <= hourOf(max); hh += 1) hours.push({ value: hh, label: hourLabel(hh) });
  // Only the minutes this hour can legally hold.
  const lo = Math.max(min, h * 60);
  const hi = Math.min(max, (h * 60) + 59);
  const mins = [];
  for (let mm = lo % 60; mm <= hi - (h * 60); mm += 1) mins.push({ value: mm, label: String(mm).padStart(2, '0') });

  const slot = (key) => ({
    open: openMenu === `${menuKey}-${key}`,
    onOpen: (next) => setOpenMenu(next ? `${menuKey}-${key}` : null),
  });
  // Changing the hour can strand the minute outside the new hour's legal range, so the write is
  // clamped rather than allowed to produce a time the list would not have offered.
  const write = (hh, mm) => onPick(Math.min(Math.max((hh * 60) + mm, min), max));

  return (
    <div className="field">
      {label ? <div className="flabel">{label}</div> : null}
      <div className="time-select">
        <div><SrlSelect value={h} options={hours} maxHeight={176} error={error} onPick={(v) => write(v, current % 60)} {...slot('h')} /></div>
        <div><SrlSelect value={current % 60} options={mins} maxHeight={176} error={error} onPick={(v) => write(h, v)} {...slot('m')} /></div>
      </div>
    </div>
  );
}

// Every minute from the five-minute floor up to what the window still has room for. A curated list
// of round numbers rounded a masjid's real timing to a neighbouring one — the same mistake the
// timeline's five-minute grid made before 2026-08-07 — and a list running past the window would offer
// delays the screen then refuses.
const srlDelayOptions = (max) => {
  const out = [];
  for (let n = 5; n <= Math.max(5, max); n += 1) out.push({ value: n, label: `${n} min after azaan` });
  return out;
};

const SRL_INTERVALS = [
  { value: 5, label: 'Next 5-minute mark' },
  { value: 10, label: 'Next 10-minute mark' },
  { value: 15, label: 'Next quarter-hour' },
];

function SrlFault({ fault, field }) {
  if (!fault || (field && fault.field !== field)) return null;
  return (
    <div className="srl-fault" role="alert">
      <span className="mi" data-i="error" aria-hidden="true"></span>
      <span>{fault.text}</span>
    </div>
  );
}

/**
 * The fields one rule owns, opened inside its own row.
 *
 * A rule that owns nothing says so in a line. `At prayer start` and `Same time every day` are both
 * fully described by their name — the first has no clock time to store, and the second's clock time
 * is TODAY'S time, which is set on the day below where it can be seen against its window.
 */
function SrlRuleFields({ row, openMenu, setOpenMenu, onPickInterval, onSetEarliest }) {
  const cfg = row.cfg || {};
  const fault = row.fault;
  const floor = window.srToMinutes(cfg.neverBefore) || 0;
  // `adding` only REVEALS the field; it never writes. A floor is set by picking a time, and the
  // rounding alone decides until then — writing one on reveal would create a seasonal bound the
  // committee never chose. Declared before the early returns below, because a hook after a
  // conditional return is called on some renders and not others.
  const [adding, setAdding] = React.useState(false);
  const showFloor = floor !== 0 || adding;

  if (cfg.variant === SRL_VARIANTS.ON_TIME) {
    return (
      <p className="srl-rule-note">
        {row.key === 'maghrib'
          ? 'Sunset moves a little every day. Paigham recalculates it — nothing to set.'
          : `${row.label}'s start moves through the year. Paigham recalculates it — nothing to set.`}
      </p>
    );
  }

  if (cfg.variant === SRL_VARIANTS.FIXED) {
    return <p className="srl-rule-note">Drag the card on the day below to set the time. It stays there all year.</p>;
  }

  const step = window.srVariationStep(cfg.salaahTimeVariation) || 15;
  const canFloor = !!row.bounds;

  // The way back to "the rounding alone decides". It has to exist: without it one tap on
  // `Add an earliest time` was a one-way door into a bound the masjid may not want.
  const clearFloor = () => {
    setAdding(false);
    setOpenMenu(null);
    if (floor !== 0 && onSetEarliest) onSetEarliest(row.key, 0);
  };

  return (
    <>
      <SrlSelect
        label="Round up to"
        value={step}
        options={SRL_INTERVALS}
        open={openMenu === 'interval'}
        onOpen={(next) => setOpenMenu(next ? 'interval' : null)}
        onPick={(v) => onPickInterval && onPickInterval(row.key, v)}
      />
      <p className="srl-rule-note">
        {row.dayReady && row.resolved.natural != null
          ? `${row.label} begins ${srFmt(row.prayer.opens)} today, so the azaan is ${srFmt(row.resolved.azaan)}.`
          : 'Today’s prayer start is unavailable, so the result cannot be shown.'}
      </p>
      {showFloor && canFloor ? (
        <>
          <div className="srl-field-head">
            <span className="flabel">Never before</span>
            <button type="button" className="btn btn-link srl-clear" onClick={clearFloor}>
              {floor === 0 ? 'Cancel' : 'Remove'}
            </button>
          </div>
          <SrlBoundedTimeSelect
            minutes={floor === 0 ? row.bounds.azaanMin : floor}
            min={row.bounds.azaanMin}
            max={row.bounds.azaanMax}
            menuKey="floor"
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            error={!!fault && fault.field === 'azaan'}
            onPick={(v) => onSetEarliest && onSetEarliest(row.key, v)}
          />
          {floor === 0 ? (
            <p className="srl-rule-note">Not set yet — pick a time and the azaan will never be called before it.</p>
          ) : null}
          <SrlFault fault={fault} field="azaan" />
        </>
      ) : canFloor ? (
        // Almost no masjid needs a floor — the rounding is the whole rule — so it waits behind one
        // line rather than sitting there inviting someone to set a season-specific bound.
        <button type="button" className="btn btn-link srl-advanced" onClick={() => setAdding(true)}>
          Add an earliest time
        </button>
      ) : null}
    </>
  );
}

/**
 * The config card. Four rows: three azaan rules and the jamaat delay.
 *
 * SELECTION IS EXPANSION. Tapping a rule chooses it and opens the fields it owns; the row that was
 * open closes. There is no second disclosure state to reason about, and a reader is never looking at
 * parameters belonging to a rule this prayer is not using — which is what the loose `Round up to` /
 * `Set an earliest azaan` / `JAMAAT` blocks under the card allowed.
 *
 * Collapsed, every row states its own value, so the whole config reads in four lines without opening
 * anything.
 */
function SrlConfigCard({ row, openMenu, setOpenMenu, onPickVariant, onPickInterval, onSetEarliest }) {
  const cfg = row.cfg || {};

  // What a collapsed rule row says on its right. Only where there is something to say: the two rules
  // whose answer is today's clock time already have that number on the day below.
  const summaryFor = (variant) => {
    if (variant !== SRL_VARIANTS.VARIES) return null;
    if (cfg.variant !== SRL_VARIANTS.VARIES) return null;
    const step = window.srVariationStep(cfg.salaahTimeVariation);
    return step ? (step === 15 ? 'quarter-hour' : `${step} min`) : null;
  };

  return (
    <div className="srl-config">
      <div role="radiogroup" aria-label={`How ${row.label}'s azaan updates`}>
        {row.choices.map((choice) => {
          // An INCOMPLETE rule pre-selects nothing: showing its half-variant as chosen — with a
          // rounding interval this screen picked — would present a guess as the masjid's decision.
          const selected = !row.malformed && cfg.variant === choice.variant;
          const summary = selected ? null : summaryFor(choice.variant);
          return (
            <div className={`srl-rule ${selected ? 'is-open' : ''}`} key={choice.variant}>
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                className="srl-rule-head"
                onClick={() => { setOpenMenu(null); onPickVariant && onPickVariant(row.key, choice.variant); }}
              >
                <span className="mi srl-rule-glyph" data-i={choice.icon} aria-hidden="true"></span>
                <span className="srl-rule-title">{choice.title}</span>
                {summary ? <span className="srl-rule-summary">{summary}</span> : null}
                <span className="mi srl-rule-mark" data-i={selected ? 'check' : 'radio_button_unchecked'} aria-hidden="true"></span>
              </button>
              {selected ? (
                <div className="srl-rule-fields">
                  <SrlRuleFields
                    row={row}
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                    onPickInterval={onPickInterval}
                    onSetEarliest={onSetEarliest}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

    </div>
  );
}

/**
 * This prayer, on its own axis.
 *
 * The same `SstDay` the whole day is drawn with, scoped to one window — the treatment Jumah's Friday
 * block already uses, so there is one axis implementation and not a second. It replaced a read-only
 * hero stating `5:00 AM`: the axis says that number AND says where it sits between the prayer's start
 * and its close, which is the one thing a number cannot tell you. It is live, so a fixed prayer's
 * time is set here by dragging rather than typed into a picker on another screen.
 */
function SrlPrayerAxis({ data, row }) {
  const { SstDay, useSstDrag } = window;
  const { cfgOf, pubOf, onDragCommit, onDragSettle, dayStatus } = data;
  const prayer = row.prayer;

  const drag = (useSstDrag || (() => ({})))({
    cfgOf,
    prayerOf: () => prayer,
    onCommit: (key, value, meta) => onDragCommit && onDragCommit(key, value, meta),
    onSettle: (key, value, meta) => onDragSettle && onDragSettle(key, value, meta),
    live: true,
  });

  if (!SstDay || !row.dayReady || dayStatus !== 'loaded' || prayer.opens == null) {
    return (
      <div className="srl-context" role="status">
        <span className="mi" data-i="schedule" aria-hidden="true"></span>
        <div className="srl-context-copy">
          <strong>Today’s prayer times are unavailable</strong>
          <span>The rule above is exactly what is saved; it cannot be placed on a day we cannot calculate.</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="srl-axis"
      onPointerMove={drag.onMove}
      onPointerUp={drag.onRelease}
      onPointerCancel={drag.onRelease}
    >
      <div className="srl-axis-head">
        <span className="sst-eyebrow">TODAY</span>
        <small>{row.label} {srFmt(prayer.opens)} – {srFmt(prayer.closes)}</small>
      </div>
      <SstDay
        prayers={[prayer]}
        cfgOf={cfgOf} pubOf={pubOf}
        spanFrom={prayer.opens} spanTo={prayer.closes} breaks={[]} showNow={false}
        drag={drag.drag} bad={drag.bad} live onGrab={drag.onGrab}
      />
    </div>
  );
}

/**
 * One prayer's rule page: THREE sections, each with its own label above it.
 *
 *   1 · How <prayer> is timed  → the rule, chosen from three rows
 *   2 · Jamaat                 → the delay, which applies under whichever rule is chosen
 *   3 · Today                  → the result, on the same axis the whole day uses
 *
 * The labels sit OUTSIDE their cards. A card that carries its own eyebrow reads as a titled panel
 * rather than as one part of a page, and the jamaat delay inside that panel read as a fourth rule
 * you could pick instead of one of the three.
 */
function SrlDetailBody({ data }) {
  const { row, onPickVariant, onPickInterval, onSetEarliest, onSetIqama } = data;
  // Which menu is open. View state, not the draft.
  const [openMenu, setOpenMenu] = React.useState(null);
  if (!row) return null;
  const fault = row.fault;
  const delay = row.resolved.delay == null ? 5 : row.resolved.delay;

  return (
    <SrlBody gap={4}>
      {row.malformed ? (
        <div className="srl-context blocked" role="alert" style={{ marginBottom: 10 }}>
          <span className="mi" data-i="error" aria-hidden="true"></span>
          <div className="srl-context-copy">
            <strong>This rule is incomplete</strong>
            {/* Never guessed. The saved rule says what it wanted to do and not how, so the only
                honest move is to ask the committee which of the three it meant. */}
            <span>{row.malformed} Choose how {row.label} should update.</span>
          </div>
        </div>
      ) : null}

      {/* 1 · The rule. It leads, because it is the durable decision this page exists for. */}
      <div className="srl-section">
        <div className="eyebrow srl-section-label">How {row.label} is timed</div>
        <SrlConfigCard
          row={row}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          onPickVariant={onPickVariant}
          onPickInterval={onPickInterval}
          onSetEarliest={onSetEarliest}
        />
      </div>

      {/* 2 · The delay. Its own section: it is not one of the three rules, it applies under all of
              them, and it is the one value here a musalli feels directly. */}
      <div className="srl-section">
        <div className="eyebrow srl-section-label">Jamaat</div>
        <SrlSelect
          value={delay}
          options={srlDelayOptions(row.bounds ? row.bounds.delayMax : 115)}
          open={openMenu === 'iqama'}
          onOpen={(next) => setOpenMenu(next ? 'iqama' : null)}
          onPick={(v) => onSetIqama && onSetIqama(row.key, v)}
          error={!!fault && fault.field === 'iqama'}
        />
        <SrlFault fault={fault} field="iqama" />
      </div>

      {/* 3 · The result, on the same axis the whole day uses: the answer AND the two bounds it sits
              between. Live, so a fixed prayer's time is set here rather than typed into a picker. */}
      <div className="srl-section">
        <div className="eyebrow srl-section-label">Today</div>
        <SrlPrayerAxis data={data} row={row} />
      </div>

    </SrlBody>
  );
}

// ══════════════════════════════════════════════════════════════════════
// The routed screen
// ══════════════════════════════════════════════════════════════════════

/**
 * The rule page's one trailing action: Undo, offered only while this prayer differs from what is
 * published.
 *
 * It used to be a line at the BOTTOM of the scroll (`Saved to your draft · publish on the timings
 * screen`). On Isha the axis alone is ~360px, so the acknowledgement of a change sat reliably below
 * the fold — the one thing that must be visible was the one thing that was not.
 *
 * A docked bottom bar was the other candidate and is worse: it would sit exactly where `Publish`
 * sits on the timings screen, one Back-tap away, so a bar that publishes nothing would be learned
 * beside a bar that publishes to 1,284 people.
 *
 * The app bar is already this page's persistent chrome and its trailing side was empty. What has to
 * persist is the STATE (this prayer has an unpublished change) and the ACTION (undo it); where
 * publishing happens is stated by the screen that publishes, and by the summary this page came from.
 * The change itself needs no announcement — the axis below visibly moves.
 */
function SrlRuleActions({ data }) {
  const { row, onRestore, needsFirstPublish } = data;
  if (!row || !row.changed) return null;
  return (
    <div className="srl-appbar-actions">
      <button
        type="button"
        className="chip tonal srl-undo"
        onClick={() => onRestore && onRestore(row.key)}
        aria-label={`Undo the unpublished change to ${row.label}'s timing rule`}
      >
        <span className="mi" data-i="replay" aria-hidden="true"></span>
        {needsFirstPublish ? 'Restore' : 'Undo'}
      </button>
    </div>
  );
}

// The timings screen's two trailing actions. Info opens the rules; the record is offered only once
// there is a record — an icon that opens an empty sheet is a dead end.
function SrlTimingsActions({ data }) {
  const { history = [], onOpenRules, onOpenHistory } = data;
  return (
    <div className="srl-appbar-actions">
      <button type="button" className="ib ib-tonal" onClick={onOpenRules} aria-label="How timings update">
        <span className="mi" data-i="info" aria-hidden="true"></span>
      </button>
      {history.length ? (
        <button
          type="button"
          className="ib ib-tonal"
          onClick={onOpenHistory}
          aria-label={`Timing changes — last published by ${history[0].by}`}
        >
          <span className="mi" data-i="receipt_long" aria-hidden="true"></span>
        </button>
      ) : null}
    </div>
  );
}

function SalaahRulesScreen({ data = {} }) {
  const {
    route, status, masjid, row, onBack, onRetry, onRefresh, snack, onCloseSnack,
    justPublished, confirmPublish, reachText, onConfirmPublish, onCancelPublish,
  } = data;
  const detail = route === 'detail' && !!row;
  const timings = route === 'timings';
  const { Dialog } = window;

  // A landed publish owns the whole screen, app bar included: there is nothing left to edit on it.
  if (justPublished) {
    return (
      <SrlShell>
        <SrlPublishedBody data={data} />
      </SrlShell>
    );
  }

  let title = 'How timings update';
  if (detail) title = `${row.label} timing rule`;
  if (timings) title = 'Salaah timings';

  // On a rule page with an unpublished change, the parent's name is the least useful thing the
  // subtitle could say. The STATE goes there instead, which is what answers the question a reader
  // actually has with a Back arrow under their thumb: has this been kept?
  let subtitle = masjid;
  if (detail) subtitle = row.changed ? 'Unpublished change' : 'How timings update';

  return (
    <SrlShell>
      <SrlAppBar
        title={title}
        subtitle={subtitle}
        subtitleAccent={detail && row.changed}
        onBack={onBack}
        trailing={status !== 'loaded' ? undefined
          : timings ? <SrlTimingsActions data={data} />
            : detail ? <SrlRuleActions data={data} /> : undefined}
      />

      {status === 'loading' ? <SrlSkeletonSummary /> : null}

      {status === 'error' ? (
        <SrlFullState
          icon="error"
          tone="error"
          title="Timing rules could not be loaded"
          description="We could not reach the masjid’s saved timing rules. Nothing has been changed."
          action={{ text: 'Try again', icon: 'replay', filled: true, onClick: onRetry }}
        />
      ) : null}

      {/* Another publish landed under this draft. Nothing may overwrite it silently, and merging
          two people's rule edits field by field is not something this screen can do honestly —
          so it refuses, names it, and offers the refresh. */}
      {status === 'conflict' ? (
        <SrlFullState
          icon="error"
          tone="error"
          title="Timings changed while you were editing"
          description="Someone else published new timings for this masjid. Refresh to review the latest timings before publishing your draft."
          action={{ text: 'Refresh timings', icon: 'replay', filled: true, onClick: onRefresh }}
        />
      ) : null}

      {status === 'loaded' ? (
        timings
          ? <SrlTimingsBody data={data} />
          : detail ? <SrlDetailBody data={data} /> : <SrlSummaryBody data={data} />
      ) : null}

      <SrlHistorySheet data={data} />

      {/* Publishing always confirms, and the confirmation names the blast radius as a NUMBER.
          "Every musalli of this masjid" is true but abstract; the count is what makes someone
          re-read the times before they go out. */}
      {Dialog ? (
        <Dialog
          isOpen={!!confirmPublish}
          onClose={onCancelPublish}
          title="Publish new timings?"
          description={`All ${reachText} musalleen of this masjid see the updated azaan and iqama times right away, and the change is recorded in your name.`}
          primary={{ text: 'Publish', onClick: onConfirmPublish }}
          secondary={{ text: 'Cancel', onClick: onCancelPublish }}
        />
      ) : null}

      <SrlSnack snack={snack} onClose={onCloseSnack} />
    </SrlShell>
  );
}

Object.assign(window, { SalaahRulesScreen });
