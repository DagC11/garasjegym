// Statiske data: utstyr, øvelser, muskelkart og programmaler. Ingen tilstand.
import { uid } from './logic.js';

/* ---------- Utstyr ---------- */
// kind: plates = stang/maskin med skiver, stack = vektmagasin, dumbbell = liste med vekter, added = kroppsvekt + ekstra, cardio
export const DEFAULT_IMPL = {
  barbell:  { name: 'Olympisk stang', kind: 'plates', base: 20, sides: 2 },
  ssb:      { name: 'Safety squat bar', kind: 'plates', base: 25, sides: 2 },
  ez:       { name: 'EZ-stang', kind: 'plates', base: 10, sides: 2 },
  smith:    { name: 'Smithmaskin (Pivot H3310)', kind: 'plates', base: 15, sides: 2 },
  landmine: { name: 'Landmine / T-bar', kind: 'plates', base: 0, sides: 1 },
  legpress: { name: 'Benpress/hack (Pivot 800)', kind: 'plates', base: 0, sides: 2 },
  legext:   { name: 'Leg ext/curl (Pivot 640)', kind: 'plates', base: 0, sides: 1 },
  hyper:    { name: 'Reverse hyper (Matrix MG-405)', kind: 'plates', base: 0, sides: 1 },
  cable:    { name: 'Nedtrekksapparat (90 kg)', kind: 'stack', step: 5, max: 90 },
  pr_lat:   { name: 'PR 550 – nedtrekk/roing', kind: 'plates', base: 0, sides: 1 },
  pr_cable: { name: 'PR 550 – kabelstasjon', kind: 'plates', base: 0, sides: 1 },
  db:       { name: 'Manualer', kind: 'dumbbell', list: '3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 41' },
  bw:       { name: 'Kroppsvekt (+ ekstra)', kind: 'added' },
  backext:  { name: 'Rygghev (Pivot 610)', kind: 'added' },
  treadmill:{ name: 'Tredemølle', kind: 'cardio' },
  outdoor:  { name: 'Ute / Garmin', kind: 'cardio' },
};
export const DEFAULT_PLATES = { '20': 6, '15': 2, '10': 4, '5': 4, '2.5': 4, '1.25': 4, '0.5': 4 }; // antall skiver totalt
export const PLATE_COLORS = { '20': '#2f6fde', '15': '#f2c230', '10': '#2fa865', '5': '#e8e8e8', '2.5': '#e04848', '1.25': '#9aa3ad', '0.5': '#c7ccd2' };

/* ---------- Øvelser ---------- */
// Muskler: id → navn. Gruppene brukes ved bytte av øvelse (samme gruppe = samme muskelgruppe).
export const MUS = { chest: 'Bryst', front_delt: 'Fremre skulder', side_delt: 'Sideskulder', rear_delt: 'Bakre skulder', traps: 'Trapes', upper_back: 'Øvre rygg',
  lats: 'Brede ryggmuskel', lower_back: 'Korsrygg', biceps: 'Biceps', triceps: 'Triceps', forearm: 'Underarm', abs: 'Mage', obliques: 'Skrå mage',
  glutes: 'Sete', quads: 'Forside lår', hamstrings: 'Hamstring', adductors: 'Innside lår', calves: 'Legger' };
export const MUSCLES = Object.keys(MUS);
export const MUS_GROUP = { chest: 'chest', front_delt: 'shoulder', side_delt: 'shoulder', rear_delt: 'shoulder', traps: 'back', upper_back: 'back', lats: 'back',
  lower_back: 'lower_back', biceps: 'biceps', triceps: 'triceps', forearm: 'forearm', abs: 'core', obliques: 'core', glutes: 'glutes', quads: 'quads',
  hamstrings: 'hamstrings', adductors: 'adductors', calves: 'calves' };
export const OLD_MUS = { 'Bryst': 'chest', 'Rygg': 'lats', 'Skuldre': 'front_delt', 'Biceps': 'biceps', 'Triceps': 'triceps', 'Forside lår': 'quads',
  'Hamstring': 'hamstrings', 'Sete': 'glutes', 'Legger': 'calves', 'Mage': 'abs', 'Korsrygg': 'lower_back' };
export const musNames = ids => ids.map(m => MUS[m] || m).join(', ');
export const PATTERNS = { squat: 'Knebøy / benpress', hinge: 'Hofte-hengsel', hpush: 'Horisontal press', vpush: 'Vertikal press', hpull: 'Roing',
  vpull: 'Nedtrekk / pull-ups', lunge: 'Ettbens', quad_iso: 'Lår (isolasjon)', ham_iso: 'Hamstring (isolasjon)', glute: 'Sete',
  backext: 'Rygg-/hofteekstensjon', calf: 'Legger', biceps: 'Biceps', triceps: 'Triceps', side_delt: 'Sideskulder', rear_delt: 'Bakre skulder',
  shrug: 'Trapes', core: 'Mage', cardio: 'Kondisjon', chest_iso: 'Bryst (isolasjon)', lat_iso: 'Rygg (isolasjon)',
  abduct: 'Hofteabduksjon', adduct: 'Innside lår' };
