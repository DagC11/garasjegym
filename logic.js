// Ren logikk uten tilgang til lagring eller DOM. Alt som trengs sendes inn som parametre,
// så funksjonene kan testes med `npm test` (node --test).

/* ---------- Hjelpere ---------- */
export const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-5);
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const num = v => { if (v === '' || v == null) return null; const n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? null : n; };
export const fmt = n => n == null || n === '' || isNaN(n) ? '' : (Math.round(n * 100) / 100).toLocaleString('nb-NO', { maximumFractionDigits: 2 });
export const fmtIn = n => n == null || n === '' ? '' : String(Math.round(n * 100) / 100).replace('.', ',');
export const fmtDate = ts => new Date(ts).toLocaleDateString('nb-NO', { weekday: 'short', day: 'numeric', month: 'short' });
export const fmtDur = s => { s = Math.max(0, Math.round(s)); const m = Math.floor(s / 60), ss = s % 60; return m + ':' + String(ss).padStart(2, '0'); };
export const weekStart = ts => { const d = new Date(ts); const day = (d.getDay() + 6) % 7; d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - day); return d.getTime(); };
// Kalenderdager, ikke 24-timersbolker: ved sommertid er et døgn 23 eller 25 timer, så ms-aritmetikk bommer én time
export const addDays = (ts, n) => { const d = new Date(ts); d.setDate(d.getDate() + n); return d.getTime(); };
export const clone = o => JSON.parse(JSON.stringify(o));
export const paceText = (min, km) => min > 0 && km > 0 ? fmtDur(min * 60 / km) + ' /km' : '';

/* ---------- Pulssoner (Olympiatoppens intensitetsskala, % av makspuls) ---------- */
export const ZONES = { 1: [55, 72, 'Veldig rolig – du kan synge'], 2: [72, 82, 'Rolig – du kan prate i hele setninger'], 3: [82, 87, 'Moderat – bare korte setninger'], 4: [87, 92, 'Hardt – bare enkeltord'], 5: [92, 100, 'Svært hardt'] };
export const HR_STEP = 15; // sekunder mellom lagrede pulsprøver (en times økt = 240 prøver)
export function hrZone(bpm, hrMax) {
  if (!hrMax || !bpm) return 0;
  const pct = 100 * bpm / hrMax;
  let z = 0; for (let i = 1; i <= 5; i++) if (pct >= ZONES[i][0]) z = i;
  return z;
}
// z kan være «2» eller «1-2»
export function zoneInfo(z, hrMax) {
  const [a, b] = String(z).split('-').map(Number), hi = b || a;
  const lo = ZONES[a][0], up = ZONES[hi][1];
  return { cls: 'z' + hi, label: 'Sone ' + (b ? a + '–' + b : a), pct: `${lo}–${up} %`, bpm: hrMax ? `${Math.round(hrMax * lo / 100)}–${Math.round(hrMax * up / 100)} slag/min` : '', desc: ZONES[hi][2] };
}
// Sammendrag av pulsmålinger [[sekund, bpm], …]: snitt, maks og sekunder i hver sone
export function hrSummary(samples, hrMax) {
  if (!samples || samples.length < 2) return null;
  const bs = samples.map(s => s[1]), zones = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < samples.length - 1; i++) {
    const dt = Math.min(HR_STEP + 5, samples[i + 1][0] - samples[i][0]);
    if (hrMax) zones[hrZone(samples[i][1], hrMax)] += dt;
  }
  return { avg: Math.round(bs.reduce((a, b) => a + b, 0) / bs.length), max: Math.max(...bs), zones: hrMax ? zones : null, samples };
}

