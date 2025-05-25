// components/ChatSideBar.tsx
"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import SubscriptionButton from "./SubscriptionButton";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
};

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {
  return (
    <div className="w-full h-full overflow-hidden p-4 text-gray-200 bg-gray-900 flex flex-col">
      {/* Header Section */}
      <div className="mb-6">
        <Link href="/" className="flex items-center gap-2 mb-4">
          <h1 className="text-xl font-bold">ChatPDF</h1>
        </Link>
        
        <SubscriptionButton isPro={isPro} />
        
        <div className="my-4 border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-400">
            {chats.length} {chats.length === 1 ? "document" : "documents"}
          </p>
        </div>
      </div>

      {/* New Chat Button */}
      <Link href="/" className="mb-4">
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                "bg-blue-600 text-white": chat.id === chatId,
                "hover:bg-gray-800": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2 min-w-4" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          Powered by AI • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default ChatSideBar;