// o.how = steg for utførelse, o.err = vanlige feil
export const E = (id, name, impl, pat, prim, sec = [], o = {}) => ({ id, name, impl, pat, prim, sec, type: o.type || 'reps', needs: o.needs || null, inc: o.inc ?? null, how: o.how || null, err: o.err || '' });
export const BUILTIN = [
  E('squat', 'Knebøy', 'barbell', 'squat', ['quads', 'glutes'], ['adductors', 'lower_back', 'abs'], { inc: 5,
    how: ['Stanga på øvre del av ryggen (ikke på nakken), føttene i skulderbredde med tærne litt ut.', 'Pust inn i magen og stram hele midtpartiet før du går ned.', 'Sitt ned mellom hælene til hofta er minst i høyde med knærne.', 'Press opp gjennom hele foten med knærne i retning tærne.'],
    err: 'Knærne faller innover. Hælene løfter seg. Overkroppen faller fram, og løftet blir en god morgen.' }),
  E('ssb_squat', 'Knebøy (safety bar)', 'ssb', 'squat', ['quads', 'glutes'], ['adductors', 'upper_back', 'lower_back'], { inc: 5,
    how: ['Legg puten på skuldrene og hold i håndtakene foran deg.', 'Stram magen og hold brystet oppe – stanga vil dra deg fram.', 'Sitt ned mellom hælene til god dybde.', 'Press opp og skyv øvre rygg bakover mot stanga.'],
    err: 'Lar stanga trekke overkroppen fram. Slipper spenningen i øvre rygg i bunnen.' }),
  E('front_squat', 'Frontbøy', 'barbell', 'squat', ['quads'], ['glutes', 'abs', 'upper_back'], {
    how: ['Stanga hviler på fremre skulder, albuene høyt fram.', 'Stå i skulderbredde, stram magen.', 'Sitt rett ned med oppreist overkropp.', 'Press opp og hold albuene høye hele veien.'],
    err: 'Albuene synker, og stanga ruller fram. Runder øvre rygg.' }),
  E('deadlift', 'Markløft', 'barbell', 'hinge', ['hamstrings', 'glutes', 'lower_back'], ['lats', 'traps', 'quads', 'forearm'], { inc: 5,
    how: ['Stå med midtfoten under stanga, grip rett utenfor knærne.', 'Senk hofta til leggene treffer stanga, rett rygg, brystet opp.', 'Stram lats («knekk stanga») og press gulvet bort.', 'Stå helt opp med hofta fram – ikke len deg bakover.'],
    err: 'Runder korsryggen. Hofta skyter opp før stanga løfter. Stanga glir bort fra leggene.' }),
  E('rdl', 'Rumensk markløft', 'barbell', 'hinge', ['hamstrings', 'glutes'], ['lower_back', 'forearm'], { inc: 5,
    how: ['Start stående med stanga i hoftehøyde, svak bøy i knærne.', 'Skyv hofta bakover – stanga glir langs lårene.', 'Gå ned til du kjenner godt strekk bak i lårene (ofte rett under knærne).', 'Driv hofta fram og klem setet på toppen.'],
    err: 'Runder ryggen. Bøyer knærne for mye, så det blir knebøy. Stanga slipper lårene.' }),
  E('good_morning', 'Good morning (safety bar)', 'ssb', 'hinge', ['hamstrings', 'lower_back'], ['glutes'], {
    how: ['Safety bar på skuldrene, føttene i hoftebredde, myk i knærne.', 'Skyv hofta bakover og len overkroppen fram med rett rygg.', 'Gå ned til overkroppen er nesten vannrett eller til strekket stopper deg.', 'Driv hofta fram tilbake til stående.'],
    err: 'Runder ryggen. For tung vekt for tidlig – start lett.' }),
  E('bench', 'Benkpress', 'barbell', 'hpush', ['chest'], ['front_delt', 'triceps'], { needs: 'bench',
    how: ['Ligg med øynene under stanga, føttene godt plantet i gulvet.', 'Samle skulderbladene og løft brystet.', 'Senk stanga kontrollert til nedre del av brystet, albuene ca. 45° ut.', 'Press opp og litt bakover mot startposisjonen.'],
    err: 'Albuene rett ut til siden. Spretter stanga på brystet. Rumpa løfter seg fra benken.' }),
  E('incline_bench', 'Skrå benkpress', 'barbell', 'hpush', ['chest', 'front_delt'], ['triceps'], { needs: 'bench',
    how: ['Still benken på 30–45°.', 'Samle skulderbladene, føttene i gulvet.', 'Senk stanga til øvre del av brystet.', 'Press rett opp over skuldrene.'],
    err: 'For bratt benk gjør det til skulderpress. Svaier mye i ryggen.' }),
  E('cg_bench', 'Benkpress, smalt grep', 'barbell', 'hpush', ['triceps', 'chest'], ['front_delt'], { needs: 'bench',
    how: ['Grip ca. skulderbredde (ikke smalere).', 'Hold albuene inntil kroppen.', 'Senk til nedre bryst.', 'Press opp med fokus på å strekke armene.'],
    err: 'For smalt grep gir vondt i håndleddene. Albuene flyter ut.' }),
  E('ohp', 'Skulderpress stående', 'barbell', 'vpush', ['front_delt', 'side_delt'], ['triceps', 'traps', 'abs'], {
    how: ['Stanga på fremre skulder, grip rett utenfor skuldrene.', 'Stram sete og mage – stå som en planke.', 'Press stanga rett opp og flytt hodet litt bakover forbi stanga.', 'Lås ut over hodet med stanga over midtfoten.'],
    err: 'Svaier i korsryggen. Presser stanga i en bue ut foran kroppen.' }),
  E('bb_row', 'Stangroing', 'barbell', 'hpull', ['lats', 'upper_back'], ['biceps', 'rear_delt', 'lower_back'], {
    how: ['Len overkroppen fram ca. 45° med rett rygg, knærne myke.', 'La stanga henge med strake armer.', 'Trekk stanga mot navlen, albuene bakover.', 'Senk kontrollert.'],
    err: 'Retter seg opp for hver rep. Rykker vekta opp med korsryggen.' }),
  E('hip_thrust', 'Hip thrust', 'barbell', 'glute', ['glutes'], ['hamstrings'], { needs: 'bench', inc: 5,
    how: ['Øvre rygg mot benken, stanga (med pute) over hofta.', 'Føttene i hoftebredde, leggene loddrett på toppen.', 'Press hofta opp til kroppen er rett fra knær til skuldre.', 'Klem setet ett sekund, senk kontrollert.'],
    err: 'Svaier i korsryggen på toppen i stedet for å strekke hofta. Føttene for langt fram (kjennes i hamstring).' }),
  E('ez_curl', 'Curl (EZ-stang)', 'ez', 'biceps', ['biceps'], ['forearm'], { inc: 1,
    how: ['Stå oppreist, grip de skrå delene av stanga.', 'Hold albuene inntil siden.', 'Bøy armene og løft stanga mot skuldrene.', 'Senk helt ned, rolig.'],
    err: 'Svinger med kroppen. Albuene glir fram.' }),
  E('skull', 'Skullcrusher (EZ-stang)', 'ez', 'triceps', ['triceps'], [], { needs: 'bench', inc: 1,
    how: ['Ligg på benken med stanga over brystet.', 'Bøy kun i albuene og senk stanga mot panna/bak hodet.', 'Hold overarmene stille.', 'Strekk armene tilbake opp.'],
    err: 'Albuene spriker ut. Overarmene beveger seg, så det blir en press.' }),
  E('smith_squat', 'Knebøy i smith', 'smith', 'squat', ['quads', 'glutes'], ['adductors'], { inc: 5,
    how: ['Stanga på øvre rygg, føttene litt foran stanga.', 'Lås opp stanga ved å vri den.', 'Sitt ned til god dybde.', 'Press opp – husk å vri for å låse når du er ferdig.'],
    err: 'Føttene rett under stanga gir mye trykk på knærne. Glemmer sikkerhetsstopperne.' }),
  E('smith_bench', 'Benkpress i smith', 'smith', 'hpush', ['chest'], ['front_delt', 'triceps'], { needs: 'bench',
    how: ['Plasser benken så stanga treffer nedre del av brystet.', 'Samle skulderbladene.', 'Senk kontrollert til brystet.', 'Press opp.'],
    err: 'Benken står feil, så stanga treffer halsen eller magen. Still sikkerhetsstopperne.' }),
  E('smith_incline', 'Skrå benkpress i smith', 'smith', 'hpush', ['chest', 'front_delt'], ['triceps'], { needs: 'bench',
    how: ['Benken på 30–45°, stanga skal treffe øvre bryst.', 'Samle skulderbladene.', 'Senk kontrollert.', 'Press opp.'],
    err: 'For bratt benk. Mister spenningen i skulderbladene.' }),
  E('smith_ohp', 'Skulderpress i smith (sittende)', 'smith', 'vpush', ['front_delt', 'side_delt'], ['triceps'], { needs: 'bench',
    how: ['Benken nesten loddrett, stanga rett foran ansiktet.', 'Senk til haka/øvre bryst.', 'Press rett opp.', 'Ikke lås albuene hardt ut.'],
    err: 'Svaier mye i ryggen. Senker stanga bak nakken.' }),
  E('smith_row', 'Roing i smith', 'smith', 'hpull', ['lats', 'upper_back'], ['biceps', 'rear_delt'], {
    how: ['Stanga i knehøyde, len deg fram med rett rygg.', 'Trekk stanga mot navlen.', 'Klem skulderbladene sammen.', 'Senk kontrollert.'],
    err: 'Runder ryggen. Rykker med hele kroppen.' }),
  E('smith_split', 'Splittknebøy i smith', 'smith', 'lunge', ['quads', 'glutes'], ['adductors'], {
    how: ['Stå med ett bein foran og ett bak, stanga på øvre rygg.', 'Senk rett ned til bakre kne nesten treffer gulvet.', 'Press opp med fremre bein.', 'Ta alle reps på ett bein, så bytt.'],
    err: 'For kort steg gir knær langt foran tærne. Bakre bein gjør jobben.' }),
  E('smith_hipthrust', 'Hip thrust i smith', 'smith', 'glute', ['glutes'], ['hamstrings'], { needs: 'bench', inc: 5,
    how: ['Øvre rygg mot benken, stanga med pute over hofta.', 'Føttene i hoftebredde.', 'Press hofta opp til rett linje fra knær til skuldre.', 'Klem setet, senk rolig.'],
    err: 'Svaier i korsryggen på toppen. For kort bevegelse.' }),
  E('smith_calf', 'Tåhev i smith', 'smith', 'calf', ['calves'], [], { inc: 5,
    how: ['Stå med fotballene på en skive eller kloss, stanga på skuldrene.', 'Senk hælene så langt ned du kan.', 'Press opp på tærne så høyt som mulig.', 'Hold ett sekund på toppen.'],
    err: 'Spretter i bunnen. For kort bevegelse.' }),
  E('tbar_row', 'T-bar roing (landmine)', 'landmine', 'hpull', ['lats', 'upper_back'], ['biceps', 'rear_delt', 'lower_back'], { needs: 'landmine',
    how: ['Stå over stanga med et V-håndtak rundt den.', 'Len deg fram med rett rygg, knærne myke.', 'Trekk skivene mot brystet/magen.', 'Senk kontrollert til strake armer.'],
    err: 'Retter seg opp for å få vekta opp. Runder ryggen.' }),
  E('landmine_press', 'Landmine press', 'landmine', 'vpush', ['front_delt', 'chest'], ['triceps'], { needs: 'landmine',
    how: ['Hold enden av stanga ved skulderen (én eller to hender).', 'Stå i utfallsstilling eller parallelt, stram magen.', 'Press stanga opp og fram til armen er strak.', 'Senk kontrollert til skulderen.'],
    err: 'Svaier i ryggen. Presser for mye opp i stedet for fram.' }),
  E('legpress', 'Benpress (sittende)', 'legpress', 'squat', ['quads', 'glutes'], ['adductors'], { inc: 5,
    how: ['Sitt med ryggen godt inntil, føttene i hoftebredde midt på plata.', 'Løs ut sikringen.', 'Senk sleden kontrollert til ca. 90° i kneet.', 'Press opp uten å låse knærne helt.'],
    err: 'Korsryggen løfter seg fra setet i bunnen. Låser knærne hardt. For kort bevegelse.' }),
  E('hack', 'Hacklift (hack squat)', 'legpress', 'squat', ['quads', 'glutes'], ['adductors'], { inc: 5,
    how: ['Rygg og skuldre inntil putene, føttene midt på plata.', 'Løs ut sikringen.', 'Senk deg kontrollert så dypt du klarer med rett rygg.', 'Press opp gjennom hele foten.'],
    err: 'Hælene løfter seg. Knærne faller innover. For tung vekt og for lite dybde.' }),
  E('lp_calf', 'Tåhev i benpress', 'legpress', 'calf', ['calves'], [], { inc: 5,
    how: ['Fotballene på nedre kant av plata, beina nesten strake.', 'Senk tærne mot deg så langt du kan.', 'Press plata bort ved å strekke anklene.', 'Hold kort på toppen.'],
    err: 'Bøyer knærne og bruker lårene. Ikke løs ut sikringen med tærne alene.' }),
  E('leg_ext', 'Leg extension', 'legext', 'quad_iso', ['quads'], [], {
    how: ['Juster ryggen så kneleddet er på linje med maskinens akse.', 'Puten hviler like over anklene.', 'Strekk beina helt ut og hold et halvt sekund.', 'Senk kontrollert på 2–3 sekunder.'],
    err: 'Kaster vekta opp med fart. Løfter setet fra benken. For kort bevegelse.' }),
  E('leg_curl', 'Leg curl', 'legext', 'ham_iso', ['hamstrings'], ['calves'], {
    how: ['Juster så kneleddet er på linje med aksen, puten over hælene.', 'Bøy beina så langt du klarer.', 'Klem i toppen.', 'Senk rolig til nesten strake bein.'],
    err: 'Hofta løfter seg fra benken. Rykker vekta opp.' }),
  E('rev_hyper', 'Reverse hyper', 'hyper', 'backext', ['glutes', 'hamstrings', 'lower_back'], [], {
    how: ['Ligg på magen med hofta på kanten, hold godt i håndtakene.', 'La beina henge med stroppen rundt anklene.', 'Sving beina bakover og opp til kroppen er rett.', 'La beina falle kontrollert tilbake og under deg.'],
    err: 'Overstrekker korsryggen på toppen. For mye fart og sving.' }),
  E('back_ext', 'Rygghev', 'backext', 'backext', ['lower_back', 'glutes', 'hamstrings'], [], {
    how: ['Hofta like over kanten av puten, anklene låst.', 'Kryss armene over brystet (eller hold en skive).', 'Senk overkroppen kontrollert.', 'Løft opp til rett linje – ikke lenger.'],
    err: 'Overstrekker ryggen på toppen. Kaster seg opp med fart.' }),
  E('pulldown', 'Nedtrekk, bredt grep', 'cable', 'vpull', ['lats'], ['biceps', 'upper_back', 'rear_delt'], {
    how: ['Grip litt bredere enn skuldrene, lårene under puten.', 'Brystet fram, len deg lett bakover.', 'Trekk albuene ned mot hoftene til stanga når øvre bryst.', 'Slipp opp kontrollert til strake armer.'],
    err: 'Trekker med armene i stedet for ryggen. Kaster overkroppen bakover. Trekker bak nakken.' }),
  E('pulldown_cg', 'Nedtrekk, smalt/underhånd', 'cable', 'vpull', ['lats', 'biceps'], ['upper_back'], {
    how: ['Grip i skulderbredde med håndflatene mot deg (eller V-håndtak).', 'Brystet fram, len deg lett bakover.', 'Trekk mot øvre bryst med albuene inntil kroppen.', 'Slipp opp kontrollert.'],
    err: 'Rykker med kroppen. Stopper før armene er strake.' }),
  E('cable_row', 'Sittende roing (kabel)', 'cable', 'hpull', ['lats', 'upper_back'], ['biceps', 'rear_delt'], {
    how: ['Sitt med føttene mot noe stødig, knærne myke, rett rygg.', 'Trekk håndtaket mot magen.', 'Klem skulderbladene sammen bak.', 'Strekk armene fram igjen uten å runde ryggen.'],
    err: 'Lener seg langt fram og bak for hver rep. Trekker skuldrene opp mot ørene.' }),
  E('pushdown', 'Triceps pushdown', 'cable', 'triceps', ['triceps'], [], {
    how: ['Stå foran øvre trinse, grip stang eller tau.', 'Albuene inntil siden.', 'Press ned til armene er strake.', 'La den gå opp til ca. 90° i albuen.'],
    err: 'Albuene flyter fram og bak. Lener seg over med kroppsvekta.' }),
  E('face_pull', 'Face pull', 'cable', 'rear_delt', ['rear_delt', 'upper_back'], ['traps'], {
    how: ['Tau på øvre trinse i ansiktshøyde.', 'Trekk tauet mot ansiktet og del det ut til sidene.', 'Albuene høyt, tommelen peker bakover på slutten.', 'Slipp kontrollert tilbake.'],
    err: 'For tung vekt, så det blir roing. Albuene synker.' }),
  E('cable_curl', 'Kabelcurl (lav trinse)', 'cable', 'biceps', ['biceps'], ['forearm'], {
    how: ['Stå foran nedre trinse med stang eller tau.', 'Albuene inntil siden.', 'Bøy armene opp mot skuldrene.', 'Senk helt ned, rolig.'],
    err: 'Svinger med kroppen. Albuene glir fram.' }),
  E('db_bench', 'Benkpress med manualer', 'db', 'hpush', ['chest'], ['front_delt', 'triceps'], { needs: 'bench',
    how: ['Sitt med manualene på lårene, len deg bakover og få dem opp.', 'Samle skulderbladene, føttene i gulvet.', 'Senk manualene til de er i høyde med brystet.', 'Press opp og litt inn mot hverandre.'],
    err: 'Albuene rett ut til siden. Slipper manualene ned for fort.' }),
  E('db_incline', 'Skrå benkpress med manualer', 'db', 'hpush', ['chest', 'front_delt'], ['triceps'], { needs: 'bench',
    how: ['Benken på 30–45°.', 'Samle skulderbladene.', 'Senk manualene til øvre bryst.', 'Press opp over skuldrene.'],
    err: 'For bratt benk. Mister kontroll i bunnen.' }),
  E('db_ohp', 'Skulderpress med manualer', 'db', 'vpush', ['front_delt', 'side_delt'], ['triceps'], {
    how: ['Sitt eller stå med manualene ved skuldrene.', 'Stram magen.', 'Press rett opp til armene er nesten strake.', 'Senk til skulderhøyde.'],
    err: 'Svaier i ryggen. Senker for kort.' }),
  E('db_row', 'Ettarms roing med manual', 'db', 'hpull', ['lats', 'upper_back'], ['biceps', 'rear_delt'], {
    how: ['Én hånd og ett kne på benken (eller hånd mot racket), rett rygg.', 'La manualen henge rett ned.', 'Trekk albuen opp og bakover mot hofta.', 'Senk helt ned med strekk.'],
    err: 'Vrir overkroppen for å få vekta opp. Trekker mot brystet i stedet for hofta.' }),
  E('db_rdl', 'Rumensk markløft med manualer', 'db', 'hinge', ['hamstrings', 'glutes'], ['lower_back'], {
    how: ['Stå med manualene foran lårene, svak bøy i knærne.', 'Skyv hofta bakover, manualene tett langs lårene.', 'Gå ned til godt strekk bak i lårene.', 'Driv hofta fram og klem setet.'],
    err: 'Runder ryggen. Manualene henger langt fra kroppen.' }),
  E('goblet', 'Goblet squat', 'db', 'squat', ['quads', 'glutes'], ['adductors', 'abs'], {
    how: ['Hold én manual loddrett inntil brystet.', 'Føttene litt bredere enn hoftene.', 'Sitt rett ned mellom hælene, albuene innenfor knærne.', 'Press opp gjennom hele foten.'],
    err: 'Hælene løfter seg. Knærne faller innover. Manualen glir fra kroppen.' }),
  E('bulgarian', 'Bulgarsk splittknebøy', 'db', 'lunge', ['quads', 'glutes'], ['adductors'], { needs: 'bench',
    how: ['Bakre fot på benken, fremre fot godt foran.', 'Manualer i hendene, overkroppen oppreist.', 'Senk rett ned til fremre lår er vannrett.', 'Press opp med fremre bein. Alle reps på ett bein, så bytt.'],
    err: 'For kort avstand til benken. Mister balansen – start uten vekt.' }),
  E('db_lunge', 'Utfall med manualer', 'db', 'lunge', ['quads', 'glutes'], ['adductors'], {
    how: ['Stå med manualer i hendene.', 'Ta et langt steg fram.', 'Senk til bakre kne nesten treffer gulvet.', 'Press tilbake til start, bytt bein.'],
    err: 'For kort steg. Fremre kne faller innover.' }),
  E('lat_raise', 'Sideløft', 'db', 'side_delt', ['side_delt'], ['traps'], {
    how: ['Stå med manualene langs siden, svak bøy i albuene.', 'Løft ut til siden til skulderhøyde.', 'Led med albuene, ikke hendene.', 'Senk rolig.'],
    err: 'For tung vekt og sving i kroppen. Trekker skuldrene opp mot ørene.' }),
  E('rear_fly', 'Omvendt flyes (bakre skulder)', 'db', 'rear_delt', ['rear_delt'], ['upper_back'], {
    how: ['Len deg fram med rett rygg, manualene henger under brystet.', 'Svak bøy i albuene.', 'Løft armene ut til siden i en bue.', 'Senk kontrollert.'],
    err: 'Klemmer skulderbladene for mye, så øvre rygg tar over. For tung vekt.' }),
  E('db_curl', 'Curl med manualer', 'db', 'biceps', ['biceps'], ['forearm'], {
    how: ['Stå med manualene langs siden, håndflatene fram.', 'Albuene inntil kroppen.', 'Bøy opp mot skuldrene.', 'Senk helt ned.'],
    err: 'Svinger med kroppen. Albuene glir fram.' }),
  E('hammer', 'Hammercurl', 'db', 'biceps', ['biceps', 'forearm'], [], {
    how: ['Hold manualene med tommelen opp.', 'Albuene inntil siden.', 'Bøy opp mot skuldrene.', 'Senk rolig.'],
    err: 'Svinger med kroppen. Halv bevegelse.' }),
  E('db_oh_tri', 'Triceps over hodet (manual)', 'db', 'triceps', ['triceps'], [], {
    how: ['Hold én manual med begge hender over hodet.', 'Senk den bak hodet ved å bøye albuene.', 'Hold albuene pekende fram/opp.', 'Strekk armene opp igjen.'],
    err: 'Albuene spriker ut. Svaier i korsryggen.' }),
  E('db_shrug', 'Skuldertrekk med manualer', 'db', 'shrug', ['traps'], ['forearm'], {
    how: ['Stå med manualene langs siden.', 'Løft skuldrene rett opp mot ørene.', 'Hold et sekund.', 'Senk helt ned.'],
    err: 'Ruller skuldrene. Bøyer armene.' }),
  E('pullup', 'Pull-ups', 'bw', 'vpull', ['lats'], ['biceps', 'upper_back'], {
    how: ['Heng i stanga med overhåndsgrep litt bredere enn skuldrene.', 'Trekk skulderbladene ned først.', 'Trekk deg opp til haka er over stanga.', 'Senk deg helt ned.'],
    err: 'Halve repetisjoner. Sparker med beina.' }),
  E('chinup', 'Chin-ups', 'bw', 'vpull', ['lats', 'biceps'], ['upper_back'], {
    how: ['Heng med underhåndsgrep i skulderbredde.', 'Trekk skulderbladene ned.', 'Trekk deg opp til haka er over stanga.', 'Senk deg helt ned.'],
    err: 'Halve repetisjoner. Svinger med kroppen.' }),
  E('pushup', 'Armhevinger', 'bw', 'hpush', ['chest'], ['triceps', 'front_delt', 'abs'], {
    how: ['Hendene litt bredere enn skuldrene, kroppen rett.', 'Senk brystet mot gulvet, albuene ca. 45° ut.', 'Press opp til strake armer.', 'For lettere: hendene på en benk eller knærne i gulvet.'],
    err: 'Hofta henger. Albuene rett ut til siden.' }),
  E('hlr', 'Hengende beinhev', 'bw', 'core', ['abs'], ['obliques', 'forearm'], {
    how: ['Heng i pull-up-stanga.', 'Løft knærne (lettere) eller strake bein mot brystet.', 'Rull bekkenet opp på toppen.', 'Senk kontrollert uten å svinge.'],
    err: 'Svinger fram og tilbake. Løfter bare med hoftebøyerne uten å runde bekkenet.' }),
  E('plank', 'Planke', 'bw', 'core', ['abs'], ['obliques'], { type: 'time',
    how: ['Underarmene i gulvet under skuldrene.', 'Kroppen rett fra hode til hæl.', 'Stram mage og sete.', 'Pust rolig.'],
    err: 'Hofta henger eller stikker opp. Holder pusten.' }),
  E('treadmill', 'Tredemølle – løp/gå', 'treadmill', 'cardio', [], ['quads', 'hamstrings', 'glutes', 'calves'], { type: 'cardio',
    how: ['Start rolig og øk farten gradvis.', 'Løp avslappet med korte steg under kroppen.', 'Hold blikket fram, ikke på displayet.', 'Bruk pulssonen eller prat-testen til å styre farten.'],
    err: 'Holder i håndtakene. Starter for hardt.' }),
  E('incline_walk', 'Tredemølle – gange i motbakke', 'treadmill', 'cardio', [], ['glutes', 'hamstrings', 'calves', 'quads'], { type: 'cardio',
    how: ['Still stigningen på 5–12 %.', 'Gå med rolig, jevnt tempo.', 'Slipp håndtakene – la beina jobbe.', 'Juster stigning eller fart for å holde riktig puls.'],
    err: 'Holder i håndtakene og lener seg bakover, da blir det mye lettere.' }),
  // ---- Abilica PR 550: rack og kabelstasjon ----
  E('cable_fly_hl', 'Kabelflyes, høy → lav', 'pr_cable', 'chest_iso', ['chest'], ['front_delt'], {
    how: ['Still begge trinsene høyt og ta et håndtak i hver hånd.', 'Ta et steg fram og len deg lett fram, med svak bøy i albuene.', 'Før hendene ned og sammen foran nedre del av brystet.', 'Gå kontrollert tilbake til du kjenner strekk i brystet.'],
    err: 'Bøyer og strekker albuene, så det blir en press. For tung vekt gjør at skuldrene tar over.' }),
  E('cable_fly_lh', 'Kabelflyes, lav → høy', 'pr_cable', 'chest_iso', ['chest', 'front_delt'], [], {
    how: ['Still begge trinsene lavt og ta et håndtak i hver hånd.', 'Stå midt mellom stolpene med et lite steg fram.', 'Før hendene opp og sammen foran ansiktet i en bue.', 'Senk kontrollert ned og ut.'],
    err: 'Løfter skuldrene opp mot ørene. Bruker fart fra kroppen.' }),
  E('cable_press_1arm', 'Ettarms kabelpress, stående', 'pr_cable', 'hpush', ['chest'], ['front_delt', 'triceps', 'obliques'], {
    how: ['Still trinsen i brysthøyde og stå med ryggen mot stolpen.', 'Stå i utfallsstilling og stram magen.', 'Press håndtaket rett fram til armen er strak.', 'Ikke la kroppen vri seg – det er en del av øvelsen.'],
    err: 'Roterer overkroppen med vekta. Albuen flyter høyt ut til siden.' }),
  E('cable_lat_raise', 'Kabel sideløft, ettarms', 'pr_cable', 'side_delt', ['side_delt'], ['traps'], {
    how: ['Still trinsen helt nede og stå sidelengs til stolpen.', 'Hold håndtaket i hånden lengst fra trinsen, kabelen foran kroppen.', 'Løft armen ut til siden til skulderhøyde, med svak bøy i albuen.', 'Senk rolig. Alle reps på én side, så bytt.'],
    err: 'Svinger med overkroppen. Trekker skulderen opp mot øret.' }),
  E('cable_rear_fly', 'Omvendt kabelflyes', 'pr_cable', 'rear_delt', ['rear_delt'], ['upper_back'], {
    how: ['Still begge trinsene i skulderhøyde.', 'Kryss kablene: venstre hånd tar høyre kabel og omvendt.', 'Trekk armene ut og bakover med nesten strake armer.', 'Slipp kontrollert tilbake til hendene krysser.'],
    err: 'Klemmer skulderbladene for mye, så øvre rygg tar over. For tung vekt.' }),
  E('cable_y_raise', 'Y-løft i kabel', 'pr_cable', 'side_delt', ['side_delt'], ['traps', 'rear_delt'], {
    how: ['Still begge trinsene nede og kryss kablene foran deg.', 'Løft armene skrått opp og ut til en Y over hodet.', 'Tommelen peker opp, armene nesten strake.', 'Senk rolig.'],
    err: 'Svaier i ryggen. For tung vekt – denne skal gjøres lett.' }),
  E('pulldown_1arm', 'Ettarms nedtrekk', 'pr_cable', 'vpull', ['lats'], ['biceps', 'upper_back'], {
    how: ['Still trinsen høyt. Knel eller sitt rett under den.', 'Start med strak arm og strekk i siden av ryggen.', 'Trekk albuen ned mot hofta.', 'Slipp kontrollert helt opp.'],
    err: 'Vrir overkroppen for å få vekta ned. Trekker med armen i stedet for ryggen.' }),
  E('cable_row_1arm', 'Ettarms kabelroing', 'pr_cable', 'hpull', ['lats', 'upper_back'], ['biceps', 'rear_delt'], {
    how: ['Still trinsen i brysthøyde, eller lavt for sittende variant.', 'Stå i utfallsstilling, motsatt hånd mot stolpen.', 'Trekk albuen bakover langs kroppen mot hofta.', 'Strekk armen fram og la skulderen følge med.'],
    err: 'Roterer kroppen bakover. Trekker skulderen opp mot øret.' }),
  E('straight_pulldown', 'Straight-arm pulldown', 'pr_lat', 'lat_iso', ['lats'], ['triceps'], {
    how: ['Bruk nedtrekksstanga i den høye trinsen og stå et steg unna.', 'Len deg lett fram med nesten strake armer.', 'Press stanga ned i en bue til lårene.', 'Slipp kontrollert opp til strekk i ryggen.'],
    err: 'Bøyer albuene, så det blir en pushdown. Bruker kroppsvekta.' }),
  E('pullup_neutral', 'Pull-ups, nøytralt grep', 'bw', 'vpull', ['lats'], ['biceps', 'upper_back', 'forearm'], {
    how: ['Grip pull-up-håndtakene med håndflatene mot hverandre.', 'Trekk skulderbladene ned først.', 'Trekk deg opp til haka er over håndtakene.', 'Senk deg helt ned.'],
    err: 'Halve repetisjoner. Svinger med beina.' }),
  E('inv_row', 'Inverted row (stang i racket)', 'bw', 'hpull', ['upper_back', 'lats'], ['biceps', 'rear_delt'], {
    how: ['Legg stanga i J-krokene eller på sikkerhetsstolpene i hoftehøyde.', 'Heng under stanga med strake armer og rett kropp, hælene i gulvet.', 'Trekk brystet opp til stanga.', 'Jo høyere stanga står, jo lettere blir det.'],
    err: 'Hofta henger. Strekker nakken fram mot stanga.' }),
  E('rackpull', 'Rackpulls', 'barbell', 'hinge', ['glutes', 'lower_back'], ['hamstrings', 'traps', 'upper_back', 'forearm'], { inc: 5,
    how: ['Legg stanga på sikkerhetsstolpene, rett under eller over knærne.', 'Grip rett utenfor beina, rett rygg og brystet opp.', 'Stram ryggen og driv hofta fram til du står oppreist.', 'Senk kontrollert ned på stolpene.'],
    err: 'Lener seg bakover på toppen. Runder ryggen fordi vekta er tyngre enn vanlig markløft.' }),
  E('cable_preacher', 'Preachercurl i kabel', 'pr_cable', 'biceps', ['biceps'], ['forearm'], { needs: 'bench',
    how: ['Still en skråbenk høyt foran den lave trinsen og fest stanga.', 'Legg overarmene over ryggstøtten.', 'Curl stanga opp uten å løfte albuene.', 'Senk til nesten strake armer.'],
    err: 'Løfter albuene fra puten. Senker for kort.' }),
  E('bayesian_curl', 'Bayesian curl', 'pr_cable', 'biceps', ['biceps'], ['forearm'], {
    how: ['Still trinsen lavt, stå med ryggen til og ta et steg fram.', 'La armen henge litt bak kroppen.', 'Bøy armen fram og opp uten å flytte albuen.', 'Senk til full strekk. Alle reps på én arm, så bytt.'],
    err: 'Albuen glir fram. For kort steg, så strekken forsvinner.' }),
  E('rope_hammer', 'Hammercurl med tau', 'pr_cable', 'biceps', ['biceps', 'forearm'], [], {
    how: ['Fest tauet i den lave trinsen.', 'Hold tauet med tommelen opp, albuene inntil siden.', 'Curl opp mot skuldrene.', 'Senk rolig.'],
    err: 'Svinger med kroppen. Albuene glir fram.' }),
  E('cable_oh_tri', 'Triceps over hodet i kabel', 'pr_cable', 'triceps', ['triceps'], [], {
    how: ['Fest tauet i lav eller midtre trinse og snu ryggen til.', 'Len deg lett fram med hendene bak hodet.', 'Strekk armene fram og opp.', 'Bøy kontrollert tilbake til full strekk.'],
    err: 'Albuene spriker ut. Svaier i korsryggen.' }),
  E('pushdown_1arm_rev', 'Ettarms pushdown, omvendt grep', 'pr_cable', 'triceps', ['triceps'], ['forearm'], {
    how: ['Still trinsen høyt og grip håndtaket med håndflaten opp.', 'Albuen inntil siden.', 'Press ned til armen er strak.', 'La den gå opp til ca. 90° i albuen.'],
    err: 'Albuen flyter fram. For tung vekt for håndleddet.' }),
  E('cable_tri_kickback', 'Triceps kickback i kabel', 'pr_cable', 'triceps', ['triceps'], [], {
    how: ['Still trinsen lavt og len deg fram med rett rygg.', 'Hold overarmen langs kroppen.', 'Strekk armen bakover til den er rett.', 'Bøy kontrollert tilbake.'],
    err: 'Overarmen svinger. Bruker fart.' }),
  E('cable_kickback', 'Kabel kickback (sete)', 'pr_cable', 'glute', ['glutes'], ['hamstrings'], {
    how: ['Fest ankelstroppen og still trinsen helt nede.', 'Hold i racket og len deg litt fram.', 'Spark beinet bakover med strak eller lett bøyd kne.', 'Klem setet på toppen, senk rolig. Alle reps, så bytt.'],
    err: 'Svaier i korsryggen i stedet for å bruke setet. For mye fart.' }),
  E('cable_abduct', 'Kabel hofteabduksjon', 'pr_cable', 'abduct', ['glutes'], [], {
    how: ['Fest ankelstroppen på ytre fot, trinsen helt nede.', 'Stå sidelengs med det andre beinet nærmest stolpen.', 'Før beinet ut til siden, tærne peker fram.', 'Senk rolig tilbake.'],
    err: 'Lener overkroppen til siden. Vrir tærne opp.' }),
  E('cable_adduct', 'Kabel adduksjon (innside lår)', 'pr_cable', 'adduct', ['adductors'], [], {
    how: ['Fest ankelstroppen på foten nærmest stolpen, trinsen helt nede.', 'Stå sidelengs med god avstand.', 'Før beinet inn foran det andre beinet.', 'Slipp kontrollert ut.'],
    err: 'Bruker fart. For stor vekt – start lett.' }),
  E('pull_through', 'Pull-through', 'pr_cable', 'hinge', ['glutes', 'hamstrings'], ['lower_back'], {
    how: ['Fest tauet i den lave trinsen og stå med ryggen til.', 'Hold tauet mellom beina og gå et par steg fram.', 'Skyv hofta bakover med rett rygg.', 'Driv hofta fram og klem setet.'],
    err: 'Trekker med armene. Bøyer knærne så det blir knebøy.' }),
  E('pallof', 'Pallof press', 'pr_cable', 'core', ['obliques', 'abs'], [], {
    how: ['Still trinsen i brysthøyde og stå sidelengs til stolpen.', 'Hold håndtaket med begge hender inntil brystet.', 'Press rett fram og hold 2 sekunder uten å vri deg.', 'Før hendene inn igjen. Reps per side.'],
    err: 'Lar kabelen vri kroppen. For tung vekt.' }),
  E('cable_crunch', 'Knelende kabelcrunch', 'pr_cable', 'core', ['abs'], ['obliques'], {
    how: ['Fest tauet i den høye trinsen og knel foran stolpen.', 'Hold tauet ved siden av hodet.', 'Rull overkroppen ned mot knærne med magen.', 'Rull kontrollert opp igjen.'],
    err: 'Bøyer i hofta i stedet for å krølle ryggen. Trekker med armene.' }),
  E('woodchop', 'Woodchopper, høy → lav', 'pr_cable', 'core', ['obliques'], ['abs', 'front_delt'], {
    how: ['Still trinsen høyt og stå sidelengs.', 'Grip håndtaket med begge hender over skulderen.', 'Trekk diagonalt ned mot motsatt kne og roter fra hofta.', 'Gå kontrollert tilbake. Reps per side.'],
    err: 'Bøyer armene og trekker med dem. Roterer bare i korsryggen.' }),
  E('run_outdoor', 'Løping ute', 'outdoor', 'cardio', [], ['quads', 'hamstrings', 'glutes', 'calves'], { type: 'cardio',
    how: ['Registrer turen på klokka.', 'Last ned økta som TCX fra connect.garmin.com.', 'Importer filen under Fremgang → Importer fra Garmin.'], err: '' }),
  E('cardio_other', 'Annen kondisjon', 'outdoor', 'cardio', [], ['quads', 'calves'], { type: 'cardio',
    how: ['Brukes for økter importert fra Garmin som ikke er løping.'], err: '' }),
];

