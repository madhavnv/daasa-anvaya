import { NextRequest, NextResponse } from "next/server";

const MODELS_TO_TRY = [
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash-lite",
  "gemini-3.8-flash"
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

    const systemPrompt = `You are a distinguished bilingual scholar in Haridasa Sahitya, Kannada linguistics, and Vijayanagara/Kalyana-Karnataka history.
Analyze the user's input (a title, an excerpt, or full song lyrics).

CRITICAL REQUIREMENTS:
1. Provide the traditional HISTORICAL CONTEXT & BACKGROUND (ಐತಿಹ್ಯ / ಹಿನ್ನೆಲೆ): When, where, and in what life situation or emotional crisis was this composition composed? (e.g. Purandara Dasa renouncing wealth in Hampi, Kanakadasa outside the Udupi temple, Vadiraja Tirtha at Sode, etc.). If exact historical date is unknown, provide the accepted traditional lore/mutt sampradaya narrative.
2. Provide a COMPREHENSIVE PHILOSOPHICAL SUMMARY: A rich, multi-sentence executive summary explaining the central thesis of the song in both Kannada and English.
3. BREAK DOWN EVERY STANZA (Pallavi, Anupallavi, and all Charanas) with original Kannada, modern spoken Kannada sentence syntax (Anvaya), and fluent English translation.
4. Extract vocabulary (Pratipadaartha) and explain allegories/Mundige.
5. Provide a practical life lesson for modern professionals.

Return a strictly valid JSON object matching this schema:
{
  "titleKannada": "Title in Kannada script",
  "titleEnglish": "Title in English/IAST",
  "composerKannada": "Composer in Kannada",
  "composerEnglish": "Composer in English",
  "ankitaKannada": "Mudra in Kannada",
  "ankitaEnglish": "Mudra in English",
  "historicalContextKannada": "Detailed historical context, setting, and legend behind this composition in Kannada",
  "historicalContextEnglish": "Detailed historical context, setting, and legend behind this composition in English",
  "comprehensiveSummaryKannada": "Rich philosophical and devotional summary of the song in Kannada",
  "comprehensiveSummaryEnglish": "Rich philosophical and devotional summary of the song in English",
  "stanzas": [
    {
      "stanzaType": "ಪಲ್ಲವಿ (Pallavi) / ಅನುಪಲ್ಲವಿ (Anupallavi) / ಚರಣ ೧ (Charana 1) / etc.",
      "originalKannada": "Original lines in Kannada",
      "anvayaKannada": "Modern Kannada sentence syntax",
      "anvayaEnglish": "Modern English prose translation"
    }
  ],
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
  "modernTakeawayKannada": "Life reflection in Kannada",
  "modernTakeawayEnglish": "Life reflection in English",
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

        console.warn(`Model ${model} returned status ${res.status}:`, data.error?.message);
        lastError = data.error?.message || `Status ${res.status}`;

        if (res.status === 503) {
          await sleep(600);
        }
      } catch (err: any) {
        console.warn(`Fetch exception for ${model}:`, err.message);
        lastError = err.message;
      }
    }

    return NextResponse.json(
      { error: `Models currently busy. Last message: ${lastError}` },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("Server Route Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
