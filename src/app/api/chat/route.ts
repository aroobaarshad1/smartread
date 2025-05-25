import { db } from "@/lib/db";
import { chats, messages as dbMessages } from "@/lib/db/schema";
import { google } from "@ai-sdk/google";
import { type CoreMessage, streamText } from "ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

// Helper functions
function contentToString(content: any): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map(part => part.text || JSON.stringify(part)).join(' ');
  }
  return JSON.stringify(content);
}

async function ingestDocument(fileKey: string, pdfUrl: string, pdfName: string) {
  try {
    const response = await fetch("https://flask-backend-603974211306.us-central1.run.app/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pdf_url: pdfUrl,
        file_key: fileKey,
        file_name: pdfName,
      }),
    });

    if (!response.ok) throw new Error("Failed to ingest document");
    return await response.json();
  } catch (err) {
    console.error("Ingestion failed:", err);
    throw err;
  }
}

async function getContext(fileKey: string, query: string): Promise<string> {
  try {
    const response = await fetch("https://flask-backend-603974211306.us-central1.run.app/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        file_key: fileKey,
      }),
    });

    if (!response.ok) throw new Error("Failed to query context");
    const json = await response.json();
    return json.response || "";
  } catch (err) {
    console.error("Context query failed:", err);
    return "";
  }
}

async function saveMessage(chatId: number, role: "user" | "assistant", content: string) {
  try {
    await db.insert(dbMessages).values({
      chatId,
      role,
      content,
    });
    console.log(`✅ Saved ${role} message`);
  } catch (err) {
    console.error(`❌ Failed to save ${role} message:`, err);
    throw err;
  }
}

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    
    // Verify chat exists
    const [chat] = await db.select().from(chats).where(eq(chats.id, chatId)).limit(1);
    if (!chat) return NextResponse.json({ error: "Chat not found" }, { status: 404 });

    const { fileKey, pdfUrl, pdfName } = chat;
    const lastMessage = messages[messages.length - 1];
    const userQuery = contentToString(lastMessage.content).trim();
    
    if (!userQuery) {
      return NextResponse.json({ error: "Query content missing" }, { status: 400 });
    }

    // Save user message immediately
    if (lastMessage.role === "user") {
      await saveMessage(chatId, "user", userQuery);
    }

    // Get context from document
    let context = await getContext(fileKey, userQuery);
    if (!context || context.includes("No relevant context")) {
      try {
        await ingestDocument(fileKey, pdfUrl, pdfName);
        await new Promise(resolve => setTimeout(resolve, 2000));
        context = await getContext(fileKey, userQuery);
      } catch (ingestError) {
        console.error("Ingestion retry failed:", ingestError);
      }
    }

    // Generate AI response
    const result = await streamText({
      model: google("models/gemini-1.5-flash-latest"),
      messages: [
        {
          role: "system",
          content: context && !context.includes("No relevant context")
            ? `Answer using ONLY this context:\n\n${context}\n\nIf not found, say "I couldn't find that information."`
            : "You're a helpful assistant."
        },
        ...messages
      ],
    });

    // Variables to accumulate the response
    let fullResponse = "";

    // Create transform stream to process the data stream
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        
        // Parse the data stream format (0:"message")
        const match = text.match(/0:"([^"]*)"/);
        if (match) {
          const content = match[1]
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"');
          fullResponse += content;
        }
        
        controller.enqueue(chunk);
      },
      async flush() {
        // Save the complete assistant response
        if (fullResponse) {
          try {
            await saveMessage(chatId, "assistant", fullResponse);
            console.log("💾 Successfully saved assistant response");
          } catch (saveError) {
            console.error("Failed to save assistant response:", saveError);
          }
        }
      }
    });

    // Get the data stream and pipe through our transformer
    const dataStream = result.toDataStream();
    const transformedStream = dataStream.pipeThrough(transformStream);

    // Return the transformed stream
    return new Response(transformedStream, {
      headers: { 'Content-Type': 'text/plain' },
    });

  } catch (err) {
    console.error("Chat endpoint error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}