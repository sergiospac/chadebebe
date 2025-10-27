import { config } from "dotenv";
import path from "path";
import { PrismaClient, Prisma } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
  config({ path: envFile });
} else {
  config();
}

const resolveDatabaseUrl = () => {
  let url = process.env.DATABASE_URL;
  if (!url) {
    const absolutePath = path.join(process.cwd(), "prisma", "dev.db");
    return `file:${absolutePath}`;
  }

  if (url.startsWith("file:")) {
    const filePath = url.slice(5);
    if (!path.isAbsolute(filePath)) {
      url = `file:${path.join(process.cwd(), filePath)}`;
    }
  }

  return url;
};

const prisma = new PrismaClient({
  datasourceUrl: resolveDatabaseUrl(),
});

const tipoItensSeed = [
  { id: 1, nome: "Babador", imagem: null, ativo: false },
  { id: 2, nome: "Banho de sol", imagem: null, ativo: false },
  { id: 3, nome: "Blusa de manga curta", imagem: null, ativo: false },
  { id: 4, nome: "Body", imagem: null, ativo: false },
  { id: 5, nome: "Bolsa", imagem: null, ativo: false },
  { id: 6, nome: "Caixa de cotonetes", imagem: null, ativo: false },
  { id: 7, nome: "Camiseta e Short", imagem: null, ativo: false },
  { id: 8, nome: "Camisetinha", imagem: null, ativo: false },
  { id: 9, nome: "Casaquinho", imagem: null, ativo: false },
  { id: 10, nome: "Cobertor", imagem: null, ativo: false },
  { id: 11, nome: "Conjunto pagão", imagem: null, ativo: false },
  { id: 12, nome: "Culote", imagem: null, ativo: false },
  { id: 13, nome: "Escovinha de cabelo", imagem: null, ativo: false },
  { id: 14, nome: "Gorro", imagem: null, ativo: false },
  { id: 15, nome: "Hipoglós", imagem: null, ativo: false },
  { id: 16, nome: "Lenço umedecido", imagem: null, ativo: false },
  { id: 17, nome: "Lençol e fronha", imagem: null, ativo: false },
  { id: 18, nome: "Macacão comprido", imagem: null, ativo: false },
  { id: 19, nome: "Macacão curto", imagem: null, ativo: false },
  { id: 20, nome: "Manta", imagem: null, ativo: false },
  { id: 21, nome: "Meinhas", imagem: null, ativo: false },
  { id: 22, nome: "Pacote de Algodão", imagem: null, ativo: false },
  { id: 23, nome: "Pacote de cueiro", imagem: null, ativo: false },
  { id: 24, nome: "Pacote de fraldas de pano", imagem: null, ativo: false },
  { id: 25, nome: "Pacote de fraldas descartável", imagem: null, ativo: false },
  { id: 26, nome: "Pano de boca", imagem: null, ativo: false },
  { id: 27, nome: "Pijama de flanela", imagem: null, ativo: false },
  { id: 28, nome: "Sabonete para bebê", imagem: null, ativo: false },
  { id: 29, nome: "Sapatinho", imagem: null, ativo: false },
  { id: 30, nome: "Termômetro", imagem: null, ativo: false },
  { id: 31, nome: "Toalha", imagem: null, ativo: false },
  { id: 32, nome: "Travesseiro", imagem: null, ativo: false },
];

const usuariosSeed = [
  {
    id: 1,
    nome: "Administrador",
    email: "admin@example.com",
    senha: "$2b$12$nylfZhfbQ0piYIUaHqzoBOz6XHCR6JPgy4i3NJyFRg8S3TLkaBt3W",
    tel: "(00) 00000-0000",
    adm: true,
    validado: true,
  },
  {
    id: 2,
    nome: "Usuário Teste",
    email: "usuario@gap.org",
    senha: "$2b$12$nylfZhfbQ0piYIUaHqzoBOz6XHCR6JPgy4i3NJyFRg8S3TLkaBt3W",
    tel: "(00) 00000-0000",
    adm: false,
    validado: true,
  },
];

const eventosSeed = [
  {
    id: 1,
    nome: "Chá de Bebê Outubro",
    dataHora: new Date("2025-10-30T19:00:00"),
    local: "Sede GAP",
  },
];

const enxovaisSeed = [
  {
    id: 1,
    nome: "Enxoval Azul",
    idEvento: 1,
  },
  {
    id: 2,
    nome: "Enxoval Rosa",
    idEvento: 1,
  },
  {
    id: 3,
    nome: "Enxoval Neutro",
    idEvento: 1,
  },
];

const itensEnxovalSeed = [
  { id: 1, qtdDisponivel: 10, idEnxoval: 1, idTipoItem: 10 },
  { id: 2, qtdDisponivel: 15, idEnxoval: 1, idTipoItem: 25 },
  { id: 3, qtdDisponivel: 5, idEnxoval: 2, idTipoItem: 21 },
  { id: 4, qtdDisponivel: 8, idEnxoval: 3, idTipoItem: 20 },
];

const doacoesSeed = [
  {
    id: 1,
    qtd: 2,
    situacao: 1,
    data: new Date("2025-10-15"),
    idUsuario: 2,
    idItemEnxoval: 1,
  },
  {
    id: 2,
    qtd: 1,
    situacao: 0,
    data: new Date("2025-10-16"),
    idUsuario: 2,
    idItemEnxoval: 2,
  },
];

const tokenValidacaoSeed = [
  {
    id: 1,
    usuarioId: 1,
    tipo: "VALIDACAO_USUARIO",
    token: "token-admin-validado",
    expiracao: new Date(Date.now() + 1000 * 60 * 60 * 24),
    utilizadoEm: new Date(),
  },
];

async function main() {
  console.info("🧹 Limpando tabelas...");
  await prisma.$transaction([
    prisma.tokenValidacao.deleteMany(),
    prisma.doacao.deleteMany(),
    prisma.itemEnxoval.deleteMany(),
    prisma.enxoval.deleteMany(),
    prisma.evento.deleteMany(),
    prisma.tipoItem.deleteMany(),
    prisma.usuario.deleteMany(),
  ]);

  console.info("🌱 Inserindo TipoItem...");
  await prisma.tipoItem.createMany({ data: tipoItensSeed });

  console.info("🌱 Inserindo Usuario...");
  await prisma.usuario.createMany({ data: usuariosSeed });

  console.info("🌱 Inserindo Evento...");
  await prisma.evento.createMany({ data: eventosSeed });

  console.info("🌱 Inserindo Enxoval...");
  await prisma.enxoval.createMany({ data: enxovaisSeed });

  console.info("🌱 Inserindo ItemEnxoval...");
  await prisma.itemEnxoval.createMany({ data: itensEnxovalSeed });

  console.info("🌱 Inserindo Doacao...");
  await prisma.doacao.createMany({ data: doacoesSeed });

  console.info("🌱 Inserindo TokenValidacao...");
  await prisma.tokenValidacao.createMany({ data: tokenValidacaoSeed });

  console.info("✅ Seed concluído!");
}

main()
  .catch((error) => {
    console.error("Erro durante o seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
