import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import prisma, { createRandomToken } from "@/lib/prisma";

const registerSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  tel: z.string().min(8, "Telefone inválido"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, senha, tel } = registerSchema.parse(body);

    const userExists = await prisma.usuario.findUnique({ where: { email } });

    if (userExists) {
      return NextResponse.json(
        { message: "Já existe um usuário com este email." },
        { status: 409 },
      );
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        tel,
        adm: false,
        validado: false,
      },
    });

    const token = createRandomToken();

    await prisma.tokenValidacao.create({
      data: {
        usuarioId: novoUsuario.id,
        tipo: "VALIDACAO_USUARIO",
        token,
        expiracao: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    return NextResponse.json(
      {
        message: "Cadastro realizado com sucesso. Aguarde a validação do administrador.",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Dados inválidos => " + Object.entries(error.flatten().fieldErrors).map(([field, errors]) => `${field}: ${errors}`).join("\n"), 
          issues: error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json(
      { message: "Erro interno ao registrar usuário" },
      { status: 500 },
    );
  }
}
