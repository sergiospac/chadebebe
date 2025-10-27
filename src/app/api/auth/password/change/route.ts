import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

const changeSchema = z.object({
  senhaAtual: z.string().min(1),
  novaSenha: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const usuario = await getAuthenticatedUser();

    if (!usuario) {
      return NextResponse.json(
        { message: "Não autenticado" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { senhaAtual, novaSenha } = changeSchema.parse(body);

    const usuarioCompleto = await prisma.usuario.findUnique({
      where: { id: usuario.id },
    });

    if (!usuarioCompleto?.senha) {
      return NextResponse.json(
        { message: "Senha não registrada" },
        { status: 400 },
      );
    }

    const senhaConfere = await bcrypt.compare(senhaAtual, usuarioCompleto.senha);

    if (!senhaConfere) {
      return NextResponse.json(
        { message: "Senha atual inválida" },
        { status: 400 },
      );
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 12);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        senha: novaSenhaHash,
      },
    });

    return NextResponse.json({ message: "Senha alterada com sucesso." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Dados inválidos", issues: error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    console.error("Erro ao alterar senha:", error);
    return NextResponse.json(
      { message: "Erro interno ao alterar senha" },
      { status: 500 },
    );
  }
}
