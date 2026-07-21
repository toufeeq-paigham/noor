# Noor UI/UX Upgrade Decisions

## Program design read

Reading this as a redesign-preserve program for a faith and community mobile product, with a calm, trustworthy, content-first language that continues Noor rather than replacing it.

- Design variance: 4
- Motion intensity: 3
- Visual density: 5
- Canonical frame: 402 x 874

## UX-01: Design-system reconciliation

### Before | After | Why

| Before | After | Why |
| --- | --- | --- |
| A faint informational color was declared as a page-theme override | Register `info-faint` in Noor's semantic token surface and exported manifest | Screens and canvases must consume governed semantics rather than create local theme vocabulary |
| Media scrims and repeated card geometry had no named semantic/component concepts | Add a semantic media scrim plus the shared card-radius token and document both in the token reference | Repeated visual values need one auditable owner and consistent light/dark behavior |
| Several structural Compose icons lived in feature resources while the POC used approximate Material glyphs | Add matching SVG assets and typed `NoorIcon` resources for account, contract, delivery, group, contacts, and Salaah navigation concepts | Shared product structure must render from the same design-system vocabulary on both sides of the parity contract |
| The five-tab POC used generic `group`, `mosque`, and `description` glyphs where Compose already carried more specific artwork | Use `groups`, `mosque_clock2`, `groups_outlined`, and `contract` consistently in the POC and Compose | Exact icon identity is part of pixel parity and also improves scan recognition |

### Icon ownership

- Shared structural icon families are owned by Noor and exposed through typed `NoorIcon` APIs in Compose.
- POC selectors and Compose typed resources now cover the same active structural families.
- `savings` remains a deprecated, unreferenced POC-only legacy asset; Zakaat now uses the shared `money_bag` family.
- Brand artwork, category illustrations, Bismillah artwork, prayer-period imagery, the Qibla Kaaba, and feature empty-state illustrations remain app-owned because they are illustrations rather than reusable UI glyphs.

This reconciliation adds no interaction motion. Icon changes are static and preserve the existing press, navigation, and reduced-motion behavior of their owning components.

## UX-02: Personal Details

### Screen and state inventory

- Empty form
- Field validation errors
- Completed form
- Saving state
- Service failure with retry and dismissal
- Success celebration
- Back to originating journey
- Continue to Home

The approved board contains all six deterministic visual frames. Retry, dismissal, Back, and Home continuation are exercised in the live prototype.

### Before / After / Why

| Before | After | Why |
| --- | --- | --- |
| The ChoiceCard refactor removed the Brother/Sister visual cues to make the radio structure authoritative | Retain the familiar Brother/Sister imagery as a decorative leading visual while the label and typed radio remain the accessible control | The imagery improves recognition and scanning; keeping it decorative prevents platform rendering differences from changing the meaning exposed to assistive technology |
| Gender cards own raw borders, radius, padding, and animation values | Promote the reusable selection-card construction and metrics into Noor | The pattern is reusable and screens should not own component geometry |
| Success tick enters from `scale(0)` with a bouncy low-stiffness spring | Enter from a visible near-final scale with restrained spring or ease-out motion | Nothing should appear from nothing; restrained motion matches Paigham's trust-first character |
| Confetti runs continuously for four seconds and navigation waits five seconds | Use a brief rare-event celebration and provide an immediate explicit Continue action with a short optional auto-advance | The success should feel rewarding without trapping or delaying the user |
| Raw durations, particle colors, icon sizes, and shake amplitude live in the feature | Use Noor motion, icon, feedback, and component metrics | Shared visual behavior must remain token-driven and auditable |
| Validation is visual but the gender cards expose only generic selected/not-selected descriptions | Give the group and options explicit selectable semantics, state, and clear error announcement | Screen readers need the same form structure and recovery path as sighted users |
| The POC skips saving and service failure | Add deterministic saving and failure storyboard states | Noor must specify the full logical journey, not only successful visual states |

### Motion specification

| Interaction | Purpose | Frequency | Motion | Reduced motion |
| --- | --- | --- | --- | --- |
| Gender selection | Feedback and state indication | Occasional | 160-200ms border/background transition; immediate haptic confirmation | Color and state change only |
| Invalid submit | Draw attention to the recovery target | Rare | Short controlled horizontal feedback with inline error | Inline error and focus only |
| Saving | State indication | Once per completion | Stable button loading state; no layout movement | Same loading state |
| Success tick | Confirm completion | Once | Enter near final scale with opacity, settle under 300ms | Opacity only |
| Confetti | Rare celebration | Once | Brief finite burst that never blocks interaction | Omitted |
| Continue/Home | Progression | Once | Immediate action; no decorative delay | Immediate action |

### Design-system impact

- Added the reusable `ChoiceCard` molecule in Noor POC and `core:noor`, using typed radio icons and component-owned metrics.
- Added matching press, quick, standard, emphasized, exit, celebration, success-hold, and easing tokens.
- Registered those CSS tokens in Noor's adherence metadata and exported design-system manifest so the checks recognize them as governed values.
- Added platform-aware reduced-motion resolution to `NoorTheme`; scale, shake, and confetti are removed while essential state feedback remains.
- Celebration colors use existing semantic Noor colors; no feature palette was introduced.

### UX Pro Max checklist

| State | Touch and semantics | Forms and recovery | Theme and layout | Result |
| --- | --- | --- | --- | --- |
| Empty | Back, choices, and primary action meet the mobile target; choices form one radio group | Primary action remains available and validates on tap | Light/dark tokens; safe-area device frame; single-column adaptive form | Pass in Noor; Compose device evidence pending |
| Validation | Error content is adjacent to each field and announced politely | Name and address errors clear independently on edit | No layout overlap at the canonical frame | Pass in Noor; Compose semantics implemented |
| Filled | Selected option exposes checked state | Keyboard Done and outside-tap focus dismissal are supported | Selection uses semantic foreground, border, and tint | Pass in Noor; Compose device evidence pending |
| Saving | Form controls are disabled and selection state remains visible | Primary action exposes a stable loading label/state | No geometry shift | Pass in Noor and source parity |
| Service failure | Failure is an alert dialog with Dismiss and Retry | Entries remain populated; Retry repeats the same intent | Scrim and sheet use Noor surfaces | Pass in Noor and logical source audit |
| Success | Heading and polite live-region semantics; explicit primary action | Continue is immediate and auto-advance is guarded against duplicate navigation | Finite decoration; content remains readable without motion | Pass in Noor and source parity |

### Certification notes

- Noor production build passes and exposes all six states.
- `core:noor` compiles for Android and iOS simulator targets.
- Compose-wide Android compilation and iOS-simulator common tests pass.
- The development APK installs and launches on a Pixel 9 Pro API 36 emulator. Its retained authenticated state opens Home, so route-specific Personal Details device screenshots remain required before closing UX-02.
- The POC's obsolete hash-only pending-masjid return was removed from the parity specification. Compose business navigation was not changed: Back still emits `NavigationEvent.Back`, and successful completion still navigates to `HomeRoute` with the existing stack policy.
- The compile pass also repaired two tracked Dua and Dikhr defects: a mismatched `CompositionLocalProvider` closure and a redundant invalid integer parse.

