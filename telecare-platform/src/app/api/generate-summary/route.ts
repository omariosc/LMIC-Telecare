import { NextResponse } from "next/server";

// Function to generate summary using Ollama API
async function generateSummaryWithOllama(
  caseData: any
): Promise<string | null> {
  try {
    const prompt = `Summarize this medical case in 100 words or less. Focus on key symptoms, patient demographics, and urgency. Be concise and professional. Do not include any thinking process or explanations.

Case Title: ${caseData.title}
Description: ${caseData.description}
Patient Age: ${caseData.patientAge || "Not specified"}
Gender: ${caseData.patientGender || "Not specified"}
Urgency: ${caseData.urgency}
Specialty: ${caseData.specialty}
${caseData.vitalSigns ? `Vital Signs: ${JSON.stringify(caseData.vitalSigns)}` : ""}
${caseData.testResults?.length > 0 ? `Test Results: ${caseData.testResults.map((t: any) => `${t.testName}: ${t.result}`).join(", ")}` : ""}

Summary:`;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen2.5:0.5b",
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.9,
          max_tokens: 150,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Ollama API request failed");
    }

    const data = await response.json();
    return data.response.trim();
  } catch (error) {
    console.error("Ollama API error:", error);
    return null;
  }
}

// Function to generate summary using Gemini API as fallback
async function generateSummaryWithGemini(
  caseData: any
): Promise<string | null> {
  try {
    const prompt = `Summarize this medical case in 100 words or less. Focus on key symptoms, patient demographics, and urgency. Be concise and professional.

Case Title: ${caseData.title}
Description: ${caseData.description}
Patient Age: ${caseData.patientAge || "Not specified"}
Gender: ${caseData.patientGender || "Not specified"}
Urgency: ${caseData.urgency}
Specialty: ${caseData.specialty}
${caseData.vitalSigns ? `Vital Signs: ${JSON.stringify(caseData.vitalSigns)}` : ""}
${caseData.testResults?.length > 0 ? `Test Results: ${caseData.testResults.map((t: any) => `${t.testName}: ${t.result}`).join(", ")}` : ""}`;

    // Note: You need to add your Gemini API key to environment variables
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 1,
            topP: 0.9,
            maxOutputTokens: 150,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Gemini API request failed");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("Gemini API error:", error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const caseData = await req.json();

    // Try Ollama first
    let summary = await generateSummaryWithOllama(caseData);

    // If Ollama fails, try Gemini
    if (!summary) {
      summary = await generateSummaryWithGemini(caseData);
    }

    // If both fail, return a default summary
    if (!summary) {
      summary = `${caseData.urgency.toUpperCase()} priority ${caseData.specialty} case. Patient: ${caseData.patientAge || "Unknown age"} ${caseData.patientGender || ""}. Main issue: ${caseData.title}. ${caseData.vitalSigns ? "Vital signs recorded. " : ""}${caseData.testResults?.length > 0 ? `${caseData.testResults.length} test results available.` : ""} Requires specialist consultation.`;
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summary generation failed:", error);
    return NextResponse.json(
      {
        error: "Failed to generate summary",
        summary: "Unable to generate AI summary at this time.",
      },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
