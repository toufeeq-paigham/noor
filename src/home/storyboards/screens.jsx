// Shared screen components for the Home Flow Section Board.
// These are used by both the static storyboard frames (tabs-row.jsx) and the live interactive device (Home Screen.dc.html).

// 1. HOME SCREEN
function HomeScreen({
  heroSel = null, // 'suhoor' | 'iftaar' | null
  onSuhoorTap,
  onIftaarTap,
  prayers = { Fajr: true, Zohar: true, Asr: true, Maghrib: true, Isha: false },
  onTogglePrayer,
  salaahCount = "4 of 5 today",
  sehriNoteVisible = false,
  onSehriTap,
  slide = 0,
  onSlideDotTap,
  likes = { haj: { liked: true, count: 4 }, eid: { liked: true, count: 12 } },
  onHajLike,
  onEidLike,
  userName = "Toufeeq Ahamed",
  masjidName = "Masjid E Bilal",
  onBellTap,
  notifOn = true,
  goQuran,
  goDua,
  goMasjids
}) {
  const bellIcon = notifOn ? 'notifications' : 'notifications_off';
  const bellFill = notifOn ? 1 : 0;
  const bellOpacity = notifOn ? 0.9 : 0.5;
  const bellDotOpacity = notifOn ? 1 : 0;

  const prayerList = ['Fajr', 'Zohar', 'Asr', 'Maghrib', 'Isha'].map(name => {
    const checked = prayers[name];
    return {
      name,
      bg: checked ? 'var(--color-action-primary)' : 'transparent',
      border: checked ? '2px solid transparent' : '2px solid var(--color-info-faint)',
      checkOpacity: checked ? 1 : 0,
      labelColor: checked ? 'var(--color-info-secondary)' : 'var(--color-info-faint)'
    };
  });

  const suhoorBg = heroSel === 'suhoor' ? 'rgba(255,255,255,0.42)' : 'rgba(255,255,255,0.22)';
  const suhoorBorder = heroSel === 'suhoor' ? '1.5px solid rgba(255,255,255,0.75)' : '1.5px solid rgba(255,255,255,0.35)';
  const iftaarBg = heroSel === 'iftaar' ? 'rgba(255,255,255,0.42)' : 'rgba(255,255,255,0.22)';
  const iftaarBorder = heroSel === 'iftaar' ? '1.5px solid rgba(255,255,255,0.75)' : '1.5px solid rgba(255,255,255,0.35)';

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Full screen background image */}
      <img src="../uploads/maghrib_background.webp" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%', zIndex: 0 }} />
      
      {/* App Bar — transparent + blur only, matching hazeSurfaceColor=Color.Transparent in HomeTab.kt */}
      <div className="app-bar" style={{ padding: '54px 16px 10px', height: 98 }}>
        {/* Avatar — Maghrib: EerieBlack border @72% */}
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,0.18)', border: '1.5px solid rgba(26,22,18,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 18, fontWeight: 700, color: '#fff' }}>{userName.charAt(0)}</span>
        </div>
        {/* Title: JetBlack, Subtitle: JetBlack @70% — matching appBarTitle/appBarSubtitle for Maghrib */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 17, fontWeight: 700, color: '#1A1612' }}>Salaam, {userName}</div>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, color: 'rgba(26,22,18,0.70)', marginTop: 1 }}>{masjidName}</div>
        </div>
        {/* Bell icon button */}
        <div onClick={onBellTap} style={{ position: 'relative', width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.12)', border: '1.5px solid rgba(26,22,18,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <span className="material-symbols-rounded" style={{ fontSize: 20, color: '#1A1612', opacity: bellOpacity, fontVariationSettings: `'FILL' ${bellFill}`, transition: 'opacity 160ms' }}>{bellIcon}</span>
          <div style={{ position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: '50%', background: 'var(--color-action-primary)', border: '1.5px solid rgba(255,255,255,0.8)', opacity: bellDotOpacity, transition: 'opacity 160ms' }} />
        </div>
      </div>

      {/* Scrollable Content — paddingTop clears the absolute app bar */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingTop: 98, paddingBottom: 80, zIndex: 1, boxSizing: 'border-box' }}>
        {/* Hero */}
        <div style={{ position: 'relative', height: 320, overflow: 'hidden', background: 'transparent' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 40%,rgba(22,18,28,0.3) 100%)' }} />
          
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 24, padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 600, color: 'rgba(15,10,5,0.55)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>Azan: 6:49 PM</div>
              <div style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 42, color: 'rgba(10,6,2,0.9)', lineHeight: 1, letterSpacing: '-0.5px' }}>Maghrib</div>
              <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 34, fontWeight: 800, color: 'rgba(10,6,2,0.88)', lineHeight: 1.05, letterSpacing: '-1px', marginTop: 2 }}>6:52 PM</div>
              <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, color: 'rgba(15,10,5,0.5)', marginTop: 5 }}>From 6:49 PM To 8:00 PM</div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div onClick={onSuhoorTap} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: suhoorBg, backdropFilter: 'blur(10px)', border: suhoorBorder, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 200ms, border 200ms' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'rgba(20,15,8,0.7)' }}>wb_sunny</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 600, color: 'rgba(20,15,8,0.6)' }}>Suhoor</div>
                  <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700, color: 'rgba(20,15,8,0.75)' }}>4:31 AM</div>
                </div>
              </div>
              
              <div onClick={onIftaarTap} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: iftaarBg, backdropFilter: 'blur(10px)', border: iftaarBorder, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 200ms, border 200ms' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'rgba(20,15,8,0.7)' }}>bedtime</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 600, color: 'rgba(20,15,8,0.6)' }}>Iftaar</div>
                  <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700, color: 'rgba(20,15,8,0.75)' }}>6:49 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sheet card */}
        <div style={{ background: 'color-mix(in oklab, var(--color-surface-card) 82%, transparent)', backdropFilter: 'blur(28px) saturate(180%)', WebkitBackdropFilter: 'blur(28px) saturate(180%)', borderRadius: '24px 24px 0 0', marginTop: -12, paddingBottom: 32 }}>
          {/* Drag handle */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
            <div style={{ width: 38, height: 4, background: 'var(--color-info-faint)', borderRadius: 2 }} />
          </div>

          {/* Track Salaah */}
          <div style={{ padding: '14px 20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--color-info-primary)' }}>Track Salaah</div>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--color-action-primary)' }}>{salaahCount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {prayerList.map((p, idx) => (
                <div key={idx} onClick={() => onTogglePrayer && onTogglePrayer(p.name)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: p.bg, border: p.border, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 150ms, border 150ms' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-action-primary-inverse)', opacity: p.checkOpacity, fontVariationSettings: `'FILL' 1`, transition: 'opacity 150ms' }}>check</span>
                  </div>
                  <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 600, color: p.labelColor }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero details popup sheets (Absolute overlay within card context) */}
          {heroSel === 'suhoor' && (
            <div style={{ margin: '0 20px 24px', background: 'var(--color-surface-primary)', border: '1.5px solid var(--color-action-primary)', borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <span className="material-symbols-rounded" style={{ fontSize: 28, color: 'var(--color-action-primary)', flexShrink: 0 }}>wb_sunny</span>
              <div>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--color-info-primary)' }}>Suhoor ends at 4:31 AM</div>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, color: 'var(--color-info-secondary)', marginTop: 4, lineHeight: 1.45 }}>Eat before this time. The Fajr Azan is at 4:36 AM. Recommended to stop eating 10 mins before Azan.</div>
              </div>
            </div>
          )}

          {heroSel === 'iftaar' && (
            <div style={{ margin: '0 20px 24px', background: 'var(--color-surface-primary)', border: '1.5px solid var(--color-action-primary)', borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <span className="material-symbols-rounded" style={{ fontSize: 28, color: 'var(--color-action-primary)', flexShrink: 0 }}>bedtime</span>
              <div>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--color-info-primary)' }}>Iftaar starts at 6:49 PM</div>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, color: 'var(--color-info-secondary)', marginTop: 4, lineHeight: 1.45 }}>Open your fast now. Remember to recite the fast-breaking dua before eating.</div>
              </div>
            </div>
          )}

          {/* For You Section */}
          <div style={{ padding: '0 20px 24px' }}>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--color-info-primary)', marginBottom: 14 }}>For you</div>
            
            <div style={{ display: 'flex', gap: 14, height: 274 }}>
              {/* Left Column (Quran + Sehri) */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Quran Card */}
                <div onClick={goQuran} style={{ position: 'relative', height: 130, borderRadius: 24, overflow: 'hidden', cursor: 'pointer' }}>
                  <img src="../uploads/maghrib_quran.webp" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, transparent 65%)' }} />
                  <div style={{ position: 'absolute', left: 16, bottom: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span className="material-symbols-rounded" style={{ fontSize: 18, color: '#FFFFFF' }}>auto_stories</span>
                    <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>Quran</div>
                    <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>Recite</div>
                  </div>
                </div>
                
                {/* Sehri Card */}
                <div onClick={onSehriTap} style={{ position: 'relative', height: 130, borderRadius: 24, overflow: 'hidden', cursor: 'pointer' }}>
                  <img src="../uploads/maghrib_sehri.webp" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, transparent 65%)' }} />
                  <div style={{ position: 'absolute', left: 16, bottom: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span className="material-symbols-rounded" style={{ fontSize: 18, color: '#FFFFFF' }}>restaurant</span>
                    <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>Sehri</div>
                    <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>Locations &amp; more</div>
                  </div>
                  {sehriNoteVisible && (
                    <div style={{ position: 'absolute', right: 12, top: 12, background: 'var(--color-info-primary)', color: 'var(--color-info-secondary-inverse)', fontFamily: '"Nunito", sans-serif', fontSize: 9, fontWeight: 700, padding: '4px 8px', borderRadius: 8, pointerEvents: 'none' }}>
                      open till 4:15 AM
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Column (Dua Card) */}
              <div style={{ flex: 1 }}>
                <div onClick={goDua} style={{ position: 'relative', height: '100%', borderRadius: 24, overflow: 'hidden', cursor: 'pointer' }}>
                  <img src="../uploads/maghrib_dua.webp" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 45%)' }} />
                  <div style={{ position: 'absolute', left: 16, top: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span className="material-symbols-rounded" style={{ fontSize: 18, color: '#FFFFFF' }}>tasbih</span>
                    <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>Dua &amp; Dikhr</div>
                    <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>Daily supplications</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Explore Masjids Card (Wide) */}
            <div onClick={goMasjids} style={{ position: 'relative', height: 168, borderRadius: 24, overflow: 'hidden', marginTop: 14, cursor: 'pointer' }}>
              <img src="../uploads/maghrib_masjid.webp" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
              <div style={{ position: 'absolute', left: 20, bottom: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span className="material-symbols-rounded" style={{ fontSize: 20, color: '#FFFFFF' }}>mosque</span>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>Masjids</div>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>Explore masjids near you</div>
              </div>
            </div>
          </div>

          {/* Islamic tools */}
          <div style={{ padding: '0 20px 24px' }}>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--color-info-primary)', marginBottom: 14 }}>Islamic tools</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {[{ emoji: '💰', label: 'Zakaat' }, { emoji: '🗓️', label: 'Hijri' }, { emoji: '🧭', label: 'Qibla' }, { emoji: '📗', label: '99 Names' }].map((t, idx) => (
                <div key={idx} style={{ background: 'transparent', borderRadius: 16, padding: '12px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <span style={{ fontSize: 24 }}>{t.emoji}</span>
                  <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 700, color: 'var(--color-info-primary)', textWrap: 'nowrap' }}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Qaum updates carousel */}
          <div style={{ padding: '0 0 12px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 20px', marginBottom: 12 }}>
              <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--color-info-primary)' }}>Recent from Qaum</div>
              <div style={{ display: 'flex', gap: 3 }}>
                {[0, 1].map((dotIdx) => {
                  const active = slide === dotIdx;
                  return (
                    <div key={dotIdx} onClick={() => onSlideDotTap && onSlideDotTap(dotIdx)} style={{ height: 6, width: active ? 18 : 6, background: active ? 'var(--color-info-primary)' : 'var(--color-info-faint)', borderRadius: 3, transition: 'width 250ms', cursor: 'pointer' }} />
                  );
                })}
              </div>
            </div>

            {/* Carousel wrapper */}
            <div id="qaum-carousel" style={{ display: 'flex', gap: 12, overflowX: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 20px 4px', scrollSnapType: 'x mandatory' }}>
              {/* Card 1 */}
              <div style={{ flexShrink: 0, width: 250, background: 'var(--color-surface-card)', border: '1px solid var(--color-neutral-border)', borderRadius: 16, padding: 14, scrollSnapAlign: 'start', position: 'relative' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1A5E30', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>P</div>
                  <div>
                    <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--color-info-primary)' }}>Paigham</div>
                    <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 9, color: 'var(--color-info-faint)' }}>Haj 2027 Applications</div>
                  </div>
                </div>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, color: 'var(--color-info-secondary)', lineHeight: 1.45, height: 54, overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 12 }}>
                  Haj 2027 Applications Are Now Open! Register online on the official website.
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div onClick={onHajLike} style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-action-background)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: 12, color: likes.haj.liked ? '#E05060' : 'var(--color-info-faint)', fontVariationSettings: `'FILL' ${likes.haj.liked ? 1 : 0}` }}>favorite</span>
                  </div>
                  <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, color: 'var(--color-info-secondary)' }}>{likes.haj.count}</span>
                  <span className="material-symbols-rounded" style={{ fontSize: 16, color: 'var(--color-info-faint)', transform: 'scaleX(-1)' }}>reply</span>
                  <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 10, color: 'var(--color-info-faint)', marginLeft: 'auto' }}>2d ago</span>
                </div>
              </div>

              {/* Card 2 */}
              <div style={{ flexShrink: 0, width: 250, background: 'var(--color-surface-card)', border: '1px solid var(--color-neutral-border)', borderRadius: 16, padding: 14, scrollSnapAlign: 'start' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1A5E30', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>P</div>
                  <div>
                    <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--color-info-primary)' }}>Paigham</div>
                    <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 9, color: 'var(--color-info-faint)' }}>Eid Mubarak announcements</div>
                  </div>
                </div>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, color: 'var(--color-info-secondary)', lineHeight: 1.45, height: 54, overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 12 }}>
                  We wish you and your family a blessed Eid-ul-Fitr. May Allah accept our fasts.
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div onClick={onEidLike} style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-action-background)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: 12, color: likes.eid.liked ? '#E05060' : 'var(--color-info-faint)', fontVariationSettings: `'FILL' ${likes.eid.liked ? 1 : 0}` }}>favorite</span>
                  </div>
                  <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, color: 'var(--color-info-secondary)' }}>{likes.eid.count}</span>
                  <span className="material-symbols-rounded" style={{ fontSize: 16, color: 'var(--color-info-faint)', transform: 'scaleX(-1)' }}>reply</span>
                  <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 10, color: 'var(--color-info-faint)', marginLeft: 'auto' }}>1w ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. QAUM SCREEN