### Approval status

Implementation authorized by the approved full-program plan. Noor design is implemented; final cross-platform visual certification remains pending.

## UX-03: Home landing and shared five-tab shell

### Design read

The Home shell is the daily-return surface, so it should feel immediate, trustworthy, and information-dense without inventing certainty. The existing prayer-period artwork, restrained glass treatment, and five-tab structure remain authoritative. This slice corrects state communication and shared interaction behavior rather than changing the visual identity.

### Screen and state inventory

- Signed-in Home with calculated, cached, or masjid prayer timings
- Guest and signed-in-without-a-masjid Home using calculated approximate timings
- Five selected tab states
- Light and dark prayer-period treatments
- Reduced-motion navigation and loading treatment
- Qaum initial loading, content, empty, refresh, initial error, append error, retry, and audio-player states
- Guest, no-masjid, notification, sheet, and restoration states remain in the broader UX-03 audit

### Before / After / Why

| Before | After | Why |
| --- | --- | --- |
| Home can greet a user as `Salaam, Dont know` when a backend placeholder reaches the profile | Trim valid names and suppress known placeholder/empty values, falling back to `Salaam` | Internal data placeholders must not become user-facing identity copy |
| Home previously treated signed-out or no-masjid users as timing-unavailable | Keep calculated local timings available immediately, then let cached or authoritative masjid timings replace them | Following a masjid changes the source and iqama accuracy; it is not a prerequisite for useful Salaah timings |
| Dashboard loading could replace already resolved prayer content with a timing skeleton | Keep resolved prayer content and tracking visible while posts or other dashboard data refresh independently | Independent data sources must not erase trusted content that is already available |
| Bottom navigation uses custom click behavior without native tab selection semantics | Expose one selectable group and five `Role.Tab` options with selected state | Assistive technology and keyboard/focus navigation need the same structure sighted users perceive |
| Compose tab icons force one hard-coded tint | Consume the NavBar's selected/inactive `LocalContentColor` | The shared component, not each screen, owns tab-state coloring |
| Nav glow geometry and transition values live as raw implementation details | Move geometry to NavBar metrics and timing/easing to Noor motion tokens | Reusable component behavior must be governed and cross-platform auditable |
| A successful empty Qaum response renders a blank screen | Add an explicit EmptyState explaining where community posts will appear | Empty content is a valid state and must never look like a rendering failure |
| Qaum pull-to-refresh stops its indicator after a fixed 500ms | Bind refresh feedback and sticky-player suppression to Paging's real refresh state | Perceived responsiveness must reflect the actual operation rather than an unrelated timer |
| Qaum errors can expose low-level exception messages | Use calm, actionable recovery copy with a nearby Try again action | Users need a recovery path, not repository or network implementation detail |

### Motion and interaction specification

| Interaction | Purpose | Frequency | Motion | Reduced motion |
| --- | --- | --- | --- | --- |
| Tab selection | State feedback and spatial continuity | Frequent | 160ms ease-in-out indicator travel; selection haptic only when the tab changes | Indicator snaps to the selected tab |
| Qaum initial load | Communicate that community content is being resolved | Once per unresolved load | Branded, token-sized indeterminate loading treatment with no layout shift | Static branded mark with progress semantics |
| Qaum retry | Direct recovery | Occasional | Immediate transition to the loading state; no decorative animation | Same state transition |
| Pull to refresh | Existing content refresh feedback | Occasional | Native pull-to-refresh behavior bound to Paging; content position remains stable | Platform-native reduced-motion handling |
| Audio player docking | Keep playback controls reachable when their post leaves the viewport | During opted-in playback | Existing spatial slide to the nearest edge; transition remains interruptible | Controls appear at the destination without travel |

### Design-system impact

- NavBar now owns typed tab semantics, selected-state haptics, token-driven indicator motion, and component metrics for the glow geometry.
- Added semantic compact, standard, and prominent icon-size tokens plus the shared 20px content-gutter token in Noor POC and Compose.
- Added the missing Noor POC reference for the existing reusable `EmptyState` organism and aligned its icon geometry to the semantic empty-state token.
- Added POC parity for empty-state and illustration sizing tokens already exposed by `core:noor`.
- Home and Qaum consume existing `PromptCard`, `Shimmer`, and `EmptyState` components; no feature palette or one-off status component was introduced.
- Brother/Sister imagery remains supported through `ChoiceCard.leadingVisual`; it is decorative while the label/radio structure remains reusable and accessible.

### UX Pro Max checklist

| Check | Result |
| --- | --- |
| Touch targets and selection semantics | Five tabs use native selection roles; existing NavBar item bounds remain full-width targets |
| Loading, empty, error, retry, and offline resilience | Home retains calculated/cached timings; Qaum now has explicit loading, empty, generic error, and retry states |
| Trust-sensitive content | No fabricated prayer times or backend placeholder identity copy remains in the audited path |
| Theme and contrast | Existing semantic Noor colors are retained; selected/inactive icon tint now follows component state |
| Dynamic text and adaptive layout | Shared shell remains under source audit; paired small/large/tablet evidence is still required |
| Reduced motion | Tab travel snaps and shimmer becomes static while status semantics remain |
| Safe areas and system bars | Existing scaffold/inset ownership is unchanged; device evidence remains required |

### Certification notes

- Obsolete `#home-loading` and `#home-timings-error` frames were removed because the normal Home flow begins with usable calculated or cached timings.
- Existing frame indices 0-30 and their deep links remain stable; Qaum loading, empty, and error states are appended at 31-33.
- Compose business routes, repositories, analytics-sensitive actions, tab order, and navigation labels were not changed.
- Qaum refresh feedback now follows the Paging load state instead of a fixed timer, and its successful empty response is no longer visually blank.
- Per the current verification agreement, Compose simulator/device execution is delegated to the user. Paired screenshots remain required before closing this slice.

### Approval status

Shared shell and Home data-state implementation is in progress. Qaum, Salaah, Profile, persistence, and full adaptive certification remain open under UX-03. The Quran tab and reader lifecycle are implemented under UX-04 below.

## UX-04: Quran index and reader

### Design read

The Quran journey is a reading tool, not a decorative content page. Noor's Arabic type, flat ayah rhythm, restrained dividers, sticky Surah context, and compact index rows remain authoritative. The upgrade focuses on dependable state communication, readable scaling, and predictable navigation rather than adding ornamental surfaces.

### Before / After / Why

