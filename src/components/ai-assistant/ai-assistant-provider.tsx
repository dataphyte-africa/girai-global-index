"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AiChatFullscreen } from "./ai-chat-fullscreen";
import { AiLauncherButton } from "./ai-launcher-button";

const AiAssistantContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function AiAssistantProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  return (
    <AiAssistantContext.Provider value={{ open, setOpen }}>
      {children}
      {!isStudio && (
        <>
          <AiLauncherButton onClick={() => setOpen(true)} />
          <AiChatFullscreen onOpenChange={setOpen} open={open} />
        </>
      )}
    </AiAssistantContext.Provider>
  );
}

export function useAiAssistant() {
  const ctx = React.useContext(AiAssistantContext);
  if (!ctx) {
    throw new Error("useAiAssistant must be used within AiAssistantProvider");
  }
  return ctx;
}
