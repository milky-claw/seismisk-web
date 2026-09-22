/* The demo pane, live-wired to the redactor API. Ruling 9: the visitor watches the build —
   the output types out symbol by symbol, a redacted span prints as black blocks and flips to
   its token, and the registry row appears at that same instant. Ruling 12: whatever /redact
   returns is what is drawn; the built-in sample is the fallback when the API is unreachable.
   Nothing typed here is logged, stored or sent anywhere but /redact and /rehydrate. */
const API = new URLSearchParams(location.search).get('api') || document.documentElement.dataset.api || 'https://pii-api.seismisk.com';

const SAMPLE = "Hello,\n\nThe card ending 4471 was charged $84.60 on the 3rd for my son's tuition, but your portal still shows the plan as overdue and has locked his classes. I spoke to your support team last week, and was told the two systems would sync overnight. They haven't. Could you clear the flag and confirm the charge went through? For your records: the account holder is Priya Castellanos, 17 Wexford Road, Apt 3, and the student's date of birth is 14 March 2016. You can call me on 555-014-0176 before 6pm, or reply to priya.castellanos@example.net rather than the portal inbox, which I don't check.\n\nThanks,\nPriya Castellanos";

/* The same text as the server's own segments — drawn only when the API call fails. */
const FALLBACK = [
  {"text": "Hello,\n\nThe card ending "},
  {"token": "[REDACTED_1]", "kind": "FINANCIAL_ID", "tier": "delete", "surface": "4471"},
  {"text": " was charged "},
  {"token": "[AMOUNT_1:medium]", "kind": "AMOUNT", "tier": "generalise", "surface": "$84.60"},
  {"text": " on the "},
  {"token": "[AMOUNT_2:low]", "kind": "AMOUNT", "tier": "generalise", "surface": "3rd"},
  {"text": " for my "},
  {"token": "[REDACTED_2]", "kind": "GENDER", "tier": "delete", "surface": "son"},
  {"text": "'s tuition, but your portal still shows the plan as "},
  {"token": "[PAYMENT_STATUS_1]", "kind": "PAYMENT_STATUS", "tier": "generalise", "surface": "overdue"},
  {"text": " and has locked "},
  {"token": "[REDACTED_3]", "kind": "GENDER", "tier": "delete", "surface": "his"},
  {"text": " classes. I spoke to your "},
  {"token": "[REDACTED_4]", "kind": "OCCUPATION", "tier": "delete", "surface": "support team"},
  {"text": " last week, and was told the two systems would sync overnight. They haven't. Could you clear the flag and confirm the charge went through? For your records: the account holder is "},
  {"token": "[PERSON_1]", "kind": "PERSON", "tier": "identity", "surface": "Priya Castellanos"},
  {"text": ", "},
  {"token": "[ADDRESS_1]", "kind": "ADDRESS", "tier": "identity", "surface": "17 Wexford Road, Apt 3"},
  {"text": ", and the student's date of birth is "},
  {"token": "[DOB_1]", "kind": "DOB", "tier": "identity", "surface": "14 March 2016"},
  {"text": ". You can call me on "},
  {"token": "[PHONE_1]", "kind": "PHONE", "tier": "identity", "surface": "555-014-0176"},
  {"text": " before "},
  {"token": "[PHONE_2]", "kind": "PHONE", "tier": "identity", "surface": "6pm"},
  {"text": ", or reply to "},
  {"token": "[EMAIL_1]", "kind": "EMAIL", "tier": "identity", "surface": "priya.castellanos@example.net"},
  {"text": " rather than the portal inbox, which I don't check.\n\nThanks,\n"},
  {"token": "[PERSON_1]", "kind": "PERSON", "tier": "identity", "surface": "Priya Castellanos"}
];

const SHORT = {identity: 'id', delete: 'del', generalise: 'gen'};
const LABEL = {identity: 'Identity', delete: 'Delete', generalise: 'Generalise'};

const $ = id => document.getElementById(id);
const input = $('input'), out = $('out'), reg = $('reg'), count = $('count'), timing = $('timing'),
      proto = $('proto'), wc = $('wc'), genBtn = $('gen'), redactBtn = $('redact'), rehydBtn = $('rehyd');
const tabs = [...document.querySelectorAll('.seg [data-view]')];
const tw = document.querySelector('.registry .tw');
const RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const state = {done: false, view: 'red', segs: [], timings: null, session: null, fallback: false, restored: null};
let rows = {};

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const rawText = () => state.segs.map(s => s.token === undefined ? s.text : s.surface).join('');
const redactedText = () => state.segs.map(s => s.token === undefined ? s.text : s.token).join('');
const rowsFrom = segs => {
  const seen = {}, list = [];
  for (const s of segs) {
    if (s.token === undefined) continue;
    if (!seen[s.token]) list.push(seen[s.token] = {token: s.token, kind: s.kind, tier: s.tier, surfaces_n: 0});
    seen[s.token].surfaces_n++;
  }
  return list;
};

function words() {
  const n = (input.value.trim().match(/\S+/g) || []).length;
  wc.textContent = n ? n + ' words' : '';
}

