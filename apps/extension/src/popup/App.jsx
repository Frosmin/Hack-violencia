import { useCallback, useEffect, useMemo, useState } from "react";
import { useExtensionStore } from "@/shared/state/useExtensionStore";
import { isAuthenticated, logout, getAuthUser, getToken } from "@/shared/authService";
import { openDashboardTab, openEducationTab, riskLabel } from "@/shared/ui";
import {
  BarChart3,
  GraduationCap,
  Settings,
  Download,
  LogOut,
  Shield,
  Eye,
  User,
  FileText,
  ExternalLink,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";
import Auth from "@/auth/auth";

const EVIDENCE_API = "http://localhost:3000/api/evidence/list";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-secondary-default" : "bg-secondary-dark"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-primary-light transition ${checked ? "left-5" : "left-0.5"}`}
      />
    </button>
  );
}

function EvidenceCard({ evidence }) {
  const typeColor =
    evidence.type === "agresor"
      ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
      : "bg-amber-500/20 text-amber-300 border-amber-500/30";

  const typeLabel = evidence.type === "agresor" ? "Agresor" : "Víctima";

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-2.5 transition-all hover:border-slate-700">
      {/* Header: type badge + ID */}
      <div className="flex items-center gap-2">
        <span
          className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${typeColor}`}
        >
          {typeLabel}
        </span>
        <span className="ml-auto text-[10px] text-slate-600 font-mono">
          #{evidence.id}
        </span>
      </div>

      {/* Screenshot thumbnail */}
      {evidence.url && (
        <a
          href={evidence.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative group rounded-lg overflow-hidden border border-slate-700/50"
        >
          <img
            src={evidence.url}
            alt="Captura de evidencia"
            className="w-full h-28 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-end p-2">
            <span className="flex items-center gap-1 text-[10px] text-white/80 bg-black/40 rounded px-1.5 py-0.5">
              <ExternalLink className="h-3 w-3" />
              Ver completa
            </span>
          </div>
        </a>
      )}

      {/* Subject */}
      <div className="flex items-center gap-1.5">
        <User className="h-3.5 w-3.5 text-sky-400 shrink-0" />
        <p className="text-[11px] text-neutral-dark">Sujeto:</p>
        <p className="text-xs font-semibold text-sky-300 truncate">
          {evidence.Sujeto || "Desconocido"}
        </p>
      </div>

      {/* Description */}
      <div className="flex gap-1.5">
        <FileText className="h-3.5 w-3.5 text-neutral-dark shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
          {evidence.description || "Sin descripción"}
        </p>
      </div>
    </article>
  );
}

export default function PopupApp() {
  const {
    incidents,
    settings,
    loading,
    saveMessage,
    loadAll,
    updateSettings,
    clearAllIncidents,
    exportIncidents,
    setSaveMessage,
  } = useExtensionStore();

  const [activeTab, setActiveTab] = useState("recent");
  const [draftEmail, setDraftEmail] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);


  const [evidences, setEvidences] = useState([]);
  const [evidencesLoading, setEvidencesLoading] = useState(false);
  const [evidencesError, setEvidencesError] = useState("");

  useEffect(() => {
    async function checkAuth() {
      const authenticated = await isAuthenticated();
      setAuthed(authenticated);
      if (authenticated) {
        const user = await getAuthUser();
        setCurrentUser(user);
      }
      setAuthChecked(true);
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (authed) {
      void loadAll();
    }
  }, [authed, loadAll]);

  useEffect(() => {
    if (!settings) return;
    setDraftEmail(settings.alertEmail || "");
  }, [settings]);

  useEffect(() => {
    if (!saveMessage) return;
    const timeoutId = setTimeout(() => setSaveMessage(""), 2000);
    return () => clearTimeout(timeoutId);
  }, [saveMessage, setSaveMessage]);

  const summary = useMemo(() => {
    const highRisk = incidents.filter(
      (incident) => incident.riskLevel === "HIGH",
    ).length;
    const platforms = new Set(incidents.map((incident) => incident.platform))
      .size;
    return { total: incidents.length, highRisk, platforms };
  }, [incidents]);

  const handleLogout = useCallback(async () => {
    await logout();
    setAuthed(false);
    setCurrentUser(null);
  }, []);

  const handleAuthSuccess = useCallback(async () => {
    const user = await getAuthUser();
    setCurrentUser(user);
    setAuthed(true);
  }, []);

  const loadEvidences = useCallback(async () => {
    setEvidencesLoading(true);
    setEvidencesError("");
    try {
      const token = await getToken();
      if (!token) {
        setEvidencesError("No autenticado");
        return;
      }
      const response = await fetch(EVIDENCE_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error al cargar evidencias");
      }
      setEvidences(data.data || []);
    } catch (err) {
      setEvidencesError(err.message);
    } finally {
      setEvidencesLoading(false);
    }
  }, []);


  useEffect(() => {
    if (activeTab === "evidences" && authed) {
      void loadEvidences();
    }
  }, [activeTab, authed, loadEvidences]);

  if (!authChecked) {
    return (
      <main className="flex min-h-[480px] w-[360px] items-center justify-center bg-secondary-default text-neutral-default">
        <span className="inline-block h-6 w-6 rounded-full border-2 border-primary-default border-t-transparent animate-spin" />
      </main>
    );
  }


  if (!authed) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }


  if (loading || !settings) {
    return (
      <main className="flex min-h-[500px] w-[360px] items-center justify-center bg-secondary-default text-neutral-default">
        Cargando Escudo Digital...
      </main>
    );
  }

  return (
    <main className="w-[360px] bg-secondary-default text-neutral-default">
      <header className="border-b border-slate-800 bg-secondary-light p-4">
        <div className="flex items-center gap-3">
          <img src="/icons/icon128.png" className="h-8 w-auto" alt="logo" />
          <div className="flex-1">
            <p className="text-base font-bold">Escudo Digital</p>
            <p className="text-[11px] uppercase tracking-wider text-neutral-dark">
              {currentUser?.email || "Proteccion contra violencia digital"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              void updateSettings({
                protectionEnabled: !settings.protectionEnabled,
              });
            }}
            className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${settings.protectionEnabled
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border-slate-600 bg-slate-800 text-slate-300"
              }`}
          >
            {settings.protectionEnabled ? "Activo" : "Pausado"}
          </button>
        </div>
      </header>

      <section className="grid grid-cols-3 gap-px bg-secondary-light p-1">
        <div className="p-3 text-center">
          <p className="text-2xl font-bold text-rose-400">{summary.total}</p>
          <p className="text-[10px] uppercase tracking-wide text-neutral-dark">
            Total
          </p>
        </div>
        <div className="p-3 text-center">
          <p className="text-2xl font-bold text-amber-300">
            {summary.highRisk}
          </p>
          <p className="text-[10px] uppercase tracking-wide text-neutral-dark">
            Riesgo alto
          </p>
        </div>
        <div className=" p-3 text-center">
          <p className="text-2xl font-bold text-sky-300">{summary.platforms}</p>
          <p className="text-[10px] uppercase tracking-wide text-neutral-dark">
            Plataformas
          </p>
        </div>
      </section>

      <nav className="flex border-b border-slate-800 px-2 pt-1">
        {[
          { id: "recent", label: "Recientes" },
          { id: "evidences", label: "Evidencias" },
          { id: "quick", label: "Accesos" },
          { id: "settings", label: "Config" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`border-b-2 px-2.5 py-2 text-xs font-semibold ${activeTab === tab.id
                ? "border-primary-default text-primary-default"
                : "border-transparent text-slate-400 hover:text-neutral-light"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "recent" && (
        <section className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-dark">
              Ultimos incidentes
            </p>
            <button
              type="button"
              onClick={() => {
                void clearAllIncidents();
              }}
              className="rounded-md border border-primary-default px-2 py-1 text-[10px] font-semibold text-primary-default hover:bg-primary-default/10"
            >
              Limpiar
            </button>
          </div>

          <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
            {incidents.length === 0 && (
              <div className="rounded-xl border border-slate-800 bg-secondary-light p-5 text-center text-sm text-slate-400">
                Sin incidentes detectados.
              </div>
            )}

            {incidents.slice(0, 20).map((incident) => (
              <article
                key={incident.id}
                className="rounded-xl border border-slate-800 bg-slate-900/80 p-3"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${incident.riskLevel === "HIGH"
                        ? "bg-rose-500/20 text-rose-300"
                        : "bg-amber-500/20 text-amber-300"
                      }`}
                  >
                    {riskLabel(incident.riskLevel)}
                  </span>
                  <span className="text-[11px] text-slate-300">
                    {incident.platform}
                  </span>
                  <span className="ml-auto text-[10px] text-slate-500">
                    {new Date(incident.timestamp).toLocaleTimeString("es", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="truncate text-xs text-slate-300">
                  {incident.messageText || "(sin texto)"}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {incident.category}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "evidences" && (
        <section className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary-default" />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-dark">
                Evidencias guardadas
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadEvidences()}
              disabled={evidencesLoading}
              className="flex items-center gap-1 rounded-md border border-primary-default px-2 py-1 text-[10px] font-semibold text-primary-default hover:bg-primary-default/10 disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${evidencesLoading ? "animate-spin" : ""}`} />
              Actualizar
            </button>
          </div>

          {evidencesError && (
            <div className="mb-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {evidencesError}
            </div>
          )}

          {evidencesLoading && evidences.length === 0 && (
            <div className="flex justify-center py-10">
              <span className="inline-block h-5 w-5 rounded-full border-2 border-primary-default border-t-transparent animate-spin" />
            </div>
          )}

          <div className="max-h-[340px] space-y-2.5 overflow-y-auto pr-1">
            {!evidencesLoading && evidences.length === 0 && !evidencesError && (
              <div className="rounded-xl border border-slate-800 bg-secondary-light p-6 text-center">
                <ImageIcon className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">
                  Sin evidencias guardadas.
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Las capturas se generan automáticamente al detectar amenazas graves.
                </p>
              </div>
            )}

            {evidences.map((evidence) => (
              <EvidenceCard key={evidence.id} evidence={evidence} />
            ))}
          </div>

          {evidences.length > 0 && (
            <p className="mt-2 text-center text-[10px] text-slate-600">
              {evidences.length} evidencia{evidences.length !== 1 ? "s" : ""} guardada{evidences.length !== 1 ? "s" : ""}
            </p>
          )}
        </section>
      )}

      {activeTab === "quick" && (
        <section className="grid grid-cols-2 gap-2 p-4">
          <button
            type="button"
            onClick={openDashboardTab}
            className="flex gap-2 esc-card p-4 text-left hover:border-primary-dark"
          >
            <BarChart3 className="h-5 w-5 text-neutral-default" />
            <p className="mt-1 text-xs font-semibold text-neutral-default">
              Dashboard
            </p>
          </button>

          <button
            type="button"
            onClick={openEducationTab}
            className="flex gap-2 esc-card p-4 text-left hover:border-primary-dark"
          >
            <GraduationCap className="h-5 w-5 text-neutral-default" />
            <p className="mt-1 text-xs font-semibold text-neutral-default">
              Educación
            </p>
          </button>

          <button
            type="button"
            onClick={() => chrome.runtime.openOptionsPage()}
            className="flex gap-2 esc-card p-4 text-left hover:border-primary-dark"
          >
            <Settings className="h-5 w-5 text-neutral-default" />
            <p className="mt-1 text-xs font-semibold text-neutral-default">
              Opciones
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              void exportIncidents();
            }}
            className="flex gap-2 esc-card p-4 text-left hover:border-primary-dark"
          >
            <Download className="h-5 w-5 text-neutral-default" />
            <p className="mt-1 text-xs font-semibold text-neutral-default">
              Exportar
            </p>
          </button>
        </section>
      )}

      {activeTab === "settings" && (
        <section className="space-y-4 p-4">
          <article className="esc-card space-y-3 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-neutral-default">
                  Ocultar automaticamente
                </p>
                <p className="text-[11px] text-neutral-dark">
                  Oculta mensajes de riesgo alto
                </p>
              </div>
              <Toggle
                checked={settings.autoHideDangerous}
                onChange={(checked) => {
                  void updateSettings({ autoHideDangerous: checked });
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-neutral-default">
                  Sugerencias de reescritura
                </p>
                <p className="text-[11px] text-neutral-dark">
                  Prevencion de escritura toxica
                </p>
              </div>
              <Toggle
                checked={settings.rewriteSuggestions}
                onChange={(checked) => {
                  void updateSettings({ rewriteSuggestions: checked });
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-neutral-default">
                  Alertas por correo
                </p>
                <p className="text-[11px] text-neutral-dark">
                  Notificar solo riesgo alto
                </p>
              </div>
              <Toggle
                checked={settings.emailNotifications}
                onChange={(checked) => {
                  void updateSettings({ emailNotifications: checked });
                }}
              />
            </div>
          </article>

          <article className="esc-card p-3">
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-neutral-dark">
              Email de alertas
            </label>
            <input
              type="email"
              value={draftEmail}
              onChange={(event) => setDraftEmail(event.target.value)}
              placeholder="tu@correo.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-neutral-default outline-none focus:border-primary-default"
            />
            <button
              type="button"
              onClick={() => {
                void updateSettings({ alertEmail: draftEmail.trim() });
              }}
              className="mt-3 w-full rounded-lg border border-primary-default px-3 py-2 text-xs font-bold tracking-wide text-primary-default hover:bg-primary-default/10"
            >
              Guardar configuracion
            </button>
            {saveMessage && (
              <p className="mt-2 text-center text-xs font-semibold text-emerald-300">
                {saveMessage}
              </p>
            )}
          </article>

          {/* Logout */}
          <button
            id="auth-logout"
            type="button"
            onClick={() => void handleLogout()}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs font-bold text-rose-400 transition-all hover:bg-rose-500/20"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </section>
      )}
    </main>
  );
}
