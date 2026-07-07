/* @ds-bundle: {"format":3,"namespace":"NoorDesignSystem_46f42e","components":[],"sourceHashes":{"ui_kits/mobile/ExploreScreen.jsx":"f095dfbb2109","ui_kits/mobile/HomeScreen.jsx":"8ed1ed9b422f","ui_kits/mobile/OnboardingScreen.jsx":"2bfe67f17f3d","ui_kits/mobile/ReaderScreen.jsx":"6a32895aabb2","ui_kits/mobile/SettingsScreen.jsx":"f7cd58192fbb","ui_kits/mobile/components.jsx":"3c711d8734fe","ui_kits/mobile/ios-frame.jsx":"d67eb3ffe562"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.NoorDesignSystem_46f42e = window.NoorDesignSystem_46f42e || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/mobile/ExploreScreen.jsx
try { (() => {
// ExploreScreen — searchable surah list + Juz toggle
function ExploreScreen({
  onOpenSurah
}) {
  const [mode, setMode] = React.useState(0); // 0 = Surah, 1 = Juz
  const [query, setQuery] = React.useState('');
  const surahs = [{
    n: 1,
    name: 'Al-Fatiha',
    ar: 'الفاتحة',
    v: 7,
    juz: 1,
    type: 'Makki'
  }, {
    n: 2,
    name: 'Al-Baqarah',
    ar: 'البقرة',
    v: 286,
    juz: 1,
    type: 'Madani'
  }, {
    n: 3,
    name: "Aali 'Imrān",
    ar: 'آل عمران',
    v: 200,
    juz: 3,
    type: 'Madani'
  }, {
    n: 4,
    name: 'An-Nisā',
    ar: 'النساء',
    v: 176,
    juz: 4,
    type: 'Madani'
  }, {
    n: 5,
    name: 'Al-Mā\'idah',
    ar: 'المائدة',
    v: 120,
    juz: 6,
    type: 'Madani'
  }, {
    n: 18,
    name: 'Al-Kahf',
    ar: 'الكهف',
    v: 110,
    juz: 15,
    type: 'Makki'
  }, {
    n: 36,
    name: 'Yāsīn',
    ar: 'يٰسٓ',
    v: 83,
    juz: 22,
    type: 'Makki'
  }, {
    n: 55,
    name: 'Ar-Raḥmān',
    ar: 'الرحمٰن',
    v: 78,
    juz: 27,
    type: 'Madani'
  }, {
    n: 67,
    name: 'Al-Mulk',
    ar: 'الملك',
    v: 30,
    juz: 29,
    type: 'Makki'
  }, {
    n: 112,
    name: 'Al-Ikhlās',
    ar: 'الإخلاص',
    v: 4,
    juz: 30,
    type: 'Makki'
  }];
  const filtered = surahs.filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()) || String(s.n).includes(query));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: NOOR.surface
    }
  }, /*#__PURE__*/React.createElement(NoorAppBar, {
    title: "Explore",
    trailing: /*#__PURE__*/React.createElement(LinkIconButton, {
      icon: "tune",
      size: "md"
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 16px 12px'
    }
  }, /*#__PURE__*/React.createElement(TextField, {
    value: query,
    onChange: setQuery,
    placeholder: "Search surahs",
    leading: /*#__PURE__*/React.createElement(MIcon, {
      name: "search",
      size: 20,
      color: NOOR.fg2
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(TabBar, {
    index: mode,
    onChange: setMode,
    items: ['Surahs', 'Juz']
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: '0 16px 16px'
    }
  }, mode === 0 ? /*#__PURE__*/React.createElement(PlainSurface, {
    variant: "default",
    accent: NOOR.border,
    style: {
      padding: 4,
      borderColor: NOOR.border
    }
  }, filtered.map((s, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: s.n
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onOpenSurah
  }, /*#__PURE__*/React.createElement(SurahRow, {
    number: s.n,
    name: s.name,
    arabic: s.ar,
    verses: s.v,
    juz: s.juz,
    current: s.n === 2
  })), i < filtered.length - 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: NOOR.border,
      margin: '0 16px'
    }
  })))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, Array.from({
    length: 12
  }).map((_, i) => /*#__PURE__*/React.createElement(PlainSurface, {
    key: i,
    variant: "flat",
    style: {
      padding: 14
    }
  }, /*#__PURE__*/React.createElement(BodyXS, {
    weight: 700,
    color: NOOR.fg2,
    style: {
      textTransform: 'uppercase',
      letterSpacing: 0.6
    }
  }, "Juz ", i + 1), /*#__PURE__*/React.createElement(BodyM, {
    weight: 700,
    style: {
      marginTop: 4
    }
  }, ['Alif Lām Mīm', 'Sayaqūl', 'Tilkar-Rusul', 'Lan tanāl', 'Wal-muḥṣanāt'][i % 5]), /*#__PURE__*/React.createElement(BodyXS, {
    color: NOOR.fg2,
    style: {
      marginTop: 4
    }
  }, "20 pages \xB7 148 verses"))))));
}
Object.assign(window, {
  ExploreScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/ExploreScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/HomeScreen.jsx
try { (() => {
// HomeScreen — daily-ayah hero, continue card, prayer times, recent
function HomeScreen({
  onOpenSurah
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      background: NOOR.surface,
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 16px 0'
    }
  }, /*#__PURE__*/React.createElement(GradientSurface, {
    scheme: "brand",
    style: {
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    color: NOOR.brand,
    size: "sm",
    leading: /*#__PURE__*/React.createElement(MIcon, {
      name: "auto_awesome",
      size: 12,
      fill: true
    })
  }, "Ayah of the day")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: NOOR.arabic,
      direction: 'rtl',
      fontSize: 26,
      lineHeight: 1.9,
      color: NOOR.fg,
      marginBottom: 10
    }
  }, "\u0648\u064E\u0645\u064E\u0646 \u06CC\u064E\u062A\u064E\u0651\u0642\u0650 \u0671\u0644\u0644\u064E\u0651\u0647\u064E \u06CC\u064E\u062C\u06E1\u0639\u064E\u0644 \u0644\u064E\u0651\u0647\u064F\u06E5 \u0645\u064E\u062E\u06E1\u0631\u064E\u062C\u08F0\u0627"), /*#__PURE__*/React.createElement(BodyS, {
    color: NOOR.fg,
    style: {
      fontStyle: 'italic',
      marginBottom: 14
    }
  }, "\"And whoever is mindful of God \u2014 He will make for them a way out.\""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(BodyXS, {
    weight: 700,
    color: NOOR.fg2
  }, "At-Tal\u0101q \xB7 65:2"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(LinkIconButton, {
    icon: "favorite",
    size: "sm"
  }), /*#__PURE__*/React.createElement(LinkIconButton, {
    icon: "share",
    size: "sm"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 16px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(BodyM, {
    weight: 700
  }, "Continue reading"), /*#__PURE__*/React.createElement(LinkButton, {
    size: "sm",
    color: NOOR.primary
  }, "See all")), /*#__PURE__*/React.createElement(PlainSurface, {
    variant: "elevated",
    accent: NOOR.primary,
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 16,
      background: `linear-gradient(135deg, ${NOOR.primary}, ${NOOR.secondary})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(MIcon, {
    name: "menu_book",
    size: 28,
    color: "#fff",
    fill: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(BodyM, {
    weight: 700
  }, "Surah Al-Baqarah"), /*#__PURE__*/React.createElement(BodyXS, {
    color: NOOR.fg2
  }, "Verse 142 of 286 \xB7 Juz 2"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      height: 4,
      background: NOOR.border,
      borderRadius: 360,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '49%',
      height: '100%',
      background: NOOR.primary,
      borderRadius: 360
    }
  }))), /*#__PURE__*/React.createElement(FilledIconButton, {
    icon: "play_arrow",
    size: "md",
    onClick: onOpenSurah
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 16px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(BodyM, {
    weight: 700
  }, "Prayer times"), /*#__PURE__*/React.createElement(Badge, {
    color: NOOR.warning,
    size: "sm",
    leading: /*#__PURE__*/React.createElement(MIcon, {
      name: "schedule",
      size: 12
    })
  }, "Maghrib in 1h 12m")), /*#__PURE__*/React.createElement(PlainSurface, {
    variant: "flat",
    style: {
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, [{
    n: 'Fajr',
    t: '5:04',
    done: true
  }, {
    n: 'Dhuhr',
    t: '12:38',
    done: true
  }, {
    n: 'Asr',
    t: '3:52',
    done: true
  }, {
    n: 'Maghrib',
    t: '6:11',
    done: false,
    next: true
  }, {
    n: 'Isha',
    t: '7:36',
    done: false
  }].map(p => /*#__PURE__*/React.createElement("div", {
    key: p.n,
    style: {
      flex: 1,
      textAlign: 'center',
      padding: '8px 0',
      background: p.next ? A(NOOR.primary, 8) : 'transparent',
      borderRadius: 12,
      border: p.next ? `1px solid ${A(NOOR.primary, 25)}` : '1px solid transparent'
    }
  }, /*#__PURE__*/React.createElement(BodyXS, {
    weight: 700,
    color: p.next ? NOOR.primary : p.done ? NOOR.fg2 : NOOR.fg
  }, p.n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: NOOR.body,
      fontWeight: 700,
      fontSize: 16,
      color: p.next ? NOOR.primary : NOOR.fg,
      lineHeight: '20px',
      marginTop: 2
    }
  }, p.t)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 16px 0'
    }
  }, /*#__PURE__*/React.createElement(BodyM, {
    weight: 700,
    style: {
      marginBottom: 8
    }
  }, "Recently read"), /*#__PURE__*/React.createElement(PlainSurface, {
    variant: "default",
    accent: NOOR.border,
    style: {
      padding: '4px 4px',
      borderColor: NOOR.border
    }
  }, /*#__PURE__*/React.createElement(SurahRow, {
    number: 1,
    name: "Al-Fatiha",
    arabic: "\u0627\u0644\u0641\u0627\u062A\u062D\u0629",
    verses: 7,
    juz: 1
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: NOOR.border,
      margin: '0 16px'
    }
  }), /*#__PURE__*/React.createElement(SurahRow, {
    number: 36,
    name: "Y\u0101s\u012Bn",
    arabic: "\u064A\u0670\u0633\u0653",
    verses: 83,
    juz: 22
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: NOOR.border,
      margin: '0 16px'
    }
  }), /*#__PURE__*/React.createElement(SurahRow, {
    number: 67,
    name: "Al-Mulk",
    arabic: "\u0627\u0644\u0645\u064F\u0644\u0643",
    verses: 30,
    juz: 29
  }))));
}
Object.assign(window, {
  HomeScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/OnboardingScreen.jsx
try { (() => {
// OnboardingScreen — phone entry + ImmersiveOverlaySurface "moment" trigger
function OnboardingScreen() {
  const [phone, setPhone] = React.useState('');
  const [immersed, setImmersed] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      background: NOOR.surface
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 24px 16px',
      transform: immersed ? 'scale(0.97) translateY(8px)' : 'none',
      filter: immersed ? 'blur(10px)' : 'none',
      transition: 'all 750ms cubic-bezier(0.33,1,0.68,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement(NoorLogo, {
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: NOOR.title,
      fontSize: 28,
      lineHeight: 1,
      color: NOOR.fg,
      letterSpacing: -0.5
    }
  }, "Noor")), /*#__PURE__*/React.createElement(TitleH1, {
    style: {
      marginBottom: 12,
      fontSize: 38,
      lineHeight: '44px'
    }
  }, "Begin with a single ayah."), /*#__PURE__*/React.createElement(BodyM, {
    color: NOOR.fg2,
    style: {
      marginBottom: 28
    }
  }, "Pick a surah, mark a daily goal, and we'll keep your place. Quietly."), /*#__PURE__*/React.createElement(TextField, {
    label: "Phone number",
    value: phone,
    onChange: setPhone,
    placeholder: "(555) 123-4567",
    prefix: "\uD83C\uDDFA\uD83C\uDDF8 +1",
    helper: "We'll text you a sign-in code."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(PagerIndicator, {
    count: 3,
    current: 0
  })), /*#__PURE__*/React.createElement(FilledButton, {
    onClick: () => setImmersed(true)
  }, "Continue"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(LinkButton, {
    color: NOOR.fg2,
    size: "sm"
  }, "Sign in with email instead"))), immersed && /*#__PURE__*/React.createElement("div", {
    onClick: () => setImmersed(false),
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      animation: 'noor-overlay-in 800ms cubic-bezier(0.33,1,0.68,1) both'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '100%',
      width: 1400,
      height: 1400,
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      background: `radial-gradient(circle, ${A(NOOR.brand, 96)} 0%, ${A(NOOR.brand, 87)} 35%, ${A(NOOR.warningAlt, 80)} 60%, ${A(NOOR.warning, 50)} 80%, transparent 100%)`,
      animation: 'noor-expand 750ms cubic-bezier(0.33,1,0.68,1) both'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '-30%',
      top: '0%',
      width: 500,
      height: 500,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${NOOR.brand} 0%, ${A(NOOR.brand, 50)} 40%, transparent 70%)`,
      animation: 'noor-burst-1 1200ms cubic-bezier(0.33,1,0.68,1) 350ms both',
      filter: 'blur(8px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: '-30%',
      bottom: '-10%',
      width: 500,
      height: 500,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${NOOR.warningAlt} 0%, ${A(NOOR.warning, 50)} 40%, transparent 70%)`,
      animation: 'noor-burst-2 1200ms cubic-bezier(0.33,1,0.68,1) 350ms both',
      filter: 'blur(8px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      animation: 'noor-content-in 600ms cubic-bezier(0.34,1.56,0.64,1) 600ms both'
    }
  }, /*#__PURE__*/React.createElement(NoorLogo, {
    size: 64
  }), /*#__PURE__*/React.createElement(TitleH1, {
    style: {
      marginTop: 24,
      fontSize: 36,
      lineHeight: '44px',
      textAlign: 'center',
      color: NOOR.fg
    }
  }, "Welcome to Noor."), /*#__PURE__*/React.createElement(BodyM, {
    color: NOOR.fg,
    style: {
      marginTop: 12,
      textAlign: 'center',
      maxWidth: 280,
      opacity: 0.8
    }
  }, "Tap anywhere to begin."))), /*#__PURE__*/React.createElement("style", null, `
        @keyframes noor-overlay-in { 0% { opacity: 0 } 100% { opacity: 1 } }
        @keyframes noor-expand { 0% { transform: translate(-50%, 100%) scale(0.08); opacity: 0.4 } 100% { transform: translate(-50%, -50%) scale(1); opacity: 1 } }
        @keyframes noor-burst-1 { 0% { transform: translate(60%, 60%) scale(0.4); opacity: 0 } 60% { opacity: 1 } 100% { transform: translate(0, 0) scale(1); opacity: 0.9 } }
        @keyframes noor-burst-2 { 0% { transform: translate(-60%, -60%) scale(0.4); opacity: 0 } 60% { opacity: 1 } 100% { transform: translate(0, 0) scale(1); opacity: 0.9 } }
        @keyframes noor-content-in {
          0%   { transform: translateY(60px) scale(0.85); opacity: 0 }
          70%  { transform: translateY(-6px) scale(1.02); opacity: 1 }
          100% { transform: translateY(0) scale(1); opacity: 1 }
        }
      `));
}
Object.assign(window, {
  OnboardingScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/OnboardingScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/ReaderScreen.jsx
try { (() => {
// ReaderScreen — Surah view with Arabic ayat + translation, tabs at top, audio bar pinned bottom
function ReaderScreen({
  onBack
}) {
  const [tab, setTab] = React.useState(0);
  const showTafsir = tab === 2;
  const showTranslation = tab !== 0;
  const ayat = [{
    n: 1,
    ar: 'الٓمٓ',
    tr: 'Alif, Lām, Mīm.'
  }, {
    n: 2,
    ar: 'ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
    tr: 'This is the Book in which there is no doubt — a guidance for the mindful.'
  }, {
    n: 3,
    ar: 'ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَـٰهُمْ يُنفِقُونَ',
    tr: 'Those who believe in the unseen, establish prayer, and give from what We have provided for them.'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: NOOR.surface,
      backgroundImage: `radial-gradient(circle at 80% -10%, ${A(NOOR.brand, 12)}, transparent 50%)`
    }
  }, /*#__PURE__*/React.createElement(NoorAppBar, {
    leading: /*#__PURE__*/React.createElement(LinkIconButton, {
      icon: "arrow_back",
      size: "md",
      onClick: onBack
    }),
    title: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(BodyXS, {
      color: NOOR.fg2
    }, "Surah 2 \xB7 286 verses \xB7 Madani"), /*#__PURE__*/React.createElement(TitleH3, {
      style: {
        fontSize: 22,
        lineHeight: '24px'
      }
    }, "Al-Baqarah")),
    trailing: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(LinkIconButton, {
      icon: "search",
      size: "md"
    }), /*#__PURE__*/React.createElement(LinkIconButton, {
      icon: "bookmark_border",
      size: "md"
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 16px 12px'
    }
  }, /*#__PURE__*/React.createElement(TabBar, {
    index: tab,
    onChange: setTab,
    items: ['Arabic', 'Translation', 'Tafsir']
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: '0 16px 96px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '12px 0 24px',
      fontFamily: NOOR.arabic,
      direction: 'rtl',
      fontSize: 34,
      lineHeight: 1.9,
      color: NOOR.brand
    }
  }, "\u0628\u0650\u0633\u06E1\u0645\u0650 \u0671\u0644\u0644\u064E\u0651\u0647\u0650 \u0671\u0644\u0631\u064E\u0651\u062D\u06E1\u0645\u064E\u0640\u0670\u0646\u0650 \u0671\u0644\u0631\u064E\u0651\u062D\u0650\u06CC\u0645\u0650"), ayat.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.n,
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 28 28",
    width: "28",
    height: "28",
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "14,2 25,8 25,20 14,26 3,20 3,8",
    fill: "none",
    stroke: NOOR.brand,
    strokeWidth: "1.2"
  })), /*#__PURE__*/React.createElement(BodyXS, {
    weight: 700,
    color: NOOR.brand
  }, a.n)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: NOOR.border
    }
  }), /*#__PURE__*/React.createElement(LinkIconButton, {
    icon: "more_horiz",
    size: "sm",
    color: NOOR.fg2
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: NOOR.arabic,
      direction: 'rtl',
      fontSize: 30,
      lineHeight: 1.95,
      color: NOOR.fg,
      marginBottom: showTranslation ? 12 : 0,
      textAlign: 'right'
    }
  }, a.ar), showTranslation && /*#__PURE__*/React.createElement(BodyM, {
    color: NOOR.fg2,
    style: {
      lineHeight: '26px'
    }
  }, a.tr), showTafsir && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      padding: 14,
      borderRadius: 12,
      background: NOOR.surface2
    }
  }, /*#__PURE__*/React.createElement(BodyXS, {
    weight: 700,
    color: NOOR.fg2,
    style: {
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: 4
    }
  }, "Tafsir Ibn Kathir"), /*#__PURE__*/React.createElement(BodyS, {
    color: NOOR.fg
  }, "The opening letters (\u1E24ur\u016Bf Muqa\u1E6D\u1E6Da'\u0101t) appear at the start of 29 surahs. Their full meaning is known to God alone."))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 12,
      right: 12,
      bottom: 86,
      padding: 8,
      borderRadius: 16,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(22px) saturate(180%)',
      WebkitBackdropFilter: 'blur(22px) saturate(180%)',
      border: `1px solid ${NOOR.border}`,
      boxShadow: '0 14px 28px -14px rgba(9,9,11,0.18)',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(FilledIconButton, {
    icon: "play_arrow",
    size: "md"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(BodyS, {
    weight: 700
  }, "Al-Baqarah \xB7 Verse 2"), /*#__PURE__*/React.createElement(BodyXS, {
    color: NOOR.fg2
  }, "Mishary Rashid Alafasy")), /*#__PURE__*/React.createElement(LinkIconButton, {
    icon: "skip_next",
    size: "md",
    color: NOOR.fg
  }), /*#__PURE__*/React.createElement(LinkIconButton, {
    icon: "speed",
    size: "md",
    color: NOOR.fg2
  })));
}
Object.assign(window, {
  ReaderScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/ReaderScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/SettingsScreen.jsx
try { (() => {
// SettingsScreen — list rows demonstrating Switch, list items, sections
function SettingsScreen() {
  const [notif, setNotif] = React.useState(true);
  const [translit, setTranslit] = React.useState(true);
  const [autoplay, setAutoplay] = React.useState(false);
  const [dark, setDark] = React.useState(false);
  const Row = ({
    icon,
    title,
    sub,
    trailing,
    last
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      borderBottom: last ? 'none' : `1px solid ${NOOR.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: NOOR.inputBg,
      color: NOOR.fg
    }
  }, /*#__PURE__*/React.createElement(MIcon, {
    name: icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(BodyM, {
    weight: 500
  }, title), sub && /*#__PURE__*/React.createElement(BodyXS, {
    color: NOOR.fg2
  }, sub)), trailing);
  const Section = ({
    title,
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(BodyXS, {
    weight: 700,
    color: NOOR.fg2,
    style: {
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      padding: '6px 16px 8px'
    }
  }, title), /*#__PURE__*/React.createElement(PlainSurface, {
    variant: "flat",
    accent: NOOR.border,
    style: {
      borderColor: NOOR.border,
      overflow: 'hidden'
    }
  }, children));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: NOOR.surface
    }
  }, /*#__PURE__*/React.createElement(NoorAppBar, {
    title: "You",
    trailing: /*#__PURE__*/React.createElement(LinkIconButton, {
      icon: "logout",
      size: "md",
      color: NOOR.error
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 16px 16px'
    }
  }, /*#__PURE__*/React.createElement(PlainSurface, {
    variant: "elevated",
    accent: NOOR.brand,
    style: {
      padding: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 360,
      background: `linear-gradient(135deg, ${NOOR.brand}, ${NOOR.primary})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontFamily: NOOR.title,
      fontSize: 26,
      lineHeight: 1
    }
  }, "A"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(BodyM, {
    weight: 700
  }, "Aisha Rahman"), /*#__PURE__*/React.createElement(BodyXS, {
    color: NOOR.fg2
  }, "26-day streak \xB7 Juz 2")), /*#__PURE__*/React.createElement(LinkIconButton, {
    icon: "chevron_right",
    size: "md",
    color: NOOR.fg2
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: '0 0 16px'
    }
  }, /*#__PURE__*/React.createElement(Section, {
    title: "Reading"
  }, /*#__PURE__*/React.createElement(Row, {
    icon: "translate",
    title: "Translation",
    sub: "English \xB7 Sahih International",
    trailing: /*#__PURE__*/React.createElement(LinkIconButton, {
      icon: "chevron_right",
      size: "sm",
      color: NOOR.fg2
    })
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "abc",
    title: "Show transliteration",
    trailing: /*#__PURE__*/React.createElement(Switch, {
      checked: translit,
      onChange: setTranslit
    })
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "play_circle",
    title: "Auto-play next ayah",
    trailing: /*#__PURE__*/React.createElement(Switch, {
      checked: autoplay,
      onChange: setAutoplay
    }),
    last: true
  })), /*#__PURE__*/React.createElement(Section, {
    title: "Recitation"
  }, /*#__PURE__*/React.createElement(Row, {
    icon: "record_voice_over",
    title: "Reciter",
    sub: "Mishary Rashid Alafasy",
    trailing: /*#__PURE__*/React.createElement(LinkIconButton, {
      icon: "chevron_right",
      size: "sm",
      color: NOOR.fg2
    })
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "speed",
    title: "Playback speed",
    sub: "1.0\xD7",
    trailing: /*#__PURE__*/React.createElement(LinkIconButton, {
      icon: "chevron_right",
      size: "sm",
      color: NOOR.fg2
    }),
    last: true
  })), /*#__PURE__*/React.createElement(Section, {
    title: "App"
  }, /*#__PURE__*/React.createElement(Row, {
    icon: "notifications",
    title: "Prayer notifications",
    trailing: /*#__PURE__*/React.createElement(Switch, {
      checked: notif,
      onChange: setNotif
    })
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "dark_mode",
    title: "Dark mode",
    sub: "Follow system",
    trailing: /*#__PURE__*/React.createElement(Switch, {
      checked: dark,
      onChange: setDark
    })
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "favorite",
    title: "Bookmarks",
    sub: "142 saved",
    trailing: /*#__PURE__*/React.createElement(LinkIconButton, {
      icon: "chevron_right",
      size: "sm",
      color: NOOR.fg2
    }),
    last: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement(TonalButton, {
    color: NOOR.error
  }, "Delete account"))));
}
Object.assign(window, {
  SettingsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/SettingsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/components.jsx
try { (() => {
// Noor UI primitives — recreated 1:1 from app.paigham.noor.components.*
// Loads after React + ios-frame.jsx, exports everything to window.

// Semantic tokens resolve to the design-system CSS variables so every
// component follows the global light/dark theme (data-theme on <html>).
// colors_and_type.css defines both light + dark values for each var.
const NOOR = {
  // semantic tokens (theme-aware via CSS custom properties)
  fg: 'var(--color-info-primary)',
  fg2: 'var(--color-info-secondary)',
  fg3: 'var(--color-info-tertiary)',
  surface: 'var(--color-surface-primary)',
  surface2: 'var(--color-surface-secondary)',
  card: 'var(--color-surface-card)',
  border: 'var(--color-neutral-border)',
  inputBg: 'var(--color-input-background)',
  inputBorder: 'var(--color-input-border)',
  inputPlaceholder: 'var(--color-input-placeholder)',
  primary: 'var(--color-action-primary)',
  primaryInv: 'var(--color-action-primary-inverse)',
  secondary: 'var(--color-action-secondary)',
  brand: 'var(--color-neutral-brand)',
  error: 'var(--color-status-error)',
  warning: 'var(--color-status-warning)',
  warningAlt: 'var(--color-status-warning-alt)',
  disabled: 'var(--color-status-disabled)',
  disabledAlt: 'var(--color-status-disabled-alt)',
  // fonts
  title: '"DM Serif Display", Georgia, serif',
  body: '"Nunito", system-ui, -apple-system, "Segoe UI", sans-serif',
  arabic: '"AlQuran IndoPak", "QWBW Surah", serif',
  // radii
  r2xl: 16,
  rxl: 12,
  rlg: 10,
  rmd: 8,
  rcircle: 360
};

// Alpha helper: token values are now var() refs, so hex-suffix alpha
// (e.g. `${NOOR.primary}40`) no longer works — use color-mix instead.
// pct = round(hexAlpha / 255 * 100): 14→8, 1f→12, 40→25, 4d→30, 55→33,
// 80→50, cc→80, dd→87, f5→96.
const A = (c, pct) => `color-mix(in oklab, ${c} ${pct}%, transparent)`;

// ─── Material icon helper ────────────────────────────────
function MIcon({
  name,
  size = 22,
  fill = false,
  color,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-rounded",
    style: {
      fontSize: size,
      lineHeight: 1,
      color: color || 'inherit',
      fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'opsz' 24`,
      userSelect: 'none',
      ...style
    }
  }, name);
}

// ─── Title text components ──────────────────────────────
function TitleH1({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: NOOR.title,
      fontSize: 32,
      lineHeight: '40px',
      letterSpacing: -0.5,
      color: NOOR.fg,
      ...style
    }
  }, children);
}
function TitleH2({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: NOOR.title,
      fontSize: 28,
      lineHeight: '36px',
      letterSpacing: -0.5,
      color: NOOR.fg,
      ...style
    }
  }, children);
}
function TitleH3({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: NOOR.title,
      fontSize: 24,
      lineHeight: '32px',
      letterSpacing: -0.5,
      color: NOOR.fg,
      ...style
    }
  }, children);
}
function BodyM({
  children,
  weight = 400,
  style,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: NOOR.body,
      fontSize: 16,
      lineHeight: '24px',
      fontWeight: weight,
      color: color || NOOR.fg,
      ...style
    }
  }, children);
}
function BodyS({
  children,
  weight = 400,
  style,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: NOOR.body,
      fontSize: 14,
      lineHeight: '20px',
      fontWeight: weight,
      color: color || NOOR.fg,
      ...style
    }
  }, children);
}
function BodyXS({
  children,
  weight = 400,
  style,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: NOOR.body,
      fontSize: 12,
      lineHeight: '16px',
      fontWeight: weight,
      color: color || NOOR.fg,
      ...style
    }
  }, children);
}

