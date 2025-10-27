"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  tel: string;
  adm: boolean;
}

interface AuthContextValue {
  usuario: UsuarioLogado | null;
  loading: boolean;
  registrar: (dados: {
    nome: string;
    email: string;
    senha: string;
    tel: string;
  }) => Promise<{ success: boolean; message?: string }>;
  login: (dados: { email: string; senha: string }) => Promise<{ success: boolean; message?: string; usuario?: UsuarioLogado }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        setUsuario(null);
        return;
      }
      const data = await response.json();
      setUsuario(data.usuario);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const registrar: AuthContextValue["registrar"] = async (dados) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message ?? "Erro ao registrar" };
    }

    return { success: true, message: data.message };
  };

  const login: AuthContextValue["login"] = async ({ email, senha }) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message ?? "Falha no login" };
    }

    setUsuario(data.usuario);
    return { success: true, usuario: data.usuario };
  };

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, registrar, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de AuthProvider");
  }
  return context;
};
