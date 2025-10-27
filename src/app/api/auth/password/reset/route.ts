import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";

const resetSchema = z.object({
  token: z.string().min(1),
  novaSenha: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, novaSenha } = resetSchema.parse(body);

    const usuario = await prisma.usuario.findFirst({
      where: {
        tokenRecuperacao: token,
        tokenExpira: {
          gt: new Date(),
        },
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { message: "Token inválido ou expirado." },
        { status: 400 },
      );
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 12);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        senha: novaSenhaHash,
        tokenRecuperacao: null,
        tokenExpira: null,
      },
    });

    return NextResponse.json({ message: "Senha redefinida com sucesso." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Dados inválidos", issues: error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    console.error("Erro ao redefinir senha:", error);
    return NextResponse.json(
      { message: "Erro interno ao redefinir senha" },
      { status: 500 },
    );
  }
}