| Before | After | Why |
| --- | --- | --- |
| Surah and Juz fetches share one loading flag | Each index owns `Loading`, `Content`, `Empty`, and `Error` status | One request can no longer hide the unresolved or failed state of the other tab |
| Empty and failed index requests remain on an indefinite shimmer after error dismissal | Add calm inline empty/error explanations and a nearby Try again action | A recoverable failure must not look like endless work |
| Reader loading width is calculated from raw window pixels and converted to dp | Use Noor's semantic small-illustration token | Geometry remains stable, adaptive, and design-system owned |
| Reader failures depend only on a transient sheet | Keep index metadata errors in the existing persistent sheet, but give ayah-content failure a stable inline retry state | The user retains context and can recover after dismissals or restoration |
| Arabic reader bounds and step values live as feature constants | Add min, default, max, and step values to Noor Arabic typography tokens | Reader typography policy is shared, testable, and no longer screen-owned |
| POC route changes travel for 350ms with a local easing curve | Use Noor's 220ms standard motion and shared ease-out token | The transition feels responsive and follows reduced-motion policy |
| Selecting a Surah or Juz row replaces its calligraphy with an unrelated route slide | Carry the selected Surah calligraphy into the reader app bar with a stable mode, Juz, and Surah identity | The morph explains exactly which reading context opened without animating the sacred text or the full high-frequency reader |

### Motion specification

| Interaction | Purpose | Frequency | Motion | Reduced motion |
| --- | --- | --- | --- | --- |
| Surah/Juz tab change | Spatial continuity | Frequent | Existing interruptible pager motion | Page changes without decorative travel |
| Index/reader data-state change | Explain resolved state | Occasional | Standard `AnimatedContent`; no content reflow choreography | Immediate state replacement |
| Board route change | Spatial progression | Occasional | 220ms horizontal/opacity ease-out | Shared CSS token resolves to 1ms |
| Selected Surah calligraphy to reader title | Preserve selected reading context | Occasional | Shared-bounds morph using the emphasized Noor timing and ease-out; the surrounding route does not slide concurrently | Immediate title replacement with no positional travel |
| Reader settings sheet | Preserve reader context | Occasional | Existing Noor sheet transition | Sheet appears without travel |
| Arabic size step | Immediate reading feedback | Occasional | No animation; typography updates in place | Same behavior |

### Design-system and UX checklist

- Arabic size policy is owned by `ArabicTypography`; reading text still honors platform font scale.
- Loading treatments expose indeterminate progress semantics and use the semantic illustration size.
- Surah rows use stable IDs; ayah rows already use stable Surah/key pairs.
- Empty and error states use the shared `EmptyState`, typed Noor icons, semantic status colors, and full-size retry controls.
- Existing sticky Surah/Juz context, translation preferences, transliteration preferences, Back behavior, and deep-link parameters are preserved.
- Selected calligraphy uses stable Surah or Juz-plus-Surah identity; the surrounding route slide is suppressed while the shared title morph runs, and reduced motion replaces it immediately.
- Compose carries the root Navigation 3 animated scope through the nested Home tab so the match follows root destination lifecycle and predictive Back rather than the tab pager lifecycle.
- Quran audio was not invented: there is no Quran audio/reciter repository, service, route contract, or approved Noor behavior in the current application. It remains a documented product-capability exception rather than a false visual control.

### Certification notes

- Noor exposes nine deterministic journey states plus Quran-tab loading, empty, and error frames at stable appended indices 34-36.
- Noor production build passes and the live `#reader-error` DOM exposes the alert and Try again action.
- Compose Android compilation passes after the state and typography-token changes.
- Final paired light/dark and adaptive device screenshots remain delegated to the user's end-of-sprint verification pass.

## UX-03 completion: Salaah, Profile, nudges, and shell behavior

| Before | After | Why |
| --- | --- | --- |
| A signed-in account with incomplete identity can collapse into Guest presentation | Preserve signed-in pending identity and use a neutral name fallback | Authentication and onboarding are different facts and must not be visually conflated |
| Home can replace available local/cached timings while unrelated dashboard data loads | Prayer content remains independently available while posts or prompts refresh | Independent loading must not erase already useful daily information |
| Permission and sign-in nudges compete without a single state interpretation | Preserve the existing nudge coordinator and certify precedence, dismissal, and recovery as one shell concern | Only one clear next action should demand attention at a time |
| Tab state and refresh feedback use implementation-timed behavior | Bind selected state, refresh, restoration, and player docking to the underlying navigation/data state | Feedback should report actual work and survive interruption |

Motion remains restrained: frequent tab changes use the shared quick token, loaders do not shift geometry, sheets use the emphasized token, and reduced motion snaps state while retaining feedback. Source behavior is complete; timing on physical permission prompts remains in the consolidated device pass.

## UX-03 five-tab visual parity pass — 2026-07-21

### Design read and dials

This remains a redesign-preserve pass: the prayer-period artwork, emerald action language, glass shell, serif/body pairing, and compact community/faith utility rhythm stay authoritative. The supplied Android captures were normalized to the same visible device height as Noor before judging layout. Working dials remain `DESIGN_VARIANCE: 4`, `MOTION_INTENSITY: 3`, and `VISUAL_DENSITY: 5`.

### Before / After / Why

| Before | After | Why |
| --- | --- | --- |
| Home had no Noor state for the supplied screenshot where prayer times are ready but Salaah tracking is still resolving | Add `#home-tracking-loading`; only tracking count, controls, and labels use fixed-geometry skeletons while prayer times and Follow a Masjid remain usable | Loading one independent source must not erase or destabilize already trusted daily content |
| Pending signed-in Profile could only be compared against the default named/masjid frame | Add `#profile-pending` with `Paigham User`, retained phone number, no My Masjids row, and signed-in account actions | Pending onboarding is not Guest state, and the exact state now has a Noor source of truth |
| Quran's POC stopped at seven sample rows, before bottom-navigation overlap could be assessed | Extend the deterministic sample through Surah 9 while retaining the same ListRow component | The parity frame must exercise real list continuation and bottom content insets, not end early because of fixture size |
| Compose Profile setting rows used a 64dp feature metric while Noor `.prow` resolves to the 56dp setting-row rhythm | Set the Compose Profile row metric to 56dp | Restores Noor's density and prevents the settings stack/footer from drifting vertically |
| Quran TabBar and ListRow geometry remained embedded as raw implementation details | Move both geometries into Noor component metric objects; use Noor quick motion/easing and snap under reduced motion | Reusable cross-screen geometry and motion must be governed by the design system rather than each consumer |
| Supplied screenshots were treated as proof despite predating source repairs | Preserve them as baseline evidence and require fresh captures from the current build for closure | Pixel parity can only be certified against the code being reviewed |

### Motion and interaction specification

| Component | Purpose | Motion | Interruption | Reduced motion |
| --- | --- | --- | --- | --- |
| Bottom NavBar | Selected-tab feedback and continuity | Noor quick duration and ease-in-out, with selection haptic only on an actual change | A new tab selection retargets immediately | Indicator snaps |
| Quran TabBar | Explain Surah/Juz state change | Noor quick duration and ease-in-out | A new selection retargets the indicator | Indicator snaps |
| Home tracking placeholder | Communicate independent loading without reflow | Compose shimmer may run only while unresolved; Noor reference is deliberately static | Resolution replaces placeholders in place | Static placeholders with progress semantics |
| Follow-masjid sheet | Preserve spatial relationship to the invoking nudge | Existing emphasized sheet transition | Dismiss/Back remains available and immediate | Appears without decorative travel |

### UX Pro Max result

