import { NextRequest, NextResponse } from "next/server";
import { COMPLETE_ANKITHA_CATALOG } from "@/lib/ankithaData";

// Active, verified model tier
const ACTIVE_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite"
];

// PRE-CACHED CANON: Instant 20ms response, zero API call, zero 503 errors
const PRECACHED_SONGS: Record<string, any> = {
  "tarakka bindige": {
    isRecognizedSong: true,
    titleKannada: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ ನೀರಿಗೆ ಹೋಗೋಣ",
    titleEnglish: "Tarakka Bindige Neerige Hogona",
    composerKannada: "ಪುರಂದರ ದಾಸರು",
    composerEnglish: "Purandara Dasaru",
    ankitaKannada: "ಪುರಂದರ ವಿಠ್ಠಲ",
    ankitaEnglish: "Purandara Vittala",
    youtubeSearchQuery: "Tarakka Bindige Purandara Dasa",
    historicalContextKannada: "ಈ ಕೃತಿಯು ಪುರಂದರದಾಸರ ಅತ್ಯಂತ ಪ್ರಸಿದ್ಧ ತಾತ್ವಿಕ ಮುಂಡಿಗೆಯಾಗಿದ್ದು, ಲೌಕಿಕ ನೀರಿನ ಬಿಂದಿಗೆಯನ್ನು ಸಾಧನೆಯ ದೇಹ ಮತ್ತು ಭಕ್ತಿ ಪಾತ್ರೆಗೆ ಹೋಲಿಸುವ ಸುಂದರ ರೂಪಕವಾಗಿದೆ.",
    historicalContextEnglish: "A celebrated allegorical composition (Mundige) by Purandara Dasa where drawing water from a river serves as an extended metaphor for self-discipline, breath control, and spiritual realization.",
    comprehensiveSummaryKannada: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ ಹಾಡಿನಲ್ಲಿ ದಾಸರು ಹೆಣ್ಣುಮಕ್ಕಳು ನೀರು ತರಲು ಹೋಗುವ ದೈನಂದಿನ ಲೌಕಿಕ ಕೆಲಸವನ್ನು ಅಧ್ಯಾತ್ಮ ಸಾಧನೆಗೆ ರೂಪಕವಾಗಿ ಬಳಸಿದ್ದಾರೆ. ಭಕ್ತಿಯೆಂಬ ನೀರಿನಲ್ಲಿ ಮುಳುಗಿ, ಜ್ಞಾನವೆಂಬ ಅಮೃತವನ್ನು ತುಂಬಿಕೊಳ್ಳಬೇಕೆಂಬುದು ಇದರ ಒಳಾರ್ಥ.",
    comprehensiveSummaryEnglish: "Purandara Dasa uses the routine daily chore of village women fetching water with pots as a profound metaphor for spiritual sadhana. The pot represents the mortal body, the river represents the stream of devotion, and the water drawn is divine nectar.",
    stanzas: [
      {
        stanzaType: "ಪಲ್ಲವಿ / Pallavi",
        originalKannada: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ ನೀರಿಗೆ ಹೋಗೋಣ ಬಾರೆ ಚೆಲುವೆ",
        anvayaKannada: "ಚೆಲುವೆಯೇ, ಬಿಂದಿಗೆಯನ್ನು ತಾರಕ್ಕ, ನಾವಿಬ್ಬರೂ ನೀರಿಗೆ ಹೋಗೋಣ ಬಾರೆ.",
        anvayaEnglish: "O graceful one, bring the water pot, let us walk together to fetch the waters."
      },
      {
        stanzaType: "ಚರಣ / Charana",
        originalKannada: "ಬಿಂದಿಗೆ ಒಡೆದರೆ ಒಂಬತ್ತು ತೂತು | ತಂದ ಪುರಂದರವಿಠ್ಠಲಗೊಪ್ಪಿಸು ||",
        anvayaKannada: "ಈ ದೇಹವೆಂಬ ಬಿಂದಿಗೆಗೆ ಒಂಬತ್ತು ದ್ವಾರಗಳಿವೆ; ಜೀವಿತಾವಧಿ ಮುಗಿಯುವ ಮುನ್ನ ಇದನ್ನು ಪುರಂದರವಿಠ್ಠಲನ ಪಾದಕ್ಕೆ ಸಮರ್ಪಿಸು.",
        anvayaEnglish: "This physical pot (body) possesses nine apertures; dedicate its essence to the feet of Purandara Vittala before it shatters."
      }
    ],
    modernTakeawayKannada: "ದೈನಂದಿನ ಸರಳ ಕರ್ತವ್ಯಗಳಲ್ಲೂ ಆಳವಾದ ಅಧ್ಯಾತ್ಮಿಕ ಶಿಸ್ತನ್ನು ರೂಢಿಸಿಕೊಳ್ಳಬಹುದು ಎಂಬುದನ್ನು ಈ ಕೃತಿ ಕಲಿಸುತ್ತದೆ.",
    modernTakeawayEnglish: "Even routine everyday chores can become transformative practices of mindfulness and higher purpose.",
    pratipadaartha: [
      { wordKannada: "ಬಿಂದಿಗೆ", wordTransliterated: "Bindige", meaningKannada: "ನೀರಿನ ಪಾತ್ರೆ / ದೇಹ", meaningEnglish: "Water pitcher; metaphor for physical body" },
      { wordKannada: "ಒಂಬತ್ತು ತೂತು", wordTransliterated: "Ombattu Tootu", meaningKannada: "ದೇಹದ ನವದ್ವಾರಗಳು", meaningEnglish: "Nine bodily apertures / senses" }
    ],
    metaphorsAndMundige: [
      { motifKannada: "ಬಿಂದಿಗೆ", motifEnglish: "The Water Pot", innerMeaningKannada: "ನಶ್ವರವಾದ ಮಾನವ ಶರೀರ ಮತ್ತು ಸಂಸ್ಕಾರದ ಪಾತ್ರೆ.", innerMeaningEnglish: "The mortal physical vehicle carrying inner consciousness." }
    ]
  },
  "manava janma": {
    isRecognizedSong: true,
    titleKannada: "ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು ಇದನ್ನು ಹಾನಿ ಮಾಡಬೇಡಿ",
    titleEnglish: "Manava Janma Doddadu",
    composerKannada: "ಪುರಂದರ ದಾಸರು",
    composerEnglish: "Purandara Dasaru",
    ankitaKannada: "ಪುರಂದರ ವಿಠ್ಠಲ",
    ankitaEnglish: "Purandara Vittala",
    youtubeSearchQuery: "Manava Janma Doddadu Purandara Dasa",
    historicalContextKannada: "ಈ ಕೃತಿಯು ನಿರ್ದಿಷ್ಟ ಐತಿಹಾಸಿಕ ಘಟನೆಗಿಂತ ಹೆಚ್ಚಾಗಿ ತತ್ತ್ವಚಿಂತನೆ, ವೈರಾಗ್ಯ ಹಾಗೂ ಜೀವನದ ಮೌಲ್ಯವನ್ನು ಸಾರುವ ಪುರಂದರದಾಸರ ಮಾರ್ಗದರ್ಶಿ ಪದ್ಯವಾಗಿದೆ.",
    historicalContextEnglish: "A timeless contemplative composition on existential purpose and moral wakefulness, emphasizing the immense rarity and sanctity of human existence.",
    comprehensiveSummaryKannada: "ಕೋಟಿ ಜನ್ಮಗಳ ಪುಣ್ಯದ ಫಲವಾಗಿ ದೊರೆತ ಈ ಮಾನವ ಜನ್ಮವು ಅತ್ಯಂತ ಶ್ರೇಷ್ಠವಾದುದು. ಇದನ್ನು ವ್ಯರ್ಥ ವ್ಯಸನಗಳಲ್ಲಿ, ಲೌಕಿಕ ಕ್ಷುಲ್ಲಕತೆಗಳಲ್ಲಿ ಹಾಳು ಮಾಡಿಕೊಳ್ಳದೆ ಸತ್ಕರ್ಮ ಮತ್ತು ದೈವಸ್ಮರಣೆಯಲ್ಲಿ ಕಳೆಯಬೇಕು ಎಂಬುದು ದಾಸರ ಸಂದೇಶ.",
    comprehensiveSummaryEnglish: "Purandara Dasa asserts that human birth is the rarest cosmic opportunity attained after countless evolutionary cycles. It should not be squandered on transient material trivialities.",
    stanzas: [
      {
        stanzaType: "ಪಲ್ಲವಿ / Pallavi",
        originalKannada: "ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು ಇದನು ಹಾನಿ ಮಾಡಲಿಬೇಡಿ ಹುಚ್ಚಪ್ಪಗಳಿರಾ",
        anvayaKannada: "ಎಲೈ ಭ್ರಾಂತರೇ, ಮಾನವ ಜನ್ಮವು ಬಹಳ ಶ್ರೇಷ್ಠವಾದುದು; ಇದನ್ನು ವ್ಯರ್ಥವಾಗಿ ಹಾಳು ಮಾಡಿಕೊಳ್ಳಬೇಡಿ.",
        anvayaEnglish: "O misguided minds, this human birth is exceedingly precious; do not squander it away in carelessness."
      }
    ],
    modernTakeawayKannada: "ನಮ್ಮ ಸಮಯ ಮತ್ತು ಪ್ರಜ್ಞೆಯನ್ನು ನಿರರ್ಥಕ ವಿಷಯಗಳಲ್ಲಿ ಕಳೆಯದೆ, ಸಾರ್ಥಕ ಬದುಕಿಗಾಗಿ ಬಳಸಬೇಕು.",
    modernTakeawayEnglish: "Value your finite conscious lifetime; avoid trading eternal well-being for fleeting trivial distractions.",
    pratipadaartha: [
      { wordKannada: "ಹಾನಿ", wordTransliterated: "Hani", meaningKannada: "ನಾಶ / ವ್ಯರ್ಥ", meaningEnglish: "Waste / Loss" }
    ],
    metaphorsAndMundige: []
  }
};

