import React, { useState } from "react";
import { loginUser, registerUser } from "@/core/services/authService";
import {
  ArrowRight,
  Building2,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

export default function Auth({ onAuthSuccess }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [signupMode, setSignupMode] = useState("personal");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      if (isLoginMode) {
        await loginUser(email, password);
        setMessage("¡Inicio de sesión exitoso!");
      } else {
        await registerUser({
          email,
          password,
          organizationName: signupMode === "organization" ? organizationName.trim() : undefined,
        });
        setMessage(
          signupMode === "organization"
            ? "¡Organización creada exitosamente!"
            : "¡Cuenta personal creada exitosamente!",
        );
      }

      setTimeout(() => onAuthSuccess?.(), 600);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setMessage("");
    setError("");
  };

  return (
    <main className="flex min-h-[520px] w-[360px] flex-col bg-secondary-default text-neutral-default">
      <header className="border-b border-slate-800 bg-secondary-light p-5 text-center">
        <div className="mb-1 flex items-center justify-center gap-2">
          <ShieldCheck className="h-7 w-7 text-primary-default" />
          <h1 className="font-display text-xl font-bold tracking-tight">Escudo Digital</h1>
        </div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-dark">
          Protección contra violencia digital
        </p>
      </header>

      <div className="flex flex-1 flex-col justify-center p-5">
        <div className="mb-5 flex items-center gap-2">
          {isLoginMode ? (
            <LogIn className="h-5 w-5 text-primary-default" />
          ) : (
            <UserPlus className="h-5 w-5 text-primary-default" />
          )}
          <h2 className="text-lg font-bold">
            {isLoginMode ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>
        </div>

        {message && (
          <div className="mb-4 animate-pulse rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-300">
            {error}
          </div>
        )}

        {!isLoginMode && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSignupMode("personal")}
              className={`rounded-xl border px-3 py-3 text-left transition-all ${
                signupMode === "personal"
                  ? "border-primary-default bg-primary-default/10 text-primary-default"
                  : "border-slate-700 bg-slate-900 text-slate-300"
              }`}
            >
              <Users className="mb-2 h-4 w-4" />
              <p className="text-xs font-bold">Cuenta personal</p>
              <p className="mt-1 text-[10px] text-neutral-dark">Únete después con join code</p>
            </button>

            <button
              type="button"
              onClick={() => setSignupMode("organization")}
              className={`rounded-xl border px-3 py-3 text-left transition-all ${
                signupMode === "organization"
                  ? "border-primary-default bg-primary-default/10 text-primary-default"
                  : "border-slate-700 bg-slate-900 text-slate-300"
              }`}
            >
              <Building2 className="mb-2 h-4 w-4" />
              <p className="text-xs font-bold">Crear organización</p>
              <p className="mt-1 text-[10px] text-neutral-dark">Obtén panel admin y join code</p>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-neutral-dark">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-dark" />
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@correo.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-3 text-sm text-neutral-default outline-none transition-all placeholder:text-slate-600 focus:border-primary-default focus:ring-1 focus:ring-primary-default/30"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-neutral-dark">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-dark" />
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-3 text-sm text-neutral-default outline-none transition-all placeholder:text-slate-600 focus:border-primary-default focus:ring-1 focus:ring-primary-default/30"
                required
              />
            </div>
          </div>

          {!isLoginMode && signupMode === "organization" && (
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-neutral-dark">
                Nombre de la organización
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-dark" />
                <input
                  id="auth-organization-name"
                  type="text"
                  value={organizationName}
                  onChange={(event) => setOrganizationName(event.target.value)}
                  placeholder="Empresa o equipo"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-3 text-sm text-neutral-default outline-none transition-all placeholder:text-slate-600 focus:border-primary-default focus:ring-1 focus:ring-primary-default/30"
                  required
                />
              </div>
            </div>
          )}

          <button
            id="auth-submit"
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary-default bg-primary-default/10 px-4 py-2.5 text-sm font-bold text-primary-default transition-all hover:bg-primary-default/20 hover:shadow-lg hover:shadow-primary-default/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-default border-t-transparent" />
            ) : (
              <>
                {isLoginMode
                  ? "Iniciar Sesión"
                  : signupMode === "organization"
                    ? "Crear organización"
                    : "Crear cuenta"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            id="auth-toggle-mode"
            type="button"
            onClick={toggleMode}
            className="text-xs text-neutral-dark transition-colors hover:text-primary-default"
          >
            {isLoginMode
              ? "¿No tienes cuenta? Regístrate aquí"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>

      <footer className="border-t border-slate-800 p-3 text-center">
        <p className="text-[10px] text-slate-600">Tu información está protegida de forma segura</p>
      </footer>
    </main>
  );
}