- Five navigation destinations retain icon plus text labels, native selection semantics, full-width targets, and safe-area ownership.
- List and sheet content reserve the bottom-bar inset; the extended Quran fixture now makes overlap visible in the reference frame.
- Light and dark Noor frames were captured independently at the canonical 402 x 874 device frame.
- Semantic tokens remain authoritative for color and shared spacing; off-ladder ListRow geometry is isolated inside component metrics.
- Fresh Compose captures are still required for dynamic type, reduced motion, actual system-bar adaptation, and the final pixel overlay.

## UX-05: Masjid discovery, registration, and claim

### Before / After / Why

| Before | After | Why |
| --- | --- | --- |
| Explorer continuation depends on a broad user subtype | Branch on the actual invariant: whether the signed-in user has a primary masjid | Only a missing primary masjid requires the Personal Details setup detour |
| Guest selection is lost at authentication and duplicate selections can request another follow | Persist the pending masjid ID through sign-in and treat already-followed masjids as complete | Selection intent must survive authentication and repeated actions must be idempotent |
| Location and scanner denial can end in a blank or non-recoverable state | Show calm retry/open-settings recovery and keep map, pincode, and QR paths logically equivalent | Permissions are recoverable product states, not terminal errors |
| Pincode and claim failures can masquerade as empty results | Restrict pincode input, keep loading factual, and return failed claim search to a retryable query state | Empty means the request succeeded with no data; it must never hide failure |
| Registration update route is not registered for saved-state restoration | Serialize the update route alongside all other registration routes | Process restoration must not strand an in-progress correction |
| Camera completion checks a Unit/event result instead of captured bytes | Use the ready camera controller and pass the actual captured bytes | Review and upload must receive the image the user approved |
| Review timing varies between one-to-two and two-to-three days | Use “2–3 working days” in Noor and Compose | Trust-sensitive operational copy must be consistent |

### UX and motion specification

- Map markers, result rows, Follow, and Done retain at least platform target sizes and typed semantics.
- Loading, empty, denied, blocked, error, retry, following, already-followed, and success are distinct states.
- Scanner motion explains the active scan only; it is static under reduced motion. Registration paging uses the standard Noor duration and snaps when reduced.
- The canonical flow is: no primary masjid → select → Personal Details → update profile → follow selections → refresh user → complete setup. With a primary masjid, selection follows immediately.

### Supplied-capture keyboard and registration-alignment repair — 2026-07-21

The Noor registration board already defines every wizard body at the top of the scrollable content region, directly below Back, progress, and the step label. The supplied iOS capture identified a Compose pager-default mismatch and a shared numeric-keyboard escape problem; it does not authorize a new registration layout.

| Before | After | Why |
| --- | --- | --- |
| Compose vertically centers short Masjid registration pages inside each pager page | Explicitly align every pager page to the top, matching Noor and the phone/OTP reading order | The title, explanation, and first task should appear immediately after progress instead of floating in the lower half of the screen |
| Numeric keyboards can cover the Zakaat step action or provide no iOS dismissal key | Keep wizard/navigation actions above the IME and expose Done for numeric fields | Progress must never depend on a keyboard layout that may omit Return or Done |
| Focus can remain trapped until a field or action is found | Clear focus on Next/primary actions and when a tap lands on otherwise non-interactive screen space | Dismissal becomes predictable without stealing gestures from buttons, fields, sheets, maps, or scroll regions |
| Multi-field manual registration has no explicit IME sequence | Use Next through name, address, and city; use Done on the final state field and the single-field contact/pincode pages | The keyboard communicates the next useful action and preserves field order |

The action remains visually stable and uses existing Noor geometry. No route, validation rule, field order, business contract, palette, typography, or motion value changes.

## UX-06: Islamic content and tools

### Before / After / Why

| Before | After | Why |
| --- | --- | --- |
| Sehri permission handling redispatches the same transient request and disabled services can remain loading | Request permission once through the controller, fall back safely when services are off, and expose stable error/retry | Permission effects must terminate and every unresolved state needs recovery |
| Sehri contact action dismisses without opening the call target | Open the `tel:` target and then dismiss | The visible action must perform the promised behavior |
| Qibla AR can appear from stale location when camera permission is missing | Require current location plus location and camera permission; add denied and services-off Noor frames | Sensor guidance must reflect actual capability, not stale data |
| Asma can flash content state before loading and has no stable empty presentation | Begin in loading, add explicit empty state, stable keys, and reduced-motion detail navigation | Collection state must be deterministic and restoration-friendly |
| Hijri derives loader geometry from raw window pixels and always animates pager return | Use Noor semantic geometry/colors and snap under reduced motion | Calendar structure must adapt without screen-owned visual constants |
| Zakaat briefly reports empty before collection and gesture hints own raw timing | Enter loading first and use Noor gesture motion tokens with a reduced-motion alternative | Empty must be truthful and instructional motion must be governed |
| Dua category changes always travel | Preserve the pager relationship but snap when reduced motion is requested | Spatial continuity is useful only when motion is welcome |

### Dua & Dikhr design read and state specification — 2026-07-21

This is a redesign-preserve pass for a high-frequency devotional reader. Noor's calm serif hierarchy, emerald actions, compact information density, Arabic reading treatment, and pinned navigation remain authoritative. The working dials remain `DESIGN_VARIANCE: 4`, `MOTION_INTENSITY: 3`, and `VISUAL_DENSITY: 5`.

| Before | After | Why |
| --- | --- | --- |
| Five happy-path frames imply gradients where the app has real category imagery | Sixteen deterministic frames use the same twelve WebP assets and stable slugs as Compose | The approved POC must specify real hierarchy and every consequential state, not a visual approximation |
| Categories and chapters duplicate page-local card/row CSS | Add matching Noor `MediaTile` and `ListRow.emphasized` references and consume them in the journey | Reusable geometry, scrims, typography, and press feedback belong to the design system |
| Favourites has only an empty state | Specify empty and populated saved-dua states with stable item identity | The tab must remain testable after the first favourite is added and after restoration |
| Loading is implied and errors are absent | Add final-shape grid/list/reader loading plus persistent retry sheets for categories, chapters, reader, and audio | Loading, successful empty, and failure are different truths and require different recovery |
| Reader favourite/share actions are small glyph hit areas and Share is inert | Use labelled full-size icon buttons and wire the POC share callback | Frequent actions must be discoverable, reachable, and behaviorally represented |
| Audio play/close targets are 26px/20px and the waveform has no range semantics | Keep 24px glyphs inside 48px targets and expose waveform progress semantics | Visual compactness cannot come at the cost of touch or assistive access |
| Route movement uses a raw 350ms duration in both directions | Use Noor standard entry, faster exit, and no positional travel under reduced motion | Motion explains navigation without making repeated reading feel slow |
| Chapter selection loses its spatial identity when the reader replaces the list | Carry the selected chapter title into the reader app bar with a stable chapter identifier | The transition explains where the reader came from without animating the full high-frequency content surface |

#### Motion specification

