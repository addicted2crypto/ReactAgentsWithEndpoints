"use server"

import { revalidatePath } from "next/cache"

interface Chat {
  id: string
  name: string
  messages: Array<{ role: "user" | "assistant"; content: string }>
}

export async function updateChat(chatId: string, updatedMessages: Chat["messages"]) {
  // Here will be db 
  // For mvp, we'll just simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 100))
   revalidatePath("/chat")

   return updatedMessages
}

