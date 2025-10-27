import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

const rootDir = process.cwd();
const dbPath = path.join(rootDir, "prisma", "dev.db");
const sqlPath = path.join(rootDir, "espec", "arte_dbgap.sql");

console.log(`Seeding SQLite database at ${dbPath}`);

const db = new Database(dbPath);
db.pragma("foreign_keys = OFF");

db.exec(`
DROP TABLE IF EXISTS Doacao;
DROP TABLE IF EXISTS ItemEnxoval;
DROP TABLE IF EXISTS Enxoval;
DROP TABLE IF EXISTS Evento;
DROP TABLE IF EXISTS TipoItem;
DROP TABLE IF EXISTS Usuario;
`);

const sqlDump = fs.readFileSync(sqlPath, "utf-8");

const replaceTypes = (statement) =>
  statement
    .replace(/int\(10\)\s+UNSIGNED/gi, "INTEGER")
    .replace(/tinyint\(1\)/gi, "INTEGER")
    .replace(/varchar\((\d+)\)/gi, "TEXT")
    .replace(/datetime/gi, "TEXT")
    .replace(/date/gi, "TEXT")
    .replace(/AUTO_INCREMENT/gi, "AUTOINCREMENT")
    .replace(/ENGINE=InnoDB/gi, "")
    .replace(/DEFAULT CHARSET=[^\s)]+/gi, "")
    .replace(/COLLATE=[^\s)]+/gi, "")
    .replace(/`/g, "");

const statements = sqlDump
  .split(/;\s*\n/)
  .map((stmt) => stmt.trim())
  .filter((stmt) =>
    stmt &&
    !stmt.startsWith("--") &&
    !stmt.toUpperCase().startsWith("SET ") &&
    !stmt.toUpperCase().startsWith("START TRANSACTION") &&
    !stmt.toUpperCase().startsWith("COMMIT") &&
    !stmt.toUpperCase().startsWith("ALTER TABLE")
  );

db.exec("BEGIN TRANSACTION");

for (const statement of statements) {
  const converted = replaceTypes(statement);
  if (!converted) continue;

  if (converted.startsWith("INSERT INTO Usuario")) {
    const usuarios = [
      { id: 1, nome: "Administrador", email: "admin@gap.org", senha: "$2b$12$dEVhBRub7kVqj7Dgx8ssZOHy4lkA9DY1MexQKJux73yM30hk.NUKi", tel: "(00) 00000-0000", adm: 1 },
      { id: 2, nome: "Usuário Teste", email: "usuario@gap.org", senha: "$2b$12$LXBsWXyG8Cl7j.BKygxfjOSyQF507T.YJa7ec0G29QQfXll8GGAl2", tel: "(00) 00000-0000", adm: 0 }
    ];
    const insert = db.prepare(
      "INSERT INTO Usuario (id, nome, email, senha, tel, adm) VALUES (@id, @nome, @email, @senha, @tel, @adm)"
    );
    for (const usuario of usuarios) {
      insert.run(usuario);
    }
  } else if (converted.startsWith("INSERT INTO")) {
    db.exec(converted);
  } else if (converted.startsWith("CREATE TABLE")) {
    db.exec(converted);
  }
}

db.exec("COMMIT");

db.pragma("foreign_keys = ON");

console.log("Seed concluído com sucesso!");
