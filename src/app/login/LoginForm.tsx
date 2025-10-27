"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Field from "@/components/forms/Field";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login({ email, senha });

    if (!result.success) {
      setError(result.message ?? "Falha no login");
    } else {
      // Redirecionar baseado no tipo de usuário
      if (result.usuario?.adm) {
        router.push("/admin/pendentes");
      } else {
        router.push("/");
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && <div className="alert-error">{error}</div>}

      <Field
        label="Email"
        id="email"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <Field
        label="Senha"
        id="senha"
        name="senha"
        type="password"
        value={senha}
        onChange={(event) => setSenha(event.target.value)}
        required
      />

      <button className="button-primary" type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <p style={{ textAlign: "center" }}>
        Esqueceu a senha? <Link href="/password/request">Recuperar acesso</Link>
      </p>
      <p style={{ textAlign: "center" }}>
        Não tem conta? <Link href="/register">Registre-se</Link>
      </p>
    </form>
  );
};

export default LoginForm;
