"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { updateChat } from "../actions/updateChat"


const apiKey = "nAdyvi5LI1o; Path=/; Secure;"
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

    setError(null)
    setIsSending(true)

    const newUserMessage = { role: "user" as const, content: userMessage }
    setMessages((prevMessages) => [...prevMessages, newUserMessage])

    try {
      const updatedMessages = [...messages, newUserMessage]
      await updateChat(chat.id, updatedMessages)

      const requestBody = {
        "system" : "You are a world-class AI system, capable of complex reasoning and reflection. Reason through the query inside <thinking> tags, and then provide your final response inside <output> tags. If you detect that you made a mistake in your reasoning at any point, correct yourself inside <reflection> tags",
        "model": "dolphin-mistral:7b-v2-fp16",
        // "model": "llama2",
        // "model": "llama3.3:70b-instruct-q4_0", "phi4:14b-q8_0", "dolphin-mistral:7b-v2-fp16"
        "messages": [{"role": "assistant", "content": ""}, { "role": "user", "content": userMessage }],
        "stream": false
    };
      // const apiEndpoint = endpoint.includes("localhost") ? "/api/chat" : endpoint

      // console.log(
      //   "Sending request to API:",
      //   apiEndpoint,
      //   JSON.stringify(
      //     {
      //       messages: updatedMessages,
      //       model,
      //       // systemPrompt,
      //       agentType,
      //       // endpoint,
      //     },
      //     null,
      //     2,
      //   ),
      // )
        //  const response =  POST
      const response = await fetch("http://localhost:2222/api/chat", {
        
        method:  "POST",
        mode: "cors",
      
        headers: {
          "Access-Control-Allow-Origin": "*",
          // "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS",
          // "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          
        },
       
        body: JSON.stringify(requestBody),
      });
      console.log("API response status:", response.status);
      console.log(requestBody.messages);
      console.log(requestBody.model);
      console.log(requestBody.system);
      console.log(response);
      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`HTTP Error status: ${response.status} - ${errorResponse}`);
      }

      const data = await response.json()
      console.log("Raw API response:", data)

      // let data
      // try {
      //   data = JSON.parse(responseText)
      // } catch (error) {
      //   console.error("Error parsing JSON:", error)
      //   data = { message: { content: responseText.trim() } }
      // }

      console.log("Parsed API response data:", JSON.stringify(data, null, 2))

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage = {
        role: "assistant" as const,
        // content: data.message?.content || data.response || responseText.trim(),
        content: data.message.content,
      }
      setMessages((prevMessages) => [...prevMessages, assistantMessage])
      await updateChat(chat.id, [...updatedMessages, assistantMessage])

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

