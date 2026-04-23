import { useCallback, useEffect, useState } from "react";
import { getToken, isAuthenticated } from "@/shared/authService";
import {
  Shield,
  User,
  FileText,
  ExternalLink,
  RefreshCw,
  Image as ImageIcon,
  AlertTriangle,
  Eye,
  X,
} from "lucide-react";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 rounded-full bg-slate-800 border border-slate-700 p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <img
          src={src}
          alt="Evidencia a resolución completa"
          className="w-full h-auto max-h-[85vh] object-contain rounded-xl border border-slate-700/60 shadow-2xl"
        />
      </div>
    </div>
  );
}

function EvidenceCard({ evidence, onImageClick }) {
  const isAgresor = evidence.type === "agresor";

  return (
    <article
      className={`group rounded-2xl border bg-slate-900/70 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 ${
        isAgresor
          ? "border-rose-500/15 hover:border-rose-500/30"
          : "border-amber-500/15 hover:border-amber-500/30"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <TypeBadge type={evidence.type} />
        <span className="text-xs text-slate-600 font-mono">
          ID #{evidence.id}
        </span>
      </div>

      {evidence.url && (
        <button
          type="button"
          onClick={() => onImageClick(evidence.url)}
          className="block w-full relative rounded-xl overflow-hidden border border-slate-700/40 mb-4 cursor-pointer group/img"
        >
          <img
            src={evidence.url}
            alt="Captura de evidencia"
            className="w-full h-52 object-cover transition-all duration-300 group-hover/img:scale-[1.02] group-hover/img:brightness-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="flex items-center gap-1.5 text-xs text-white bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 font-medium">
              <Eye className="h-3.5 w-3.5" />
              Ver a resolución completa
            </span>
          </div>
        </button>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-xl bg-slate-800/50 px-3 py-2.5">
          <User className="h-4 w-4 text-sky-400 shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Sujeto identificado
            </p>
            <p className="text-sm font-bold text-sky-300">
              {evidence.Sujeto || "Desconocido"}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-800/50 px-3 py-2.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <FileText className="h-3.5 w-3.5 text-neutral-dark shrink-0" />
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              Análisis de evidencia
            </p>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {evidence.description || "Sin descripción disponible"}
          </p>
        </div>

        {evidence.url && (
          <a
            href={evidence.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-primary-default transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            Abrir imagen original en nueva pestaña
          </a>
        )}
      </div>
    </article>
  );
}

export default function EvidencesApp() {
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authed, setAuthed] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    isAuthenticated().then((auth) => setAuthed(auth));
  }, []);

  const loadEvidences = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) {
        setError("No estás autenticado. Inicia sesión desde el popup de la extensión.");
        setLoading(false);
        return;
      }
      const response = await fetch(EVIDENCE_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al cargar evidencias");
      setEvidences(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) void loadEvidences();
  }, [authed, loadEvidences]);

  const stats = {
    total: evidences.length,
    agresores: evidences.filter((e) => e.type === "agresor").length,
    victimas: evidences.filter((e) => e.type !== "agresor").length,
  };

  return (
    <main className="min-h-screen bg-secondary-default text-neutral-default">
      <ImageModal src={modalImage} onClose={() => setModalImage(null)} />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-secondary-light/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-5">
          <div className="flex items-center gap-2">
            <img src="/icons/logo.webp" className="h-9 w-auto" alt="logo" />
            <div>
              <p className="text-sm font-bold">Escudo Digital</p>
              <p className="text-[10px] uppercase tracking-wide text-neutral-dark">
                Panel de evidencias
              </p>
            </div>
          </div>
          <nav className="ml-auto flex gap-2 text-xs font-semibold">
            <a
              className="rounded-md px-3 py-1.5 text-slate-300 hover:bg-white/5"
              href="dashboard.html"
            >
              Dashboard
            </a>
            <a
              className="rounded-md bg-white/10 px-3 py-1.5"
              href="evidences.html"
            >
              Evidencias
            </a>
            <a
              className="rounded-md px-3 py-1.5 text-slate-300 hover:bg-white/5"
              href="education.html"
            >
              Educación
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-6">
        {/* Title & Refresh */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="mb-1 text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary-default" />
              Evidencias Recolectadas
            </h1>
            <p className="text-sm text-neutral-dark">
              Capturas de pantalla automáticas, analizadas con IA al detectar amenazas graves.
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

        {/* Stats */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <article className="esc-card border-t-2 border-t-primary-default p-4">
            <p className="text-4xl font-extrabold text-primary-light">{stats.total}</p>
            <p className="esc-title mt-1">Total de evidencias</p>
          </article>
          <article className="esc-card border-t-2 border-t-rose-500 p-4">
            <p className="text-4xl font-extrabold text-rose-400">{stats.agresores}</p>
            <p className="esc-title mt-1">Detectados como agresor</p>
          </article>
          <article className="esc-card border-t-2 border-t-amber-500 p-4">
            <p className="text-4xl font-extrabold text-amber-300">{stats.victimas}</p>
            <p className="esc-title mt-1">Detectados como víctima</p>
          </article>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && evidences.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="inline-block h-8 w-8 rounded-full border-2 border-primary-default border-t-transparent animate-spin mb-3" />
            <p className="text-sm text-slate-400">Cargando evidencias...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && evidences.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-2xl border border-slate-800 bg-secondary-light p-8 max-w-md">
              <ImageIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-slate-300 mb-2">
                Sin evidencias aún
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Las capturas de pantalla se generan automáticamente cuando se detectan
                amenazas graves (riesgo alto) en los chats monitoreados.
              </p>
            </div>
          </div>
        )}

        {/* Evidence Grid */}
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
              {evidences.length} evidencia{evidences.length !== 1 ? "s" : ""} recolectada{evidences.length !== 1 ? "s" : ""}
            </p>
          </>
        )}
      </section>
    </main>
  );
}
