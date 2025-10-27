"use client";

import Link from "next/link";
import { useState } from "react";

import Field from "@/components/forms/Field";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const { registrar } = useAuth();
  const [form, setForm] = useState({ nome: "", email: "", senha: "", tel: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const result = await registrar(form);

    if (result.success) {
      setMessage(result.message ?? "Cadastro realizado! Aguarde validação do administrador.");
      setForm({ nome: "", email: "", senha: "", tel: "" });
    } else {
      setError(result.message ?? "Erro ao registrar");
    }

    setLoading(false);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="logo">
          <h1>Chadebebe</h1>
          <p>Compartilhando Amor</p>
        </div>

        <section className="login-section">
          <h2>Crie sua conta</h2>
          <form className="form" onSubmit={handleSubmit}>
            {message && <div className="alert-success">{message}</div>}
            {error && <div className="alert-error">{error}</div>}

            <Field label="Nome" name="nome" value={form.nome} onChange={handleChange} required />
            <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <Field
              label="Telefone"
              name="tel"
              value={form.tel}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              required
            />
            <Field label="Senha" name="senha" type="password" value={form.senha} onChange={handleChange} required />

            <button className="button-primary" type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </button>

            <p style={{ textAlign: "center" }}>
              Já possui conta? <Link href="/login">Fazer login</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