/* ---------- Muskelkart ---------- */
// Venstre halvdel av figuren (x < 100), speiles om x = 100. [muskel-id eller null, path]
export const BODY_SIL = 'M100,46 C94,46 90,50 90,56 C80,56 70,58 62,61 C50,64 44,74 43,88 L38,140 C34,170 30,190 27,206 L35,211 C43,190 49,170 53,148 L59,116 L65,134 C67,152 67,170 65,188 C61,222 59,262 63,298 C65,332 65,362 67,386 L66,404 L85,405 L85,388 C87,360 89,330 89,300 C91,270 95,240 99,212 L100,212 Z';
export const BODY_FRONT = [
  [null, 'M93,44 L93,56 C91,58 88,60 84,61 L92,62 C95,60 97,58 97,54 Z'],
  ['traps', 'M90,52 C86,56 80,59 74,61 L84,62 C88,60 90,57 90,52 Z'],
  ['front_delt', 'M77,62 C70,61 65,62 61,63 C57,76 55,90 55,104 C61,92 68,80 78,71 Z'],
  ['side_delt', 'M60,63 C51,66 46,74 45,85 C45,95 49,103 54,107 C54,94 56,79 60,63 Z'],
  ['chest', 'M98,64 L81,64 C75,67 71,72 69,79 C78,80 89,80 98,80 Z'],
  ['chest', 'M98,82 C89,82 78,82 68,82 C66,89 67,95 69,99 C77,107 90,108 98,103 Z'],
  ['biceps', 'M54,110 C48,119 46,131 48,144 C53,147 58,143 60,137 C62,126 61,116 59,108 Z'],
  ['forearm', 'M47,148 C42,163 38,180 35,197 L39,199 C45,184 50,167 54,150 Z'],
  ['forearm', 'M55,148 C52,166 47,184 41,200 L44,201 C50,186 56,168 59,147 Z'],
  ['abs', 'M98,108 L90,108 C89,112 89,118 90,122 L98,122 Z'],
  ['abs', 'M98,124 L90,124 L90,138 L98,138 Z'],
  ['abs', 'M98,140 L90,140 L90,154 L98,154 Z'],
  ['abs', 'M98,156 L90,156 C90,166 92,176 96,184 L98,185 Z'],
  ['obliques', 'M87,108 C79,112 73,122 72,134 C73,152 79,167 88,178 C87,154 86,130 87,108 Z'],
  ['obliques', 'M67,101 C70,106 72,112 72,118 L69,118 C68,112 67,106 67,101 Z'],
  ['adductors', 'M97,198 C94,212 92,230 91,248 C89,240 87,224 87,210 C89,204 93,200 97,198 Z'],
  ['quads', 'M72,190 C64,212 62,240 65,266 C67,280 71,288 75,292 C73,268 73,240 76,214 Z'],
  ['quads', 'M80,190 C76,214 75,240 77,266 C79,278 82,286 84,290 C87,268 88,240 87,214 C86,204 84,196 80,190 Z'],
  ['quads', 'M88,246 C88,262 86,278 84,292 C89,292 93,286 93,276 C93,264 91,254 88,246 Z'],
  ['calves', 'M70,310 C67,328 67,350 70,372 L74,373 C74,352 75,330 76,310 Z'],
  ['calves', 'M80,310 C83,326 84,344 82,362 L78,366 C78,346 78,328 80,310 Z'],
];
export const BODY_BACK = [
  ['traps', 'M99,46 C96,52 90,57 80,61 L73,63 C82,64 92,66 99,68 Z'],
  ['traps', 'M99,70 C92,71 85,73 79,75 C86,84 93,96 99,112 Z'],
  ['rear_delt', 'M72,62 C61,62 51,70 48,82 C48,92 51,98 55,101 C59,88 65,76 73,68 Z'],
  ['upper_back', 'M77,77 C72,83 70,90 71,100 C78,101 85,100 91,98 C88,89 83,82 77,77 Z'],
  ['lats', 'M71,104 C69,120 71,140 77,158 C84,166 92,169 98,171 L98,118 C92,110 84,105 71,104 Z'],
  ['triceps', 'M54,104 C48,116 46,128 47,141 C49,145 52,145 54,142 C54,128 55,116 58,104 Z'],
  ['triceps', 'M59,106 C62,118 62,130 60,139 C58,142 56,143 55,142 C55,128 57,116 59,106 Z'],
  ['forearm', 'M47,148 C42,163 38,180 35,197 L39,199 C45,184 50,167 54,150 Z'],
  ['forearm', 'M55,148 C52,166 47,184 41,200 L44,201 C50,186 56,168 59,147 Z'],
  ['lower_back', 'M98,120 L93,120 C91,142 89,162 85,184 L98,187 Z'],
  ['glutes', 'M84,178 C75,180 69,186 67,194 C73,192 80,191 86,191 Z'],
  ['glutes', 'M99,191 L86,192 C72,196 66,210 68,226 C74,236 87,239 99,235 Z'],
  ['hamstrings', 'M70,236 C66,256 66,276 70,294 L77,296 C76,276 77,256 79,240 Z'],
  ['hamstrings', 'M81,240 C80,258 80,278 80,296 C85,297 88,293 89,288 C90,272 92,256 93,242 C89,243 85,242 81,240 Z'],
  ['calves', 'M68,306 C62,322 62,340 67,356 C70,360 74,360 76,356 C76,338 76,322 75,306 Z'],
  ['calves', 'M77,306 C78,322 79,340 78,358 C82,362 86,358 87,350 C88,334 86,318 82,306 Z'],
];
/* ---------- Programmaler ---------- */
export const pe = (exId, sets, min, max, rule = 'double', rest = 120, o = {}) => ({ exId, sets, min, max, rule, rest, inc: null, ss: o.ss || '', note: o.note || '', plan: o.plan || null });
export const day = (name, ex) => ({ id: uid(), name, ex });
// Intervallplan: seg = én fase, reps = gjenta faser n ganger
// alt = soner man kan velge mellom før start
export const seg = (t, min, z, alt) => [{ t, s: Math.round(min * 60), z: String(z), ...(alt ? { alt } : {}) }];
export const LANGTUR_NOTE = 'Ca. 50 min med jevn fart. Velg sone 2 for en rolig langtur, eller sone 3 for en litt tøffere økt. Rask gange i motbakke (5–10 % stigning) er like bra hvis jogging blir for tungt.';
// Øvelser som kan erstatte hverandre direkte fra økta
export const ALT_GROUPS = [['squat', 'legpress', 'hack'], ['deadlift', 'rackpull'], ['lat_raise', 'cable_lat_raise'], ['pulldown_cg', 'pulldown', 'inv_row'],
  ['cable_row', 'cable_row_1arm'], ['plank', 'pallof'], ['hammer', 'rope_hammer'], ['ez_curl', 'cable_preacher'], ['back_ext', 'pull_through']];
