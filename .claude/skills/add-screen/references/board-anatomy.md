# Section board — annotated skeletons

Two files to write per section. These skeletons mirror `onboarding/` exactly; replace the
flow-specific parts, keep the structure.

## 1. The board page — `<section>/<Section>.dc.html`

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="../support.js"></script>
<script src="../_theme/chrome.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="../_ds/noor-design-system-46f42e91-1858-412f-bdb6-560a6cc3df9f/colors_and_type.css">
  <link rel="stylesheet" href="../_theme/poc.css">
  <link rel="stylesheet" href="../_theme/components.css">
  <script src="../_ds/noor-design-system-46f42e91-1858-412f-bdb6-560a6cc3df9f/_ds_bundle.js"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0..1,0&amp;display=block">
  <style>
    body{background:var(--canvas-bg);padding:36px 32px 90px;min-height:100vh;box-sizing:border-box}
    ::-webkit-scrollbar{display:none}*{-ms-overflow-style:none;scrollbar-width:none}
    /* flow animations — copy from Onboarding, add flow-specific ones here */
    @keyframes stepin { from{transform:translateX(28px);opacity:0} to{transform:translateX(0);opacity:1} }
    @keyframes stepback { from{transform:translateX(-28px);opacity:0} to{transform:translateX(0);opacity:1} }
    .step-fwd { animation:stepin .35s cubic-bezier(.2,.8,.2,1) }
    .step-back { animation:stepback .35s cubic-bezier(.2,.8,.2,1) }
  </style>
</helmet>

<!-- ── Page header ── -->
<div style="max-width:1440px;margin:0 0 26px">
  <div style="font-family:var(--font-body);font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--canvas-label);margin-bottom:6px">
    <a href="../Index.dc.html" style="color:inherit;text-decoration:none">Noor</a> · Section board
  </div>
  <div style="font-family:var(--font-title);font-size:30px;letter-spacing:-0.5px;color:var(--color-info-primary)">Dua &amp; Dikhr — Categories → Chapters → Dua</div>
  <div style="font-family:var(--font-body);font-size:14px;color:var(--color-info-secondary);margin-top:4px">One board, three flows. The device on the right runs the whole sequence; the board follows its state.</div>
</div>

<!-- ── Board ── -->
<div class="poc-stage">

  <!-- Storyboard rows: static frames, ring follows the live device -->
  <div class="poc-frames">
    <x-import component="CategoriesRow" from="./storyboards/categories-row.jsx" active="{{ categoriesActive }}" hint-size="760px,560px"></x-import>
    <x-import component="ChaptersRow"   from="./storyboards/chapters-row.jsx"   active="{{ chaptersActive }}"   hint-size="760px,560px"></x-import>
    <x-import component="DetailRow"     from="./storyboards/detail-row.jsx"     active="{{ detailActive }}"     hint-size="1000px,600px"></x-import>
  </div>

  <!-- Live device — ONE continuous prototype across all stages -->
  <div class="poc-live">
    <div class="noor-frame" style="--s:0.82">
      <div class="noor-frame-inner">
        <x-import component="IOSDevice" from="../ios-frame.jsx" hint-size="402px,874px">
          <div style="width:100%;height:100%;position:relative;overflow:hidden;background:var(--color-surface-primary)">

            <!-- ════ STAGE · CATEGORIES ════ -->
            <sc-if value="{{ isCategoriesStage }}">
              <div class="{{ stepAnim }}" style="position:absolute;inset:0;display:flex;flex-direction:column">
                <!-- app bar, tab bar, category grid… every tap = a handler -->
              </div>
            </sc-if>

            <!-- ════ STAGE · CHAPTERS ════ -->
            <sc-if value="{{ isChaptersStage }}">
              <div class="{{ stepAnim }}" style="position:absolute;inset:0;display:flex;flex-direction:column">
                <!-- back button → goBack; chapter rows → openChapter(i) -->
              </div>
            </sc-if>

            <!-- ════ STAGE · DETAIL ════ -->
            <sc-if value="{{ isDetailStage }}">
              <div class="{{ stepAnim }}" style="position:absolute;inset:0;display:flex;flex-direction:column">
                <!-- arabic + transliteration + translation, favorite/share/play, audio bar -->
              </div>
            </sc-if>

          </div>
        </x-import>
      </div>
    </div>
  </div>

</div>
</x-dc>
<script type="text/x-dc" data-dc-script>
class Component extends DCLogic {
  state = {
    /* URL hash → initial stage, so Index cards can deep-link (#chapters, #detail) */
    stage: (location.hash === '#detail' ? 'detail'
          : location.hash === '#chapters' ? 'chapters' : 'categories'),
    stepDir: 'fwd',
    categoryIdx: 0,
    chapterIdx: 0,
    favorites: {},          // interaction state survives stage changes
  };

  /* real content copied from the source pages — never invent */
  categories = [ /* … */ ];
  chapters   = [ /* … */ ];

