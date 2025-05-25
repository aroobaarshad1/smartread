import { db } from "@/lib/db";
import { messages as dbMessages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = Number(searchParams.get("chatId"));

    if (!chatId || isNaN(chatId)) {
      return NextResponse.json(
        { error: "Invalid chat ID" },
        { status: 400 }
      );
    }

    const messages = await db
      .select()
      .from(dbMessages)
      .where(eq(dbMessages.chatId, chatId))
      .orderBy(dbMessages.createdAt);

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("❌ Failed to fetch messages:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}