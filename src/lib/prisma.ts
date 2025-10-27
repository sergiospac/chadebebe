import path from "path";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const createRandomToken = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

const getDatabaseUrl = () => {
  const envUrl = process.env.DATABASE_URL;

  if (!envUrl) {
    return `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
  }

  if (envUrl.startsWith("file:")) {
    const filePath = envUrl.slice(5);
    if (!path.isAbsolute(filePath)) {
      return `file:${path.join(process.cwd(), filePath)}`;
    }
  }

  return envUrl;
};

const createClient = () =>
  new PrismaClient({
    datasourceUrl: getDatabaseUrl(),
  });

export const prisma = globalForPrisma.prisma ?? createClient();

const databaseUrl = getDatabaseUrl();
if (databaseUrl.startsWith("file:")) {
  void prisma.$executeRawUnsafe("PRAGMA journal_mode=WAL;");
  void prisma.$executeRawUnsafe("PRAGMA busy_timeout=5000;");
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
