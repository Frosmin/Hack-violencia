import { useState } from "react";
// Content
import { THREATS } from "./content/threats";
import { EMERGENCY } from "./content/emergency";
// Components
import { ThreatCard } from "./components/ThreatCard";
import { DetailPanel } from "./components/DetailPanel";

export default function EducationApp() {
  const [activeId, setActiveId] = useState("grooming");
  const active = THREATS.find((t) => t.id === activeId);

  return (
    <main className="min-h-screen bg-secondary-default font-sans">
      <header className="sticky top-0 z-20 border-b bg-secondary-light backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-5">
          <div className="flex items-center gap-2">
            <img src="/icons/logo.webp" className="h-9 w-auto" alt="logo" />
            <div>
              <p className="text-sm font-bold">Escudo Digital</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                Dashboard de seguridad
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-800 px-5 py-10">
        <div className="relative mx-auto max-w-2xl text-center">
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-neutral-default">
            Conoce la amenaza,
            <span className="text-primary-default"> Actúa a tiempo.</span>
          </h1>
          <p className="text-sm text-neutral-dark">
            Selecciona un tipo de violencia digital para ver señales,
            situaciones reales y los pasos exactos a seguir.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div
          className="flex gap-8 lg:gap-10"
          style={{ alignItems: "flex-start" }}
        >
          <aside
            className="w-56 shrink-0 space-y-2 lg:w-64"
            style={{ position: "sticky", top: "60px" }}
          >
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">
              Tipos de amenaza
            </p>
            {THREATS.map((t) => (
              <ThreatCard
                key={t.id}
                threat={t}
                isActive={activeId === t.id}
                onClick={() => setActiveId(t.id)}
              />
            ))}

            <div className="mt-6 rounded-2xl bg-secondary-light p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-dark">
                Pedir ayuda
              </p>
              <div className="space-y-2">
                {EMERGENCY.map((r) => (
                  <div key={r.name}>
                    <p className="text-[11px] font-semibold text-text-neutral-default">
                      {r.name}
                    </p>
                    <p className="text-[10px] text-neutral-dark">
                      {r.scope} · {r.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {active && <DetailPanel threat={active} />}
          </div>
        </div>
      </div>
    </main>
  );
}
