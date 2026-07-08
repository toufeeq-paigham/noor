// Shared section-board chrome — the common shell every section page uses.
// Pairs with the board CSS in _theme/poc.css (.poc-stage, .poc-board, .noor-frame, …).
//
// Usage from a section page (one directory below the repo root):
//
//   <x-import component="BoardHeader" from="../_theme/board.jsx"
//             title="Dua &amp; Dikhr — Categories → Chapters → Dua"
//             subtitle="One board, three flows. The device on the right runs the whole sequence; the board follows its state."
//             hint-size="1440px,92px"></x-import>
//
//   <div class="poc-stage">
//     <div class="poc-frames"> …storyboard row x-imports… </div>
//     <x-import component="BoardLive" from="../_theme/board.jsx" hint-size="400px,900px">
//       <x-import component="IOSDevice" from="../ios-frame.jsx" hint-size="402px,874px">
//         …live flow stages…
//       </x-import>
//     </x-import>
//   </div>

// ── Page header: breadcrumb · title · subtitle ──────────────────────────────
function BoardHeader({ title, subtitle, crumb = 'Section board', indexHref = '../Index.dc.html' }) {
  return (
    <div style={{ maxWidth: 1440, margin: '0 0 26px' }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--canvas-label)', marginBottom: 6 }}>
        <a href={indexHref} style={{ color: 'inherit', textDecoration: 'none' }}>Noor</a> · {crumb}
      </div>
      <div style={{ fontFamily: 'var(--font-title)', fontSize: 30, letterSpacing: '-0.5px', color: 'var(--color-info-primary)' }}>{title}</div>
      {subtitle ? (
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-info-secondary)', marginTop: 4 }}>{subtitle}</div>
      ) : null}
    </div>
  );
}

// ── Floating interactive pane: .poc-live › scaled device slot ───────────────
// Children = the live device (IOSDevice import with the flow stages inside).
// Optional props: restart (handler → renders the Restart pill under the device),
// hint (one-line .poc-live-hint caption under the pane).
function BoardLive({ scale = 0.82, restart, hint, children }) {
  return (
    <div className="poc-live">
      <div className="noor-frame" style={{ '--s': String(scale) }}>
        <div className="noor-frame-inner">{children}</div>
      </div>
      {restart ? (
        <button className="poc-play" onClick={restart}>
          <span className="mi" data-i="replay"></span>Restart
        </button>
      ) : null}
      {hint ? <div className="poc-live-hint">{hint}</div> : null}
    </div>
  );
}

Object.assign(window, { BoardHeader, BoardLive });
