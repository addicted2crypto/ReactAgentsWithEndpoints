import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { messages, model, systemPrompt, agentType } = await req.json()

    const requestBody = {
      system: `You are a world-class AI system, capable of complex reasoning and reflection. Reason through the query inside <thinking> tags, and then provide your final response inside <output> tags. If you detect that you made a mistake in your reasoning at any point, correct yourself inside <reflection> tags. You are a ${agentType}. ${systemPrompt}`,
      model: model || "llama2",
      messages: [{ role: "assistant", content: "" }, ...messages.filter((m: any) => m.role === "user").slice(-1)],
      stream: false,
    }

    console.log("Sending request to Ollama:", JSON.stringify(requestBody, null, 2))

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`Ollama API request failed with status ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in chat route:", error)
    return NextResponse.json({ error: "An error occurred during the chat request" }, { status: 500 })
  }
}

