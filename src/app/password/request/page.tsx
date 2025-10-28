"use client";

import Link from "next/link";
import { useState } from "react";

import Field from "@/components/forms/Field";

export default function PasswordRequestPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/auth/password/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message ?? "Erro ao solicitar recuperação");
    } else {
      // Não mostrar token na UI - só no console do servidor
      setMessage(data.message);
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
          <h2>Solicitar recuperação</h2>
          <form className="form" onSubmit={handleSubmit}>
            {message && <div className="alert-success">{message}</div>}
            {error && <div className="alert-error">{error}</div>}

            <Field
              label="Email cadastrado"
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <button className="button-primary" type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar instruções"}
            </button>

            <p style={{ textAlign: "center" }}>
              Já possui o token? <Link href="/password/reset">Redefinir senha</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
