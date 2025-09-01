import { z } from "zod";

export const AbilityKey = z.enum(["STR","DEX","CON","INT","WIS","CHA"]);
export const AbilityScores = z.object({
  STR: z.number().int().min(1).max(30),
  DEX: z.number().int().min(1).max(30),
  CON: z.number().int().min(1).max(30),
  INT: z.number().int().min(1).max(30),
  WIS: z.number().int().min(1).max(30),
  CHA: z.number().int().min(1).max(30)
});
export const SrdEdition = z.enum(["2014","2024"]);
export const SrdClass = z.object({ slug: z.string(), name: z.string(), hit_die: z.number().int(), primary_ability: z.string().optional() });
export const SrdRace  = z.object({ slug: z.string(), name: z.string(), size: z.string().optional(), traits: z.array(z.string()).optional() });
export const SrdSpell = z.object({ slug: z.string(), name: z.string(), level: z.number().int(), school: z.string(), range: z.string(), classes: z.array(z.string()).optional() });
export const SrdFeature = z.object({ slug: z.string(), name: z.string(), source_class: z.string().optional() });
export const Character = z.object({
  id: z.string().optional(),
  ownerId: z.string().optional(),
  name: z.string(),
  edition: SrdEdition,
  origin: z.string().nullable(),
  klass: z.string().nullable(),
  abilities: AbilityScores,
  spells: z.array(z.string()).default([]),
  features: z.array(z.string()).default([])
});
export type Character = z.infer<typeof Character>;
