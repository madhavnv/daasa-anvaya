import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    titleKannada: { type: SchemaType.STRING },
    titleEnglish: { type: SchemaType.STRING },
    composerKannada: { type: SchemaType.STRING },
    composerEnglish: { type: SchemaType.STRING },
    ankitaKannada: { type: SchemaType.STRING },
    ankitaEnglish: { type: SchemaType.STRING },
    anvayaKannada: { type: SchemaType.STRING },
    anvayaEnglish: { type: SchemaType.STRING },
    pratipadaartha: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          wordKannada: { type: SchemaType.STRING },
          wordTransliterated: { type: SchemaType.STRING },
          meaningKannada: { type: SchemaType.STRING },
          meaningEnglish: { type: SchemaType.STRING }
        },
        required: ["wordKannada", "wordTransliterated", "meaningKannada", "meaningEnglish"]
      }
    },
    metaphorsAndMundige: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          motifKannada: { type: SchemaType.STRING },
          motifEnglish: { type: SchemaType.STRING },
          innerMeaningKannada: { type: SchemaType.STRING },
          innerMeaningEnglish: { type: SchemaType.STRING }
        },
        required: ["motifKannada", "motifEnglish", "innerMeaningKannada", "innerMeaningEnglish"]
      }
    },
    modernTakeawayKannada: { type: SchemaType.STRING },
    modernTakeawayEnglish: { type: SchemaType.STRING },
    youtubeSearchQuery: { type: SchemaType.STRING }
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

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema as any,
        temperature: 0.2
      },
      systemInstruction: `You are a bilingual authority on Haridasa Sahitya and Kannada linguistics.
Input can be in Kannada script, informal English/Kanglish phonetics, or an English phrase.
1. Identify the composition accurately.
2. Present Kannada and English explanations side-by-side in equal depth.
3. Perform Anvaya (reordering poetic inversions into natural spoken syntax).
4. Provide a word-by-word glossary for difficult or classical roots.
5. Decode philosophical allegories (Mundige/Rupaka) and give a 1-sentence practical life reflection in both languages.`
    });

    const result = await model.generateContent(`Analyze this Haridasa composition:\n"""\n${query}\n"""`);
    const parsed = JSON.parse(result.response.text());
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Could not decode song" }, { status: 500 });
  }
}
