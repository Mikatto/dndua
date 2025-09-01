"use client";
import { useApp } from "@/lib/store";
import { fetchList } from "@/lib/api";
import { useEffect, useState } from "react";
export default function Sheet(){
  const { character } = useApp();
  const [data, setData] = useState<any>(null);
  useEffect(()=>{ (async()=>{ const [races,classes,spells,features]=await Promise.all([
    fetchList(character.edition,"races"), fetchList(character.edition,"classes"), fetchList(character.edition,"spells"), fetchList(character.edition,"features")
  ]); setData({races,classes,spells,features}); })(); }, [character.edition]);
  const origin = data?.races?.find((o:any)=>o.slug===character.origin);
  const klass = data?.classes?.find((c:any)=>c.slug===character.klass);
  const chosenSpells = (data?.spells||[]).filter((s:any)=>character.spells?.includes(s.slug));
  const chosenFeatures = (data?.features||[]).filter((f:any)=>character.features?.includes(f.slug));
  return (
    <section className="container py-6 space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{character.name || "Безіменний"}</h1>
          <div className="text-neutral-400">{origin?.name || "—"} · {klass?.name || "—"} · Ред. {character.edition}</div>
        </div>
        <div className="space-x-2 print:hidden">
          <button className="btn" onClick={()=>{ const blob = new Blob([JSON.stringify(character,null,2)],{type:"application/json"}); const url = URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=(character.name||"character")+".json"; a.click(); URL.revokeObjectURL(url); }}>Експорт JSON</button>
          <button className="btn btn-primary" onClick={()=>window.print()}>Друк</button>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="card"><h3 className="text-xl">Характеристики</h3>
          <ul className="mt-2 space-y-1">{Object.entries(character.abilities).map(([k,v])=>(<li key={k} className="flex items-center justify-between"><span>{k}</span><strong>{v}</strong></li>))}</ul>
        </div>
        <div className="card"><h3 className="text-xl">Закляття</h3>
          <ul className="list-disc pl-5">{chosenSpells.length?chosenSpells.map((s:any)=>(<li key={s.slug}>{s.name}<span className="text-neutral-400"> · рів.{s.level}</span></li>)):<li className="text-neutral-400">—</li>}</ul>
        </div>
        <div className="card"><h3 className="text-xl">Особливості</h3>
          <ul className="list-disc pl-5">{chosenFeatures.length?chosenFeatures.map((f:any)=>(<li key={f.slug}>{f.name}</li>)):<li className="text-neutral-400">—</li>}</ul>
        </div>
      </div>
    </section>
  );
}
