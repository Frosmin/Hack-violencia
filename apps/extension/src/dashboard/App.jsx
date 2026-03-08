import { useEffect, useMemo } from "react";
import { useExtensionStore } from "@/shared/state/useExtensionStore";
import { PLATFORM_ICONS, CAT_COLORS } from "./design";

function aggregateBy(items, selector) {
  const map = {};
  items.forEach((item) => {
    const key = selector(item);
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

export default function DashboardApp() {
  const { incidents, loading, loadAll, refreshIncidents, exportIncidents } =
    useExtensionStore();

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      void refreshIncidents();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [refreshIncidents]);

  const summary = useMemo(() => {
    const high = incidents.filter(
      (incident) => incident.riskLevel === "HIGH",
    ).length;
    const grooming = incidents.filter((incident) =>
      incident.category.toLowerCase().includes("grooming"),
    ).length;
    const platforms = new Set(incidents.map((incident) => incident.platform))
      .size;
    return {
      total: incidents.length,
      high,
      grooming,
      platforms,
    };
  }, [incidents]);

  const byPlatform = useMemo(
    () => aggregateBy(incidents, (item) => item.platform),
    [incidents],
  );
  const byCategory = useMemo(
    () => aggregateBy(incidents, (item) => item.category),
    [incidents],
  );

  const maxPlatform = byPlatform[0]?.[1] || 1;
  const maxCategory = byCategory[0]?.[1] || 1;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-secondary-default text-slate-300">
        Cargando dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary-default text-neutral-default">
      <header className="sticky top-0 z-20 border-b bg-secondary-light backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-5">
          <div className="flex items-center gap-2">
            <img src="/icons/logo.webp" className="h-9 w-auto" alt="logo" />
            <div>
              <p className="text-sm font-bold">Escudo Digital</p>
              <p className="text-[10px] uppercase tracking-wide text-neutral-dark">
                Dashboard de seguridad
              </p>
            </div>
          </div>
          <nav className="ml-auto flex gap-2 text-xs font-semibold">
            <a
              className="rounded-md bg-white/10 px-3 py-1.5"
              href="dashboard.html"
            >
              Dashboard
            </a>
            <a
              className="rounded-md px-3 py-1.5 text-slate-300 hover:bg-white/5"
              href="education.html"
            >
              Educacion
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-6">
        <h1 className="mb-1 text-3xl font-extrabold tracking-tight">
          Panel de incidentes
        </h1>
        <p className="mb-6 text-sm text-neutral-dark">
          Analisis local en tiempo real de riesgos detectados en redes sociales.
        </p>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <article className="esc-card border-t-2 border-t-primary-default p-4">
            <p className="text-4xl font-extrabold text-primary-light">
              {summary.total}
            </p>
            <p className="esc-title mt-1">Incidentes totales</p>
          </article>
          <article className="esc-card border-t-2 border-t-primary-default p-4">
            <p className="text-4xl font-extrabold text-primary-light">
              {summary.high}
            </p>
            <p className="esc-title mt-1">Riesgo alto</p>
          </article>
          <article className="esc-card border-t-2 border-t-primary-default p-4">
            <p className="text-4xl font-extrabold text-prymary-light">
              {summary.grooming}
            </p>
            <p className="esc-title mt-1">Grooming detectado</p>
          </article>
          <article className="esc-card border-t-2 border-t-primary-default p-4">
            <p className="text-4xl font-extrabold text-primary-light">
              {summary.platforms}
            </p>
            <p className="esc-title mt-1">Plataformas afectadas</p>
          </article>
        </div>

        <div className="mb-5 grid gap-4 lg:grid-cols-2">
          <article className="esc-card p-4">
            <p className="esc-title mb-3">Incidentes por plataforma</p>
            {byPlatform.length === 0 ? (
              <p className="rounded-lg bg-secondary-light p-4 text-sm text-neutral-dark">
                Sin datos aun.
              </p>
            ) : (
              <div className="grid gap-2 md:grid-cols-2">
                {byPlatform.map(([platformName, count]) => (
                  <div
                    key={platformName}
                    className="rounded-lg border border-slate-700/60 bg-slate-900/70 p-3"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span>{PLATFORM_ICONS[platformName] || "🌐"}</span>
                      <span className="text-xs font-semibold text-slate-200">
                        {platformName}
                      </span>
                      <span className="ml-auto text-lg font-bold text-rose-300">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded bg-slate-800">
                      <div
                        className="h-full rounded bg-gradient-to-r from-sky-400 to-indigo-500"
                        style={{ width: `${(count / maxPlatform) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="esc-card p-4">
            <p className="esc-title mb-3">Por categoria</p>
            {byCategory.length === 0 ? (
              <p className="rounded-lg bg-slate-900 p-4 text-sm text-slate-400">
                Sin categorias detectadas.
              </p>
            ) : (
              <div className="space-y-3">
                {byCategory.map(([category, count]) => (
                  <div key={category}>
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                      <span>{category}</span>
                      <span
                        style={{ color: CAT_COLORS[category] || "#94a3b8" }}
                        className="font-bold"
                      >
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded bg-slate-800">
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${(count / maxCategory) * 100}%`,
                          background: CAT_COLORS[category] || "#64748b",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>

        <div className="grid gap-4">
          <article className="esc-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="esc-title">Actividad reciente</p>
              <button
                type="button"
                onClick={() => {
                  void exportIncidents();
                }}
                className="esc-button"
              >
                Exportar JSON
              </button>
            </div>

            <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
              {incidents.slice(0, 15).map((incident) => (
                <div
                  key={`timeline-${incident.id}`}
                  className="rounded-lg border border-slate-700/60 bg-slate-900/70 p-3"
                >
                  <p className="text-xs font-semibold text-slate-200">
                    {incident.category} · {incident.platform}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {new Date(incident.timestamp).toLocaleString("es")} ·{" "}
                    {incident.messageText.slice(0, 80)}
                  </p>
                </div>
              ))}
              {incidents.length === 0 && (
                <p className="text-sm text-slate-400">Sin actividad todavia.</p>
              )}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
