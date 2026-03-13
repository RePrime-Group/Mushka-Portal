import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { prisma } from "../_prisma.js";
import { log } from "../_logger.js";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-me");
const SESSION_TTL = "7d";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Invalid input" });
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email: normalizedEmail, passwordHash },
    });

    const token = await new SignJWT({ sub: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(SESSION_TTL)
      .sign(JWT_SECRET);

    log("auth/signup", "user_created", { email: normalizedEmail });

    return res.status(201).json({ token, email: user.email });
  } catch (err: any) {
    log("auth/signup", "error", { message: err?.message }, "ERROR");
    return res.status(500).json({ error: "Sign up failed. Please try again." });
  }
}
