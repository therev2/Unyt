"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import styles from "./page.module.css";

// Remove hardcoded API key and use env variable
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const INITIAL_CONTEXT = [
  {
    role: "user",
    parts: [
      {
        text:
          "You are Buddy, a mature, empathetic, and supportive friend who is also knowledgeable about mental health and therapy. Always respond as a caring college student peer and therapist, using a warm, non-judgmental, and encouraging tone. Your goal is to help students feel heard, supported, and empowered."
      }
    ]
  }
];

const INITIAL_MESSAGES = [
  {
    sender: "bot",
    text:
      "Hi, I'm your Buddy! I'm here to listen and support you. This is a safe space for college students to talk about anything on their mind—stress, relationships, studies, or just life in general. How can I help you today?"
  }
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);
    setInput("");
    try {
      const history = [
        ...INITIAL_CONTEXT,
        ...messages
          .filter((m) => m.sender === "user" || m.sender === "bot")
          .map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            parts: [{ text: m.text }]
          })),
        { role: "user", parts: [{ text: input }] }
      ];
      const res = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: history })
      });
      const data = await res.json();
      const botText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't process that. Please try again.";
      setMessages((msgs) => [...msgs, { sender: "bot", text: botText }]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "Sorry, there was an error. Please try again later." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Ask Buddy</title>
      </Head>
      <div className="flex flex-col items-center min-h-screen bg-background py-8">
        <Card className="w-full max-w-xl mx-auto flex flex-col flex-1 shadow-lg h-[80vh]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/bot-avatar.svg" alt="Buddy" />
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <CardTitle>Ask Buddy</CardTitle>
            </div>
          </CardHeader>
          <div className="flex flex-col flex-1 min-h-0">
            <CardContent className={`flex-1 overflow-y-auto max-h-full space-y-4 pb-2 ${styles["custom-scrollbar"]}`} style={{ scrollbarGutter: 'stable' }}>
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-line text-sm break-words ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </CardContent>
            <CardFooter className="border-t pt-4 mt-auto">
              <form className="flex w-full gap-2 items-end" onSubmit={sendMessage}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={loading}
                  className="flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[40px] max-h-32"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(e);
                    }
                  }}
                />
                <Button type="submit" disabled={loading || !input.trim()} className="h-10">Send</Button>
              </form>
            </CardFooter>
          </div>
        </Card>
      </div>
    </>
  );
}
