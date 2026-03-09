import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Brain, Terminal, CheckSquare, Square, Lightbulb } from "lucide-react";
import type { AIBlock, TodoItem } from "@/types/chat";

function ReasoningBlock({ content }: { content: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-2 rounded-lg border border-reasoning-border bg-reasoning overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-primary/5"
      >
        <Brain className="h-4 w-4 text-primary" />
        <span>Reasoning</span>
        <ChevronDown
          className={`ml-auto h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="border-t border-reasoning-border px-4 py-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToolCallBlock({ name, output }: { name: string; output: string }) {
  return (
    <div className="my-2 rounded-lg border border-border bg-tool overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2 text-xs font-semibold text-muted-foreground">
        <Terminal className="h-3.5 w-3.5" />
        <span>{name}</span>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-foreground">
        <code>{output}</code>
      </pre>
    </div>
  );
}

function TodoBlockComponent({ items: initialItems }: { items: TodoItem[] }) {
  const [items, setItems] = useState(initialItems);

  const toggle = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  return (
    <div className="my-2 rounded-lg border border-border bg-card p-3">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
        <CheckSquare className="h-4 w-4 text-primary" />
        <span>To-Do List</span>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => toggle(item.id)}
              className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent text-left"
            >
              {item.done ? (
                <CheckSquare className="h-4 w-4 shrink-0 text-primary" />
              ) : (
                <Square className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <span className={item.done ? "line-through text-muted-foreground" : "text-foreground"}>
                {item.text}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SummaryBlock({ content }: { content: string }) {
  return (
    <div className="my-2 rounded-lg border-l-4 border-summary-border bg-summary px-4 py-3">
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-primary">
        <Lightbulb className="h-4 w-4" />
        Summary
      </div>
      <p className="text-sm leading-relaxed text-foreground">{content}</p>
    </div>
  );
}

export function AIResponseBlocks({ blocks }: { blocks: AIBlock[] }) {
  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "reasoning":
            return <ReasoningBlock key={i} content={block.content} />;
          case "tool_call":
            return <ToolCallBlock key={i} name={block.name} output={block.output} />;
          case "todos":
            return <TodoBlockComponent key={i} items={block.items} />;
          case "summary":
            return <SummaryBlock key={i} content={block.content} />;
          case "text":
            return (
              <p key={i} className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {block.content}
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
