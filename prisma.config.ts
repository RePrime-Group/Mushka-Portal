import path from "node:path";
import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

// Load .env before Prisma CLI reads any variables
dotenv.config();

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  // Use the direct (non-pooled) URL for CLI commands (migrate, generate)
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
  },
});
