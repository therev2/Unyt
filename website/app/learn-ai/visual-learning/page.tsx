"use client";
import { useState } from "react";

const cardStyle = {
  background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  boxShadow: '0 10px 32px 0 rgba(0,0,0,0.18), 0 2px 4px 0 rgba(0,0,0,0.10)',
  color: '#2c3e50',
  border: '1.5px solid #b0bec5',
  borderRadius: '1rem',
  padding: '2.5rem 2.5rem 2rem 2.5rem',
  minHeight: 160,
  maxWidth: 700,
  margin: '0 auto',
  marginBottom: '1.5rem',
};

export default function VisualLearningPage() {
  const [topic, setTopic] = useState("");
  const [visual, setVisual] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVisual(null);
    try {
      const res = await fetch("/api/learn-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "360-degree-overview", topic }),
      });
      const data = await res.json();
      const parsed = JSON.parse(data.result);
      setVisual(parsed);
    } catch (err) {
      setError("Failed to generate visual. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
      <h1 className="text-3xl font-bold mb-4 text-center">360 Degree Overview</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-xl">
        Enter a topic and get AI-generated diagrams or visuals to help you understand complex concepts.
      </p>
      <form className="flex flex-col items-center w-full max-w-md gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="topic"
          placeholder="Enter a topic (e.g. DNA Structure)"
          className="input input-bordered w-full"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary w-full" disabled={loading || !topic.trim()}>
          {loading ? "Generating..." : "Generate Visuals"}
        </button>
      </form>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {visual && (
        <div className="mt-8 w-full max-w-2xl">
          <div style={cardStyle}>
            <div className="font-semibold mb-3">Visual Description:</div>
            <div className="mb-3">{visual.visual_description}</div>
            <div className="font-semibold mb-3">Caption:</div>
            <div className="mb-3">{visual.caption}</div>
            <div className="font-semibold mb-3">Steps:</div>
            <ul className="list-disc pl-6 mb-1">
              {visual.steps?.map((step: string, i: number) => (
                <li key={i} className="mb-1">{step}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
