# Salaah timing rules — final product and interaction specification

**Status:** Finalized for Noor implementation. Compose and backend parity are not part of this document's completion.

**Date:** 2026-08-16

**Product surface:** Masjid Console → Salaah timings

**Source baseline:** `paigham-app` and `paigham-core-server` as they stand on 2026-08-16. Where this specification changes current behaviour, it is marked explicitly.

---

## 1. Outcome

A committee member should be able to set the time they recognise from the masjid board while Paigham preserves the rule that makes that time update correctly through the year.

The product will expose two connected editing surfaces:

1. **Salaah timings:** the existing day timeline, for setting today's azaan and jamaat visually.
2. **How timings update:** a dedicated full page, opened from the timeline's info icon, for viewing and changing the rule behind each prayer.

Both surfaces edit the same local draft. Neither publishes independently. The existing **Publish timings** action remains the single moment at which all six prayer rules become public.

The central behaviour is:

> Load the exact rule from the server, show its result on today's timeline, and make every drag obey that rule.

The timeline must not repeatedly infer a new variant from the dragged clock time. That is the source of the current one-way conversion from automatic rules to `FIXED`.

---

## 2. Product decisions

### 2.1 Use the real-world prayer pattern as the recommended model

The recommended setup is:

| Prayer | Recommended behaviour | Stored variant |
|---|---|---|
| Fajr | Move with the prayer, rounded to the masjid's chosen interval | `VARIES_WITH_ON_TIME` |
| Zohar | Stay at the masjid's chosen clock time | `FIXED` |
| Asr | Move with the prayer, rounded to the masjid's chosen interval | `VARIES_WITH_ON_TIME` |
| Maghrib | Azaan at sunset | `ON_TIME` |
| Isha | Move with the prayer, rounded to the masjid's chosen interval | `VARIES_WITH_ON_TIME` |
| Jumah | Stay at the masjid's chosen Friday clock time | `FIXED` |

This is a **recommended starting model, not a hard-coded restriction**. A masjid may explicitly choose any supported rule for any prayer.

The recommendation must never overwrite a rule that already exists on the server.

### 2.2 The server rule is the first-load source of truth

On first open, the app loads the exact six rule objects already held by the server. It does not recreate them from today's resolved azaan times and does not replace them with client defaults.

This is important because the same clock value can mean different things:

- Maghrib at `6:42 PM` today may mean “at sunset” and therefore store no clock time.
- Fajr at `5:00 AM` today may mean “next quarter-hour after Fajr begins”.
- Zohar at `1:15 PM` may mean “1:15 PM every day”.

Inferring from a single day's displayed time destroys that distinction.

### 2.3 Rule changes are explicit; rule execution is silent

- The user explicitly changes a prayer's rule on the dedicated rule detail page.
- Once selected, the rule silently controls timeline movement and yearly resolution.
- Dragging never opens a sheet, chooser, explanation card, or drift offer.
- The timeline does not place another card above the day.

### 2.4 Keep the info icon as the entry point

The top app bar on **Salaah timings** retains an info icon. It opens **How timings update**.

The info icon is separate from the history icon:

- **Info:** view and edit the current rules.
- **History:** view published changes and attribution.

### 2.5 One draft and one publish

Timeline edits, rule edits, iqama edits, and accepted board-scan values all update one `SalaahConfigDetails` draft.

There is no Save action inside the rule pages. Returning to the timeline keeps the draft. Only **Publish timings** sends it to the server.

---

## 3. Product language

Backend taxonomy must not appear in the UI.

