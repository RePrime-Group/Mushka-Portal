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

  const normalizedEmail = (email as string).toLowerCase().trim();

  try {
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    // Use constant-time comparison even when user is not found to prevent timing attacks
    const dummyHash = "$2a$12$dummy.hash.to.prevent.timing.attacks.xxxxxxxxxxxxxx";
    const passwordHash = user?.passwordHash ?? dummyHash;
    const valid = await bcrypt.compare(password, passwordHash);

    if (!user || !valid) {
      log("auth/signin", "invalid_credentials", { email: normalizedEmail }, "WARN");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = await new SignJWT({ sub: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(SESSION_TTL)
      .sign(JWT_SECRET);

    log("auth/signin", "login_success", { email: normalizedEmail });

    return res.status(200).json({ token, email: user.email });
  } catch (err: any) {
    log("auth/signin", "error", { message: err?.message }, "ERROR");
    return res.status(500).json({ error: "Sign in failed. Please try again." });
  }
}
