import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, language_code = "kn-IN", speaker = "shubh" } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Valid text is required for TTS." }, { status: 400 });
    }

    // Clean text and fit within Sarvam's REST limits
    const sanitizedText = text.replace(/[\n\r]+/g, " ").trim().substring(0, 2500);

    const sarvamApiKey = "sk_ldj1zxqz_E5plgzYCRGYGJGLJjLyy9Ned";

    // Correct Sarvam Bulbul v3 REST API payload structure
    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": sarvamApiKey,
      },
      body: JSON.stringify({
        text: sanitizedText,
        target_language_code: language_code,
        speaker: speaker, // 'shubh' (male) or 'ishita' (female)
        model: "bulbul:v3",
        output_audio_codec: "wav",
        speech_sample_rate: 24000,
        pace: 1.0,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Sarvam API HTTP Error:", response.status, errText);
      return NextResponse.json({ error: `Sarvam API error (${response.status}): ${errText}` }, { status: response.status });
    }

    const data = await response.json();
    
    // Sarvam REST response returns base64 strings under 'audios' array
    const audioBase64 = data.audios?.[0];

    if (!audioBase64) {
      return NextResponse.json({ error: "No audio generated from Sarvam API response structure." }, { status: 500 });
    }

    return NextResponse.json({ audioBase64 });
  } catch (err: any) {
    console.error("TTS Route Exception:", err);
    return NextResponse.json({ error: err.message || "Internal server error." }, { status: 500 });
  }
}