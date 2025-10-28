"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import Field from "@/components/forms/Field";

function PasswordResetForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/auth/password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, novaSenha }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message ?? "Erro ao redefinir senha");
    } else {
      setMessage(data.message ?? "Senha redefinida com sucesso.");
      setToken("");
      setNovaSenha("");
    }

    setLoading(false);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="logo">
          <h1>Chadebebe</h1>
          <p>Recuperação de Senha</p>
        </div>

        <section className="login-section">
          <h2>Redefinir senha</h2>
          <form className="form" onSubmit={handleSubmit}>
            {message && <div className="alert-success">{message}</div>}
            {error && <div className="alert-error">{error}</div>}

            <Field
              label={token ? "Token (do link do email)" : "Token recebido"}
              name="token"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              required
              placeholder={token ? "Token carregado do link do email" : "Cole o token recebido por email"}
            />

            <Field
              label="Nova senha"
              name="novaSenha"
              type="password"
              value={novaSenha}
              onChange={(event) => setNovaSenha(event.target.value)}
              required
            />

            <button className="button-primary" type="submit" disabled={loading}>
              {loading ? "Redefinindo..." : "Redefinir senha"}
            </button>

            <p style={{ textAlign: "center" }}>
              Precisa de um token? <Link href="/password/request">Solicitar recuperação</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}

export default function PasswordResetPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PasswordResetForm />
    </Suspense>
  );
}