| Interaction | Purpose | Timing / easing | Interruption | Reduced motion |
| --- | --- | --- | --- | --- |
| Forward/back route handoff | Preserve hierarchy and direction | Standard enter; faster exit; Noor ease-out | A new route replaces the current transition | No positional travel |
| Category label to Chapters title | Preserve the selected category's identity across destinations | Native shared-bounds/view transition with Noor emphasized timing and ease-out | Back or a new destination retargets the platform transition | Immediate title replacement with no bounds travel |
| Chapter row title to reader title | Preserve spatial continuity into the selected devotional reader | Native shared-bounds/view transition with Noor emphasized timing and ease-out | Back or a different route retargets immediately | Immediate title replacement with no bounds travel |
| Category tab pager | Preserve spatial relationship between Du'a and Favourites | Noor quick/standard pager behavior | New selection retargets immediately | Snap to page |
| Audio dock | Prevent a jarring overlay appearance | Standard enter, faster exit | Close or new playback retargets immediately | Fade/no travel |
| Loading | Communicate unresolved data | Static final-shape reference; Compose shimmer only while unresolved | Resolution replaces geometry in place | Static placeholders with progress semantics |

The POC changes no route, repository contract, favourite behavior, deep-link identity, Arabic content, or playback contract. Device audio, native share, largest text, and final screenshot overlay remain part of the delegated evidence pass.

### Asma ul Husna design read and state specification — 2026-07-21

This is a redesign-preserve pass for a devotional reference collection. The six Noor gradient schemes, Arabic-first tile hierarchy, calm serif app bar, emerald actions, and swipeable detail presentation remain authoritative. The working dials remain `DESIGN_VARIANCE: 4`, `MOTION_INTENSITY: 3`, and `VISUAL_DENSITY: 5`. A product review removed search and approved an in-context detail overlay modeled on Qaum's media viewer.

| Before | After | Why |
| --- | --- | --- |
| The POC claims a 99-name collection but contains only 18 records | Use the same complete 99-name corpus, numbering, transliteration, and meanings as Compose | The approved design specification must be logically complete, not a partial visual sample |
| Search adds a second task to a deliberately contemplative collection | Remove search and keep the complete numbered grid as the sole entry surface | The collection remains quiet, direct, and aligned with the approved product intent |
| Detail navigation replaces the collection after a tile is chosen | Present a modal detail carousel over a semantic scrim while the grid remains visibly behind it | Context is preserved, dismissal is obvious, and the interaction matches the established Qaum media-detail model |
| The POC has three happy-path frames and no truthful unresolved or recovery states | Specify seven deterministic loading, all-names, unavailable, error/retry, and first/middle/last overlay states | Loading, successful absence, failure, and detail boundaries remain different truths without obsolete search states |
| Tiles omit their sequence number and expose pointer behavior on non-semantic containers | Add a quiet number label and a full-card button label containing number, transliteration, and meaning | Sequence becomes visible while the Arabic name remains dominant and assistive navigation gets useful context |
| Compose detail can initialize with an empty collection or an out-of-range deep-link index | Gate the pager behind loading/availability and clamp route indices before pager creation | A malformed or early deep link must not produce invalid pager state |
| Detail text is fixed inside a proportional card | Keep the visual card proportions but allow its content to scroll under large text | Dynamic text must remain readable without breaking navigation geometry |
| Shared-bound motion remains active when reduced motion is requested | Skip shared-bounds travel, stop shimmer, and snap detail paging under reduced motion | Meaning and hierarchy remain intact without positional or continuous motion |

#### UX Pro Max checklist

- Back, close, previous, next, retry, and tile actions meet the platform target contract.
- Tapping the scrim, the explicit Close action, or system Back dismisses the modal without changing the collection route.
- Loading reserves final grid geometry; source-empty and recoverable error remain distinct.
- Grid identity uses the divine-name number, and carousel paging retains the original collection index.
- Noor auto-fit tiles and Compose `GridCells.Adaptive` preserve three canonical columns while adding columns on wider layouts.
- Status/navigation insets remain owned by the shared app bar and overlay controls.
- Tile semantics announce number, transliteration, and meaning; decorative Arabic duplication is suppressed in the POC.
- The modal is announced as a detail pane, hides the background collection from accessibility while active, and traps touch interaction above the scrim.
- Detail content remains scrollable for dynamic text, and light/dark colors come only from Noor gradient and semantic roles.
- The collection is bundled local content, so there is no separate offline state; unexpected loading failure uses the persistent retry path.

#### Motion specification

| Interaction | Purpose | Timing / easing | Interruption | Reduced motion |
| --- | --- | --- | --- | --- |
| Grid tile to overlay card | Preserve the selected tile's spatial identity while retaining collection context | Noor emphasized duration with existing shared-bounds spatial easing; scrim uses standard fade | Close, Back, or a new selection retargets immediately | Shared-bounds travel is omitted and the overlay appears without positional motion |
| Detail swipe / previous / next | Explain sequence within the 99 names | Noor emphasized duration and ease-out | A new swipe or control action retargets the pager | Snap to the destination page |
| Tile and control press | Confirm direct manipulation | Noor press timing; immediate haptic feedback in Compose | Release or state change ends feedback | Static state change only |
| Loading grid | Communicate unresolved bundled content in final geometry | Noor shimmer while unresolved | Loaded, empty, or error replaces placeholders in place | Static placeholders with loading semantics |

The redesign changes no route name, repository contract, Arabic corpus, deep-link format, or navigation order. The existing detail destination remains as a compatibility entry and renders the same grid-plus-overlay composition. Canonical light/dark and adaptive device screenshots remain the final parity gate.

All six journeys preserve their current brand illustration, information architecture, calculation logic, repositories, and route contracts. Physical compass, camera, location, audio, and adaptive-layout evidence is intentionally grouped into the final device pass.

### Zakaat saved-record continuity — 2026-07-21

The saved-record journey remains calm, accounting-led, and moderately dense. The card and summary keep Noor's existing surface, serif-title, emerald-result, and tabular breakdown language; the transition explains selection without animating repeated form fields or the calculation itself. The working dials remain `DESIGN_VARIANCE: 4`, `MOTION_INTENSITY: 3`, and `VISUAL_DENSITY: 5`.

#### Before | After | Why

| Before | After | Why |
| --- | --- | --- |
| A saved Zakaat row opens its summary in Compose but is not actionable in Noor | Make the full Noor row keyboard- and pointer-actionable while keeping Edit independent | Noor must specify the same route logic and accessible action hierarchy as the product |
| The selected saved record loses its identity during the list-to-summary route replacement | Morph the stable record card bounds into the Zakaat Due hero using the saved record ID | The summary is a different composition of the same record, so a restrained container transform explains continuity |
| Loading can delay repository-backed summary content until after navigation | Carry only the selected due amount as display metadata so the target hero exists immediately; repository data remains authoritative | A shared target must be present during the route transition without changing persistence or calculation contracts |

#### Motion and interaction specification

| Interaction | Purpose | Motion | Interruption | Reduced motion |
| --- | --- | --- | --- | --- |
| Saved card to due hero | Preserve record identity across Navigation 3 destinations | Shared bounds with Noor emphasized spatial spring; source details exit while the due hero enters | Back, predictive Back, or another navigation retargets immediately | Immediate destination replacement with no bounds travel |
| Edit | Directly enter the existing calculation editor | Existing route transition; no shared element | Navigation dispatch prevents duplicate actions | Immediate replacement |
| Swipe delete | Reveal a destructive action without confusing it with summary navigation | Existing tokenized gesture hint and direct drag | Drag reversal remains direct; confirmation owns completion | No automated hint travel |

