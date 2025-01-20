"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

interface ChatInterfaceProps {
  endpoint: string
  apiKey: string
  systemPrompt: string
  model: string
  agentType: string
}

export default function ChatInterface({ endpoint, apiKey, systemPrompt, model, agentType }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Array<{ type: "user" | "bot"; message: string }>>([])
  const [userMessage, setUserMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null)
    setIsSending(true)
    setMessages((prevMessages) => [...prevMessages, { type: "user", message: userMessage }])

    try {
      const requestBody = {
        "model" : "llama2",
        "messages": [{ "role": "assistant", "content": ""}, {"role": "user", "content": userMessage }],
        "stream" : false,
        
        // systemPrompt,
        // agentType,

      }
      //add `${server chosen} to fetch
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      setMessages((prevMessages) => [...prevMessages, { type: "bot", message: data.message.content }])
      setUserMessage("")
    } catch (error) {
      console.error("Submit error:", error)
      setError(`An error occurred: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex-1 p-4">
      <div className="mb-4 h-[60vh] overflow-y-auto border rounded p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.type === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block p-2 rounded-lg ${message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {message.message}
            </span>
          </div>
        ))}
        {isSending && (
          <div className="flex items-center space-x-2">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="space-y-5">
              <Skeleton className="h-12 w-[12rem]" />
              <Skeleton className="h-18 w-[18rem]" />
            </div>
          </div>
        )}
        {error && <div className="text-red-500 mb-4">{error}</div>}
      </div>
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <Input
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" disabled={isSending}>
          Send
        </Button>
      </form>
    </div>
  )
}

