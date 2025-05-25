// lib/pdf.ts
import pdf from "pdf-parse"; // Import the pdf function from pdf-parse

export async function pdfToTextChunks(pdfBuffer: Buffer): Promise<{ text: string, pageNumber: number }[]> {
  try {
    const pdfData = await pdf(pdfBuffer); // Parsing the PDF buffer

    // If you need to break the text into chunks, use a basic split or more advanced logic
    const chunkSize = 1000; // Customize based on your requirements (adjust token length)
    const chunks: { text: string, pageNumber: number }[] = [];
    
    // Split the PDF text into chunks
    let text = pdfData.text;
    let pageNumber = 1; // Page numbers for your chunk text
    
    while (text.length > chunkSize) {
      chunks.push({
        text: text.slice(0, chunkSize),
        pageNumber,
      });
      text = text.slice(chunkSize);
      pageNumber++;
    }
    
    // Push the remaining text as a final chunk
    if (text.length > 0) {
      chunks.push({
        text,
        pageNumber,
      });
    }

    return chunks;
  } catch (error) {
    console.error("❌ Error extracting text from PDF:", error);
    throw new Error("Failed to parse PDF.");
  }
}
