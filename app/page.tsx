"use client";

import React, { useState } from "react";

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
  stanzas: StanzaBreakdown[];
  metaphorsAndMundige?: Array<{
    allegoryKannada: string;
    allegoryEnglish: string;
    outerMeaningKannada: string;
    outerMeaningEnglish: string;
    esotericMeaningKannada: string;
    esotericMeaningEnglish: string;
  }>;
  comprehensiveSummaryKannada: string;
  comprehensiveSummaryEnglish: string;
  modernTakeawayKannada: string;
  modernTakeawayEnglish: string;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DecodeResult | null>(null);
  const [activeTab, setActiveTab] = useState<"anvaya" | "vocab" | "mundige" | "summary">("anvaya");

  // Visual & Typographic Controls
  const [kannadaSize, setKannadaSize] = useState<string>("text-base");
  const [englishSize, setEnglishSize] = useState<string>("text-sm");

  // Verified Quick Action Presets
  const PRESET_SONGS = [
    { label: "ಶ್ರೀ ನರಸಿಂಹ ಸೂಳಾದಿ", query: "ವೀರ ಸಿಂಹನೆ ನಾರಸಿಂಹನೆ ದಯ ಪಾರಾವಾರನೆ ಭಯ ನಿವಾರಣ ನಿರ್ಗುಣ ಶ್ರೀ ನರಸಿಂಹ ಸೂಳಾದಿ" },
    { label: "ಶ್ರೀ ದುರ್ಗಾ ಸೂಳಾದಿ", query: "ಜಯ ಜಯತು ಜಯದುರ್ಗೆ ಜಯ ಪರಾಶಕ್ತಿ ಜಗಜ್ಜನನಿ ಶ್ರೀ ದುರ್ಗಾ ಸೂಳಾದಿ" },
    { label: "ಶ್ರೀ ಧನ್ವಂತ್ರಿ ಸೂಳಾದಿ", query: "ಆಯುವೃದ್ಧಿಯಾಗೋದು ಶ್ರೇಯಸ್ಸು ಬರುವುದು ಕಾಯಾ ನಿರ್ಮಲಿನಾ ಕಾರಣವಾಹದೊ ಶ್ರೀ ಧನ್ವಂತ್ರಿ ಸೂಳಾದಿ" },
    { label: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ (ಮುಂಡಿಗೆ)", query: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ ನೀರಿಗೆ ಹೋಗೋಣ ಬಾರೆ ಚೆಲುವೆ ಬಿಂದಿಗೆ ಒಡೆದರೆ ಒಂಬತ್ತು ತೂತು" },
    { label: "ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು", query: "ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು ಇದನು ಹಾನಿ ಮಾಡಲಿಬೇಡಿ ಹುಚ್ಚಪ್ಪಗಳಿರಾ" },
    { label: "ಕಲ್ಲು ಸಕ್ಕರೆ ಕೊಳ್ಳಿರೋ", query: "ಕಲ್ಲು ಸಕ್ಕರೆ ಕೊಳ್ಳಿರೋ ನೀವೆಲ್ಲರು ಕಲ್ಲು ಸಕ್ಕರೆ ಕೊಳ್ಳಿರೋ ಪುರಂದರವಿಠ್ಠಲ" },
  ];

  // Universal Decoder Handler
  const handleDecode = async (overrideInput?: string) => {
    const textToQuery = (typeof overrideInput === "string" ? overrideInput : input).trim();

    if (!textToQuery) {
      setError("ದಯವಿಟ್ಟು ಕೃತಿಯ ಪಲ್ಲವಿ ಅಥವಾ ಸಾಲುಗಳನ್ನು ನಮೂದಿಸಿ ನೋಡಿ.");
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
      if (data.metaphorsAndMundige && data.metaphorsAndMundige.length > 0) {
        setActiveTab("mundige");
      } else {
        setActiveTab("anvaya");
      }
    } catch (err: any) {
      setError(err.message || "ನೆಟ್‌ವರ್ಕ್ ಅಥವಾ ಸರ್ವರ್ ಸಮಸ್ಯೆ. ದಯವಿಟ್ಟು ಮರುಪ್ರಯತ್ನಿಸಿ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 selection:bg-amber-100 flex flex-col font-sans">
      {/* Masthead Header */}
      <header className="border-b border-stone-200/80 bg-white/95 backdrop-blur-xs sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Cultural Tamburi / Sangeetha Icon */}
            <div className="w-9 h-9 rounded-xl bg-amber-900/10 border border-amber-900/20 text-amber-950 flex items-center justify-center shadow-2xs">
              <svg className="w-5 h-5 text-amber-900" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-serif font-bold tracking-tight text-amber-950 flex items-center gap-2">
                <span>ದಾಸ ಬೋಧಿನಿ</span>
                <span className="text-xs font-sans font-normal text-stone-500">| Dāsa Bodhini</span>
              </h1>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                ಹರಿದಾಸ ಸಾಹಿತ್ಯ, ಸೂಳಾದಿ ಮತ್ತು ಮುಂಡಿಗೆಗಳ ಪ್ರಾಮಾಣಿಕ ಸಂಶೋಧನಾ ವೇದಿಕೆ
              </p>
            </div>
          </div>

          {/* Restored Direct WhatsApp Feedback Link */}
          <div className="flex items-center gap-2">
            <a
              href="https://api.whatsapp.com/send?phone=919845509006&text=Namaskara,%20feedback%20regarding%20Dasa%20Bodhini%20app:"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 px-3 py-1.5 rounded-full transition flex items-center gap-1.5 font-medium shadow-2xs cursor-pointer active:scale-95"
            >
              <svg className="w-3.5 h-3.5 fill-current text-emerald-700" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.174.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
              </svg>
              <span>Feedback</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-6 flex-1 space-y-6 w-full">
        {/* Search Console */}
        <section className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-950 font-serif">
              ಕೃತಿ, ಪಲ್ಲವಿ ಅಥವಾ ಸಾಲುಗಳನ್ನು ನಮೂದಿಸಿ (Enter Lyric or First Line)
            </label>
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ಉದಾಹರಣೆಗೆ: ವೀರ ಸಿಂಹನೆ ನಾರಸಿಂಹನೆ ದಯ ಪಾರಾವಾರನೆ... ಅಥವಾ ತಾರಕ್ಕ ಬಿಂದಿಗೆ..."
                rows={3}
                className="w-full text-sm sm:text-base p-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-900/30 focus:border-amber-900 transition bg-stone-50/50 resize-y font-serif"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDecode(input)}
                disabled={loading || !input.trim()}
                className="bg-amber-900 hover:bg-amber-950 disabled:bg-stone-300 text-amber-50 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-2xs cursor-pointer active:scale-95"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
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
                    <span>ವಿಶ್ಲೇಷಿಸಿ (Decode)</span>
                  </>
                )}
              </button>

              {input && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  className="text-stone-400 hover:text-stone-700 text-xs px-2 py-1 rounded transition cursor-pointer"
                >
                  ತೆರವುಗೊಳಿಸಿ (Clear)
                </button>
              )}
            </div>

            <span className="text-[11px] text-stone-500 italic hidden md:inline">
              ⚡ 40+ ಅಧಿಕೃತ ಹರಿದಾಸರ ಅಂಕಿತ ಮುದ್ರೆಗಳೊಂದಿಗೆ ಸಂಶೋಧನಾ ಆಧಾರಿತ ವಿಶ್ಲೇಷಣೆ
            </span>
          </div>

          {/* Quick Canonic Presets */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-stone-600 mr-1">ಪ್ರಮುಖ ರಚನೆಗಳು:</span>
            {PRESET_SONGS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleDecode(p.query)}
                className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-amber-100/70 text-stone-700 hover:text-amber-950 border border-stone-200/80 text-[11px] font-medium transition cursor-pointer active:scale-95"
              >
                {p.label}
              </button>
            ))}
          </div>
        </section>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs sm:text-sm flex items-start gap-2.5">
            <svg className="w-4 h-4 text-red-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">{error}</p>
              <p className="text-[11px] text-red-600 mt-0.5">ದಯವಿಟ್ಟು ಕೃತಿಯ ಪಲ್ಲವಿ ಅಥವಾ ಸರಿಯಾದ ಪದವನ್ನು ನಮೂದಿಸಿ ನೋಡಿ.</p>
            </div>
          </div>
        )}

        {/* Results Workspace */}
        {result && (
          <div className="space-y-6">
            {/* Metadata Dossier Card */}
            <section className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-2xs">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-900/10 text-amber-900 text-xs font-semibold">
                      {result.compositionType}
                    </span>
                    {result.ragaTradition && (
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs">
                        ರಾಗ: {result.ragaTradition}
                      </span>
                    )}
                    {result.talaTradition && (
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs">
                        ತಾಳ: {result.talaTradition}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-950 mt-1.5">
                    {result.titleKannada}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 italic">
                    {result.titleEnglish}
                  </p>
                </div>

                {/* Attribution Box */}
                <div className="text-right sm:border-l sm:border-stone-100 sm:pl-4">
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider block">ಕರ್ತೃ & ಮುದ್ರೆ</span>
                  <p className="text-sm font-bold text-stone-800 font-serif">
                    {result.composerKannada}{" "}
                    <span className="font-normal text-xs text-stone-500">({result.composerEnglish})</span>
                  </p>
                  <p className="text-xs text-amber-900 font-serif font-semibold mt-0.5">
                    ಅಂಕಿತ: {result.ankitaKannada}{" "}
                    <span className="font-normal text-stone-500 italic font-sans">({result.ankitaEnglish})</span>
                  </p>
                </div>
              </div>

              {/* Historical Context */}
              <div className="space-y-1.5 bg-[#FAF8F5] p-3.5 rounded-xl border border-stone-100 text-xs sm:text-sm">
                <span className="font-bold text-amber-950 font-serif block">
                  ಐತಿಹಾಸಿಕ ಹಾಗೂ ಸಾಹಿತ್ಯಿಕ ಹಿನ್ನೆಲೆ (Context):
                </span>
                <p className="text-stone-800 leading-relaxed font-serif">
                  {result.historicalContextKannada}
                </p>
                <p className="text-stone-600 italic font-sans text-xs">
                  {result.historicalContextEnglish}
                </p>
              </div>

              {/* One-Click Verified Classical Rendition Discovery Card */}
              <div className="bg-[#FAF6EE] border border-amber-900/15 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-900/10 text-amber-900">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-amber-950 text-sm sm:text-base flex items-center gap-2">
                        <span>ಶಾಸ್ತ್ರೀಯ ಗಾಯನ</span>
                        <span className="text-xs font-sans font-normal text-amber-900/70">| Classical Rendition</span>
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        ಪ್ರಾಮಾಣಿಕ ಹರಿದಾಸ ಸಂಗೀತ ಸಂಪ್ರದಾಯದ ಗಾಯನ
                      </p>
                    </div>
                  </div>

                  {result.classicalRendition?.artist && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-900/10 text-amber-950 font-serif font-semibold text-xs">
                      {result.classicalRendition.artist}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="text-xs text-stone-700 space-y-0.5">
                    <div className="flex items-center gap-3">
                      <span><strong>ರಾಗ:</strong> {result.classicalRendition?.raga || result.ragaTradition || "ಶಾಸ್ತ್ರೀಯ ರಾಗ"}</span>
                      <span><strong>ತಾಳ:</strong> {result.classicalRendition?.tala || result.talaTradition || "ಸಂಪ್ರದಾಯ ತಾಳ"}</span>
                    </div>
                    {result.classicalRendition?.sourceNote && (
                      <p className="text-[11px] text-stone-500 italic">
                        {result.classicalRendition.sourceNote}
                      </p>
                    )}
                  </div>

                  {/* One-Click Direct Link to Verified YouTube Recordings */}
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      result.classicalRendition?.searchQuery ||
                      `${result.titleEnglish}${result.composerEnglish} classical rendition`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-semibold transition shadow-2xs cursor-pointer active:scale-95 shrink-0"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                    <span>ಶಾಸ್ತ್ರೀಯ ಗಾಯನ ಆಲಿಸಿ (Listen on YouTube)</span>
                  </a>
                </div>
              </div>

              {/* Toolbar: Font Scaling & PDF Export */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-stone-600">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-stone-500">ಕನ್ನಡ ಅಕ್ಷರ:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setKannadaSize("text-sm")}
                      className={`px-2 py-0.5 rounded border cursor-pointer ${kannadaSize === "text-sm" ? "bg-amber-900 text-white border-amber-900" : "bg-white border-stone-200"}`}
                    >
                      ಅ
                    </button>
                    <button
                      onClick={() => setKannadaSize("text-base")}
                      className={`px-2 py-0.5 rounded border cursor-pointer ${kannadaSize === "text-base" ? "bg-amber-900 text-white border-amber-900" : "bg-white border-stone-200"}`}
                    >
                      ಅ+
                    </button>
                    <button
                      onClick={() => setKannadaSize("text-lg sm:text-xl")}
                      className={`px-2 py-0.5 rounded border cursor-pointer ${kannadaSize === "text-lg sm:text-xl" ? "bg-amber-900 text-white border-amber-900" : "bg-white border-stone-200"}`}
                    >
                      ಅ++
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Export PDF (ಮುದ್ರಿಸಿ)</span>
                </button>
              </div>
            </section>

            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-200 gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab("anvaya")}
                className={`py-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
                  activeTab === "anvaya" ? "border-amber-900 text-amber-950 bg-amber-50/50" : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                ಅನ್ವಯ & ಭಾವಾರ್ಥ (Syntax & Meaning)
              </button>

              <button
                onClick={() => setActiveTab("vocab")}
                className={`py-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
                  activeTab === "vocab" ? "border-amber-900 text-amber-950 bg-amber-50/50" : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                ಪ್ರತಿಪದಾರ್ಥ (Vocabulary Grid)
              </button>

              {result.metaphorsAndMundige && result.metaphorsAndMundige.length > 0 && (
                <button
                  onClick={() => setActiveTab("mundige")}
                  className={`py-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "mundige" ? "border-amber-900 text-amber-950 bg-amber-50/50" : "border-transparent text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                  <span>ಮುಂಡಿಗೆ / ಗೂಢಾರ್ಥ (Riddle Decoder)</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab("summary")}
                className={`py-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
                  activeTab === "summary" ? "border-amber-900 text-amber-950 bg-amber-50/50" : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                ಸಾರಾಂಶ & ಸಂದೇಶ (Summary)
              </button>
            </div>

            {/* Tab 1: Anvaya & Spiritual Meaning */}
            {activeTab === "anvaya" && (
              <div className="space-y-4">
                {result.stanzas.map((stanza) => (
                  <div key={stanza.stanzaNumber} className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-stone-100 font-serif font-bold text-xs text-stone-700">
                        {stanza.stanzaType} #{stanza.stanzaNumber}
                      </span>
                    </div>

                    {/* Original Sahitya */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        ಮೂಲ ಸಾಹಿತ್ಯ (Original Text)
                      </span>
                      <p className={`font-serif font-semibold text-stone-900 leading-relaxed whitespace-pre-line ${kannadaSize}`}>
                        {stanza.originalTextKannada}
                      </p>
                      <p className="text-xs text-stone-500 italic font-sans whitespace-pre-line">
                        {stanza.originalTextTransliteration}
                      </p>
                    </div>

                    {/* Anvaya (Spoken Word Syntax Flow) */}
                    <div className="space-y-1 bg-[#FAF8F5] p-3.5 rounded-xl border border-stone-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block font-serif">
                        ಅನ್ವಯ ಕ್ರಮ (Reordered Kannada Syntax Order)
                      </span>
                      <p className={`font-serif text-amber-950 font-medium leading-relaxed ${kannadaSize}`}>
                        {stanza.anvayaKannada}
                      </p>
                      <p className="text-xs text-stone-600 font-sans italic pt-1 border-t border-stone-200/50">
                        {stanza.anvayaEnglish}
                      </p>
                    </div>

                    {/* Inner Spiritual Meaning */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                        ಆಧ್ಯಾತ್ಮಿಕ ಗೂಢಾರ್ಥ (Spiritual Essence)
                      </span>
                      <p className={`text-stone-800 leading-relaxed font-serif ${kannadaSize}`}>
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

            {/* Tab 2: Vocabulary Table (Pratipadaartha) */}
            {activeTab === "vocab" && (
              <div className="space-y-4">
                {result.stanzas.map((stanza) => (
                  <div key={stanza.stanzaNumber} className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3 shadow-2xs">
                    <span className="px-2.5 py-0.5 rounded-md bg-stone-100 font-serif font-bold text-xs text-stone-700">
                      {stanza.stanzaType} #{stanza.stanzaNumber} - ಪದಾರ್ಥ ವಿವರಣೆ
                    </span>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-stone-200 text-stone-400 font-medium uppercase text-[10px] tracking-wider">
                            <th className="py-2 pr-3">ಪದ (Word)</th>
                            <th className="py-2 px-3">ಲಿಪ್ಯಂತರ (Transliteration)</th>
                            <th className="py-2 px-3">ಕನ್ನಡ ಅರ್ಥ (Meaning)</th>
                            <th className="py-2 pl-3">English Meaning</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {stanza.wordByWordBreakdown.map((row, idx) => (
                            <tr key={idx} className="hover:bg-amber-50/40 transition">
                              <td className="py-2.5 pr-3 font-serif font-semibold text-amber-950">{row.kannadaWord}</td>
                              <td className="py-2.5 px-3 text-stone-500 font-sans italic text-xs">{row.transliteration}</td>
                              <td className="py-2.5 px-3 text-stone-800 font-serif">{row.meaningKannada}</td>
                              <td className="py-2.5 pl-3 text-stone-600 font-sans">{row.meaningEnglish}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Mundige & Allegories (Riddle Decoder) */}
            {activeTab === "mundige" && result.metaphorsAndMundige && (
              <div className="space-y-4">
                <div className="bg-amber-900/5 border border-amber-900/20 p-4 rounded-xl text-xs sm:text-sm text-amber-950">
                  <p className="font-serif font-bold">ಮುಂಡಿಗೆಯ ವೈಶಿಷ್ಟ್ಯ (The Nature of Haridasa Riddles):</p>
                  <p className="mt-1 text-stone-700 leading-relaxed">
                    ಮುಂಡಿಗೆಗಳಲ್ಲಿ ಬಾಹ್ಯವಾಗಿ ಪ್ರಾಪಂಚಿಕ ಅಥವಾ ಜನಪದ ಕಥೆಗಳಂತೆ ಕಾಣುವ ಸಾಲುಗಳು ಅಂತರಂಗದಲ್ಲಿ ಕುಂಡಲಿನೀ ಯೋಗ, ನವದ್ವಾರ ಶರೀರ ಮತ್ತು ತತ್ತ್ವಸಿದ್ಧಾಂತಗಳನ್ನು ಬೋಧಿಸುತ್ತವೆ.
                  </p>
                </div>

                {result.metaphorsAndMundige.map((m, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3 shadow-2xs">
                    <div className="border-b border-stone-100 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                        ಮುಂಡಿಗೆ ರೂಪಕ #{idx + 1}
                      </span>
                      <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                        {m.allegoryKannada}
                      </h3>
                      <p className="text-xs text-stone-500 italic font-sans">{m.allegoryEnglish}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100 space-y-1">
                        <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wide block">
                          ಬಾಹ್ಯ ಲೌಕಿಕ ಕಥೆ (Laukika / Surface Meaning)
                        </span>
                        <p className="text-stone-800 text-xs sm:text-sm font-serif leading-relaxed">
                          {m.outerMeaningKannada}
                        </p>
                        <p className="text-stone-500 text-xs italic font-sans">{m.outerMeaningEnglish}</p>
                      </div>

                      <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-100 space-y-1">
                        <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wide block">
                          ಅಂತರಂಗ ಯೋಗ & ವೇದಾಂತಾರ್ಥ (Yogic / Esoteric Meaning)
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

            {/* Tab 4: Comprehensive Summary & Modern Reflection */}
            {activeTab === "summary" && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-2xs">
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-amber-950 border-b border-stone-100 pb-2">
                    ಸಮಗ್ರ ತಾತ್ಪರ್ಯ (Comprehensive Essence)
                  </h3>
                  <p className={`text-stone-800 leading-relaxed font-serif ${kannadaSize}`}>
                    {result.comprehensiveSummaryKannada}
                  </p>
                  <p className={`text-stone-600 font-sans italic leading-relaxed pt-2 border-t border-stone-100 ${englishSize}`}>
                    {result.comprehensiveSummaryEnglish}
                  </p>
                </div>

                <div className="bg-[#FAF8F5] border border-amber-900/15 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-800"></span>
                    <h4 className="font-serif font-bold text-amber-950 text-sm sm:text-base">
                      ಇಂದಿನ ಬದುಕಿಗೆ ಸಂದೇಶ (Modern Life Reflection)
                    </h4>
                  </div>
                  <p className="text-stone-900 font-serif leading-relaxed text-xs sm:text-sm">
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
                    className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-2xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.174.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
                    </svg>
                    <span>WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ (Share Takeaway)</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-center text-xs text-stone-500 space-y-1">
        <p className="font-serif font-semibold text-stone-700">ದಾಸ ಬೋಧಿನಿ • Dāsa Bodhini Workstation</p>
        <p className="text-[11px] text-stone-500">
          ಪ್ರಸ್ಥಾನತ್ರಯ ಹಾಗೂ 40+ ಹರಿದಾಸರ ಅಂಕಿತ ಮುದ್ರೆಗಳ ಸಂಶೋಧನಾ ವೇದಿಕೆ (1263–1983 CE).
        </p>
        <p className="text-[11px] text-stone-400 pt-1">
          Designed & Curated by <span className="font-medium text-stone-600">Madhav N V</span>
        </p>
      </footer>
    </div>
  );
}