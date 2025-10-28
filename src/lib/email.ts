import nodemailer from "nodemailer";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  tls?: {
    rejectUnauthorized: boolean;
  };
}

export const getEmailTransporter = () => {
  // Modo desenvolvimento: desabilitar envio real de email
  const useRealEmail = process.env.USE_REAL_EMAIL === "true";
  
  if (!useRealEmail) {
    console.info("📧 Modo desenvolvimento: email real desabilitado. Use USE_REAL_EMAIL=true para habilitar.");
    return null;
  }

  const config: EmailConfig = {
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER ?? "",
      pass: process.env.SMTP_PASS ?? "",
    },
    // Configurações adicionais para melhor compatibilidade
    tls: {
      rejectUnauthorized: false
    }
  };

  if (!config.auth.user || !config.auth.pass) {
    console.warn("⚠️  Configurações SMTP não encontradas. Emails não serão enviados.");
    return null;
  }

  const transporter = nodemailer.createTransport(config);
  
  // Verificar conexão ao criar o transporter
  console.info(`📧 Configurando SMTP: ${config.host}:${config.port} (user: ${config.auth.user})`);
  
  return transporter;
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const transporter = getEmailTransporter();
  
  if (!transporter) {
    const resetUrl = `${process.env.APP_URL ?? "http://localhost:3000"}/password/reset?token=${token}`;
    console.log(`\n📧 [SIMULAÇÃO] Email de recuperação de senha:`);
    console.log(`   Para: ${email}`);
    console.log(`   Token: ${token}`);
    console.log(`   Link: ${resetUrl}\n`);
    return;
  }

  const resetUrl = `${process.env.APP_URL ?? "http://localhost:3000"}/password/reset?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: email,
    subject: "Recuperação de Senha - Chadebebe",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7fb5ff;">Chadebebe - Recuperação de Senha</h2>
        <p>Olá!</p>
        <p>Recebemos uma solicitação para redefinir sua senha no sistema Chadebebe.</p>
        <p>Clique no botão abaixo para redefinir sua senha:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #7fb5ff; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Redefinir Senha
          </a>
        </p>
        <p>Ou copie e cole este link no seu navegador:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p style="color: #999; font-size: 14px;">
          Este link expira em ${process.env.RESET_TOKEN_EXPIRATION_MINUTES ?? 30} minutos.
        </p>
        <p style="color: #999; font-size: 14px;">
          Se você não solicitou esta recuperação, ignore este email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          GAP - Grupo Antônio de Pádua<br>
          Enxoval Solidário<br>
          chadebebe@enxoval.org
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de recuperação enviado com sucesso para: ${email}`);
  } catch (error: any) {
    console.error("\n❌ Erro ao enviar email:");
    console.error("   Código:", error.code);
    console.error("   Response:", error.response);
    console.error("   Command:", error.command);
    console.error("\n💡 Possíveis causas:");
    console.error("   1. Senha de App está incorreta ou expirada");
    console.error("   2. Autenticação em 2 fatores não está habilitada");
    console.error("   3. Conta bloqueada por tentativas de login");
    console.error("   4. Gmail bloqueou o acesso (verifique: https://myaccount.google.com/lesssecureapps)\n");
    throw error;
  }
};

export const sendValidationEmail = async (email: string, token: string) => {
  const transporter = getEmailTransporter();
  
  if (!transporter) {
    console.log(`\n📧 [SIMULAÇÃO] Email de validação de conta:`);
    console.log(`   Para: ${email}`);
    console.log(`   Usuário aguardando validação do administrador\n`);
    return;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: email,
    subject: "Valide sua conta - Chadebebe",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7fb5ff;">Bem-vindo ao Chadebebe!</h2>
        <p>Olá!</p>
        <p>Seu cadastro foi recebido com sucesso. Para ativar sua conta, aguarde a validação pelo administrador.</p>
        <p style="color: #999; font-size: 14px;">
          Você receberá um email quando sua conta for validada.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          GAP - Grupo Antônio de Pádua<br>
          Enxoval Solidário<br>
          chadebebe@enxoval.org
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de validação enviado para: ${email}`);
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw error;
  }
};

