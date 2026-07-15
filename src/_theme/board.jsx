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

// ── Page header: pushes title + subtitle into the top app bar (chrome.js) ───
function BoardHeader({ title, subtitle }) {
  React.useEffect(() => {
    if (window.NoorSetChromeTitle) window.NoorSetChromeTitle(title);
    if (window.NoorSetChromeSubtitle) window.NoorSetChromeSubtitle(subtitle || '');
  }, [title, subtitle]);
  return null;
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
