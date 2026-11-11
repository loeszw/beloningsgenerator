// Draait de kernlogica uit index.html (script#core) in Node: uitvraag → controle → vastlegging → inrichting.
// Gebruik: npm test → schrijft PDF's naar tests/out/ en faalt bij fouten.
const fs = require("fs"), path = require("path"), assert = require("assert");
const L = require("pdf-lib");
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const core = html.match(/<script id="core">([\s\S]*?)<\/script>/)[1];
new Function(html.match(/<script id="ui">([\s\S]*?)<\/script>/)[1]); // syntaxcontrole UI
const A = new Function(core + "\nreturn {parseBron,dubbelen,bouwUitvraag,leesUitvraag,pdfSoort,maakVastlegging,bouwVastlegging,leesVastlegging,staatUitVastlegging,bouwInrichting,verzamel,heeftCaoRef,standaardKeuze};")();
const out = path.join(__dirname, "out"); fs.mkdirSync(out, { recursive: true });
const fx = n => fs.readFileSync(path.join(__dirname, "fixtures", n), "utf8");
const controle = (d, keuze) => ({ fase: "controle", data: d, uitz: d.uitzonderingen, ctrl: d.te_controleren.map((c, i) => ({ ...c, keuze: keuze(c, i), tekst: "toelichting" })), functies: d.functies, uitlener: "Intermediair Uitzendbureau", intercedent: "Test", peildatum: "2026-11-12" });
const doorketen = async (st, naam) => {
  const V = A.maakVastlegging(st);
  const vl = await A.bouwVastlegging(L, V); fs.writeFileSync(path.join(out, `vastlegging_${naam}.pdf`), vl);
  assert.strictEqual(await A.pdfSoort(L, vl), "vastlegging");
  const is = A.staatUitVastlegging((await A.leesVastlegging(L, vl)).V);
  fs.writeFileSync(path.join(out, `inrichting_${naam}.pdf`), await A.bouwInrichting(L, is));
  return { V, is };
};

(async () => {
  // Uitvraag opmaken met cao-bijlage (dummy-PDF van 2 pagina's als Caoloon-uitdraai)
  const dummy = await L.PDFDocument.create(); dummy.addPage(); dummy.addPage();
  const inv = { klant: { bedrijfsnaam: "Voorbeeld BV" }, cao: { naam: "Voorbeeld-cao" }, cao_keuzes: {}, functies: [], uitlener: "Intermediair Uitzendbureau", intercedent: "Test", peildatum: "2026-11-12" };
  const u = await A.bouwUitvraag(L, inv, await dummy.save());
  fs.writeFileSync(path.join(out, "uitvraag_met_cao.pdf"), u);
  const doc = await L.PDFDocument.load(u); const f = doc.getForm();
  assert.strictEqual(doc.getPageCount() >= 8, true, "uitvraag + scheidingspagina + 2 cao-pagina's");
  f.getCheckBox("meer_reiskosten").check(); f.getTextField("toel_reiskosten").setText("€ 0,21 per km vanaf km 1");
  f.getCheckBox("meer_bonus").check(); f.getTextField("door_naam").setText("Test"); f.getTextField("door_datum").setText("12-11-2026");
  const getekend = await doc.save();
  assert.strictEqual(await A.pdfSoort(L, getekend), "uitvraag");
  const ru = await A.leesUitvraag(L, getekend);
  assert.strictEqual(ru.data.uitzonderingen.length, 1); assert.strictEqual(ru.data.te_controleren.length, 1);
  await doorketen(controle(ru.data, () => ""), "uitvraag");

  // Formulier (schema 1.1): blokkerende punten beslist
  let r = A.parseBron(fx("route1_schema11_installatie.json"));
  await doorketen(controle(r.data, c => c.signaal === "mogelijk_onder_cao" ? "cao" : "correctie"), "formulier11");

  // Meerdere bronnen: keuze per bron; voorwaarde gaat door naar inrichting
  r = A.parseBron(fx("route1_schema12_meerdere_bronnen.json"));
  assert(A.dubbelen(r.data.uitzonderingen).length > 0, "dubbele consignatieregels gesignaleerd");
  const { V, is } = await doorketen(controle(r.data, c => c.signaal === "tegenstrijdig" ? "bronidx:1" : ""), "meerdere_bronnen");
  assert(V.arbeidsvoorwaarden.some(a => a.te_toetsen), "voorwaarde_toetsen gaat mee in de vastlegging");
  assert(is.ctrl.length > 0 && is.ctrl.every(c => c.signaal === "voorwaarde_toetsen"), "inrichting toetst alleen voorwaarden");

  // Alleen een formulier: geen tegenstrijdig, geen cao-referentie
  r = A.parseBron(fx("route1_alleen_formulier.json"));
  assert(!r.data.te_controleren.some(c => c.signaal === "tegenstrijdig"));
  assert.strictEqual(A.heeftCaoRef(r.data), false);
  await doorketen(controle(r.data, () => ""), "alleen_formulier");

  console.log("Alle tests geslaagd. PDF's staan in tests/out/.");
})().catch(e => { console.error(e); process.exit(1); });
