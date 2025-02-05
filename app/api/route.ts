import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: Request) {
  console.log("API route hit")
  try {
    const { messages, model, systemPrompt, agentType, endpoint } = await req.json()
    console.log("Received request:", { messages, model, systemPrompt, agentType, endpoint })

    // For Ollama endpoint, format according to their API requirements
    if (endpoint.includes("localhost:2222")) {
      const ollamaEndpoint = "http://localhost:2222/api/chat"
      const requestBody = {
        model: "phi4:14b-q8_0",
        // || "llama2",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...messages.filter((m: any) => m.role === "user" || m.role === "assistant"),
        ],
        stream: false,
      }

      console.log("Sending Ollama request:", JSON.stringify(requestBody, null, 2))

      const response = await fetch(ollamaEndpoint, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "gzip,deflate, br, application/json" },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`Ollama API request failed with status ${response.status}`)
      }

      const responseText = await response.text()
      console.log("Raw Ollama response:", responseText)

      try {
        const data = JSON.parse(responseText)
        return NextResponse.json({ message: { content: data.message?.content || responseText.trim() } })
      } catch (error) {
        return NextResponse.json({ message: { content: responseText.trim() } })
      }
    }

    //Add Handle other endpoints here...
    //Use Default response format
    return NextResponse.json({ error: "Endpoint not supported" }, { status: 400 })
  } catch (error: any) {
    console.error("Error in chat route:", error)
    return NextResponse.json({ error: error.message || "An error occurred during the chat request" }, { status: 500 })
  }
}

