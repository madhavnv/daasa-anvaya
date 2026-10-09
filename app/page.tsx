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
  isAmbiguous?: boolean;
  matches?: Array<{ title: string; composer: string; query: string }>;
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
  bhaktiRasa?: string;
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

interface PresetItem {
  title: string;
  genre: "ಸೂಳಾದಿ" | "ದೇವರನಾಮ" | "ಮುಂಡಿಗೆ";
  caption: string;
  query: string;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DecodeResult | null>(null);
  const [activeTab, setActiveTab] = useState<"lyrics" | "summary" | "anvaya" | "vocab" | "mundige">("lyrics");
  const [retryCount, setRetryCount] = useState(0);

  const [kannadaSize, setKannadaSize] = useState<string>("text-base leading-relaxed");
  const [possibleMatches, setPossibleMatches] = useState<Array<{ title: string; composer: string; query: string }> | null>(null);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const searchConsoleRef = useRef<HTMLDivElement | null>(null);
  const micTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState("ಕೃತಿ ವಿಶ್ಲೇಷಣೆ ದೋಷ (Analysis Correction)");
  const [feedbackComment, setFeedbackComment] = useState("");

  const PRESET_SONGS: PresetItem[] = [
    { title: "ಶ್ರೀ ನರಸಿಂಹ ಸೂಳಾದಿ", genre: "ಸೂಳಾದಿ", caption: "ವಿಜಯದಾಸರ ಸಪ್ತತಾಳ ಅಭಯ ಸ್ತುತಿ", query: "ವೀರ ಸಿಂಹನೆ ನಾರಸಿಂಹನೆ ದಯ ಪಾರಾವಾರನೆ ಭಯ ನಿವಾರಣ ನಿರ್ಗುಣ ಶ್ರೀ ನರಸಿಂಹ ಸೂಳಾದಿ" },
    { title: "ಶ್ರೀ ದುರ್ಗಾ ಸೂಳಾದಿ", genre: "ಸೂಳಾದಿ", caption: "ವಿಜಯದಾಸರ ದುರ್ಗಾಂತರ್ಗತ ಹರಿ ಸ್ತುತಿ", query: "ದುರ್ಗಾ ದುರ್ಗೆಯೆ ಮಹಾದುಷ್ಟಜನ ಸಂಹಾರೆ ದುರ್ಗಾಂತರ್ಗತ ದುರ್ಗೆ ದುರ್ಲಭೆ ಸುಲಭೆ ಶ್ರೀ ದುರ್ಗಾ ಸೂಳಾದಿ ವಿಜಯದಾಸರು" },
    { title: "ಶ್ರೀ ವೆಂಕಟೇಶ ಸೂಳಾದಿ", genre: "ಸೂಳಾದಿ", caption: "ಗೋಪಾಲದಾಸರ ತಿರುಪತಿ ಶ್ರೀನಿವಾಸ ಸ್ತುತಿ", query: "ಶ್ರೀ ವೆಂಕಟೇಶ ನಾರಾಯಣ ಪರಮಪುರುಷ ಗೋಪಾಲವಿಠ್ಠಲ ಸೂಳಾದಿ" },
    { title: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ", genre: "ಮುಂಡಿಗೆ", caption: "ಪುರಂದರದಾಸರ ಕಾಯ-ಯೋಗ ಗೂಢಾರ್ಥ", query: "ತಾರಕ್ಕ ಬಿಂದಿಗೆ ನೀರಿಗೆ ಹೋಗೋಣ ಬಾರೆ ಚೆಲುವೆ ಬಿಂದಿಗೆ ಒಡೆದರೆ ಒಂಬತ್ತು ತೂತು" },
    { title: "ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು", genre: "ದೇವರನಾಮ", caption: "ಪುರಂದರದಾಸರ ಪರಮ ವೈರಾಗ್ಯ ಗೀತೆ", query: "ಮಾನವ ಜನ್ಮ ದೊಡ್ಡದು ಇದನು ಹಾನಿ ಮಾಡಲಿಬೇಡಿ ಹುಚ್ಚಪ್ಪಗಳಿರಾ" },
    { title: "ಯಾರಿಗೆ ಯಾರುಂಟು", genre: "ದೇವರನಾಮ", caption: "ಕನಕದಾಸರ ಸಂಸಾರ ನೀತಿ ಬೋಧೆ", query: "ಯಾರಿಗೆ ಯಾರುಂಟು ಎರವಿನ ಸಂಸಾರ ಕಾಗಿನೆಲೆಯಾದಿಕೇಶವ ಕನಕದಾಸರು" },
  ];

  const stopListening = () => {
    if (micTimeoutRef.current) {
      clearTimeout(micTimeoutRef.current);
      micTimeoutRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsListening(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "kn-IN";

        recognition.onstart = () => {
          setIsListening(true);
          if (micTimeoutRef.current) clearTimeout(micTimeoutRef.current);
          micTimeoutRef.current = setTimeout(() => { stopListening(); }, 8000);
        };
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript && transcript.trim()) setInput(transcript.trim());
          stopListening();
        };
        recognition.onspeechend = () => stopListening();
        recognition.onnomatch = () => stopListening();
        recognition.onerror = () => stopListening();
        recognition.onend = () => stopListening();
        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (micTimeoutRef.current) clearTimeout(micTimeoutRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗ್ರಹಿಕೆ (Voice typing) ಸೌಲಭ್ಯ ಲಭ್ಯವಿಲ್ಲ.");
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      setInput("");
      textareaRef.current?.focus();
      try {
        recognitionRef.current.start();
      } catch (err) {
        recognitionRef.current.abort();
        setTimeout(() => {
          try { recognitionRef.current.start(); } catch (e) { setIsListening(false); }
        }, 100);
      }
    }
  };

  const handleToggleSarvamVoice = async () => {
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlayingAudio(false);
      return;
    }

    if (!result) return;

    let textToRead = "";
    if (activeTab === "lyrics") {
      const fullLyrics = result.stanzas.map(s => `${s.stanzaType}. ${s.originalTextKannada}`).join(" ");
      textToRead = `${result.titleKannada}. ರಚನೆ: ${result.composerKannada}. ${fullLyrics}`.trim();
    } else if (activeTab === "summary") {
      textToRead = `${result.titleKannada}. ಕರ್ತೃ ${result.composerKannada}. ಸಾರಾಂಶ: ${result.comprehensiveSummaryKannada}`.trim();
    } else if (activeTab === "anvaya") {
      textToRead = result.stanzas.map(s => `${s.stanzaType}. ${s.anvayaKannada}`).join(" ");
    } else if (activeTab === "vocab") {
      textToRead = result.stanzas.map(s => s.wordByWordBreakdown.map(w => `${w.kannadaWord} ಎಂದರೆ ${w.meaningKannada}`).join(", ")).join(". ");
    } else {
      textToRead = `${result.titleKannada}.`.trim();
    }

    try {
      setIsPlayingAudio(true);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToRead, language_code: "kn-IN", speaker: "priya" }),
      });

      const data = await res.json();
      if (!res.ok || !data.audioBase64) throw new Error(data.error || "TTS failed");

      const audioBytes = Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0));
      const blob = new Blob([audioBytes], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);

      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);
      await audio.play();
    } catch (err: any) {
      console.error(err);
      setIsPlayingAudio(false);
    }
  };

  const handleDecode = async (overrideInput?: string, isRetry: boolean = false) => {
    const textToQuery = (typeof overrideInput === "string" ? overrideInput : input).trim();
    if (!textToQuery) return;

    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }

    setInput(textToQuery);
    setLoading(true);
    setError(null);
    setPossibleMatches(null);

    const nextRetry = isRetry ? retryCount + 1 : 0;
    if (isRetry) setRetryCount(nextRetry);

    try {
      const res = await fetch("/api/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToQuery, input: textToQuery, retryAttempt: nextRetry }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ವಿಶ್ಲೇಷಣೆ ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.");

      if (data.isAmbiguous && data.matches) {
        setPossibleMatches(data.matches);
        setLoading(false);
        return;
      }

      setResult(data);
      setActiveTab("lyrics");

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: any) {
      setError(err.message || "ನೆಟ್‌ವರ್ಕ್ ಅಥವಾ ಸರ್ವರ್ ಸಮಸ್ಯೆ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 flex flex-col font-sans antialiased">
      <header className="border-b border-stone-200/75 bg-[#FDFBF7]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-serif font-bold text-stone-900">ದಾಸ ಬೋಧಿನಿ</h1>
            <span className="text-xs text-stone-500 uppercase tracking-widest">| Dāsa Bodhini</span>
          </div>
          <button onClick={() => setShowFeedbackModal(true)} className="text-xs bg-white border border-stone-200 px-3 py-1.5 rounded-full cursor-pointer">Feedback</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 flex-1 space-y-6 w-full">
        <section ref={searchConsoleRef} className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-xs">
          <div className="relative group">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ಕೃತಿಯ ಪಲ್ಲವಿ ಅಥವಾ ಸಾಲುಗಳನ್ನು ಇಲ್ಲಿ ನಮೂದಿಸಿ..."
              rows={3}
              className="w-full text-base p-4 pr-12 rounded-xl border border-stone-200 bg-[#FCFBF9] focus:bg-white focus:outline-none font-serif resize-none"
            />
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleMic}
              title={isListening ? "ನಿಲ್ಲಿಸಿ" : "ಧ್ವನಿಯ ಮೂಲಕ ಹುಡುಕಿ"}
              className={`absolute right-3.5 bottom-3.5 p-2 rounded-lg transition cursor-pointer ${
                isListening ? "bg-red-600 text-white animate-pulse" : "bg-white hover:bg-stone-100 text-stone-600 border border-stone-200"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => handleDecode(input, false)}
              disabled={loading || !input.trim()}
              className="px-6 py-2.5 rounded-xl bg-amber-950 text-amber-50 text-xs font-semibold cursor-pointer disabled:bg-stone-200 disabled:text-stone-400"
            >
              {loading ? "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ..." : "ಸಂಪೂರ್ಣ ಕೃತಿ ವಿಶ್ಲೇಷಿಸಿ (Decode Full Song)"}
            </button>
            {input && (
              <button onClick={() => setInput("")} className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer">ತೆರವುಗೊಳಿಸಿ</button>
            )}
          </div>

          {/* Quick Presets Section */}
          <div className="pt-3 border-t border-stone-100 space-y-2">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">ಪ್ರಮುಖ ಕೃತಿಗಳ ಸಂಕಲನ (Quick Presets):</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {PRESET_SONGS.map((p) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => handleDecode(p.query, false)}
                  className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-amber-50 border border-stone-200 text-left transition cursor-pointer flex flex-col justify-between gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-xs text-stone-900">{p.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/10 text-amber-900">{p.genre}</span>
                  </div>
                  <span className="text-[11px] text-stone-500 italic">{p.caption}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {possibleMatches && (
          <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl space-y-2">
            <p className="font-serif font-bold text-amber-950 text-xs">ಹಲವಾರು ಕೃತಿಗಳು ಲಭ್ಯವಿವೆ. ಸರಿಯಾದದ್ದನ್ನು ಆಯ್ಕೆಮಾಡಿ:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {possibleMatches.map((m, idx) => (
                <button key={idx} onClick={() => handleDecode(m.query, false)} className="p-2.5 bg-white border border-amber-200 rounded-lg text-left text-xs font-serif font-bold cursor-pointer">
                  {m.title} ({m.composer})
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-900 p-4 rounded-xl text-xs border border-red-200">{error}</div>
        )}

        <div ref={resultsRef}>
          {result && (
            <div className="space-y-6">
              <section className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-xs">
                <div className="flex flex-wrap justify-between items-start gap-3">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-amber-900/10 text-amber-950 text-xs">{result.compositionType}</span>
                    <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">{result.titleKannada}</h2>
                    <p className="text-xs text-stone-500">{result.composerKannada} | ಅಂಕಿತ: {result.ankitaKannada}</p>
                  </div>
                  {/* Automatic Next Matching Retry Button */}
                  <button
                    type="button"
                    onClick={() => handleDecode(input, true)}
                    className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-900/30 text-amber-950 text-xs rounded-lg font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>🔄 ತಪ್ಪಾದ ಕೃತಿಯೇ? ಬೇರೆ ಕೃತಿ ಹುಡುಕಿ (Next Match)</span>
                  </button>
                </div>
              </section>

              <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setActiveTab("lyrics")} className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${activeTab === "lyrics" ? "bg-amber-950 text-amber-50" : "bg-white border text-stone-600"}`}>ಸಂಪೂರ್ಣ ಸಾಹಿತ್ಯ (Complete Lyrics)</button>
                  <button onClick={() => setActiveTab("summary")} className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${activeTab === "summary" ? "bg-amber-950 text-amber-50" : "bg-white border text-stone-600"}`}>ಸಾರಾಂಶ (Summary)</button>
                  <button onClick={() => setActiveTab("anvaya")} className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${activeTab === "anvaya" ? "bg-amber-950 text-amber-50" : "bg-white border text-stone-600"}`}>ಅನ್ವಯ (Anvaya)</button>
                </div>
                <button type="button" onClick={handleToggleSarvamVoice} className="px-3.5 py-2 border rounded-xl text-xs font-semibold bg-white text-amber-950 border-amber-900/30 flex items-center gap-1.5 cursor-pointer shadow-2xs">
                  <span>{isPlayingAudio ? "ನಿಲ್ಲಿಸಿ (Stop)" : "ಆಲಿಸಿ (Listen Audio)"}</span>
                </button>
              </div>

              {activeTab === "lyrics" && (
                <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">ಪಲ್ಲವಿ ಹಾಗೂ ಎಲ್ಲಾ ಚರಣಗಳು (Full Stanzas):</h3>
                  {result.stanzas?.map((s, idx) => (
                    <div key={idx} className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200 space-y-1">
                      <span className="text-[11px] font-bold text-amber-900 uppercase font-serif">{s.stanzaType} #{s.stanzaNumber}</span>
                      <p className={`font-serif font-semibold text-stone-900 whitespace-pre-line ${kannadaSize}`}>{s.originalTextKannada}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "summary" && (
                <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
                  <p className={`font-serif text-stone-800 ${kannadaSize}`}>{result.comprehensiveSummaryKannada}</p>
                </div>
              )}

              {activeTab === "anvaya" && (
                <div className="space-y-4">
                  {result.stanzas?.map((s, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-stone-200 p-5 space-y-2">
                      <span className="font-serif font-bold text-xs text-stone-800">{s.stanzaType} #{s.stanzaNumber}</span>
                      <p className={`font-serif text-amber-950 ${kannadaSize}`}>{s.anvayaKannada}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}