// ─── Button ─────────────────────────────────────────────
function FilledButton({
  children,
  size = 'lg',
  onClick,
  disabled,
  leading,
  trailing,
  expanded = true,
  style
}) {
  const sizes = {
    lg: {
      py: 14,
      px: 24,
      fs: 16,
      mh: 48,
      r: 16,
      gap: 8
    },
    md: {
      py: 8,
      px: 16,
      fs: 14,
      mh: 40,
      r: 16,
      gap: 4
    },
    sm: {
      py: 4,
      px: 8,
      fs: 13,
      mh: 32,
      r: 12,
      gap: 4
    }
  }[size];
  const bg = disabled ? NOOR.disabled : NOOR.primary;
  const fg = disabled ? NOOR.disabledAlt : NOOR.primaryInv;
  return /*#__PURE__*/React.createElement("button", {
    onClick: !disabled ? onClick : undefined,
    style: {
      display: expanded ? 'flex' : 'inline-flex',
      width: expanded ? '100%' : 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      gap: sizes.gap,
      padding: `${sizes.py}px ${sizes.px}px`,
      minHeight: sizes.mh,
      borderRadius: sizes.r,
      border: 'none',
      background: bg,
      color: fg,
      fontFamily: NOOR.body,
      fontWeight: 700,
      fontSize: sizes.fs,
      cursor: disabled ? 'default' : 'pointer',
      boxShadow: disabled ? 'none' : `0 10px 22px -8px ${A(bg, 60)}`,
      transition: 'transform 80ms',
      ...style
    }
  }, leading, children, trailing);
}
function TonalButton({
  children,
  size = 'lg',
  color = NOOR.fg,
  contained = false,
  onClick,
  disabled,
  leading,
  trailing,
  expanded = true,
  style
}) {
  const sizes = {
    lg: {
      py: 14,
      px: 24,
      fs: 16,
      mh: 48,
      r: 16,
      gap: 8
    },
    md: {
      py: 8,
      px: 16,
      fs: 14,
      mh: 40,
      r: 16,
      gap: 4
    },
    sm: {
      py: 4,
      px: 8,
      fs: 13,
      mh: 32,
      r: 12,
      gap: 4
    }
  }[size];
  let bg, fg, border;
  if (disabled) {
    bg = A(NOOR.disabled, 30);
    fg = NOOR.disabledAlt;
    border = `1px solid ${NOOR.disabled}`;
  } else if (contained) {
    bg = color;
    fg = '#fff';
    border = 'none';
  } else {
    bg = A(color, 10);
    fg = color;
    border = `1px solid ${A(color, 20)}`;
  }
  return /*#__PURE__*/React.createElement("button", {
    onClick: !disabled ? onClick : undefined,
    style: {
      display: expanded ? 'flex' : 'inline-flex',
      width: expanded ? '100%' : 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      gap: sizes.gap,
      padding: `${sizes.py}px ${sizes.px}px`,
      minHeight: sizes.mh,
      borderRadius: sizes.r,
      border,
      background: bg,
      color: fg,
      fontFamily: NOOR.body,
      fontWeight: 700,
      fontSize: sizes.fs,
      cursor: disabled ? 'default' : 'pointer',
      boxShadow: !disabled && contained ? `0 10px 22px -8px ${A(color, 50)}` : 'none',
      ...style
    }
  }, leading, children, trailing);
}
function LinkButton({
  children,
  color = NOOR.primary,
  size = 'md',
  onClick,
  leading,
  trailing
}) {
  const fs = {
    lg: 16,
    md: 14,
    sm: 12
  }[size];
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      background: 'transparent',
      border: 'none',
      padding: 0,
      fontFamily: NOOR.body,
      fontWeight: 500,
      fontSize: fs,
      color,
      borderBottom: `1px solid ${color}`,
      cursor: 'pointer'
    }
  }, leading, children, trailing);
}

