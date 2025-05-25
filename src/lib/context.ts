export async function getMatchesFromQuery(query: string, fileKey: string) {
  try {
    const trimmedFileKey = fileKey?.trim();

    if (!trimmedFileKey || trimmedFileKey.length === 0) {
      throw new Error("❌ Invalid or empty fileKey provided.");
    }

    const response = await fetch("http://127.0.0.1:8000/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query_texts: [query] }),
    });

    if (!response.ok) {
      throw new Error("❌ Failed to query ChromaDB");
    }

    const json = await response.json();
    const results = json?.documents?.[0] || [];

    console.log(`📌 Retrieved ${results.length} matches from ChromaDB`);
    console.log("📄 ChromaDB full response:", JSON.stringify(json, null, 2));

    return results; // These are just strings, you may want to adapt formatting
  } catch (error: any) {
    console.error("❌ ChromaDB query error:", error.message || error);
    throw error;
  }
}
