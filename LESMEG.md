# Garasjegym

En treningslogg for garasjegymmen, laget som en web-app (PWA). Samme app virker på Android og iPhone, og legges på hjemskjermen som en vanlig app. Alt lagres lokalt på hver telefon, og appen virker uten nett når den først er lastet.

## Filer

| Fil | Hva |
|---|---|
| `index.html` | Hele appen |
| `manifest.webmanifest`, `icon-*.png` | Navn og ikon på hjemskjermen |
| `sw.js` | Gjør at appen virker uten nett |

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

## Sikkerhetskopi

**Mer → Eksporter** lager en JSON-fil. Lagre den i Filer, Google Drive eller e-post. **Importer** henter den inn igjen, også på en ny telefon.
