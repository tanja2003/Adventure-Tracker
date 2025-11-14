import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export function isTokenValid() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp > now; // ✅ noch gültig
  } catch {
    return false;
  }
}

export function ProtectedRoute({ children }) {
  if (!isTokenValid()) {
    console.warn("⛔ Kein oder abgelaufener Token – redirect zu /login");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
  console.log("Zugriff erlaubt");
  return children; // ✅ Zugriff erlaubt
}
