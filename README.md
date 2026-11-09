# Beloningsgenerator IU Groep

Interne tool die het beloningsregister vervangt. Intercedenten leggen hiermee de arbeidsvoorwaarden van een opdrachtgever (inlener) vast en maken de documenten voor de backoffice en HelloFlex, als onderbouwing voor gelijkwaardige beloning (cao uitzendkrachten 2026) en de WTTA-toelating (2027).

De hele tool is één bestand: [`index.html`](index.html). Alles draait in de browser; er wordt niets opgeslagen of verstuurd. Alleen de PDF-bibliotheek (cdnjs) en het lettertype (Google Fonts) worden van buiten geladen.

## Twee routes

| Route | Wanneer | Wat de tool maakt |
|---|---|---|
| **Formulier van de opdrachtgever** | De opdrachtgever heeft een formulier (bijv. wijzerbelonen.nl) en/of regelingen aangeleverd, of heeft een eigen loongebouw. | Inrichtingsdocument (intern) en, bij correcties, een aanvulling die met het formulier in HelloFlex wordt getekend. |
| **Alleen een cao** | Er is nog geen formulier; de cao (Caoloon) is de basis. | Invulbare uitvraag "Geeft u meer dan de cao?". De ingevulde uitvraag wordt ingelezen via het sleepvak van de route "Formulier van de opdrachtgever". |

De omzetting van formulieren gebeurt met een vaste ChatGPT-assistent. De instructies (prompt) van die assistent staan bewust niet in deze repository. Het gedeelde veldformaat staat in [`docs/veldschema.json`](docs/veldschema.json).

## Lokaal gebruiken

Open `index.html` in de browser. Er is geen build-stap.

## Testen

```bash
npm install
npm test
```

De test leest `index.html`, draait de kernlogica in Node en schrijft voorbeeld-PDF's naar `tests/out/`.

## Publiceren

> **Let op:** GitHub Pages is bij een gewoon account altijd openbaar, ook vanuit een private repository is dat alleen met GitHub Enterprise af te schermen. De pagina zelf bevat geen klantgegevens en heeft `noindex`, maar de afspraak was: niet-gepubliceerde URL of wachtwoord.

Opties, van eenvoudig naar veilig:

1. **Eigen website** – zet `index.html` op een niet-gelinkte URL (zoals nu de bedoeling was).
2. **GitHub Pages** – Settings → Pages → Deploy from branch `main` / root. Openbaar.
3. **Netlify of Cloudflare Pages met toegangsbeveiliging** – koppel de repository en zet wachtwoord- of Microsoft-login (Cloudflare Access) aan.

Zet nooit klantdocumenten of echte JSON-bestanden van klanten in deze repository; de fixtures in `tests/fixtures/` zijn geanonimiseerd.

## Documentatie

- [`docs/onderzoek-wtta-normenkader.md`](docs/onderzoek-wtta-normenkader.md) – WTTA-normenkader en toetsing van de tool.
- [`CLAUDE.md`](CLAUDE.md) – werkafspraken voor Claude Code.
