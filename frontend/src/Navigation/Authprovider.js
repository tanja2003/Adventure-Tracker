import { createContext, useContext, useState } from "react";
import { isTokenValid } from "../ProtectedRoutes";



// React state der sich ändert wenn token sich in localstorage ändert 
// Login Status global mit Context verwalten,
//  sodass sich die NAvigation anpasst, je nach dem ob loged in oder loged out
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(isTokenValid());

  const login = (token) => {
    localStorage.setItem("token", token);
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
