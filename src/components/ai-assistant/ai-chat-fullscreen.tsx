"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "motion/react";
import { MessageSquare, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import type { GiraiAgentUIMessage } from "@/lib/ai/agent";
import { cn } from "@/lib/utils";
import { AiChatMessages } from "./ai-chat-messages";
import { AiSuggestions } from "./ai-suggestions";

export function AiChatFullscreen({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat<GiraiAgentUIMessage>({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      if (!message.text?.trim()) return;
      sendMessage({ text: message.text });
      setInput("");
    },
    [sendMessage]
  );

  const handleSuggestion = useCallback(
    (text: string) => {
      sendMessage({ text });
    },
    [sendMessage]
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const isBusy = status === "submitted" || status === "streaming";
  const isEmpty = messages.length === 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[1000] flex flex-col bg-background"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Atmospheric background */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/3 left-1/2 size-[120%] -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
            <div className="absolute right-0 bottom-0 size-1/2 translate-x-1/4 translate-y-1/4 rounded-full bg-hero-accent/8 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-border/60 bg-background/70 px-4 py-3 backdrop-blur-md md:px-6">
            <div className="flex items-center gap-3">
              <div className="relative flex size-10 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 to-hero-accent/10 shadow-sm">
                <Sparkles className="size-4.5 text-primary" />
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-hero-accent ring-2 ring-background" />
              </div>
              <div>
                <h2 className="font-semibold text-base tracking-tight">
                  GIRAI Assistant
                </h2>
                <p className="text-muted-foreground text-xs">
                  Responsible AI index · live data &amp; reports
                </p>
              </div>
            </div>
            <Button
              aria-label="Close assistant"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
              size="icon"
              variant="ghost"
            >
              <X className="size-5" />
            </Button>
          </header>

          <Conversation className="relative z-10 flex-1">
            <ConversationContent
              className={cn(
                "mx-auto w-full max-w-3xl",
                isEmpty && "flex min-h-full flex-col justify-center"
              )}
            >
              {isEmpty ? (
                <div className="flex flex-col items-center gap-8 py-8 md:py-12">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-border/60 bg-card/80 shadow-sm">
                      <MessageSquare className="size-6 text-primary/70" />
                    </div>
                    <h3 className="font-medium text-lg tracking-tight">
                      What would you like to explore?
                    </h3>
                    <p className="mt-1.5 max-w-sm text-muted-foreground text-sm">
                      Query 135 countries, 39 indicators, and thousands of
                      evidence items.
                    </p>
                  </div>
                  <AiSuggestions disabled={isBusy} onSelect={handleSuggestion} />
                </div>
              ) : (
                <AiChatMessages messages={messages} status={status} />
              )}
              {error && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-center text-destructive text-sm">
                  {error.message}
                </p>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="relative z-10 shrink-0 border-t border-border/60 bg-background/80 px-4 py-4 backdrop-blur-md md:px-6">
            <PromptInput
              className="mx-auto w-full max-w-3xl rounded-2xl border border-border/80 bg-card/90 shadow-sm"
              onSubmit={handleSubmit}
            >
              <PromptInputTextarea
                disabled={isBusy}
                onChange={(e) => setInput(e.currentTarget.value)}
                placeholder="Ask about countries, indicators, evidence, or comparisons…"
                value={input}
                className="min-h-[52px] resize-none border-0 bg-transparent"
              />
              <PromptInputSubmit
                disabled={!input.trim() || isBusy}
                status={isBusy ? "streaming" : "ready"}
              />
            </PromptInput>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
