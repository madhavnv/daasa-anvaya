"use client";

import React, { useState, useEffect, useRef } from "react";

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
  historicalContextKannada: string;
  historicalContextEnglish: string;
  comprehensiveSummaryKannada: string;
  comprehensiveSummaryEnglish: string;
  stanzas: StanzaItem[];
  pratipadaartha: WordItem[];
  metaphorsAndMundige: MetaphorItem[];
  modernTakeawayKannada: string;
  modernTakeawayEnglish: string;
  youtubeSearchQuery: string;
}

const PRESETS = [
  { label: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ (Tarakka Bindige)", query: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ ನೀರಿಗೆ ಹೋಗೋಣ" },
  { label: "ಮಾನವ ಜನ್ಮ (Manava Janma)", query: "manava janma doddadu idanu hani madikoliro" },
  { label: "ಕಲ್ಲು ಸಕ್ಕರೆ (Kallu Sakkare)", query: "ಕಲ್ಲು ಸಕ್ಕರೆ ಕೊಳ್ಳಿರೋ ನೀವೆಲ್ಲರು" },
  { label: "ಜಗದೋದ್ಧಾರನ (Jagadoddharana)", query: "jagadoddharana aadidalo yashoda" },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Typography Scaling
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState<"kn-IN" | "en-IN">("kn-IN");
  const recognitionRef = useRef<any>(null);

  // Feedback State
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState("Accuracy / ಅರ್ಥ ಸರಿಯಿಲ್ಲ");
  const [feedbackText, setFeedbackText] = useState("");

  const FEEDBACK_WHATSAPP_NUMBER = "919845509006";

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
        throw new Error(errData.error || "Could not analyze composition");
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    const indianVoice = voices.find(
      (v) =>
        v.lang === "kn-IN" ||
        v.lang === "kn_IN" ||
        (v.lang.includes("IN") && (v.name.includes("India") || v.name.includes("Google") || v.name.includes("Kannada")))
    ) || voices.find((v) => v.lang.includes("hi-IN") || v.lang.includes("en-IN"));

    if (indianVoice) {
      utterance.voice = indianVoice;
    }
    utterance.lang = "kn-IN";
    utterance.rate = 0.82;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const exportPDF = () => {
    window.print();
  };

  const shareToWhatsApp = () => {
    if (!result) return;
    const text = `🎶 *${result.titleKannada}* (${result.titleEnglish})\n` +
      `✍️ *ರಚನೆ / Composer:* ${result.composerKannada} (${result.composerEnglish})\n` +
      `🏷️ *ಅಂಕಿತ / Mudra:* ${result.ankitaKannada}\n\n` +
      `📖 *ಭಾವಾರ್ಥ / Summary:* ${result.comprehensiveSummaryEnglish}\n\n` +
      `✨ *ಜೀವನ ಸಂದೇಶ / Takeaway:* ${result.modernTakeawayEnglish}\n\n` +
      `_Decoded with Dāsa Bodhini (ದಾಸ ಬೋಧಿನಿ)_`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const sendFeedbackWhatsApp = () => {
    const message = `*Dāsa Bodhini Beta Feedback*\n` +
      `• *Category:* ${feedbackCategory}\n` +
      `• *Song Query:* ${input || result?.titleEnglish || "General"}\n` +
      `• *Comments:* ${feedbackText}\n`;
    window.open(`https://api.whatsapp.com/send?phone=${FEEDBACK_WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`, "_blank");
    setFeedbackOpen(false);
    setFeedbackText("");
  };

  const getKannadaTextClass = () => {
    if (fontSize === "large") return "text-lg leading-relaxed";
    if (fontSize === "xlarge") return "text-xl leading-loose";
    return "text-base leading-relaxed";
  };

  const getEnglishTextClass = () => {
    if (fontSize === "large") return "text-base leading-relaxed";
    if (fontSize === "xlarge") return "text-lg leading-relaxed";
    return "text-sm leading-relaxed";
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-24 pt-6 px-4 sm:px-6 antialiased">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Masthead Header */}
        <header className="text-center space-y-2 border-b border-stone-200/80 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/5 border border-amber-900/15 text-amber-900 text-[11px] font-semibold tracking-wider uppercase">
            <span>ದಾಸ ಬೋಧಿನಿ</span>
            <span>•</span>
            <span>Dāsa Bodhini Portal</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            ದಾಸ ಬೋಧಿನಿ (Dāsa Bodhini)
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-sans max-w-lg mx-auto">
            ದಾಸ ಸಾಹಿತ್ಯದ ಸರಳ ಅನ್ವಯ, ಇತಿಹಾಸ ಮತ್ತು ಭಾವಾರ್ಥ • Classical Haridasa Sahitya Decoded
          </p>
        </header>

        {/* Input Console */}
        <div className="no-print bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5 space-y-3">
          <div className="relative">
            <textarea
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "ಕೇಳಿಸಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ... ಮಾತನಾಡಿ / Listening... Speak now..." : "ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಹಾಡನ್ನು ಹಾಕಿ / Type or speak in Kannada or English..."}
              className={`w-full p-3.5 pr-14 text-sm sm:text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-900/30 font-sans transition placeholder:text-stone-400 ${
                isListening ? "border-amber-700 bg-amber-50/20" : "border-stone-200"
              }`}
            />
            
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? "Stop listening" : "Click to speak"}
              className={`absolute right-3 bottom-4 p-2.5 rounded-full transition shadow-xs ${
                isListening
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200"
              }`}
            >
              {isListening ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3z" />
                </svg>
              )}
            </button>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <span className="font-medium text-stone-500">ಧ್ವನಿ / Mic:</span>
              <button
                type="button"
                onClick={() => setSpeechLang("kn-IN")}
                className={`px-2.5 py-1 rounded-md border text-xs transition ${
                  speechLang === "kn-IN"
                    ? "bg-stone-900 text-white border-stone-900 font-semibold"
                    : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                }`}
              >
                ಕನ್ನಡ (Kannada)
              </button>
              <button
                type="button"
                onClick={() => setSpeechLang("en-IN")}
                className={`px-2.5 py-1 rounded-md border text-xs transition ${
                  speechLang === "en-IN"
                    ? "bg-stone-900 text-white border-stone-900 font-semibold"
                    : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                }`}
              >
                English (India)
              </button>
            </div>

            <button
              onClick={() => handleDecode()}
              disabled={loading || !input.trim()}
              className="px-6 py-2.5 bg-amber-900 hover:bg-amber-950 text-amber-50 font-semibold rounded-xl text-xs sm:text-sm tracking-wide transition shadow-sm disabled:opacity-50 ml-auto"
            >
              {loading ? "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ (Decoding)..." : "ಅರ್ಥ ತಿಳಿಸಿ (Decode Song)"}
            </button>
          </div>

          {/* Presets */}
          <div className="flex items-center gap-1.5 flex-wrap pt-2.5 border-t border-stone-100 text-xs text-stone-500">
            <span className="font-medium text-stone-400">ಉದಾಹರಣೆಗಳು (Presets):</span>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setInput(p.query);
                  handleDecode(p.query);
                }}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-md text-stone-700 transition border border-stone-200/50"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="no-print p-3.5 bg-red-50/80 border border-red-200 text-red-800 rounded-xl text-xs sm:text-sm">
            {error}
          </div>
        )}

        {/* Results Stream */}
        {result && (
          <div className="space-y-5">

            {/* Action Bar (Font Scale + Export PDF + Share) */}
            <div className="no-print flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
              <div className="flex items-center gap-2 text-stone-500">
                <span className="font-medium text-[11px] uppercase tracking-wider">ಅಕ್ಷರ ಗಾತ್ರ (Font):</span>
                <div className="inline-flex rounded-lg border border-stone-200 bg-white p-0.5 shadow-2xs">
                  <button
                    onClick={() => setFontSize("normal")}
                    className={`px-2 py-0.5 rounded text-xs ${fontSize === "normal" ? "bg-stone-900 text-white font-semibold" : "text-stone-600"}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize("large")}
                    className={`px-2 py-0.5 rounded text-xs ${fontSize === "large" ? "bg-stone-900 text-white font-semibold" : "text-stone-600"}`}
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSize("xlarge")}
                    className={`px-2 py-0.5 rounded text-xs ${fontSize === "xlarge" ? "bg-stone-900 text-white font-semibold" : "text-stone-600"}`}
                  >
                    A++
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={exportPDF}
                  className="inline-flex items-center gap-1 bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition"
                >
                  📄 Export PDF / Print
                </button>
                <button
                  onClick={shareToWhatsApp}
                  className="inline-flex items-center gap-1 bg-[#1B5E20] hover:bg-[#2E7D32] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition"
                >
                  WhatsApp Share
                </button>
              </div>
            </div>

            {/* Meta Header Card */}
            <div className="bg-[#2B231D] text-amber-50 p-5 rounded-2xl shadow-sm border border-stone-800 space-y-4 print-page-break">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">{result.titleKannada}</h2>
                  <p className="text-stone-300 text-xs sm:text-sm italic font-sans">{result.titleEnglish}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest text-amber-400 block font-semibold">ಮುದ್ರೆ / Mudra</span>
                  <span className="text-xs sm:text-sm font-serif font-semibold text-amber-100">{result.ankitaKannada}</span>
                  <span className="text-[11px] text-stone-400 block italic font-sans">{result.ankitaEnglish}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between border-t border-stone-700/60 pt-3 text-xs gap-3">
                <span className="text-stone-300">
                  ರಚನೆ / Composer: <strong className="text-white font-medium">{result.composerKannada}</strong> ({result.composerEnglish})
                </span>

                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(result.youtubeSearchQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-print inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-600/50 px-3 py-1 rounded-lg text-amber-200 transition font-medium"
                >
                  ▶ YouTube ಆಲಿಸಿ
                </a>
              </div>
            </div>

            {/* Historical Context / Aithihya */}
            {(result.historicalContextKannada || result.historicalContextEnglish) && (
              <div className="bg-[#FFFDF9] rounded-2xl border border-amber-900/20 shadow-2xs p-5 space-y-2.5 print-page-break">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-950 font-serif">
                    ಐತಿಹ್ಯ ಮತ್ತು ಹಿನ್ನೆಲೆ • Historical Context & Setting
                  </span>
                </div>
                <p className={`font-serif text-stone-900 ${getKannadaTextClass()}`}>
                  {result.historicalContextKannada}
                </p>
                <p className={`text-stone-700 italic font-sans pt-1 border-t border-amber-900/10 ${getEnglishTextClass()}`}>
                  {result.historicalContextEnglish}
                </p>
              </div>
            )}

            {/* Comprehensive Detailed Summary */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-3 print-page-break">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                ಸಮಗ್ರ ಭಾವಾರ್ಥ • Comprehensive Philosophical Summary
              </span>
              <p className={`font-serif text-stone-900 bg-stone-50/70 p-3.5 rounded-xl border border-stone-100 ${getKannadaTextClass()}`}>
                {result.comprehensiveSummaryKannada}
              </p>
              <p className={`text-stone-700 font-sans leading-relaxed ${getEnglishTextClass()}`}>
                {result.comprehensiveSummaryEnglish}
              </p>
            </div>

            {/* Stanzas Breakdown */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 px-1">
                ಪದಾನ್ವಯ ಮತ್ತು ಭಾಗಾರ್ಥ • Stanza-by-Stanza Breakdown ({result.stanzas?.length || 0} ಭಾಗಗಳು)
              </h3>

              {result.stanzas?.map((stanza, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden print-page-break">
                  <div className="bg-stone-50 border-b border-stone-100 px-4 py-2.5 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-950 font-serif">
                      {stanza.stanzaType}
                    </span>

                    <button
                      type="button"
                      onClick={() => speakText(stanza.anvayaKannada)}
                      className="no-print inline-flex items-center gap-1 text-[11px] text-stone-700 hover:text-stone-900 bg-white border border-stone-300 px-2.5 py-1 rounded-md transition font-medium shadow-2xs"
                      title="Listen with Indian pronunciation"
                    >
                      🔊 ಉಚ್ಚಾರಣೆ ಕೇಳಿ (Listen)
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 space-y-3.5">
                    {stanza.originalKannada && (
                      <p className="text-xs sm:text-sm text-stone-500 font-serif italic whitespace-pre-line bg-[#FAF9F6] p-3 rounded-xl border border-stone-100">
                        {stanza.originalKannada}
                      </p>
                    )}

                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-amber-900 uppercase tracking-wider block">
                        ಕನ್ನಡ ವಾಕ್ಯಾನ್ವಯ • Spoken Syntax Flow
                      </span>
                      <p className={`font-serif text-stone-900 bg-amber-50/40 p-3.5 rounded-xl border border-amber-100/60 ${getKannadaTextClass()}`}>
                        {stanza.anvayaKannada}
                      </p>
                    </div>

                    <div className="space-y-1">
       