import { Button } from "@/components/ui/button"

interface InfoDisplayProps {
  endpoint: string
  systemPrompt: string
  model: string
  agentType: string
  setShowInfo: (show: boolean) => void
}

export default function InfoDisplay({ endpoint, systemPrompt, model, agentType, setShowInfo }: InfoDisplayProps) {
  return (
    <div className="bg-gray-100 p-4 flex justify-between items-center">
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
      <Button onClick={() => setShowInfo(false)} variant="outline">
        Hide
      </Button>
    </div>
  )
}

