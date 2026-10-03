"use client";

import { useState, useEffect, useRef } from "react";

interface StanzaItem {
  stanzaType: string;
  originalKannada: string;
  anvayaKannada: string;
  anvayaEnglish: string;
}

interface WordItem {
  wordKannada: string;
  wordTransliterated: string;
  meaningKannada: string;
  meaningEnglish: string;
}

interface MetaphorItem {
  motifKannada: string;
  motifEnglish: string;
  innerMeaningKannada: string;
  innerMeaningEnglish: string;
}

interface AnalysisResult {
  titleKannada: string;
  titleEnglish: string;
  composerKannada: string;
  composerEnglish: string;
  ankitaKannada: string;
  ankitaEnglish: string;
  stanzas: StanzaItem[];
  pratipadaartha: WordItem[];
  metaphorsAndMundige: MetaphorItem[];
  modernTakeawayKannada: string;
  modernTakeawayEnglish: string;
  youtubeSearchQuery: string;
}

const PRESETS = [
  { label: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ", query: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ ನೀರಿಗೆ ಹೋಗೋಣ" },
  { label: "Manava Janma", query: "manava janma doddadu idanu hani madikoliro" },
  { label: "ಕಲ್ಲು ಸಕ್ಕರೆ", query: "ಕಲ್ಲು ಸಕ್ಕರೆ ಕೊಳ್ಳಿರೋ ನೀವೆಲ್ಲರು" },
  { label: "Jagadoddharana", query: "jagadoddharana aadidalo yashoda" },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState<"kn-IN" | "en-IN">("kn-IN");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = speechLang;

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          setInput(transcript);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, [speechLang]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is supported in Chrome, Safari, and Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput("");
      recognitionRef.current.lang = speechLang;
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleDecode = async (queryText?: string) => {
    const textToQuery = queryText || input;
    if (!textToQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToQuery }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Could not decode verse");
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const shareToWhatsApp = () => {
    if (!result) return;
    const stanzasSummary = result.stanzas
      ?.map((s) => `*${s.stanzaType}:*\n${s.anvayaKannada}\n_${s.anvayaEnglish}_`)
      .join("\n\n");

    const text = `🎶 *${result.titleKannada}* (${result.titleEnglish})\n` +
      `✍️ *ರಚನೆ:* ${result.composerKannada} (${result.composerEnglish})\n` +
      `🏷️ *ಅಂಕಿತ:* ${result.ankitaKannada}\n\n` +
      `${stanzasSummary}\n\n` +
      `✨ *Life Takeaway:*\n${result.modernTakeawayEnglish}\n\n` +
      `_Decoded via Anvaya Studio_`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-stone-100 text-stone-900 pb-16 pt-6 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Top Header */}
        <header className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold">
            <span>ಕನ್ನಡ</span>
            <span>•</span>
            <span>English</span>
            <span>•</span>
            <span>🎙️ Voice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            ಪಶ್ಚಾತ್ಯ-ಅನ್ವಯ (Anvaya Studio)
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Full-Song Decrypter: Stanza-by-Stanza Syntax, Roots & Deeper Metaphors
          </p>
        </header>

        {/* Input Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-stone-200 space-y-3">
          <div className="relative">
            <textarea
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening... Speak now..." : "Paste full song lyrics or type song name in Kannada/English..."}
              className={`w-full p-3 pr-14 text-sm sm:text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800/40 ${
                isListening ? "border-amber-500 bg-amber-50/20" : "border-stone-200"
              }`}
            />
            <button
              type="button"
              onClick={toggleListening}
              className={`absolute right-2.5 bottom-3.5 p-2 rounded-full transition shadow-xs ${
                isListening
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-amber-100 hover:bg-amber-200 text-amber-900"
              }`}
            >
              {isListening ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3z" />
                </svg>
              )}
            </button>
          </div>

          {/* Voice Switcher + Action Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <span>Mic:</span>
              <button
                type="button"
                onClick={() => setSpeechLang("kn-IN")}
                className={`px-2 py-0.5 rounded border ${
                  speechLang === "kn-IN" ? "bg-amber-900 text-white border-amber-900 font-medium" : "bg-white border-stone-200"
                }`}
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => setSpeechLang("en-IN")}
                className={`px-2 py-0.5 rounded border ${
                  speechLang === "en-IN" ? "bg-amber-900 text-white border-amber-900 font-medium" : "bg-white border-stone-200"
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={() => handleDecode()}
              disabled={loading || !input.trim()}
              className="px-5 py-2 bg-amber-900 hover:bg-amber-950 text-amber-50 font-medium rounded-xl text-sm transition disabled:opacity-50 ml-auto"
            >
              {loading ? "Analyzing Song..." : "Decode Full Song"}
            </button>
          </div>

          {/* Presets */}
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-stone-100 text-xs text-stone-500">
            <span>Try:</span>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setInput(p.query);
                  handleDecode(p.query);
                }}
                className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 transition"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Results Area */}
        {result && (
          <div className="space-y-4">

            {/* Meta Card */}
            <div className="bg-amber-900 text-amber-50 p-5 rounded-2xl shadow-xs space-y-3">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold">{result.titleKannada}</h2>
                  <p className="text-amber-200 text-xs sm:text-sm italic">{result.titleEnglish}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-amber-300 block">ಅಂಕಿತ / Mudra</span>
                  <span className="text-xs sm:text-sm font-semibold">{result.ankitaKannada}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between border-t border-amber-800/80 pt-2.5 text-xs text-amber-100 gap-2">
                <span>ರಚನೆ: <strong className="text-white">{result.composerKannada}</strong> ({result.composerEnglish})</span>
                
                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(result.youtubeSearchQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-amber-950/80 px-2.5 py-1 rounded-lg text-amber-200 hover:text-white transition"
                  >
                    ▶ Listen
                  </a>
                  <button
                    onClick={shareToWhatsApp}
                    className="inline-flex items-center gap-1 bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg transition"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>

            {/* Stanza by Stanza Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-600 px-1">
                ಪದಾನ್ವಯ • Stanza-by-Stanza Breakdown ({result.stanzas?.length || 0} Stanzas)
              </h3>

              {result.stanzas?.map((stanza, idx) => (
                <div key={idx} className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-amber-900">
                      {stanza.stanzaType}
                    </span>
                  </div>

                  {stanza.originalKannada && (
                    <p className="text-xs sm:text-sm text-stone-500 font-serif italic whitespace-pre-line bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                      {stanza.originalKannada}
                    </p>
                  )}

                  {/* Kannada Anvaya */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-wide">
                      ಅನ್ವಯ (Spoken Kannada Syntax)
                    </span>
                    <p className="text-sm sm:text-base font-serif leading-relaxed text-stone-900 bg-amber-50/50 p-3 rounded-xl border border-amber-100/70">
                      {stanza.anvayaKannada}
                    </p>
                  </div>

                  {/* English Anvaya */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wide">
                      English Meaning & Flow
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed text-stone-700 bg-stone-50/70 p-3 rounded-xl border border-stone-200/70 font-sans">
                      {stanza.anvayaEnglish}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Practical Takeaway Card */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-700 block">
                ಜೀವನ ಸಂದೇಶ • Practical Reflection
              </span>
              <p className="text-xs sm:text-sm text-stone-800 font-serif leading-relaxed">
                {result.modernTakeawayKannada}
              </p>
              <p className="text-xs sm:text-sm text-stone-600 italic">
                {result.modernTakeawayEnglish}
              </p>
            </div>

            {/* Pratipadaartha (Word Glossary across entire song) */}
            {result.pratipadaartha?.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-900 block">
                  ಪ್ರತಿಪದಾರ್ಥ • Vocabulary Breakdown
                </span>
                <div className="divide-y divide-stone-100 text-xs sm:text-sm">
                  {result.pratipadaartha.map((w, i) => (
                    <div key={i} className="py-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <div>
                        <span className="font-semibold text-stone-900">{w.wordKannada}</span>
                        <span className="text-stone-400 text-xs ml-1.5 font-mono">({w.wordTransliterated})</span>
                      </div>
                      <div className="text-stone-700">
                        <span className="text-stone-900 font-medium">{w.meaningKannada}</span>
                        <span className="text-stone-500 block sm:inline sm:ml-2 italic text-xs sm:text-sm">"{w.meaningEnglish}"</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metaphors & Mundige */}
            {result.metaphorsAndMundige?.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-900 block">
                  ಮುಂಡಿಗೆ & ರೂಪಕ • Allegorical Insights
                </span>
                <div className="space-y-2">
                  {result.metaphorsAndMundige.map((m, i) => (
                    <div key={i} className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs sm:text-sm space-y-1">
                      <div className="font-semibold text-stone-900">
                        {m.motifKannada} <span className="text-stone-500 font-normal">({m.motifEnglish})</span>
                      </div>
                      <p className="text-stone-700">{m.innerMeaningKannada}</p>
                      <p className="text-stone-500 italic text-[11px] sm:text-xs">{m.innerMeaningEnglish}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}