| Backend term | User-facing name | Supporting copy |
|---|---|---|
| `ON_TIME` | **At prayer start** | “Azaan moves with the prayer start.” |
| `VARIES_WITH_ON_TIME` | **Round up after prayer begins** | “Azaan moves to the next 5, 10 or 15-minute mark.” |
| `FIXED` | **Same time every day** | “Azaan stays at this clock time.” |
| `FIXED` for Jumah | **Same time every Friday** | “Jumah stays at this Friday clock time.” |
| `neverBefore` | **Earliest azaan** | “Even when the rounded time is earlier, azaan will not be before this.” |
| `salaahTimeVariation` | **Rounding interval** | “Next 5 minutes”, “Next 10 minutes”, or “Next quarter-hour”. |

Avoid phrases such as “automatic config”, “variant”, “floor”, and “varies with on time” in visible copy.

---

## 4. Data contract

### 4.1 Stored rule shapes

The existing backend rule model remains valid:

```text
ON_TIME
  iqamaDelay

FIXED
  salaahTime
  iqamaDelay

VARIES_WITH_ON_TIME
  neverBefore
  salaahTimeVariation = 5 | 10 | 15
  iqamaDelay
```

### 4.2 Config response metadata required by the app

The current config response contains the six rules but does not expose whether the row is `PUBLISHED` or `UNPUBLISHED`. The finalized flow requires that distinction.

The config read must provide:

```text
config: exact six-rule SalaahConfigDetails
status: PUBLISHED | UNPUBLISHED
origin: PUBLISHED_BY_USER | SOURCED | SERVER_DEFAULT
revision or updatedAt: optimistic-concurrency token
```

`origin` may be represented by an equivalent server-owned field. The app needs the behaviour, not these exact wire names.

### 4.3 First-load cases

| Server result | Published baseline | Editable draft | Publish state |
|---|---|---|---|
| Existing `PUBLISHED` row | Exact server config | Deep canonical copy of server config | Not changed initially |
| Existing sourced or default `UNPUBLISHED` row | None public from this editor's perspective | Exact server config | First publish required, even with zero edits |
| Typed no-config response containing a server seed | None | Exact server-provided seed | First publish required |
| Offline, timeout, 5xx, auth failure, or untyped error | Unknown | None | Error with Retry; publishing unavailable |

The client must not treat every 4xx as “new masjid”. The current app does this and can open guessed defaults over an existing record after an unrelated client error. A first-run state must be explicit and typed by the server.

### 4.4 No client-created fallback config

If a masjid genuinely has no row, the server must return or create the seed rule set. This keeps one canonical bootstrap policy and prevents Android, iOS, web, and future clients from starting differently.

For newly created records:

1. Prefer a sourced/imported rule set when one exists.
2. Otherwise use a server-owned default seed.
3. Do not derive a variant from the resolved time returned by `/salaah/timings`.

The recommended prayer mapping in §2.1 may inform a new server seed only when the server also has the necessary clock values. A fixed Zohar or Jumah cannot be invented safely from astronomy alone.

### 4.5 Canonicalization

On read, normalize wire times such as `05:12:00` to minute precision such as `05:12` before comparing draft and baseline. Preserve the semantic variant and all of its fields.

Do not canonicalize by resolving the rule to today's time.

---

## 5. Resolution rules

Let:

- `start` be the astronomical start in minutes from midnight for the selected day.
- `step` be 5, 10, or 15.
- `earliest` be `neverBefore` in minutes from midnight.

### 5.1 At prayer start

```text
azaan = start
jamaat = azaan + iqamaDelay
```

### 5.2 Same time every day or Friday

```text
azaan = stored salaahTime stamped onto the selected date
jamaat = azaan + iqamaDelay
```

### 5.3 Round up after prayer begins

The existing server rule uses the **next** multiple, not the current multiple:

```text
rounded = floor(start / step) * step + step
azaan = max(rounded, earliest)
jamaat = azaan + iqamaDelay
```

Examples:

| Prayer start | Rule | Earliest azaan | Resolved azaan |
|---:|---|---:|---:|
| 4:12 PM | Next quarter-hour | 12:00 AM | 4:15 PM |
| 4:22 PM | Next quarter-hour | 4:00 PM | 4:30 PM |
| 4:22 PM | Next quarter-hour | 5:00 PM | 5:00 PM |
| 4:30 PM | Next quarter-hour | 12:00 AM | 4:45 PM |
| 7:03 PM | Next 10 minutes | 7:30 PM | 7:30 PM |

