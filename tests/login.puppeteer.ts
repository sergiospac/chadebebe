import { loadEnvConfig } from "@next/env";
import puppeteer from "puppeteer";

loadEnvConfig(process.cwd());

async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto("http://localhost:3000/login", { waitUntil: "networkidle0" });

    await page.waitForSelector("input#email");
    await page.waitForSelector("input#senha");

    await page.click("input#email", { clickCount: 3 });
    await page.type("input#email", "admin@gap.org", { delay: 15 });

    await page.click("input#senha", { clickCount: 3 });
    await page.type("input#senha", "admin123", { delay: 15 });

    await Promise.all([
      page.click("button[type='submit']"),
      page.waitForNavigation({ waitUntil: "networkidle0", timeout: 45000 }),
    ]);

    await page.waitForFunction(
      () => document.body.innerText.includes("Bem-vindo ao Enxoval Solidário GAP"),
      { timeout: 15000 },
    );

    console.log("Teste de login concluído com sucesso!");
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error("Teste de login falhou:", error);
  process.exit(1);
});
