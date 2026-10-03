import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    titleKannada: { type: Type.STRING, description: "Title in Kannada script" },
    titleEnglish: { type: Type.STRING, description: "Title in English/IAST transliteration" },
    composerKannada: { type: Type.STRING, description: "Composer in Kannada" },
    composerEnglish: { type: Type.STRING, description: "Composer in English" },
    ankitaKannada: { type: Type.STRING, description: "Mudra/Ankita in Kannada" },
    ankitaEnglish: { type: Type.STRING, description: "Mudra/Ankita in English" },
    anvayaKannada: {
      type: Type.STRING,
      description: "Syntactic rearrangement in modern spoken Kannada sentence order"
    },
    anvayaEnglish: {
      type: Type.STRING,
      description: "Prose rearrangement and sentence-by-sentence translation in modern English"
    },
    pratipadaartha: {
      type: Type.ARRAY,
      description: "Word-by-word breakdown of classical or Nadugannada terms",
      items: {
        type: Type.OBJECT,
        properties: {
          wordKannada: { type: Type.STRING },
          wordTransliterated: { type: Type.STRING },
          meaningKannada: { type: Type.STRING },
          meaningEnglish: { type: Type.STRING }
        },
        required: ["wordKannada", "wordTransliterated", "meaningKannada", "meaningEnglish"]
      }
    },
    metaphorsAndMundige: {
      type: Type.ARRAY,
      description: "Allegorical riddles or philosophical metaphors explained",
      items: {
        type: Type.OBJECT,
        properties: {
          motifKannada: { type: Type.STRING },
          motifEnglish: { type: Type.STRING },
          innerMeaningKannada: { type: Type.STRING },
          innerMeaningEnglish: { type: Type.STRING }
        },
        required: ["motifKannada", "motifEnglish", "innerMeaningKannada", "innerMeaningEnglish"]
      }
    },
    modernTakeawayKannada: { type: Type.STRING, description: "Psychological life takeaway in Kannada" },
    modernTakeawayEnglish: { type: Type.STRING, description: "Psychological life takeaway in English" },
    youtubeSearchQuery: { type: Type.STRING, description: "Clean search string for YouTube rendition" }
  },
  required: [
    "titleKannada",
    "titleEnglish",
    "composerKannada",
    "composerEnglish",
    "ankitaKannada",
    "ankitaEnglish",
    "anvayaKannada",
    "anvayaEnglish",
    "pratipadaartha",
    "metaphorsAndMundige",
    "modernTakeawayKannada",
    "modernTakeawayEnglish",
    "youtubeSearchQuery"
  ]
};

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Input query is required" }, { status: 400 });
    }

    const systemPrompt = `You are a bilingual authority on Haridasa Sahitya and Kannada linguistics.
Input can be in Kannada script, informal English/Kanglish phonetics, or an English phrase.
1. Identify the composition accurately.
2. Present Kannada and English explanations side-by-side in equal depth.
3. Perform Anvaya (reordering poetic inversions into natural spoken syntax).
4. Provide a word-by-word glossary for difficult or classical roots.
5. Decode philosophical allegories (Mundige/Rupaka) and give a 1-sentence practical life reflection in both languages.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this Haridasa composition:\n"""\n${query}\n"""`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Could not decode song" }, { status: 500 });
  }
}