The app must mirror this arithmetic locally for timeline placement and drag preview. App and backend round-trip tests must pin the same result for every minute and every supported interval.

---

## 6. Navigation and information architecture

```text
Masjid Console
  └── Salaah timings
        ├── info → How timings update
        │             └── prayer row → Prayer timing rule
        └── history → Timing change history
```

All destinations are full pages. No rule choice uses a bottom sheet.

### 6.1 Salaah timings app bar

Order of actions:

1. Info icon — always shown when a server rule draft has loaded.
2. History icon — shown only when publish history exists.

The info icon has the accessibility label **How timings update**.

### 6.2 Back behaviour

- Prayer timing rule → How timings update: retain draft changes.
- How timings update → Salaah timings: retain draft changes and immediately render their resolved result.
- Salaah timings → previous product destination:
  - If clean, leave immediately.
  - If dirty, show one discard confirmation because this action would lose work.

The exit confirmation is not part of ordinary editing and must not appear after every change.

---

## 7. Screen: How timings update

### 7.1 Purpose

This page is both a readable summary and the entry point for configuration. It replaces the current read-only explanation page.

### 7.2 Layout

Top to bottom:

1. App bar: **How timings update** and Back.
2. One short lead sentence: “Each prayer can follow its start, round up as the day moves, or stay at one clock time.”
3. Six prayer rows in day order: Fajr, Zohar, Asr, Maghrib, Isha, Jumah.
4. A compact footer: “Changes stay in your draft until you publish timings.”

Do not add an introductory card above the list.

### 7.3 Prayer row contents

Each row shows:

- Prayer name.
- Plain-language rule summary.
- Today's resolved azaan time where applicable.
- Iqama summary.
- Changed marker when the row differs from the server baseline.
- Chevron indicating that the row opens a full page.

Examples:

```text
Fajr
Next quarter-hour after Fajr begins · 5:00 AM today
Jamaat 20 min later

Zohar
Same time every day · 1:15 PM
Jamaat 15 min later

Maghrib
At sunset · 6:42 PM today
Jamaat 5 min later
```

### 7.4 Page state

The page reads directly from the shared draft. A changed rule updates its row immediately when returning from detail. There is no additional Save button and no second copy of state.

---

## 8. Screen: Prayer timing rule

### 8.1 App bar

Title examples:

- **Fajr timing rule**
- **Jumah timing rule**

Back returns to **How timings update** and keeps the current draft.

### 8.2 Rule choices

Show three large, mutually exclusive choices:

1. **At prayer start**
2. **Round up after prayer begins**
3. **Same time every day** or **Same time every Friday** for Jumah

The selected choice expands its controls inline on this full page. This is not a sheet.

### 8.3 At prayer start controls

Show:

- Today's calculated start.
- Iqama delay control.
- Explanation: “The azaan moves automatically when the prayer start changes.”

There is no azaan clock-time control because the rule stores none.

For Maghrib, visible language should say **At sunset** while still storing `ON_TIME`.

### 8.4 Round-up controls

Show:

- Rounding interval: 5, 10, or 15 minutes.
- Human label for the selection:
  - 5 → “Next 5-minute mark”
  - 10 → “Next 10-minute mark”
  - 15 → “Next quarter-hour”
- Earliest azaan time.
- Today's calculated start.
- Today's resolved azaan result.
- Iqama delay control.

Changing the interval recomputes today's preview immediately.

The default earliest azaan for a newly selected round-up rule is `00:00`, meaning the rounding alone decides. Do not initialize it to today's resolved azaan, because that accidentally creates a seasonal floor.

