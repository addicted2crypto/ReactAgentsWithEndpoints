import { Button } from "@/components/ui/button"

interface InfoDisplayProps {
  endpoint: string
  systemPrompt: string
  model: string
  agentType: string
  onToggle: () => void
}

export default function InfoDisplay({ endpoint, systemPrompt, model, agentType, onToggle }: InfoDisplayProps) {
  return (
    <div className="bg-gray-100 p-4 flex justify-between items-center relative">
      <div>
        <p>
          <strong>Endpoint:</strong> {endpoint}
        </p>
        <p>
          <strong>System Prompt:</strong> {systemPrompt || "None"}
        </p>
        <p>
          <strong>Model:</strong> {model}
        </p>
        <p>
          <strong>Agent Type:</strong> {agentType}
        </p>
      </div>
      <Button onClick={onToggle} className="absolute top-2 right-2">
        Hide
      </Button>
    </div>
  )
}

