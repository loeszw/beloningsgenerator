// Draait de kernlogica uit index.html (script#core) in Node en bouwt alle PDF's.
// Gebruik: npm test   → schrijft PDF's naar tests/out/ en faalt bij fouten.
const fs = require("fs"), path = require("path"), assert = require("assert");
const L = require("pdf-lib");
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const core = html.match(/<script id="core">([\s\S]*?)<\/script>/)[1];
const ui = html.match(/<script id="ui">([\s\S]*?)<\/script>/)[1];
new Function(ui); // syntaxcontrole UI-script
const API = new Function("PDFLib", core + "\nreturn {parseBron,verzamel,dubbelen,bouwInrichting,bouwAanvulling,bouwUitvraag,leesUitvraag,groep,heeftCaoRef,standaardKeuze};")(L);
const out = path.join(__dirname, "out"); fs.mkdirSync(out, { recursive: true });
const fx = n => fs.readFileSync(path.join(__dirname, "fixtures", n), "utf8");
const state = (d, keuze) => ({ scenario: 1, data: d, uitz: d.uitzonderingen, ctrl: d.te_controleren.map((c, i) => ({ ...c, keuze: keuze(c, i), tekst: "toelichting" })), functies: d.functies, uitlener: "Intermediair Uitzendbureau", intercedent: "Test", peildatum: "2026-11-05" });

(async () => {
  // Route 1, schema 1.1
  let r = API.parseBron(fx("route1_schema11_installatie.json"));
  assert(!r.fouten, "schema 1.1 moet inleesbaar zijn");
  let st = state(r.data, c => c.signaal === "mogelijk_onder_cao" ? "cao" : "correctie");
  fs.writeFileSync(path.join(out, "inrichting_11.pdf"), await API.bouwInrichting(L, st));
  fs.writeFileSync(path.join(out, "aanvulling_11.pdf"), await API.bouwAanvulling(L, st));

  // Route 1, schema 1.2 met meerdere bronnen
  r = API.parseBron(fx("route1_schema12_meerdere_bronnen.json"));
  assert.deepStrictEqual(API.dubbelen(r.data.uitzonderingen).length > 0, true, "dubbele consignatieregels moeten worden gesignaleerd");
  st = state(r.data, (c, i) => i === 0 ? "pergeval" : "");
  const v = API.verzamel(st);
  assert(v.openEss.length === 0, "essentiële punten zijn beoordeeld");
  fs.writeFileSync(path.join(out, "inrichting_12.pdf"), await API.bouwInrichting(L, st));

  // Route 1, alleen een formulier (geen cao-referentie)
  r = API.parseBron(fx("route1_alleen_formulier.json"));
  assert(!r.data.te_controleren.some(c => c.signaal === "tegenstrijdig"), "bij één document geen tegenstrijdig");
  assert.strictEqual(API.heeftCaoRef(r.data), false);
  const jub = r.data.te_controleren.find(c => c.subkop === "Jubileum uitkeringen");
  assert.strictEqual(API.standaardKeuze(jub, r.data), "pergeval", "voorwaardelijk staat standaard op per geval");
  st = { ...state(r.data, c => API.standaardKeuze(c, r.data) || "bron") };
  fs.writeFileSync(path.join(out, "inrichting_alleen_formulier.pdf"), await API.bouwInrichting(L, st));

  // Route 2: uitvraag maken → invullen → inlezen
  const inv = { klant: { bedrijfsnaam: "Voorbeeld BV", kvk_nummer: null, contactpersoon_naam: null, contactpersoon_email: null }, cao: { naam: "Voorbeeld-cao" }, cao_keuzes: {}, functies: [], uitlener: "Intermediair Uitzendbureau", intercedent: "Test", peildatum: "2026-11-05" };
  const bytes = await API.bouwUitvraag(L, inv);
  fs.writeFileSync(path.join(out, "uitvraag.pdf"), bytes);
  const doc = await L.PDFDocument.load(bytes); const f = doc.getForm();
  f.getCheckBox("meer_reiskosten").check(); f.getTextField("toel_reiskosten").setText("€ 0,21 per km vanaf km 1");
  f.getCheckBox("meer_bonus").check();
  f.getTextField("door_naam").setText("Test"); f.getTextField("door_datum").setText("5-11-2026");
  const rr = await API.leesUitvraag(L, await doc.save());
  assert.strictEqual(rr.data.uitzonderingen.length, 1); assert.strictEqual(rr.data.te_controleren.length, 1);
  console.log("Alle tests geslaagd. PDF's staan in tests/out/.");
})().catch(e => { console.error(e); process.exit(1); });