If the prayer already has a server `VARIES_WITH_ON_TIME` rule, preserve its exact interval and `neverBefore`, including a non-zero or non-grid-aligned value, until the user changes it.

### 8.5 Fixed controls

Show:

- Azaan clock time.
- Today's calculated start for context.
- Iqama delay control.
- Explanation: “This time does not move as the prayer start changes.”

If the chosen time is outside today's legal prayer window, show the same named validation used by the timeline and do not allow publish.

### 8.6 Restore action

When this prayer differs from the loaded server baseline, show a quiet text action:

**Restore published rule**

For an `UNPUBLISHED` first-run config, use:

**Restore server setup**

The action restores the complete rule object, including interval, earliest time, fixed time, and iqama delay.

---

## 9. Rule-aware timeline dragging

The timeline always reads the draft rule first and applies the corresponding gesture contract.

### 9.1 Common drag behaviour

- Drag the card body to edit the azaan where the selected rule permits it.
- Drag the iqama chip to edit only the iqama delay.
- Drag the gutter or empty band to scroll.
- The jamaat remains at its original absolute time while the azaan body moves; the delay absorbs the difference until its five-minute minimum is reached.
- All previews are live. The card must display the exact time that will be stored and resolved before the finger is released.
- Window bounds are enforced during the gesture.

### 9.2 Fixed rule

For `FIXED`:

- The azaan card moves in one-minute increments.
- The result updates `salaahTime`.
- The variant remains `FIXED`.
- `neverBefore` and `salaahTimeVariation` remain absent.

Example:

```text
Zohar: Same time every day · 1:15 PM
drag to 1:17 PM
→ FIXED salaahTime = 13:17
```

### 9.3 Round-up rule

For `VARIES_WITH_ON_TIME`:

- The card moves only among positions allowed by its 5, 10, or 15-minute interval.
- The visible card jumps between those positions during the drag; it must not move continuously and then jump only on release.
- The variant and interval are preserved.
- The dragged position updates `neverBefore`, not `salaahTime`.
- The stored rule must resolve back to the visible dragged position for today.

Let `natural` be today's rounded result before the floor is applied.

```text
natural = nextMultiple(start, step)
target = next step-aligned value at or after the finger position

if target <= natural:
  neverBefore = 00:00
  visible azaan = natural
else:
  neverBefore = target
  visible azaan = target
```

Example:

```text
Asr begins 4:12 PM
Rule: Next quarter-hour; earliest 12:00 AM
Natural result: 4:15 PM

drag toward 4:27 PM
→ card previews 4:30 PM
→ neverBefore = 16:30
→ variant remains VARIES_WITH_ON_TIME /15

later in the year Asr begins 4:38 PM
→ natural result is 4:45 PM
→ azaan becomes 4:45 PM because the day has moved past the floor
```

If a stored server floor is not aligned to the current interval, render its exact resolved result. On the first user drag, normalize the newly chosen target to the selected interval.

### 9.4 At-prayer-start rule

For `ON_TIME`:

- The azaan card is anchored to the calculated start.
- Dragging the body does not silently convert the rule to `FIXED`.
- The iqama chip remains editable.
- The row visually communicates that the azaan follows the start.
- To move the azaan away from the start, the user changes the rule on **How timings update**.

This is an intentional change from the current app, where dragging an `ON_TIME` prayer away silently converts it to `FIXED`.

### 9.5 Why the rule must not be inferred after every drag

The same position can represent multiple intentions. A 4:30 PM Asr may be:

- fixed at 4:30 PM all year;
- the next quarter-hour after Asr begins;
- the next 10-minute mark after Asr begins;
- a rounded rule with a 4:30 PM earliest azaan.

The configured rule resolves that ambiguity once. The drag then edits a parameter of that rule rather than reclassifying it.

---

## 10. Iqama behaviour

Iqama is always stored as a delay from the resolved azaan.

### 10.1 Iqama-chip drag

