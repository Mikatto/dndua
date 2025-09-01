import "./globals.css";
import Link from "next/link";
export const metadata = { title: "D&D UA", description: "UA character tools" };
export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="uk"><body>
      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur">
        <div className="container flex items-center justify-between h-14">
          <Link href="/" className="font-bold tracking-wide">D&D UA</Link>
          <nav className="space-x-4">
            <Link href="/rules">Правила</Link>
            <Link href="/builder" className="btn btn-primary">Створити персонажа</Link>
          </nav>
        </div>
      </header>
      <main className="min-h-[calc(100vh-56px)]">{children}</main>
      <footer className="border-t border-border">
        <div className="container py-3 text-sm text-neutral-400 flex items-center justify-between">
          <span>© D&D UA · SRD CC-BY-4.0</span><span>Проєкт демо</span>
        </div>
      </footer>
    </body></html>
  );
}