function QaumScreen({
  activeFilter = 0,
  onSelectFilter,
  likes = { post1: { liked: true, count: 4 }, post2: { liked: false, count: 2 }, post3: { liked: true, count: 8 } },
  onLike,
  follows = { paigham: true, dargah: false },
  onToggleFollow,
  audioPlaying = false,
  audioProgress = 4, // out of 22 bars
  onToggleAudio
}) {
  const filters = [
    { label: 'All Updates', index: 0 },
    { label: 'My Masjids', index: 1 },
    { label: 'Saved', index: 2 }
  ];

  const fPaigham = {
    label: follows.paigham ? 'Following' : 'Follow',
    bg: follows.paigham ? 'transparent' : 'var(--color-action-primary)',
    border: follows.paigham ? 'var(--color-neutral-border)' : 'transparent',
    color: follows.paigham ? 'var(--color-info-secondary)' : 'var(--color-action-primary-inverse)'
  };

  const fDargah = {
    label: follows.dargah ? 'Following' : 'Follow',
    bg: follows.dargah ? 'transparent' : 'var(--color-action-primary)',
    border: follows.dargah ? 'var(--color-neutral-border)' : 'transparent',
    color: follows.dargah ? 'var(--color-info-secondary)' : 'var(--color-action-primary-inverse)'
  };

  // Audio bars helper
  const audioBars = Array.from({ length: 22 }).map((_, idx) => ({
    h: 4 + Math.sin(idx * 0.4) * 12 + Math.cos(idx * 0.8) * 6 + 10,
    bg: idx < audioProgress ? 'var(--color-action-primary)' : 'var(--color-info-faint)'
  }));

  const showPost1 = activeFilter === 0 || (activeFilter === 1 && follows.paigham);
  const showPost2 = activeFilter === 0 || (activeFilter === 1 && follows.dargah);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--color-surface-primary)' }}>
      {/* AppBar */}
      <div style={{ flexShrink: 0, padding: '54px 18px 12px', background: 'var(--color-surface-primary)', borderBottom: '1.5px solid var(--color-neutral-border)' }}>
        <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--color-info-primary)' }}>Qaum</div>
        {/* Feed filter chips */}
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          {filters.map((f, idx) => {
            const active = activeFilter === f.index;
            return (
              <div key={idx} onClick={() => onSelectFilter && onSelectFilter(f.index)} style={{ borderRadius: 999, padding: '6px 14px', cursor: 'pointer', background: active ? 'var(--color-info-primary)' : 'var(--color-action-background)', transition: 'background 200ms' }}>
                <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700, color: active ? 'var(--color-surface-primary)' : 'var(--color-info-primary)' }}>{f.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feed container */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 80 }}>
        {/* Post 1 */}
        {showPost1 && (
          <div style={{ borderBottom: '1px solid var(--color-neutral-border)', padding: '16px 16px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#1A5E30', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"Nunito", sans-serif', fontSize: 18, fontWeight: 700 }}>P</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--color-info-primary)' }}>Paigham</div>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, color: 'var(--color-info-secondary)' }}>Paigham HQ</div>
              </div>
              <div onClick={() => onToggleFollow && onToggleFollow('paigham')} style={{ marginLeft: 'auto', flexShrink: 0, borderRadius: 999, padding: '5px 13px', cursor: 'pointer', background: fPaigham.bg, border: `1px solid ${fPaigham.border}`, transition: 'background 200ms' }}>
                <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700, color: fPaigham.color }}>{fPaigham.label}</span>
              </div>
            </div>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, color: 'color-mix(in oklab, var(--color-info-primary) 85%, transparent)', marginBottom: 10, lineHeight: 1.5 }}>
              Haj 2027 registration is open. Please check the website. <span style={{ fontWeight: 700, color: 'var(--color-info-primary)', cursor: 'pointer' }}>Read more</span>
            </div>
            {/* Banner card */}
            <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 10, background: 'linear-gradient(160deg,#0A3820,#1A6B3A)', padding: '14px 16px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-neutral-brand)', letterSpacing: '.06em', fontFamily: '"Nunito", sans-serif', marginBottom: 4 }}>APPLICATIONS OPEN</div>
                  <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>Haj Committee of India invites applications from eligible intending pilgrims for Haj–2027.</div>
                </div>
                <div style={{ background: 'color-mix(in oklab, var(--color-neutral-brand) 25%, transparent)', borderRadius: 8, padding: '6px 10px', textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: 9, color: 'var(--color-neutral-brand)', fontWeight: 700, fontFamily: '"Nunito", sans-serif' }}>SPIRITUAL</div>
                  <div style={{ fontSize: 9, color: 'var(--color-neutral-brand)', fontWeight: 700, fontFamily: '"Nunito", sans-serif' }}>JOURNEY</div>
                </div>
              </div>
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: 'rgba(0,201,80,0.15)', borderRadius: 8, padding: 8 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--color-action-primary)', fontFamily: '"Nunito", sans-serif', marginBottom: 3 }}>DATES</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#E07050', fontFamily: '"Nunito", sans-serif' }}>22 JUNE - 20 JULY</div>
                </div>
                <div style={{ background: 'rgba(0,201,80,0.15)', borderRadius: 8, padding: 8 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--color-action-primary)', fontFamily: '"Nunito", sans-serif', marginBottom: 3 }}>APPLY</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#FFFFFF', fontFamily: '"Nunito", sans-serif' }}>HAJ SUVIDHA APP</div>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div onClick={() => onLike && onLike('post1')} style={{ width: 28, height: 28, borderRadius: '50%', background: likes.post1.liked ? 'rgba(224,80,96,0.15)' : 'var(--color-action-background)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 200ms' }}>
                <span className="material-symbols-rounded" style={{ fontSize: 14, color: likes.post1.liked ? '#E05060' : 'var(--color-info-secondary)', fontVariationSettings: `'FILL' ${likes.post1.liked ? 1 : 0}` }}>favorite</span>
              </div>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, color: 'var(--color-info-secondary)' }}>{likes.post1.count}</span>
              <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-info-secondary)', transform: 'scaleX(-1)', cursor: 'pointer' }}>reply</span>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, color: 'var(--color-info-faint)', marginLeft: 'auto' }}>2d ago</span>
            </div>
          </div>
        )}

        {/* Post 2 */}
        {showPost2 && (
          <div style={{ borderBottom: '1px solid var(--color-neutral-border)', padding: '16px 16px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#2A3580', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"Nunito", sans-serif', fontSize: 18, fontWeight: 700 }}>D</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--color-info-primary)' }}>Dargah Masjid</div>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, color: 'var(--color-info-secondary)' }}>Molkalmuru - 577535</div>
              </div>
              <div onClick={() => onToggleFollow && onToggleFollow('dargah')} style={{ marginLeft: 'auto', flexShrink: 0, borderRadius: 999, padding: '5px 13px', cursor: 'pointer', background: fDargah.bg, border: `1px solid ${fDargah.border}`, transition: 'background 200ms' }}>
                <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700, color: fDargah.color }}>{fDargah.label}</span>
              </div>
            </div>
            {/* Audio player card */}
            <div style={{ background: 'var(--color-surface-card)', borderRadius: 40, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, border: '1px solid color-mix(in oklab, var(--color-action-primary) 18%, transparent)' }}>
              <div onClick={onToggleAudio} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-action-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
                <span className="material-symbols-rounded" style={{ fontSize: 18, color: 'var(--color-action-primary-inverse)', fontVariationSettings: `'FILL' 1` }}>{audioPlaying ? 'pause' : 'play_arrow'}</span>
              </div>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--color-info-primary)', flexShrink: 0, width: 36 }}>{audioPlaying ? '0:12' : '1:34'}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, height: 28 }}>
                {audioBars.map((b, idx) => (
                  <div key={idx} style={{ width: 2, height: b.h, background: b.bg, borderRadius: 1 }} />
                ))}
              </div>
            </div>
            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div onClick={() => onLike && onLike('post2')} style={{ width: 28, height: 28, borderRadius: '50%', background: likes.post2.liked ? 'rgba(224,80,96,0.15)' : 'var(--color-action-background)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 200ms' }}>
                <span className="material-symbols-rounded" style={{ fontSize: 14, color: likes.post2.liked ? '#E05060' : 'var(--color-info-secondary)', fontVariationSettings: `'FILL' ${likes.post2.liked ? 1 : 0}` }}>favorite</span>
              </div>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, color: 'var(--color-info-secondary)' }}>{likes.post2.count}</span>
              <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-info-secondary)', transform: 'scaleX(-1)', cursor: 'pointer' }}>reply</span>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, color: 'var(--color-info-faint)', marginLeft: 'auto' }}>9mo ago</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 3. QURAN SCREEN
