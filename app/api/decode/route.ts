import { NextRequest, NextResponse } from "next/server";

// Valid active models
const MODELS_TO_TRY = [
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3.8-flash"
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: Safely extract JSON substring even if model adds leading/trailing commentary
function extractCleanJson(text: string): string {
  let cleaned = text.trim();
  // Strip markdown code fences if present
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
}

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
Analyze the user's input (a song title, verse, or full song lyrics).

CRITICAL OUTPUT RULES:
- Output MUST be strictly valid JSON and NOTHING ELSE.
- Do NOT include any intro text, conversational remarks, or text outside the JSON object.
- If full lyrics are provided, break down every stanza (Pallavi, Anupallavi, and all Charanas) in the "stanzas" array.

JSON Structure:
{
  "titleKannada": "Title in Kannada script",
  "titleEnglish": "Title in English/IAST",
  "composerKannada": "Composer in Kannada",
  "composerEnglish": "Composer in English",
  "ankitaKannada": "Mudra in Kannada",
  "ankitaEnglish": "Mudra in English",
  "historicalContextKannada": "Historical context/legend in Kannada",
  "historicalContextEnglish": "Historical context/legend in English",
  "comprehensiveSummaryKannada": "Philosophical summary in Kannada",
  "comprehensiveSummaryEnglish": "Philosophical summary in English",
  "stanzas": [
    {
      "stanzaType": "Stanza title (e.g. Pallavi, Charana 1)",
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
              text: `${systemPrompt}\n\nAnalyze this Haridasa composition query:\n"""\n${query}\n"""`
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
            try {
              const cleanJson = extractCleanJson(rawText);
              const parsed = JSON.parse(cleanJson);
              return NextResponse.json(parsed);
            } catch (jsonErr: any) {
              console.warn(`JSON parse error on model ${model}:`, jsonErr.message);
              // Continue to next model if parsing failed
              lastError = `JSON format error: ${jsonErr.message}`;
              continue;
            }
          }
        }

        console.warn(`Model ${model} returned status ${res.status}:`, data.error?.message);
        lastError = data.error?.message || `Status ${res.status}`;

        if (res.status === 503) {
          await sleep(600);
        }
      } catch (fetchErr: any) {
        console.warn(`Fetch exception for ${model}:`, fetchErr.message);
        lastError = fetchErr.message;
      }
    }

    return NextResponse.json(
      { error: `Models busy or formatting error. Last issue: ${lastError}` },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("Server Route Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