/* ---------- Vekt- og skiveberegning ---------- */
// plates = { '20': 6, '2.5': 4, … } = antall skiver totalt. impl = { kind, base, sides, step, max, list }
const U = 4; // 0,25 kg-enheter
let plateCache = {};
export const clearPlateCache = () => { plateCache = {}; };
// Færrest mulige skiver for hver oppnåelige vekt per side (dynamisk programmering over skivebeholdningen)
export function plateTable(plates, sides = 1) {
  const key = JSON.stringify([plates, sides]);
  if (plateCache[key]) return plateCache[key];
  const items = [];
  Object.entries(plates).map(([p, c]) => [+p, +c || 0]).sort((a, b) => b[0] - a[0])
    .forEach(([p, c]) => { for (let i = 0; i < Math.floor(c / sides); i++) items.push(p); });
  const best = new Map([[0, []]]);
  for (const p of items) {
    const u = Math.round(p * U);
    for (const [s, arr] of [...best.entries()]) {
      const cur = best.get(s + u);
      if (!cur || arr.length + 1 < cur.length) best.set(s + u, [...arr, p]);
    }
  }
  return (plateCache[key] = best);
}
export function options(impl, plates) {
  if (impl.kind === 'plates') return [...plateTable(plates, impl.sides || 1).keys()].map(u => impl.base + (u / U) * (impl.sides || 1)).sort((a, b) => a - b);
  if (impl.kind === 'dumbbell') return String(impl.list).split(/[;\s]+|,\s+/).map(num).filter(x => x != null).sort((a, b) => a - b);
  if (impl.kind === 'stack') { const a = []; for (let w = impl.step; w <= impl.max + 1e-9; w += impl.step) a.push(Math.round(w * 100) / 100); return a; }
  return null;
}
export function roundW(impl, w, plates) {
  if (w == null || isNaN(w)) return w;
  const o = options(impl, plates);
  if (!o || !o.length) return Math.round(w * 2) / 2;
  let best = o[0];
  for (const x of o) if (Math.abs(x - w) < Math.abs(best - w) - 1e-9) best = x;
  return best;
}
export function nextUp(impl, W, inc, plates) {
  const o = options(impl, plates);
  if (!o || !o.length) return Math.round((W + inc) * 2) / 2;
  let r = roundW(impl, W + inc, plates);
  if (r <= W + 1e-9) r = o.find(x => x > W + 1e-9) ?? W;
  return r;
}
export const groupPlates = arr => { const c = {}; arr.forEach(p => c[p] = (c[p] || 0) + 1); return Object.keys(c).map(Number).sort((a, b) => b - a).map(p => fmt(p) + (c[p] > 1 ? ' ×' + c[p] : '')).join(' · '); };
export function platesFor(impl, w, plates) {
  if (impl.kind !== 'plates' || !(w > 0)) return null;
  const per = (w - impl.base) / (impl.sides || 1);
  if (per < -1e-9) return { err: 'Under startvekten (' + fmt(impl.base) + ' kg)' };
  const u = per * U;
  if (Math.abs(u - Math.round(u)) > 1e-6) return { err: 'Ikke mulig med skivene dine' };
  const arr = plateTable(plates, impl.sides || 1).get(Math.round(u));
  return arr ? { arr } : { err: 'Ikke mulig med skivene dine' };
}
export function plateText(impl, w, plates) {
  const r = platesFor(impl, w, plates);
  if (!r) return '';
  if (r.err) return '⚠ ' + r.err;
  if (!r.arr.length) return impl.base ? 'Tom stang' : '';
  return ((impl.sides || 1) === 2 ? 'Per side: ' : 'Skiver: ') + groupPlates(r.arr);
}
// Manualer: 0,01 kg betyr «neste vekt i lista» (nextUp runder opp til første mulige)
export const defaultInc = (ex, impl) => ex.inc ?? (impl.kind === 'stack' ? impl.step : impl.kind === 'dumbbell' ? 0.01 : 2.5);
export function warmupSets(impl, W, plates) {
  if (!(W > 0)) return [];
  const out = [], base = impl.kind === 'plates' ? impl.base : 0;
  if (base > 0 && W - base >= 20) out.push({ w: base, r: 10 });
  for (const [pct, r] of [[0.4, 5], [0.6, 3], [0.8, 2]]) {
    const w = roundW(impl, W * pct, plates);
    if (w >= W - 1e-9 || w <= (out[out.length - 1]?.w ?? 0) + 1e-9 || w < base) continue;
    out.push({ w, r });
  }
  return out;
}

