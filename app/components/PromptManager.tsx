import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Prompt } from '../types/prompts'


interface PromptManagerProps {
  prompts: Prompt[]
  onAddPrompt: (prompt: Prompt) => void
  onSelectPrompt: (promptId: string) => void
  selectedPromptId: string | null
}

export default function PromptManager({ prompts, onAddPrompt, onSelectPrompt, selectedPromptId }: PromptManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newPromptName, setNewPromptName] = useState("")
  const [newPromptContent, setNewPromptContent] = useState("")

  const handleAddPrompt = () => {
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      name: newPromptName,
      content: newPromptContent,
    }
    onAddPrompt(newPrompt)
    setNewPromptName("")
    setNewPromptContent("")
    setIsDialogOpen(false)
  }

  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId)

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-blue-200 hover:bg-blue-300 text-gray-800 transition-colors duration-200 w-full sm:w-auto"
          >
            {selectedPrompt ? `Prompt: ${selectedPrompt.name}` : "Select Prompt"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Available Prompts</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {prompts.map((prompt) => (
            <DropdownMenuItem key={prompt.id} onClick={() => onSelectPrompt(prompt.id)}>
              {prompt.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                + Add New Prompt
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Prompt</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Input
                    placeholder="Prompt Name"
                    value={newPromptName}
                    onChange={(e) => setNewPromptName(e.target.value)}
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Prompt Content"
                    value={newPromptContent}
                    onChange={(e) => setNewPromptContent(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <Button onClick={handleAddPrompt} disabled={!newPromptName || !newPromptContent}>
                  Add Prompt
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

