import React, { useState } from "react";
import { registerUser, loginUser } from "@/shared/authService";
import { ShieldCheck, Mail, Lock, UserPlus, LogIn, ArrowRight } from "lucide-react";

export default function Auth({ onAuthSuccess }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      if (isLoginMode) {
        await loginUser(email, password);
        setMessage("¡Inicio de sesión exitoso!");
        // Notify parent that auth succeeded
        setTimeout(() => onAuthSuccess?.(), 600);
      } else {
        await registerUser(email, password);
        setMessage("¡Registro exitoso! Ahora inicia sesión.");
        setIsLoginMode(true);
        setPassword("");
      }
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
    <main className="w-[360px] min-h-[480px] bg-secondary-default text-neutral-default flex flex-col">
      {/* Header */}
      <header className="bg-secondary-light border-b border-slate-800 p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <ShieldCheck className="h-7 w-7 text-primary-default" />
          <h1 className="text-xl font-bold tracking-tight font-display">
            Escudo Digital
          </h1>
        </div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-dark">
          Protección contra violencia digital
        </p>
      </header>

      {/* Form Area */}
      <div className="flex-1 flex flex-col justify-center p-5">
        {/* Title with icon */}
        <div className="flex items-center gap-2 mb-5">
          {isLoginMode ? (
            <LogIn className="h-5 w-5 text-primary-default" />
          ) : (
            <UserPlus className="h-5 w-5 text-primary-default" />
          )}
          <h2 className="text-lg font-bold">
            {isLoginMode ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>
        </div>

        {/* Feedback messages */}
        {message && (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300 animate-pulse">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-neutral-dark">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-dark pointer-events-none" />
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-3 py-2.5 text-sm text-neutral-default outline-none placeholder:text-slate-600 focus:border-primary-default focus:ring-1 focus:ring-primary-default/30 transition-all"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-neutral-dark">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-dark pointer-events-none" />
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-3 py-2.5 text-sm text-neutral-default outline-none placeholder:text-slate-600 focus:border-primary-default focus:ring-1 focus:ring-primary-default/30 transition-all"
                required
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            id="auth-submit"
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary-default bg-primary-default/10 px-4 py-2.5 text-sm font-bold text-primary-default transition-all hover:bg-primary-default/20 hover:shadow-lg hover:shadow-primary-default/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-block h-4 w-4 rounded-full border-2 border-primary-default border-t-transparent animate-spin" />
            ) : (
              <>
                {isLoginMode ? "Iniciar Sesión" : "Crear Cuenta"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle link */}
        <div className="mt-5 text-center">
          <button
            id="auth-toggle-mode"
            type="button"
            onClick={toggleMode}
            className="text-xs text-neutral-dark hover:text-primary-default transition-colors"
          >
            {isLoginMode
              ? "¿No tienes cuenta? Regístrate aquí"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-3 text-center border-t border-slate-800">
        <p className="text-[10px] text-slate-600">
          Tu información está protegida de forma segura
        </p>
      </footer>
    </main>
  );
}