// ─── Icon button (circle) ────────────────────────────────
function FilledIconButton({
  icon,
  size = 'md',
  onClick,
  color = NOOR.primary,
  fg = NOOR.primaryInv,
  style
}) {
  const s = {
    lg: 48,
    md: 40,
    sm: 32
  }[size];
  const i = {
    lg: 24,
    md: 20,
    sm: 16
  }[size];
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      width: s,
      height: s,
      borderRadius: 360,
      border: 'none',
      background: color,
      color: fg,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 12px 26px -10px ${A(color, 70)}`,
      cursor: 'pointer',
      ...style
    }
  }, /*#__PURE__*/React.createElement(MIcon, {
    name: icon,
    size: i
  }));
}
function TonalIconButton({
  icon,
  size = 'md',
  onClick,
  color = NOOR.fg,
  style
}) {
  const s = {
    lg: 48,
    md: 40,
    sm: 32
  }[size];
  const i = {
    lg: 24,
    md: 20,
    sm: 16
  }[size];
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      width: s,
      height: s,
      borderRadius: 360,
      background: A(color, 10),
      color,
      border: `1px solid ${A(color, 25)}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      ...style
    }
  }, /*#__PURE__*/React.createElement(MIcon, {
    name: icon,
    size: i
  }));
}
function LinkIconButton({
  icon,
  size = 'md',
  onClick,
  color = NOOR.fg,
  style
}) {
  const s = {
    lg: 48,
    md: 40,
    sm: 32
  }[size];
  const i = {
    lg: 24,
    md: 20,
    sm: 16
  }[size];
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      width: s,
      height: s,
      borderRadius: 360,
      background: 'transparent',
      color,
      border: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      ...style
    }
  }, /*#__PURE__*/React.createElement(MIcon, {
    name: icon,
    size: i
  }));
}

