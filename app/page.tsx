"use client";

import React, { useState, useRef, useEffect } from "react";

interface StanzaBreakdown {
  stanzaNumber: number;
  stanzaType: "ಪಲ್ಲವಿ" | "ಅನುಪಲ್ಲವಿ" | "ಚರಣ" | "ಧ್ರುವ ತಾಳ" | "ಮಟ್ಟ ತಾಳ" | "ರೂಪಕ ತಾಳ" | "ಝಂಪೆ ತಾಳ" | "ತ್ರಿಪುಟ ತಾಳ" | "ಅಟ್ಟ ತಾಳ" | "ಆದಿ ತಾಳ" | "ಜತೆ";
  originalTextKannada: string;
  originalTextTransliteration: string;
  wordByWordBreakdown: Array<{
    kannadaWord: string;
    transliteration: string;
    meaningKannada: string;
    meaningEnglish: string;
  }>;
  anvayaKannada: string;
  anvayaEnglish: string;
  spiritualMeaningKannada: string;
  spiritualMeaningEnglish: string;
}

interface DecodeResult {
  titleKannada: string;
  titleEnglish: string;
  composerKannada: string;
  composerEnglish: string;
  ankitaKannada: string;
  ankitaEnglish: string;
  historicalContextKannada: string;
  historicalContextEnglish: string;
  compositionType: "ಕೀರ್ತನೆ / ದೇವರನಾಮ" | "ಸೂಳಾದಿ" | "ಉಗಾಭೋಗ" | "ಮುಂಡಿಗೆ";
  ragaTradition?: string;
  talaTradition?: string;
  classicalRendition?: {
    artist: string;
    raga: string;
    tala: string;
    searchQuery: string;
    sourceNote?: string;
  };
  comprehensiveSummaryKannada: string;
  comprehensiveSummaryEnglish: string;
  modernTakeawayKannada: string;
  modernTakeawayEnglish: string;
  stanzas: StanzaBreakdown[];
  metaphorsAndMundige?: Array<{
    allegoryKannada: string;
    allegoryEnglish: string;
    outerMeaningKannada: string;
    outerMeaningEnglish: string;
    esotericMeaningKannada: string;
    esotericMeaningEnglish: string;
  }>;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DecodeResult | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "anvaya" | "vocab" | "mundige">("summary");

  // Visual & Typographic Controls
  const [kannadaSize, setKannadaSize] = useState<string>("text-base leading-relaxed");
  const [englishSize, setEnglishSize] = useState<string>("text-sm leading-relaxed");

