import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2 } from "lucide-react";
import React from "react";
import MarkdownIt from "markdown-it";

type Props = {
  messages: Message[];
};

const md = new MarkdownIt();

const safeRenderMarkdown = (content: string | any): string => {
  try {
    // If content is already a string, render it directly
    if (typeof content === "string") {
      return md.render(content);
    }

    // If content might be an object, stringify it first
    return md.render(JSON.stringify(content, null, 2));
  } catch (error) {
    console.error("Failed to render markdown:", error);
    return "<p>Error rendering message content</p>";
  }
};

const MessageList = ({ messages }: Props) => {
  if (!messages || !Array.isArray(messages)) return null;

  return (
    <div className="flex flex-col gap-2 px-4 my-2">
      {messages.map((message) => {
        const htmlContent = safeRenderMarkdown(message.content);

        return (
          <div
            key={message.id}
            className={cn("flex", {
              "justify-end pl-10": message.role === "user",
              "justify-start pr-10": message.role === "assistant",
            })}
          >
            <div
              className={cn(
                "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
                {
                  "bg-[#41B3A2] text-white": message.role === "user",
                  "bg-gray-100 text-black": message.role !== "user",
                }
              )}
            >
              <p dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