  componentWillUnmount() { /* clearTimeout/clearInterval for any timers */ }

  openCategory = (i) => this.setState({ categoryIdx: i, stage: 'chapters', stepDir: 'fwd' });
  openChapter  = (i) => this.setState({ chapterIdx: i, stage: 'detail', stepDir: 'fwd' });
  goBack = () => {
    const s = this.state;
    if (s.stage === 'detail')   { this.setState({ stage: 'chapters',   stepDir: 'back' }); return; }
    if (s.stage === 'chapters') { this.setState({ stage: 'categories', stepDir: 'back' }); return; }
    window.location.href = '../Home Screen.dc.html';   // out of the section → parent page
  };

  renderVals() {
    const s = this.state;
    return {
      isCategoriesStage: s.stage === 'categories',
      isChaptersStage:   s.stage === 'chapters',
      isDetailStage:     s.stage === 'detail',
      stepAnim: s.stepDir === 'fwd' ? 'step-fwd' : 'step-back',
      /* ring indices for the rows: -1 = row not current */
      categoriesActive: s.stage === 'categories' ? s.categoryIdx : -1,
      chaptersActive:   s.stage === 'chapters'   ? s.chapterIdx  : -1,
      detailActive:     s.stage === 'detail'     ? 0             : -1,
      openCategory: this.openCategory,   /* every binding used in markup MUST be here */
      openChapter: this.openChapter,
      goBack: this.goBack,
      /* …everything else the markup references */
    };
  }
}
</script>
</body>
</html>
```

## 2. A storyboard row — `<section>/storyboards/<flow>-row.jsx`

```jsx
// Dua categories — static storyboard row (one frame per visible state).
// Board imports it via:
//   <x-import component="CategoriesRow" from="./storyboards/categories-row.jsx" active="{{ categoriesActive }}">
// `active` = index of the frame the live device currently shows (-1 = none).

const FRAMES = [
  { name: 'Category grid', /* per-frame data */ },
  { name: 'Favourites tab', /* … */ },
];

function CategoriesRow({ active = -1 }) {
  const { CategoriesScreen } = window;
  return (
    <div>
      <div className="poc-row-label">
        <span className="material-symbols-rounded">grid_view</span> 
        01 · Categories — Hisnul Muslim hub · {FRAMES.length} states
      </div>
      <div className="poc-board">
        {FRAMES.map((f, i) => {
          const isActive = active === i;
          return (
            <div key={i} className="poc-board-item">
              <div className={`noor-frame ${isActive ? 'is-active' : ''}`} style={{ '--s': '0.46' }}>
                <div className="noor-frame-inner">
                  <div className="noor-screen">
                    <div className="noor-island"></div>
                    <CategoriesScreen activeTab={i === 1 ? 'fav' : 'all'} />
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

Object.assign(window, { CategoriesRow });
```

Row labels are numbered in board order (`01 ·`, `02 ·`, …) and state the flow + frame count.
Asset paths inside rows are relative to the BOARD page (`../uploads/…`).

## 3. Shared screen components — `<section>/storyboards/screens.jsx`

The shared component library declares React view components for every screen in the flow. They are mounted directly by both the interactive live device (`<Section>.dc.html`) and the static storyboard rows:

```jsx
// Shared section screen components.

function CategoriesScreen({ activeTab = 'all', onSelectTab }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 
        CRITICAL DESIGN SYSTEM RULES:
        - NEVER write custom border-radii, backgrounds, or status color borders inline.
        - Use design system CSS components from _theme/components.css (.btn, .input, .sw, etc.).
        - Toggle classes like .error, .focused, or .success on inputs, and let CSS handle styling:
          e.g., <div className={`input ${error ? 'error' : ''}`}>
      */}
      <div className="tbar">
        <button className="btn" onClick={() => onSelectTab?.('all')}>All</button>
        <button className="btn" onClick={() => onSelectTab?.('fav')}>Favorites</button>
      </div>
      <div className="list">
        {/* Render categories here */}
      </div>
    </div>
  );
}

// Register all components on window scope for dynamic imports
Object.assign(window, { CategoriesScreen });
```

## Index registration

In `Index.dc.html`'s `data` array, the section's flows become cards deep-linking into the board:

```js
{ id: 'content', num: '04', title: 'Content & tools', items: [
  { name: 'Dua Categories', file: 'dua-dikhr/Dua & Dikhr.dc.html',           icon: 'grid_view',  meta: 'Board row · 2 states' },
  { name: 'Dua Chapters',   file: 'dua-dikhr/Dua & Dikhr.dc.html#chapters',  icon: 'list',       meta: 'Board row · chapter list' },
  { name: 'Dua Detail',     file: 'dua-dikhr/Dua & Dikhr.dc.html#detail',    icon: 'menu_book',  meta: 'Board row · reader + audio' },
]},
```

Remove the replaced flat-page cards from the same array.
