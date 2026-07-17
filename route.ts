import { NextRequest, NextResponse } from "next/server";

// This route runs on the server only. Your API key is read from an
// environment variable and is NEVER sent to the browser.
export const runtime = "nodejs";

interface IncomingMessage {
  sender: "user" | "ai";
  text: string;
}

const SYSTEM_PROMPT = `You are the "ECE Placement AI Coach" inside a personal placement-prep dashboard for a 3rd semester Electronics & Communication Engineering student targeting Core (Qualcomm, NVIDIA, Texas Instruments, Synopsys) and IT placements.

Your job:
- Explain Core ECE concepts (VLSI, Digital Electronics, Analog, Signals & Systems, Microcontrollers/Embedded, Communication Systems, Computer Networks, OS) clearly and rigorously, with equations where relevant.
- Explain DSA / CS fundamentals (data structures, algorithms, time/space complexity) with clean code examples when useful.
- Give realistic mock interview questions and critique the student's answers when they attempt one.
- Be encouraging but not fluffy — keep answers focused, structured (use headers/bullets), and placement-exam relevant.
- Keep responses reasonably concise unless the student asks for deep detail.

Format responses in Markdown.`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Missing ANTHROPIC_API_KEY on the server. Add it in your Vercel project's Environment Variables (or .env.local for local dev) and redeploy.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const messages: IncomingMessage[] = body.messages ?? [];

    if (!messages.length) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    // Map our chat history into Anthropic's message format.
    // Anthropic requires alternating user/assistant turns starting with "user".
    const anthropicMessages = messages
      .filter((m) => m.text && m.text.trim().length > 0)
      .map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: anthropicMessages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return NextResponse.json(
        { error: "The AI coach is temporarily unavailable. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();

    const text = (data.content ?? [])
      .filter((block: { type: string }) => block.type === "text")
      .map((block: { text: string }) => block.text)
      .join("\n");

    return NextResponse.json({ text: text || "Sorry, I couldn't generate a response." });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { error: "Something went wrong reaching the AI coach." },
      { status: 500 }
    );
  }
}
