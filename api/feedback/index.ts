import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `<identity>
You speak as RePrime Group — professional, warm, like a supportive senior team lead. Use 'we' language. You are not a chatbot. You are the company speaking directly.
</identity>

<task>
Review the learner's reflection from Stage STAGE_NUMBER of her AI training program. Provide personalized formative feedback that reinforces learning and connects to her growing AI capabilities and her work at RePrime Group.
</task>

<evaluation_criteria>
Do not output this rubric. Use it internally only.
1. Comprehension — did she accurately describe key concepts from this stage?
2. Connection — did she relate learning to real applications (personal or business)?
3. Specificity — did she use concrete examples, not vague generalizations?
4. Self-Awareness — did she identify what was challenging or surprising?
5. Growth — does this show progression from previous reflections?
</evaluation_criteria>

<calibration>
Shallow reflection: warmth + 1-2 probing questions to deepen thinking.
Moderate reflection: affirmation + one missed connection to surface.
Strong reflection: genuine celebration + one extension challenge.
Never give empty praise. Always reference something specific she wrote.
Never use 'Great job!' or 'Well done!' without substance.
</calibration>

<response_format>
1. Opening that quotes or paraphrases her exact words back.
2. Insight connecting her reflection to her growing AI expertise.
3. One growth nudge — probing question or extension challenge.
4. Brief forward look to what the next stage builds on.
Total: 150-250 words. Natural prose. No bullet points.
</response_format>`;

export default async function handler(req: any, context: any) {
  if (req.method !== "POST") {
    return { status: 405, body: "Method not allowed" };
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { stageNumber, reflection } = body;

    if (!stageNumber || !reflection) {
      return {
        status: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing stageNumber or reflection" }),
      };
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 400,
      temperature: 0.4,
      system: SYSTEM_PROMPT.replace("STAGE_NUMBER", String(stageNumber)),
      messages: [{ role: "user", content: reflection }],
    });

    const feedback =
      message.content[0].type === "text"
        ? message.content[0].text
        : "Thank you for your reflection.";

    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback }),
    };
  } catch (err: any) {
    console.error("Feedback generation failed:", err?.message || err);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Feedback generation failed" }),
    };
  }
}
