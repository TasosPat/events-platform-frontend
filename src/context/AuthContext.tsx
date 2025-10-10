import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken, logout } from "../services/authService";

interface AuthContextType {
  token: string | null;
  isLoggedIn: boolean;
  setToken: (token: string | null) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getToken());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
   setIsLoggedIn(!!token);
   setToken(token);
  }, [token]);

  const logoutUser = () => {
    logout();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, setToken, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
