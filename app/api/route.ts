import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: Request) {
  console.log("API route hit")
  try {
    const { messages, model, systemPrompt, agentType, endpoint } = await req.json()
    console.log("Received request:", { messages, model, systemPrompt, agentType, endpoint })

    const requestBody = {
      model: model || "llama2",
      messages: [
        {
          role: "system",
          content: `You are a world-class AI system, capable of complex reasoning and reflection. Reason through the query inside <thinking> tags, and then provide your final response inside <output> tags. If you detect that you made a mistake in your reasoning at any point, correct yourself inside <reflection> tags. You are a ${agentType}. ${systemPrompt}`,
        },
        ...messages.filter((m: any) => m.role === "user").slice(-1),
      ],
      stream: false,
    }

    console.log("Sending request to endpoint:", endpoint)
    console.log("Request body:", JSON.stringify(requestBody, null, 2))

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })

    console.log("Endpoint response status:", response.status)

    if (!response.ok) {
      throw new Error(`Endpoint API request failed with status ${response.status}`)
    }

    const responseText = await response.text()
    console.log("Raw response text:", responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch (error) {
      console.error("Error parsing JSON:", error)
      // If parsing fails, treat the entire response as the message content
      return NextResponse.json({ message: { content: responseText.trim() } })
    }

    console.log("Parsed response data:", JSON.stringify(data, null, 2))

    // Ensure the response has the expected structure
    if (!data.message) {
      data = { message: { content: data.response || responseText.trim() } }
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in chat route:", error)
    return NextResponse.json({ error: error.message || "An error occurred during the chat request" }, { status: 500 })
  }
}

