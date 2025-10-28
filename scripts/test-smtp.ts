import nodemailer from "nodemailer";
import { config } from "dotenv";

// Carregar variáveis de ambiente
config({ path: ".env.development" });

async function testSMTP() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER ?? "",
      pass: process.env.SMTP_PASS ?? "",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  console.log("\n🔍 Testando configuração SMTP...");
  console.log(`   Host: ${process.env.SMTP_HOST}`);
  console.log(`   Port: ${process.env.SMTP_PORT}`);
  console.log(`   User: ${process.env.SMTP_USER}`);
  console.log(`   Pass length: ${process.env.SMTP_PASS?.length ?? 0} caracteres`);
  console.log(`   Pass visible: ${process.env.SMTP_PASS?.substring(0, 4)}...\n`);

  try {
    console.log("📧 Verificando credenciais...");
    await transporter.verify();
    console.log("✅ Servidor SMTP conectado e autenticado com sucesso!\n");

    console.log("📧 Enviando email de teste...");
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // enviar para si mesmo
      subject: "Teste Chadebebe",
      html: "<p>Este é um email de teste do sistema Chadebebe.</p>",
    });

    console.log("✅ Email enviado com sucesso!");
    console.log(`   Message ID: ${info.messageId}\n`);
  } catch (error: any) {
    console.error("\n❌ Erro ao testar SMTP:");
    console.error(`   Código: ${error.code}`);
    console.error(`   Response: ${error.response}`);
    console.error(`   Command: ${error.command}\n`);

    if (error.code === "EAUTH") {
      console.error("💡 Este é um erro de autenticação. Verifique:");
      console.error("   1. A senha de App está correta?");
      console.error("   2. Use uma senha de 16 caracteres SEM espaços");
      console.error("   3. 2FA está habilitado na conta?");
      console.error("   4. Gmail permite 'Aplicativos menos seguros'?\n");
    }

    process.exit(1);
  }

  process.exit(0);
}

testSMTP();


