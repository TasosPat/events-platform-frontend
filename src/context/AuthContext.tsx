import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken, logout } from "../services/authService";
import { getCurrentUser } from "../services/userService";
import { User } from "../types/user"

interface AuthContextType {
  token: string | null;
  isLoggedIn: boolean;
  currentUser: any | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  setToken: (token: string | null) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getToken());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
  setIsLoggedIn(!!token);
  (async () => {
    try {
      if (token) {
        const user = await getCurrentUser();
        setCurrentUser(user);
      }
    }
    catch(err) {
      console.error("Failed to fetch current user:", err);
      logoutUser(); // clear token if fetch fails
    }
  })();
  }, [token]);

  const logoutUser = () => {
    logout();
    setCurrentUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, currentUser, setCurrentUser, setToken, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
