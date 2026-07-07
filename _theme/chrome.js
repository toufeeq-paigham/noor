/* ============================================================
   Noor POC — theme manager + top app-bar chrome
   Include in the real <head> right after support.js:
     <script src="./_theme/chrome.js"></script>
   Modes: 'light' | 'dark' | 'system' (default), persisted in
   localStorage. Resolved theme lands on <html data-theme="…">
   and a 'noortheme' event fires on window for JS consumers
   (the iOS device frame listens to restyle its status bar).
   ============================================================ */
(function () {
  var KEY = 'noor-theme-mode';
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function getMode() {
    try {
      var m = localStorage.getItem(KEY);
      return m === 'light' || m === 'dark' || m === 'system' ? m : 'system';
    } catch (e) { return 'system'; }
  }

  function resolved(mode) {
    mode = mode || getMode();
    if (mode === 'system') return media && media.matches ? 'dark' : 'light';
    return mode;
  }

  function apply() {
    document.documentElement.setAttribute('data-theme', resolved());
    try { window.dispatchEvent(new CustomEvent('noortheme', { detail: { mode: getMode(), theme: resolved() } })); } catch (e) {}
    syncChrome();
  }

  function setMode(mode) {
    try { localStorage.setItem(KEY, mode); } catch (e) {}
    apply();
  }

  window.NoorTheme = { getMode: getMode, setMode: setMode, resolved: resolved };

  /* apply ASAP to avoid a light flash */
  apply();

  if (media && media.addEventListener) {
    media.addEventListener('change', function () { if (getMode() === 'system') apply(); });
  }
  /* keep pages in sync when the mode is changed on another page */
  window.addEventListener('storage', function (e) { if (e.key === KEY) apply(); });

  /* ---------- top app-bar chrome ---------- */
  var BAR_H = 52;
  var MODES = [
    { id: 'light', icon: 'light_mode', label: 'Light' },
    { id: 'system', icon: 'contrast', label: 'System' },
    { id: 'dark', icon: 'dark_mode', label: 'Dark' }
  ];

  function syncChrome() {
    var bar = document.getElementById('noor-chrome');
    if (!bar) return;
    var mode = getMode();
    MODES.forEach(function (m) {
      var btn = document.getElementById('noor-chrome-' + m.id);
      if (btn) btn.setAttribute('data-active', mode === m.id ? '1' : '0');
    });
  }

  function buildChrome() {
    if (document.getElementById('noor-chrome')) return;
    var isIndex = document.documentElement.hasAttribute('data-noor-index');

    var css = [
      '#noor-chrome{position:fixed;top:0;left:0;right:0;height:' + BAR_H + 'px;z-index:99999;',
      'display:flex;align-items:center;justify-content:space-between;padding:0 20px;box-sizing:border-box;',
      'background:color-mix(in oklab,var(--color-surface-primary,#fff) 72%,transparent);',
      'backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);',
      'border-bottom:1px solid var(--color-neutral-border,#E4E4E7);font-family:var(--font-body,Nunito,sans-serif)}',
      /* reserve space so page content clears the fixed bar */
      'body{padding-top:64px !important}',
      '#noor-chrome .noor-chrome-left{display:flex;align-items:center;gap:10px;min-width:0}',
      '#noor-chrome .noor-chrome-home{display:flex;align-items:center;gap:6px;text-decoration:none;',
      'color:var(--color-info-primary,#09090B);font-size:13px;font-weight:700;padding:7px 12px;border-radius:999px}',
      '#noor-chrome .noor-chrome-home:hover{background:var(--color-surface-secondary,#F0FDF4)}',
      '#noor-chrome .noor-chrome-brand{font-family:var(--font-title,serif);font-size:17px;color:var(--color-info-primary,#09090B);letter-spacing:-0.3px}',
      '#noor-chrome .noor-chrome-seg{display:flex;align-items:center;gap:2px;background:var(--color-action-background,#E4E4E7);border-radius:12px;padding:3px}',
      '#noor-chrome .noor-chrome-seg button{width:34px;height:28px;border:none;background:transparent;border-radius:9px;',
      'cursor:pointer;color:var(--color-info-secondary,#71717B);display:flex;align-items:center;justify-content:center;padding:0}',
      '#noor-chrome .noor-chrome-seg button[data-active="1"]{background:var(--color-action-primary,#00C950);color:var(--color-action-primary-inverse,#F0FDF4)}',
      '#noor-chrome .noor-chrome-seg button:not([data-active="1"]):hover{color:var(--color-info-primary,#09090B)}',
      '#noor-chrome .material-symbols-rounded{font-size:18px}'
    ].join('');
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var bar = document.createElement('div');
    bar.id = 'noor-chrome';

    var left = document.createElement('div');
    left.className = 'noor-chrome-left';
    if (isIndex) {
      var brand = document.createElement('div');
      brand.className = 'noor-chrome-brand';
      brand.textContent = 'Noor';
      left.appendChild(brand);
    } else {
      var prefix = '';
      var path = window.location.pathname;
      if (path) {
        var parts = path.split('/').filter(Boolean);
        var isFile = parts.length > 0 && parts[parts.length - 1].indexOf('.') !== -1;
        var folderCount = isFile ? parts.length - 1 : parts.length;
        for (var d = 0; d < folderCount; d++) {
          prefix += '../';
        }
      }
      var home = document.createElement('a');
      home.className = 'noor-chrome-home';
      home.href = prefix + 'Index.dc.html';
      home.innerHTML = '<span class="material-symbols-rounded">grid_view</span><span>Index</span>';
      left.appendChild(home);
    }
    bar.appendChild(left);

    var seg = document.createElement('div');
    seg.className = 'noor-chrome-seg';
    MODES.forEach(function (m) {
      var btn = document.createElement('button');
      btn.id = 'noor-chrome-' + m.id;
      btn.title = m.label;
      btn.innerHTML = '<span class="material-symbols-rounded">' + m.icon + '</span>';
      btn.addEventListener('click', function () { setMode(m.id); });
      seg.appendChild(btn);
    });
    bar.appendChild(seg);

    document.body.appendChild(bar);
    syncChrome();
  }

  /* ---------- shared helpers ---------- */
  function isInteractive(t) {
    if (!t || !t.closest) return false;
    return !!t.closest('.poc-live, #noor-chrome, a, button, input, textarea, select, [onclick], .kp-key');
  }

  /* ---------- Figma-style canvas (board pages) ----------
     The storyboard (.poc-frames) becomes a free canvas driven by
     translate+scale: drag or two-finger-scroll pans in ANY
     direction (unbounded), pinch / ctrl+wheel zooms the BOARD
     ONLY, toward the cursor. The live device and top bar never
     move or zoom. The document itself does not scroll. */
  function initCanvas(frames) {
    var root = document.documentElement;
    root.classList.add('noor-canvas-mode');
    var px = 0, py = 0, z = 1, badge = null;

    function apply() {
      /* CSS vars on <html> drive the .poc-frames transform via the
         stylesheet — immune to the runtime re-rendering the node */
      root.style.setProperty('--noor-px', px + 'px');
      root.style.setProperty('--noor-py', py + 'px');
      root.style.setProperty('--noor-z', z);
      root.style.setProperty('background-position', px + 'px ' + py + 'px', 'important');
      root.style.setProperty('background-size', (22 * z) + 'px ' + (22 * z) + 'px', 'important');
      if (badge) badge.textContent = Math.round(z * 100) + '%';
    }

    function zoomAt(cx, cy, factor) {
      var nz = Math.min(2.5, Math.max(0.2, z * factor));
      if (nz === z) return;
      px = cx - (cx - px) * (nz / z);
      py = cy - (cy - py) * (nz / z);
      z = nz;
      apply();
    }

    /* wheel: two-finger pan in any direction; ctrl/cmd+wheel (and
       trackpad pinch, which Chrome reports as ctrl+wheel) zooms */
    window.addEventListener('wheel', function (e) {
      if (e.target && e.target.closest && e.target.closest('.poc-live, #noor-chrome')) return;
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else {
        px -= e.deltaX; py -= e.deltaY;
        apply();
      }
    }, { passive: false });

    /* Safari trackpad pinch */
    var gestureBase = 1;
    window.addEventListener('gesturestart', function (e) { e.preventDefault(); gestureBase = z; });
    window.addEventListener('gesturechange', function (e) {
      e.preventDefault();
      var target = Math.min(2.5, Math.max(0.2, gestureBase * e.scale));
      zoomAt(e.clientX, e.clientY, target / z);
    });
    window.addEventListener('gestureend', function (e) { e.preventDefault(); });

    /* drag to pan */
    var panning = false, lx = 0, ly = 0;
    document.addEventListener('mousedown', function (e) {
      if (e.button !== 0 || isInteractive(e.target)) return;
      panning = true; lx = e.clientX; ly = e.clientY;
      root.classList.add('noor-panning');
      e.preventDefault();
    });
    window.addEventListener('mousemove', function (e) {
      if (!panning) return;
      px += e.clientX - lx; py += e.clientY - ly;
      lx = e.clientX; ly = e.clientY;
      apply();
    });
    function endPan() { panning = false; root.classList.remove('noor-panning'); }
    window.addEventListener('mouseup', endPan);
    window.addEventListener('blur', endPan);

    /* zoom badge in the top bar — click to reset to 100% */
    var seg = document.querySelector('#noor-chrome .noor-chrome-seg');
    if (seg && seg.parentElement) {
      badge = document.createElement('button');
      badge.id = 'noor-zoom-badge';
      badge.title = 'Reset zoom & position';
      badge.addEventListener('click', function () { px = 0; py = 0; z = 1; apply(); });
      seg.parentElement.insertBefore(badge, seg);
    }

    /* ---- follow the state: auto-pan to the frame that gains the
       active ring, so the storyboard tracks the live device.
       Manual panning always wins (skipped mid-drag). ---- */
    var animTimer = null;
    function animatePan(dx, dy) {
      /* interval-driven (rAF starves in occluded tabs) with an
         eased curve and a guaranteed final snap */
      var sx = px, sy = py, t0 = Date.now(), D = 380;
      if (animTimer) clearInterval(animTimer);
      animTimer = setInterval(function () {
        var k = Math.min(1, (Date.now() - t0) / D);
        k = 1 - Math.pow(1 - k, 3);
        px = sx + dx * k; py = sy + dy * k;
        apply();
        if (k >= 1) { clearInterval(animTimer); animTimer = null; }
      }, 16);
    }
    function panIntoView(el) {
      var r = el.getBoundingClientRect();
      var pad = 48;
      var top = 52 + pad, left = pad;
      var right = window.innerWidth - 400 - pad;   /* clear of the live panel */
      var bottom = window.innerHeight - pad;
      var dx = 0, dy = 0;
      if (r.left < left) dx = left - r.left;
      else if (r.right > right) dx = right - r.right;
      if (r.height > bottom - top) dy = top - r.top;
      else if (r.top < top) dy = top - r.top;
      else if (r.bottom > bottom) dy = bottom - r.bottom;
      if (dx || dy) animatePan(dx, dy);
    }
    var mo = new MutationObserver(function (muts) {
      if (panning) return;
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        /* class flipped on an existing frame */
        if (m.type === 'attributes') {
          var t = m.target;
          if (t.nodeType === 1 && t.classList && t.classList.contains('is-active') &&
              String(m.oldValue || '').indexOf('is-active') < 0) {
            panIntoView(t);
            return;
          }
        }
        /* row re-rendered wholesale (innerHTML swap) — look inside added nodes */
        if (m.type === 'childList') {
          for (var j = 0; j < m.addedNodes.length; j++) {
            var n = m.addedNodes[j];
            if (n.nodeType !== 1) continue;
            var hit = n.classList && n.classList.contains('is-active') && n.classList.contains('noor-frame')
              ? n : (n.querySelector ? n.querySelector('.noor-frame.is-active') : null);
            if (hit) { panIntoView(hit); return; }
          }
        }
      }
    });
    mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });
    /* debug hooks (harmless in production) */
    window.__noorCanvas = { panIntoView: panIntoView, isPanning: function () { return panning; }, state: function () { return { px: px, py: py, z: z }; } };
    /* initial: bring the currently-active frame into view (hash deep links) */
    setTimeout(function () {
      var act = document.querySelector('.noor-frame.is-active');
      if (act) panIntoView(act);
    }, 500);

    apply();
  }

  /* ---------- drag-to-scroll (non-board pages, e.g. Index) ---------- */
  function initScrollPan() {
    var panning = false, lx = 0, ly = 0;
    document.addEventListener('mousedown', function (e) {
      if (e.button !== 0 || isInteractive(e.target)) return;
      panning = true; lx = e.clientX; ly = e.clientY;
      document.documentElement.classList.add('noor-panning');
      e.preventDefault();
    });
    window.addEventListener('mousemove', function (e) {
      if (!panning) return;
      window.scrollBy(lx - e.clientX, ly - e.clientY);
      lx = e.clientX; ly = e.clientY;
    });
    function endPan() { panning = false; document.documentElement.classList.remove('noor-panning'); }
    window.addEventListener('mouseup', endPan);
    window.addEventListener('blur', endPan);
  }

  function initPan() {
    /* board pages get the free canvas; the runtime may mount the
       template a tick after DOMContentLoaded, so retry briefly */
    var tries = 0;
    (function arm() {
      var frames = document.querySelector('.poc-stage .poc-frames');
      if (frames) { initCanvas(frames); return; }
      if (++tries < 40) { setTimeout(arm, 50); return; }
      initScrollPan();
    })();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { buildChrome(); initPan(); });
  } else {
    buildChrome();
    initPan();
  }
})();