- Changes only `iqamaDelay`.
- Uses one-minute increments.
- Minimum delay is five minutes.
- Must leave enough time for the prayer to finish inside its window.

### 10.2 Azaan-body drag

Preserve the current absolute jamaat time as long as possible:

```text
originalJamaat = originalResolvedAzaan + originalDelay
candidateDelay = max(originalJamaat - candidateResolvedAzaan, 5)
```

When the five-minute floor is reached, the jamaat moves with the azaan.

For a rounded rule, `candidateResolvedAzaan` is the snapped preview position, not the raw finger minute.

---

## 11. Validation and clamping

The existing prayer-window requirements remain:

1. Azaan cannot precede the calculated prayer start.
2. Jamaat must start at least 10 minutes before the prayer window closes.
3. Iqama delay cannot be less than five minutes.

### 11.1 During a timeline drag

An invalid candidate:

- clamps to the nearest legal value;
- gives haptic feedback;
- shakes the affected row;
- turns the affected value red temporarily;
- announces a prayer-specific reason;
- keeps the row in view below the app bar.

For rounded rules, clamp first to the legal window and then choose the nearest legal step that still satisfies the window.

If no step-aligned value fits, keep the previous valid draft and announce the reason.

### 11.2 On the rule detail page

Validation appears inline beside the control. The preview uses the last valid result while the entered value is invalid.

### 11.3 On publish

Publish remains pressable. Pressing it runs validation across all six resolved draft rules and responds with a sentence:

- No change: “Nothing has changed yet.”
- Invalid prayer: “Fajr jamaat must finish before sunrise.”
- Valid: continue to publish.

Client validation is not a storage guarantee. Backend publish validation should apply the same invariants before saving. This is a required server hardening item for the final flow.

### 11.4 A fixed rule that drifts later

A fixed clock time may be valid on publish day and become earlier than the calculated prayer start in another season. The configurable rule page reduces accidental fixed rules, but it does not make a deliberately fixed rule season-safe.

Keep the existing drift safety behaviour:

- The Salaah tab warns when a returned masjid timing is outside its prayer window and offers **Update timings**.
- The open editor marks the affected prayer invalid, announces it once, and refuses republish until corrected.
- **How timings update** marks the affected fixed row and its detail page presents the ordinary rule choices. It does not add a special offer card or open a sheet.
- Azan alarms and Home still consume the server result until backend resolution or those surfaces gain their own protection.

Home warning treatment remains outside this flow and requires its own Noor decision because the hero has fixed geometry.

---

## 12. Board scan

Board scan remains an accelerator into the same draft.

### 12.1 What scan may change

A board provides clock readings, not yearly intent. Therefore:

- Accepted azaan readings update the current prayer according to its already selected rule.
- Accepted jamaat readings update `iqamaDelay` from the resolved azaan.
- Scan does not silently switch the rule variant.

### 12.2 Applying an azaan reading by rule

| Current rule | Accepted board value |
|---|---|
| At prayer start | Azaan reading is not applied because the rule has no clock-time parameter; jamaat may still be applied. The review receipt names this clearly. |
| Fixed | Write the exact accepted clock time to `salaahTime`. |
| Round up | Snap the accepted time to the configured interval and update `neverBefore` using the same algorithm as a drag. |

Nothing is published by scanning or by adding readings to the draft.

---

## 13. Draft and publish lifecycle

### 13.1 Store model

The editor should distinguish:

```text
serverSeed       exact config returned by server
published        exact public baseline, null for first publish
draft            one editable six-rule config
serverStatus     PUBLISHED or UNPUBLISHED
origin           published, sourced or default
revision         concurrency token
timings          calculated day used for resolution and bounds
dirty            draft differs from its comparison baseline
needsFirstPublish serverStatus is UNPUBLISHED
```

For a first publish, `dirty` may be false while `needsFirstPublish` is true. Publish must still proceed because the server seed has not yet been made public.