function view(v) {
  return state.segs.map(s => s.token === undefined ? esc(s.text)
    : '<mark class="' + (v === 'red' ? 't' : 'r') + ' t-' + SHORT[s.tier] + '">' + esc(v === 'red' ? s.token : s.surface) + '</mark>').join('');
}

function setTab(v) {
  state.view = v;
  tabs.forEach(b => b.setAttribute('aria-selected', String(b.dataset.view === v)));
  if (!state.done) return;
  out.className = 'out';
  out.innerHTML = (v === 'raw' && state.restored !== null && state.restored !== rawText()) ? esc(state.restored) : view(v);
}

/* The pre-state: sample loaded, nothing redacted yet. */
function arm() {
  Object.assign(state, {done: false, segs: [], timings: null, session: null, fallback: false, restored: null});
  rows = {};
  reg.innerHTML = '';
  count.textContent = '0';
  timing.hidden = true;
  proto.hidden = true;
  tabs.forEach(b => {b.disabled = true});
  rehydBtn.disabled = true;
  out.className = 'out empty';
  out.textContent = 'Press Redact.';
  setTab('red');
  redactBtn.disabled = false;
  redactBtn.textContent = 'Redact';
  redactBtn.setAttribute('aria-pressed', 'false');
}

function registryAdd(s) {
  const tr = rows[s.token];
  if (tr) {
    const seen = tr.lastElementChild;
    seen.textContent = String(Number(seen.textContent) + 1);
  } else {
    const row = document.createElement('tr');
    row.className = 'new';
    row.innerHTML = '<td></td><td></td><td><span class="tier t-' + SHORT[s.tier] + '">' + LABEL[s.tier] + '</span></td><td>1</td>';
    row.children[0].textContent = s.token;
    row.children[1].textContent = s.kind;
    reg.appendChild(row);
    rows[s.token] = row;
    count.textContent = String(Number(count.textContent) + 1);
  }
  tw.scrollTop = tw.scrollHeight;
}

function finish() {
  out.classList.remove('typing');
  state.done = true;
  if (state.timings) {
    const t = state.timings;
    timing.textContent = `rules ${t.D} ms · model G ${t.G} ms · model F ${t.F} ms · total ${t.total_ms} ms`;
    timing.hidden = false;
  }
  tabs.forEach(b => {b.disabled = false});
  rehydBtn.disabled = false;
  redactBtn.disabled = false;
  redactBtn.textContent = 'Redact';
  redactBtn.setAttribute('aria-pressed', 'false');
}

/* The typewriter. It advances per rendered frame, not on a 6 ms timer: a timer that fires
   faster than the browser paints skips whole spans, and a span whose blocks are never painted
   is exactly the moment ruling 9 is about. A flip also ends its frame, so the blocks it
   replaces are always on screen first. */
function play(resp) {
  const segs = resp.segments;
  Object.assign(state, {done: false, segs, timings: resp.timings, session: resp.session || null, restored: null});
  rows = {};
  reg.innerHTML = '';
  count.textContent = '0';
  timing.hidden = true;
  out.className = 'out';
  out.textContent = '';
  setTab('red');
  if (RM) {
    segs.forEach(s => {if (s.token !== undefined) registryAdd(s)});
    out.innerHTML = view('red');
    finish();
    return;
  }
  out.classList.add('typing');
  const N = segs.reduce((n, s) => n + (s.token === undefined ? s.text.length : s.surface.length), 0);
  const d = Math.max(5, Math.min(30, 20000 / N));
  let si = 0, ci = 0, node = null, mark = null, prev = 0, acc = 0;
  const blocksOf = s => Math.max(3, Math.min(12, s.surface.length));
  const atFlip = () => segs[si].token !== undefined && ci >= blocksOf(segs[si]);
  function one() {
    const s = segs[si];
    if (s.token === undefined) {
      if (ci === 0) out.appendChild(node = document.createTextNode(''));
      node.data += s.text[ci++];
      if (ci >= s.text.length) {si++; ci = 0; node = null}
    } else if (ci < blocksOf(s)) {
      if (ci === 0) {
        mark = document.createElement('mark');
        mark.className = 'blk t-' + SHORT[s.tier];
        out.appendChild(mark);
      }
      mark.textContent += '█';
      ci++;
    } else {                                    // last block is on screen: flip and file the token now
      mark.className = 't t-' + SHORT[s.tier];
      mark.textContent = s.token;
      registryAdd(s);
      si++; ci = 0; mark = null;
    }
  }
  requestAnimationFrame(function frame(now) {
    acc += prev ? Math.min(now - prev, 100) : d;   // d outlasts a frame now: bank the time, don't round it away
    prev = now;
    let budget = Math.floor(acc / d);
    acc -= budget * d;
    for (let drew = false; budget-- > 0 && si < segs.length; drew = true) {
      if (drew && atFlip()) break;              // the blocks get this frame; the flip gets the next
      one();
    }
    out.scrollTop = out.scrollHeight;
    if (si < segs.length) requestAnimationFrame(frame);
    else finish();
  });
}

