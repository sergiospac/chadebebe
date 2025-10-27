import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  const usuario = await getAuthenticatedUser();

  if (!usuario) {
    return NextResponse.json(
      { message: "Não autenticado" },
      { status: 401 },
    );
  }

  const { validado, ...rest } = usuario;

  return NextResponse.json({ usuario: rest });
}
