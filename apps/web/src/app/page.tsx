import Link from "next/link";
export default function Home(){
  return (
    <section className="container py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-semibold">Створи героя D&D українською</h1>
        <p className="text-neutral-400">Перемикай редакцію 2014/2024. Збереження, аркуш, друк.</p>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Link className="btn btn-primary" href="/builder">Почати</Link>
        <Link className="btn" href="/sheet">Відкрити аркуш</Link>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card"><h3 className="text-xl">Редакції</h3><p className="text-neutral-400">Два набори SRD.</p></div>
        <div className="card"><h3 className="text-xl">Локально</h3><p className="text-neutral-400">Збереження в браузері.</p></div>
        <div className="card"><h3 className="text-xl">Швидко</h3><p className="text-neutral-400">Мінімум кліків.</p></div>
      </div>
    </section>
  )
}
