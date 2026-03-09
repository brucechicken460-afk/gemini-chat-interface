export type Mode = "AUTO" | "SME" | "OPS" | "DQ";

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ReasoningBlock {
  type: "reasoning";
  content: string;
}

export interface ToolCallBlock {
  type: "tool_call";
  name: string;
  output: string;
}

export interface TodoBlock {
  type: "todos";
  items: TodoItem[];
}

export interface SummaryBlock {
  type: "summary";
  content: string;
}

export interface TextBlock {
  type: "text";
  content: string;
}

export type AIBlock = ReasoningBlock | ToolCallBlock | TodoBlock | SummaryBlock | TextBlock;

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  blocks?: AIBlock[];
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
}