// ─── Badge ──────────────────────────────────────────────
function Badge({
  children,
  color = NOOR.secondary,
  size = 'lg',
  leading,
  trailing,
  style
}) {
  const py = size === 'lg' ? 4 : 3;
  const px = size === 'lg' ? 10 : 8;
  const fs = size === 'lg' ? 14 : 12;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: `${py}px ${px}px`,
      borderRadius: 360,
      background: A(color, 15),
      color,
      border: `1px solid ${color}`,
      fontFamily: NOOR.body,
      fontWeight: 500,
      fontSize: fs,
      ...style
    }
  }, leading, children, trailing);
}

// ─── Input ──────────────────────────────────────────────
function TextField({
  label,
  value,
  onChange,
  placeholder,
  leading,
  trailing,
  prefix,
  error,
  helper,
  focused: focusedProp,
  disabled,
  type = 'text'
}) {
  const [focused, setFocused] = React.useState(false);
  const f = focusedProp != null ? focusedProp : focused;
  let borderOuter = 'transparent';
  if (error) borderOuter = A(NOOR.error, 50);else if (f && !disabled) borderOuter = A(NOOR.primary, 50);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      width: '100%'
    }
  }, label && /*#__PURE__*/React.createElement(BodyS, {
    weight: 500,
    style: {
      fontSize: 13,
      lineHeight: '18px'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      background: NOOR.inputBg,
      borderRadius: 16,
      border: `1px solid ${borderOuter}`,
      padding: 2,
      minHeight: 46,
      boxSizing: 'border-box',
      opacity: disabled ? 0.6 : 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '11px 16px',
      borderRadius: 14,
      border: `1px solid ${NOOR.inputBorder}`,
      boxSizing: 'border-box'
    }
  }, leading && /*#__PURE__*/React.createElement("span", {
    style: {
      color: NOOR.inputPlaceholder,
      display: 'inline-flex'
    }
  }, leading), prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: NOOR.fg,
      fontFamily: NOOR.body
    }
  }, prefix), /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value || '',
    onChange: e => onChange?.(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    placeholder: placeholder,
    disabled: disabled,
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: NOOR.body,
      fontSize: 16,
      color: NOOR.fg,
      minWidth: 0
    }
  }), trailing && /*#__PURE__*/React.createElement("span", {
    style: {
      color: NOOR.fg2,
      display: 'inline-flex'
    }
  }, trailing))), /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 20,
      marginTop: 2
    }
  }, error && /*#__PURE__*/React.createElement(BodyS, {
    color: NOOR.error,
    style: {
      fontSize: 13,
      lineHeight: '20px'
    }
  }, error), !error && helper && /*#__PURE__*/React.createElement(BodyS, {
    color: NOOR.fg3,
    style: {
      fontSize: 13,
      lineHeight: '20px'
    }
  }, helper)));
}

