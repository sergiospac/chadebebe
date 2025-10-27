"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";

interface UsuarioPendente {
  id: number;
  nome: string;
  email: string;
  tel: string;
  token: string;
}

export default function PendentesPage() {
  const { usuario, refresh } = useAuth();
  const [pendentes, setPendentes] = useState<UsuarioPendente[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/pendentes");
      if (!response.ok) {
        setError("Erro ao carregar pendentes");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setPendentes(data.usuarios);
      setLoading(false);
    };

    load();
  }, []);

  const handleValidar = async (token: string) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch("/api/auth/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message ?? "Erro ao validar usuário");
    } else {
      setMessage(data.message ?? "Usuário validado!");
      setPendentes((prev) => prev.filter((item) => item.token !== token));
      await refresh();
    }

    setLoading(false);
  };

  if (!usuario?.adm) {
    return <p style={{ textAlign: "center" }}>Acesso restrito a administradores.</p>;
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: "640px" }}>
        <div className="logo">
          <h1>Administração</h1>
          <p>Validação de usuários</p>
        </div>

        <section className="login-section">
          <h2>Usuários aguardando validação</h2>
          {message && <div className="alert-success">{message}</div>}
          {error && <div className="alert-error">{error}</div>}

          {loading ? (
            <p>Carregando...</p>
          ) : pendentes.length === 0 ? (
            <p>Nenhum usuário pendente.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
              {pendentes.map((p) => (
                <li key={p.id} style={{ background: "#fff", padding: "16px", borderRadius: "12px" }}>
                  <strong>{p.nome}</strong>
                  <div>{p.email}</div>
                  <div>{p.tel}</div>
                  <code style={{ display: "block", marginTop: "8px" }}>Token: {p.token}</code>
                  <button
                    className="button-primary"
                    style={{ marginTop: "12px" }}
                    type="button"
                    onClick={() => handleValidar(p.token)}
                    disabled={loading}
                  >
                    Validar usuário
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
