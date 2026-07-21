const OP_GROUPS = [
  {
    title: 'Admin console', icon: 'admin_panel_settings',
    frames: [
      { journey: 'admin', state: 'loading', name: 'Loading' },
      { journey: 'admin', state: 'content', name: 'Console' },
      { journey: 'admin', state: 'restricted', name: 'Role restricted' },
      { journey: 'admin', state: 'error', name: 'Error + retry' },
    ],
  },
  {
    title: 'Members', icon: 'groups',
    frames: [
      { journey: 'members', state: 'loading', name: 'Loading' },
      { journey: 'members', state: 'content', name: 'Members' },
      { journey: 'members', state: 'empty', name: 'Empty' },
      { journey: 'members', state: 'confirm', name: 'Remove confirmation' },
      { journey: 'members', state: 'error', name: 'Error + retry' },
    ],
  },
  {
    title: 'Invitations', icon: 'mail',
    frames: [
      { journey: 'invitations', state: 'loading', name: 'Loading' },
      { journey: 'invitations', state: 'content', name: 'Pending invites' },
      { journey: 'invitations', state: 'empty', name: 'Empty' },
      { journey: 'invitations', state: 'success', name: 'Accepted' },
      { journey: 'invitations', state: 'error', name: 'Action failed' },
    ],
  },
  {
    title: 'Create post', icon: 'edit_square',
    frames: [
      { journey: 'create', state: 'content', name: 'Draft' },
      { journey: 'create', state: 'validation', name: 'Validation' },
      { journey: 'create', state: 'loading', name: 'Uploading' },
      { journey: 'create', state: 'success', name: 'Submitted' },
      { journey: 'create', state: 'error', name: 'Upload failed' },
    ],
  },
  {
    title: 'Post verification', icon: 'verified',
    frames: [
      { journey: 'verification', state: 'content', name: 'Verification pending' },
    ],
  },
  {
    title: 'Post administration', icon: 'article',
    frames: [
      { journey: 'posts', state: 'loading', name: 'Loading' },
      { journey: 'posts', state: 'content', name: 'Published posts' },
      { journey: 'posts', state: 'empty', name: 'Empty' },
      { journey: 'posts', state: 'confirm', name: 'Delete confirmation' },
      { journey: 'posts', state: 'error', name: 'Error + retry' },
    ],
  },
  {
    title: 'Salaah configuration', icon: 'schedule',
    frames: [
      { journey: 'salaah', state: 'loading', name: 'Loading' },
      { journey: 'salaah', state: 'content', name: 'Edit timings' },
      { journey: 'salaah', state: 'review', name: 'Review changes' },
      { journey: 'salaah', state: 'success', name: 'Saved' },
      { journey: 'salaah', state: 'error', name: 'Save failed' },
    ],
  },
];

const OP_STATES = OP_GROUPS.flatMap(g => g.frames);

const titleFor = journey => ({
  admin: 'Masjid Console', members: 'Members', invitations: 'Invitations',
  create: 'Create Post', verification: 'Post Verification', posts: 'Manage Posts',
  salaah: 'Salaah Configuration',
}[journey]);

function OperationTopBar({ title }) {
  return (
    <div className="op-topbar">
      <button className="ib md" aria-label="Back"><span className="mi" data-i="arrow_back"></span></button>
      <div className="op-title">{title}</div>
      <div className="op-top-spacer"></div>
    </div>
  );
}

function StatusState({ state, journey }) {
  if (state === 'loading') return (
    <div className="op-status"><div className="op-loader"></div><div className="op-status-copy">Loading {titleFor(journey).toLowerCase()}…</div></div>
  );
  const emptyCopy = {
    members: ['No committee members yet', 'Invite trusted members to help manage this masjid.'],
    invitations: ['No pending invitations', 'New invitations will appear here.'],
    posts: ['No posts yet', 'Create the first update for your community.'],
  }[journey] || ['Nothing here yet', 'Content will appear here when it is available.'];
  if (state === 'empty') return (
    <div className="op-status"><span className="mi op-status-icon" data-i="inbox"></span><div className="op-status-title">{emptyCopy[0]}</div><div className="op-status-copy">{emptyCopy[1]}</div></div>
  );
  if (state === 'error') return (
    <div className="op-status"><span className="mi op-status-icon error" data-i="cloud_off"></span><div className="op-status-title">Couldn't complete that</div><div className="op-status-copy">Check your connection and try again. Your changes are still here.</div><button className="btn btn-filled lg">Try again</button></div>
  );
  return null;
}

function ActionRow({ icon, title, copy, destructive = false }) {
  return (
    <div className="op-row">
      <span className={`mi op-row-icon ${destructive ? 'destructive' : ''}`} data-i={icon}></span>
      <div className="op-row-copy"><div className="op-row-title">{title}</div>{copy && <div className="op-row-sub">{copy}</div>}</div>
      <span className="mi op-chevron" data-i="chevron_right"></span>
    </div>
  );
}

function DialogOverlay({ journey }) {
  const isMember = journey === 'members';
  return (
    <div className="op-dialog-scrim">
      <div className="op-dialog">
        <div className="op-status-title">{isMember ? 'Remove this member?' : 'Delete this post?'}</div>
        <div className="op-status-copy">{isMember ? 'They will lose access to masjid management.' : 'This post will be removed for everyone and cannot be restored.'}</div>
        <button className="btn btn-filled lg op-destructive">{isMember ? 'Remove member' : 'Delete post'}</button>
        <button className="btn btn-tonal lg">Cancel</button>
      </div>
    </div>
  );
}

