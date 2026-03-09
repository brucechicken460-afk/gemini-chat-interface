import { Menu, Sun, Moon } from "lucide-react";
import type { Mode } from "@/types/chat";

interface ChatHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  dark: boolean;
  onToggleDark: () => void;
}

const modes: Mode[] = ["AUTO", "SME", "OPS", "DQ"];

export function ChatHeader({ sidebarOpen, onToggleSidebar, mode, onModeChange, dark, onToggleDark }: ChatHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-2">
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 transition-colors hover:bg-accent"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </button>
        )}
        <div className="flex rounded-lg bg-secondary p-0.5">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                mode === m
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onToggleDark}
        className="rounded-lg p-2 transition-colors hover:bg-accent"
      >
        {dark ? <Sun className="h-5 w-5 text-foreground" /> : <Moon className="h-5 w-5 text-foreground" />}
      </button>
    </header>
  );
}
