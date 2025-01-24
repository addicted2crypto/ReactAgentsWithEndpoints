"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { updateChat } from "../actions/updateChat"

interface Chat {
  id: string
  name: string
  messages: Array<{ role: "user" | "assistant"; content: string }>
}

interface ChatInterfaceProps {
  chat: Chat
  endpoint: string
  apiKey: string
  systemPrompt: string
  model: string
  agentType: string
}

export default function ChatInterface({ chat, endpoint, apiKey, systemPrompt, model, agentType }: ChatInterfaceProps) {
  const [userMessage, setUserMessage] = useState("")
  const [messages, setMessages] = useState(chat.messages)
  const [error, setError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    setMessages(chat.messages)
  }, [chat])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userMessage.trim()) return

    const messageContent = userMessage
    setUserMessage("") // Clear input immediately
    setError(null)
    setIsSending(true)

    const newUserMessage = { role: "user" as const, content: messageContent }
    setMessages((prevMessages) => [...prevMessages, newUserMessage])

    try {
      const updatedMessages = [...messages, newUserMessage]
      await updateChat(chat.id, updatedMessages)

      const requestBody = {
        "model" : "llama2",
        "messages": [{ "role": "assistant", "content": ""}, {"role": "user", "content": userMessage }],
        "stream" : false,

      }

      // console.log(
      //   "Sending request to API:",
      //   apiEndpoint,
      //   JSON.stringify(
      //     {
      //       messages: updatedMessages,
      //       model,
      //       systemPrompt,
      //       agentType,
      //       endpoint,
      //     },
      //     null,
      //     2,
      //   ),
      // )

      const response = await fetch("http://localhost:11434/api/chat" , {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
         //add auth for non local
          // Authorization: `Bearer ${apiKey}`,
        
      },
      body: JSON.stringify(requestBody),
    }) 
      

      console.log("API response status:", response.status)

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      console.log("API RESPONSE DATA CHATINTERFACE:", JSON.stringify(data, null, 2))

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage = {
        role: "assistant" as const,
        content: data.message?.content || data.choices?.[0]?.message?.content || "No response content",
      }
      setMessages((prevMessages) => [...prevMessages, assistantMessage])
      await updateChat(chat.id, [...updatedMessages, assistantMessage])
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
          <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block p-2 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {message.content}
            </span>
          </div>
        ))}
        {isSending && (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
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

