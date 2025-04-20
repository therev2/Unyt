"use client";
import { useState } from "react";

const cardStyle = {
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  boxShadow: '0 10px 32px 0 rgba(0,0,0,0.15), 0 2px 4px 0 rgba(0,0,0,0.10)',
  color: '#2c3e50',
  border: '1.5px solid #b0bec5',
  borderRadius: '1rem',
  padding: '2.5rem 2.5rem 2rem 2.5rem',
  minHeight: 160,
  maxWidth: 600,
  margin: '0 auto',
  marginBottom: '1.5rem',
};

export default function SocraticQuestioningPage() {
  const [topic, setTopic] = useState("");
  const [qa, setQa] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setQa([]);
    try {
      const res = await fetch("/api/learn-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "socratic-questioning", topic }),
      });
      const data = await res.json();
      const parsed = JSON.parse(data.result);
      setQa(parsed);
    } catch (err) {
      setError("Failed to generate Q&A. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
      <h1 className="text-3xl font-bold mb-4 text-center">Socratic Questioning</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-xl">
        Enter a topic and get guided, AI-powered Q&A to deepen your understanding.
      </p>
      <form className="flex flex-col items-center w-full max-w-md gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="topic"
          placeholder="Enter a topic (e.g. Quantum Mechanics)"
          className="input input-bordered w-full"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary w-full" disabled={loading || !topic.trim()}>
          {loading ? "Generating..." : "Start Q&A"}
        </button>
      </form>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      <div className="mt-8 w-full max-w-2xl space-y-8">
        {qa.map((pair, i) => (
          <div key={i} style={cardStyle} className="flex flex-col items-center justify-center">
            <div className="font-semibold mb-3 text-lg">Q{i + 1}: {pair.question}</div>
            <div className="text-muted-foreground text-base">A: {pair.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