// ─── Toggles ───────────────────────────────────────────
function Switch({
  checked,
  onChange
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange?.(!checked),
    style: {
      width: 44,
      height: 24,
      borderRadius: 360,
      background: checked ? NOOR.primary : NOOR.inputBg,
      border: `1px solid ${checked ? 'transparent' : NOOR.border}`,
      padding: 2,
      cursor: 'pointer',
      position: 'relative',
      transition: 'background 120ms'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: 2,
      width: 18,
      height: 18,
      borderRadius: 360,
      background: checked ? '#fff' : NOOR.fg,
      transform: `translateX(${checked ? 20 : 0}px)`,
      transition: 'transform 120ms cubic-bezier(.4,0,.2,1)'
    }
  }));
}
function Checkbox({
  checked,
  onChange,
  indeterminate,
  size = 'medium'
}) {
  const containerSize = size === 'large' ? 48 : size === 'small' ? 32 : 40;
  const iconSize = size === 'large' ? 24 : size === 'small' ? 16 : 20;
  const borderColor = checked ? NOOR.primary : A(NOOR.primary, 45);
  const backgroundColor = checked ? NOOR.primary : A(NOOR.primary, 12);
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange?.(!checked),
    style: {
      width: containerSize,
      height: containerSize,
      borderRadius: 360,
      border: `1.5px solid ${borderColor}`,
      background: backgroundColor,
      backgroundClip: 'content-box',
      padding: 3,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxSizing: 'border-box',
      transition: 'background 180ms, border-color 180ms'
    }
  }, checked && /*#__PURE__*/React.createElement(MIcon, {
    name: "check",
    size: iconSize,
    color: "#fff"
  }), indeterminate && !checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: 4,
      background: NOOR.primary
    }
  }));
}

