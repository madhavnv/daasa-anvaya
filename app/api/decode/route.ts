import { NextResponse } from "next/server";

const CANONICAL_HARIDASA_REGISTRY = [
  { ankita: "ವಿಜಯ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ವಿಜಯ ದಾಸರು", era: "1682–1755 CE", location: "Chikalparvi", genre: "Suladi / Kirthane" },
  { ankita: "ಪುರಂದರ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಪುರಂದರ ದಾಸರು", era: "1484–1564 CE", location: "Hampi / Pandharpur", genre: "Kirthane / Suladi / Mundige" },
  { ankita: "ಕಾಗಿನೆಲೆಯಾದಿಕೇಶವ", composer: "ಶ್ರೀ ಕನಕ ದಾಸರು", era: "1509–1609 CE", location: "Kaginele", genre: "Philosophy / Kirthane" },
  { ankita: "ಗೋಪಾಲ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಗೋಪಾಲ ದಾಸರು", era: "1721–1762 CE", location: "Mosarakallu", genre: "Suladi / Ugabhoga" },
  { ankita: "ಜಗನ್ನಾಥ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಜಗನ್ನಾಥ ದಾಸರು", era: "1727–1809 CE", location: "Manvi", genre: "Tattwa / Kirthane" },
  { ankita: "ಹಯವದನ", composer: "ಶ್ರೀ ವಾದಿರಾಜ ತೀರ್ಥರು", era: "1480–1600 CE", location: "Sode", genre: "Vadiraja Stotra / Suladi" }
];

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      const rawTextBody = await req.text();
      body = { query: rawTextBody };
    }

    const query = (body?.query || body?.input || body?.text || "").trim();
    const retryAttempt = body?.retryAttempt || 0; // Tracks cycle for incorrect song detection

    if (!query) {
      return NextResponse.json(
        { error: "Query cannot be empty. ದಯವಿಟ್ಟು ಕೃತಿಯ ಪಲ್ಲವಿ ಅಥವಾ ಸಾಲುಗಳನ್ನು ನಮೂದಿಸಿ." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in environment variables." },
        { status: 500 }
      );
    }

    const systemPrompt = `You are "Dāsa Bodhini" (ದಾಸ ಬೋಧಿನಿ), the authoritative academic and theological workstation for Haridasa Sahitya (1263–1983 CE).
The user provided a query or opening phrase: "${query}".
This is retry attempt number: ${retryAttempt}. If retryAttempt > 0, ensure you provide a DIFFERENT or more precise matching composition than standard defaults if the previous match was incorrect.

CRITICAL INSTRUCTIONS FOR COMPLETE LYRICS:
1. You MUST retrieve and output the ENTIRE song composition. Do NOT truncate or summarize stanzas. Include the Pallavi, Anupallavi, and ALL Charanas (or Suladi talas) completely in Kannada text.
2. If the query matches multiple possible songs (e.g., common starting phrases), set "isAmbiguous" to true and provide an array of "matches" with their titles and full query strings so the user can choose. Otherwise, set "isAmbiguous" to false and return the full decoded song object.

Strict Attribution based on Registry:
${JSON.stringify(CANONICAL_HARIDASA_REGISTRY)}

Return ONLY valid JSON matching this exact schema:
{
  "isAmbiguous": boolean,
  "matches": [
    { "title": "string", "composer": "string", "query": "string" }
  ],
  "titleKannada": "string",
  "titleEnglish": "string",
  "composerKannada": "string",
  "composerEnglish": "string",
  "ankitaKannada": "string",
  "ankitaEnglish": "string",
  "historicalContextKannada": "string",
  "historicalContextEnglish": "string",
  "compositionType": "ಕೀರ್ತನೆ / ದೇವರನಾಮ" | "ಸೂಳಾದಿ" | "ಉಗಾಭೋಗ" | "ಮುಂಡಿಗೆ",
  "ragaTradition": "string",
  "talaTradition": "string",
  "bhaktiRasa": "string",
  "comprehensiveSummaryKannada": "string",
  "comprehensiveSummaryEnglish": "string",
  "modernTakeawayKannada": "string",
  "modernTakeawayEnglish": "string",
  "stanzas": [
    {
      "stanzaNumber": 1,
      "stanzaType": "ಪಲ್ಲವಿ" | "ಅನುಪಲ್ಲವಿ" | "ಚರಣ" | "ಧ್ರುವ ತಾಳ" | "ಮಟ್ಟ ತಾಳ" | "ರೂಪಕ ತಾಳ" | "ಝಂಪೆ ತಾಳ" | "ತ್ರಿಪುಟ ತಾಳ" | "ಅಟ್ಟ ತಾಳ" | "ಆದಿ ತಾಳ" | "ಜತೆ",
      "originalTextKannada": "string",
      "originalTextTransliteration": "string",
      "wordByWordBreakdown": [
        {
          "kannadaWord": "string",
          "transliteration": "string",
          "meaningKannada": "string",
          "meaningEnglish": "string"
        }
      ],
      "anvayaKannada": "string",
      "anvayaEnglish": "string",
      "spiritualMeaningKannada": "string",
      "spiritualMeaningEnglish": "string"
    }
  ],
  "metaphorsAndMundige": [
    {
      "allegoryKannada": "string",
      "allegoryEnglish": "string",
      "outerMeaningKannada": "string",
      "outerMeaningEnglish": "string",
      "esotericMeaningKannada": "string",
      "esotericMeaningEnglish": "string"
    }
  ]
}`;

    const MODELS_TO_TRY = ["gemini-2.5-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash"];
    let rawContent: string | null = null;

    for (const model of MODELS_TO_TRY) {
      try {
        let apiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nDecode fully for query: "${query}" (Retry attempt: ${retryAttempt})` }] }],
              generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
            })
          }
        );

        if (apiResponse.ok) {
          const data = await apiResponse.json();
          rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
          if (rawContent) break;
        }
      } catch (err: any) {
        console.warn(`Connection error on ${model}:`, err.message);
      }
    }

    if (!rawContent) {
      return NextResponse.json(
        { error: "ಸರ್ವರ್‌ನಲ್ಲಿ ಹೆಚ್ಚಿನ ಒತ್ತಡವಿದೆ (503 High Demand). ದಯವಿಟ್ಟು 5 ಸೆಕೆಂಡುಗಳ ನಂತರ ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ." },
        { status: 503 }
      );
    }

    let cleanedContent = rawContent.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent.replace(/^```json\s*/i, "");
    } else if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent.replace(/^```\s*/, "");
    }
    if (cleanedContent.endsWith("```")) {
      cleanedContent = cleanedContent.replace(/\s*```$/, "");
    }
    cleanedContent = cleanedContent.trim();

    const parsedResult = JSON.parse(cleanedContent);
    return NextResponse.json(parsedResult);
  } catch (err: any) {
    console.error("Decode Route Exception:", err);
    return NextResponse.json(
      { error: err.message || "ಅನಿರೀಕ್ಷಿತ ದೋಷ ಸಂಭವಿಸಿದೆ. ಸರಿಯಾದ ಕೃತಿಯ ಸಾಲುಗಳನ್ನು ನಮೂದಿಸಿ." },
      { status: 500 }
    );
  }
}