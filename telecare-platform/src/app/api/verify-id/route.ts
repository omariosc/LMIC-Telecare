import { NextResponse } from "next/server";

// Simple OCR simulation - in production, you'd use a service like Google Vision API or Tesseract.js
const extractTextFromImage = async (
  _imageBuffer: Buffer
): Promise<string[]> => {
  // For demo purposes, we'll simulate OCR extraction
  // In a real implementation, you would:
  // 1. Use Tesseract.js for client-side OCR, or
  // 2. Use Google Vision API, AWS Textract, or Azure Computer Vision

  // Simulated extracted names - in production this would be real OCR
  const simulatedNames = [
    "MUHAMMAD",
    "SHAUR",
    "CHOUDHRY",
    "JOHN",
    "SMITH",
    "JANE",
    "DOE",
    "PASSPORT",
    "DRIVING",
    "LICENCE",
  ];

  return simulatedNames;
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert file to buffer
    const imageBuffer = Buffer.from(await image.arrayBuffer());

    // Extract text using OCR
    const extractedNames = await extractTextFromImage(imageBuffer);

    return NextResponse.json({
      success: true,
      extractedNames: extractedNames.filter(
        (name) =>
          name.length > 2 && // Filter out short strings
          !/^(PASSPORT|DRIVING|LICENCE|LICENSE|ID|CARD|UNITED|KINGDOM|BRITAIN|BRITISH)$/i.test(
            name
          ) // Filter out document-related words
      ),
    });
  } catch (error) {
    console.error("ID verification failed:", error);
    return NextResponse.json(
      { error: "Failed to process ID document" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