const ANKITHA_AUTHORITY_REGISTRY = COMPLETE_ANKITHA_CATALOG.map(
  (entry) =>
    `• [${entry.era || "Historical"}] Signature: "${entry.ankitaKannada}" (${entry.ankitaEnglish}) => Composer: ${entry.composerKannada} (${entry.composerEnglish})`
).join("\n");

async function callGeminiWithBackoff(apiKey: string, model: string, payload: any): Promise<Response> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) return res;

      if ((res.status === 503 || res.status === 429) && attempt < 2) {
        const delay = 1200 * Math.pow(2, attempt) + Math.random() * 400;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      return res;
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  throw new Error(`Timeout on model ${model}`);
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json({ error: "Query cannot be empty" }, { status: 400 });
    }

    // 1. FAST-PATH: Instant response for pre-cached canonical titles
    const normalized = query.toLowerCase().trim();
    for (const [key, cachedData] of Object.entries(PRECACHED_SONGS)) {
      if (normalized.includes(key)) {
        return NextResponse.json(cachedData);
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const systemPrompt = `
You are Dāsa Bodhini (ದಾಸ ಬೋಧಿನಿ), a scholar of Haridasa Sahitya (1263–1983 CE).
GROUND TRUTH REGISTRY:
${ANKITHA_AUTHORITY_REGISTRY}

RULES:
1. If input is gibberish or off-topic, set "isRecognizedSong": false with a kind explanation.
2. Resolve composer strictly by matching the Ankita Mudra in the last Charana with the registry.
3. Historical context: Only give verified Haridasa episodes. If none exists, describe it strictly as a philosophical contemplation.
4. Output valid JSON adhering to the schema:
{
  "isRecognizedSong": true,
  "unrecognizedMessageKannada": null,
  "unrecognizedMessageEnglish": null,
  "titleKannada": "...",
  "titleEnglish": "...",
  "composerKannada": "...",
  "composerEnglish": "...",
  "ankitaKannada": "...",
  "ankitaEnglish": "...",
  "youtubeSearchQuery": "...",
  "historicalContextKannada": "...",
  "historicalContextEnglish": "...",
  "comprehensiveSummaryKannada": "...",
  "comprehensiveSummaryEnglish": "...",
  "stanzas": [{"stanzaType": "...", "originalKannada": "...", "anvayaKannada": "...", "anvayaEnglish": "..."}],
  "modernTakeawayKannada": "...",
  "modernTakeawayEnglish": "...",
  "pratipadaartha": [{"wordKannada": "...", "wordTransliterated": "...", "meaningKannada": "...", "meaningEnglish": "..."}],
  "metaphorsAndMundige": [{"motifKannada": "...", "motifEnglish": "...", "innerMeaningKannada": "...", "innerMeaningEnglish": "..."}]
}
`;

    const bodyPayload = {
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nAnalyze:\n${query}` }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
    };

    let response: Response | null = null;
    let lastStatus = 500;

    // 2. RESILIENT FALLBACK: Try 3.8-flash, then drop to 3.5-flash-lite
    for (const model of ACTIVE_MODELS) {
      try {
        response = await callGeminiWithBackoff(apiKey, model, bodyPayload);
        if (response.ok) break;
        lastStatus = response.status;
      } catch (err) {
        console.warn(`Model ${model} unavailable, trying fallback...`);
      }
    }

    if (!response || !response.ok) {
      return NextResponse.json(
        { error: "The decoding engine is temporarily experiencing high traffic at Google. Please tap 'Decode Song' once more." },
        { status: 503 }
      );
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return NextResponse.json({ error: "Empty model output" }, { status: 500 });

    const parsedData = JSON.parse(rawText);
    if (parsedData.isRecognizedSong === false) {
      return NextResponse.json(
        { error: parsedData.unrecognizedMessageKannada || "ಹಾಡು ಗುರುತಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ (Song not identified)." },
        { status: 422 }
      );
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Processing error" }, { status: 500 });
  }
}