No calculation, repository, deletion, deep-link, route-order, or saved-record identity behavior changes. The optional transition amount is display-only and is replaced by repository data when loading completes.

### Qaum media continuity — 2026-07-21

Qaum remains a moderately dense community feed. Author identity, message copy, reactions, timestamps, audio, and the bottom navigation stay visually subordinate to post media. Opening an image preserves the feed behind a Noor scrim, removes the bottom navigation from the active interaction layer, and expands only the selected media. The working dials remain `DESIGN_VARIANCE: 4`, `MOTION_INTENSITY: 3`, and `VISUAL_DENSITY: 5`.

#### Before | After | Why

| Before | After | Why |
| --- | --- | --- |
| Compose opens post imagery inside a platform `Popup`, while Noor has no image-detail state | Specify one feed-backed semantic media overlay in Noor and keep the Compose viewer in the same Compose tree as its thumbnail | `Popup` is an unsupported shared-element boundary and the POC must define the visible and logical target state |
| The image viewer appears independently of the thumbnail that launched it | Match the selected image using the stable post ID plus media index, with the same image model on both ends | Only the selected media changes scale; preserving its identity makes the overlay spatially understandable |
| The full-screen viewer owns raw drag and sizing values and keeps shell navigation interactive underneath | Move viewer geometry into component metrics, hide background semantics, suppress the bottom navigation while open, and retain safe-area controls | Immersive content needs one interaction layer, token ownership, and reachable dismissal on every device |
| Paging away from the origin can still imply that a different image should return to the original thumbnail | Enable the shared match only while the origin page remains selected | A shared transition must never claim false identity after carousel paging |

#### UX Pro Max checklist

- The source image is one named button; the detail surface is a modal pane with an explicit 48dp/44pt-compatible Close action.
- Feed and app-bar semantics are hidden while the modal is open, and the scrim consumes background interaction.
- The bottom navigation is absent only during the immersive viewer and returns with the feed state intact.
- Source and target use the same image URL/cache identity and descriptive text exists only in the expanded viewer.
- Close, system Back, scrim tap, vertical dismissal, pager position, safe areas, light/dark colors, dynamic text, and reduced motion remain explicit verification states.
- Missing or removed paging content dismisses safely rather than retaining an invalid post/media index.

#### Motion and interaction specification

| Interaction | Purpose | Motion | Interruption | Reduced motion |
| --- | --- | --- | --- | --- |
| Thumbnail to viewer | Preserve the selected post-media identity | Shared media element with Noor spatial bounds, explicit rounded overlay clip, and scrim fade | Close or Back immediately retargets to the source; rapid taps cannot open duplicate viewers | No bounds or positional travel; the modal state replaces immediately |
| Horizontal paging | Explain movement within one post's media collection | Existing interruptible pager behavior | A new drag takes over directly | Pager snaps without animated travel |
| Vertical drag | Direct manipulation for dismissal | Content follows the finger; an incomplete drag settles with the Noor spatial spring | Reversing the drag remains direct | Content follows the finger and resets immediately when below threshold |
| Close / scrim / Back | Provide redundant, predictable dismissal | Shared return only when the origin image is still selected; otherwise a short semantic fade | First dismissal wins and restores shell interaction | Immediate dismissal |

No feed, paging-source, reaction, share, audio, repository, backend, analytics, or top-level navigation contract changes.

### Sehri supplied-capture repair pass — 2026-07-21

The supplied light/dark captures confirm that the map-first structure, native map treatment, serif headings, emerald actions, and compact provider metadata remain the right design direction. The repair keeps that identity while removing unstable text motion and making loading, empty, and failure states part of the same spatial journey. The working dials remain `DESIGN_VARIANCE: 4`, `MOTION_INTENSITY: 3`, and `VISUAL_DENSITY: 5`.

#### Before | After | Why

| Before | After | Why |
| --- | --- | --- |
| Provider names and addresses use continuous marquees, so captures can show missing beginnings or endings | Use stable single-line text with a reserved ribbon column and deterministic ellipsis | Users should be able to scan provider identity immediately; frequent decorative motion must not be required to read content |
| The service ribbon can cover long titles and addresses | Reserve component-owned width for the ribbon in both title rows | Long real-world provider data must never sit behind another control |
| The peek sheet is sized from an oversized content estimate | Size populated, empty, and error detents independently through component metrics | The map remains useful while one complete card and its actions stay visible |
| Empty copy sits directly on a translucent map sheet and map labels show through it | Place the empty explanation on an opaque Noor surface with a Sehri-specific delivery icon | Empty guidance must remain legible regardless of the native map underneath |
| A provider-data failure replaces the entire map with a blank error page | Keep the last map position and show a stable retry card in the persistent sheet | The map did not fail; preserving spatial context makes retry and recovery less jarring |
| Nearby searches append old areas indefinitely | Replace the result set for the current map area, retain selection only when it still exists, and clear markers on a true empty result | The visible count, markers, list, and empty state must all describe the same search area |
| The POC hard-codes ten results while its fixture and Compose response contain different counts | Derive the heading from the visible collection | Trust-sensitive location results must never claim providers that are not present |

#### Screen-state and UX checklist

- Eight Noor states cover Home entry, system permission, initial loading, two map selections, expanded list, successful empty, and recoverable error.
- Back, map/list toggle, location, call, directions, retry, card selection, and pager dots retain full touch targets and named semantics.
- Initial loading reserves the resolved sheet geometry; refresh with existing content keeps the last useful map position.
- Empty and error are distinct: empty means a successful search with zero providers, while error retains an explicit retry.
- Light/dark surfaces, semantic foregrounds, native safe areas, and the persistent sheet remain token-driven. The native map renderer is an approved platform visual exception.

#### Motion and interaction specification

| Interaction | Purpose | Motion | Interruption | Reduced motion |
| --- | --- | --- | --- | --- |
| Card/page selection | Spatial continuity between provider card and marker | Existing Noor standard pager transition | A new marker or page retargets immediately | Page snaps to the selected provider |
| Map/list change | Explain a change in information density | Short fade owned by the sheet | Dragging or another toggle takes over immediately | Content switches without a fade |
| Sheet detent | Preserve map-to-list spatial relationship | Existing interruptible Noor persistent-sheet motion | Dragging remains direct and reversible | Platform sheet resolves without decorative travel |
| Provider text | None; movement is unnecessary | No marquee or automatic text animation | Not applicable | Stable ellipsis is identical |

No new palette, typography family, route, repository contract, or feature-owned motion value is introduced.

## UX-07: Masjid operations

### Noor specification

The new `masjid-operations/Masjid Operations.dc.html` route defines 30 deterministic states for Admin, Members, Invitations, Create Post, Post Verification, Post Administration, and Salaah Configuration. It uses the existing Noor palette, typography, surfaces, controls, spacing, icon language, scrim, and motion tokens; it does not introduce a parallel operations theme.

