"use client";

// Integrante 2 - Autenticación y Sesiones JWT
// Envuelve una vista privada: solo la muestra si hay un usuario autenticado.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { usuario, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && !usuario) {
      router.replace("/login");
    }
  }, [cargando, usuario, router]);

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-md px-4 py-16">
          <p className="text-sm text-slate-600">Validando sesión...</p>
        </div>
      </main>
    );
  }

  if (!usuario) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-md px-4 py-16">
          <p className="text-sm text-slate-600">
            No hay una sesión activa. Redirigiendo al inicio de sesión...
          </p>
        </div>
      </main>
    );
  }

  return children;
}
