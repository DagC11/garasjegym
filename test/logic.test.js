// Kjør med `npm test` (node --test). Tester den rene logikken i logic.js uten nettleser.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { plateTable, options, roundW, nextUp, platesFor, plateText, warmupSets, e1rm, history, suggest, bestOf, computePRs,
  setsSummary, ssLabels, estMinutes, hrSummary, hrZone, zoneInfo, validateDb, addDays, weekStart, num, fmtDur, paceText } from '../logic.js';
import * as L from '../logic.js';
import { DEFAULT_PLATES, DEFAULT_IMPL, BUILTIN } from '../data.js';

const PL = DEFAULT_PLATES;
const bar = DEFAULT_IMPL.barbell, db = DEFAULT_IMPL.db, cable = DEFAULT_IMPL.cable, leg = DEFAULT_IMPL.legpress;
const EX = id => BUILTIN.find(e => e.id === id);
const wo = (date, exId, sets) => ({ id: 'w' + date, date, exercises: [{ exId, sets: sets.map(([w, r, rir]) => ({ w, r, warm: false, done: true, ...(rir != null ? { rir } : {}) })) }] });

test('skiver: færrest skiver og riktig per side', () => {
  assert.deepEqual(platesFor(bar, 100, PL).arr, [20, 20]);
  assert.deepEqual(platesFor(bar, 62.5, PL).arr, [20, 1.25]);
  assert.equal(plateText(bar, 20, PL), 'Tom stang');
  assert.equal(plateText(bar, 100, PL), 'Per side: 20 ×2');
  assert.match(platesFor(bar, 15, PL).err, /Under startvekten/);
  assert.match(platesFor(bar, 100.1, PL).err, /Ikke mulig/);
});
test('skiver: begrenset beholdning', () => {
  // 6 × 20 kg totalt → 3 per side → maks 60 per side + stang
  const t = plateTable({ '20': 6 }, 2);
  assert.ok(t.has(60 * 4)); assert.ok(!t.has(80 * 4));
  assert.deepEqual(platesFor({ kind: 'plates', base: 0, sides: 1 }, 100, { '20': 5 }, PL).arr, [20, 20, 20, 20, 20]);
});
test('avrunding og neste vekt', () => {
  assert.equal(roundW(bar, 61, PL), 61);           // 20 + 2×(20+0.5) → mulig
  assert.equal(roundW(bar, 61.2, PL), 61);
  assert.equal(nextUp(bar, 60, 2.5, PL), 62.5);
  assert.equal(nextUp(db, 12, 0.01, PL), 14);      // manual: neste i lista
  assert.equal(nextUp(db, 41, 0.01, PL), 41);      // tyngste manual – blir stående
  assert.equal(nextUp(cable, 45, 5, PL), 50);
  assert.deepEqual(options(cable, PL).slice(0, 3), [5, 10, 15]);
});
test('oppvarmingssett', () => {
  const ws = warmupSets(bar, 100, PL);
  assert.deepEqual(ws.map(x => x.w), [20, 40, 60, 80]);
  assert.deepEqual(warmupSets(bar, 30, PL).map(x => x.w), [20, 23.5]);  // lett vekt: tom stang + 80 %
  assert.deepEqual(warmupSets(bar, 0, PL), []);
  assert.deepEqual(warmupSets(leg, 200, PL).map(x => x.w), [80, 120, 160]);
});
test('e1rm: Brzycki ≤ 10, Epley over', () => {
  assert.equal(e1rm(100, 1), 100);
  assert.ok(Math.abs(e1rm(100, 5) - 112.5) < 0.01);
  assert.ok(Math.abs(e1rm(100, 12) - 140) < 0.01);
  assert.equal(e1rm(0, 5), 0);
});
test('historikk: nyeste først, bare arbeidssett', () => {
  const p = { workouts: [wo(1, 'squat', [[100, 5]]), wo(2, 'bench', [[80, 5]]), wo(3, 'squat', [[105, 5]])] };
  p.workouts[2].exercises[0].sets.unshift({ w: 60, r: 5, warm: true, done: true });
  const h = history(p, 'squat');
  assert.equal(h.length, 2); assert.equal(h[0].date, 3); assert.equal(h[0].sets.length, 1);
  assert.equal(history(p, 'squat', 5, 3).length, 1);
});
test('forslag: dobbel progresjon', () => {
  const ex = EX('bench'), pex = { sets: 3, min: 8, max: 12, rule: 'double', inc: null };
  assert.equal(suggest(pex, ex, bar, [], PL).w, null);
  let s = suggest(pex, ex, bar, [{ sets: [[80, 12], [80, 12], [80, 12]].map(([w, r]) => ({ w, r })) }], PL);
  assert.equal(s.w, 82.5); assert.equal(s.tone, 'up'); assert.deepEqual(s.reps, [8, 8, 8]);
  s = suggest(pex, ex, bar, [{ sets: [[80, 12], [80, 10], [80, 9]].map(([w, r]) => ({ w, r })) }], PL);
  assert.equal(s.w, 80); assert.deepEqual(s.reps, [12, 11, 10]);
});
test('forslag: lineær med nedtrapping etter to bom', () => {
  const ex = EX('squat'), pex = { sets: 3, min: 5, max: 5, rule: 'linear', inc: null };
  const ok = { sets: [[100, 5], [100, 5], [100, 5]].map(([w, r]) => ({ w, r })) };
  const miss = { sets: [[100, 5], [100, 4], [100, 3]].map(([w, r]) => ({ w, r })) };
  assert.equal(suggest(pex, ex, bar, [ok], PL).w, 105);          // inc 5 på knebøy
  assert.equal(suggest(pex, ex, bar, [miss], PL).w, 100);
  const down = suggest(pex, ex, bar, [miss, miss, ok], PL);
  assert.equal(down.w, 90); assert.equal(down.tone, 'down');
});
test('forslag: RIR gir hint uten å endre vekta', () => {
  const ex = EX('bench'), pex = { sets: 2, min: 8, max: 12, rule: 'double', inc: null };
  const s = suggest(pex, ex, bar, [{ sets: [{ w: 80, r: 12, rir: 0 }, { w: 80, r: 12, rir: 0 }] }], PL);
  assert.equal(s.w, 82.5); assert.match(s.note, /gikk til feil/);
  const e = suggest(pex, ex, bar, [{ sets: [{ w: 80, r: 9, rir: 3 }, { w: 80, r: 9, rir: 4 }] }], PL);
  assert.equal(e.w, 80); assert.match(e.note, /RIR 3\+/);
});
test('sammendrag og rekorder', () => {
  const ex = EX('bench');
  assert.equal(setsSummary([{ w: 80, r: 8 }, { w: 80, r: 7 }], ex), '80 kg × 8, 7');
  assert.equal(setsSummary([{ w: 80, r: 8, rir: 2 }, { w: 85, r: 5, rir: 0 }], ex), '80×8, 85×5 · RIR 2/0');
  assert.equal(setsSummary([{ w: 20, r: 3.1 }], EX('treadmill')), '20 min / 3,1 km');
  const p = { workouts: [wo(1, 'bench', [[80, 8]]), wo(2, 'bench', [[82.5, 8]])] };
  assert.deepEqual(computePRs(p, p.workouts[1], EX), ['Benkpress: tyngste 82,5 kg (før 80)']);
  assert.deepEqual(computePRs(p, p.workouts[0], EX), []);  // ingenting før
  assert.equal(bestOf([{ w: 80, r: 8 }, { w: 60, r: 10, warm: true }], ex).w, 80);
});
test('supersett-etiketter og tidsestimat', () => {
  const l = [{ exId: 'squat', sets: 3, rest: 120, ss: 'A' }, { exId: 'bench', sets: 3, rest: 90, ss: 'A' }, { exId: 'plank', sets: 2, rest: 60 }];
  assert.deepEqual(ssLabels(l), ['A1', 'A2', '']);
  assert.equal(estMinutes(l, EX), Math.round((3 * (2 * 45 + 90) + 2 * 105) / 60));
});
test('puls: soner og sammendrag', () => {
  assert.equal(hrZone(150, 190), 2); assert.equal(hrZone(100, 190), 0); assert.equal(hrZone(180, 190), 5);
  assert.equal(zoneInfo('1-2', 190).label, 'Sone 1–2');
  const s = hrSummary([[0, 140], [15, 150], [30, 170], [600, 100]], 190);
  assert.equal(s.avg, 140); assert.equal(s.max, 170);
  assert.equal(s.zones[2], 30);                 // 140 og 150 er sone 2, 15 s hver
  assert.equal(s.zones[4], 20);                 // 170 = 89 % → sone 4, gap på 570 s kappes til 20
  assert.equal(hrSummary([[0, 140]], 190), null);
});
test('validering av lagringsformat', () => {
  assert.equal(validateDb({ settings: { impl: {} }, profiles: { a: { name: 'A', programs: [], workouts: [] } } }), '');
  assert.match(validateDb(null), /Ikke en/);
  assert.match(validateDb({ settings: {}, profiles: {} }), /ingen profiler/);
  assert.match(validateDb({ settings: { impl: {} }, profiles: { a: { name: 'A', programs: [], workouts: [{}] } } }), /økt/);
});
test('datoer: ukestart og kalenderdager over sommertid', () => {
  process.env.TZ = 'Europe/Oslo';
  const mon = new Date('2026-11-02T00:00:00+01:00').getTime();
  assert.equal(weekStart(new Date('2026-11-04T12:00:00+01:00').getTime()), mon);
  assert.equal(new Date(addDays(mon, -14)).getHours(), 0);   // 19. okt 00:00, ikke 01:00
  assert.equal(addDays(mon, -14) - new Date('2026-10-19T00:00:00+02:00').getTime(), 0);
});
test('intervallplan: flat ↔ blokker', () => {
  const { planToBlocks, blocksToPlan } = L;
  const plan = [{ t: 'Oppvarming', s: 600, z: '1-2' }, { t: 'Drag 1/2', s: 240, z: '4' }, { t: 'Pause 1/2', s: 180, z: '2' }, { t: 'Drag 2/2', s: 240, z: '4' }, { t: 'Pause 2/2', s: 180, z: '2' }, { t: 'Ned', s: 300, z: '1' }];
  const bl = planToBlocks(plan);
  assert.deepEqual(bl.map(b => [b.n, b.segs.map(s => s.t)]), [[1, ['Oppvarming']], [2, ['Drag', 'Pause']], [1, ['Ned']]]);
  assert.deepEqual(blocksToPlan(bl), plan);
  bl[1].n = 3; bl[1].segs[0].s = 180;
  const out = blocksToPlan(bl);
  assert.equal(out.length, 8); assert.equal(out[5].t, 'Drag 3/3'); assert.equal(out[5].s, 180);
  // Ufullstendig gjentak behandles som enkeltfaser, ingenting går tapt
  const odd = [{ t: 'Drag 1/3', s: 60, z: '4' }, { t: 'Drag 2/3', s: 60, z: '4' }];
  assert.deepEqual(blocksToPlan(planToBlocks(odd)), odd);
  assert.deepEqual(planToBlocks([]), []);
});
test('makspuls: målt, anslått fra fødselsår, og sone i slag/min', () => {
  assert.equal(L.estHrMax(35), 189);
  assert.deepEqual(L.hrMaxOf({ hrMax: 192, birthYear: 1990 }, 2026), { max: 192, est: false });
  assert.deepEqual(L.hrMaxOf({ hrMax: null, birthYear: 1988 }, 2026), { max: 187, est: true });
  assert.deepEqual(L.hrMaxOf({}, 2026), { max: null, est: false });
  assert.equal(L.zoneBpm('2', 190), '137–156'); assert.equal(L.zoneBpm('1-2', 190), '105–156'); assert.equal(L.zoneBpm('2', null), '');
});
test('småhjelpere', () => {
  assert.equal(num('62,5'), 62.5); assert.equal(num(''), null); assert.equal(num('x'), null);
  assert.equal(fmtDur(125), '2:05'); assert.equal(paceText(30, 5), '6:00 /km'); assert.equal(paceText(0, 5), '');
});