// ─── Surfaces ───────────────────────────────────────────
function PlainSurface({
  children,
  variant = 'default',
  accent = NOOR.primary,
  style
}) {
  const base = {
    default: {
      bg: NOOR.surface,
      border: `1px solid ${A(accent, 30)}`,
      shadow: 'none'
    },
    elevated: {
      bg: NOOR.surface,
      border: `1px solid ${A(accent, 30)}`,
      shadow: `0 12px 28px -12px ${A(accent, 60)}, 0 4px 12px -4px rgba(9,9,11,0.06)`
    },
    subtle: {
      bg: NOOR.surface2,
      border: 'none',
      shadow: '0 4px 12px -8px rgba(9,9,11,0.1)'
    },
    flat: {
      bg: NOOR.surface2,
      border: `1px solid ${NOOR.border}`,
      shadow: 'none'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 16,
      background: base.bg,
      border: base.border,
      boxShadow: base.shadow,
      ...style
    }
  }, children);
}
const GRADIENTS = {
  emerald: {
    c: ['rgba(0,201,80,0.30)', 'rgba(0,150,137,0.20)', 'rgba(0,130,54,0.10)'],
    accent: '#00C950'
  },
  brand: {
    c: ['rgba(201,173,123,0.35)', 'rgba(255,185,0,0.25)', 'rgba(254,154,0,0.15)'],
    accent: '#C9AD7B'
  },
  sapphire: {
    c: ['rgba(20,71,230,0.30)', 'rgba(0,150,137,0.25)', 'rgba(16,78,100,0.15)'],
    accent: '#1447E6'
  },
  coral: {
    c: ['rgba(231,0,11,0.30)', 'rgba(245,73,0,0.20)', 'rgba(254,154,0,0.10)'],
    accent: '#E7000B'
  },
  amethyst: {
    c: ['rgba(173,70,255,0.30)', 'rgba(20,71,230,0.20)', 'rgba(0,201,80,0.10)'],
    accent: '#AD46FF'
  },
  tangerine: {
    c: ['rgba(254,154,0,0.35)', 'rgba(255,185,0,0.25)', 'rgba(201,173,123,0.15)'],
    accent: '#FE9A00'
  }
};
function GradientSurface({
  scheme = 'emerald',
  variant = 'radial',
  children,
  style
}) {
  const g = GRADIENTS[scheme];
  const bg = variant === 'radial' ? `radial-gradient(circle at 30% 20%, ${g.c[0]} 0%, ${g.c[1]} 40%, ${g.c[2]} 70%, transparent 100%), ${NOOR.card}` : `linear-gradient(135deg, ${g.c[0]}, ${g.c[1]}, ${g.c[2]}), ${NOOR.card}`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 16,
      background: bg,
      border: `2px solid ${g.accent}80`,
      boxShadow: `0 16px 32px -14px ${g.accent}66`,
      position: 'relative',
      overflow: 'hidden',
      ...style
    }
  }, children);
}

