// PENDIENTE - Integrante 2 (Autenticación y Sesiones JWT)
import { createContext } from "react";

export const AuthContext = createContext(null);

export function useAuth() {
  return null;
}

export function AuthProvider({ children }) {
  return children;
}

export default AuthContext;
