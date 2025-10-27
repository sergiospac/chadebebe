"use client";

import { useRouter } from "next/navigation";

import LoginForm from "./LoginForm";

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/");
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="logo">
        </div>

        <div className="title-container">
          <h1>Enxoval Solidário GAP</h1>
          <h2>Grupo Antônio de Pádua</h2>
          <p>Compartilhando Amor</p>
        </div>

        <section className="login-section">
          <h2>Bem-vindo ao Sistema de Doação</h2>
          <p>
            Faça login com suas credenciais. Se ainda não possui acesso, registre-se e aguarde validação.
          </p>
          <LoginForm onLoginSuccess={handleSuccess} />
        </section>
      </div>
    </div>
  );
}
