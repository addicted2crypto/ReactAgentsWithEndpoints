"use client"

import { useState, useEffect } from "react"
import Header from "./components/Header"
import ChatInterface from "./components/ChatInterface"
import InfoDisplay from "./components/InfoDisplay"
import ChatTabs from "./components/ChatTabs"
import Footer from "./components/Footer"
import { Button } from "@/components/ui/button"

interface Chat {
  id: string
  name: string
  messages: Array<{ role: "user" | "assistant"; content: string }>
}

export default function Home() {
  const [endpoint, setEndpoint] = useState("http://localhost:11434/api/chat")
  const [apiKey, setApiKey] = useState("")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [model, setModel] = useState("llama2")
  const [agentType, setAgentType] = useState("Personal Assistant")
  const [showInfo, setShowInfo] = useState(true)
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

  useEffect(() => {
    const savedEndpoint = localStorage.getItem("endpoint")
    const savedApiKey = localStorage.getItem("apiKey")
    const savedSystemPrompt = localStorage.getItem("systemPrompt")
    const savedModel = localStorage.getItem("model")
    const savedAgentType = localStorage.getItem("agentType")
    const savedChats = localStorage.getItem("chats")

    if (savedEndpoint) setEndpoint(savedEndpoint)
    if (savedApiKey) setApiKey(savedApiKey)
    if (savedSystemPrompt) setSystemPrompt(savedSystemPrompt)
    if (savedModel) setModel(savedModel)
    if (savedAgentType) setAgentType(savedAgentType)
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats)
      setChats(parsedChats)
      if (parsedChats.length > 0) {
        setCurrentChatId(parsedChats[0].id)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("endpoint", endpoint)
    localStorage.setItem("apiKey", apiKey)
    localStorage.setItem("systemPrompt", systemPrompt)
    localStorage.setItem("model", model)
    localStorage.setItem("agentType", agentType)
    localStorage.setItem("chats", JSON.stringify(chats))
  }, [endpoint, apiKey, systemPrompt, model, agentType, chats])

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      name: `Chat ${chats.length + 1}`,
      messages: [],
    }
    setChats([...chats, newChat])
    setCurrentChatId(newChat.id)
  }

  const currentChat = chats.find((chat) => chat.id === currentChatId) || null

  const toggleInfo = () => setShowInfo(!showInfo)

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        endpoint={endpoint}
        setEndpoint={setEndpoint}
        apiKey={apiKey}
        setApiKey={setApiKey}
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
        model={model}
        setModel={setModel}
        agentType={agentType}
        setAgentType={setAgentType}
      />
      <div className="relative">
        {showInfo ? (
          <InfoDisplay
            endpoint={endpoint}
            systemPrompt={systemPrompt}
            model={model}
            agentType={agentType}
            onToggle={toggleInfo}
          />
        ) : (
          <Button onClick={toggleInfo} className="absolute top-2 right-2 z-10">
            Show Info
          </Button>
        )}
      </div>
      <ChatTabs
        chats={chats}
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
        createNewChat={createNewChat}
      />
      {currentChat && (
        <ChatInterface
          chat={currentChat}
          endpoint={endpoint}
          apiKey={apiKey}
          systemPrompt={systemPrompt}
          model={model}
          agentType={agentType}
        />
      )}
      <Footer />
    </div>
  )
}

