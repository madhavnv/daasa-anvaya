"use client";

import React, { useState, useEffect, useRef } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [fontSize, setFontSize] = useState("normal");
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState("kn-IN");
  const recognitionRef = useRef<any>(null);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState("Accuracy Issue");
  const [feedbackText, setFeedbackText] = useState("");

  const FEEDBACK_WHATSAPP_NUMBER = "919999999999";

  const PRESETS = [
    { label: "Tarakka Bindige", query: "tarakka bindige neerige hogona" },
    { label: "Manava Janma", query: "manava janma doddadu idanu hani madikoliro" },
    { label: "Kallu Sakkare", query: "kallu sakkare kolliro neevellaru" },
    { label: "Jagadoddharana", query: "jagadoddharana aadidalo yashoda" }
  ];

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
    const text =
      "*" + result.titleKannada + "* (" + result.titleEnglish + ")\n" +
      "Composer: " + result.composerKannada + " (" + result.composerEnglish + ")\n" +
      "Mudra: " + result.ankitaKannada + "\n\n" +
      "Summary: " + result.comprehensiveSummaryEnglish + "\n\n" +
      "Takeaway: " + result.modernTakeawayEnglish + "\n\n" +
      "Decoded with Dasa Bodhini";

    window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(text), "_blank");
  };

  const sendFeedbackWhatsApp = () => {
    const message =
      "*Dasa Bodhini Beta Feedback*\n" +
      "Category: " + feedbackCategory + "\n" +
      "Query: " + (input || result?.titleEnglish || "General") + "\n" +
      "Notes: " + feedbackText + "\n";
    window.open("https://api.whatsapp.com/send?phone=" + FEEDBACK_WHATSAPP_NUMBER + "&text=" + encodeURIComponent(message), "_blank");
    setFeedbackOpen(false);
    setFeedbackText("");
  };

  const kannadaSize = fontSize === "xlarge" ? "text-xl leading-loose" : fontSize === "large" ? "text-lg leading-relaxed" : "text-base leading-relaxed";
  const englishSize = fontSize === "xlarge" ? "text-lg leading-relaxed" : fontSize === "large" ? "text-base leading-relaxed" : "text-sm leading-relaxed";

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-24 pt-6 px-4 sm:px-6 antialiased">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center space-y-2 border-b border-stone-200 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/5 border border-amber-900/15 text-amber-900 text-xs font-semibold uppercase">
            <span>Dasa Bodhini</span>
            <span>•</span>
            <span>Bilingual Portal</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            ದಾಸ ಬೋಧಿನಿ (Dāsa Bodhini)
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
            ದಾಸ ಸಾಹಿತ್ಯದ ಸರಳ ಅನ್ವಯ, ಇತಿಹಾಸ ಮತ್ತು ಭಾವಾರ್ಥ • Haridasa Sahitya Decoded
          </p>
        </div>

        {/* Search Console */}
        <div className="no-print bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5 space-y-3">
          <div className="relative">
            <textarea
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening... Speak now..." : "Type or speak in Kannada or English (song name or lyrics)..."}
              className={"w-full p-3.5 pr-14 text-sm sm:text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-900/30 transition " + (isListening ? "border-amber-700 bg-amber-50/20" : "border-stone-200")}
            />
            
            <button
              type="button"
              onClick={toggleListening}
              className={"absolute right-3 bottom-4 p-2.5 rounded-full transition shadow-xs " + (isListening ? "bg-red-600 text-white animate-pulse" : "bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200")}
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

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <span className="font-medium text-stone-500">Mic:</span>
              <button
                type="button"
                onClick={() => setSpeechLang("kn-IN")}
                className={"px-2.5 py-1 rounded-md border text-xs " + (speechLang === "kn-IN" ? "bg-stone-900 text-white border-stone-900 font-semibold" : "bg-stone-50 border-stone-200 text-stone-700")}
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => setSpeechLang("en-IN")}
                className={"px-2.5 py-1 rounded-md border text-xs " + (speechLang === "en-IN" ? "bg-stone-900 text-white border-stone-900 font-semibold" : "bg-stone-50 border-stone-200 text-stone-700")}
              >
                English
              </button>
            </div>

            <button
              onClick={() => handleDecode()}
              disabled={loading || !input.trim()}
              className="px-6 py-2.5 bg-amber-900 hover:bg-amber-950 text-amber-50 font-semibold rounded-xl text-xs sm:text-sm transition disabled:opacity-50 ml-auto"
            >
              {loading ? "Analyzing..." : "Decode Song (ಅರ್ಥ ತಿಳಿಸಿ)"}
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap pt-2.5 border-t border-stone-100 text-xs text-stone-500">
            <span className="font-medium text-stone-400">Presets:</span>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setInput(p.query);
                  handleDecode(p.query);
                }}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-md text-stone-700 transition border border-stone-200"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="no-print p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs sm:text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-5">

            {/* Action Bar */}
            <div className="no-print flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
              <div className="flex items-center gap-2 text-stone-500">
                <span className="font-medium">Font:</span>
                <div className="inline-flex rounded-lg border border-stone-200 bg-white p-0.5">
                  <button
                    onClick={() => setFontSize("normal")}
                    className={"px-2 py-0.5 rounded text-xs " + (fontSize === "normal" ? "bg-stone-900 text-white font-semibold" : "text-stone-600")}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize("large")}
                    className={"px-2 py-0.5 rounded text-xs " + (fontSize === "large" ? "bg-stone-900 text-white font-semibold" : "text-stone-600")}
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSize("xlarge")}
                    className={"px-2 py-0.5 rounded text-xs " + (fontSize === "xlarge" ? "bg-stone-900 text-white font-semibold" : "text-stone-600")}
                  >
                    A++
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={exportPDF}
                  className="bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  Export PDF
                </button>
                <button
                  onClick={shareToWhatsApp}
                  className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  WhatsApp Share
                </button>
              </div>
            </div>

            {/* Metadata Card */}
            <div className="bg-[#2B231D] text-amber-50 p-5 rounded-2xl border border-stone-800 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">{result.titleKannada}</h2>
                  <p className="text-stone-300 text-xs sm:text-sm italic">{result.titleEnglish}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest text-amber-400 block font-semibold">ಅಂಕಿತ / Mudra</span>
                  <span className="text-xs sm:text-sm font-serif font-semibold text-amber-100">{result.ankitaKannada}</span>
                  <span className="text-[11px] text-stone-400 block italic">{result.ankitaEnglish}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between border-t border-stone-700 pt-3 text-xs gap-3">
                <span className="text-stone-300">
                  Composer: <strong className="text-white font-medium">{result.composerKannada}</strong> ({result.composerEnglish})
                </span>

                <a
                  href={"https://www.youtube.com/results?search_query=" + encodeURIComponent(result.youtubeSearchQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-print bg-stone-800 hover:bg-stone-700 border border-stone-600 px-3 py-1 rounded-lg text-amber-200 transition font-medium"
                >
                  Play YouTube
                </a>
              </div>
            </div>

            {/* History Card */}
            {(result.historicalContextKannada || result.historicalContextEnglish) && (
              <div className="bg-[#FFFDF9] rounded-2xl border border-amber-900/20 p-5 space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-950 font-serif block">
                  ಐತಿಹ್ಯ ಮತ್ತು ಹಿನ್ನೆಲೆ • Historical Context & Setting
                </span>
                <p className={"font-serif text-stone-900 " + kannadaSize}>
                  {result.historicalContextKannada}
                </p>
                <p className={"text-stone-700 italic font-sans pt-1 border-t border-amber-900/10 " + englishSize}>
                  {result.historicalContextEnglish}
                </p>
              </div>
            )}

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                ಸಮಗ್ರ ಭಾವಾರ್ಥ • Comprehensive Summary
              </span>
              <p className={"font-serif text-stone-900 bg-stone-50 p-3.5 rounded-xl border border-stone-100 " + kannadaSize}>
                {result.comprehensiveSummaryKannada}
              </p>
              <p className={"text-stone-700 font-sans " + englishSize}>
                {result.comprehensiveSummaryEnglish}
              </p>
            </div>

            {/* Stanzas */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 px-1">
                ಪದಾನ್ವಯ ಮತ್ತು ಭಾಗಾರ್ಥ • Stanza Breakdown ({result.stanzas?.length || 0})
              </h3>

              {result.stanzas?.map((stanza: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                  <div className="bg-stone-50 border-b border-stone-100 px-4 py-2.5 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-950 font-serif">
                      {stanza.stanzaType}
                    </span>

                    <button
                      type="button"
                      onClick={() => speakText(stanza.anvayaKannada)}
                      className="no-print text-[11px] text-stone-700 hover:text-stone-900 bg-white border border-stone-300 px-2.5 py-1 rounded-md transition font-medium"
                    >
                      Listen (ಧ್ವನಿ)
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
                        ಕನ್ನಡ ವಾಕ್ಯಾನ್ವಯ (Syntax Flow)
                      </span>
                      <p className={"font-serif text-stone-900 bg-amber-50/40 p-3.5 rounded-xl border border-amber-100/60 " + kannadaSize}>
                        {stanza.anvayaKannada}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                        English Meaning
                      </span>
                      <p className={"text-stone-700 bg-stone-50 p-3.5 rounded-xl border border-stone-200/60 font-sans " + englishSize}>
                        {stanza.anvayaEnglish}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Takeaway */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-950 block">
                ಜೀವನ ಸಂದೇಶ • Practical Reflection
              </span>
              <p className={"font-serif text-stone-900 " + kannadaSize}>
                {result.modernTakeawayKannada}
              </p>
              <p className={"text-stone-600 italic font-sans " + englishSize}>
                {result.modernTakeawayEnglish}
              </p>
            </div>

            {/* Glossary */}
            {result.pratipadaartha?.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-950 block">
                  ಪ್ರತಿಪದಾರ್ಥ • Vocabulary Breakdown
                </span>
                <div className="divide-y divide-stone-100">
                  {result.pratipadaartha.map((w: any, i: number) => (
                    <div key={i} className="py-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs sm:text-sm">
                      <div>
                        <span className="font-semibold text-stone-900">{w.wordKannada}</span>
                        <span className="text-stone-400 text-xs ml-1.5 font-mono">({w.wordTransliterated})</span>
                      </div>
                      <div className="text-stone-700">
                        <span className="text-stone-900 font-medium">{w.meaningKannada}</span>
                        <span className="text-stone-500 block sm:inline sm:ml-2 italic text-xs">"{w.meaningEnglish}"</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metaphors */}
            {result.metaphorsAndMundige?.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-950 block">
                  ಮುಂಡಿಗೆ & ರೂಪಕಗಳು • Allegories
                </span>
                <div className="space-y-2">
                  {result.metaphorsAndMundige.map((m: any, i: number) => (
                    <div key={i} className="p-3.5 bg-stone-50 rounded-xl border border-stone-100 text-xs sm:text-sm space-y-1">
                      <div className="font-semibold text-stone-900">
                        {m.motifKannada} <span className="text-stone-500 font-normal">({m.motifEnglish})</span>
                      </div>
                      <p className="text-stone-700">{m.innerMeaningKannada}</p>
                      <p className="text-stone-500 italic text-xs">{m.innerMeaningEnglish}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Feedback Button */}
      <div className="no-print fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setFeedbackOpen(true)}
          className="bg-stone-900 hover:bg-black text-amber-100 px-3.5 py-2 rounded-full shadow-lg text-xs font-medium border border-stone-700 transition"
        >
          Feedback (ಪ್ರತಿಕ್ರಿಯೆ)
        </button>
      </div>

      {/* Feedback Modal */}
      {feedbackOpen && (
        <div className="no-print fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <h3 className="font-serif font-bold text-stone-900 text-base">
                Beta Feedback
              </h3>
              <button
                onClick={() => setFeedbackOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-500">Category:</label>
              <select
                value={feedbackCategory}
                onChange={(e) => setFeedbackCategory(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-200 rounded-lg bg-stone-50"
              >
                <option value="Meaning Error">Meaning / Translation error</option>
                <option value="Voice Audio Issue">Voice / Audio issue</option>
                <option value="Song Missing">Could not find song</option>
                <option value="Feature Suggestion">Feature request / Suggestion</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-500">Comments:</label>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="What should we improve?..."
                className="w-full text-xs p-2.5 border border-stone-200 rounded-lg"
              />
            </div>

            <button
              onClick={sendFeedbackWhatsApp}
              className="w-full py-2.5 bg-[#1B5E20] hover:bg-[#2E7D32] text-white text-xs font-semibold rounded-xl transition"
            >
              Send via WhatsApp
            </button>
          </div>
        </div>
      )}

    </div>
  );
}