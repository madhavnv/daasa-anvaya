import { NextRequest, NextResponse } from "next/server";

const MODELS_TO_TRY = [
  "gemini-3.8-flash",
  "gemini-3.8-flash-lite",
  "gemini-2.5-flash"
];

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY environment variable is missing." },
        { status: 500 }
      );
    }

    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Input query is required" }, { status: 400 });
    }

    const systemPrompt = `You are a bilingual authority on Haridasa Sahitya and Kannada linguistics.
Analyze the user's input (Kannada script or English/Kanglish phonetics) and return a strictly valid JSON object matching this structure:
{
  "titleKannada": "Title in Kannada script",
  "titleEnglish": "Title in English/IAST",
  "composerKannada": "Composer in Kannada",
  "composerEnglish": "Composer in English",
  "ankitaKannada": "Mudra in Kannada",
  "ankitaEnglish": "Mudra in English",
  "anvayaKannada": "Syntactic rearrangement in modern spoken Kannada sentence order",
  "anvayaEnglish": "Prose translation and flow in clear modern English",
  "pratipadaartha": [
    {
      "wordKannada": "Word",
      "wordTransliterated": "Transliteration",
      "meaningKannada": "Meaning in modern Kannada",
      "meaningEnglish": "Meaning in English"
    }
  ],
  "metaphorsAndMundige": [
    {
      "motifKannada": "Motif in Kannada",
      "motifEnglish": "Motif in English",
      "innerMeaningKannada": "Allegorical meaning in Kannada",
      "innerMeaningEnglish": "Allegorical meaning in English"
    }
  ],
  "modernTakeawayKannada": "1-sentence life takeaway in Kannada",
  "modernTakeawayEnglish": "1-sentence life takeaway in English",
  "youtubeSearchQuery": "Song Title Composer rendition"
}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\nAnalyze this Haridasa composition:\n"""\n${query}\n"""`
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    };

    let lastError: any = null;

    // Fallback loop through models
    for (const model of MODELS_TO_TRY) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody)
        });

        const data = await res.json();

        if (res.ok) {
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(cleanJson);
            return NextResponse.json(parsed);
          }
        }

        // If 503 (high demand) or 404, capture and cycle to the next model
        console.warn(`Model ${model} returned status ${res.status}:`, data.error?.message);
        lastError = data.error?.message || `Status ${res.status}`;
      } catch (err: any) {
        console.warn(`Fetch error for ${model}:`, err.message);
        lastError = err.message;
      }
    }

    return NextResponse.json(
      { error: `Models currently busy. Last error: ${lastError}` },
      { status: 503 }
    );

  } catch (error: any) {
    console.error("Server Route Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
