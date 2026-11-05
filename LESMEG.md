# Garasjegym

En treningslogg for garasjegymmen, laget som en web-app (PWA). Samme app virker på Android og iPhone, og legges på hjemskjermen som en vanlig app. Alt lagres lokalt på hver telefon, og appen virker uten nett når den først er lastet.

## Filer

| Fil | Hva |
|---|---|
| `index.html` | Skjermene, handlingene og lagringen |
| `logic.js` | Ren logikk: skiveberegning, vektforslag, rekorder, pulssoner |
| `data.js` | Utstyr, øvelsesbibliotek, muskelkart og programmaler |
| `manifest.webmanifest`, `icon-*.png` | Navn og ikon på hjemskjermen |
| `sw.js` | Gjør at appen virker uten nett |
| `test/`, `package.json` | Enhetstester for logikken (`npm test`, trenger bare Node) |

Appen bruker ES-moduler og må åpnes via en nettadresse (ikke dobbeltklikk på `index.html`). Lokalt: `npm start` og åpne `http://localhost:8080`.

## Få appen over på telefonene

Appen må ligge på en HTTPS-adresse for å kunne installeres og virke uten nett. Den enkleste gratisløsningen er GitHub Pages:

1. Lag en konto på github.com og et nytt **public** repository, for eksempel `garasjegym`.
2. Last opp alle filene i denne mappen («Add file → Upload files»).
3. Gå til **Settings → Pages**, velg **Deploy from a branch**, branch `main` og mappe `/ (root)`, og lagre.
4. Etter et minutt eller to ligger appen på `https://<brukernavn>.github.io/garasjegym/`.

Adressen er offentlig, men ingen treningsdata ligger der. Dataene lagres bare på telefonene.

**Android (Chrome):** Åpne adressen, trykk ⋮ og velg **Installer app** eller **Legg til på startskjermen**.

**iPhone (Safari):** Åpne adressen i Safari, trykk Del-knappen ⬆️ og velg **Legg til på Hjem-skjerm**. Bruk alltid ikonet på hjemskjermen. Da beholder iOS dataene.

## Første gang

1. **Mer → Profil:** Skriv inn navnet ditt.
2. **Mer → Utstyr:** Sjekk antall vektskiver og startvektene på maskinene. Følgende verdier er antatt og bør kontrolleres:
   - stangvekten i smithmaskinen
   - om benpressen, leg extension/curl og reverse hyper lastes på én eller to sider
   - hvilke vekter manualene kan stilles på
   - om dere har benk
3. **Program:** Velg en mal, eller lag et eget program.

## Puls og kondisjon

- **Mer → Profil:** Legg inn fødselsår, så anslås makspuls (211 − 0,64 × alder). Har du målt høyere på en hard økt, skriv inn den. Trykk «Vis pulssonene» for Olympiatoppens fem soner i slag/min.
- Sonene er prosent av *din* makspuls og gjelder uansett treningsnivå. Som utrent bør det meste ligge i sone 1–2.
- **Varighet:** På jevne økter (rolig jogg, langtur) kan hovedfasen justeres før start med −5/+5 eller faste valg (20–90 min). Valget huskes i programmet.
- **Egne intervaller:** Program → åpne økta → faser kan redigeres (navn, minutter, sone), og «+ Intervallbolk» lager gjentak som 6 × [Drag 3:00, Pause 2:00].
- **Fullskjerm:** Under intervalltimeren, trykk ⤢ for stor klokke, sone og puls som kan leses fra mølla. Tilbake-knappen lukker.
- **Fremgang** viser km per uke, tid i pulssone denne uka og tempoutvikling når det finnes løpeturer.

## Under økta

- Et sett hukes av med ✓ etter at vekt og reps er skrevet inn. Tallet som ligger i feltet fra før er et *mål* (forslag), ikke et resultat.
- Trykk på settnummeret for å notere **RIR** (reps igjen i tanken) eller markere settet som oppvarming. RIR lagres med økta og gir et hint i vektforslaget neste gang.
- Hviletimeren er basert på klokkeslett og tåler at du bytter app, men lyd og vibrasjon kommer bare mens appen er åpen på skjermen. Skjermen holdes våken så lenge en økt er i gang.
- Skrivefeil kan rettes etterpå: åpne økta under **Fremgang → Historikk** og endre tallene, eller slett et sett.

## Sikkerhetskopi

**Mer → Eksporter** lager en JSON-fil. Lagre den i Filer, Google Drive eller e-post. **Importer** henter den inn igjen, også på en ny telefon. Appen minner deg på eksport når det er logget økter som ikke er sikkerhetskopiert.