function QuranScreen({
  activeTab = 0, // 0 = Surah, 1 = Juz
  onSelectTab,
  onOpenReader,
  onSelectSurah,
  onSelectJuz,
  selectedSurahIdx = 0,
  selectedJuzIdx = 0
}) {
  const tabs = [
    { label: 'Surah', index: 0 },
    { label: 'Juz', index: 1 }
  ];

  const surahs = [
    { n: 1,  name: "Al-Faatiha",   tr: "The Opener",        ayahs: 7,   place: "Makkah",  arabic: "سُورَةُ الْفَاتِحَةِ" },
    { n: 2,  name: "Al-Baqara",    tr: "The Cow",           ayahs: 286, place: "Madinah", arabic: "سُورَةُ الْبَقَرَةِ" },
    { n: 3,  name: "Aal-i-Imraan", tr: "Family of Imran",   ayahs: 200, place: "Madinah", arabic: "سُورَةُ الِعِمْرَانِ" },
    { n: 4,  name: "An-Nisaa",     tr: "The Women",         ayahs: 176, place: "Madinah", arabic: "سُورَةُ النِّسَاءِ" },
    { n: 5,  name: "Al-Maaida",    tr: "The Table Spread",  ayahs: 120, place: "Madinah", arabic: "سُورَةُ الْمَائِدَةِ" }
  ];

  const juzList = [
    { n: 1, title: "Juz 1", name: "Alif Lam Meem" },
    { n: 2, title: "Juz 2", name: "Sayaqool" },
    { n: 3, title: "Juz 3", name: "Tilkal Rusul" }
  ];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--color-surface-primary)' }}>
      {/* AppBar */}
      <div style={{ flexShrink: 0, padding: '54px 18px 12px', background: 'var(--color-surface-primary)' }}>
        <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 26, fontWeight: 800, color: 'var(--color-info-primary)' }}>Quran</div>
      </div>

      {/* Tabs */}
      <div style={{ flexShrink: 0, padding: '0 16px 14px', background: 'var(--color-surface-primary)' }}>
        <div style={{ display: 'flex', background: 'var(--color-action-background)', borderRadius: 16, padding: 4, gap: 2 }}>
          {tabs.map((t, idx) => {
            const active = activeTab === t.index;
            return (
              <div key={idx} onClick={() => onSelectTab && onSelectTab(t.index)} style={{ flex: 1, textAlign: 'center', background: active ? 'var(--color-surface-primary)' : 'transparent', borderRadius: 12, padding: '8px 0', cursor: 'pointer', transition: 'background 200ms' }}>
                <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 700, color: active ? 'var(--color-action-primary)' : 'var(--color-info-secondary)' }}>{t.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* List content */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 16px 16px' }}>
        {activeTab === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Continue card */}
            <div onClick={onOpenReader} style={{ background: 'var(--color-action-primary)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', boxShadow: 'var(--shadow-button)' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.22)', flexShrink: 0, display: 'flex', alignItems: 'center', justifycontent: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-rounded" style={{ fontSize: 22, color: 'var(--color-action-primary-inverse)', fontVariationSettings: `'FILL' 1` }}>play_arrow</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 10, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>Continue reading</div>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, fontWeight: 800, color: 'var(--color-action-primary-inverse)', marginTop: 1 }}>Al-Kahf</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
                    <div style={{ width: '40%', height: '100%', borderRadius: 2, background: '#FFFFFF' }} />
                  </div>
                  <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>Ayah 45 of 110</span>
                </div>
              </div>
              <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-action-primary-inverse)' }}>chevron_right</span>
            </div>

            {/* Surah List */}
            {surahs.map((s, idx) => {
              const active = selectedSurahIdx === idx;
              return (
                <div key={idx} onClick={() => onSelectSurah && onSelectSurah(idx)} style={{ background: active ? 'color-mix(in oklab, var(--color-action-primary) 8%, var(--color-surface-card))' : 'var(--color-surface-card)', border: `1px solid ${active ? 'var(--color-action-primary)' : 'var(--color-neutral-border)'}`, borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'background 200ms, border-color 200ms' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-action-primary)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--color-action-primary-inverse)' }}>{s.n}</span></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--color-info-primary)' }}>{s.name}</div>
                    <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, color: 'var(--color-info-secondary)' }}>{s.tr}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'sans-serif', fontSize: 18, color: 'var(--color-info-primary)', direction: 'rtl' }}>{s.arabic}</div>
                    <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, color: 'var(--color-status-disabled-alt)', marginTop: 2 }}>{s.place}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {juzList.map((j, idx) => {
              const active = selectedJuzIdx === idx;
              return (
                <div key={idx} onClick={() => onSelectJuz && onSelectJuz(idx)} style={{ background: active ? 'color-mix(in oklab, var(--color-action-primary) 8%, var(--color-surface-card))' : 'var(--color-surface-card)', border: `1px solid ${active ? 'var(--color-action-primary)' : 'var(--color-neutral-border)'}`, borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'background 200ms, border-color 200ms' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-action-primary)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--color-action-primary-inverse)' }}>{j.n}</span></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--color-info-primary)' }}>{j.title}</div>
                    <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, color: 'var(--color-info-secondary)' }}>{j.name}</div>
                  </div>
                  <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-status-disabled-alt)' }}>chevron_right</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// 4. SALAAH SCREEN
