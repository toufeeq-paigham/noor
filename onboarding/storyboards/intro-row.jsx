// Intro flow — static storyboard row (3 slides)
// Rendered on the Onboarding board via:
//   <x-import component="IntroRow" from="./_poc/rows/intro-row.jsx" active="{{ introActive }}">
// `active` = index 0-2 of the slide the live device shows (-1 = none).

const INTRO_SLIDES = [
  { name: 'Qaum', img: '../uploads/intro_qaum.webp', pos: 'center top',
    gradient: 'linear-gradient(to bottom,rgba(0,0,0,0.04) 0%,rgba(0,0,0,0.1) 38%,rgba(0,0,0,0.45) 60%,rgba(0,0,0,0.72) 80%,rgba(0,0,0,0.82) 100%)',
    title: 'Your Qaum, connected',
    sub: 'Follow your local Masjid, get announcements, and stay connected to your community' },
  { name: 'Salaah', img: '../uploads/intro_salaah.webp', pos: 'center',
    gradient: 'linear-gradient(to bottom,rgba(0,0,0,0.04) 0%,rgba(0,0,0,0.1) 38%,rgba(0,0,0,0.48) 62%,rgba(0,0,0,0.74) 80%,rgba(0,0,0,0.84) 100%)',
    title: 'Your Salah, on time',
    sub: 'Prayer times, Qibla direction, and reminders for all five daily prayers' },
  { name: 'Ibadah', img: '../uploads/intro_ibadah.webp', pos: 'center',
    gradient: 'linear-gradient(to bottom,rgba(0,0,0,0.04) 0%,rgba(0,0,0,0.1) 38%,rgba(0,0,0,0.48) 62%,rgba(0,0,0,0.74) 80%,rgba(0,0,0,0.84) 100%)',
    title: 'Your Ibadah, all in one place',
    sub: "Qur'an, Duas & Dhikr, Asma ul Husna, Zakaat calculator and more" },
];

function introDots(activeIdx) {
  return INTRO_SLIDES.map((_, j) => {
    const w = j === activeIdx ? '28px' : '6px';
    const bg = j === activeIdx ? '#FFFFFF' : 'rgba(255,255,255,0.45)';
    return `<div style="height:6px;border-radius:360px;width:${w};background:${bg}"></div>`;
  }).join('');
}

function introFrame(s, i, ringClass) {
  const last = i === INTRO_SLIDES.length - 1;
  const cta = last ? 'Get started!' : 'Next';
  const skipHtml = !last ? `
          <button class="btn btn-tonal sm" style="position:absolute;top:70px;right:20px;z-index:6">Skip</button>
  ` : '';
  return `
  <div class="poc-board-item">
    <div class="noor-frame ${ringClass}" style="--s:0.46">
      <div class="noor-frame-inner">
        <div class="noor-screen" data-theme="dark">
          <div class="noor-island"></div>
          <img src="${s.img}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${s.pos}">
          <div style="position:absolute;inset:0;background:${s.gradient}"></div>
          ${skipHtml}
          <div style="position:absolute;left:28px;right:28px;top:50%;transform:translateY(-58%);text-align:center">
            <div style="font-family:'DM Serif Display',Georgia,serif;font-size:40px;line-height:1.12;color:#FFFFFF;letter-spacing:-0.5px;margin-bottom:14px;text-wrap:balance">${s.title}</div>
            <div style="font-family:'Nunito',sans-serif;font-size:16px;line-height:1.6;color:rgba(255,255,255,0.88);text-wrap:balance">${s.sub}</div>
          </div>
          <div style="position:absolute;bottom:46px;left:16px;right:16px">
            <div style="height:48px;border-radius:16px;background:var(--color-action-primary);box-shadow:var(--shadow-button);display:flex;align-items:center;justify-content:center">
              <span style="font-family:'Nunito',sans-serif;font-size:16px;font-weight:700;color:var(--color-action-primary-inverse)">${cta}</span>
            </div>
            <div style="display:flex;justify-content:center;align-items:center;gap:4px;margin-top:14px">${introDots(i)}</div>
          </div>
          <div class="noor-home"></div>
        </div>
      </div>
    </div>
    <div class="poc-frame-caption">${i + 1} · ${s.name}</div>
  </div>`;
}

function IntroRow({ active = -1 }) {
  const html = INTRO_SLIDES
    .map((s, i) => introFrame(s, i, active === i ? 'is-active' : ''))
    .join('');
  return (
    <div>
      <div className="poc-row-label"><span className="material-symbols-rounded">waving_hand</span> 01 · Intro — onboarding carousel · 3 slides</div>
      <div className="poc-board" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

Object.assign(window, { IntroRow });