// ─── Surah list row ─────────────────────────────────────
function SurahRow({
  number,
  name,
  arabic,
  verses,
  juz,
  current
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      borderRadius: 16,
      background: current ? A(NOOR.primary, 8) : 'transparent',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 36 36",
    width: "36",
    height: "36",
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "18,2 32,10 32,26 18,34 4,26 4,10",
    fill: "none",
    stroke: NOOR.brand,
    strokeWidth: "1.4"
  })), /*#__PURE__*/React.createElement(BodyS, {
    weight: 700,
    style: {
      position: 'relative',
      color: NOOR.brand,
      fontFeatureSettings: '"tnum"'
    }
  }, number)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(BodyM, {
    weight: 700
  }, name), /*#__PURE__*/React.createElement(BodyXS, {
    color: NOOR.fg2
  }, "Juz ", juz, " \xB7 ", verses, " verses")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: NOOR.arabic,
      direction: 'rtl',
      fontSize: 22,
      lineHeight: '32px',
      color: current ? NOOR.primary : NOOR.fg
    }
  }, arabic));
}

// ─── Bottom NavBar ──────────────────────────────────────
function NoorNavBar({
  index,
  onChange,
  items
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      background: `color-mix(in oklab, ${NOOR.surface} 78%, transparent)`,
      backdropFilter: 'blur(22px) saturate(180%)',
      WebkitBackdropFilter: 'blur(22px) saturate(180%)',
      borderTop: `1px solid ${NOOR.border}`,
      borderLeft: `1px solid ${NOOR.border}`,
      borderRight: `1px solid ${NOOR.border}`,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: `${index * (100 / items.length)}%`,
      width: `${100 / items.length}%`,
      height: 80,
      pointerEvents: 'none',
      transition: 'left 300ms cubic-bezier(.4,0,.2,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '20%',
      right: '20%',
      top: -18,
      height: 60,
      background: `radial-gradient(ellipse at top, ${A(NOOR.primary, 33)}, transparent 70%)`,
      filter: 'blur(10px)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: 64,
      padding: '6px 0 4px'
    }
  }, items.map((it, i) => {
    const sel = i === index;
    return /*#__PURE__*/React.createElement("button", {
      key: it.label,
      onClick: () => onChange?.(i),
      style: {
        flex: 1,
        background: 'transparent',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: sel ? NOOR.primary : NOOR.disabledAlt,
        gap: 2,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(MIcon, {
      name: it.icon,
      size: 22,
      fill: sel
    }), /*#__PURE__*/React.createElement(BodyXS, {
      weight: 700,
      style: {
        color: 'inherit'
      }
    }, it.label));
  })));
}

