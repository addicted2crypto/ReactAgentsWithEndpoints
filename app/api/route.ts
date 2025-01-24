import { NextResponse } from "next/server"

export const runtime = "edge"

const OLLAMA_ENDPOINT = "http://localhost:11434/api/chat"

export async function POST(req: Request) {
  console.log("API route hit")
  try {
    const { messages, model, systemPrompt, agentType, endpoint } = await req.json()
    console.log("Received request:", { messages, model, systemPrompt, agentType, endpoint })

    // Check if the endpoint is for Ollama
    if (endpoint.includes("localhost:11434")) {
      const ollamaMessages = [
        // Add system message if there's a system prompt
        ...(systemPrompt ? [{ role: "system", content: `${systemPrompt} You are a ${agentType}.` }] : []),
        // Add the conversation history
        ...messages,
      ]

      const requestBody = {
        model: model || "llama2",
        messages: ollamaMessages,
        stream: false,
      }

      console.log("Sending Ollama request:", JSON.stringify(requestBody, null, 2))

      const response = await fetch(OLLAMA_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      console.log("Ollama response status:", response.status)

      if (!response.ok) {
        throw new Error(`Ollama API request failed with status ${response.status}`)
      }

      const responseText = await response.text()
      console.log("Raw Ollama response:", responseText)

      try {
        const data = JSON.parse(responseText)
        return NextResponse.json({
          message: { content: data.message?.content || data.response || responseText.trim() },
        })
      } catch (error) {
        console.error("Error parsing Ollama JSON:", error)
        return NextResponse.json({ message: { content: responseText.trim() } })
      }
    } else {
      //add Handle other endpoints (OpenAI, etc.) with their specific formats
      const requestBody = {
        model: model,
        messages: [{ role: "system", content: `${systemPrompt} You are a ${agentType}.` }, ...messages],
      }

      console.log("Sending request to external API:", JSON.stringify(requestBody, null, 2))

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    }
  } catch (error: any) {
    console.error("Error in chat route:", error)
    return NextResponse.json({ error: error.message || "An error occurred during the chat request" }, { status: 500 })
  }
}

