import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface PlannerRequestBody {
  dsaSolved: number;
  dsaTotal: number;
  weakDsaTopics: string[];
  eceCompleted: number;
  eceTotal: number;
  weakEceTopics: string[];
  streak: number;
  yesterdayCompleted: string[];
  yesterdaySkipped: string[];
  currentCgpa: number;
  targetCgpa: number;
}

const SYSTEM_PROMPT = `You are an AI study planner for an Electronics & Communication Engineering (ECE) student preparing for Core (VLSI/embedded/analog) and IT placements.

Given the student's current progress, generate a focused, realistic list of 5-6 study tasks for TODAY. Rules:
- Prioritize weak areas (topics they're behind on) over ones they've already mastered.
- If they skipped tasks yesterday, gently re-include a lighter version of that task today instead of piling on.
- If their current CGPA is meaningfully below their target CGPA, include at least one task nudging academic/semester revision (not just placement prep) — e.g. "Revise [weak subject] for internals". If they're on track or ahead, keep the focus mostly on placement prep (DSA/core/aptitude).
- Mix categories: include at least one DSA task, one ECE/core task, and one Aptitude or "Other" (resume/revision/project) task.
- Each task should be a single, specific, actionable line (not vague, e.g. "Solve 2 medium problems on Binary Trees" not "Do some DSA").
- Category must be exactly one of: "DSA", "ECE", "Aptitude", "Other".

Respond ONLY with valid JSON, no markdown, no preamble, in this exact shape:
{"tasks": [{"text": "string", "category": "DSA" | "ECE" | "Aptitude" | "Other"}]}`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY on the server." },
        { status: 500 }
      );
    }

    const body: PlannerRequestBody = await req.json();

    const userPrompt = `Student progress snapshot:
- DSA: ${body.dsaSolved}/${body.dsaTotal} problems solved. Weakest DSA topics: ${body.weakDsaTopics.join(", ") || "none tracked yet"}.
- Core ECE: ${body.eceCompleted}/${body.eceTotal} subtopics completed. Weakest ECE topics: ${body.weakEceTopics.join(", ") || "none tracked yet"}.
- Current study streak: ${body.streak} day(s).
- Current CGPA: ${body.currentCgpa.toFixed(2)}. Target CGPA: ${body.targetCgpa.toFixed(2)}.
- Yesterday, they completed: ${body.yesterdayCompleted.join(", ") || "nothing recorded"}.
- Yesterday, they skipped: ${body.yesterdaySkipped.join(", ") || "nothing recorded"}.

Generate today's task list now.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1024,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq planner error:", response.status, errText);
      return NextResponse.json(
        { error: "AI planner temporarily unavailable." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? "{}";

    let parsed: { tasks?: { text: string; category: string }[] };
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { tasks: [] };
    }

    const validCategories = ["DSA", "ECE", "Aptitude", "Other"];
    const tasks = (parsed.tasks ?? [])
      .filter((t) => t.text && validCategories.includes(t.category))
      .slice(0, 6);

    return NextResponse.json({ tasks });
  } catch (err) {
    console.error("Planner route error:", err);
    return NextResponse.json(
      { error: "Something went wrong generating today's plan." },
      { status: 500 }
    );
  }
}
