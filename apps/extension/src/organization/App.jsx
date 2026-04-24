import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Image as ImageIcon,
  RefreshCw,
  Shield,
  User,
  Users,
  X,
} from "lucide-react";
import {
  getAuthSession,
  getToken,
  isAuthenticated,
  isOrganizationAdmin,
  refreshSession,
} from "@/shared/authService";

const EVIDENCE_API = "http://localhost:3000/api/evidence/list";

function TypeBadge({ type }) {
  const isAgresor = type === "agresor";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
        isAgresor
          ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
          : "border-amber-500/30 bg-amber-500/10 text-amber-400"
      }`}
    >
      {isAgresor ? (
        <AlertTriangle className="h-3 w-3" />
      ) : (
        <Shield className="h-3 w-3" />
      )}
      {isAgresor ? "Agresor" : "Víctima"}
    </span>
  );
}

function ImageModal({ src, onClose }) {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -right-3 -top-3 z-10 rounded-full border border-slate-700 bg-slate-800 p-1.5 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <img
          src={src}
          alt="Evidencia en resolución completa"
          className="h-auto max-h-[85vh] w-full rounded-xl border border-slate-700/60 object-contain shadow-2xl"
        />
      </div>
    </div>
  );
}

function EvidenceCard({ evidence, onImageClick }) {
  return (
    <article className="group rounded-2xl border border-slate-700/50 bg-slate-900/70 p-5 transition-all duration-300 hover:border-primary-default/40 hover:shadow-xl hover:shadow-black/20">
      <div className="mb-4 flex items-start justify-between">
        <TypeBadge type={evidence.type} />
        <span className="text-xs font-mono text-slate-600">ID #{evidence.id}</span>
      </div>

      {evidence.url && (
        <button
          type="button"
          onClick={() => onImageClick(evidence.url)}
          className="group/img relative mb-4 block w-full overflow-hidden rounded-xl border border-slate-700/40"
        >
          <img
            src={evidence.url}
            alt="Captura de evidencia"
            className="h-52 w-full object-cover transition-all duration-300 group-hover/img:scale-[1.02] group-hover/img:brightness-110"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 via-transparent to-transparent pb-4 opacity-0 transition-opacity duration-300 group-hover/img:opacity-100">
            <span className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              <Eye className="h-3.5 w-3.5" />
              Ver a resolución completa
            </span>
          </div>
        </button>
      )}

      <div className="space-y-3">
        <div className="rounded-xl bg-slate-800/50 px-3 py-2.5">
          <div className="mb-1.5 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 shrink-0 text-sky-400" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Usuario que hizo la agresión
            </p>
          </div>
          <p className="text-sm font-bold text-slate-200">
            {evidence.user?.email || "Sin autor"}
          </p>
        </div>

        {evidence.detectedText && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2.5">
            <div className="mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-300" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-200/80">
                Agresión detectada
              </p>
            </div>
            <p className="text-xs leading-relaxed text-rose-100">
              "{evidence.detectedText}"
            </p>
            <p className="mt-2 text-[11px] font-semibold text-rose-200/70">
              {evidence.detectedCategory || "hostil"}
              {typeof evidence.detectedProbability === "number"
                ? ` · ${(evidence.detectedProbability * 100).toFixed(1)}%`
                : ""}
            </p>
          </div>
        )}

        <div className="rounded-xl bg-slate-800/50 px-3 py-2.5">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 shrink-0 text-primary-default" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Sujeto identificado
            </p>
          </div>
          <p className="text-sm font-bold text-sky-300">{evidence.Sujeto || "Desconocido"}</p>
        </div>

        <div className="rounded-xl bg-slate-800/50 px-3 py-2.5">
          <div className="mb-1.5 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 shrink-0 text-neutral-dark" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Análisis de evidencia
            </p>
          </div>
          <p className="text-xs leading-relaxed text-slate-300">
            {evidence.description || "Sin descripción disponible"}
          </p>
        </div>

        {evidence.url && (
          <a
            href={evidence.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 transition-colors hover:text-primary-default"
          >
            <ExternalLink className="h-3 w-3" />
            Abrir imagen original en nueva pestaña
          </a>
        )}
      </div>
    </article>
  );
}

export default function OrganizationApp() {
  const [session, setSession] = useState(null);
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [evidences, setEvidences] = useState([]);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    async function bootstrap() {
      const authenticated = await isAuthenticated();
      setAuthed(authenticated);
      if (!authenticated) {
        setLoading(false);
        return;
      }

      try {
        const freshSession = await refreshSession();
        setSession(freshSession);
      } catch {
        const storedSession = await getAuthSession();
        setSession(storedSession);
      } finally {
        setLoading(false);
      }
    }

    void bootstrap();
  }, []);

  const loadEvidences = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("No estás autenticado.");
      }

      const response = await fetch(EVIDENCE_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al cargar reportes de la organización");
      }

      setEvidences(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed && isOrganizationAdmin(session)) {
      void loadEvidences();
    }
  }, [authed, session, loadEvidences]);

  const stats = useMemo(() => {
    const reporters = new Set(evidences.map((evidence) => evidence.user?.email).filter(Boolean));
    return {
      total: evidences.length,
      agresores: evidences.filter((evidence) => evidence.type === "agresor").length,
      victimas: evidences.filter((evidence) => evidence.type !== "agresor").length,
      reporters: reporters.size,
    };
  }, [evidences]);

  const handleCopyJoinCode = async () => {
    const joinCode = session?.organization?.joinCode;
    if (!joinCode) return;

    await navigator.clipboard.writeText(joinCode);
    setCopyMessage("Código copiado");
    setTimeout(() => setCopyMessage(""), 1800);
  };

  if (!authed && !loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-secondary-default p-6 text-neutral-default">
        <div className="max-w-md rounded-3xl border border-slate-800 bg-secondary-light p-8 text-center">
          <Building2 className="mx-auto mb-4 h-12 w-12 text-primary-default" />
          <h1 className="mb-2 text-2xl font-extrabold">Inicia sesión en la extensión</h1>
          <p className="text-sm text-neutral-dark">
            El panel de organización solo está disponible para cuentas autenticadas.
          </p>
        </div>
      </main>
    );
  }

  if (loading && !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-secondary-default text-neutral-default">
        <span className="inline-block h-8 w-8 rounded-full border-2 border-primary-default border-t-transparent animate-spin" />
      </main>
    );
  }

  if (!isOrganizationAdmin(session)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-secondary-default p-6 text-neutral-default">
        <div className="max-w-lg rounded-3xl border border-slate-800 bg-secondary-light p-8 text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-primary-default" />
          <h1 className="mb-2 text-2xl font-extrabold">Acceso restringido</h1>
          <p className="text-sm text-neutral-dark">
            Este panel está disponible solo para usuarios con rol <strong>OWNER</strong> o <strong>ADMIN</strong>.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary-default text-neutral-default">
      <ImageModal src={modalImage} onClose={() => setModalImage(null)} />

      <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-secondary-light/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5">
          <div className="flex items-center gap-3">
            <img src="/icons/logo.webp" className="h-9 w-auto" alt="logo" />
            <div>
              <p className="text-sm font-bold">Escudo Digital</p>
              <p className="text-[10px] uppercase tracking-wide text-neutral-dark">
                Panel organizacional
              </p>
            </div>
          </div>

          <nav className="ml-auto flex gap-2 text-xs font-semibold">
            <a className="rounded-md px-3 py-1.5 text-slate-300 hover:bg-white/5" href="dashboard.html">
              Dashboard
            </a>
            <a className="rounded-md px-3 py-1.5 text-slate-300 hover:bg-white/5" href="evidences.html">
              Evidencias
            </a>
            <a className="rounded-md bg-white/10 px-3 py-1.5" href="organization.html">
              Organización
            </a>
            <a className="rounded-md px-3 py-1.5 text-slate-300 hover:bg-white/5" href="education.html">
              Educación
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-6">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-default">
              Organización activa
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {session?.organization?.name || "Sin organización"}
            </h1>
            <p className="mt-2 text-sm text-neutral-dark">
              Administra reportes y comparte el join code con tus empleados para vincularlos.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Rol actual: {session?.membership?.role || "Sin rol"}
            </p>
          </div>

          <div className="min-w-[280px] rounded-2xl border border-primary-default/30 bg-primary-default/10 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary-default">
              Join code
            </p>
            <div className="mt-2 flex items-center gap-3">
              <code className="rounded-xl bg-slate-950/70 px-4 py-3 text-xl font-bold tracking-[0.3em] text-white">
                {session?.organization?.joinCode || "--------"}
              </code>
              <button
                type="button"
                onClick={() => void handleCopyJoinCode()}
                className="inline-flex items-center gap-2 rounded-xl border border-primary-default/40 px-3 py-2 text-xs font-bold text-primary-default hover:bg-primary-default/10"
              >
                <Copy className="h-4 w-4" />
                Copiar
              </button>
            </div>
            {copyMessage && <p className="mt-2 text-xs font-semibold text-emerald-300">{copyMessage}</p>}
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <article className="esc-card border-t-2 border-t-primary-default p-4">
            <p className="text-4xl font-extrabold text-primary-light">{stats.total}</p>
            <p className="esc-title mt-1">Reportes totales</p>
          </article>
          <article className="esc-card border-t-2 border-t-rose-500 p-4">
            <p className="text-4xl font-extrabold text-rose-400">{stats.agresores}</p>
            <p className="esc-title mt-1">Agresor detectado</p>
          </article>
          <article className="esc-card border-t-2 border-t-amber-500 p-4">
            <p className="text-4xl font-extrabold text-amber-300">{stats.victimas}</p>
            <p className="esc-title mt-1">Víctima detectada</p>
          </article>
          <article className="esc-card border-t-2 border-t-sky-500 p-4">
            <p className="text-4xl font-extrabold text-sky-300">{stats.reporters}</p>
            <p className="esc-title mt-1">Usuarios reportando</p>
          </article>
        </div>

        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Reportes de la organización</h2>
            <p className="text-sm text-neutral-dark">
              Agresiones detectadas automáticamente por los usuarios miembros de esta organización.
            </p>
          </div>
          <button
            onClick={() => void loadEvidences()}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-primary-default/40 bg-primary-default/10 px-4 py-2.5 text-xs font-bold text-primary-default transition-all hover:bg-primary-default/20 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {loading && evidences.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="mb-3 inline-block h-8 w-8 rounded-full border-2 border-primary-default border-t-transparent animate-spin" />
            <p className="text-sm text-slate-400">Cargando reportes...</p>
          </div>
        )}

        {!loading && evidences.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="max-w-md rounded-2xl border border-slate-800 bg-secondary-light p-8">
              <ImageIcon className="mx-auto mb-4 h-12 w-12 text-slate-600" />
              <h2 className="mb-2 text-lg font-bold text-slate-300">Sin reportes todavía</h2>
              <p className="text-sm leading-relaxed text-slate-500">
                Cuando tus empleados suban evidencias desde la extensión, aparecerán aquí agrupadas para la organización.
              </p>
            </div>
          </div>
        )}

        {evidences.length > 0 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {evidences.map((evidence) => (
                <EvidenceCard
                  key={evidence.id}
                  evidence={evidence}
                  onImageClick={(url) => setModalImage(url)}
                />
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-slate-600">
              {evidences.length} reporte{evidences.length !== 1 ? "s" : ""} disponible{evidences.length !== 1 ? "s" : ""}
            </p>
          </>
        )}
      </section>
    </main>
  );
}
