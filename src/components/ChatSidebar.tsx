import { Plus, MessageSquare, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Conversation } from "@/types/chat";

interface ChatSidebarProps {
  open: boolean;
  onToggle: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({ open, onToggle, conversations, activeId, onSelect, onNewChat }: ChatSidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-foreground/20 md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            className="fixed left-0 top-0 z-40 flex h-full w-[280px] flex-col border-r border-border bg-card"
          >
            {/* Sidebar header */}
            <div className="flex items-center justify-between p-3 border-b border-border">
              <button
                onClick={onToggle}
                className="rounded-lg p-2 transition-colors hover:bg-accent"
              >
                <Menu className="h-5 w-5 text-foreground" />
              </button>
              <button
                onClick={onNewChat}
                className="rounded-lg p-2 transition-colors hover:bg-accent"
              >
                <Plus className="h-5 w-5 text-foreground" />
              </button>
            </div>

            {/* Conversations list */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
              <p className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Chat History
              </p>
              {conversations.length === 0 && (
                <p className="px-3 py-4 text-sm text-muted-foreground">No conversations yet</p>
              )}
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => onSelect(conv.id)}
                  className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-150 ${
                    activeId === conv.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate">{conv.title}</span>
                </button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
