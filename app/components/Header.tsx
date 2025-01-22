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

  const handleEndpointChange = (newEndpoint: string) => {
    setEndpoint(newEndpoint)
    setShowApiKeyForm(true)
    setModel(endpointModels[newEndpoint][0]) // Set default model for the new endpoint
  }

  const agentTypes = ["Social Media Agent", "Code Agent", "Research Agent", "Trading Agent", "Personal Assistant"]

  useEffect(() => {
    if (endpointModels[endpoint] && !endpointModels[endpoint].includes(model)) {
      setModel(endpointModels[endpoint][0])
    }
  }, [endpoint, model, setModel])

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