/* ---------- Historikk, forslag og PR ---------- */
// Brzycki opp til 10 reps, Epley over (lite hopp mellom 10 og 11, akseptert)
export const e1rm = (w, r) => !w || !r || r < 1 ? 0 : r === 1 ? w : r <= 10 ? w * 36 / (37 - r) : w * (1 + r / 30);
// Siste økter med øvelsen, nyeste først. Bare fullførte arbeidssett.
export function history(p, exId, limit = 5, beforeTs = Infinity) {
  const out = [];
  for (let i = p.workouts.length - 1; i >= 0 && out.length < limit; i--) {
    const wo = p.workouts[i];
    if (wo.date >= beforeTs) continue;
    const e = wo.exercises.find(e => e.exId === exId);
    if (!e) continue;
    const sets = e.sets.filter(s => s.done && !s.warm);
    if (sets.length) out.push({ date: wo.date, sets, woId: wo.id });
  }
  return out;
}
export const setsSummary = (sets, ex) => {
  let s;
  if (ex.type === 'cardio') return sets.map(s => fmt(num(s.w)) + ' min' + (num(s.r) ? ' / ' + fmt(num(s.r)) + ' km' : '')).join(', ');
  const unit = ex.type === 'time' ? ' s' : '';
  const ws = sets.map(s => num(s.w) || 0), same = ws.every(w => w === ws[0]);
  if (same) s = (ws[0] ? fmt(ws[0]) + ' kg × ' : '') + sets.map(s => fmt(num(s.r))).join(', ') + unit;
  else s = sets.map(s => (num(s.w) ? fmt(num(s.w)) + '×' : '') + fmt(num(s.r)) + unit).join(', ');
  if (sets.some(x => x.rir != null)) s += ' · RIR ' + sets.map(x => x.rir ?? '–').join('/');
  return s;
};
// Forslag til vekt og reps. H = history(p, ex.id, 3). Returnerer { w, reps[], note, tone? }
export function suggest(pex, ex, impl, H, plates) {
  const fill = v => Array(pex.sets).fill(v);
  const range = pex.min === pex.max ? String(pex.min) : pex.min + '–' + pex.max;
  if (ex.type === 'cardio') return { w: null, reps: [], note: '' };
  if (!H.length) return { w: null, reps: fill(range), note: 'Første gang: velg en vekt der du har 2–3 reps igjen i tanken.' };
  const last = H[0], ls = setsSummary(last.sets, ex);
  const W = Math.max(...last.sets.map(s => num(s.w) || 0));
  const inc = pex.inc ?? defaultInc(ex, impl);
  if (ex.type === 'time' || pex.rule === 'none') return { w: W || null, reps: fill(range), note: 'Sist: ' + ls + '.' };
  const enough = last.sets.length >= pex.sets;
  // RIR fra sist gir et hint, men endrer ikke regelen
  const rirs = last.sets.map(s => s.rir).filter(r => r != null);
  const allToFailure = rirs.length === last.sets.length && rirs.every(r => r === 0);
  const easy = rirs.length === last.sets.length && rirs.every(r => r >= 3);
  const upHint = allToFailure ? ' Alle sett gikk til feil sist – vurder å holde vekta en økt til.' : '';
  const sameHint = easy ? ' Mye igjen i tanken sist (RIR 3+) – øk gjerne vekta.' : '';
  if (pex.rule === 'double') {
    if (enough && last.sets.every(s => (num(s.r) || 0) >= pex.max)) {
      const nw = nextUp(impl, W, inc, plates);
      return { w: nw, reps: fill(pex.min), note: `Sist: ${ls}. Toppen av intervallet på alle sett → ${fmt(nw)} kg i dag.${upHint}`, tone: 'up' };
    }
    const reps = Array.from({ length: pex.sets }, (_, i) => Math.min(pex.max, Math.max(pex.min, (num(last.sets[i]?.r) || pex.min) + 1)));
    return { w: W, reps, note: `Sist: ${ls}. Samme vekt – slå repsene fra sist.${sameHint}` };
  }
  // linear
  if (enough && last.sets.every(s => (num(s.r) || 0) >= pex.min)) {
    const nw = nextUp(impl, W, inc, plates);
    return { w: nw, reps: fill(pex.min), note: `Sist: ${ls} ✓ → ${fmt(nw)} kg i dag.${upHint}`, tone: 'up' };
  }
  let fails = 0;
  for (const h of H) {
    const hw = Math.max(...h.sets.map(s => num(s.w) || 0));
    if (hw !== W) break;
    if (h.sets.length >= pex.sets && h.sets.every(s => (num(s.r) || 0) >= pex.min)) break;
    fails++;
  }
  if (fails >= 2) {
    const nw = roundW(impl, impl.kind === 'plates' ? Math.round(W * 0.9 / 2.5) * 2.5 : W * 0.9, plates);
    return { w: nw, reps: fill(pex.min), note: `Bommet på ${fmt(W)} kg to økter på rad → ta ned til ${fmt(nw)} kg og bygg opp igjen.`, tone: 'down' };
  }
  return { w: W, reps: fill(pex.min), note: `Sist: ${ls}. Prøv ${fmt(W)} kg igjen.` };
}
export function bestOf(sets, ex) {
  let e = 0, w = 0, r = 0;
  for (const s of sets) { if (s.warm) continue; const sw = num(s.w) || 0, sr = num(s.r) || 0; e = Math.max(e, e1rm(sw, sr)); w = Math.max(w, sw); r = Math.max(r, sr); }
  return { e, w, r };
}
// Nye rekorder i økta wo sammenlignet med alt før. EX = oppslag id → øvelse
export function computePRs(p, wo, EX) {
  const prs = [];
  for (const e of wo.exercises) {
    const ex = EX(e.exId);
    if (ex.type === 'cardio') continue;
    const prev = history(p, e.exId, 9999, wo.date);
    if (!prev.length) continue;
    const old = prev.reduce((a, h) => { const b = bestOf(h.sets, ex); return { e: Math.max(a.e, b.e), w: Math.max(a.w, b.w), r: Math.max(a.r, b.r) }; }, { e: 0, w: 0, r: 0 });
    const now = bestOf(e.sets, ex);
    if (ex.type === 'time') { if (now.r > old.r) prs.push(`${ex.name}: ${fmt(now.r)} sek (før ${fmt(old.r)})`); continue; }
    if (now.w > old.w + 1e-9) prs.push(`${ex.name}: tyngste ${fmt(now.w)} kg (før ${fmt(old.w)})`);
    else if (now.e > old.e + 0.05) prs.push(`${ex.name}: estimert 1RM ${fmt(now.e)} kg (før ${fmt(old.e)})`);
  }
  return prs;
}