function SalaahScreen({
  masjidLetter = "B",
  masjidName = "Masjid E Bilal",
  masjidSub = "Bannerghatta Road, Bengaluru",
  onMasjidSheetToggle,
  showMasjidSheet = false,
  onSelectMasjid,
  dateOffset = 0,
  onDateChange,
  prayersAlert = { Fajr: false, Zohar: true, Asr: false, Maghrib: true, Isha: false },
  prayersChecked = { Fajr: true, Zohar: true, Asr: true, Maghrib: false, Isha: false },
  onToggleCheck,
  onToggleAlert
}) {
  const prayerData = [
    { name: 'Fajr', azaan: '4:36 AM', iqama: '5:00 AM' },
    { name: 'Zohar', azaan: '12:35 PM', iqama: '1:00 PM' },
    { name: 'Asr', azaan: '4:52 PM', iqama: '5:15 PM' },
    { name: 'Maghrib', azaan: '6:49 PM', iqama: '6:52 PM' },
    { name: 'Isha', azaan: '8:05 PM', iqama: '8:30 PM' }
  ];

  const dateTitles = ["Today, 07 Jul", "Tomorrow, 08 Jul", "Wed, 09 Jul"];
  const dateSubs = ["11 Muharram 1448 AH", "12 Muharram 1448 AH", "13 Muharram 1448 AH"];
  const dateIdx = Math.min(Math.max(0, dateOffset), 2);

  // Month grid headers
  const months = [
    { label: 'Jan' }, { label: 'Feb' }, { label: 'Mar' }, { label: 'Apr' },
    { label: 'May' }, { label: 'Jun' }, { label: 'Jul' }, { label: 'Aug' },
    { label: 'Sep' }, { label: 'Oct' }, { label: 'Nov' }, { label: 'Dec' }, { label: '..' }
  ];

  const rows = [
    { day: 'Sun', cells: [{ bg: 'var(--color-action-primary)' }, { bg: 'transparent' }, { bg: 'rgba(0, 201, 80, 0.25)' }, { bg: 'transparent' }, { bg: 'rgba(0, 201, 80, 0.45)' }, { bg: 'rgba(0, 201, 80, 0.15)' }, { bg: 'var(--color-action-primary)' }, { bg: 'transparent' }, { bg: 'transparent' }, { bg: 'rgba(0, 201, 80, 0.65)' }, { bg: 'var(--color-action-primary)' }, { bg: 'transparent' }, { bg: 'transparent' }] },
    { day: 'Mon', cells: [{ bg: 'rgba(0, 201, 80, 0.15)' }, { bg: 'var(--color-action-primary)' }, { bg: 'transparent' }, { bg: 'rgba(0, 201, 80, 0.35)' }, { bg: 'transparent' }, { bg: 'rgba(0, 201, 80, 0.45)' }, { bg: 'transparent' }, { bg: 'rgba(0, 201, 80, 0.55)' }, { bg: 'var(--color-action-primary)' }, { bg: 'transparent' }, { bg: 'transparent' }, { bg: 'rgba(0, 201, 80, 0.65)' }, { bg: 'var(--color-action-primary)' }] },
    { day: 'Tue', cells: [{ bg: 'var(--color-action-primary)' }, { bg: 'rgba(0, 201, 80, 0.25)' }, { bg: 'transparent' }, { bg: 'transparent' }, { bg: 'rgba(0, 201, 80, 0.65)' }, { bg: 'var(--color-action-primary)' }, { bg: 'transparent' }, { bg: 'transparent' }, { bg: 'rgba(0, 201, 80, 0.15)' }, { bg: 'var(--color-action-primary)' }, { bg: 'transparent' }, { bg: 'rgba(0, 201, 80, 0.35)' }, { bg: 'transparent' }] }
  ];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--color-surface-primary)', position: 'relative' }}>
      {/* AppBar */}
      <div onClick={onMasjidSheetToggle} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '54px 18px 10px', cursor: 'pointer' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#1A5E30', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"Nunito", sans-serif', fontSize: 18, fontWeight: 700 }}>{masjidLetter}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 17, fontWeight: 700, color: 'var(--color-info-primary)' }}>{masjidName}</span>
            <span className="material-symbols-rounded" style={{ fontSize: 18, color: 'var(--color-info-secondary)' }}>keyboard_arrow_down</span>
          </div>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, color: 'var(--color-info-secondary)' }}>{masjidSub}</div>
        </div>
      </div>

      {/* Date navigation */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifycontent: 'space-between', padding: '0 16px 12px', justifyContent: 'space-between' }}>
        <div onClick={() => onDateChange && onDateChange(-1)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-action-background)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: dateIdx > 0 ? 1 : 0.4 }}>
          <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-info-primary)' }}>chevron_left</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--color-info-primary)' }}>{dateTitles[dateIdx]}</div>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, color: 'var(--color-info-secondary)' }}>{dateSubs[dateIdx]}</div>
        </div>
        <div onClick={() => onDateChange && onDateChange(1)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-action-background)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: dateIdx < 2 ? 1 : 0.4 }}>
          <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-info-primary)' }}>chevron_right</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 80 }}>
        {/* Timings card */}
        <div style={{ background: 'color-mix(in oklab, var(--color-action-primary) 5%, var(--color-surface-primary))', border: '1px solid color-mix(in oklab, var(--color-action-primary) 25%, transparent)', borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ display: 'flex', padding: '12px 16px 8px', borderBottom: '1px solid var(--color-neutral-border)' }}>
            <div style={{ flex: 1 }} />
            <div style={{ width: 80, textAlign: 'center' }}><span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--color-info-secondary)' }}>Azaan</span></div>
            <div style={{ width: 100, textAlign: 'right' }}><span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--color-info-secondary)' }}>Iqama</span></div>
          </div>

          {prayerData.map((p, idx) => {
            const checked = prayersChecked[p.name];
            const alertOn = prayersAlert[p.name];
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid color-mix(in oklab, var(--color-info-primary) 6%, transparent)' }}>
                <div onClick={() => onToggleCheck && onToggleCheck(p.name)} style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid var(--color-action-primary)', background: checked ? 'var(--color-action-primary)' : 'transparent', flexShrink: 0, marginRight: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: 13, color: 'var(--color-action-primary-inverse)', opacity: checked ? 1 : 0 }}>check</span>
                </div>
                <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--color-info-primary)', flex: 1 }}>{p.name}</span>
                <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, color: 'var(--color-info-secondary)', width: 80, textAlign: 'center' }}>{p.azaan}</span>
                <div style={{ width: 100, display: 'flex', alignItems: 'center', justifycontent: 'flex-end', gap: 6, justifyContent: 'flex-end' }}>
                  <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, color: 'var(--color-info-primary)' }}>{p.iqama}</span>
                  <span onClick={() => onToggleAlert && onToggleAlert(p.name)} className="material-symbols-rounded" style={{ fontSize: 18, color: alertOn ? 'var(--color-action-primary)' : 'var(--color-info-faint)', fontVariationSettings: `'FILL' ${alertOn ? 1 : 0}`, cursor: 'pointer' }}>{alertOn ? 'notifications' : 'notifications_none'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Calendar visual tracker */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--color-info-primary)' }}>Salaah History</span>
            <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, color: 'var(--color-action-primary)', textDecoration: 'underline', cursor: 'pointer' }}>Toggle Calendar</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '36px repeat(13,1fr)', gap: 3, marginBottom: 4 }}>
            <div />
            {months.map((m, idx) => (
              <div key={idx} style={{ textAlign: 'center', fontFamily: '"Nunito", sans-serif', fontSize: 9, color: 'var(--color-info-secondary)' }}>{m.label}</div>
            ))}
          </div>

          <div style={{ display: 'flex', flexdirection: 'column', gap: 3, flexDirection: 'column' }}>
            {rows.map((r, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '36px repeat(13,1fr)', gap: 3 }}>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 9, color: 'var(--color-info-secondary)', display: 'flex', alignItems: 'center' }}>{r.day}</div>
                {r.cells.map((c, cIdx) => (
                  <div key={cIdx} style={{ height: 14, borderRadius: 3, background: c.bg }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Masjid Switcher Modal Sheet overlay */}
      {showMasjidSheet && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: 'var(--color-surface-primary)', borderRadius: '24px 24px 0 0', padding: 20, boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 18, fontWeight: 800, color: 'var(--color-info-primary)' }}>Switch Masjid</span>
              <span onClick={onMasjidSheetToggle} className="material-symbols-rounded" style={{ fontSize: 24, color: 'var(--color-info-faint)', cursor: 'pointer' }}>close</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div onClick={() => onSelectMasjid && onSelectMasjid('Masjid E Bilal')} style={{ display: 'flex', gap: 10, padding: 10, background: 'var(--color-action-background)', borderRadius: 12, cursor: 'pointer' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1A5E30', color: '#fff', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>B</div>
                <div>
                  <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--color-info-primary)' }}>Masjid E Bilal</div>
                  <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, color: 'var(--color-info-secondary)' }}>Bannerghatta Road, Bengaluru</div>
                </div>
              </div>
              <div onClick={() => onSelectMasjid && onSelectMasjid('Masjid E Quba')} style={{ display: 'flex', gap: 10, padding: 10, background: 'transparent', borderRadius: 12, cursor: 'pointer' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2C3580', color: '#fff', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Q</div>
                <div>
                  <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--color-info-primary)' }}>Masjid E Quba</div>
                  <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, color: 'var(--color-info-secondary)' }}>Jayanagar, Bengaluru</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 5. PROFILE SCREEN
