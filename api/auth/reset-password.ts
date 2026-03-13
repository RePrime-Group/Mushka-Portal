import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { prisma } from "../_prisma.js";
import { log } from "../_logger.js";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-me");
const SESSION_TTL = "7d";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, password } = req.body ?? {};

  if (!token || !password) {
    return res.status(400).json({ error: "Token and password are required" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  try {
    // Verify and decode the reset token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (payload.type !== "password-reset" || typeof payload.email !== "string") {
      return res.status(400).json({ error: "Invalid reset token" });
    }

    const user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid reset token" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Issue a new session token so user is immediately logged in after reset
    const sessionToken = await new SignJWT({ sub: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(SESSION_TTL)
      .sign(JWT_SECRET);

    log("auth/reset-password", "password_reset_success", { email: payload.email });

    return res.status(200).json({ token: sessionToken, email: user.email });
  } catch (err: any) {
    if (err?.code === "ERR_JWT_EXPIRED") {
      return res.status(400).json({ error: "Reset link has expired. Please request a new one." });
    }
    if (err?.code?.startsWith("ERR_JWT")) {
      return res.status(400).json({ error: "Invalid reset link. Please request a new one." });
    }
    log("auth/reset-password", "error", { message: err?.message }, "ERROR");
    return res.status(500).json({ error: "Password reset failed. Please try again." });
  }
}