/* ---------- Program ---------- */
// Supersett-etiketter (A1, A2 …) for en liste med programøvelser
export function ssLabels(list) {
  return list.map((x, i) => {
    if (!x.ss) return '';
    const grp = list.filter(y => y.ss === x.ss);
    return grp.length > 1 ? x.ss + (grp.indexOf(x) + 1) : '';
  });
}
export const planSec = pl => (pl || []).reduce((a, s) => a + s.s, 0);
// Grovt tidsestimat: 45 s per sett + hvile; i supersett hviles det bare etter siste øvelse i runden
export function estMinutes(list, EX) {
  let sec = 0; const seen = new Set();
  list.forEach(x => {
    const ex = EX(x.exId);
    if (ex.type === 'cardio') { sec += planSec(x.plan) || 600; return; }
    if (x.ss && list.filter(y => y.ss === x.ss).length > 1) {
      if (seen.has(x.ss)) return; seen.add(x.ss);
      const grp = list.filter(y => y.ss === x.ss);
      sec += Math.max(...grp.map(y => y.sets)) * (grp.length * 45 + (grp[grp.length - 1].rest || 0));
    } else sec += x.sets * (45 + (x.rest || 0));
  });
  return Math.round(sec / 60);
}

/* ---------- Lagringsformat ---------- */
// Sjekker at en importert fil har strukturen appen forventer. Returnerer feilmelding, eller '' hvis OK.
export function validateDb(d) {
  if (!d || typeof d !== 'object' || !d.settings || typeof d.settings !== 'object' || !d.profiles || typeof d.profiles !== 'object') return 'Ikke en Garasjegym-fil';
  const ps = Object.values(d.profiles);
  if (!ps.length) return 'Filen har ingen profiler';
  for (const p of ps) {
    if (!p || typeof p !== 'object' || typeof p.name !== 'string' || !Array.isArray(p.programs) || !Array.isArray(p.workouts)) return `Profilen «${p?.name ?? '?'}» i filen er ødelagt`;
    if (p.workouts.some(w => !w || typeof w.date !== 'number' || !Array.isArray(w.exercises))) return `En økt hos «${p.name}» i filen er ødelagt`;
    if (p.programs.some(pr => !pr || !Array.isArray(pr.days))) return `Et program hos «${p.name}» i filen er ødelagt`;
  }
  if (!d.settings.impl || typeof d.settings.impl !== 'object') return 'Utstyrsoppsettet i filen er ødelagt';
  return '';
}
