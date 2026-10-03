import { NextRequest, NextResponse } from "next/server";
import { COMPLETE_ANKITHA_CATALOG } from "@/lib/ankithaData";

const ANKITHA_AUTHORITY_REGISTRY = COMPLETE_ANKITHA_CATALOG.map(
  (entry) =>
    `• [${entry.era || "Historical"}] Signature: "${entry.ankitaKannada}" (${entry.ankitaEnglish}) => Composer: ${entry.composerKannada} (${entry.composerEnglish}) [Place: ${entry.location || "Karnataka"}]`
).join("\n");

const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.8-pro",
  "gemini-3-flash",
];

async function callGeminiWithRetry(
  apiKey: string,
  model: string,
  bodyPayload: any,
  retries = 2,
  delayMs = 1200
): Promise<Response> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      if (response.ok) return response;

      if ((response.status === 503 || response.status === 429) && attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
        continue;
      }

      return response;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }

  throw new Error(`Exhausted retries for model: ${model}`);
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json(
        { error: "Query cannot be empty" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY environment variable is not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = `
You are Dāsa Bodhini (ದಾಸ ಬೋಧಿನಿ), a digital scholar of Haridasa Sahitya (spanning the canonical 1263–1983 CE tradition).

PRIMARY GROUND-TRUTH ANKITHA REGISTRY (CHRONOLOGICAL 1263–1983 CE):
Use this verified registry to identify composers, their exact signatures, and their documented periods:
${ANKITHA_AUTHORITY_REGISTRY}

CRITICAL RULES FOR ACCURACY:

1. RELEVANCE & SONG VALIDATION:
   - First evaluate if the user's input is a Haridasa composition, Kannada devaranama, stotra, or related devotional lyrics/query.
   - If the input is random gibberish, conversational small talk (e.g., "hi", "how are you"), off-topic questions, code, or unrelated text:
     Set "isRecognizedSong": false.
     Set "unrecognizedMessageKannada": "ಈ ಸಾಲುಗಳು ಹರಿದಾಸ ಸಾಹಿತ್ಯ ಅಥವಾ ಭಕ್ತಿ ಕೃತಿಯಂತೆ ಕಂಡುಬರುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಹಾಡಿನ ಹೆಸರು ಅಥವಾ ಸಾಹಿತ್ಯವನ್ನು ಸರಿಯಾಗಿ ನಮೂದಿಸಿ."
     Set "unrecognizedMessageEnglish": "This input does not match any recognized Haridasa pada or devotional composition. Please enter a valid song title or lyric."
     Set all other fields to null or empty arrays.
   - If it is a recognized song or legitimate devotional verse, set "isRecognizedSong": true.

2. ANKITA SIGNATURE OVERRIDES EVERYTHING:
   - Identify the composer strictly by searching for the unique Ankita Mudra embedded in the song's final stanza (Charana).
   - If the signature contains "ಗುರು ಪುರಂದರ ವಿಠ್ಠಲ", the author is Madhwapati Dasa (son of Purandara Dasa), NEVER Purandara Dasa.
   - If the signature contains "ಶ್ರೀನಿಧಿ ವಿಠ್ಠಲ", the author is Srinivasa Dasa, NOT Gopala Dasa.
   - If the signature contains "ರಂಗವಿಠ್ಠಲ", the author is Sri Sripadarajaru.
   - If the signature contains "ಹಯವದನ", the author is Sri Vadiraja Teertharu.
   - If the signature contains "ಕಾಗಿನೆಲೆಯಾದಿಕೇಶವ" or "ಬಾದಾದಿಕೇಶವ", the author is Kanaka Dasaru.
   - If no explicit matching Ankita is present in the input text, mark composer as "ಪಾರಂಪರಿಕ / ಅಂಕಿತ ಲಭ್ಯವಿಲ್ಲ (Traditional / Ankita not provided)". NEVER default to Purandara Dasa.

3. HISTORICAL CONTEXT (AITHIHYA) INTEGRITY:
   - NEVER fabricate artificial or imaginary historical events or backstories.
   - Provide a specific historical legend or life event ONLY if it is an authentic canonical episode recorded in Haridasa Charitre (e.g., Kanaka Dasa at Udupi Kanakana Kindi; Purandara Dasa's renunciation of wealth; Gopala Dasa transferring longevity to Jagannatha Dasa).
   - If the composition is a philosophical reflection, spiritual instruction, or general prayer with no documented historical incident, state:
     "ಈ ಕೃತಿಯು ನಿರ್ದಿಷ್ಟ ಐತಿಹಾಸಿಕ ಘಟನೆಗಿಂತ ಹೆಚ್ಚಾಗಿ ತತ್ತ್ವಚಿಂತನೆ ಮತ್ತು ಭಕ್ತಿ ಸಮರ್ಪಣೆಯಾಗಿದೆ (This composition is a meditative and philosophical contemplation rather than tied to an isolated historical incident)."

4. SYNTAX REORDERING (ಅನ್ವಯ / ANVAYA):
   - Reorder metric poetry into natural, spoken Kannada conversational syntax followed by fluent English prose.

5. MUNDIGE & METAPHORS:
   - Decode allegorical motifs (e.g., water pots, butter churning, oil presses, weaver looms) to reveal their inner spiritual meaning.

Respond strictly with a valid JSON object matching this schema:
{
  "isRecognizedSong": true,
  "unrecognizedMessageKannada": null,
  "unrecognizedMessageEnglish": null,
  "titleKannada": "Song title in Kannada",
  "titleEnglish": "Song title in English transliteration",
  "composerKannada": "Composer in Kannada",
  "composerEnglish": "Composer in English",
  "ankitaKannada": "Mudra in Kannada",
  "ankitaEnglish": "Mudra in English",
  "youtubeSearchQuery": "Optimized YouTube search query for this song",
  "historicalContextKannada": "Factual context or statement of philosophical contemplation in Kannada",
  "historicalContextEnglish": "Factual context or statement of philosophical contemplation in English",
  "comprehensiveSummaryKannada": "Complete song summary in Kannada",
  "comprehensiveSummaryEnglish": "Complete song summary in English",
  "stanzas": [
    {
      "stanzaType": "ಪಲ್ಲವಿ / Pallavi or ಅನುಪಲ್ಲವಿ / Anupallavi or ಚರಣ / Charana",
      "originalKannada": "Original lines in Kannada",
      "anvayaKannada": "Grammatically reordered spoken Kannada sentence",
      "anvayaEnglish": "Meaning in lucid English prose"
    }
  ],
  "modernTakeawayKannada": "Practical life reflection in Kannada",
  "modernTakeawayEnglish": "Practical life reflection in English",
  "pratipadaartha": [
    {
      "wordKannada": "Word in Kannada",
      "wordTransliterated": "Transliteration",
      "meaningKannada": "Kannada meaning",
      "meaningEnglish": "English meaning"
    }
  ],
  "metaphorsAndMundige": [
    {
      "motifKannada": "Symbol in Kannada",
      "motifEnglish": "Symbol in English",
      "innerMeaningKannada": "Esoteric meaning in Kannada",
      "innerMeaningEnglish": "Esoteric meaning in English"
    }
  ]
}
`;

    const bodyPayload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemPrompt}\n\nAnalyze, decode, and extract syntax for the following composition or query:\n\n${query}`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    };

    let response: Response | null = null;
    let lastErrorText = "";

    for (const model of MODELS) {
      response = await callGeminiWithRetry(apiKey, model, bodyPayload, 1, 1000);

      if (response.ok) {
        break;
      }

      lastErrorText = await response.text();
      console.warn(`Model ${model} returned error status ${response.status}. Trying next tier...`);
    }

    if (!response || !response.ok) {
      console.error("All model tiers failed:", lastErrorText);
      return NextResponse.json(
        { error: "The decoding engine is temporarily experiencing high traffic. Please retry in a few moments." },
        { status: 503 }
      );
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json(
        { error: "Model returned an empty response" },
        { status: 500 }
      );
    }

    const parsedData = JSON.parse(rawText);

    // Intercept unrecognizable input and return HTTP 422
    if (parsedData.isRecognizedSong === false) {
      const message =
        parsedData.unrecognizedMessageKannada ||
        parsedData.unrecognizedMessageEnglish ||
        "ಹಾಡು ಗುರುತಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಸರಿಯಾದ ಸಾಹಿತ್ಯವನ್ನು ನಮೂದಿಸಿ (Song not recognized).";

      return NextResponse.json({ error: message }, { status: 422 });
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Decode route error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during processing" },
      { status: 500 }
    );
  }
}