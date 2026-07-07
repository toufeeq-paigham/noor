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

function IntroRow({ active = -1 }) {
  const { IntroScreen } = window;
  return (
    <div>
      <div className="poc-row-label"><span className="material-symbols-rounded">waving_hand</span> 01 · Intro — onboarding carousel · 3 slides</div>
      <div className="poc-board">
        {INTRO_SLIDES.map((s, i) => {
          const isActive = active === i;
          const ringClass = isActive ? 'is-active' : '';
          const last = i === INTRO_SLIDES.length - 1;
          const cta = last ? 'Get started!' : 'Next';
          return (
            <div key={i} className="poc-board-item">
              <div className={`noor-frame ${ringClass}`} style={{ '--s': '0.46' }}>
                <div className="noor-frame-inner">
                  <div className="noor-screen" data-theme="dark">
                    <div className="noor-island"></div>
                    <IntroScreen
                      slide={s}
                      showSkip={!last}
                      ctaLabel={cta}
                      activeDotIdx={i}
                    />
                    <div className="noor-home"></div>
                  </div>
                </div>
              </div>
              <div className="poc-frame-caption">{i + 1} · {s.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { IntroRow });
