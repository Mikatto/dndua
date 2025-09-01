"use client";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { fetchList } from "@/lib/api";
import clsx from "clsx";
const steps = ["Ім’я","Редакція","Походження","Клас","Характеристики","Закляття","Підсумок"];
export default function Builder(){
  const { character, set } = useApp();
  const [step, setStep] = useState(0);
  const [lists, setLists] = useState<any | null>(null);
  useEffect(()=>{ fetchAll(); /* eslint-disable-next-line */ }, [character.edition]);
  async function fetchAll(){ const [races,classes,spells,features]=await Promise.all([
    fetchList(character.edition,"races"),fetchList(character.edition,"classes"),fetchList(character.edition,"spells"),fetchList(character.edition,"features")
  ]); setLists({races,classes,spells,features}); }
  return (
    <section className="container py-6 grid md:grid-cols-[240px,1fr] gap-4">
      <aside className="md:sticky md:top-16 md:h-[calc(100vh-80px)]">
        <ol className="grid gap-2">{steps.map((s,i)=>(<li key={s} className={clsx("px-3 py-2 border border-border rounded-lg", i===step && "border-accent")}>{i+1}. {s}</li>))}</ol>
      </aside>
      <div className="space-y-3">
        <div className="card min-h-[360px]">
          {step===0 && (<div className="space-y-2">
            <label className="block font-semibold">Ім’я персонажа</label>
            <input className="w-full bg-neutral-900 border border-border rounded-lg px-3 py-2" placeholder="Напр., Таргон" value={character.name} onChange={e=>set({ name: e.target.value })}/>
            <div className="text-sm text-neutral-400">Поточна редакція: <span className="badge">{character.edition}</span></div>
          </div>)}
          {step===1 && (<div className="grid md:grid-cols-2 gap-3">
            {["2024","2014"].map(ed=>(
              <button key={ed} className={clsx("card text-left hover:border-accent", character.edition===ed && "border-accent")} onClick={()=>set({edition:ed as any})}>
                <div className="text-xl font-semibold">Редакція {ed}</div>
                <div className="text-neutral-400 text-sm">{ed==="2024"?"SRD 5.2":"SRD 5.1"}</div>
              </button>))}
          </div>)}
          {step===2 && (<div className="grid md:grid-cols-2 gap-3">
            {lists?.races?.map((r:any)=>(
              <button key={r.slug} className={clsx("card text-left hover:border-accent", character.origin===r.slug && "border-accent")} onClick={()=>set({ origin: r.slug })}>
                <div className="flex items-center justify-between"><div className="font-semibold">{r.name}</div><span className="badge">{r.size||"—"}</span></div>
                <div className="text-neutral-400 text-sm">{(r.traits||[]).slice(0,2).join(", ")||"—"}</div>
              </button>))}
          </div>)}
          {step===3 && (<div className="grid md:grid-cols-2 gap-3">
            {lists?.classes?.map((c:any)=>(
              <button key={c.slug} className={clsx("card text-left hover:border-accent", character.klass===c.slug && "border-accent")} onClick={()=>set({ klass: c.slug })}>
                <div className="flex items-center justify-between"><div className="font-semibold">{c.name}</div><span className="badge">d{c.hit_die}</span></div>
                <div className="text-neutral-400 text-sm">Основна: {c.primary_ability||"—"}</div>
              </button>))}
          </div>)}
          {step===4 && <PointBuy/>}
          {step===5 && <Spells lists={lists}/>}
          {step===6 && <Summary lists={lists}/>}
        </div>
        <div className="flex items-center justify-between">
          <button className="btn" onClick={()=>setStep(s=>Math.max(0,s-1))}>Назад</button>
          <div className="space-x-2">
            <button className="btn" onClick={()=>{ localStorage.setItem("dndua_state", JSON.stringify(character)); alert("Збережено"); }}>Зберегти</button>
            <button className="btn btn-primary" onClick={()=>setStep(s=>Math.min(6,s+1))}>Далі</button>
          </div>
        </div>
      </div>
    </section>
  );
}
function PointBuy(){
  const { character, set } = useApp();
  const costs: Record<number, number> = {8:0,9:1,10:2,11:3,12:4,13:5,14:7,15:9};
  const total = Object.values(character.abilities).reduce((a,v)=>a+(costs as any)[v],0);
  const remain = 27 - total;
  const adjust = (k: keyof typeof character.abilities, d: number) => {
    const next = Math.max(8, Math.min(15, character.abilities[k] + d));
    const tmp = { ...character.abilities, [k]: next };
    const cost = Object.values(tmp).reduce((a,v)=>a+(costs as any)[v],0);
    if(cost <= 27) set({ abilities: tmp });
  };
  return (<div className="space-y-3">
    <div className="flex items-center justify-between"><h3 className="text-xl">Розподіл характеристик (27)</h3><span className="badge">Залишок: {remain}</span></div>
    <div className="grid md:grid-cols-3 gap-2">
      {(["STR","DEX","CON","INT","WIS","CHA"] as const).map(k=>(
        <div key={k} className="card flex items-center justify-between">
          <div className="font-semibold">{k}</div>
          <div className="flex items-center gap-2">
            <button className="btn" onClick={()=>adjust(k,-1)}>−</button>
            <div className="w-8 text-center">{character.abilities[k]}</div>
            <button className="btn" onClick={()=>adjust(k,+1)}>+</button>
          </div>
        </div>
      ))}
    </div>
  </div>);
}
function Spells({ lists }: { lists: any }){
  const { character, set } = useApp();
  const klass = lists?.classes?.find((c:any)=>c.slug===character.klass);
  const available = (lists?.spells||[]).filter((s:any)=>!s.classes || s.classes.includes(klass?.slug));
  const toggle = (slug: string) => {
    const setSp = new Set(character.spells||[]); setSp.has(slug) ? setSp.delete(slug) : setSp.add(slug); set({ spells: Array.from(setSp) });
  };
  const [q, setQ] = useState("");
  const filtered = useMemo(()=> available.filter((s:any)=>s.name.toLowerCase().includes(q.toLowerCase())), [available,q]);
  return (<div className="space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="text-xl">Вибери закляття</h3>
      <input className="bg-neutral-900 border border-border rounded-lg px-3 py-2" placeholder="Пошук…" value={q} onChange={e=>setQ(e.target.value)} />
    </div>
    <div className="grid md:grid-cols-2 gap-2">
      {filtered.map((s:any)=>(
        <label key={s.slug} className={"card cursor-pointer " + (character.spells?.includes(s.slug) ? "border-accent" : "")}>
          <div className="flex items-center justify-between">
            <div><strong>{s.name}</strong> <span className="badge">рів.{s.level}</span></div>
            <input type="checkbox" checked={character.spells?.includes(s.slug) || false} onChange={()=>toggle(s.slug)} />
          </div>
          <div className="text-neutral-400 text-sm">{s.school} — {s.range}</div>
        </label>
      ))}
    </div>
  </div>);
}
function Summary({ lists }: { lists: any }){
  const { character } = useApp();
  const origin = lists?.races?.find((o:any)=>o.slug===character.origin);
  const klass = lists?.classes?.find((c:any)=>c.slug===character.klass);
  const spells = (lists?.spells||[]).filter((s:any)=>character.spells?.includes(s.slug));
  return (<div className="grid md:grid-cols-2 gap-3">
    <div className="card">
      <h3 className="text-xl">{character.name || "Безіменний"}</h3>
      <div className="text-sm text-neutral-400">Ред. {character.edition}</div>
      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-between"><span>Походження</span><strong>{origin?.name || "—"}</strong></div>
        <div className="flex items-center justify-between"><span>Клас</span><strong>{klass?.name || "—"}</strong></div>
        <div className="flex items-center justify-between"><span>Характеристики</span>
          <strong>{Object.entries(character.abilities).map(([k,v])=>`${k} ${v}`).join(" · ")}</strong>
        </div>
      </div>
    </div>
    <div className="card">
      <h3 className="text-xl">Закляття ({spells.length})</h3>
      <ul className="list-disc pl-5">
        {spells.length ? spells.map((s:any)=>(<li key={s.slug}>{s.name} <span className="text-neutral-400">рів.{s.level}</span></li>)) : <li className="text-neutral-400">—</li>}
      </ul>
    </div>
  </div>);
}
