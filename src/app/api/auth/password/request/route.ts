import { NextResponse } from "next/server";
import { z } from "zod";

import prisma, { createRandomToken } from "@/lib/prisma";

const requestSchema = z.object({ email: z.string().email() });

const resetExpirationMinutes = Number(process.env.RESET_TOKEN_EXPIRATION_MINUTES ?? 30);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = requestSchema.parse(body);

    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return NextResponse.json({ message: "Se usuário existir, receberá instruções." });
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

    return NextResponse.json({
      message: "Token de recuperação gerado. (simulação) repasse o token para o usuário.",
      token,
    });
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
