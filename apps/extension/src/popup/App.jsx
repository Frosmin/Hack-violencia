import { useCallback, useEffect, useMemo, useState } from "react";
import { useExtensionStore } from "@/shared/state/useExtensionStore";
import {
  getAuthSession,
  isAuthenticated,
  isOrganizationAdmin,
  joinOrganization,
  logout,
  refreshSession,
} from "@/shared/authService";
import {
  openEducationTab,
  openOrganizationTab,
} from "@/shared/ui";
import {
  Building2,
  GraduationCap,
  LogOut,
  Users,
} from "lucide-react";
import Auth from "@/auth/auth";

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

function OrganizationPanel({ session, joinCode, setJoinCode, joining, joinError, joinMessage, onJoinSubmit }) {
  const isAdmin = isOrganizationAdmin(session);
  const hasOrganization = !!session?.organization;

  if (isAdmin) {
    return (
      <article className="mb-4 rounded-2xl border border-primary-default/30 bg-primary-default/10 p-4">
        <div className="mb-3 flex items-start gap-3">
          <div className="rounded-xl bg-primary-default/15 p-2 text-primary-default">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-default">
              Organización
            </p>
            <h3 className="mt-1 text-base font-bold">{session.organization.name}</h3>
            <p className="text-[11px] text-neutral-dark">
              Rol: {session.membership?.role} · Comparte este código con tu equipo
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Join code</p>
          <p className="mt-1 font-mono text-lg font-bold tracking-[0.32em] text-white">
            {session.organization.joinCode}
          </p>
        </div>

        <button
          type="button"
          onClick={openOrganizationTab}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary-default/40 px-4 py-2.5 text-xs font-bold text-primary-default hover:bg-primary-default/10"
        >
          <Users className="h-4 w-4" />
          Abrir panel admin
        </button>
      </article>
    );
  }

  if (!hasOrganization) {
    return (
      <article className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
        <div className="mb-3 flex items-start gap-3">
          <div className="rounded-xl bg-amber-500/15 p-2 text-amber-300">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              Únete a una organización
            </p>
            <p className="mt-1 text-xs text-neutral-dark">
              Ingresa el join code que te compartió tu jefe o administrador.
            </p>
          </div>
        </div>

        <form onSubmit={onJoinSubmit} className="space-y-3">
          <input
            type="text"
            value={joinCode}
            onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
            placeholder="ABC12345"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm font-mono tracking-[0.25em] text-neutral-default outline-none placeholder:tracking-normal placeholder:text-slate-600 focus:border-primary-default"
            required
            maxLength={8}
          />
          <button
            type="submit"
            disabled={joining}
            className="w-full rounded-xl border border-primary-default bg-primary-default/10 px-4 py-2.5 text-xs font-bold text-primary-default hover:bg-primary-default/20 disabled:opacity-50"
          >
            {joining ? "Uniéndote..." : "Unirme con join code"}
          </button>
        </form>

        {joinError && <p className="mt-2 text-xs font-semibold text-rose-300">{joinError}</p>}
        {joinMessage && <p className="mt-2 text-xs font-semibold text-emerald-300">{joinMessage}</p>}
      </article>
    );
  }

  return (
    <article className="mb-4 rounded-2xl border border-sky-500/25 bg-sky-500/10 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-sky-500/15 p-2 text-sky-300">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Organización vinculada
          </p>
          <h3 className="mt-1 text-base font-bold">{session.organization.name}</h3>
          <p className="text-[11px] text-neutral-dark">
            Rol actual: {session.membership?.role}. Tu cuenta ya está conectada.
          </p>
        </div>
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
  const [authChecked, setAuthChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [session, setSession] = useState(null);
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinMessage, setJoinMessage] = useState("");

  const loadSession = useCallback(async () => {
    const authenticated = await isAuthenticated();
    setAuthed(authenticated);
    if (!authenticated) {
      setSession(null);
      setAuthChecked(true);
      return;
    }

    try {
      const freshSession = await refreshSession();
      setSession(freshSession);
    } catch {
      const storedSession = await getAuthSession();
      setSession(storedSession);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (authed) {
      void loadAll();
    }
  }, [authed, loadAll]);

  useEffect(() => {
    if (!saveMessage) return;
    const timeoutId = setTimeout(() => setSaveMessage(""), 2000);
    return () => clearTimeout(timeoutId);
  }, [saveMessage, setSaveMessage]);

  const summary = useMemo(() => {
    const highRisk = incidents.filter((incident) => incident.riskLevel === "HIGH").length;
    const platforms = new Set(incidents.map((incident) => incident.platform)).size;
    return { total: incidents.length, highRisk, platforms };
  }, [incidents]);

  const handleLogout = useCallback(async () => {
    await logout();
    setAuthed(false);
    setSession(null);
    setJoinCode("");
    setJoinError("");
    setJoinMessage("");
  }, []);

  const handleAuthSuccess = useCallback(async () => {
    await loadSession();
  }, [loadSession]);

  const handleJoinSubmit = useCallback(async (event) => {
    event.preventDefault();
    setJoinError("");
    setJoinMessage("");
    setJoining(true);

    try {
      const updatedSession = await joinOrganization(joinCode.trim());
      setSession(updatedSession);
      setJoinCode("");
      setJoinMessage("Te uniste a la organización correctamente.");
    } catch (error) {
      setJoinError(error.message);
    } finally {
      setJoining(false);
    }
  }, [joinCode]);

  if (!authChecked) {
    return (
      <main className="flex min-h-[520px] w-[360px] items-center justify-center bg-secondary-default text-neutral-default">
        <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-default border-t-transparent" />
      </main>
    );
  }

  if (!authed) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  if (loading || !settings || !session) {
    return (
      <main className="flex min-h-[520px] w-[360px] items-center justify-center bg-secondary-default text-neutral-default">
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
              {session.user?.email || "Protección contra violencia digital"}
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


      <nav className="flex border-b border-slate-800 px-3 pt-1">
        {[
          { id: "recent", label: "Recientes" },
          { id: "quick", label: "Accesos" },
          { id: "settings", label: "Config" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`border-b-2 px-3 py-2 text-xs font-semibold ${activeTab === tab.id
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
          <OrganizationPanel
            session={session}
            joinCode={joinCode}
            setJoinCode={setJoinCode}
            joining={joining}
            joinError={joinError}
            joinMessage={joinMessage}
            onJoinSubmit={handleJoinSubmit}
          />
        </section>
      )}

      {activeTab === "quick" && (
        <section className="grid grid-cols-2 gap-2 p-4">

          {isOrganizationAdmin(session) && (
            <button
              type="button"
              onClick={openOrganizationTab}
              className="esc-card p-4 text-left hover:border-primary-dark"
            >
              <Building2 className="h-5 w-5 text-neutral-default" />
              <p className="mt-1 text-xs font-semibold text-neutral-default">Organización</p>
            </button>
          )}

          <button
            type="button"
            onClick={openEducationTab}
            className="esc-card p-4 text-left hover:border-primary-dark"
          >
            <GraduationCap className="h-5 w-5 text-neutral-default" />
            <p className="mt-1 text-xs font-semibold text-neutral-default">Educación</p>
          </button>


          {/* <button
            type="button"
            onClick={() => {
              void exportIncidents();
            }}
            className="esc-card p-4 text-left hover:border-primary-dark"
          >
            <Download className="h-5 w-5 text-neutral-default" />
            <p className="mt-1 text-xs font-semibold text-neutral-default">Exportar</p>
          </button> */}
        </section>
      )}

      {activeTab === "settings" && (
        <section className="space-y-4 p-4">
          <article className="rounded-2xl border border-slate-800 bg-secondary-light p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-dark">
              Estado de organización
            </p>
            <p className="mt-2 text-sm font-bold text-neutral-default">
              {session.organization?.name || "Sin organización"}
            </p>
            <p className="mt-1 text-[11px] text-neutral-dark">
              {session.membership?.role
                ? `Rol actual: ${session.membership.role}`
                : "Tu cuenta aún no pertenece a una organización"}
            </p>
          </article>

          <article className="esc-card space-y-3 p-3">

            <div className="rounded-xl border border-sky-500/25 bg-sky-500/10 px-3 py-2">
              <p className="text-xs font-semibold text-sky-200">Alertas organizacionales</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Si un miembro comete una agresión, el backend guarda la foto y envía el reporte al correo dueño de la organización.
              </p>
            </div>
          </article>

          <button
            id="auth-logout"
            type="button"
            onClick={() => void handleLogout()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs font-bold text-rose-400 transition-all hover:bg-rose-500/20"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </section>
      )}
    </main>
  );
}
