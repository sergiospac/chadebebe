import { NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

const validateSchema = z.object({ token: z.string().min(1) });

export async function POST(request: Request) {
  try {
    const admin = await getAuthenticatedUser();

    if (!admin?.adm) {
      return NextResponse.json(
        { message: "Acesso não autorizado" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { token } = validateSchema.parse(body);

    const tokenRecord = await prisma.tokenValidacao.findUnique({ where: { token } });

    if (!tokenRecord || tokenRecord.utilizadoEm || tokenRecord.expiracao < new Date()) {
      return NextResponse.json(
        { message: "Token inválido ou expirado." },
        { status: 400 },
      );
    }

    await prisma.$transaction([
      prisma.usuario.update({
        where: { id: tokenRecord.usuarioId },
        data: { validado: true },
      }),
      prisma.tokenValidacao.update({
        where: { id: tokenRecord.id },
        data: { utilizadoEm: new Date() },
      }),
    ]);

    return NextResponse.json({ message: "Usuário validado com sucesso." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Dados inválidos", issues: error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    console.error("Erro ao validar usuario:", error);
    return NextResponse.json(
      { message: "Erro interno ao validar usuario" },
      { status: 500 },
    );
  }
}
