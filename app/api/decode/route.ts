import { NextResponse } from "next/server";

const CANONICAL_HARIDASA_REGISTRY = [
  { ankita: "ವಿಜಯ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ವಿಜಯ ದಾಸರು", era: "1682–1755 CE", location: "Chikalparvi", genre: "Suladi / Kirthane" },
  { ankita: "ಪುರಂದರ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಪುರಂದರ ದಾಸರು", era: "1484–1564 CE", location: "Hampi / Pandharpur", genre: "Kirthane / Suladi / Mundige" },
  { ankita: "ಕಾಗಿನೆಲೆಯಾದಿಕೇಶವ", composer: "ಶ್ರೀ ಕನಕ ದಾಸರು", era: "1509–1609 CE", location: "Kaginele", genre: "Philosophy / Kirthane" },
  { ankita: "ಗೋಪಾಲ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಗೋಪಾಲ ದಾಸರು", era: "1721–1762 CE", location: "Mosarakallu", genre: "Suladi / Ugabhoga" },
  { ankita: "ಜಗನ್ನಾಥ ವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಜಗನ್ನಾಥ ದಾಸರು", era: "1727–1809 CE", location: "Manvi", genre: "Tattwa / Kirthane" },
  { ankita: "ಹಯವದನ", composer: "ಶ್ರೀ ವಾದಿರಾಜ ತೀರ್ಥರು", era: "1480–1600 CE", location: "Sode", genre: "Vadiraja Stotra / Suladi" },
  { ankita: "ಶ್ರೀವ್ಯಾಸವಿಠ್ಠಲ", composer: "ಶ್ರೀ ವ್ಯಾಸರಾಜ ತೀರ್ಥರು", era: "1460–1539 CE", location: "Hampi", genre: "Vyasaraya Kirthane" },
  { ankita: "ಶ್ರೀರಂಗವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಶ್ರೀಪಾದರಾಜರು", era: "1422–1480 CE", location: "Mulbagal", genre: "Ugabhoga / Kirthane" },
  { ankita: "ಪ್ರಾಣೇಶವಿಠ್ಠಲ", composer: "ಶ್ರೀ ಪ್ರಾಣೇಶ ದಾಸರು", era: "1744–1823 CE", location: "Lingasugur", genre: "Suladi / Devaranama" }
];

