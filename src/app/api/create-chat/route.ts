import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
// import { loadS3IntoWeaviate } from '@/lib/weaviate'; // Temporarily commented
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // ✅ Clerk Auth
    const authData = await auth();
    const userId = authData?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ Parse Request
    const body = await req.json();
    console.log("📦 Received body:", body); // Debug log

    const { pdf_url, file_key, file_name } = body;

    if (!pdf_url || !file_key || !file_name) {
      console.warn("⚠️ Missing field(s):", { pdf_url, file_key, file_name });
      return NextResponse.json(
        { error: 'Missing required fields: pdf_url, file_key, file_name' },
        { status: 400 }
      );
    }

    // ✅ Debug: Skip Weaviate temporarily
    // const firstPage = await loadS3IntoWeaviate(pdf_url, file_key);
    // console.log("✅ Weaviate loaded:", firstPage);

    // ✅ Save Chat Metadata to DB
    const inserted = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: pdf_url,
        userId,
      })
      .returning({ insertedId: chats.id });

    console.log("✅ Chat inserted:", inserted);

    // ✅ Success Response
    return NextResponse.json(
      { chat_id: inserted[0].insertedId, message: 'Chat created successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));

    console.error('❌ Error in /api/create-chat:', {
      message: err.message,
      stack: err.stack,
      cause: (err as any).cause,
    });

    return NextResponse.json(
      { error: 'Internal Server Error', details: err.message },
      { status: 500 }
    );
  }
}