function ProfileScreen({
  userName = "Toufeeq Ahamed",
  inviteCopied = false,
  onCopyInvite,
  pendingApproveList = [{ name: 'Suhail Ahmed', letter: 'S' }, { name: 'Syed Imran', letter: 'S' }],
  onApproveFriend,
  logoutOpen = false,
  onToggleLogoutSheet,
  onConfirmLogout,
  goMasjids,
  goRegister,
  goFollowing
}) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--color-surface-primary)' }}>
      {/* Scroll container */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 80 }}>
        {/* Profile Hero section */}
        <div className="p-hero" style={{ position: 'relative', height: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '24px 20px 0' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#4A5A6A', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-neutral-border)' }}>
            <span style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 32, color: '#fff' }}>{userName.charAt(0)}</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 24, color: 'var(--color-info-primary)', marginBottom: 4 }}>{userName}</div>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, color: 'var(--color-info-secondary)' }}>Masjid E Bilal</div>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, color: 'var(--color-info-secondary)' }}>+91 81234 03269</div>
          </div>
        </div>

        {/* Settings rows */}
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Group 0: Masjids */}
          <div style={{ background: 'var(--color-surface-card)', borderRadius: 16, overflow: 'hidden' }}>
            <div onClick={goMasjids} className="prow" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderBottom: '1px solid var(--color-neutral-border)' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 22, color: 'var(--color-info-secondary)' }}>mosque</span>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, color: 'var(--color-info-primary)', flex: 1 }}>My Masjids</span>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--color-action-primary)', background: 'rgba(0,201,80,0.14)', borderRadius: 999, padding: '2px 9px' }}>2</span>
              <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-info-faint)' }}>chevron_right</span>
            </div>
            <div onClick={goRegister} className="prow" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderBottom: '1px solid var(--color-neutral-border)' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 22, color: 'var(--color-info-secondary)' }}>add_home_work</span>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, color: 'var(--color-info-primary)', flex: 1 }}>Register your Masjid</span>
              <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-info-faint)' }}>chevron_right</span>
            </div>
          </div>

          {/* Group 1: Invite & Friends */}
          <div style={{ background: 'var(--color-surface-card)', borderRadius: 16, overflow: 'hidden' }}>
            <div onClick={onCopyInvite} className="prow" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderBottom: '1px solid var(--color-neutral-border)' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 22, color: inviteCopied ? 'var(--color-action-primary)' : 'var(--color-info-secondary)' }}>{inviteCopied ? 'check_circle' : 'share'}</span>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, color: inviteCopied ? 'var(--color-action-primary)' : 'var(--color-info-primary)', flex: 1 }}>{inviteCopied ? 'Link Copied!' : 'Invite Friends'}</span>
              <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'var(--color-info-faint)' }}>chevron_right</span>
            </div>

            {/* Friend Requests */}
            <div style={{ padding: '12px 16px' }}>
              <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--color-info-primary)', marginBottom: 10 }}>Approve Friends</div>
              {pendingApproveList.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {pendingApproveList.map((fr, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-status-disabled)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 14, color: 'var(--color-info-secondary)' }}>{fr.letter}</span></div>
                      <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--color-info-primary)', flex: 1 }}>{fr.name}</span>
                      <div onClick={() => onApproveFriend && onApproveFriend(fr.name)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,201,80,0.14)', borderRadius: 999, padding: '6px 12px', cursor: 'pointer' }}>
                        <span className="material-symbols-rounded" style={{ fontSize: 16, color: 'var(--color-action-primary)' }}>check</span>
                        <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--color-action-primary)' }}>Approve</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, color: 'var(--color-info-secondary)' }}>No pending requests</div>
              )}
            </div>
          </div>

          {/* Group 2: Log out */}
          <div style={{ background: 'var(--color-surface-card)', borderRadius: 16, overflow: 'hidden' }}>
            <div onClick={onToggleLogoutSheet} className="prow" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
              <span className="material-symbols-rounded" style={{ fontSize: 22, color: 'var(--color-status-error)' }}>logout</span>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, color: 'var(--color-status-error)', flex: 1 }}>Log Out</span>
              <span className="material-symbols-rounded" style={{ fontSize: 20, color: 'color-mix(in oklab, var(--color-status-error) 40%, transparent)' }}>chevron_right</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout sheet overlay */}
      {logoutOpen && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: 'var(--color-surface-primary)', borderRadius: '24px 24px 0 0', padding: 24, boxSizing: 'border-box' }}>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 18, fontWeight: 800, color: 'var(--color-info-primary)', marginBottom: 8, textWrap: 'balance' }}>Are you sure you want to log out?</div>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, color: 'var(--color-info-secondary)', marginBottom: 20 }}>You will need to verify your phone number again to log back into Paigham.</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={onToggleLogoutSheet} className="btn btn-tonal lg" style={{ flex: 1 }}>Cancel</button>
              <button onClick={onConfirmLogout} className="btn btn-filled lg" style={{ flex: 1, background: 'var(--color-status-error)', color: '#fff' }}>Log out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { HomeScreen, QaumScreen, QuranScreen, SalaahScreen, ProfileScreen });
