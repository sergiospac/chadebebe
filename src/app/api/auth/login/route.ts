import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  senha: z.string().min(1, { message: "Senha é obrigatória" }),
});

const tokenSecret: jwt.Secret = process.env.AUTH_TOKEN_SECRET ?? "dev-secret";
const tokenExpirationSeconds = Number.parseInt(process.env.AUTH_TOKEN_EXPIRATION ?? "604800", 10);

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

    if (!usuario.validado) {
      return NextResponse.json(
        { message: "Usuário ainda não validado pelo administrador." },
        { status: 403 },
      );
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senha);

    if (!senhaConfere) {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      {
        sub: usuario.id,
        email: usuario.email,
        adm: usuario.adm,
      },
      tokenSecret,
      { expiresIn: tokenExpirationSeconds || 60 * 60 * 24 * 7 },
    );

    const response = NextResponse.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tel: usuario.tel,
        adm: usuario.adm,
      },
    });

    response.cookies.set(
      "chadebebe_token",
      token,
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: tokenExpirationSeconds || 60 * 60 * 24 * 7,
      },
    );

    return response;
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
