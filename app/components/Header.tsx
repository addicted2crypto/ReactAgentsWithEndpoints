import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import PromptManager from "./PromptManager"
import type { Prompt, EndpointPrompts } from "../types/prompts"

interface HeaderProps {
  endpoint: string
  setEndpoint: (endpoint: string) => void
  apiKey: string
  setApiKey: (apiKey: string) => void
  systemPrompt: string
  setSystemPrompt: (systemPrompt: string) => void
  model: string
  setModel: (model: string) => void
  agentType: string
  setAgentType: (agentType: string) => void
}

const endpointModels: { [key: string]: string[] } = {
  "http://localhost:11434/api/chat": ["llama2", "gpt-3.5-turbo"],
  "http://localhost:2222": ["gpt-3.5-turbo", "gpt-4"],
  "https://api.anthropic.com/v1/complete": ["claude-1", "claude-2"],
  "https://api.openai.com/v1/chat/completions": ["gpt-3.5-turbo", "gpt-4"],
}

const defaultPrompts: Prompt[] = [
  {
    id: "reflection",
    name: "Reflection Prompt",
    content: `You are a world-class AI system, capable of complex reasoning and reflection. 
Reason through the query inside <thinking> tags, and then provide your final response inside <output> tags. 
If you detect that you made a mistake in your reasoning at any point, correct yourself inside <reflection> tags.`,
  },
  {
    id: "basic",
    name: "Basic Assistant",
    content: "You are a helpful assistant focused on clear and concise responses.",
  },
]

export default function Header({
  endpoint,
  setEndpoint,
  apiKey,
  setApiKey,
  systemPrompt,
  setSystemPrompt,
  model,
  setModel,
  agentType,
  setAgentType,
}: HeaderProps) {
  const [showApiKeyForm, setShowApiKeyForm] = useState(false)
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>("reflection")
  const [endpointPrompts, setEndpointPrompts] = useState<EndpointPrompts>(() => {
    if (typeof window !== "undefined") {
      const savedPrompts = localStorage.getItem("endpointPrompts")
      return savedPrompts
        ? JSON.parse(savedPrompts)
        : {
            "http://localhost:11434/api/chat": defaultPrompts,
          }
    }
    return {
      "http://localhost:11434/api/chat": defaultPrompts,
    }
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("endpointPrompts", JSON.stringify(endpointPrompts))
    }
  }, [endpointPrompts])

  const handleEndpointChange = (newEndpoint: string) => {
    setEndpoint(newEndpoint)
    setShowApiKeyForm(true)
    setModel(endpointModels[newEndpoint][0])

    // Initialize prompts for new endpoint if they don't exist
    if (!endpointPrompts[newEndpoint]) {
      setEndpointPrompts((prev: any) => ({
        ...prev,
        [newEndpoint]: defaultPrompts,
      }))
    }
  }

  const handleAddPrompt = (prompt: Prompt) => {
    setEndpointPrompts((prev: any) => ({
      ...prev,
      [endpoint]: [...(prev[endpoint] || []), prompt],
    }))
  }

  const handleSelectPrompt = (promptId: string) => {
    setSelectedPromptId(promptId)
    const selectedPrompt = endpointPrompts[endpoint]?.find((p) => p.id === promptId)
    if (selectedPrompt) {
      setSystemPrompt(selectedPrompt.content)
    }
  }

  const agentTypes = ["Social Media Agent", "Code Agent", "Research Agent", "Trading Agent", "Personal Assistant"]

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <h1 className="text-2xl font-bold">AI Agent Interface</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-blue-200 hover:bg-blue-300 text-gray-800 transition-colors duration-200 w-full sm:w-auto"
              >
                Endpoints
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select Endpoint</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.keys(endpointModels).map((endpointOption) => (
                <DropdownMenuItem key={endpointOption} onClick={() => handleEndpointChange(endpointOption)}>
                  {endpointOption}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-blue-200 hover:bg-blue-300 text-gray-800 transition-colors duration-200 w-full sm:w-auto"
              >
                Model: {model}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select Model</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {endpointModels[endpoint]?.map((modelOption) => (
                <DropdownMenuItem key={modelOption} onClick={() => setModel(modelOption)}>
                  {modelOption}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <PromptManager
            prompts={endpointPrompts[endpoint] || []}
            onAddPrompt={handleAddPrompt}
            onSelectPrompt={handleSelectPrompt}
            selectedPromptId={selectedPromptId}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-blue-200 hover:bg-blue-300 text-gray-800 transition-colors duration-200 w-full sm:w-auto"
              >
                Agent Type
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select Agent Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {agentTypes.map((type) => (
                <DropdownMenuItem key={type} onClick={() => setAgentType(type)}>
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {showApiKeyForm && (
        <div className="mt-4">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter API Key"
            className="w-full max-w-xs"
          />
        </div>
      )}
    </header>
  )
}

