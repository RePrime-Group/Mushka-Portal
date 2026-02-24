interface EmailTriggerPayload {
  trigger: string;
  stageId?: number;
  tasksCompleted?: number;
  currentStreak?: number;
  totalXP?: number;
}

export async function triggerEmail(payload: EmailTriggerPayload): Promise<void> {
  try {
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Email failures should not block the user experience
    console.error("Email trigger failed");
  }
}
