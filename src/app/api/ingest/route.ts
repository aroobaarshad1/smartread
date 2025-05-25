export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pdfUrl, fileKey, fileName } = body;

    if (!pdfUrl || !fileKey || !fileName) {
      return new Response(
        JSON.stringify({ error: "Missing pdfUrl, fileKey, or fileName" }),
        { status: 400 }
      );
    }

    const response = await fetch("http://127.0.0.1:8000/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pdf_url: pdfUrl,    // ✅ MUST match backend's expected field
        file_key: fileKey,  // ✅ required
        file_name: fileName // ✅ newly added
      }),
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error("❌ Ingest API error:", err);
    return new Response(
      JSON.stringify({ error: "Ingestion failed" }),
      { status: 500 }
    );
  }
}
