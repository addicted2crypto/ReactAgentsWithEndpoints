"use client"

import { useState, useEffect } from "react"
import Header from "./components/Header"
import ChatInterface from "./components/ChatInterface"
import InfoDisplay from "./components/InfoDisplay"
import Footer from "./components/Footer"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [endpoint, setEndpoint] = useState("http://localhost:11434/api/chat")
  const [apiKey, setApiKey] = useState("")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [model, setModel] = useState("default")
  const [agentType, setAgentType] = useState("Personal Assistant")
  const [showInfo, setShowInfo] = useState(true)
  const [showToggleButton, setShowToggleButton] = useState(false)

  const toggleInfo = (show: boolean) => {
    setShowInfo(show)
    setShowToggleButton(!show)
  }

  useEffect(() => {
    const savedEndpoint = localStorage.getItem("endpoint")
    const savedApiKey = localStorage.getItem("apiKey")
    const savedSystemPrompt = localStorage.getItem("systemPrompt")
    const savedModel = localStorage.getItem("model")
    const savedAgentType = localStorage.getItem("agentType")

    if (savedEndpoint) setEndpoint(savedEndpoint)
    if (savedApiKey) setApiKey(savedApiKey)
    if (savedSystemPrompt) setSystemPrompt(savedSystemPrompt)
    if (savedModel) setModel(savedModel)
    if (savedAgentType) setAgentType(savedAgentType)
  }, [])

  useEffect(() => {
    localStorage.setItem("endpoint", endpoint)
    localStorage.setItem("apiKey", apiKey)
    localStorage.setItem("systemPrompt", systemPrompt)
    localStorage.setItem("model", model)
    localStorage.setItem("agentType", agentType)
  }, [endpoint, apiKey, systemPrompt, model, agentType])

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
      {showInfo && (
        <InfoDisplay
          endpoint={endpoint}
          systemPrompt={systemPrompt}
          model={model}
          agentType={agentType}
          setShowInfo={toggleInfo}
        />
      )}
      <ChatInterface
        endpoint={endpoint}
        apiKey={apiKey}
        systemPrompt={systemPrompt}
        model={model}
        agentType={agentType}
      />
      {showToggleButton && (
        <Button onClick={() => toggleInfo(true)} className="fixed top-4 right-4 z-10">
          Show Info
        </Button>
      )}
      <Footer />
    </div>
  )
}

