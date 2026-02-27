import { Resend } from "resend";

const TEAM_EMAILS = ["g@reprime.com", "steve@reprime.com"];
const MUSHKA_EMAIL = "mushka@gratsiani.com";
const FROM_ADDRESS = "noreply@reprime.com";

function validityEmoji(status: string): string {
  if (status === "green") return "\u{1F7E2}";
  if (status === "yellow") return "\u{1F7E1}";
  return "\u{1F534}";
}

function buildTeamEmail(data: any): string {
  const { scores, domainScores, validity, playbook, responses } = data;

  const scoreRows = Object.entries(scores as Record<string, any>)
    .map(([key, score]: [string, any]) => {
      const percentile = score.percentile != null ? `${score.percentile}%` : "N/A (criterion)";
      const level = score.level || "";
      const subscales = score.subscales
        ? Object.entries(score.subscales).map(([k, v]) => `${k}: ${v}`).join(", ")
        : "";
      return `<tr>
        <td style="padding:8px;border:1px solid #e5e5e5;font-weight:600;">${key}</td>
        <td style="padding:8px;border:1px solid #e5e5e5;">${score.mean}</td>
        <td style="padding:8px;border:1px solid #e5e5e5;">${percentile}</td>
        <td style="padding:8px;border:1px solid #e5e5e5;">${level}</td>
        <td style="padding:8px;border:1px solid #e5e5e5;">${subscales}</td>
      </tr>`;
    })
    .join("");

  const validityDetails = [
    ...((validity.consistencyDetails as string[]) || []),
    ...((validity.infrequencyDetails as string[]) || []),
    ...((validity.fastResponseDetails as string[]) || []),
  ].map((d: string) => `<li>${d}</li>`).join("");

  const playbookHtml = (playbook || [])
    .map((s: any) => `<h3 style="color:#0E3470;margin-top:16px;">${s.title}</h3><p>${s.content}</p>`)
    .join("");

  const responseTimeSummary = responses
    ? `<p>Median response time: ${validity.medianResponseTime}ms | SD: ${validity.responseTimeSD}ms | Engagement: ${validity.engagementIndex}</p>`
    : "";

  return `<!DOCTYPE html>
<html><head><style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a1a2e;line-height:1.6;padding:20px;max-width:700px;margin:0 auto;}
h1{color:#0E3470;} h2{color:#0E3470;margin-top:24px;} h3{color:#BC9C45;}
table{border-collapse:collapse;width:100%;margin:12px 0;}
th{background:#0E3470;color:white;padding:8px;text-align:left;border:1px solid #0E3470;}
td{padding:8px;border:1px solid #e5e5e5;}
</style></head><body>
<h1>Identity Engine Results \u2014 Mushka Gratsiani</h1>

<h2>Validity ${validityEmoji(validity.status)} ${validity.status.toUpperCase()}</h2>
<p>Consistency flags: ${validity.consistencyFlags} | Infrequency flags: ${validity.infrequencyFlags} | Fast response flags: ${validity.fastResponseFlags}</p>
${validityDetails ? `<ul>${validityDetails}</ul>` : "<p>No flags.</p>"}
${responseTimeSummary}

<h2>Instrument Scores</h2>
<table>
<tr><th>Instrument</th><th>Mean</th><th>Percentile</th><th>Level</th><th>Subscales</th></tr>
${scoreRows}
</table>

<h2>Domain Aggregation</h2>
<table>
<tr><th>Domain</th><th>Score (0-100)</th></tr>
<tr><td>Challenge Level</td><td>${domainScores?.challengeLevel ?? "N/A"}</td></tr>
<tr><td>Structure Need</td><td>${domainScores?.structureNeed ?? "N/A"}</td></tr>
<tr><td>Starting Point</td><td>${domainScores?.startingPoint ?? "N/A"}</td></tr>
</table>

<h2>Personal Operating Playbook</h2>
${playbookHtml || "<p>Playbook generation pending.</p>"}

<hr style="border:none;border-top:1px solid #e5e5e5;margin-top:30px;">
<p style="font-size:12px;color:#999;">Mushka AI Portal \u2014 Identity Engine \u2014 RePrime Group</p>
</body></html>`;
}

export default async function handler(req: any): Promise<any> {
  if (req.method !== "POST") {
    return { status: 405, body: "Method not allowed" };
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const resend = new Resend(process.env.RESEND_API_KEY);
    const results: any[] = [];

    // Team email — FULL DATA
    const teamResult = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TEAM_EMAILS,
      subject: `\u{1F4CA} Identity Engine Complete \u2014 Mushka Gratsiani ${validityEmoji(body.validity?.status || "green")}`,
      html: buildTeamEmail(body),
    });
    results.push({ type: "team", result: teamResult });

    // Mushka email — WARM MESSAGE ONLY
    const mushkaResult = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [MUSHKA_EMAIL],
      subject: "Your Personal Operating Playbook is ready",
      html: `<!DOCTYPE html>
<html><head><style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a1a2e;line-height:1.6;padding:20px;max-width:600px;margin:0 auto;}
</style></head><body>
<p>Hi Mushka,</p>
<p>Your Personal Operating Playbook is ready. Open the Identity Engine to explore your results and see how your AI training will be personalized for you.</p>
<p>This is the first step in your journey as Head of AI Research at RePrime Group.</p>
<hr style="border:none;border-top:1px solid #e5e5e5;margin-top:30px;">
<p style="font-size:12px;color:#999;">Mushka AI Portal \u2014 RePrime Group</p>
</body></html>`,
    });
    results.push({ type: "mushka", result: mushkaResult });

    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sent: results.length, results }),
    };
  } catch (err: any) {
    console.error("Results email failed:", err?.message || err);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Email send failed" }),
    };
  }
}
