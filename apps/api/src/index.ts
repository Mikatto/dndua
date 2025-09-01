import express from "express";
import cors from "cors";
import { readFileSync } from "fs";
import { join } from "path";
import { z } from "zod";
import { Character as CharacterSchema } from "@dndua/shared";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), "..", "..", "data");

function loadJSON(path: string){ return JSON.parse(readFileSync(path, "utf-8")); }
function listsFor(ed: "2014" | "2024"){
  const base = join(DATA_DIR, `srd-${ed}`);
  return {
    races: loadJSON(join(base, "races.json")),
    classes: loadJSON(join(base, "classes.json")),
    spells: loadJSON(join(base, "spells.json")),
    features: loadJSON(join(base, "features.json"))
  };
}

app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/srd/:edition/:kind", (req, res) => {
  const edition = z.enum(["2014","2024"]).parse(req.params.edition);
  const kind = z.enum(["races","classes","spells","features"]).parse(req.params.kind);
  const lists = listsFor(edition);
  // @ts-ignore
  res.json(lists[kind] || []);
});

// in-memory characters
const mem: Record<string, any> = {};
const id = () => Math.random().toString(36).slice(2, 10);
app.get("/characters", (_req, res) => res.json(Object.values(mem)));
app.post("/characters", (req, res) => {
  const parsed = CharacterSchema.safeParse(req.body);
  if(!parsed.success) return res.status(400).json(parsed.error);
  const ch = { ...parsed.data, id: id(), createdAt: new Date().toISOString() };
  mem[ch.id] = ch; res.json(ch);
});
app.get("/characters/:id", (req, res) => { const ch = mem[req.params.id]; if(!ch) return res.status(404).json({error:"Not found"}); res.json(ch); });
app.put("/characters/:id", (req, res) => {
  const ch = mem[req.params.id]; if(!ch) return res.status(404).json({error:"Not found"});
  const parsed = CharacterSchema.safeParse(req.body);
  if(!parsed.success) return res.status(400).json(parsed.error);
  mem[req.params.id] = { ...parsed.data, id: req.params.id, updatedAt: new Date().toISOString() };
  res.json(mem[req.params.id]);
});
app.delete("/characters/:id", (req, res) => { delete mem[req.params.id]; res.json({ ok: true }); });

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