function OperationContent({ data }) {
  const { journey, state } = data;
  if (['loading', 'empty', 'error'].includes(state)) return <StatusState state={state} journey={journey} />;
  if (journey === 'admin') {
    if (state === 'restricted') return <div className="op-status"><span className="mi op-status-icon" data-i="lock"></span><div className="op-status-title">Admin access required</div><div className="op-status-copy">Ask an owner or admin to update your committee role.</div><button className="btn btn-tonal lg">Back to Home</button></div>;
    return <div className="op-content"><div className="op-hero"><span className="mi" data-i="mosque"></span><div><div className="op-status-title">Masjid E Bilal</div><div className="op-status-copy">Admin console</div></div></div><ActionRow icon="groups" title="Members" copy="Roles and access"/><ActionRow icon="article" title="Posts" copy="Publish and moderate"/><ActionRow icon="schedule" title="Salaah timings" copy="Azaan and iqama"/><ActionRow icon="settings" title="Masjid details" copy="Address and profile"/></div>;
  }
  if (journey === 'members') return <div className="op-content"><div className="op-search"><span className="mi" data-i="search"></span>Search members</div>{['Salim Shaikh · Owner','Ayaan Khan · Admin','Yusuf Ali · Member'].map((x,i)=><ActionRow key={x} icon="person" title={x.split(' · ')[0]} copy={x.split(' · ')[1]} destructive={i===2}/>) }{state === 'confirm' && <DialogOverlay journey={journey}/>}</div>;
  if (journey === 'invitations') {
    if (state === 'success') return <div className="op-status"><span className="mi op-status-icon success" data-i="check_circle"></span><div className="op-status-title">Invitation accepted</div><div className="op-status-copy">Masjid E Bilal is now available in your console.</div><button className="btn btn-filled lg">Open console</button></div>;
    return <div className="op-content"><div className="op-card"><div className="op-row-title">Masjid E Bilal</div><div className="op-row-sub">Admin invitation · sent by Salim Shaikh</div><div className="op-actions"><button className="btn btn-filled lg">Accept</button><button className="btn btn-tonal lg">Decline</button></div></div></div>;
  }
  if (journey === 'create') {
    if (state === 'success') return <div className="op-status"><span className="mi op-status-icon success" data-i="check_circle"></span><div className="op-status-title">Post submitted</div><div className="op-status-copy">It is now visible to followers of Masjid E Bilal.</div><button className="btn btn-filled lg">Done</button></div>;
    return <div className="op-content"><div className={`op-field ${state === 'validation' ? 'invalid' : ''}`}>Share an update with your community…</div>{state === 'validation' && <div className="op-field-error">Add a message, image, or audio recording.</div>}<div className="op-media-row"><button className="btn btn-tonal lg">Add photo</button><button className="btn btn-tonal lg">Record audio</button></div>{state === 'loading' && <div className="op-progress"><span></span></div>}<button className="btn btn-filled lg">Publish post</button></div>;
  }
  if (journey === 'verification') return <div className="op-status"><span className="mi op-status-icon" data-i="hourglass_top"></span><div className="op-status-title">Verification in progress</div><div className="op-status-copy">Your first post is being reviewed. We'll notify you when posting is unlocked.</div><button className="btn btn-filled lg">Done — take me home</button></div>;
  if (journey === 'posts') return <div className="op-content">{['Ramadhan programme','Friday bayan','Community update'].map(x=><ActionRow key={x} icon="article" title={x} copy="Published"/>)}{state === 'confirm' && <DialogOverlay journey={journey}/>}</div>;
  if (journey === 'salaah') {
    if (state === 'success') return <div className="op-status"><span className="mi op-status-icon success" data-i="check_circle"></span><div className="op-status-title">Salaah timings saved</div><div className="op-status-copy">Followers will see the updated timings immediately.</div><button className="btn btn-filled lg">Done</button></div>;
    if (state === 'review') return <div className="op-content"><div className="op-status-title">Review changes</div><div className="op-card"><div className="op-summary"><span>Fajr iqama</span><b>05:42 → 05:50</b></div><div className="op-summary"><span>Isha iqama</span><b>20:15 → 20:30</b></div></div><button className="btn btn-filled lg">Confirm and save</button><button className="btn btn-tonal lg">Keep editing</button></div>;
    return <div className="op-content">{['Fajr','Zohar','Asr','Maghrib','Isha','Jumah'].map((x,i)=><div className="op-time" key={x}><b>{x}</b><span>{['05:18','12:46','16:32','18:57','20:15','13:20'][i]}</span><span className="mi" data-i="edit"></span></div>)}<button className="btn btn-filled lg">Review changes</button></div>;
  }
  return null;
}

function OperationScreen({ data = OP_STATES[0] }) {
  return <div className="op-screen"><OperationTopBar title={titleFor(data.journey)}/><OperationContent data={data}/></div>;
}

function OperationsBoard({ active = 0, onSelectFrame }) {
  let offset = 0;
  return <div>{OP_GROUPS.map(group => {
    const start = offset; offset += group.frames.length;
    return <div key={group.title}><div className="poc-row-label"><span className="mi" data-i={group.icon}></span>{group.title} · {group.frames.length} states</div><div className="poc-board">{group.frames.map((frame,i)=>{const index=start+i;return <div key={frame.name} className="poc-board-item" onClick={()=>onSelectFrame&&onSelectFrame(index)}><div className={`noor-frame ${active===index?'is-active':''}`} style={{'--s':'0.46',cursor:'pointer'}}><div className="noor-frame-inner"><div className="noor-screen"><div className="noor-island"></div><OperationScreen data={frame}/><div className="noor-home"></div></div></div></div><div className="poc-frame-caption">{index+1} · {frame.name}</div></div>})}</div></div>;
  })}</div>;
}

Object.assign(window, { OperationScreen, OperationsBoard, MASJID_OPERATION_STATES: OP_STATES });
