import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  senha: z.string().min(1, { message: "Senha é obrigatória" }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, senha } = loginSchema.parse(body);

    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario?.senha) {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senha);

    if (!senhaConfere) {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    const { senha: _, ...usuarioSemSenha } = usuario;

    return NextResponse.json({
      usuario: usuarioSemSenha,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Dados inválidos", issues: error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    console.error("Erro ao realizar login:", error);
    return NextResponse.json(
      { message: "Erro interno ao realizar login" },
      { status: 500 },
    );
  }
}

