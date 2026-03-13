import { SignJWT } from "jose";
import { Resend } from "resend";
import { prisma } from "../_prisma.js";
import { log } from "../_logger.js";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-me");
const FROM_ADDRESS = "notifications@meetreprime.com";
const APP_URL = process.env.APP_URL ?? "http://localhost:5173";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body ?? {};

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Always return success to prevent email enumeration
  const successResponse = { message: "If an account exists, a reset link has been sent." };

  try {
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      log("auth/forgot-password", "user_not_found", { email: normalizedEmail });
      return res.status(200).json(successResponse);
    }

    // Generate a short-lived reset token (1 hour)
    const resetToken = await new SignJWT({ sub: user.id, email: user.email, type: "password-reset" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(JWT_SECRET);

    const resetLink = `${APP_URL}/reset-password?token=${resetToken}`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: [normalizedEmail],
      subject: "Reset your Mushka Portal password",
      html: `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a2e; line-height: 1.6; padding: 20px; max-width: 600px; margin: 0 auto; }
  .btn { display: inline-block; background: #1a1a2e; color: #ffffff !important; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; margin: 20px 0; }
  p { margin-bottom: 12px; }
</style>
</head>
<body>
  <h2>Password Reset</h2>
  <p>You requested a password reset for your Mushka AI Portal account.</p>
  <p>Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
  <a href="${resetLink}" class="btn">Reset Password</a>
  <p>If you didn't request this, you can safely ignore this email.</p>
  <hr style="border: none; border-top: 1px solid #e5e5e5; margin-top: 30px;">
  <p style="font-size: 12px; color: #999;">Mushka AI Portal — RePrime Group</p>
</body>
</html>`,
    });

    log("auth/forgot-password", "reset_email_sent", { email: normalizedEmail });
    return res.status(200).json(successResponse);
  } catch (err: any) {
    log("auth/forgot-password", "error", { message: err?.message }, "ERROR");
    return res.status(500).json({ error: "Failed to send reset email. Please try again." });
  }
}
