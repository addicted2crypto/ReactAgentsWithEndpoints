export interface Prompt {
    id: string
    name: string
    content: string
  }
  
  export interface EndpointPrompts {
    [key: string]: Prompt[]
  }
  
  