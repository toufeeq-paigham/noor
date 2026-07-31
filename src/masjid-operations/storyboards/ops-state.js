// Masjid Operations — one state model shared by the storyboard frames and the live device.
//
// Plain JS (loaded synchronously from the page helmet) so `buildOpsData` and `OPS_FRAMES`
// exist before the page's DCLogic runs. The sample data and formatting helpers live in
// ./screens.jsx and are read lazily (at call time) from `window`, so this file never
// depends on the async JSX module having loaded yet.
//
// Why one model: every storyboard frame is produced by the SAME `buildOpsData` the live
// device uses, so a frame can never drift from the interactive prototype. A frame declares
// only the state that differs from the default; `matchesFrame` then decides which frame
// ring lights up for the device's current state.

(function () {
  // ── Default state — a chairman looking at a healthy console ──
  const OPS_DEFAULT_STATE = {
    route: 'console', // 'console' | 'create' | 'sent' | 'invitations'
    role: 'CHAIRMAN',
    // Command deck: 'home' is the hub, everything else is a full destination screen.
    dest: 'home', // 'home' | 'members' | 'member' | 'invite' | 'followers' | 'salaah' | 'details'
    masjidId: 'bilal', // which managed masjid the console is showing
    switcherOpen: false,
    consoleStatus: 'loaded', // 'loading' | 'loaded' | 'locked' | 'error'

    // Capabilities of the signed-in member (`OPS_MEMBERS[0]` by default: a full admin).
    // Salaah timings are public and deliberately absent from this set — see OPS_CAPABILITIES.
    caps: ['post', 'committee'],

    // Storyboard override for the floating action's collapsed form; the live device lets
    // scroll position decide (same idiom as the Qaum player's `dock`).
    fabCompact: false,

    postsStatus: 'loaded', // 'loading' | 'loaded' | 'error'
    postsEmpty: false,
    postMenuFor: null,
    deletingId: null,

    membersStatus: 'loaded', // 'loading' | 'loaded' | 'error'
    membersEmpty: false,
    memberId: null, // the member whose permission screen is open
    followersStatus: 'loaded',
    followersEmpty: false,
    followersLoadingMore: false,
    followersPage: 4, // how many of the total are loaded
    // The invite draft. Visibility is `dest === 'invite'`, not a flag on this object — the
    // invite is a destination screen, so the route owns whether it is showing.
    invite: { phone: '', role: null, caps: [], sending: false, error: null },

    salaahStatus: 'loaded', // 'loading' | 'loaded' | 'error' | 'saved'
    salaahConfig: null, // null → the published sample config
    // Storyboard-only: resolve a working copy with two prayers moved, lazily (screens.jsx
    // publishes the baseline after this file loads).
    salaahEdited: false,
    expandedPrayer: null,
    salaahNote: '',
    salaahDirty: false,
    salaahSaving: false,
    salaahHistoryOpen: false,
    // Scan-the-board flow (console TRD §6). `scanStage` owns the full-screen stage;
    // `scanApplied` marks that the working config came from a scan, so the editor shows the
    // check-before-publishing banner ('full' read every prayer, 'partial' names the misses).
    scanStage: null, // null | 'camera' | 'reading' | 'failed'
    scanApplied: null, // null | 'full' | 'partial'

    // The compose wizard's own state. `step` is the screen, `recorder` / `picker` / `crop`
    // are its full-screen stages, `audience` is the PostTarget.
    post: {
      step: 'message', // 'message' | 'photos' | 'audience' | 'review'
      message: '',
      audio: null, // { uploading, failed, playing, progress, duration }
      recorder: null, // { stage: 'recording' | 'review' | 'blocked', elapsed }
      photos: [], // [{ id, src, uploading, failed }]
      picker: false,
      crop: null, // { src, rotation }
      audience: 'MASJID',
      submitting: false,
      micBlocked: false,
    },

    invitationsStatus: 'loaded', // 'loading' | 'loaded' | 'error'
    invitationsEmpty: false,
    invitationActioningId: null,
    invitationAcceptedId: null, // accepted just now → the card offers the console

    openMenu: null,
    snack: null,
    confirm: null, // { kind, id }

    // Content mutations produced by the live device (a confirmed delete, an accepted
    // invitation, a role change, a sent invite). They are deliberately NOT part of the
    // frame signature: they change list contents, not which state the screen is in.
    hidden: [],
    roleOverrides: {},
    capOverrides: {},
    extraMembers: [],
  };

  const NESTED_KEYS = ['invite', 'post'];

  const cloneState = (state) => {
    const next = Object.assign({}, state);
    NESTED_KEYS.forEach((key) => { next[key] = Object.assign({}, state[key]); });
    return next;
  };

  const applyPatch = (state, patch) => {
    const next = cloneState(state);
    Object.keys(patch || {}).forEach((key) => {
      if (NESTED_KEYS.indexOf(key) !== -1) next[key] = Object.assign({}, next[key], patch[key]);
      else next[key] = patch[key];
    });
    return next;
  };

  const frameState = (frame) => applyPatch(OPS_DEFAULT_STATE, frame.state);

  const sameValue = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return a == b; // eslint-disable-line eqeqeq
    if (typeof a === 'object' && typeof b === 'object') {
      return Object.keys(a).every((k) => sameValue(a[k], b[k]))
        && Object.keys(b).every((k) => sameValue(a[k], b[k]));
    }
    return false;
  };

  // ── Frame matching ──
  // A frame lights up when the device's state SIGNATURE equals the frame's. The signature
  // drops values that change continuously (elapsed time, playback progress, the exact text
  // typed, the working config object) and keeps them as buckets, so the ring survives real
  // interaction instead of dropping on every keystroke.
  const MAX_MESSAGE = 1024;

  const signature = (state) => {
    const s = state || OPS_DEFAULT_STATE;
    const post = s.post || {};
    const invite = s.invite || {};
    const message = post.message || '';

    // Only the slice the screen is actually showing takes part in the comparison, so a
    // leftover from another tab (a filter, a sub-tab) never suppresses the ring.
    const onConsole = s.route === 'console';
    const scope = {
      posts: onConsole && s.dest === 'home',
      members: onConsole && ['members', 'followers', 'member', 'invite'].indexOf(s.dest) !== -1,
      salaah: onConsole && s.dest === 'salaah',
      post: s.route === 'create',
      invitations: s.route === 'invitations',
    };

    const base = {
      route: s.route,
      role: s.role,
      caps: (s.caps || []).slice().sort().join(','),
      dest: onConsole ? s.dest : null,
      consoleStatus: s.consoleStatus,
      openMenu: s.openMenu || null,
      snack: s.snack ? (s.snack.kind || 'success') : null,
      confirm: s.confirm ? { kind: s.confirm.kind, id: s.confirm.id } : null,
    };

    const slices = {};
    if (scope.posts) {
      Object.assign(slices, {
        postsStatus: s.postsStatus,
        postsEmpty: !!s.postsEmpty,
        postMenuFor: s.postMenuFor || null,
        deletingId: s.deletingId || null,
        masjidId: s.masjidId,
        switcherOpen: !!s.switcherOpen,
        fabCompact: !!s.fabCompact,
      });
    }
    if (scope.members) {
      Object.assign(slices, {
        membersStatus: s.membersStatus,
        membersEmpty: !!s.membersEmpty,
        memberId: s.memberId || null,
        followersStatus: s.followersStatus,
        followersEmpty: !!s.followersEmpty,
        followersLoadingMore: !!s.followersLoadingMore,
        followersPage: s.followersPage,
        invite: {
          role: invite.role || null,
          caps: (invite.caps || []).slice().sort().join(','),
          sending: !!invite.sending,
          hasError: !!invite.error,
          hasPhone: !!(invite.phone || '').length,
        },
      });
    }
    if (scope.salaah) {
      Object.assign(slices, {
        salaahStatus: s.salaahStatus,
        expandedPrayer: s.expandedPrayer || null,
        hasNote: !!(s.salaahNote || '').length,
        salaahDirty: !!s.salaahDirty,
        salaahEdited: !!s.salaahEdited,
        salaahSaving: !!s.salaahSaving,
        salaahHistoryOpen: !!s.salaahHistoryOpen,
        scanStage: s.scanStage || null,
        scanApplied: s.scanApplied || null,
      });
    }
    if (scope.post) {
      const photos = post.photos || [];
      slices.post = {
        step: post.step || 'message',
        message: message.length === 0 ? 'empty' : (message.length > MAX_MESSAGE ? 'too-long' : 'text'),
        audio: post.audio ? { uploading: !!post.audio.uploading, failed: !!post.audio.failed } : null,
        recorder: post.recorder ? (post.recorder.stage || 'recording') : null,
        photos: photos.length,
        photoUploading: photos.some((ph) => ph.uploading),
        photoFailed: photos.some((ph) => ph.failed),
        picker: !!post.picker,
        crop: !!post.crop,
        audience: post.audience || 'MASJID',
        submitting: !!post.submitting,
        micBlocked: !!post.micBlocked,
        // Compose can retarget the masjid mid-draft, so the switcher is part of this
        // screen's state, not only the hub's.
        switcherOpen: !!s.switcherOpen,
      };
    }
    if (scope.invitations) {
      Object.assign(slices, {
        invitationsStatus: s.invitationsStatus,
        invitationsEmpty: !!s.invitationsEmpty,
        invitationActioningId: s.invitationActioningId || null,
        invitationAcceptedId: s.invitationAcceptedId || null,
      });
    }

    return Object.assign(base, slices);
  };

  const matchesFrame = (state, frame) => sameValue(signature(state), signature(frameState(frame)));

  const activeFrameIndex = (state) => OPS_FRAMES.findIndex((frame) => matchesFrame(state, frame));

  // ── Confirmation copy. Destructive wording names the blast radius explicitly. ──
  const confirmSpec = (state, handlers) => {
    const confirm = state.confirm;
    if (!confirm) return null;
    const members = window.OPS_MEMBERS || [];
    const posts = window.OPS_POSTS || [];
    const roleLabel = window.opsRoleLabel || ((r) => r);
    const h = handlers || {};

    if (confirm.kind === 'deletePost') {
      const post = posts.find((p) => p.id === confirm.id);
      return {
        title: 'Delete this paigham?',
        description: `It is removed for every follower of ${(window.OPS_MASJID || {}).name || 'this masjid'} and cannot be restored.${post && post.reactions ? ` ${post.reactions} reactions will be lost.` : ''}`,
        confirmText: 'Delete paigham',
        destructive: true,
        onConfirm: h.onConfirmAction,
      };
    }
    if (confirm.kind === 'removeMember') {
      const member = members.find((m) => m.id === confirm.id);
      return {
        title: 'Remove this member?',
        description: `${member ? member.name : 'This member'} loses every permission and can no longer manage this masjid. Their paighams stay published. You can invite them again later.`,
        confirmText: 'Remove member',
        destructive: true,
        onConfirm: h.onConfirmAction,
      };
    }
    if (confirm.kind === 'declineInvitation') {
      return {
        title: 'Decline this invitation?',
        description: 'The committee is told you declined. They can invite you again if it was a mistake.',
        confirmText: 'Decline',
        destructive: true,
        onConfirm: h.onConfirmAction,
      };
    }
    if (confirm.kind === 'discardDraft') {
      return {
        title: 'Discard this paigham?',
        description: 'Your message, recording and photos are removed. Nothing is sent.',
        confirmText: 'Discard',
        destructive: true,
        onConfirm: h.onConfirmAction,
      };
    }
    if (confirm.kind === 'publishSalaah') {
      return {
        title: 'Publish new timings?',
        description: 'Every follower of this masjid sees the updated azaan and iqama times right away, and the change is recorded in your name.',
        confirmText: 'Publish',
        onConfirm: h.onConfirmAction,
      };
    }
    return null;
  };

  // The console shows one masjid at a time. Sample data only varies the identity fields;
  // a second masjid keeps the same feed so the switch reads clearly in the storyboard.
  // Two prayers moved against the published baseline.
  const editedConfig = () => {
    const base = window.OPS_SALAAH_CONFIG;
    if (!base) return null;
    return Object.assign({}, base, {
      fajr: Object.assign({}, base.fajr, { salaahTime: '05:45', iqamaDelay: 25 }),
      isha: Object.assign({}, base.isha, { salaahTime: '20:30' }),
    });
  };

  // What a successful board scan yields: every prayer read as FIXED with iqama derived from
  // the azaan/jamaat pair. The partial variant leaves Zohar and Maghrib untouched — the two
  // the parser most often loses to glare on real LED boards.
  const scannedConfig = (partial) => {
    const base = window.OPS_SALAAH_CONFIG;
    if (!base) return null;
    const read = {
      fajr: { variant: 'FIXED', salaahTime: '04:45', iqamaDelay: 20 },
      zohar: { variant: 'FIXED', salaahTime: '12:30', iqamaDelay: 30 },
      asr: { variant: 'FIXED', salaahTime: '16:45', iqamaDelay: 15 },
      maghrib: { variant: 'FIXED', salaahTime: '18:13', iqamaDelay: 5 },
      isha: { variant: 'FIXED', salaahTime: '19:45', iqamaDelay: 15 },
      jumah: { variant: 'FIXED', salaahTime: '12:30', iqamaDelay: 60 },
    };
    if (partial) { delete read.zohar; delete read.maghrib; }
    return Object.assign({}, base, read);
  };

  const activeMasjid = (state) => {
    const base = window.OPS_MASJID || {};
    const managed = window.OPS_MANAGED || [];
    const pick = managed.find((m) => m.id === state.masjidId) || managed[0];
    if (!pick) return base;
    return Object.assign({}, base, {
      id: pick.id,
      name: pick.name,
      code: pick.code,
      address: pick.address || pick.city,
      photo: pick.photo,
      stats: Object.assign({}, base.stats, { followers: pick.followers }),
    });
  };

  // ── Hub attention queue — only real, actionable work ─────────────────
  // Nothing is "in review": paighams go live on send, anyone may follow, and timings are
  // public and unreviewed. All that remains is work the committee owes someone — an
  // invitation nobody has accepted yet.
  const attentionItems = (state) => {
    const hidden = state.hidden || [];
    const live = (list) => list.filter((item) => hidden.indexOf(item.id) === -1);
    const caps = state.caps || [];
    const members = state.membersEmpty ? [] : live((window.OPS_MEMBERS || []).concat(state.extraMembers || []));
    const invited = members.filter((m) => m.status === 'INVITED').length;
    const items = [];
    if (invited && caps.indexOf('committee') !== -1) {
      items.push({
        id: 'pending-invites', icon: 'mail', count: invited,
        title: 'Invitations not accepted', copy: 'Waiting on the member',
      });
    }
    return items;
  };

  // ── State → screen data. The single assembly point for both surfaces. ──
  function buildOpsData(state, handlers) {
    const s = state || OPS_DEFAULT_STATE;
    const h = handlers || {};
    const hidden = s.hidden || [];
    const overrides = s.roleOverrides || {};
    const visible = (list) => list.filter((item) => hidden.indexOf(item.id) === -1);

    const capOverrides = s.capOverrides || {};
    const members = visible(
      (s.membersEmpty ? [] : (window.OPS_MEMBERS || [])).concat(s.extraMembers || []),
    ).map((m) => {
      let next = m;
      if (overrides[m.id]) next = Object.assign({}, next, { role: overrides[m.id] });
      if (capOverrides[m.id]) next = Object.assign({}, next, { caps: capOverrides[m.id] });
      return next;
    });
    const followers = visible(s.followersEmpty ? [] : (window.OPS_FOLLOWERS || []))
      .slice(0, s.followersPage || 4);
    const posts = visible(s.postsEmpty ? [] : (window.OPS_POSTS || []));
    const invitations = visible(s.invitationsEmpty ? [] : (window.OPS_INVITATIONS || []));
    const timingHistory = window.OPS_TIMING_HISTORY || [];

    return Object.assign({
      role: s.role,
      caps: s.caps,
      me: members.find((m) => m.you) || null,
      managed: window.OPS_MANAGED || [],
      switcherOpen: s.switcherOpen,
      dest: s.dest,
      status: s.consoleStatus,
      masjid: activeMasjid(s),
      attention: attentionItems(s),
      fabCompact: s.fabCompact,
      // Counts shown on the hub rows, so the deck answers "how much is there?" up front.
      counts: {
        posts: posts.length,
        members: members.length,
        followers: (window.OPS_MASJID || { stats: {} }).stats.followers || followers.length,
        timingChanges: timingHistory.length,
      },
      openMenu: s.openMenu,
      snack: s.snack,
      confirm: confirmSpec(s, h),

      posts: {
        status: s.postsStatus,
        items: posts,
        menuFor: s.postMenuFor,
        deleting: s.deletingId,
      },

      members: {
        status: s.membersStatus,
        items: members,
        editing: members.find((m) => m.id === s.memberId) || null,
        adminCount: members.filter((m) => (m.caps || []).indexOf('committee') !== -1).length,
        followers,
        followersStatus: s.followersStatus,
        followersLoadingMore: s.followersLoadingMore,
        invite: s.invite,
      },

      salaah: {
        status: s.salaahStatus,
        config: s.salaahConfig
          || (s.scanApplied ? scannedConfig(s.scanApplied === 'partial') : null)
          || (s.salaahEdited ? editedConfig() : window.OPS_SALAAH_CONFIG),
        scanStage: s.scanStage,
        scanApplied: s.scanApplied,
        expanded: s.expandedPrayer,
        note: s.salaahNote,
        history: timingHistory,
        historyOpen: s.salaahHistoryOpen,
        saving: s.salaahSaving,
        dirty: s.salaahDirty,
      },

      post: s.post,

      invitations: {
        status: s.invitationsStatus,
        items: invitations,
        actioning: s.invitationActioningId,
        acceptedId: s.invitationAcceptedId,
      },

      // Handlers pass straight through (absent on static frames), so adding a screen
      // handler never needs an edit here.
    }, handlers);
  }

  const AUDIO_READY = { uploading: false, failed: false, playing: false, progress: 0.32, duration: '0:24' };
  // Library sources for the photo frames; CMP_LIBRARY (compose-post.jsx) owns the real list.
  const LIB = [
    '../../images/masjid-camera-preview.png',
    '../../images/isha_masjid.webp',
    '../../images/maghrib_masjid.webp',
    '../../images/zohar_masjid.webp',
  ];
  const PHOTO = (i) => ({ id: `ph${i + 1}`, src: LIB[i % LIB.length] });
  const SAMPLE_MESSAGE = 'Taraweeh begins after Isha from tomorrow, in shaa Allah. Please bring your own musallah for the first week.';

  // ── Storyboard frames. Order = board order; every frame is one real state. ──
  const OPS_FRAMES = [
    // 01 · The console — eagle view of the masjid you manage
    { group: 'console', name: 'Loading', screen: 'console', state: { route: 'console', consoleStatus: 'loading' } },
    { group: 'console', name: 'Console · full admin', screen: 'console', state: { route: 'console', dest: 'home' } },
    { group: 'console', name: 'Console · can post', screen: 'console', state: { route: 'console', dest: 'home', role: 'IMAM', caps: ['post'] } },
    { group: 'console', name: 'Console · view only', screen: 'console', state: { route: 'console', dest: 'home', role: 'MUEZZIN', caps: [] } },
    // Nothing owed: the Needs-you block is absent rather than an empty card.
    { group: 'console', name: 'Nothing pending', screen: 'console', state: { route: 'console', dest: 'home', hidden: ['m5'] } },
    { group: 'console', name: 'Switch masjid', screen: 'console', state: { route: 'console', dest: 'home', switcherOpen: true } },
    { group: 'console', name: 'Second masjid', screen: 'console', state: { route: 'console', dest: 'home', masjidId: 'noor', role: 'SECRETARY' } },
    { group: 'console', name: 'No paighams yet', screen: 'console', state: { route: 'console', dest: 'home', postsEmpty: true } },
    { group: 'console', name: 'Scrolled · FAB compact', screen: 'console', state: { route: 'console', dest: 'home', fabCompact: true } },
    { group: 'console', name: 'Paigham options', screen: 'console', state: { route: 'console', dest: 'home', postMenuFor: 'p1' } },
    { group: 'console', name: 'Delete confirmation', screen: 'console', state: { route: 'console', dest: 'home', confirm: { kind: 'deletePost', id: 'p1' } } },
    { group: 'console', name: 'Deleting', screen: 'console', state: { route: 'console', dest: 'home', deletingId: 'p1' } },
    { group: 'console', name: 'Deleted · confirmation', screen: 'console', state: { route: 'console', dest: 'home', snack: { kind: 'post-deleted', message: 'Paigham deleted' } } },
    { group: 'console', name: 'Feed failed · retry', screen: 'console', state: { route: 'console', dest: 'home', postsStatus: 'error' } },
    { group: 'console', name: 'Masjid details', screen: 'console', state: { route: 'console', dest: 'details' } },
    { group: 'console', name: 'Details · read only', screen: 'console', state: { route: 'console', dest: 'details', role: 'MUEZZIN', caps: [] } },
    { group: 'console', name: 'Committee-only lock', screen: 'console', state: { route: 'console', consoleStatus: 'locked', caps: [] } },
    { group: 'console', name: 'Load failed · retry', screen: 'console', state: { route: 'console', consoleStatus: 'error' } },

    // 03 · Committee & permissions
    { group: 'members', name: 'Loading', screen: 'console', state: { route: 'console', dest: 'members', membersStatus: 'loading' } },
    { group: 'members', name: 'Committee · admin', screen: 'console', state: { route: 'console', dest: 'members' } },
    { group: 'members', name: 'Committee · read only', screen: 'console', state: { route: 'console', dest: 'members', role: 'MUEZZIN', caps: [] } },
    { group: 'members', name: 'None yet', screen: 'console', state: { route: 'console', dest: 'members', membersEmpty: true } },
    { group: 'members', name: 'Member permissions', screen: 'console', state: { route: 'console', dest: 'member', memberId: 'm3' } },
    { group: 'members', name: 'Member · role picker', screen: 'console', state: { route: 'console', dest: 'member', memberId: 'm3', openMenu: 'member-role' } },
    { group: 'members', name: 'Member · full admin', screen: 'console', state: { route: 'console', dest: 'member', memberId: 'm2' } },
    { group: 'members', name: 'Member · sole admin', screen: 'console', state: { route: 'console', dest: 'member', memberId: 'm1' } },
    { group: 'members', name: 'Member · invited', screen: 'console', state: { route: 'console', dest: 'member', memberId: 'm5' } },
    { group: 'members', name: 'Remove confirmation', screen: 'console', state: { route: 'console', dest: 'member', memberId: 'm4', confirm: { kind: 'removeMember', id: 'm4' } } },
    { group: 'members', name: 'Removed · confirmation', screen: 'console', state: { route: 'console', dest: 'members', snack: { kind: 'member-removed', message: 'Yusuf Ali removed from the committee' } } },
    { group: 'members', name: 'Load failed · retry', screen: 'console', state: { route: 'console', dest: 'members', membersStatus: 'error' } },

    // 04 · Invitations & followers
    { group: 'invite', name: 'Invite member', screen: 'console', state: { route: 'console', dest: 'invite' } },
    { group: 'invite', name: 'Role picker', screen: 'console', state: { route: 'console', dest: 'invite', invite: { phone: '98861 40219' }, openMenu: 'member-role' } },
    { group: 'invite', name: 'Permissions chosen', screen: 'console', state: { route: 'console', dest: 'invite', invite: { phone: '98861 40219', role: 'ASSISTANT_SECRETARY', caps: ['post'] } } },
    { group: 'invite', name: 'Sending', screen: 'console', state: { route: 'console', dest: 'invite', invite: { phone: '98861 40219', role: 'ASSISTANT_SECRETARY', caps: ['post'], sending: true } } },
    { group: 'invite', name: 'Invite failed', screen: 'console', state: { route: 'console', dest: 'invite', invite: { phone: '9886', role: 'MEMBER', error: 'Enter a valid 10-digit mobile number.' } } },
    { group: 'invite', name: 'Followers', screen: 'console', state: { route: 'console', dest: 'followers' } },
    { group: 'invite', name: 'Followers · loading more', screen: 'console', state: { route: 'console', dest: 'followers', followersLoadingMore: true } },
    { group: 'invite', name: 'Followers · loading', screen: 'console', state: { route: 'console', dest: 'followers', followersStatus: 'loading' } },
    { group: 'invite', name: 'Followers · none', screen: 'console', state: { route: 'console', dest: 'followers', followersEmpty: true } },

    // 05 · Salaah timings — public: any signed-in user, no review, every change recorded
    { group: 'salaah', name: 'Loading', screen: 'console', state: { route: 'console', dest: 'salaah', salaahStatus: 'loading' } },
    { group: 'salaah', name: 'Timings', screen: 'console', state: { route: 'console', dest: 'salaah' } },
    { group: 'salaah', name: 'Fixed-time editor', screen: 'console', state: { route: 'console', dest: 'salaah', expandedPrayer: 'fajr' } },
    { group: 'salaah', name: 'Varies-with-on-time', screen: 'console', state: { route: 'console', dest: 'salaah', expandedPrayer: 'asr' } },
    { group: 'salaah', name: 'Iqama delay picker', screen: 'console', state: { route: 'console', dest: 'salaah', expandedPrayer: 'fajr', openMenu: 'fajr-iqama' } },
    { group: 'salaah', name: 'Edited · publish enabled', screen: 'console', state: { route: 'console', dest: 'salaah', expandedPrayer: 'fajr', salaahDirty: true, salaahEdited: true } },
    { group: 'salaah', name: 'Reason for the change', screen: 'console', state: { route: 'console', dest: 'salaah', salaahDirty: true, salaahEdited: true, salaahNote: 'Isha was running late for the working brothers.' } },
    { group: 'salaah', name: 'Change history', screen: 'console', state: { route: 'console', dest: 'salaah', salaahHistoryOpen: true } },
    // Anyone can reach this screen, so the non-committee case is a first-class state.
    { group: 'salaah', name: 'Timings · not committee', screen: 'console', state: { route: 'console', dest: 'salaah', role: 'MEMBER', caps: [] } },
    { group: 'salaah', name: 'Scan · camera', screen: 'console', state: { route: 'console', dest: 'salaah', scanStage: 'camera' } },
    { group: 'salaah', name: 'Scan · reading the board', screen: 'console', state: { route: 'console', dest: 'salaah', scanStage: 'reading' } },
    { group: 'salaah', name: 'Scan · every prayer read', screen: 'console', state: { route: 'console', dest: 'salaah', scanApplied: 'full', salaahDirty: true } },
    { group: 'salaah', name: 'Scan · read 4 of 6', screen: 'console', state: { route: 'console', dest: 'salaah', scanApplied: 'partial', salaahDirty: true } },
    { group: 'salaah', name: 'Scan · could not read', screen: 'console', state: { route: 'console', dest: 'salaah', scanStage: 'failed' } },
    { group: 'salaah', name: 'Publish confirmation', screen: 'console', state: { route: 'console', dest: 'salaah', salaahDirty: true, salaahEdited: true, confirm: { kind: 'publishSalaah' } } },
    { group: 'salaah', name: 'Publishing', screen: 'console', state: { route: 'console', dest: 'salaah', salaahDirty: true, salaahSaving: true } },
    { group: 'salaah', name: 'Published', screen: 'console', state: { route: 'console', dest: 'salaah', salaahStatus: 'saved' } },
    { group: 'salaah', name: 'Save failed · retry', screen: 'console', state: { route: 'console', dest: 'salaah', salaahStatus: 'error' } },

    // 06 · Send a paigham — the guided wizard
    { group: 'create', name: 'Step 1 · empty', screen: 'create', state: { route: 'create' } },
    { group: 'create', name: 'Step 1 · written', screen: 'create', state: { route: 'create', post: { message: SAMPLE_MESSAGE } } },
    { group: 'create', name: 'Step 1 · too long', screen: 'create', state: { route: 'create', post: { message: SAMPLE_MESSAGE.repeat(10) } } },
    { group: 'create', name: 'Recorder · live', screen: 'create', state: { route: 'create', post: { recorder: { stage: 'recording', elapsed: '0:12' } } } },
    { group: 'create', name: 'Recorder · listen back', screen: 'create', state: { route: 'create', post: { recorder: { stage: 'review', elapsed: '0:24' } } } },
    { group: 'create', name: 'Recorder · mic blocked', screen: 'create', state: { route: 'create', post: { recorder: { stage: 'blocked' }, micBlocked: true } } },
    { group: 'create', name: 'Step 1 · voice attached', screen: 'create', state: { route: 'create', post: { audio: AUDIO_READY } } },
    { group: 'create', name: 'Step 1 · upload failed', screen: 'create', state: { route: 'create', post: { audio: { uploading: false, failed: true, duration: '0:24' } } } },
    { group: 'create', name: 'Step 2 · no photos', screen: 'create', state: { route: 'create', post: { step: 'photos', message: SAMPLE_MESSAGE } } },
    { group: 'create', name: 'Step 2 · library', screen: 'create', state: { route: 'create', post: { step: 'photos', message: SAMPLE_MESSAGE, picker: true } } },
    { group: 'create', name: 'Step 2 · crop', screen: 'create', state: { route: 'create', post: { step: 'photos', message: SAMPLE_MESSAGE, crop: { src: LIB[0], rotation: 0 } } } },
    { group: 'create', name: 'Step 2 · uploading', screen: 'create', state: { route: 'create', post: { step: 'photos', message: SAMPLE_MESSAGE, photos: [PHOTO(0), { id: 'ph2', src: LIB[1], uploading: true }] } } },
    { group: 'create', name: 'Step 2 · upload failed', screen: 'create', state: { route: 'create', post: { step: 'photos', message: SAMPLE_MESSAGE, photos: [PHOTO(0), { id: 'ph2', src: LIB[1], failed: true }] } } },
    { group: 'create', name: 'Step 2 · four added', screen: 'create', state: { route: 'create', post: { step: 'photos', message: SAMPLE_MESSAGE, photos: [PHOTO(0), PHOTO(1), PHOTO(2), PHOTO(3)] } } },
    { group: 'create', name: 'Step 3 · audience', screen: 'create', state: { route: 'create', post: { step: 'audience', message: SAMPLE_MESSAGE, photos: [PHOTO(0), PHOTO(1)] } } },
    { group: 'create', name: 'Step 3 · wider circle', screen: 'create', state: { route: 'create', post: { step: 'audience', message: SAMPLE_MESSAGE, audience: 'MASJID_MASLAK' } } },
    { group: 'create', name: 'Step 4 · review text', screen: 'create', state: { route: 'create', post: { step: 'review', message: SAMPLE_MESSAGE, photos: [PHOTO(0), PHOTO(1)] } } },
    { group: 'create', name: 'Step 4 · review voice', screen: 'create', state: { route: 'create', post: { step: 'review', audio: AUDIO_READY, audience: 'MASJID_PINCODE' } } },
    { group: 'create', name: 'Change the masjid', screen: 'create', state: { route: 'create', switcherOpen: true, post: { step: 'review', message: SAMPLE_MESSAGE, photos: [PHOTO(0), PHOTO(1)] } } },
    { group: 'create', name: 'Sending', screen: 'create', state: { route: 'create', post: { step: 'review', message: SAMPLE_MESSAGE, submitting: true } } },
    { group: 'create', name: 'Discard draft?', screen: 'create', state: { route: 'create', post: { message: SAMPLE_MESSAGE }, confirm: { kind: 'discardDraft' } } },
    { group: 'create', name: 'Sent · live', screen: 'sent', state: { route: 'sent' } },

    // 08 · Invitations inbox
    { group: 'invitations', name: 'Loading', screen: 'invitations', state: { route: 'invitations', invitationsStatus: 'loading' } },
    { group: 'invitations', name: 'Pending invitations', screen: 'invitations', state: { route: 'invitations' } },
    { group: 'invitations', name: 'Accepting', screen: 'invitations', state: { route: 'invitations', invitationActioningId: 'i1' } },
    { group: 'invitations', name: 'Accepted · open console', screen: 'invitations', state: { route: 'invitations', invitationAcceptedId: 'i1', snack: { kind: 'invitation-accepted', message: 'Invitation accepted' } } },
    { group: 'invitations', name: 'Decline confirmation', screen: 'invitations', state: { route: 'invitations', confirm: { kind: 'declineInvitation', id: 'i2' } } },
    { group: 'invitations', name: 'Last day', screen: 'invitations', state: { route: 'invitations', invitationActioningId: 'i2' } },
    { group: 'invitations', name: 'No invitations', screen: 'invitations', state: { route: 'invitations', invitationsEmpty: true } },
    { group: 'invitations', name: 'Load failed · retry', screen: 'invitations', state: { route: 'invitations', invitationsStatus: 'error' } },
  ];

  const OPS_GROUPS = [
    { id: 'console', num: '01', title: 'The console', icon: 'dashboard' },
    { id: 'members', num: '02', title: 'Committee & permissions', icon: 'groups' },
    { id: 'invite', num: '03', title: 'Invitations & followers', icon: 'person' },
    { id: 'salaah', num: '04', title: 'Salaah timings · public', icon: 'mosque_clock2' },
    { id: 'create', num: '05', title: 'Create a paigham', icon: 'edit' },
    { id: 'invitations', num: '06', title: 'My invitations', icon: 'mail' },
  ];

  Object.assign(window, {
    OPS_DEFAULT_STATE,
    OPS_FRAMES,
    OPS_GROUPS,
    opsApplyPatch: applyPatch,
    opsFrameState: frameState,
    opsMatchesFrame: matchesFrame,
    opsActiveFrameIndex: activeFrameIndex,
    buildOpsData,
    OPS_AUDIO_READY: AUDIO_READY,
    OPS_SAMPLE_MESSAGE: SAMPLE_MESSAGE,
  });
}());