### 13.2 Changed count

A prayer counts as changed when any semantically meaningful field differs:

- variant;
- fixed time;
- interval;
- earliest azaan;
- iqama delay.

Compare canonical rule objects, not today's resolved times.

Two different rules that resolve to the same time today are still different.

### 13.3 Publish request

Send:

- all six exact draft rules;
- the loaded revision or equivalent precondition;
- attribution fields already supported by the backend.

Do not send only today's six resolved clock times.

### 13.4 Publish success

On success:

1. Replace `published` and `serverSeed` with the canonical saved draft.
2. Mark status `PUBLISHED`.
3. Clear `dirty` and `needsFirstPublish`.
4. Show the existing full success state with reach and attribution.
5. Force-refresh the publisher's masjid timings.
6. Allow `SalaahNotificationService` to reschedule alarms from refreshed `allTimings`.
7. Refresh change history.

### 13.5 Revision conflict

If another person publishes after this draft loaded, do not overwrite silently.

Show a full-page conflict state:

```text
Timings changed while you were editing
Refresh to review the latest timings before publishing your draft.
```

Primary action: **Refresh timings**.

The first implementation may discard the local draft after explicit confirmation. Automatic field-level merging is out of scope.

---

## 14. Complete UI state matrix

### 14.1 Salaah timings and rule summary

| State | UI |
|---|---|
| Initial / loading | Structure-matching skeleton for app bar, scan band, timeline, and publish area. |
| Config loaded, day pending | Rule summary is available; timeline retains skeleton/disabled placement until the calculated day resolves. No unbounded drag. |
| Published and clean | Timeline and rule page show server config; publish press answers “Nothing has changed yet.” |
| Published and dirty | Changed rows marked; timeline previews resolved draft; publish available. |
| Unpublished server seed | Exact server setup shown; “Not published yet” context; publish allowed without edits. |
| Load failure | Error with Retry. No client-generated rule draft. |
| Saving | Interaction locked; “Publishing timings…” above docked bar. |
| Publish success | Existing full success state with reach, attribution and Done. |
| Validation failure | Named inline/snackbar response; affected prayer scrolled into view. |
| Revision conflict | Full-page conflict explanation and Refresh timings. |
| History absent | History icon hidden; info icon remains. |
| History available | Both info and history actions shown. |

### 14.2 Prayer rule detail

| State | UI |
|---|---|
| At prayer start selected | Calculated start preview and iqama control. |
| Round-up selected | Interval, earliest azaan, today's start/result, iqama. |
| Fixed selected | Clock time, today's start context, iqama. |
| Changed | Changed marker and restore action. |
| Invalid fixed time | Inline window reason; publish will refuse. |
| Invalid earliest azaan | Inline window reason; keep last valid preview. |
| Calculated day unavailable | Rule fields remain readable; day-dependent preview and validation show loading and cannot be edited into an unvalidated state. |

### 14.3 Existing unusual server configs

| Server condition | Required behaviour |
|---|---|
| `VARIES` with non-zero floor | Preserve and explain it as Earliest azaan. |
| `VARIES` with floor not aligned to interval | Render exact server result; normalize only after user edits that time. |
| `FIXED` currently before prayer start | Mark invalid immediately, name the prayer, refuse publish until corrected; do not silently rewrite it. |
| `ON_TIME` for Zohar or Jumah | Preserve it even though it differs from the recommendation. |
| `FIXED` Maghrib | Preserve it; do not silently convert to sunset. |
| Missing optional field in a malformed rule | Error for that prayer and block publish; do not guess a semantic replacement. |

---

## 15. Accessibility and interaction requirements

