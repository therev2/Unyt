"use client";
import { useEffect, useRef, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatRoomProps {
  roomId: string;
}

export default function ChatRoom({ roomId }: ChatRoomProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [sendError, setSendError] = useState<string>("");
  const [user, setUser] = useState(() => auth.currentUser);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  // Use the 'Chats' collection for all chatrooms
  // Global: Chats/global/messages
  // College: Chats/{collegeName}/messages
  const collectionPath = ["Chats", roomId, "messages"] as const;

  // Listen for messages
  useEffect(() => {
    setLoading(true);
    setError("");
    const q = query(
      collection(db, ...collectionPath),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      },
      (err) => {
        setError("Failed to load messages: " + err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [roomId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendError("");
    if (!input.trim()) return;
    if (!user) {
      setSendError("You must be logged in to send messages.");
      return;
    }
    try {
      await addDoc(collection(db, ...collectionPath), {
        sender: user.displayName || user.email,
        content: input,
        timestamp: serverTimestamp(),
      });
      setInput("");
    } catch (err: any) {
      setSendError("Failed to send message: " + (err.message || "Unknown error"));
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-80 border rounded-lg p-4 bg-background text-center">
        <div className="mb-2 font-semibold">You must be logged in to use the chatroom.</div>
        <div className="text-sm text-muted-foreground mb-2">Please sign in to send and receive messages.</div>
        {/* Optionally, add a login button here if you have a login route */}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-80 border rounded-lg p-4 bg-background">
      <div className="flex-1 overflow-y-auto mb-2">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading messages...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="mb-1">
              <span className="font-bold">{msg.sender}:</span> {msg.content}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="flex gap-2" onSubmit={sendMessage}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message…"
          disabled={loading || !!error}
        />
        <Button type="submit" disabled={loading || !!error || !input.trim()}>Send</Button>
      </form>
      {sendError && <div className="text-red-500 text-sm mt-1">{sendError}</div>}
    </div>
  );
}

