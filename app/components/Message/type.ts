// components/Message/types.ts
export type MessageType = 'success' | 'warning' | 'error' | 'info'
export interface MessageOptions {
  type: MessageType
  content: string
  duration?: number
}