- Every icon button has a spoken label; never rely on the icon glyph alone.
- Rule choice controls expose selected/unselected state.
- Interval controls expose both numeric and human meaning, such as “15 minutes, next quarter-hour”.
- Dragging is not the only editing path; every value can be changed from the prayer rule page.
- Snapped drag updates are announced no more frequently than is usable by assistive technology; announce the settled value on release.
- Error announcements name the prayer, value, and boundary.
- Touch targets remain at least the Noor minimum size.
- Focus returns to the originating prayer row when leaving a rule detail page.
- Reduced-motion mode removes shake/animated jumping while retaining color-independent error text and haptics where available.

---

## 16. Analytics needed for product validation

Do not send prayer times or other sensitive clock values in analytics.

Record only:

- rule summary opened;
- prayer rule detail opened;
- rule type changed, using the coarse type only;
- rounding interval selected;
- timeline drag completed by rule type;
- drag clamped;
- server seed first-published;
- publish validation failed by reason category;
- publish succeeded;
- revision conflict encountered.

Questions the data should answer:

1. Do people discover the rules page from the info icon?
2. Do automatic rules survive ordinary timeline edits?
3. Which intervals are actually used?
4. How often are fixed timings already outside their window?
5. Does first publish succeed without forcing a meaningless edit?

---

## 17. Required tests

### 17.1 Pure rule-resolution tests

- Every supported interval at every minute of the day matches backend resolution.
- Exact-multiple starts resolve to the next multiple.
- Earliest azaan wins when later than natural rounding.
- Natural rounding wins when later than earliest azaan.
- `ON_TIME` stores no clock time.
- `FIXED` survives date changes unchanged.

### 17.2 Server-first hydration tests

- A published config hydrates exact variants and fields.
- A sourced `UNPUBLISHED` config hydrates exact variants and is publishable without edits.
- A server default hydrates exactly; the app does not replace it with local defaults.
- A 401, 403, timeout, or 5xx never creates a first-run draft.
- A typed no-config response uses only its server-provided seed.
- Canonicalization removes seconds without changing semantics.

### 17.3 Rule-aware editing tests

- Fixed drag writes `salaahTime` and remains fixed.
- `/5`, `/10`, and `/15` drags snap live and remain `VARIES`.
- Dragging a rounded prayer to its natural result clears the binding floor to `00:00`.
- Dragging it later writes an aligned `neverBefore`.
- An `ON_TIME` body drag does not convert the rule.
- Iqama drag changes only delay.
- Azaan drag holds jamaat until the five-minute delay floor.
- Restoring a rule restores the complete server object.
- Two rules resolving to the same time still count as semantically different.

### 17.4 UI state tests

- Info icon opens the dedicated rules page.
- No helper card appears above the timeline.
- No rule sheet appears during drag.
- Back navigation retains the shared draft.
- Dirty exit confirmation appears only when leaving the editor.
- Invalid rows are named and scrolled into view.
- Publish succeeds from an unchanged `UNPUBLISHED` seed.
- Revision conflict cannot overwrite newer server state.

### 17.5 Device verification

Before Compose parity is called complete, capture and compare at 402 × 874 in light and dark modes:

- clean published timeline;
- rounded-rule drag between two steps;
- anchored Maghrib `ON_TIME` row;
- rule summary page;
- each of the three rule detail selections;
- changed rule with restore action;
- first unpublished server setup;
- inline invalid fixed timing;
- revision conflict;
- loading and error states.

Compilation is not device verification.

---

## 18. Implementation impact

### 18.1 Noor

1. Convert the current **How timings update** page from read-only rows to interactive rows.
2. Add the full-page prayer rule detail states.
3. Remove old rule receipt and drift-offer scenarios from the active journey.
4. Make timeline cards obey the selected draft rule.
5. Add sourced-unpublished, invalid stored config, loading, error, and conflict frames.

### 18.2 Compose app

Likely touch points after Noor approval:

