"use client";

// Integrante 2 - Autenticación y Sesiones JWT
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/src/context/AuthContext";
import { handleError } from "@/src/utils/errorHandler";

export default function LoginPage() {
  const { usuario, cargando, iniciarSesion } = useContext(AuthContext);
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("Ingresa tu correo y contraseña.");
  const [hayError, setHayError] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Si ya existe una sesión válida, no se muestra el formulario.
  useEffect(() => {
    if (!cargando && usuario) {
      router.replace("/solicitudes");
    }
  }, [cargando, usuario, router]);

  async function iniciar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setHayError(false);
    setMensaje("Validando credenciales...");
    try {
      await iniciarSesion(correo, password);
      setPassword("");
      setMensaje("Login correcto. Redirigiendo...");
      router.replace("/solicitudes");
    } catch (error) {
      setPassword("");
      setHayError(true);
      if (error.status === 401) {
        setMensaje("Correo o contraseña incorrectos.");
      } else {
        const info = handleError(error, {
          endpoint: "/api/auth/login",
          method: "POST",
        });
        setMensaje(info.mensaje);
      }
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-md px-4 py-16">
          <p className="text-sm text-slate-600">Validando sesión...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>

        <form
          onSubmit={iniciar}
          className="mt-6 space-y-4 rounded-lg border border-slate-200 bg-white p-4"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Correo
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              autoComplete="username"
              className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {enviando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p
          role="status"
          className={`mt-4 rounded-lg border p-3 text-sm ${
            hayError
              ? "border-rose-300 bg-rose-50 text-rose-800"
              : "border-slate-200 bg-white text-slate-600"
          }`}
        >
          {mensaje}
        </p>
      </div>
    </main>
  );
}
