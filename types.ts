
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name:string;
  email: string;
  role: Role;
  avatar: string;
}

export enum MessageAuthor {
  USER = 'user',
  AI = 'ai',
}

export interface Message {
  id: string;
  text: string;
  author: MessageAuthor;
  timestamp: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  icon: string; // Changed from React.ReactNode to string
}

export interface ChatSession {
  id:string;
  title: string;
  agentId: string;
  messages: Message[];
  createdAt: string;
}

export interface ApiSetting {
  id: string;
  service: string;
  apiKey: string;
}

export interface WebhookEvent {
  id: string;
  status: 'success' | 'failed';
  payload: object;
  timestamp: string;
}