'use client'

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error en login", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    router.push('/');
  };

  useEffect(() => {
    console.log('Estado de autenticación:', {
      isAuthenticated,
      usuario: 'luna',
      rol: 'admin',
      ruta: pathname,
    });

    const publicRoutes = ['/'];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isPublicRoute && !isAuthenticated) {
      console.log(
        `Redirigiendo a login: Usuario no autenticado intentando acceder a ${pathname}`
      );
      router.push('/');
    } else if (isAuthenticated && isPublicRoute && pathname === '/') {
      console.log('Redirigiendo a home: Usuario ya autenticado');
      router.push('/home');
    } 

  }, [pathname, router, isAuthenticated]);

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