// ─── Hazed AppBar ───────────────────────────────────────
function NoorAppBar({
  title,
  leading,
  trailing,
  dark,
  transparent
}) {
  const hazeSurfaceColor = transparent ? 'transparent' : dark ? 'rgba(9,9,11,0.4)' : 'rgba(255, 255, 255, 0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px 10px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: hazeSurfaceColor,
      backdropFilter: transparent ? 'none' : 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: transparent ? 'none' : 'blur(24px) saturate(180%)',
      WebkitMaskImage: transparent ? 'none' : 'linear-gradient(180deg, #000 0%, #000 65%, transparent 100%)',
      maskImage: transparent ? 'none' : 'linear-gradient(180deg, #000 0%, #000 65%, transparent 100%)',
      position: 'relative',
      zIndex: 10,
      height: 56,
      boxSizing: 'border-box'
    }
  }, leading, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      alignItems: 'center'
    }
  }, typeof title === 'string' ? /*#__PURE__*/React.createElement(TitleH3, {
    style: {
      color: dark ? '#fff' : NOOR.fg,
      fontSize: 20,
      fontWeight: 700,
      lineHeight: '26px'
    }
  }, title) : title), trailing && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, trailing));
}

// ─── TabBar (segmented) ─────────────────────────────────
function TabBar({
  index,
  onChange,
  items
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 4,
      background: NOOR.border,
      borderRadius: 16,
      display: 'flex',
      gap: 2,
      position: 'relative'
    }
  }, items.map((it, i) => {
    const sel = i === index;
    return /*#__PURE__*/React.createElement("button", {
      key: it,
      onClick: () => onChange?.(i),
      style: {
        flex: 1,
        padding: '8px 12px',
        borderRadius: 12,
        border: 'none',
        background: sel ? NOOR.primary : 'transparent',
        color: sel ? NOOR.primaryInv : NOOR.disabledAlt,
        fontFamily: NOOR.body,
        fontWeight: 700,
        fontSize: 14,
        cursor: 'pointer',
        transition: 'background 200ms'
      }
    }, it);
  }));
}

// ─── Pager indicator ────────────────────────────────────
function PagerIndicator({
  count,
  current
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center'
    }
  }, Array.from({
    length: count
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      height: 6,
      borderRadius: 360,
      width: i === current ? 28 : 6,
      background: i === current ? NOOR.fg : NOOR.fg2,
      transition: 'width 300ms'
    }
  })));
}

// ─── Logo ───────────────────────────────────────────────
function NoorLogo({
  size = 40
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark.svg",
    width: size,
    height: size,
    alt: "Noor"
  });
}
Object.assign(window, {
  NOOR,
  MIcon,
  TitleH1,
  TitleH2,
  TitleH3,
  BodyM,
  BodyS,
  BodyXS,
  FilledButton,
  TonalButton,
  LinkButton,
  FilledIconButton,
  TonalIconButton,
  LinkIconButton,
  Badge,
  TextField,
  Switch,
  Checkbox,
  PlainSurface,
  GradientSurface,
  SurahRow,
  NoorNavBar,
  NoorAppBar,
  TabBar,
  PagerIndicator,
  NoorLogo
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/ios-frame.jsx
try { (() => {
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports: IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      borderRadius: 48,
      overflow: 'hidden',
      position: 'relative',
      background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 11,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 126,
      height: 37,
      borderRadius: 24,
      background: '#000',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(IOSStatusBar, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
    title: title,
    dark: dark
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      height: 34,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: 8,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 139,
      height: 5,
      borderRadius: 100,
      background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
    }
  })));
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/ios-frame.jsx", error: String((e && e.message) || e) }); }

})();

// ─── OTPInput ─────────────────────────────────────────────────────────────────
// Added to match app.paigham.noor OTP verification screen.
// Props: length {number}, value {string}, activeIndex {number|null}, error {boolean}
// ─────────────────────────────────────────────────────────────────────────────
(() => {
  const N = window.NOOR;
  if (!N || !window.React) return;

  // Inject cursor blink keyframe once
  if (!document.querySelector('#noor-otp-styles')) {
    const s = document.createElement('style');
    s.id = 'noor-otp-styles';
    s.textContent = '@keyframes noor-cursor-blink{0%,49%{opacity:1}50%,100%{opacity:0}}';
    document.head.appendChild(s);
  }

  function OTPInput({ length = 6, value = '', activeIndex = null, error = false }) {
    const cells = Array.from({ length });
    const activeIdx = activeIndex !== null ? Number(activeIndex) : -1;

    // Container border stays constant — only the active CELL gets the green highlight
    const containerBorder = error
      ? '1px solid ' + N.error + '80'
      : '1px solid rgba(255,255,255,0.12)';

    return React.createElement('div', {
      style: {
        display: 'flex',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        border: containerBorder,
        overflow: 'hidden',   // clips cell inset-shadow at rounded corners
        height: 46,
        width: '100%',
      }
    }, cells.map((_, i) => {
      const digit = value ? (value[i] || '') : '';
      const isCellActive = i === activeIdx;
      const last = i === cells.length - 1;

      return React.createElement('div', {
        key: i,
        style: {
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRight: last ? 'none' : '1px solid rgba(255,255,255,0.10)',
          fontFamily: N.body,
          fontSize: 20,
          fontWeight: 500,
          color: '#fff',
          // Active cell: inset green border matching TextField focused treatment
          boxShadow: isCellActive ? 'inset 0 0 0 2px ' + N.primary : 'none',
          background: isCellActive ? 'rgba(0,201,80,0.06)' : 'transparent',
          transition: 'box-shadow 150ms, background 150ms',
        }
      },
      // Show digit, or blinking cursor for the empty active cell
      digit
        ? digit
        : isCellActive
        ? React.createElement('span', {
            style: {
              display: 'inline-block',
              width: 2,
              height: 20,
              background: '#fff',
              borderRadius: 1,
              animation: 'noor-cursor-blink 1s step-end infinite',
            }
          })
        : null
      );
    }));
  }

  Object.assign(window, { OTPInput });
})();
