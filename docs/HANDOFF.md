# Overdracht vanuit claude.ai (5 november 2026)

Lees eerst `CLAUDE.md` en `README.md`. Dit document vult alleen aan wat daar niet staat: hoe we hier kwamen en wat er nog openstaat. Verwijder het na de eerste sessie of verplaats de open punten naar issues.

## Belangrijkste besluiten (in volgorde genomen)
1. Tool = interne generator; klant vult niets online in, controleert en tekent in HelloFlex.
2. Bouwen, niet kopen (Onplia/Brightmine, Inlenersportaal bekeken).
3. Formulieren omzetten via vaste ChatGPT-assistent (geen API); uitkomst als bestand, intercedent ziet geen JSON.
4. Meerdere bronnen per klant: formulier = checklist/verklaring, cao en regelingen leidend voor bedragen en voorwaarden; verschillen → controlepunt "tegenstrijdig"; voorwaarden die een uitzendkracht mogelijk niet haalt → "voorwaarde toetsen".
5. Route "Formulier": klant tekent zijn eigen formulier opnieuw; generator maakt inrichtingsdocument + zo nodig aanvulling.
6. Route "Alleen een cao": cao-keuzes, functies en KvK zitten niet in de uitvraag (komen uit Caoloon / niet nodig).
7. Prioritering: 11 essentiële elementen; inrichtingsdocument downloadbaar na beoordeling daarvan; voorwaardelijke regelingen in hoofdstuk 3 met voorwaarden en bron, net als de andere hoofdstukken (geen aparte bijlage meer).
8. Geen scenarionummers in de UI.
9. Geen blokkade meer op oude formulieren of beloningsregister-exports; alleen een waarschuwing. Beloningsregister-exports zijn bron_type "beloningsregister", ongeacht de datum.
10. Controlepunten met meerdere bronnen: per bron een keuze “Klopt: <document>”. Kiest de intercedent een andere bron dan het formulier, dan wordt het een correctie in de aanvulling.
11. Eén controle-stroom: de route "Alleen een cao" maakt alleen de uitvraag. De ingevulde uitvraag (PDF) wordt in het sleepvak van "Formulier van de opdrachtgever" gesleept en daar gecontroleerd (`laadUitvraagPdf`).

## Open werk (op prioriteit)
1. **Samengevoegd document (Caoloon-uitdraai + afwijkingen)** in de formulierroute, voor ingelezen uitvragen: Caoloon-uitdraai (PDF) inlezen met pdf.js, koppen als volledige regel matchen (`matching_regels_generator` in het schema), per afwijking na het onderdeel een pagina "Afwijking klant" invoegen, pagina 1 = samenvatting met akkoord en tabel "afwijking → pagina", functie/schaal van pagina 1 van de uitdraai halen. Klaar als: twee uitdraaien van verschillende cao's correct worden samengevoegd. **Wacht op een tweede Caoloon-uitdraai van Loes** (eerste was cao M&T).
2. **Echte test van de assistent** met de vier testdocumenten van een energiebedrijf (wijzerbelonen-formulier, sector-cao, bedrijfs-cao, bedrijfsregelingen). Verwachting: zorgverzekeringsbijdrage → "voorwaarde toetsen", Benefit Budget → "tegenstrijdig". Documenten staan niet in de repo (klantdata).
3. **Koppeling aan de 12 WTTA-elementen** zodra de definitieve regeling verschijnt (eind 2026); zie `docs/onderzoek-wtta-normenkader.md`.
4. **Werkinstructie** voor intercedenten (verkrijgen, controleren, vastleggen, bijwerken, compensatiebesluit per geval vastleggen).
5. Pilot januari 2027 (~5 klanten), inhaalslag februari–april, klaar vóór 1 mei 2027.

## Bekende aandachtspunten
- Invulbare PDF's: sommige viewers (browser, macOS Voorvertoning) bewaren velden slecht; klant moet Acrobat Reader gebruiken.
- Caoloon-uitdraai toont soms "Invalid Date" bij peildatum; de tool legt de peildatum zelf vast.
- GitHub Pages is openbaar; zie README.

## Aanbevolen skills
- `frontend-design` bij UI-wijzigingen.
- `diagnosing-bugs` bij fouten in PDF-opbouw of inlezen.
- `domain-modeling` om een `GLOSSARY.md` te maken (opdrachtgever, inlener, uitvraag, inrichtingsdocument, aanvulling, controlepunt, essentieel/structureel/voorwaardelijk).
- `writing-for-agents` bij wijzigingen aan `CLAUDE.md` of de assistent-instructies (die staan buiten deze repository).
- `grilling` voor ontwerpvragen bij het samengevoegde document.
