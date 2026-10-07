import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser } from "../services/authService";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem("credittrust_token")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const savedToken = localStorage.getItem("credittrust_token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser(savedToken);
        setUser(data.user);
      } catch (error) {
        console.error("Session restore failed:", error);

        // Only remove the token when backend explicitly rejects it.
        if (
          error.message?.toLowerCase().includes("invalid") ||
          error.message?.toLowerCase().includes("expired") ||
          error.message?.toLowerCase().includes("authentication")
        ) {
          localStorage.removeItem("credittrust_token");
          setToken(null);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(credentials) {
    const data = await loginUser(credentials);

    localStorage.setItem("credittrust_token", data.token);

    setToken(data.token);
    setUser(data.user);

    return data;
  }

  function logout() {
    localStorage.removeItem("credittrust_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(token && user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

export default AuthProvider;