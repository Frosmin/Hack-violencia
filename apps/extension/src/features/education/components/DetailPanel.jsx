import { AlertTriangle, ShieldCheck, Flag, CheckCircle } from "lucide-react";

export function DetailPanel({ threat }) {
  return (
    <div className="space-y-5 font-accent text-neutral-dark">
      <div
        className="rounded-2xl border p-5 bg-secondary-light"
        style={{ borderColor: threat.border }}
      >
        <div className="mb-3 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: threat.bg }}
          >
            <AlertTriangle size={20} style={{ color: threat.color }} />
          </div>

          <div>
            <p className="text-xl font-extrabold tracking-tight text-neutral-light font-display">
              {threat.label}
            </p>

            <p className="text-xs" style={{ color: threat.color }}>
              {threat.tagline}
            </p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-neutral-dark">
          {threat.what}
        </p>
      </div>

      <div>
        <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-neutral-dark">
          <Flag size={14} />
          Señales de alerta
        </p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {threat.signals.map((s) => (
            <div
              key={s}
              className="rounded-xl bg-secondary-dark px-3 py-2 text-xs"
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {threat.prevention && (
        <div>
          <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-neutral-dark">
            <ShieldCheck size={14} />
            Prevención
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {threat.prevention.map((p) => (
              <div
                key={p}
                className="rounded-xl border border-secondary-default bg-secondary-dark px-3 py-2 text-xs"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-neutral-dark">
          <CheckCircle size={14} />
          Qué hacer ahora mismo
        </p>

        <ol className="space-y-2">
          {threat.steps.map((step, i) => (
            <li
              key={step.action}
              className="flex gap-3 rounded-xl border border-secondary-default bg-secondary-dark p-3"
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-extrabold"
                style={{
                  background: threat.bg,
                  color: threat.color,
                  border: `1px solid ${threat.border}`,
                }}
              >
                {i + 1}
              </span>

              <div>
                <p className="text-xs font-bold text-neutral-default">
                  {step.action}
                </p>

                <p className="text-xs text-neutral-dark">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div
        className="rounded-xl border px-4 py-3 bg-secondary-black"
        style={{ borderColor: threat.border }}
      >
        <p
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: threat.color }}
        >
          Recuerda
        </p>

        <p className="mt-1 text-sm font-semibold text-neutral-default">
          {threat.remember}
        </p>
      </div>
    </div>
  );
}
