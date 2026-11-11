# Beloningsgenerator – werkafspraken

Taal: alle UI-teksten, documenten en commits in het Nederlands. Typografische aanhalingstekens (‘ ’ “ ”) in zichtbare tekst.

## Architectuur
- Eén bestand `index.html`, geen build. Twee scripts:
  - `<script id="core">`: domeinlogica en PDF-opbouw, **zonder DOM**, zodat `npm test` het in Node kan draaien. Nieuwe logica hoort hier.
  - `<script id="ui">`: alleen schermlogica.
- PDF's via pdf-lib 1.17.1 (cdnjs) met standaardfont Helvetica: alle tekst gaat door `clean()` (WinAnsi). Nieuwe tekens die niet in WinAnsi zitten → in `clean()` vervangen.
- Logo's staan als base64 in `LOGO_NORMAAL` / `LOGO_DIAP`; bronbestanden in `assets/`.
- Huisstijl IU Groep: oranje-rood `#E8492A`, zwart, wit, lichtgrijs; Barlow / Barlow Condensed.
- Privacy is een ontwerpkeuze: geen opslag, geen netwerkverkeer met klantdata, geen analytics.

## Domein (bronnen van waarheid)
- Veldformaat: `docs/veldschema.json` (nu 1.2; 1.1 blijft inleesbaar). Wijzig je velden, verhoog dan de versie in schema, de assistent-instructies (buiten deze repository) én `parseBron()`.
- Koppen = Caoloon-koppen (`KOPPEN`); vier extra koppen bestaan niet in Caoloon en landen op "Overige afspraken". `Vakantie` → `Vakantiedagen` via `KOP_ALIAS`.
- Twee fases: **controle** (`state`, alleen `BLOKKEREND` = mogelijk_onder_cao + tegenstrijdig blokkeert; voorwaarde_toetsen gaat door) en **inrichting** (`istate`, uit het vastleggingsdocument via `staatUitVastlegging`).
- Overdracht tussen fases: verborgen formulierveld `bg_vastlegging` (base64-JSON) in het vastleggingsdocument; uitvraag gebruikt `bg_meta`. `pdfSoort()` herkent beide.
- Prioriteit (alleen inrichting): `ELEMENTEN` (11 essentiële elementen) eerst; overige punten *structureel* of *voorwaardelijk* (`VOORW_STD`). Inrichtingsformulier mag pas als alle essentiële punten beoordeeld zijn.
- Er is geen aanvulling meer: bij een tegenstrijdigheid past de opdrachtgever zijn formulier aan en tekent opnieuw (werkinstructie E2).

## Bewust buiten scope
Cao-keuzes en functies/schaal (Caoloon), verloning en bewijs daarvan (salarissysteem), compensatie bij gelijkwaardig belonen (per geval), informatie aan de uitzendkracht (later, vóór 1-7-2027).

## Werkwijze
- Na elke wijziging: `npm test` groen, en open de PDF's in `tests/out/` om de opmaak te bekijken.
- Klantgegevens nooit committen; fixtures zijn geanonimiseerd.
