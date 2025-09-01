"use client";
import { useEffect, useState } from "react";
import { fetchList } from "@/lib/api";
export default function Rules(){
  const [edition, setEdition] = useState<"2014"|"2024">("2024");
  const [q, setQ] = useState(""); const [data, setData] = useState<any>({ races:[], classes:[], spells:[] });
  useEffect(()=>{ (async()=>{ const [races,classes,spells]=await Promise.all([ fetchList(edition,"races"), fetchList(edition,"classes"), fetchList(edition,"spells") ]); setData({races,classes,spells}); })(); }, [edition]);
  const filter = (arr:any[]) => arr.filter(x => (x.name||"").toLowerCase().includes(q.toLowerCase()));
  return (
    <section className="container py-6 space-y-3">
      <div className="card flex items-center justify-between gap-2 flex-wrap">
        <div><h2 className="text-2xl font-semibold">Правила SRD</h2><div className="text-neutral-400">Перемикай редакцію для перегляду списків.</div></div>
        <div className="flex items-center gap-2">
          <select value={edition} onChange={e=>setEdition(e.target.value as any)} className="bg-neutral-900 border border-border rounded-lg px-3 py-2">
            <option value="2024">Редакція 2024</option><option value="2014">Редакція 2014</option>
          </select>
          <input className="bg-neutral-900 border border-border rounded-lg px-3 py-2" placeholder="Пошук…" value={q} onChange={e=>setQ(e.target.value)} />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="card"><h3 className="text-xl">Класи <span className="badge">{data.classes.length}</span></h3>
          <ul className="list-disc pl-5">{filter(data.classes).map((x:any)=>(<li key={x.slug}><strong>{x.name}</strong> <span className="text-neutral-400">{x.slug}</span></li>))}</ul>
        </div>
        <div className="card"><h3 className="text-xl">Походження <span className="badge">{data.races.length}</span></h3>
          <ul className="list-disc pl-5">{filter(data.races).map((x:any)=>(<li key={x.slug}><strong>{x.name}</strong> <span className="text-neutral-400">{x.slug}</span></li>))}</ul>
        </div>
        <div className="card"><h3 className="text-xl">Закляття <span className="badge">{data.spells.length}</span></h3>
          <ul className="list-disc pl-5">{filter(data.spells).map((x:any)=>(<li key={x.slug}><strong>{x.name}</strong> <span className="text-neutral-400">рів.{x.level}</span></li>))}</ul>
        </div>
      </div>
    </section>
  );
}
