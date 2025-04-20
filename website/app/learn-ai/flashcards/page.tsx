"use client";
import { useState, useRef, useEffect } from "react";

export default function FlashcardsPage() {
  const [topic, setTopic] = useState("");
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFlashcards([]);
    setCurrent(0);
    setFlipped(false);
    try {
      const res = await fetch("/api/learn-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "flashcards", topic }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Error: ${res.status}`);
        return;
      }
      try {
        const parsed = JSON.parse(data.result);
        setFlashcards(parsed);
      } catch (parseErr) {
        setError("Received invalid response from AI API. Try again.");
      }
    } catch (err: any) {
      setError("Failed to generate flashcards. Try again. " + (err?.message || ""));
    } finally {
      setLoading(false);
    }
  }

  function goNext() {
    setCurrent((prev) => Math.min(prev + 1, flashcards.length - 1));
    setFlipped(false);
  }
  function goPrev() {
    setCurrent((prev) => Math.max(prev - 1, 0));
    setFlipped(false);
  }

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: carouselRef.current.offsetWidth * current,
        behavior: "smooth",
      });
    }
  }, [current]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
      <h1 className="text-3xl font-bold mb-4 text-center">AI Flashcards</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-xl">
        Enter a topic below and get AI-generated flashcards to help you master any subject!
      </p>
      <form className="flex flex-col items-center w-full max-w-md gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="topic"
          placeholder="Enter a topic (e.g. Photosynthesis)"
          className="input input-bordered w-full"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary w-full" disabled={loading || !topic.trim()}>
          {loading ? "Generating..." : "Generate Flashcards"}
        </button>
      </form>
      {error && <div className="text-red-500 mt-4 whitespace-pre-line">{error}</div>}
      {flashcards.length > 0 && (
        <div className="flex flex-col items-center mt-10 w-full max-w-lg">
          <div
            ref={carouselRef}
            className="w-full overflow-x-hidden flex relative"
            style={{ height: 340 }}
          >
            {flashcards.map((fc, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-full h-full flex items-center justify-center"
                style={{ transition: 'transform 0.5s', transform: `translateX(${(idx - current) * 100}%)` }}
              >
                <div
                  className={`relative w-full h-80 max-w-md mx-auto perspective cursor-pointer select-none`}
                  onClick={() => idx === current && setFlipped(f => !f)}
                >
                  <div
                    className={`absolute w-full h-full transition-transform duration-500 transform ${flipped && idx === current ? "rotate-y-180" : ""}`}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Front (Question) */}
                    <div
                      className={`absolute w-full h-full flex flex-col items-center justify-center rounded-2xl shadow-2xl border border-border text-xl font-semibold backface-hidden px-8 py-8 ${flipped && idx === current ? 'opacity-0' : 'opacity-100'}`}
                      style={{
                        backfaceVisibility: "hidden",
                        minHeight: 270,
                        maxHeight: 270,
                        overflowY: 'auto',
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                        boxShadow: '0 10px 32px 0 rgba(0,0,0,0.15), 0 2px 4px 0 rgba(0,0,0,0.10)',
                        color: '#2c3e50',
                        border: '1.5px solid #b0bec5',
                        zIndex: 2,
                      }}
                    >
                      <span className="block text-center break-words">Q: {fc.question}</span>
                      <span className="mt-2 text-base text-muted-foreground">(Click to show answer)</span>
                    </div>
                    {/* Back (Answer) */}
                    <div
                      className={`absolute w-full h-full flex flex-col items-center justify-center rounded-2xl shadow-2xl border border-border text-xl font-semibold rotate-y-180 backface-hidden px-8 py-8 ${flipped && idx === current ? 'opacity-100' : 'opacity-0'}`}
                      style={{
                        backfaceVisibility: "hidden",
                        minHeight: 270,
                        maxHeight: 270,
                        overflowY: 'auto',
                        background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
                        boxShadow: '0 10px 32px 0 rgba(0,0,0,0.18), 0 2px 4px 0 rgba(0,0,0,0.10)',
                        color: '#2c3e50',
                        border: '1.5px solid #b0bec5',
                        zIndex: 2,
                      }}
                    >
                      <span className="block text-center break-words">A: {fc.answer}</span>
                      <span className="mt-2 text-base text-muted-foreground">(Click to show question)</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-6">
            <button
              className="btn btn-outline"
              onClick={goPrev}
              disabled={current === 0}
            >
              &larr; Previous
            </button>
            <span className="text-lg font-medium">
              Flashcard {current + 1} of {flashcards.length}
            </span>
            <button
              className="btn btn-outline"
              onClick={goNext}
              disabled={current === flashcards.length - 1}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