| Before | After | Why |
| --- | --- | --- |
| Compose-only administration journeys have no Noor source of truth | Add a seven-group Noor board covering content and all operational states | Compose-only surfaces still require an approved, inspectable design specification |
| Several failed loads rely only on a transient error sheet and can leave an empty-looking body | Keep a stable inline explanation and Try again action for Admin, Invitations, Posts, and Salaah settings | Recovery must remain available after a sheet is dismissed or state is restored |
| Role denial and network failure can share one generic locked presentation | Keep committee restriction explanatory; show retry only when an existing member's data failed | Authorization and connectivity require different next actions |
| Recording feedback pulses with a local duration forever | Use Noor motion/easing and render a steady live indicator under reduced motion | This rare, purposeful feedback should be governed and accessible |
| Shared illustration and icon containers use repeated feature sizes | Consume Noor semantic empty-state and prominent-icon sizing | Repeated component geometry belongs to the design system |

Destructive actions retain explicit confirmation, action-in-progress states remain disabled, role checks remain server-enforced, list keys remain stable, and no backend or analytics contract was changed.

## UX-08: Shared recovery

| Before | After | Why |
| --- | --- | --- |
| Web content has no visible progress or stable main-frame failure state | Show semantic progress plus a main-frame error explanation and Retry | Embedded policy/help content must never look frozen or blank |
| Toolbar Back always exits the route | Navigate within web history first, then leave the route | Back should follow the user's visible navigation history |
| Shared failures depend primarily on transient presentation | Preserve sheets/snackbars for immediate feedback and add stable recovery where the screen can remain unresolved | Transient feedback and durable recovery solve different needs |

The final source certification is build- and test-backed. Pixel, dark-mode, dynamic-text, physical permission, camera, location, and sensor evidence remains one consolidated user-run verification pass by agreement.

## UX-02 / UX-03 supplied-capture repair pass — 2026-07-21

### Before / After / Why

| Before | After | Why |
| --- | --- | --- |
| The Personal Details saving frame placed progress inside the Complete Setup button | Place a shared `InlineLoadingStatus` in the screen directly above the fixed bottom bar; keep the button label and bounds unchanged while disabling repeated submission | Progress stays visible and consistent with phone/OTP without changing the navigation surface or making the primary action visually jump |
| Filled action text used pale green-on-green semantic pairs with insufficient contrast | Both themes map `action-primary-inverse` to Noor Jet Black | The primary action now keeps Noor's emerald identity while meeting readable text/icon contrast |
| Quran row metadata and revelation place used the faint informational color | Metadata now uses `info-secondary` in Noor and Compose | The supplied light and dark captures exposed low contrast in supporting Quran information |
| The onboarded Profile capture had a primary masjid but no reusable path to the user's masjids | Compose adds the Noor `My Masjids` row only when a primary masjid exists; pending Profile remains unchanged | The row is part of Noor's onboarded Profile contract and must not appear during incomplete setup |
| One Qaum capture initially appeared to show only three bottom-navigation destinations | Full-resolution inspection confirms all five destinations are present; no source change is required | Evidence must be inspected at native resolution before changing stable navigation logic |

### Motion and interaction specification

| Component | Purpose | Timing / behavior | Interruption | Reduced motion |
| --- | --- | --- | --- | --- |
| Screen-level saving indicator | Confirm that profile persistence is active | Continuous indeterminate rotation beside `Saving details...`, positioned above the action | Completion or failure removes it immediately and restores the action state | A static ring remains with the same text, so progress is understandable without rotation |
| Profile `My Masjids` row | Direct navigation feedback | Existing Noor row press feedback only; no decorative transition | A second action is blocked by normal navigation dispatch | Unchanged |
| Quran metadata correction | Improve legibility | No animation | Not applicable | Not applicable |

The previous saving-state audit confirmed disabled repeated submission and stable bottom-bar geometry. The revised screen-level placement now requires a fresh Noor and Compose capture before pixel-parity closure.

## UX-01 / UX-03 token and metrics reduction — 2026-07-21

| Before | After | Why |
| --- | --- | --- |
| Home shell exit timing used a local 400ms value | Consume Noor's standard duration and ease-out curve | The frequent shell handoff is now faster, cohesive, and design-system governed |
| Home/Profile component geometry lived beside screen composition | Move exact approved geometry into dedicated component metrics | Screens express hierarchy and state while component-specific measurements stay isolated and reviewable |
| On-image post text and icon colors were built from raw white/black values and local opacity | Add `info-on-media` and `info-on-media-secondary`; use the existing media scrim | Image legibility is now theme-stable and reusable without per-feature color construction |
| Branded icon containers and destructive chevrons constructed local alpha colors | Add semantic `action-primary-tint` and `status-error-faint` roles in both themes | Reusable intent belongs in Noor, and light/dark mappings can evolve independently |
| Notification-sheet width multiplied physical window pixels and then interpreted the result as dp | Use a bounded logical-width modifier with component metrics | Density changes no longer inflate or shrink the illustration incorrectly |
| A legacy notification guide used emoji as structural benefit icons | Use typed Mosque, MenuBook, and Campaign Noor icons | Structural icons now scale, theme, and announce consistently across platforms; Personal Details' Brother/Sister imagery remains intentionally preserved as illustrative identity, not navigation chrome |
| The raw-value guard treated legitimate metrics and screens identically | Permit geometry only inside named component metrics while continuing to reject raw colors and motion there | The architectural rule becomes enforceable without encouraging arithmetic token hacks in screen code |
| Qaum loading placeholders used different avatar/content alignment from resolved posts and always shimmered | Match the resolved post geometry through metrics and render a static skeleton under reduced motion | Loading should reserve the final layout without creating motion the user has disabled |
| Home dashboard cards, My Masjids tiles, and the Salaah contribution graph embedded exact sizes and opacity percentages | Move exact geometry into component metrics and add the shared opacity scale to Noor POC and Compose | Repeated geometry remains pixel-auditable while semantic visibility levels can be governed consistently |
| Five-tab raw-value debt was tracked as 327 guarded occurrences | Reduce it to 233 without increasing any file baseline; the remaining 73 Home occurrences are isolated to an unreferenced legacy `PrayerArc` preview/component | Active production composition is governed, and dormant legacy code remains explicitly visible rather than being silently deleted |

Motion behavior did not gain decoration. The only timing change is the shell fade, whose purpose is preventing a jarring handoff; it uses Noor's 220ms standard ease-out and remains an opacity-only transition. Frequent tab changes retain their existing quick, interruptible token behavior.

## UX-01 / UX-03 semantic and collection-governance closure — 2026-07-21

### Before / After / Why

