import { useState, useEffect, useCallback } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatInput } from "@/components/ChatInput";
import type { Mode, Conversation, ChatMessage, AIBlock } from "@/types/chat";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function createMockAIResponse(userText: string): { content: string; blocks: AIBlock[] } {
  const lower = userText.toLowerCase();

  if (lower.includes("todo") || lower.includes("task") || lower.includes("list")) {
    return {
      content: "",
      blocks: [
        {
          type: "reasoning",
          content:
            "The user is asking about tasks or to-dos. I should generate a structured checklist based on their request and provide a clear action plan.",
        },
        {
          type: "todos",
          items: [
            { id: generateId(), text: "Review project requirements", done: false },
            { id: generateId(), text: "Set up development environment", done: false },
            { id: generateId(), text: "Create initial wireframes", done: true },
            { id: generateId(), text: "Write unit tests", done: false },
          ],
        },
        {
          type: "summary",
          content:
            "I've created a task list based on your request. You can check off items as you complete them. Let me know if you'd like to adjust any tasks!",
        },
      ],
    };
  }

  if (lower.includes("api") || lower.includes("code") || lower.includes("function") || lower.includes("json")) {
    return {
      content: "",
      blocks: [
        {
          type: "reasoning",
          content:
            "The user seems to be asking about code or APIs. I'll demonstrate a tool call with formatted JSON output to show how structured data looks.",
        },
        {
          type: "text",
          content: "Here's the result of the API call:",
        },
        {
          type: "tool_call",
          name: "fetch_data()",
          output: JSON.stringify(
            {
              status: "success",
              data: {
                users: [
                  { id: 1, name: "Alice", role: "admin" },
                  { id: 2, name: "Bob", role: "editor" },
                ],
                total: 2,
                page: 1,
              },
            },
            null,
            2
          ),
        },
        {
          type: "summary",
          content:
            "The API returned 2 user records successfully. The response includes pagination metadata for easy integration.",
        },
      ],
    };
  }

  if (lower.includes("explain") || lower.includes("how") || lower.includes("why")) {
    return {
      content: "",
      blocks: [
        {
          type: "reasoning",
          content:
            "The user is asking for an explanation. I need to think through this step by step, considering multiple angles before providing a comprehensive answer.",
        },
        {
          type: "text",
          content:
            "Great question! Let me break this down for you.\n\nThe key concept here involves understanding the relationship between components and their lifecycle. When a component mounts, it initializes its state and begins the rendering pipeline.\n\nThis approach is particularly effective because it allows for declarative updates while maintaining predictable behavior across the application.",
        },
        {
          type: "summary",
          content:
            "In short: components follow a predictable lifecycle that enables efficient, declarative UI updates. This pattern is the foundation of modern reactive frameworks.",
        },
      ],
    };
  }

  return {
    content:
      "I understand your request. I'm a demo interface showcasing the chat UI capabilities. Try asking me about **tasks**, **APIs**, or ask me to **explain** something to see different response formats!\n\nEach type of question triggers different AI response blocks like reasoning, tool calls, to-do lists, and summaries.",
    blocks: [],
  };
}

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [mode, setMode] = useState<Mode>("AUTO");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const activeConv = conversations.find((c) => c.id === activeConvId) ?? null;

  const startNewChat = useCallback(() => {
    const id = generateId();
    const conv: Conversation = { id, title: "New Chat", messages: [], createdAt: new Date() };
    setConversations((prev) => [conv, ...prev]);
    setActiveConvId(id);
    setSidebarOpen(false);
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      let convId = activeConvId;

      if (!convId) {
        const id = generateId();
        const conv: Conversation = { id, title: text.slice(0, 40), messages: [], createdAt: new Date() };
        setConversations((prev) => [conv, ...prev]);
        setActiveConvId(id);
        convId = id;
      }

      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          const updated = { ...c, messages: [...c.messages, userMsg] };
          if (c.messages.length === 0) updated.title = text.slice(0, 40);
          return updated;
        })
      );

      // Simulate AI response
      setTimeout(() => {
        const { content, blocks } = createMockAIResponse(text);
        const aiMsg: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content,
          blocks: blocks.length > 0 ? blocks : undefined,
          timestamp: new Date(),
        };
        setConversations((prev) =>
          prev.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, aiMsg] } : c))
        );
      }, 800);
    },
    [activeConvId]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ChatSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        conversations={conversations}
        activeId={activeConvId}
        onSelect={(id) => {
          setActiveConvId(id);
          setSidebarOpen(false);
        }}
        onNewChat={startNewChat}
      />

      <div
        className="flex flex-1 flex-col transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 280 : 0 }}
      >
        <ChatHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          mode={mode}
          onModeChange={setMode}
          dark={dark}
          onToggleDark={() => setDark(!dark)}
        />

        <ChatMessages messages={activeConv?.messages ?? []} />

        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default Index;
