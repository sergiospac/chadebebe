import { NextResponse } from "next/server";
import { z } from "zod";

import prisma, { createRandomToken } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

const requestSchema = z.object({ email: z.string().email() });

const resetExpirationMinutes = Number(process.env.RESET_TOKEN_EXPIRATION_MINUTES ?? 30);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = requestSchema.parse(body);

    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      // Não revela se o email existe ou não
      return NextResponse.json({ 
        message: "Se o email estiver cadastrado, você receberá instruções em breve." 
      });
    }

    const token = createRandomToken();
    const expiracao = new Date(Date.now() + resetExpirationMinutes * 60 * 1000);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        tokenRecuperacao: token,
        tokenExpira: expiracao,
      },
    });

    // Enviar email com link de recuperação
    try {
      await sendPasswordResetEmail(email, token);
      return NextResponse.json({
        message: "Instruções de recuperação foram enviadas para seu email.",
      });
    } catch (emailError) {
      console.error("Erro ao enviar email:", emailError);
      // Fallback: ainda fornece o token para desenvolvimento
      return NextResponse.json({
        message: "Erro ao enviar email. Token de desenvolvimento:",
        token,
        developmentMode: true,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Dados inválidos", issues: error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    console.error("Erro ao solicitar redefinição de senha:", error);
    return NextResponse.json(
      { message: "Erro interno ao solicitar redefinição" },
      { status: 500 },
    );
  }
}
