import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface Chat {
  id: string
  name: string
  messages: Array<{ role: "user" | "assistant"; content: string }>
}

interface ChatTabsProps {
  chats: Chat[]
  currentChatId: string | null
  setCurrentChatId: (id: string) => void
  createNewChat: () => void
}

export default function ChatTabs({ chats, currentChatId, setCurrentChatId, createNewChat }: ChatTabsProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  const handleEdit = (chat: Chat) => {
    setEditingId(chat.id)
    setEditingName(chat.name)
  }

  const handleSave = (chat: Chat) => {
    chat.name = editingName
    setEditingId(null)
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-100">
      {chats.map((chat) => (
        <div key={chat.id} className="flex items-center">
          {editingId === chat.id ? (
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={() => handleSave(chat)}
              className="w-32"
            />
          ) : (
            <Button
              variant={currentChatId === chat.id ? "default" : "outline"}
              onClick={() => setCurrentChatId(chat.id)}
              className="w-32 truncate"
            >
              {chat.name}
            </Button>
          )}
          <Button variant="ghost" onClick={() => handleEdit(chat)} className="ml-1">
            ✏️
          </Button>
        </div>
      ))}
      <Button onClick={createNewChat} variant="outline">
        + New Chat
      </Button>
    </div>
  )
}

