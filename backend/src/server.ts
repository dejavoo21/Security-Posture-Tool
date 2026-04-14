import "dotenv/config";
import { execFileSync } from "node:child_process";
import app from "./app.js";

const ensureDatabaseSchema = () => {
  if (process.env.SKIP_PRISMA_DB_PUSH === "true") {
    console.log("Skipping Prisma db push because SKIP_PRISMA_DB_PUSH=true");
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.log("Skipping Prisma db push because DATABASE_URL is not defined");
    return;
  }

  try {
    const command = process.platform === "win32" ? "npx.cmd" : "npx";
    console.log("Applying Prisma schema with prisma db push...");
    execFileSync(command, ["prisma", "db", "push"], {
      stdio: "inherit",
      env: process.env,
    });
    console.log("Prisma schema is ready.");
  } catch (error) {
    console.error("Failed to apply Prisma schema before startup.", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

console.log('--- BACKEND DIAGNOSTICS ---');
console.log('DATABASE_URL defined:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  console.log('URL Prefix:', process.env.DATABASE_URL.substring(0, 20) + '...');
}
console.log('---------------------------');

const PORT = Number(process.env.PORT || 4000);

ensureDatabaseSchema();

app.listen(PORT, () => {
  console.log(`Security Posture Tool backend running on http://localhost:${PORT}`);
});