  // Speech Recognition (Mic)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Structured Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState("ಕೃತಿ ವಿಶ್ಲೇಷಣೆ ದೋಷ (Analysis Correction)");
  const [feedbackComment, setFeedbackComment] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "kn-IN";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗ್ರಹಿಕೆ (Voice typing) ಸೌಲಭ್ಯ ಲಭ್ಯವಿಲ್ಲ.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput("");
      setIsListening(true);
      recognitionRef.current.start();
      textareaRef.current?.focus();
    }
  };

  const PRESET_SONGS = [
    { label: "ಶ್ರೀ ನರಸಿಂಹ ಸೂಳಾದಿ", query: "ವೀರ ಸಿಂಹನೆ ನಾರಸಿಂಹನೆ ದಯ ಪಾರಾವಾರನೆ ಭಯ ನಿವಾರಣ ನಿರ್ಗುಣ ಶ್ರೀ ನರಸಿಂಹ ಸೂಳಾದಿ" },
    { label: "ಶ್ರೀ ದುರ್ಗಾ ಸೂಳಾದಿ", query: "ದುರ್ಗಾ ದುರ್ಗೆಯೆ ಮಹಾದುಷ್ಟಜನ ಸಂಹಾರೆ ದುರ್ಗಾಂತರ್ಗತ ದುರ್ಗೆ ದುರ್ಲಭೆ ಸುಲಭೆ ಶ್ರೀ ದುರ್ಗಾ ಸೂಳಾದಿ ವಿಜಯದಾಸರು" },
    { label: "ಶ್ರೀ ಧನ್ವಂತ್ರಿ ಸೂಳಾದಿ", query: "ಆಯುವೃದ್ಧಿಯಾಗೋದು ಶ್ರೇಯಸ್ಸು ಬರುವುದು ಕಾಯಾ ನಿರ್ಮಲಿನಾ ಕಾರಣವಾಹದೊ ಶ್ರೀ ಧನ್ವಂತ್ರಿ ಸೂಳಾದಿ" },
    { label: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ (ಮುಂಡಿಗೆ)", query: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ ನೀರಿಗೆ ಹೋಗೋಣ ಬಾರೆ ಚೆಲುವೆ ಬಿಂದಿಗೆ ಒಡೆದರೆ ಒಂಬತ್ತು ತೂತು" },
    { label: "ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು", query: "ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು ಇದನು ಹಾನಿ ಮಾಡಲಿಬೇಡಿ ಹುಚ್ಚಪ್ಪಗಳಿರಾ" },
    { label: "ಕಲ್ಲು ಸಕ್ಕರೆ ಕೊಳ್ಳಿರೋ", query: "ಕಲ್ಲು ಸಕ್ಕರೆ ಕೊಳ್ಳಿರೋ ನೀವೆಲ್ಲರು ಕಲ್ಲು ಸಕ್ಕರೆ ಕೊಳ್ಳಿರೋ ಪುರಂದರವಿಠ್ಠಲ" },
  ];

  const handleDecode = async (overrideInput?: string) => {
    const textToQuery = (typeof overrideInput === "string" ? overrideInput : input).trim();

    if (!textToQuery) {
      setError("ದಯವಿಟ್ಟು ಕೃತಿಯ ಪಲ್ಲವಿ ಅಥವಾ ಸಾಲುಗಳನ್ನು ನಮೂದಿಸಿ.");
      return;
    }

    setInput(textToQuery);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToQuery,
          input: textToQuery,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "ವಿಶ್ಲೇಷಣೆ ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.");
      }

      setResult(data);
      setActiveTab("summary");
    } catch (err: any) {
      setError(err.message || "ನೆಟ್‌ವರ್ಕ್ ಅಥವಾ ಸರ್ವರ್ ಸಮಸ್ಯೆ. ದಯವಿಟ್ಟು ಮರುಪ್ರಯತ್ನಿಸಿ.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsAppFeedback = () => {
    const message = `*Dāsa Bodhini - User Feedback*\n\n*ವಿಭಾಗ (Category):* ${feedbackCategory}\n${result ? `*ಕೃತಿ (Song):* ${result.titleKannada} (${result.composerKannada})\n` : ""}${input ? `*ಹುಡುಕಾಟ (Query):* ${input}\n` : ""}*ಅನಿಸಿಕೆ/ವಿವರ (Comment):* ${feedbackComment || "ಯಾವುದೇ ವಿವರಣೆ ನೀಡಿಲ್ಲ"}`;

    const url = `https://api.whatsapp.com/send?phone=919845509006&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setShowFeedbackModal(false);
    setFeedbackComment("");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 selection:bg-amber-100 flex flex-col font-sans antialiased">
      {/* Editorial Header */}
      <header className="border-b border-stone-200/70 bg-[#FDFBF7]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-900 to-amber-950 text-amber-50 flex items-center justify-center shadow-sm ring-1 ring-amber-900/20">
              <svg className="w-5 h-5 text-amber-200" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-serif font-bold tracking-tight text-stone-900">
                  ದಾಸ ಬೋಧಿನಿ
                </h1>
                <span className="text-stone-300 font-light">|</span>
                <span className="text-xs font-sans font-medium text-stone-500 uppercase tracking-widest">
                  Dāsa Bodhini
                </span>
              </div>
              <p className="text-[11px] text-stone-500 tracking-tight hidden sm:block">
                ಹರಿದಾಸ ಸಾಹಿತ್ಯ, ಸೂಳಾದಿ ಮತ್ತು ಮುಂಡಿಗೆಗಳ ಸಂಶೋಧನಾ ವೇದಿಕೆ
              </p>
            </div>
          </div>

          {/* Feedback & Attribution Stack */}
          <div className="flex flex-col items-end gap-0.5">
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="text-xs bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 border border-stone-200 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 font-medium shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current text-emerald-600" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.174.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
              </svg>
              <span>Feedback</span>
            </button>
            <span className="text-[10px] text-stone-500 font-sans tracking-tight pr-1">
              By Madhav N V
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-6 sm:space-y-8 w-full">
        {/* Search Console */}
        <section className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-xs ring-1 ring-stone-900/5 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-amber-950 font-serif flex items-center gap-1.5">
                <span>ಕೃತಿ ಅನ್ವೇಷಣೆ</span>
                <span className="text-stone-400 font-sans font-normal text-[11px] lowercase">(composition or initial line)</span>
              </label>
              {isListening && (
                <span className="text-[11px] font-medium text-red-600 flex items-center gap-1.5 animate-pulse font-sans">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  ಧ್ವನಿ ಗ್ರಹಿಸಲಾಗುತ್ತಿದೆ... (Listening)
                </span>
              )}
            </div>

            <div className="relative group">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ಉದಾಹರಣೆಗೆ: ವೀರ ಸಿಂಹನೆ ನಾರಸಿಂಹನೆ ದಯ ಪಾರಾವಾರನೆ... ಅಥವಾ ತಾರಕ್ಕ ಬಿಂದಿಗೆ..."
                rows={3}
                className="w-full text-base sm:text-lg p-4 pr-12 rounded-xl border border-stone-200 bg-[#FCFBF9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900 transition font-serif leading-relaxed text-stone-900 resize-none shadow-2xs"
              />

              <button
                type="button"
                onClick={toggleMic}
                title="ಧ್ವನಿಯ ಮೂಲಕ ಹುಡುಕಿ (Speak to Search)"
                className={`absolute right-3.5 bottom-3.5 p-2 rounded-lg transition cursor-pointer active:scale-95 ${
                  isListening
                    ? "bg-red-600 text-white shadow-sm shadow-red-200"
                    : "bg-white hover:bg-stone-100 text-stone-500 hover:text-stone-800 border border-stone-200 shadow-2xs"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDecode(input)}
                disabled={loading || !input.trim()}
                className="bg-amber-950 hover:bg-amber-900 disabled:bg-stone-200 disabled:text-stone-400 text-amber-50 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-2xs hover:shadow-xs cursor-pointer active:scale-98"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-amber-200" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>ಸಂಪೂರ್ಣ ಕೃತಿ ವಿಶ್ಲೇಷಿಸಿ (Decode Full Song)</span>
                  </>
                )}
              </button>

              {input && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  className="text-stone-400 hover:text-stone-700 text-xs px-2.5 py-1.5 rounded-lg transition hover:bg-stone-100 cursor-pointer"
                >
                  ತೆರವುಗೊಳಿಸಿ (Clear)
                </button>
              )}
            </div>

            <span className="text-[11px] text-stone-500 italic hidden md:inline">
              ⚡ ಪಲ್ಲವಿ, ಅನುಪಲ್ಲವಿ ಹಾಗೂ ಸಮಸ್ತ ಚರಣಗಳ ಸಂಪೂರ್ಣ ವಿಶ್ಲೇಷಣೆ
            </span>
          </div>

          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-stone-500 mr-1">ಪ್ರಮುಖ ರಚನೆಗಳು:</span>
            {PRESET_SONGS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleDecode(p.query)}
                className="px-3 py-1 rounded-full bg-[#FAF8F5] hover:bg-amber-100/70 text-stone-700 hover:text-amber-950 border border-stone-200/80 text-[11px] font-medium transition cursor-pointer active:scale-95"
              >
                {p.label}
              </button>
            ))}
          </div>
        </section>

        {error && (
          <div className="bg-red-50/80 border border-red-200 text-red-900 p-4 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 shadow-2xs">
            <svg className="w-4 h-4 text-red-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">{error}</p>
              <p className="text-[11px] text-red-700 mt-0.5">ದಯವಿಟ್ಟು ಕೃತಿಯ ಪಲ್ಲವಿ ಅಥವಾ ಸರಿಯಾದ ಸಾಲುಗಳನ್ನು ನಮೂದಿಸಿ ನೋಡಿ.</p>
            </div>
          </div>
        )}

        {/* Results Workspace */}
        {result && (
          <div className="space-y-6">
            {/* Header Metadata Dossier */}
            <section className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 space-y-5 shadow-xs ring-1 ring-stone-900/5">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 pb-5">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-900/10 text-amber-950 text-xs font-semibold tracking-wide">
                      {result.compositionType}
                    </span>
                    {result.ragaTradition && (
                      <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs">
                        ರಾಗ: {result.ragaTradition}
                      </span>
                    )}
                    {result.talaTradition && (
                      <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs">
                        ತಾಳ: {result.talaTradition}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium">
                      ✓ {result.stanzas.length} ಚರಣಗಳು ಪೂರ್ಣ ಲಭ್ಯ
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                    {result.titleKannada}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 italic">
                    {result.titleEnglish}
                  </p>
                </div>

                <div className="text-left sm:text-right sm:border-l sm:border-stone-100 sm:pl-5 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block font-sans">
                    ಕರ್ತೃ & ಮುದ್ರೆ
                  </span>
                  <p className="text-sm sm:text-base font-serif font-bold text-stone-900">
                    {result.composerKannada}
                  </p>
                  <p className="text-xs text-stone-500 font-sans">
                    {result.composerEnglish}
                  </p>
                  <p className="text-xs text-amber-950 font-serif font-semibold pt-1">
                    ಅಂಕಿತ: {result.ankitaKannada}{" "}
                    <span className="font-normal text-stone-500 italic font-sans">({result.ankitaEnglish})</span>
                  </p>
                </div>
              </div>

              {/* Historical Context Card */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200/70 space-y-1.5">
                <span className="font-bold text-amber-950 font-serif text-xs uppercase tracking-wider block">
                  ಐತಿಹಾಸಿಕ ಹಾಗೂ ಸಾಹಿತ್ಯಿಕ ಹಿನ್ನೆಲೆ (Context):
                </span>
                <p className="text-stone-800 text-sm font-serif leading-relaxed">
                  {result.historicalContextKannada}
                </p>
                <p className="text-stone-600 text-xs italic font-sans">
                  {result.historicalContextEnglish}
                </p>
              </div>

              {/* Classical Rendition YouTube Bar */}
              <div className="bg-[#FAF6EE] border border-amber-900/15 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-900"></span>
                    <h3 className="font-serif font-bold text-amber-950 text-sm">
                      ಶಾಸ್ತ್ರೀಯ ಗಾಯನ <span className="text-xs font-sans text-stone-500 font-normal">| Classical Rendition</span>
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600">
                    {result.classicalRendition?.artist ? `ಗಾಯಕರು: ${result.classicalRendition.artist}` : "ಪ್ರಾಮಾಣಿಕ ಹರಿದಾಸ ಸಂಗೀತ ಸಂಪ್ರದಾಯದ ಗಾಯನ"}
                    {result.classicalRendition?.sourceNote && ` • ${result.classicalRendition.sourceNote}`}
                  </p>
                </div>

                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    result.classicalRendition?.searchQuery ||
                    `${result.titleEnglish} ${result.composerEnglish} classical rendition`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-semibold transition shadow-2xs hover:shadow-xs active:scale-95 shrink-0 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                  <span>ಗಾಯನ ಆಲಿಸಿ (YouTube)</span>
                </a>
              </div>

              {/* Typographic Sizing & PDF Export Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-stone-600 border-t border-stone-100">
                <div className="flex items-center gap-2.5">
                  <span className="font-medium text-stone-500">ಅಕ್ಷರ ಪ್ರಮಾಣ:</span>
                  <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
                    <button
                      onClick={() => setKannadaSize("text-sm leading-relaxed")}
                      className={`px-2.5 py-1 rounded-md text-xs font-serif transition cursor-pointer ${
                        kannadaSize.includes("text-sm") ? "bg-white text-amber-950 font-bold shadow-2xs" : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      ಅ
                    </button>
                    <button
                      onClick={() => setKannadaSize("text-base leading-relaxed")}
                      className={`px-2.5 py-1 rounded-md text-xs font-serif transition cursor-pointer ${
                        kannadaSize.includes("text-base") ? "bg-white text-amber-950 font-bold shadow-2xs" : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      ಅ+
                    </button>
                    <button
                      onClick={() => setKannadaSize("text-lg sm:text-xl leading-relaxed")}
                      className={`px-2.5 py-1 rounded-md text-xs font-serif transition cursor-pointer ${
                        kannadaSize.includes("text-lg") ? "bg-white text-amber-950 font-bold shadow-2xs" : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      ಅ++
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 px-3.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                >
                  <svg className="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>ಮುದ್ರಿಸಿ (Print / PDF)</span>
                </button>
              </div>
            </section>

            {/* Clean Segmented Tab Strip */}
            <div className="flex flex-wrap gap-2 border-b border-stone-200/80 pb-2">
              <button
                onClick={() => setActiveTab("summary")}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  activeTab === "summary"
                    ? "bg-amber-950 text-amber-50 shadow-2xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100 bg-white border border-stone-200/80"
                }`}
              >
                ಸಾರಾಂಶ & ಸಂದೇಶ (Essence)
              </button>

              <button
                onClick={() => setActiveTab("anvaya")}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  activeTab === "anvaya"
                    ? "bg-amber-950 text-amber-50 shadow-2xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100 bg-white border border-stone-200/80"
                }`}
              >
                ಅನ್ವಯ & ಭಾವಾರ್ಥ (Syntax & Meaning)
              </button>

              <button
                onClick={() => setActiveTab("vocab")}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  activeTab === "vocab"
                    ? "bg-amber-950 text-amber-50 shadow-2xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100 bg-white border border-stone-200/80"
                }`}
              >
                ಪ್ರತಿಪದಾರ್ಥ (Vocabulary Table)
              </button>

              {result.metaphorsAndMundige && result.metaphorsAndMundige.length > 0 && (
                <button
                  onClick={() => setActiveTab("mundige")}
                  className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "mundige"
                      ? "bg-amber-950 text-amber-50 shadow-2xs"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100 bg-white border border-stone-200/80"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>ಮುಂಡಿಗೆ / ಗೂಢಾರ್ಥ (Riddle Decoder)</span>
                </button>
              )}
            </div>

            {/* TAB 1: SUMMARY & ESSENCE */}
            {activeTab === "summary" && (
              <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-7 space-y-6 shadow-xs ring-1 ring-stone-900/5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                      ಸಮಗ್ರ ಕೃತಿ ತಾತ್ಪರ್ಯ (Comprehensive Essence)
                    </h3>
                    <span className="text-xs font-serif text-amber-950 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-900/10">
                      {result.stanzas.length} ಚರಣಗಳ ಸಮಗ್ರ ಸಾರ
                    </span>
                  </div>
                  <p className={`text-stone-800 font-serif ${kannadaSize}`}>
                    {result.comprehensiveSummaryKannada}
                  </p>
                  <p className={`text-stone-600 font-sans italic pt-2 border-t border-stone-100 ${englishSize}`}>
                    {result.comprehensiveSummaryEnglish}
                  </p>
                </div>

                <div className="bg-[#FAF8F5] border-l-4 border-amber-800 border-y border-r border-stone-200/80 p-4 sm:p-5 rounded-r-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-800"></span>
                    <h4 className="font-serif font-bold text-amber-950 text-sm sm:text-base">
                      ಇಂದಿನ ಬದುಕಿಗೆ ಸಂದೇಶ (Modern Life Reflection)
                    </h4>
                  </div>
                  <p className="text-stone-900 font-serif text-sm leading-relaxed">
                    {result.modernTakeawayKannada}
                  </p>
                  <p className="text-stone-600 font-sans italic text-xs">
                    {result.modernTakeawayEnglish}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`*${result.titleKannada}* (${result.composerKannada})\n\nಅಂಕಿತ: ${result.ankitaKannada}\n\n*ಸಾರಾಂಶ:* ${result.comprehensiveSummaryKannada.slice(0, 200)}...\n\nದಾಸ ಬೋಧಿನಿಯಲ್ಲಿ ವಿಶ್ಲೇಷಿಸಲಾಗಿದೆ.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.174.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
                    </svg>
                    <span>WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ (Share)</span>
                  </a>
                </div>
              </div>
            )}

            {/* TAB 2: ANVAYA & COMPLETE STANZA BREAKDOWN */}
            {activeTab === "anvaya" && (
              <div className="space-y-5">
                {result.stanzas.map((stanza) => (
                  <div key={stanza.stanzaNumber} className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 space-y-4 shadow-xs ring-1 ring-stone-900/5">
                    {/* Stanza Type Badge */}
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <span className="px-3 py-1 rounded-md bg-stone-100 font-serif font-bold text-xs text-stone-800">
                        {stanza.stanzaType} #{stanza.stanzaNumber}
                      </span>
                    </div>

                    {/* Section 1: Original Stanza */}
                    <div className="space-y-1.5 pl-3 border-l-2 border-stone-300">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block font-sans">
                        ಮೂಲ ಸಾಹಿತ್ಯ (Original Stanza)
                      </span>
                      <p className={`font-serif font-semibold text-stone-900 whitespace-pre-line ${kannadaSize}`}>
                        {stanza.originalTextKannada}
                      </p>
                      <p className="text-xs text-stone-500 italic font-sans whitespace-pre-line pt-0.5">
                        {stanza.originalTextTransliteration}
                      </p>
                    </div>

                    {/* Section 2: Reordered Spoken Syntax (Anvaya) */}
                    <div className="bg-[#FAF8F5] p-4 rounded-xl border-l-4 border-amber-800 border-y border-r border-stone-200/60 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block font-serif">
                        ಅನ್ವಯ ಕ್ರಮ (Reordered Direct Meaning)
                      </span>
                      <p className={`font-serif text-amber-950 font-medium ${kannadaSize}`}>
                        {stanza.anvayaKannada}
                      </p>
                      <p className="text-xs text-stone-600 font-sans italic pt-1.5 border-t border-stone-200/50">
                        {stanza.anvayaEnglish}
                      </p>
                    </div>

                    {/* Section 3: Spiritual Essence */}
                    <div className="space-y-1.5 pl-3 border-l-2 border-emerald-600 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block font-sans">
                        ಆಧ್ಯಾತ್ಮಿಕ ಗೂಢಾರ್ಥ (Inner Significance)
                      </span>
                      <p className={`text-stone-800 font-serif ${kannadaSize}`}>
                        {stanza.spiritualMeaningKannada}
                      </p>
                      <p className={`text-stone-600 italic font-sans ${englishSize}`}>
                        {stanza.spiritualMeaningEnglish}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: VOCABULARY GRID */}
            {activeTab === "vocab" && (
              <div className="space-y-4">
                {result.stanzas.map((stanza) => (
                  <div key={stanza.stanzaNumber} className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 space-y-4 shadow-xs ring-1 ring-stone-900/5">
                    <span className="px-3 py-1 rounded-md bg-stone-100 font-serif font-bold text-xs text-stone-800 inline-block">
                      {stanza.stanzaType} #{stanza.stanzaNumber} - ಪದಾರ್ಥ ವಿವರಣೆ
                    </span>

                    {/* Desktop/Tablet Table Layout */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-stone-200 text-stone-400 font-medium uppercase text-[10px] tracking-wider">
                            <th className="py-2.5 pr-4">ಪದ (Word)</th>
                            <th className="py-2.5 px-4">ಲಿಪ್ಯಂತರ (Transliteration)</th>
                            <th className="py-2.5 px-4">ಕನ್ನಡ ಅರ್ಥ (Meaning)</th>
                            <th className="py-2.5 pl-4">English Meaning</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {stanza.wordByWordBreakdown.map((row, idx) => (
                            <tr key={idx} className="hover:bg-stone-50/80 transition">
                              <td className="py-3 pr-4 font-serif font-semibold text-amber-950">{row.kannadaWord}</td>
                              <td className="py-3 px-4 text-stone-500 font-sans italic text-xs">{row.transliteration}</td>
                              <td className="py-3 px-4 text-stone-800 font-serif">{row.meaningKannada}</td>
                              <td className="py-3 pl-4 text-stone-600 font-sans">{row.meaningEnglish}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Responsive Layout */}
                    <div className="sm:hidden space-y-2.5 divide-y divide-stone-100">
                      {stanza.wordByWordBreakdown.map((row, idx) => (
                        <div key={idx} className="pt-2.5 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-bold text-amber-950 text-sm">{row.kannadaWord}</span>
                            <span className="text-stone-400 font-sans italic text-xs">({row.transliteration})</span>
                          </div>
                          <p className="text-xs text-stone-800 font-serif font-medium">{row.meaningKannada}</p>
                          <p className="text-[11px] text-stone-500 font-sans italic">{row.meaningEnglish}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: MUNDIGE & ALLEGORIES */}
            {activeTab === "mundige" && result.metaphorsAndMundige && (
              <div className="space-y-4">
                <div className="bg-amber-950/5 border border-amber-950/15 p-4 rounded-xl text-xs sm:text-sm text-amber-950 space-y-1">
                  <p className="font-serif font-bold">ಮುಂಡಿಗೆಯ ವೈಶಿಷ್ಟ್ಯ (The Nature of Haridasa Riddles):</p>
                  <p className="text-stone-700 leading-relaxed">
                    ಮುಂಡಿಗೆಗಳಲ್ಲಿ ಬಾಹ್ಯವಾಗಿ ಪ್ರಾಪಂಚಿಕ ಅಥವಾ ಜನಪದ ಕಥೆಗಳಂತೆ ಕಾಣುವ ಸಾಲುಗಳು ಅಂತರಂಗದಲ್ಲಿ ಕುಂಡಲಿನೀ ಯೋಗ, ನವದ್ವಾರ ಶರೀರ ಮತ್ತು ವೇದಾಂತ ತತ್ತ್ವಗಳನ್ನು ಬೋಧಿಸುತ್ತವೆ.
                  </p>
                </div>

                {result.metaphorsAndMundige.map((m, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 space-y-4 shadow-xs ring-1 ring-stone-900/5">
                    <div className="border-b border-stone-100 pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block font-sans">
                        ಮುಂಡಿಗೆ ರೂಪಕ #{idx + 1}
                      </span>
                      <h3 className="font-serif font-bold text-stone-900 text-lg sm:text-xl mt-0.5">
                        {m.allegoryKannada}
                      </h3>
                      <p className="text-xs text-stone-500 italic font-sans">{m.allegoryEnglish}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/60 space-y-1">
                        <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wide block font-sans">
                          ಬಾಹ್ಯ ಲೌಕಿಕ ಕಥೆ (Laukika / Surface Story)
                        </span>
                        <p className="text-stone-800 text-xs sm:text-sm font-serif leading-relaxed">
                          {m.outerMeaningKannada}
                        </p>
                        <p className="text-stone-500 text-xs italic font-sans">{m.outerMeaningEnglish}</p>
                      </div>

                      <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-900/15 space-y-1">
                        <span className="text-[10px] font-bold text-amber-950 uppercase tracking-wide block font-sans">
                          ಅಂತರಂಗ ಯೋಗ & ವೇದಾಂತಾರ್ಥ (Yogic Essence)
                        </span>
                        <p className="text-stone-900 text-xs sm:text-sm font-serif leading-relaxed font-medium">
                          {m.esotericMeaningKannada}
                        </p>
                        <p className="text-stone-700 text-xs italic font-sans">{m.esotericMeaningEnglish}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Structured Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200 ring-1 ring-stone-900/10">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
                <span>ಅನಿಸಿಕೆ / ಸಲಹೆ ಸಲ್ಲಿಸಿ</span>
                <span className="text-xs font-sans text-stone-400 font-normal">(Feedback)</span>
              </h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1.5">
                  ವಿಷಯ / ವಿಭಾಗ ಆಯ್ಕೆಮಾಡಿ (Select Category):
                </label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/50 font-serif text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-900"
                >
                  <option value="ಕೃತಿ ವಿಶ್ಲೇಷಣೆ ದೋಷ (Analysis / Anvaya Correction)">ಕೃತಿ ವಿಶ್ಲೇಷಣೆ ದೋಷ (Analysis Correction)</option>
                  <option value="ಅಂಕಿತ ನಾಮ ಸರಿಪಡಿಸುವಿಕೆ (Composer / Ankita Correction)">ಅಂಕಿತ ನಾಮ ಸರಿಪಡಿಸುವಿಕೆ (Ankita Correction)</option>
                  <option value="ಹೊಸ ಕೃತಿ ಸೇರ್ಪಡೆ ಕೋರಿಕೆ (Request Song Addition)">ಹೊಸ ಕೃತಿ ಸೇರ್ಪಡೆ ಕೋರಿಕೆ (Add Song)</option>
                  <option value="ಶಾಸ್ತ್ರೀಯ ಗಾಯನ ಲಿಂಕ್ ಸಲಹೆ (Audio Rendition Suggestion)">ಶಾಸ್ತ್ರೀಯ ಗಾಯನ ಲಿಂಕ್ ಸಲಹೆ (Rendition Suggestion)</option>
                  <option value="ಸಾಮಾನ್ಯ ಅನಿಸಿಕೆ (General Feedback)">ಸಾಮಾನ್ಯ ಅನಿಸಿಕೆ (General Feedback)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1.5">
                  ನಿಮ್ಮ ವಿವರಣೆ / ಅನಿಸಿಕೆ (Your Comments & Suggestion):
                </label>
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="ನಿಮ್ಮ ಸಲಹೆ ಅಥವಾ ತಿದ್ದುಪಡಿಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/50 text-xs font-serif text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-900 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 text-xs font-medium text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                ರದ್ದುಮಾಡಿ (Cancel)
              </button>
              <button
                type="button"
                onClick={handleSendWhatsAppFeedback}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.174.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
                </svg>
                <span>WhatsApp ನಲ್ಲಿ ಕಳುಹಿಸಿ (Send)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200/70 bg-white py-6 mt-12 text-center text-xs text-stone-500 space-y-1.5">
        <p className="font-serif font-bold text-stone-800">ದಾಸ ಬೋಧಿನಿ • Dāsa Bodhini</p>
        <p className="text-[11px] text-amber-900/90 font-medium">
          Note: This is a Beta version and is currently being tested.
        </p>
        <p className="text-[11px] text-stone-400 pt-0.5">
          Designed & Developed by <span className="font-medium text-stone-600">Madhav N V</span>
        </p>
      </footer>
    </div>
  );
}