import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  const usuario = await getAuthenticatedUser();

  if (!usuario?.adm) {
    return NextResponse.json(
      { message: "Acesso não autorizado" },
      { status: 403 },
    );
  }

  const pendentes = await prisma.usuario.findMany({
    where: { validado: false },
    select: {
      id: true,
      nome: true,
      email: true,
      tel: true,
      tokenRecuperacao: true,
      tokenExpira: true,
    },
  });

  const tokens = await prisma.tokenValidacao.findMany({
    where: {
      tipo: "VALIDACAO_USUARIO",
      utilizadoEm: null,
      expiracao: {
        gt: new Date(),
      },
    },
    select: {
      usuarioId: true,
      token: true,
    },
  });

  const usuarios = pendentes.map((user) => {
    const token = tokens.find((t) => t.usuarioId === user.id)?.token ?? "";
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      tel: user.tel,
      token,
    };
  });

  return NextResponse.json({ usuarios });
}