async function redact() {
  const text = input.value;
  if (!text.trim()) {input.focus(); return}
  redactBtn.disabled = true;
  redactBtn.textContent = 'Redacting…';
  redactBtn.setAttribute('aria-pressed', 'true');
  state.fallback = false;
  proto.hidden = true;
  try {
    const r = await fetch(API + '/redact', {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({text})});
    if (!r.ok) throw new Error(r.status);
    play(await r.json());
  } catch (e) {
    if (text === SAMPLE) {
      state.fallback = true;
      proto.hidden = false;
      play({segments: FALLBACK, registry: rowsFrom(FALLBACK), timings: null});
    } else {
      out.className = 'out empty';
      out.textContent = 'Live redaction is unavailable right now.';
      redactBtn.disabled = false;
      redactBtn.textContent = 'Redact';
      redactBtn.setAttribute('aria-pressed', 'false');
    }
  }
}

async function rehydrate() {
  if (!state.done) return;
  if (state.fallback) {state.restored = SAMPLE; setTab('raw'); return}
  try {
    const r = await fetch(API + '/rehydrate', {method: 'POST', headers: {'content-type': 'application/json'},
                                               body: JSON.stringify({redacted: redactedText(), session: state.session})});
    if (r.status === 404) {redact(); return}            // session expired: build it again
    if (!r.ok) throw new Error(r.status);
    state.restored = (await r.json()).text;
  } catch (e) {/* the segments already hold the originals */}
  setTab('raw');
}

/* Ruling 15: the sample is written, not pasted — the visitor sees where the text comes from. */
let generating = false;

function generate() {
  if (generating) return;
  generating = true;
  genBtn.disabled = true;
  genBtn.textContent = 'Generating…';
  arm();
  input.readOnly = true;
  input.value = '';
  words();
  const typed = () => {
    input.readOnly = false;
    genBtn.textContent = 'Generate sample';
    genBtn.disabled = false;
    generating = false;
    setTimeout(redact, RM ? 0 : 700);
  };
  if (RM) {input.value = SAMPLE; words(); typed(); return}
  setTimeout(() => {
    let i = 0;
    const t = setInterval(() => {
      input.value = SAMPLE.slice(0, ++i);
      words();
      if (i >= SAMPLE.length) {clearInterval(t); typed()}
    }, 8);
  }, 600);
}

genBtn.addEventListener('click', generate);
$('redact').addEventListener('click', redact);
rehydBtn.addEventListener('click', rehydrate);
tabs.forEach(b => b.addEventListener('click', () => {if (state.done) setTab(b.dataset.view)}));
input.addEventListener('input', () => {words(); if (state.done) arm()});

input.value = SAMPLE;
words();
arm();

if (window.IntersectionObserver) {
  const io = new IntersectionObserver(es => {
    if (!es.some(e => e.isIntersecting)) return;
    io.disconnect();
    setTimeout(redact, RM ? 0 : 1200);
  }, {threshold: 0.4});
  io.observe($('demo'));
} else {
  setTimeout(redact, 1200);
}

/* modal */
const modal = $('modal'), form = $('form'), done = $('done'), err = $('err');
let last = null;

function openModal() {
  last = document.activeElement;
  form.hidden = false;
  done.hidden = true;
  err.hidden = true;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  const f = form.querySelector('input');
  if (f) setTimeout(() => f.focus(), 30);
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
  if (last && last.focus) last.focus();
}

document.querySelectorAll('[data-cta]').forEach(b => b.addEventListener('click', openModal));
modal.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeModal));
document.addEventListener('keydown', e => {if (e.key === 'Escape' && !modal.hidden) closeModal()});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const f = form.elements;
  let ok = ['name', 'email', 'message'].every(n => f[n].value.trim());
  if (ok && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value)) ok = false;
  if (!ok) {
    err.textContent = 'Name, email and message are needed.';
    err.hidden = false;
    const first = ['name', 'email', 'message'].map(n => f[n]).filter(x => !x.value.trim())[0];
    (first || f.email).focus();
    return;
  }
  err.hidden = true;
  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true;
  try {
    const r = await fetch(API + '/contact', {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({
      name: f.name.value, email: f.email.value, phone: f.phone.value, use_case: f.use_case.value,
      message: f.message.value, website: f.website.value,
      turnstile: (window.turnstile && window.turnstile.getResponse && window.turnstile.getResponse()) || ''})});
    if (r.ok) {form.hidden = true; done.hidden = false; done.querySelector('button').focus(); return}
    err.textContent = r.status === 429 ? 'Too many messages from this address — try again in an hour.'
      : r.status === 403 ? 'The anti-bot check failed — reload and try again.'
      : 'Could not send — email olegs@seismisk.com directly.';
  } catch (e) {
    err.textContent = 'Could not send — email olegs@seismisk.com directly.';
  }
  err.hidden = false;
  btn.disabled = false;
});

/* Turnstile only exists once the operator puts a sitekey on <html data-turnstile>. */
const sitekey = document.documentElement.dataset.turnstile;
if (sitekey) {
  const ts = $('ts');
  ts.dataset.sitekey = sitekey;
  ts.hidden = false;
  const s = document.createElement('script');
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
  s.async = s.defer = true;
  document.head.appendChild(s);
}
