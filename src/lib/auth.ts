import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import prisma from "@/lib/prisma";

const tokenSecret: jwt.Secret = process.env.AUTH_TOKEN_SECRET ?? "dev-secret";

interface TokenPayload {
  sub: number;
  email: string;
  adm: boolean;
  iat: number;
  exp: number;
}

export const getTokenFromCookie = async () => {
  const cookieStore = await cookies();
  const token = (cookieStore as any).get?.("chadebebe_token")?.value ?? null;
  return token;
};

export const verifyAuthToken = (token: string) => {
  try {
    const payload = jwt.verify(token, tokenSecret);
    if (typeof payload === "string") {
      return null;
    }
    const { sub, email, adm, iat, exp } = payload as jwt.JwtPayload;
    if (typeof sub !== "number" || typeof email !== "string" || typeof adm !== "boolean") {
      return null;
    }
    if (typeof iat !== "number" || typeof exp !== "number") {
      return null;
    }
    return { sub, email, adm, iat, exp } satisfies TokenPayload;
  } catch (error) {
    return null;
  }
};

export const getAuthenticatedUser = async () => {
  const token = await getTokenFromCookie();
  if (!token) return null;

  const payload = verifyAuthToken(token);
  if (!payload) return null;

  const usuario = await prisma.usuario.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      nome: true,
      email: true,
      tel: true,
      adm: true,
      validado: true,
    },
  });

  if (!usuario?.validado) {
    return null;
  }

  return usuario;
};
