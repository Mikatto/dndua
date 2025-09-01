import { create } from "zustand";
import type { Character } from "@dndua/shared";
type State = { character: Character; set: (partial: Partial<Character>) => void; reset: () => void; };
const empty: Character = { name:"", edition:"2024", origin:null, klass:null, abilities:{STR:8,DEX:8,CON:8,INT:8,WIS:8,CHA:8}, spells:[], features:[] };
export const useApp = create<State>((set) => ({
  character: (typeof window!=="undefined" && localStorage.getItem("dndua_state") ? JSON.parse(localStorage.getItem("dndua_state") as string) : empty) as Character,
  set(partial){ set((s)=>{ const next = { ...s.character, ...partial }; if(typeof window!=="undefined"){ localStorage.setItem("dndua_state", JSON.stringify(next)); } return { character: next }; }); },
  reset(){ set({ character: empty }); if(typeof window!=="undefined"){ localStorage.removeItem("dndua_state"); } }
}));