- `SalaahConfigScreen.kt` — navigation, summary/detail pages, states.
- `SalaahTimelineBinding.kt` — replace inference-on-every-drag with rule-aware parameter updates.
- `SalaahTime.kt` — keep canonical local resolution and add snapping helpers.
- `SalaahConfigViewModel.kt` — server-first hydration, shared draft intents, first-publish metadata, revision conflict.
- `SalaahConfigState.kt` — seed/status/origin/revision and rule-page state.
- `SalaahConfigIntent.kt` — explicit `SetRule`, `SetVariation`, `SetEarliestAzaan`, `SetFixedTime`, `RestorePrayer` intents.
- `SalaahConfigRoundTripTest.kt` — replace tests that require `VARIES` to become `FIXED`.

### 18.3 Backend

Required dependencies:

1. Return config status and server origin/seed semantics to the app.
2. Distinguish typed no-config from auth and other client errors.
3. Provide a revision or conditional-write mechanism.
4. Validate rule completeness and resolved prayer windows on publish.
5. Preserve exact rule objects and history snapshots.
6. Keep cache invalidation for config and seven-day timings.

The backend should not infer a rule from a times-only publish payload. The client continues to send explicit six-rule configs.

---

## 19. Behaviour changes from the current app

| Current behaviour | Finalized behaviour |
|---|---|
| Rule names are hidden and the timeline infers the variant from each drag. | Rule names remain humanized, but users can explicitly configure them on a dedicated page. |
| Editing a `VARIES` prayer converts it to `FIXED`. | A rounded prayer remains rounded; the drag snaps and edits its earliest azaan. |
| Dragging `ON_TIME` away converts it to `FIXED`. | The card stays anchored; changing the rule is explicit. |
| Any client-side network anomaly classified as 4xx can open defaults. | Only an explicit server first-run result may create the first draft. |
| App creates an all-`ON_TIME` first-run fallback. | Exact server config or server-owned seed is always used. |
| Config response omits publish status. | Status/origin distinguish published baseline from first server setup. |
| Drift can trigger an offer card. | No timeline offer card; rules are always available from the info page. |
| Rule choice can be discussed in transient sheets/offers. | Rule configuration uses full pages only. |

---

## 20. Acceptance criteria

The flow is complete when all of the following are true:

- The first visible draft is the exact config supplied by the server.
- Existing variants are never recreated from today's displayed times.
- The info icon opens a dedicated editable **How timings update** page.
- Every prayer's rule can be changed without a sheet.
- Fixed prayers drag minute-by-minute.
- Rounded prayers visibly jump on their configured 5, 10, or 15-minute grid and remain rounded.
- At-prayer-start prayers remain anchored and store no clock time.
- Timeline and rule pages share one draft.
- Returning from rule configuration immediately repositions the timeline card.
- Scan uses the same rule-aware edit path.
- No scan, drag, or rule selection publishes anything.
- First server setup can be published without manufacturing a change.
- Publish sends exact rules, validates them, records history, refreshes timings, and reschedules alarms.
- Errors never cause the client to invent a replacement config.
- Noor includes every state listed in §14 before Compose implementation begins.

---

## 21. Canonical flow in one sequence

```text
OPEN SALAAH TIMINGS
  → load exact config + status + revision from server
  → load today's calculated prayer starts
  → resolve the server rules onto the timeline

EDIT ON TIMELINE
  → read the prayer's selected rule
  → fixed: move by one minute
  → rounded: jump by its 5/10/15-minute interval
  → at start: keep azaan anchored; iqama remains editable
  → update the shared draft only

EDIT THE RULE
  → tap info
  → open How timings update
  → open one prayer
  → choose at start, round up, or fixed
  → configure only the fields that rule owns
  → return to timeline
  → card resolves and moves immediately

PUBLISH
  → validate all six resolved rules
  → send all six rule objects with revision
  → server stores config + attributed history
  → server invalidates config and timing caches
  → app refreshes timings
  → alarms reschedule from refreshed allTimings
```

This keeps the setup understandable to a committee member without giving up the set-once, season-aware model the backend already supports.