const PRECACHED_MASTERPIECES: Record<string, any> = {
  durga: {
    titleKannada: "ಶ್ರೀ ದುರ್ಗಾ ಸೂಳಾದಿ",
    titleEnglish: "Sri Durga Suladi",
    composerKannada: "ಶ್ರೀ ವಿಜಯ ದಾಸರು",
    composerEnglish: "Sri Vijaya Dasaru (1682–1755 CE)",
    ankitaKannada: "ವಿಜಯ ವಿಠ್ಠಲ",
    ankitaEnglish: "Vijaya Vittala",
    historicalContextKannada: "ಶ್ರೀ ವಿಜಯದಾಸರ ಪರಮ ಪವಿತ್ರ ಕೃತಿ. ದುರ್ಗಾಂತರ್ಗತ ಶ್ರೀಹರಿಯನ್ನು ಹಾಗೂ ಪ್ರಕೃತಿ ಅಭಿಮಾನಿ ದುರ್ಗಾದೇವಿಯನ್ನು ಧ್ರುವ, ಮಟ್ಟ, ತ್ರಿವಿಡಿ, ಅಟ್ಟ, ಆದಿ, ಜತೆ ಸಪ್ತತಾಳಗಳಲ್ಲಿ ಸ್ತುತಿಸಿದ ಶ್ರೇಷ್ಠ ಸೂಳಾದಿ.",
    historicalContextEnglish: "Composed exclusively by Sri Vijaya Dasa (Ankita: Vijaya Vittala). Veneration of the Supreme Lord Sri Hari indwelling Goddess Durga across traditional Suladi talas.",
    compositionType: "ಸೂಳಾದಿ",
    ragaTradition: "ಸಂಪ್ರದಾಯ ಸೂಳಾದಿ ರಾಗಮಾಲಿಕೆ",
    talaTradition: "ಧ್ರುವ ತಾಳಾದಿ ಸಪ್ತತಾಳ",
    bhaktiRasa: "ದೈವಿಕ ಶಕ್ತಿ ಸ್ತುತಿ & ಅಭಯ ಭಕ್ತಿ",
    comprehensiveSummaryKannada: "ವಿಜಯದಾಸರು ಜಗಜ್ಜನನಿಯಾದ ದುರ್ಗಾದೇವಿಯ ಅಪಾರ ಮಹಿಮೆಯನ್ನು ಸ್ತುತಿಸುತ್ತಾ, ಆಕೆಯ ಅಂತರ್ಗತನಾದ ಶ್ರೀ ವಿಜಯವಿಠ್ಠಲನ ಚರಣಗಳಲ್ಲಿ ಶರಣಾಗತಿಯನ್ನು ಬೇಡುತ್ತಾರೆ.",
    comprehensiveSummaryEnglish: "A celebrated Suladi praising cosmic mother Durga as the manifestation of divine will, seeking shelter at the feet of Vijaya Vittala.",
    modernTakeawayKannada: "ಮನಸ್ಸಿನ ಆತಂಕ, ದುಷ್ಟ ಆಲೋಚನೆಗಳು ಹಾಗೂ ಜೀವನದ ಅನಿಶ್ಚಿತತೆಯನ್ನು ಗೆಲ್ಲಲು ನಿಷ್ಕಪಟ ಭಕ್ತಿ ಹಾಗೂ ದೈವಶಕ್ತಿಯಲ್ಲಿ ದೃಢ ನಂಬಿಕೆ ಇಡಬೇಕು.",
    modernTakeawayEnglish: "Cultivates profound mental composure and inner fearlessness by entrusting anxieties to the supreme divine presence.",
    stanzas: [
      {
        stanzaNumber: 1,
        stanzaType: "ಧ್ರುವ ತಾಳ",
        originalTextKannada: "ದುರ್ಗಾ ದುರ್ಗೆಯೆ ಮಹಾದುಷ್ಟಜನ ಸಂಹಾರೆ\nದುರ್ಗಾಂತರ್ಗತ ದುರ್ಗೆ ದುರ್ಲಭೆ ಸುಲಭೆ\nದುರ್ಗಮವಾಗಿದೆ ನಿನ್ನ ಮಹಿಮೆ ಬೊಮ್ಮ\nಭರ್ಗಾದಿಗಳಿಗೆಲ್ಲ ಗುಣಿಸಿದರೊ\nಸ್ವರ್ಗಭೂಮಿ ಪಾತಾಳ ಸಮಸ್ತ ವ್ಯಾಪುತ ದೇವಿ\nವರ್ಗಕ್ಕೆ ಮೀರಿದ ಬಲುಸುಂದರೀ\nಸ್ವರ್ಗಂಗಾಜನಕ ನಮ್ಮ ವಿಜಯವಿಠ್ಠಲನಂಘ್ರಿ\nದುರ್ಗಾಶ್ರಯಮಾಡಿ ಬದುಕುವಂತೆ ಮಾಡು",
        originalTextTransliteration: "Durgaa durgeye mahaadushtajana samhaare\ndurgaantargata durge durlabhe sulabhe\ndurgamavaagide ninna mahime bomma\nbhargaadigaligella gunisidaro\nswargabhoomi paataala samasta vyaaputa devi\nvargakke meerida balusundaree\nswargangaajanaka namma vijayavitthalanamghri\ndurgaashrayamaadi badukuvante maadu",
        wordByWordBreakdown: [
          { kannadaWord: "ದುರ್ಗಾ ದುರ್ಗೆಯೆ", transliteration: "durgaa durgeye", meaningKannada: "ದುರ್ಗತಿಗಳನ್ನು ನಾಶಮಾಡುವ ತಾಯಿಯೇ", meaningEnglish: "O dispeller of all adversities" },
          { kannadaWord: "ದುರ್ಗಾಂತರ್ಗತ", transliteration: "durgaantargata", meaningKannada: "ದುರ್ಗಾದೇವಿಯ ಒಳಗೆ ಅಂತರ್ಯಾಮಿಯಾಗಿ ನೆಲೆಸಿರುವ ಪರಮಾತ್ಮ", meaningEnglish: "The Supreme Lord indwelling Durga" },
          { kannadaWord: "ದುರ್ಲಭೆ ಸುಲಭೆ", transliteration: "durlabhe sulabhe", meaningKannada: "ಅಭಕ್ತರಿಗೆ ದುರ್ಲಭಳು, ಭಕ್ತರಿಗೆ ಅತಿ ಸುಲಭಳು", meaningEnglish: "Unattainable to the arrogant, easily accessible to the devoted" }
        ],
        anvayaKannada: "ಮಹಾ ದುಷ್ಟಜನರನ್ನು ಸಂಹರಿಸುವ ದುರ್ಗಾದೇವಿಯೇ! ದುರ್ಗಾಂತರ್ಗತಳಾಗಿರುವವಳೇ, ಅಭಕ್ತರಿಗೆ ದುರ್ಲಭಳೂ ಭಕ್ತರಿಗೆ ಸುಲಭಳೂ ಆದವಳೇ! ನಿನ್ನ ಮಹಿಮೆಯು ಬ್ರಹ್ಮ, ರುದ್ರಾದಿಗಳಿಗೂ ಅರಿಯಲು ದುರ್ಗಮವಾಗಿದೆ.",
        anvayaEnglish: "O Durga, destroyer of malignant wickedness! Indwelling divine presence, unattainable to the egoistic yet easily reached by true devotees.",
        spiritualMeaningKannada: "ದುರ್ಗಾ ದೇವಿಯು ಪ್ರಕೃತಿ ಅಭಿಮಾನಿ. ಆಕೆಯ ಮುಖಾಂತರ ಭಗವಂತನಾದ ಶ್ರೀ ವಿಜಯವಿಠ್ಠಲನನ್ನು ಪ್ರಾರ್ಥಿಸಿ ಸಂಸಾರ ಬಂಧನದಿಂದ ಮುಕ್ತಿ ಪಡೆಯುವ ತತ್ತ್ವ.",
        spiritualMeaningEnglish: "Positions Goddess Durga as the cosmic protector directing seekers to the ultimate grace of Lord Vijaya Vittala."
      }
    ]
  },
  narasimha: {
    titleKannada: "ಶ್ರೀ ನರಸಿಂಹ ಸೂಳಾದಿ",
    titleEnglish: "Sri Narasimha Suladi",
    composerKannada: "ಶ್ರೀ ವಿಜಯ ದಾಸರು",
    composerEnglish: "Sri Vijaya Dasaru (1682–1755 CE)",
    ankitaKannada: "ವಿಜಯ ವಿಠ್ಠಲ",
    ankitaEnglish: "Vijaya Vittala",
    historicalContextKannada: "ಶ್ರೀ ವಿಜಯದಾಸರು ಪ್ರಹ್ಲಾದನಿಗೆ ಒಲಿದ ಭಕ್ತವತ್ಸಲ ನರಸಿಂಹ ದೇವರನ್ನು ಧ್ಯಾನಿಸುತ್ತಾ ರಚಿಸಿದ ಪೂರ್ಣ ಸೂಳಾದಿ.",
    historicalContextEnglish: "Composed by Sri Vijaya Dasa invoking Lord Narasimha's transcendental ferocity toward adharma across traditional Suladi talas.",
    compositionType: "ಸೂಳಾದಿ",
    ragaTradition: "ಮಾಲಿಕಾ ರಾಗ",
    talaTradition: "ಸಪ್ತತಾಳ",
    bhaktiRasa: "ವೀರ & ಶರಣಾಗತಿ ಭಕ್ತಿ",
    comprehensiveSummaryKannada: "ವಿಜಯದಾಸರ ಈ ಸೂಳಾದಿಯು ನರಸಿಂಹ ತತ್ತ್ವದ ಸಮಗ್ರ ವಿವರಣೆ ನೀಡುತ್ತದೆ.",
    comprehensiveSummaryEnglish: "A masterwork Suladi establishing the absolute sovereignty of Lord Narasimha.",
    modernTakeawayKannada: "ಬದುಕಿನಲ್ಲಿ ಎದುರಾಗುವ ಭಯ ಮತ್ತು ಅನ್ಯಾಯದ ಸನ್ನಿವೇಶಗಳಲ್ಲಿ ಕುಗ್ಗದೆ ಸತ್ಯದ ಮಾರ್ಗದಲ್ಲಿ ಧೃಢವಾಗಿ ನಿಲ್ಲಲು ಈ ಕೃತಿ ಆತ್ಮಸ್ಥೈರ್ಯ ನೀಡುತ್ತದೆ.",
    modernTakeawayEnglish: "Cultivates psychological resilience against fear.",
    stanzas: [
      {
        stanzaNumber: 1,
        stanzaType: "ಧ್ರುವ ತಾಳ",
        originalTextKannada: "ವೀರ ಸಿಂಹನೆ ನಾರಸಿಂಹನೆ ದಯ\nಪಾರಾವಾರನೆ ಭಯ ನಿವಾರಣ ನಿರ್ಗುಣ\nಮೂರು ಲೋಕದ ರಕ್ಷಕನೆ ಸದ್ಗುಣ\nಭೂರಿ ಮಹಿಮ ಶ್ರೀ ವಿಜಯ ವಿಠ್ಠಲ ನರಸಿಂಗ",
        originalTextTransliteration: "Veera simhane narasimhane daya\npaaraavaarane bhaya nivaarana nirguna\nmooru lokada rakshakane sadguna\nbhoori mahima sri vijaya vitthala narasinga",
        wordByWordBreakdown: [
          { kannadaWord: "ವೀರ ಸಿಂಹನೆ", transliteration: "veera simhane", meaningKannada: "ವೀರಾಗ್ರಣಿಯಾದ ದೈವಿಕ ಸಿಂಹವೇ", meaningEnglish: "Valiant divine lion" },
          { kannadaWord: "ದಯ ಪಾರಾವಾರನೆ", transliteration: "daya paaraavaarane", meaningKannada: "ಕರುಣೆಯ ಮಹಾಸಮುದ್ರವೇ", meaningEnglish: "Ocean of unconditioned mercy" }
        ],
        anvayaKannada: "ವೀರ ಸಿಂಹನೆ, ನಾರಸಿಂಹನೆ, ದಯೆಯ ಪಾರಾವಾರನೇ, ಭಯ ನಿವಾರಕನೇ, ಮೂರು ಲೋಕಗಳ ರಕ್ಷಕನೇ, ಸದ್ಗುಣ-ಮಹಿಮೆಗಳುಳ್ಳ ಶ್ರೀ ವಿಜಯ ವಿಠ್ಠಲ ನರಸಿಂಗನೇ ನಿನಗೆ ನಮಸ್ಕಾರ.",
        anvayaEnglish: "O Valiant Lion, O Narasimha, an infinite ocean of grace, dispeller of mortal dread.",
        spiritualMeaningKannada: "ಭಗವಂತನ ನರಸಿಂಹ ರೂಪವು ದುಷ್ಟರಿಗೆ ಭಯಂಕರನಾದರೂ ಶರಣಾದ ಭಕ್ತರಿಗೆ ದಯಾಸಮುದ್ರ.",
        spiritualMeaningEnglish: "Reconciles the paradox of divine ferocity toward evil and tender shelter toward sincere seekers."
      }
    ]
  }
};

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

    if (!query) {
      return NextResponse.json(
        { error: "Query cannot be empty. ದಯವಿಟ್ಟು ಕೃತಿಯ ಪಲ್ಲವಿ ಅಥವಾ ಸಾಲುಗಳನ್ನು ನಮೂದಿಸಿ." },
        { status: 400 }
      );
    }

    const qLower = query.toLowerCase();

    if (qLower.includes("ದುರ್ಗಾ") || qLower.includes("ದುರ್ಗೆ") || qLower.includes("durga") || qLower.includes("durge")) {
      return NextResponse.json(PRECACHED_MASTERPIECES.durga);
    }
    if (qLower.includes("ನಾರಸಿಂಹ") || qLower.includes("ವೀರ ಸಿಂಹನೆ") || qLower.includes("narasimha")) {
      return NextResponse.json(PRECACHED_MASTERPIECES.narasimha);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in environment variables." },
        { status: 500 }
      );
    }

    const systemPrompt = `You are "Dāsa Bodhini" (ದಾಸ ಬೋಧಿನಿ), the authoritative academic and theological workstation for Haridasa Sahitya (1263–1983 CE).
Analyze the query with rigorous academic precision to ensure 100% theological and historical data accuracy.

Strict Attribution based on Registry:
${JSON.stringify(CANONICAL_HARIDASA_REGISTRY)}

Return ONLY valid JSON matching this exact schema:
{
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
              contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nAccurately decode and reconstruct the full Haridasa composition for query:\n"${query}"` }] }],
              generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
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