| Before | After | Why |
| --- | --- | --- |
| The Salaah timing source used a pin emoji in Noor and Compose | Use Noor's typed `LocationOn` icon beside the existing source label | A structural location cue must render consistently across platforms, themes, and fonts while the visible label carries its meaning |
| Several post-OTP components embedded decimal opacity percentages | Add the reusable `opacity-prominent` step and map active components to Noor's semantic opacity ladder | Visibility decisions remain theme-governed and feature composition no longer invents visual values |
| Hijri events, Dua chapters/categories, Salaah graph months, and followed/managed masjids relied on positional list identity | Supply stable domain keys for each dynamic collection, including composite keys for two-column managed-masjid rows | Refreshes, insertions, and restoration preserve item identity and avoid incorrect state or animation reuse |
| The raw-value guard detected literal colors, dimensions, and durations but allowed raw alpha and platform color constants | Extend the guard to reject raw numeric alpha and platform color constants on active post-OTP routes, including component metrics | The no-raw-values rule is enforceable for semantic color construction as well as geometry and motion |

### Motion and interaction specification

| Component | Purpose | Motion | Interruption | Reduced motion |
| --- | --- | --- | --- | --- |
| Salaah timing-source cue | Reinforce the source location | Static typed icon; no animation | Not applicable | Identical static cue |
| Dynamic collections | Preserve item identity during data changes | Existing list behavior only; stable keys prevent unrelated item reuse | A newer state replaces the previous collection immediately | No additional motion |
| Semantic opacity migration | Maintain hierarchy and legibility | No animation | Not applicable | Not applicable |

No route, field order, navigation label, persistence contract, or analytics-sensitive action changed in this closure. The UI Pro Max checks for stable Lazy keys, semantic loading feedback, content descriptions, and reduced motion are satisfied in source; paired device evidence remains the final certification gate.

## UX-05 / UX-06 component-governance pass — 2026-07-21

| Before | After | Why |
| --- | --- | --- |
| Masjid cards, map pins, explorer detents, registration media, pincode dropdowns, and QR masks embedded their exact geometry in feature composition | Move approved geometry into component metrics and keep reusable visibility/timing in Noor opacity and motion tokens | Discovery states stay pixel-auditable without screens inventing values or mixing physical pixels with logical dp |
| Registration status and scanner motion owned local durations and continued moving under reduced motion | Add semantic ambient-pulse and scan-sweep timing; show stable active/scanning feedback when reduced motion is enabled | Motion communicates live work only when welcome and remains understandable without travel |
| Qibla compass and AR overlays constructed raw colors, strokes, text sizes, and placement values; the visible compass used an emoji as the Kaaba marker | Resolve compass meaning from Noor status/info roles, isolate geometry in metrics, and use the existing Paigham Kaaba asset in the visible compass center | Sensor guidance now themes consistently and the Kaaba representation is stable across platforms |
| Sehri service ribbons used fixed white content even when the themed background could also become light; skeleton actions did not match resolved icon buttons | Pair each service surface with a semantic foreground and align skeleton controls with the final 40dp icon-button geometry | Light/dark contrast and loading-to-content continuity are both preserved |
| The guarded baseline contained 327 post-OTP and legacy visual literals | Reduce it to 82: 73 in an unreferenced legacy `PrayerArc` preview/component and 9 in the explicitly excluded Intro animation | Active post-OTP source is governed while exceptions stay named and visible for a separate removal/refactor decision |

### Motion and interaction specification

| Component | Purpose | Motion | Interruption | Reduced motion |
| --- | --- | --- | --- | --- |
| Registration status halo | Show the currently active review stage | Noor 900ms ambient pulse | State replacement removes it immediately | Stable medium-opacity halo |
| QR scan line | Explain an active scan region | Noor 4000ms linear sweep inside the cutout | Permission, result, or route change stops it | Stable midpoint line |
| Sehri list/carousel switch | Explain content-mode replacement | Existing compact crossfade | A new detent retargets the content | No transition |
| Qibla direction hint | Explain which way to turn | Existing token sweep; heading updates remain interruptible | Sensor changes retarget on the next frame | Static direction arrow and snapped heading |

No route, repository, backend, analytics, onboarding branch, or follow-persistence behavior changed in this governance pass. Physical camera, map, location, and compass evidence remains part of the user-run device certification.

## Qibla recovery completion - 2026-07-21

Reading this as a redesign-preserve pass for an occasional physical guidance tool. The dark compass instrument, emerald alignment state, camera handoff, Kaaba artwork, close action, and restrained direction feedback remain authoritative. The working dials remain `DESIGN_VARIANCE: 4`, `MOTION_INTENSITY: 3`, and `VISUAL_DENSITY: 5`.

| Before | After | Why |
| --- | --- | --- |
| The parity ledger required sensor failure, but Noor exposed only seven permission, locating, and AR frames | Add separate location-unavailable and sensor-unavailable specifications for nine complete states | The approved design must include the recovery behavior it asks Compose to implement |
| A failed location read could leave the route indefinitely on the locating presentation | Replace unresolved waiting with a stable location recovery screen and one `Try again` action | Loading must end in success or an actionable failure |
| Sensor availability and stream failure had no visible contract | Specify a motion-free sensor recovery screen with the same hierarchy and action placement as location recovery | A device capability failure must remain understandable without implying that the camera or compass is active |
| AR could be entered before a real compass reading, and a legitimate north-facing `0°` value could be treated as missing | Require an explicit reading flag rather than inferring validity from non-zero numbers | Zero is valid sensor data; absence must be represented directly |
| Permanent camera denial could reuse location-services copy | Use the denied permission's own recovery description | Error copy must state the actual cause and repair |
| The transient status said only `Finding your location…` while the route could also be waiting for sensor initialization | Use `Preparing guided Qibla…` until location and a real compass reading are both available | The status remains truthful through the complete initialization boundary |

### UX Pro Max checklist

- Permission request, settings recovery, location retry, sensor retry, AR close, and visible AR guidance all have descriptive control labels.
- Stable recovery is separate from loading and uses a single primary action; it does not rely on warning color alone.
- The retry action retains Noor's 48dp control contract, while the close action remains in the safe app-bar region.
- AR remains gated by current location, both permissions, hardware availability, and a real compass reading.
- A location of `0,0`, a Qibla bearing of `0°`, and a compass heading of `0°` remain valid values once a reading exists.
- Recovery copy wraps, uses semantic typography and colors, and is bounded for larger windows without screen-owned geometry.
- Physical sensor, camera, permission, largest-text, landscape, and light/dark evidence remain part of the delegated device pass.

### Motion and interaction specification

| Interaction | Purpose | Timing / easing | Interruption | Reduced motion |
| --- | --- | --- | --- | --- |
| Retry initialization | Acknowledge recovery and return to unresolved preparation | Immediate state replacement; no decorative entrance | Close or a new capability result replaces it | Identical static replacement |
| Compass heading | Track live physical direction | Existing interruptible sensor interpolation using Noor press timing | Every new reading retargets the heading | Snap to the latest reading |
| Direction hint | Explain which way to turn | Existing Noor-governed opacity pulse | Alignment, recovery, or route exit removes it immediately | Static direction arrow |
| Recovery screen | Explain a stable inability to start | No animation | Retry or Close acts immediately | Identical static presentation |

The route, permission order, sensor calculations, haptic threshold, camera contract, and navigation destination remain unchanged. This pass completes previously claimed recovery behavior rather than adding a new product branch.