export const reps = (n, segs) => Array.from({ length: n }, (_, i) => segs.map(s => ({ ...s, t: s.t + ' ' + (i + 1) + '/' + n }))).flat();
export const plan = (...parts) => parts.flat();
export const cardio = (exId, p, note) => pe(exId, 1, 1, 1, 'none', 0, { plan: p, note });
export const warmWalk = () => cardio('treadmill', plan(seg('Rask gange', 5, 1)), 'Oppvarming: 5 min rask gange på mølla.');
export const TEMPLATES = () => [
  { id: uid(), name: 'Helkropp A/B – 3 dager', note: 'Veksle mellom A og B, f.eks. man–ons–fre.', days: [
    day('Økt A', [pe('squat', 3, 5, 5, 'linear', 180), pe('bench', 3, 5, 5, 'linear', 180), pe('pulldown', 3, 8, 12), pe('leg_curl', 3, 10, 15, 'double', 90), pe('lat_raise', 3, 12, 20, 'double', 60), pe('plank', 3, 30, 60, 'none', 60)]),
    day('Økt B', [pe('deadlift', 2, 5, 5, 'linear', 180), pe('ohp', 3, 5, 5, 'linear', 150), pe('cable_row', 3, 8, 12), pe('legpress', 3, 10, 15), pe('ez_curl', 3, 8, 12, 'double', 75), pe('rev_hyper', 3, 12, 15, 'double', 75)]),
  ] },
  { id: uid(), name: 'Overkropp/underkropp – 4 dager', note: 'Tung og lett variant av hver. F.eks. man/tir/tor/fre.', days: [
    day('Overkropp 1 (tung)', [pe('bench', 4, 4, 6, 'double', 180), pe('bb_row', 4, 6, 8, 'double', 150), pe('db_ohp', 3, 8, 10), pe('pulldown', 3, 8, 12), pe('cable_fly_hl', 3, 12, 15, 'double', 60), pe('ez_curl', 3, 10, 12, 'double', 75), pe('pushdown', 3, 10, 15, 'double', 75)]),
    day('Underkropp 1 (tung)', [pe('squat', 4, 4, 6, 'double', 180), pe('rdl', 3, 6, 8, 'double', 150), pe('legpress', 3, 10, 12), pe('leg_curl', 3, 10, 15, 'double', 90), pe('smith_calf', 4, 10, 15, 'double', 60), pe('hlr', 3, 10, 15, 'none', 60)]),
    day('Overkropp 2 (volum)', [pe('db_incline', 4, 8, 12), pe('cable_row_1arm', 4, 8, 12), pe('pullup', 3, 5, 10, 'double', 120), pe('lat_raise', 4, 12, 20, 'double', 60), pe('cable_preacher', 3, 10, 12, 'double', 60), pe('skull', 3, 10, 12, 'double', 75)]),
    day('Underkropp 2 (volum)', [pe('rackpull', 3, 3, 5, 'double', 180), pe('hack', 3, 8, 12), pe('bulgarian', 3, 8, 12, 'double', 90), pe('leg_ext', 3, 12, 15, 'double', 75), pe('rev_hyper', 3, 12, 15, 'double', 75), pe('back_ext', 3, 10, 15, 'double', 75)]),
  ] },
  { id: uid(), name: 'Bein & sete + overkropp – 3 dager', note: 'To beindager med sete-fokus og én overkroppsdag.', days: [
    day('Bein & sete 1', [pe('hip_thrust', 4, 8, 12, 'double', 120), pe('hack', 3, 8, 12), pe('rdl', 3, 8, 10, 'double', 120), pe('leg_curl', 3, 10, 15, 'double', 75), pe('rev_hyper', 3, 12, 15, 'double', 75), pe('cable_kickback', 3, 12, 15, 'double', 60), pe('cable_abduct', 3, 15, 20, 'double', 60)]),
    day('Overkropp', [pe('db_bench', 3, 8, 12), pe('cable_row', 3, 10, 12), pe('db_ohp', 3, 8, 12), pe('pulldown_cg', 3, 10, 12), pe('lat_raise', 3, 12, 20, 'double', 60), pe('face_pull', 3, 12, 15, 'double', 60)]),
    day('Bein & sete 2', [pe('smith_squat', 4, 6, 10, 'double', 150), pe('bulgarian', 3, 8, 12, 'double', 90), pe('pull_through', 3, 12, 15, 'double', 75), pe('leg_ext', 3, 12, 15, 'double', 75), pe('lp_calf', 3, 12, 15, 'double', 60), pe('plank', 3, 30, 60, 'none', 60)]),
  ] },
  { id: uid(), name: 'Kom i gang – helkropp A/B', note: '2–3 økter i uka, veksle A og B. Ca. 35–40 min. Supersett: ett sett av 1, så ett av 2, hvil, gjenta.', days: [
    day('Kom i gang A', [
      warmWalk(),
      pe('goblet', 3, 8, 12, 'double', 90, { ss: 'A', note: 'Hold manualen inntil brystet, sitt rett ned mellom hælene, knærne følger tærne.' }),
      pe('pulldown_cg', 3, 8, 12, 'double', 90, { ss: 'A', note: 'Trekk stanga ned til øvre del av brystet. Brystet fram, albuene ned mot hoftene.' }),
      pe('legpress', 3, 10, 15, 'double', 90, { ss: 'B', note: 'Senk sleden kontrollert til ca. 90° i kneet. Ikke lås knærne helt ut.' }),
      pe('db_bench', 3, 8, 12, 'double', 90, { ss: 'B', note: 'Skulderbladene samlet mot benken, senk manualene til de er i høyde med brystet.' }),
      pe('leg_curl', 2, 10, 15, 'double', 60, { ss: 'C', note: 'Rolig ned, ca. 2–3 sek.' }),
      pe('pallof', 2, 8, 12, 'double', 60, { ss: 'C', note: 'Reps per side. Press rett fram og hold 2 sek uten å la kabelen vri deg.' }),
    ]),
    day('Kom i gang B', [
      warmWalk(),
      pe('db_rdl', 3, 8, 12, 'double', 90, { ss: 'A', note: 'Skyv hoftene bakover med svak bøy i knærne. Rett rygg, manualene tett langs lårene.' }),
      pe('cable_row', 3, 10, 12, 'double', 90, { ss: 'A', note: 'Sitt rett, trekk mot magen og klem skulderbladene sammen.' }),
      pe('smith_split', 2, 8, 10, 'double', 90, { ss: 'B', note: 'Reps per bein. Stanga i smithen gir god balanse. Bakre kne nesten ned i gulvet.' }),
      pe('db_ohp', 3, 8, 12, 'double', 90, { ss: 'B', note: 'Gjerne sittende. Press rett opp, ikke svai i ryggen.' }),
      pe('back_ext', 2, 10, 15, 'double', 60, { ss: 'C', note: 'Kontrollert ned og opp til rett linje. Ikke overstrekk ryggen.' }),
      pe('cable_lat_raise', 2, 10, 15, 'double', 60, { ss: 'C', note: 'Trinsen helt nede og lett vekt. Reps per arm, løft til skulderhøyde.' }),
    ]),
  ] },
  { id: uid(), name: 'Kondisjon på mølla – 3 økter', note: 'Velg dag fritt. Sett makspuls under Mer for å se pulsen i hver sone. Uten pulsmåler: bruk prat-testen.', days: [
    day('Rolig jogg (sone 2)', [cardio('treadmill', plan(seg('Gange', 5, 1), seg('Rolig jogg', 20, 2), seg('Gange', 5, 1)),
      'Ca. 30 min. Du skal kunne prate hele tiden. Blir det for tungt: veksle 3 min jogg og 1 min gange.')]),
    day('Intervaller 4×4', [cardio('treadmill', plan(seg('Oppvarming', 10, '1-2'), reps(4, plan(seg('Drag', 4, 4), seg('Pause (gå/jogg)', 3, 2))), seg('Nedtrapping', 5, 1)),
      'Ca. 43 min. De første gangene kan du ta 2–3 drag i stedet for 4. Siste minutt av hvert drag skal være tungt. Øk gjerne stigningen i stedet for farten.')]),
    day('Langtur (sone 2–3)', [cardio('treadmill', plan(seg('Oppvarming', 5, 1), seg('Langtur', 40, 2, ['2', '3']), seg('Nedtrapping', 5, 1)), LANGTUR_NOTE)]),
  ] },
];
