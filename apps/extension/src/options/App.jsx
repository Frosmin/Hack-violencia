import { useEffect, useState } from "react";
import { useExtensionStore } from "@/shared/state/useExtensionStore";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-sky-500/30" : "bg-slate-700"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${checked ? "left-5" : "left-0.5"}`}
      />
    </button>
  );
}

function Row({ title, description, value, onChange }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-700/50 py-3 last:border-none">
      <div>
        <p className="text-sm font-semibold text-slate-200">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <Toggle checked={value} onChange={onChange} />
    </div>
  );
}

export default function OptionsApp() {
  const {
    settings,
    loading,
    saveMessage,
    loadAll,
    updateSettings,
    setSaveMessage,
  } = useExtensionStore();
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (!settings) return;
    setDraft(settings);
  }, [settings]);

  useEffect(() => {
    if (!saveMessage) return;
    const timeoutId = setTimeout(() => setSaveMessage(""), 3000);
    return () => clearTimeout(timeoutId);
  }, [saveMessage, setSaveMessage]);

  if (loading || !draft) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        Cargando configuracion...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 text-xl">
            🛡️
          </div>
          <div>
            <h1 className="text-2xl font-bold">Escudo Digital</h1>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Configuracion avanzada
            </p>
          </div>
        </header>

        <section className="esc-card mb-5 p-5">
          <p className="esc-title mb-2">Proteccion</p>
          <Row
            title="Proteccion activa"
            description="Escanea mensajes en redes sociales"
            value={draft.protectionEnabled}
            onChange={(value) =>
              setDraft((current) => ({ ...current, protectionEnabled: value }))
            }
          />
          <Row
            title="Ocultar mensajes peligrosos"
            description="Reemplaza el mensaje por advertencia"
            value={draft.autoHideDangerous}
            onChange={(value) =>
              setDraft((current) => ({ ...current, autoHideDangerous: value }))
            }
          />
          <Row
            title="Detector de grooming progresivo"
            description="Rastrea escalada de la conversacion"
            value={draft.groomingDetection}
            onChange={(value) =>
              setDraft((current) => ({ ...current, groomingDetection: value }))
            }
          />
          <Row
            title="Reescritura etica"
            description="Sugiere reformular mensajes toxicos"
            value={draft.rewriteSuggestions}
            onChange={(value) =>
              setDraft((current) => ({ ...current, rewriteSuggestions: value }))
            }
          />
        </section>

        <section className="esc-card mb-5 p-5">
          <p className="esc-title mb-3">Alertas por email</p>
          <label className="mb-1 block text-sm font-semibold text-slate-200">
            Correo de alertas
          </label>
          <input
            type="email"
            value={draft.alertEmail}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                alertEmail: event.target.value,
              }))
            }
            placeholder="tu@correo.com"
            className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
          />

          <Row
            title="Activar alertas por email"
            description="Solo para incidentes de riesgo alto"
            value={draft.emailNotifications}
            onChange={(value) =>
              setDraft((current) => ({ ...current, emailNotifications: value }))
            }
          />
        </section>

        <button
          type="button"
          onClick={() => {
            void updateSettings(draft);
          }}
          className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 text-sm font-bold uppercase tracking-wider text-white"
        >
          Guardar configuracion
        </button>

        {saveMessage && (
          <p className="mt-3 text-center text-sm font-semibold text-emerald-300">
            {saveMessage}
          </p>
        )}
      </div>
    </main>
  );
}
