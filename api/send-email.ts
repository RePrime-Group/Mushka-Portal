import { Resend } from "resend";
import { log } from "./_logger";

const TEAM_EMAILS = [
  "g@reprime.com",
  "amelia@reprime.com",
  "dcyg770@gmail.com",
  "shirel@reprime.com",
  "steve@reprime.com",
];

const MUSHKA_EMAIL = "mushka@gratsiani.com";
const FROM_ADDRESS = "notifications@meetreprime.com";

interface EmailContent {
  teamSubject?: string;
  teamBody?: string;
  mushkaSubject?: string;
  mushkaBody?: string;
}

function getEmailContent(trigger: string, data: any): EmailContent {
  switch (trigger) {
    case "program-start":
      return {
        teamSubject: "🚀 Mushka Started — ORDER NECKLACE NOW",
        teamBody: `<h2>PRE-ORDER ALERT</h2>
<p><strong>Mushka has officially started her AI training program.</strong></p>
<p><strong>Action Required (Amelia):</strong> Order immediately:</p>
<ul>
<li>Kendra Scott Engravable Bar Necklace</li>
<li>18k Gold Vermeil</li>
<li>Engraved: "MUSHKA"</li>
<li>Gift wrapped</li>
<li>$150 — Shirel's card</li>
<li>Ships 5-7 days</li>
</ul>
<p>Amelia orders immediately. Shirel's card.</p>`,
      };

    case "stage-1-halfway":
      return {
        teamSubject: "📊 Mushka Progress: Stage 1 — 50%",
        teamBody: `<h2>Progress Update</h2>
<p>Mushka has completed ${data.tasksCompleted || 3} of 5 tasks in Stage 1.</p>
<p>Current streak: ${data.currentStreak || 0} days</p>
<p>She's on track. No action needed yet.</p>`,
      };

    case "stage-1-complete":
      return {
        teamSubject: "🎉 Stage 1 Complete — GIFT SHIPPING",
        teamBody: `<h2>Stage 1 Complete!</h2>
<p>Mushka has completed all 5 tasks in Stage 1: "Your AI, Your World"</p>
<p>Total XP: ${data.totalXP || 1000}</p>
<p><strong>Action:</strong> The Kendra Scott necklace should be arriving. Confirm tracking number and delivery status.</p>`,
        mushkaSubject: "You completed Stage 1",
        mushkaBody: `<p>You completed Stage 1. The team at RePrime Group is proud of you.</p>
<p>A gift is making its way to you — because you earned it.</p>`,
      };

    case "stage-3-halfway":
      return {
        teamSubject: "📊 Mushka Progress: Stage 3 — 50%",
        teamBody: `<h2>Progress Update</h2>
<p>Mushka has completed ${data.tasksCompleted || 3} of 5 tasks in Stage 3: "Building Bridges"</p>
<p>Current streak: ${data.currentStreak || 0} days</p>
<p>She's now working with business and CRE contexts.</p>`,
      };

    case "stage-3-complete":
      return {
        teamSubject: "🎉 Stage 3 Complete — SEND $350 NORDSTROM eGIFT",
        teamBody: `<h2>Stage 3 Complete!</h2>
<p>Mushka has completed all 5 tasks in Stage 3: "Building Bridges"</p>
<p>Total XP: ${data.totalXP || 5500}</p>
<p><strong>Action Required (Amelia):</strong> Send Nordstrom eGift card $350 to mushka@gratsiani.com. Shirel's card.</p>`,
        mushkaSubject: "Stage 3 complete",
        mushkaBody: `<p>Stage 3 complete. You are building something real.</p>
<p>A gift from RePrime Group is on its way to your inbox.</p>`,
      };

    case "all-complete":
      return {
        teamSubject:
          "🎉 ALL STAGES COMPLETE — SEND $600 NORDSTROM eGIFT + DOMAIN",
        teamBody: `<h2>ALL 5 STAGES COMPLETE!</h2>
<p>Mushka has completed the entire AI training program.</p>
<p>Total XP: ${data.totalXP || 11000}</p>
<p>Total tasks completed: ${data.tasksCompleted || 25}</p>
<p><strong>Action Required:</strong></p>
<ul>
<li><strong>Amelia:</strong> Send $600 Nordstrom eGift card to mushka@gratsiani.com. Shirel's card.</li>
<li><strong>Gideon:</strong> Transfer MushkaShines.com domain.</li>
</ul>`,
        mushkaSubject: "You did it",
        mushkaBody: `<p>You did it. All five stages complete.</p>
<p>The entire team at RePrime Group is proud of what you have become.</p>
<p>Watch for something special.</p>`,
      };

    default:
      return {};
  }
}

function wrapHtml(body: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a2e; line-height: 1.6; padding: 20px; max-width: 600px; margin: 0 auto; }
  h2 { color: #1a1a2e; margin-bottom: 16px; }
  ul { padding-left: 20px; }
  li { margin-bottom: 8px; }
  p { margin-bottom: 12px; }
</style>
</head>
<body>
${body}
<hr style="border: none; border-top: 1px solid #e5e5e5; margin-top: 30px;">
<p style="font-size: 12px; color: #999;">Mushka AI Portal — RePrime Group</p>
</body>
</html>`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    log("send-email", "method_not_allowed", { method: req.method }, "WARN");
    return res.status(405).send("Method not allowed");
  }

  try {
    const body = req.body;
    const { trigger, ...data } = body;

    if (!trigger) {
      log("send-email", "missing_trigger", {}, "WARN");
      return res.status(400).json({ error: "Missing trigger" });
    }

    log("send-email", "request_received", { trigger });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const content = getEmailContent(trigger, data);
    const results: any[] = [];

    if (content.teamSubject && content.teamBody) {
      const t0 = Date.now();
      const teamResult = await resend.emails.send({
        from: FROM_ADDRESS,
        to: TEAM_EMAILS,
        subject: content.teamSubject,
        html: wrapHtml(content.teamBody),
      });
      log("send-email", "team_email_sent", {
        trigger,
        durationMs: Date.now() - t0,
        to: TEAM_EMAILS,
        subject: content.teamSubject,
        id: (teamResult as any)?.data?.id,
        error: (teamResult as any)?.error ?? null,
      });
      results.push({ type: "team", result: teamResult });
    }

    if (content.mushkaSubject && content.mushkaBody) {
      const t1 = Date.now();
      const mushkaResult = await resend.emails.send({
        from: FROM_ADDRESS,
        to: [MUSHKA_EMAIL],
        subject: content.mushkaSubject,
        html: wrapHtml(content.mushkaBody),
      });
      log("send-email", "mushka_email_sent", {
        trigger,
        durationMs: Date.now() - t1,
        to: MUSHKA_EMAIL,
        subject: content.mushkaSubject,
        id: (mushkaResult as any)?.data?.id,
        error: (mushkaResult as any)?.error ?? null,
      });
      results.push({ type: "mushka", result: mushkaResult });
    }

    log("send-email", "success", { trigger, sent: results.length });
    return res.status(200).json({ sent: results.length, results });
  } catch (err: any) {
    log("send-email", "error", { message: err?.message }, "ERROR");
    return res.status(500).json({ error: "Email send failed" });
  }
}
