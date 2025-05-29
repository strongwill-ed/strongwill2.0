import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest, setCurrentUser } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/me");
        const data = await response.json();
        if (data && typeof data === 'object') {
          const userData = data as User;
          setUser(userData);
          setCurrentUser(userData);
        }
      } catch (error) {
        // User not authenticated
        setUser(null);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const response = await apiRequest("POST", "/api/auth/login", {
      username,
      password,
    });
    const data = await response.json();
    if (response.ok && data) {
      const userData = data as User;
      setUser(userData);
      setCurrentUser(userData);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await apiRequest("POST", "/api/auth/register", {
      username,
      email,
      password,
    });
    const data = await response.json();
    if (response.ok && data) {
      const userData = data as User;
      setUser(userData);
      setCurrentUser(userData);
    }
  };

  const logout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } catch (error) {
      // Continue with logout even if request fails
    }
    setUser(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}