"use client";

// Integrante 2 - Autenticación y Sesiones JWT
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearToken, getPerfil, getToken, login } from "@/src/services/api";


export const AuthContext = createContext({
  usuario: null,
  token: "",
  cargando: false,
  iniciarSesion: async () => {
    throw new Error("El AuthProvider no está configurado en src/app/layout.jsx.");
  },
  cerrarSesion: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(""); // En memoria; no localStorage.
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function validarSesion() {
      const tokenActual = getToken();
      if (!tokenActual) {
        setCargando(false);
        return;
      }
      try {
        const data = await getPerfil();
        setToken(tokenActual);
        setUsuario(data.usuario);
      } catch (error) {
        if (error.status === 401) {
          clearToken();
        }
        setToken("");
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    }
    validarSesion();
  }, []);

  // POST /api/auth/login mediante login() de api.js.
  // Si las credenciales fallan, el error llega a la página de login.
  async function iniciarSesion(correo, password) {
    const data = await login(correo, password);
    setToken(data.token);
    setUsuario(data.usuario);
    return data;
  }

  function cerrarSesion() {
    clearToken();
    setToken("");
    setUsuario(null);
    router.replace("/login");
  }

  return (
    <AuthContext.Provider
      value={{ usuario, token, cargando, iniciarSesion, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
