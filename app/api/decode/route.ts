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

    const systemPrompt = `You are an expert bilingual scholar in Haridasa Sahitya and Kannada linguistics.
Analyze the user's input (which may be a title, an excerpt, or a FULL song with Pallavi, Anupallavi, and all Charanas).

CRITICAL INSTRUCTIONS:
1. If the user provides a full song (or an entire composition), you MUST break down and translate EVERY SINGLE STANZA (Pallavi, Anupallavi, and all Charanas). Do NOT truncate, summarize, or stop after the first verse.
2. For each stanza, provide:
   - The original verse lines in Kannada
   - Anvaya in spoken Kannada (natural sentence syntax)
   - Detailed English prose translation
3. Provide a combined vocabulary glossary (Pratipadaartha) across all stanzas for archaic or classical roots.
4. Decode key metaphors and allegories across the whole composition.
5. Provide a 1-sentence practical life takeaway.

Return a strictly valid JSON object matching this schema:
{
  "titleKannada": "Title in Kannada script",
  "titleEnglish": "Title in English/IAST",
  "composerKannada": "Composer in Kannada",
  "composerEnglish": "Composer in English",
  "ankitaKannada": "Mudra in Kannada",
  "ankitaEnglish": "Mudra in English",
  "stanzas": [
    {
      "stanzaType": "ಪಲ್ಲವಿ (Pallavi) / ಅನುಪಲ್ಲವಿ (Anupallavi) / ಚರಣ ೧ (Charana 1) / etc.",
      "originalKannada": "Original lines of this stanza in Kannada",
      "anvayaKannada": "Syntactic prose rearrangement of this stanza in spoken Kannada",
      "anvayaEnglish": "Prose translation and flow of this stanza in clear modern English"
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
  "modernTakeawayKannada": "Life takeaway in Kannada",
  "modernTakeawayEnglish": "Life takeaway in English",
  "youtubeSearchQuery": "Song Title Composer rendition"
}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\nAnalyze this complete Haridasa composition:\n"""\n${query}\n"""`
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
