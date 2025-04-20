import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

function stripCodeBlock(text: string) {
  // Remove triple backtick code blocks (with or without 'json')
  return text.replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/im, '$1').trim();
}

export async function POST(req: NextRequest) {
  try {
    const { mode, topic } = await req.json();
    let prompt = "";
    switch (mode) {
      case "flashcards":
        prompt = `Generate a set of 8 flashcards (question and answer pairs) for the topic: "${topic}". Format as JSON: [{\"question\":\"...\",\"answer\":\"...\"}, ...]`;
        break;
      case "socratic-questioning":
        prompt = `Act as a Socratic tutor. Ask a sequence of 7 probing questions and provide their answers to help a student deeply understand: "${topic}". Format as JSON: [{\"question\":\"...\",\"answer\":\"...\"}, ...]`;
        break;
      case "story-based-learning":
        prompt = `Write a short, engaging story (300 words) that teaches the concept of: "${topic}". Format as JSON: {\"story\":\"...\"}`;
        break;
      case "cloze-test":
        prompt = `Create 5 cloze test questions (fill-in-the-blank) for the topic: "${topic}". Each should have a sentence with a blank and the correct answer. Format as JSON: [{\"sentence\":\"...\",\"answer\":\"...\"}, ...]`;
        break;
      case "dialogic-mode":
        prompt = `Simulate an interactive learning conversation about: "${topic}". Start with a question, then alternate between student and AI tutor for 6 turns. Format as JSON: [{\"speaker\":\"AI|Student\",\"text\":\"...\"}, ...]`;
        break;
      case "360-degree-overview":
        prompt = `Describe a detailed representation that would help understand: "${topic}". Include a detailed caption and step-by-step explanation. Format as JSON: {\"visual_description\":\"...\",\"caption\":\"...\",\"steps\": [\"...\"]}`;
        break;
      default:
        return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }
    const res = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
    });
    const data = await res.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    text = stripCodeBlock(text);
    return NextResponse.json({ result: text });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate content." }, { status: 500 });
  }
}
