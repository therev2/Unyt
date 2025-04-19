"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"

export default function SignupPage() {
  const router = useRouter();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [degreeCollege, setDegreeCollege] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (!registrationNumber || !name || !email || !degreeCollege || !password || !confirmPassword) {
        setError("Please fill in all fields.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      // 1. Register user with Firebase Auth
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // 2. Call backend API to store extra info, including uid
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          username: name,
          email,
          college: degreeCollege,
          regNo: registrationNumber,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to store user info");
      }
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col items-center mb-8"
        >
          <img src="/logo-unyt.svg" alt="Unyt Logo" className="h-16 w-16 mb-4" />
          <span className="text-3xl font-bold tracking-tight text-[#6366f1]">Unyt</span>
          <span className="mt-2 text-base text-gray-300">Create your account to join the community</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <Card className="w-full max-w-xl rounded-3xl shadow-2xl bg-card border border-border py-10 px-8 backdrop-blur-lg">
              <CardHeader className="text-center mb-2">
                <CardTitle className="text-2xl font-bold text-white mb-1">Create your Unyt account</CardTitle>
                <CardDescription className="text-gray-400">Sign up to join the community</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.form
                  className="flex flex-col gap-5"
                  onSubmit={handleSignup}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
                >
                  <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoFocus
                    required
                    className="w-full min-w-0 flex-1 rounded-xl bg-muted border border-border placeholder-muted-foreground text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full min-w-0 flex-1 rounded-xl bg-muted border border-border placeholder-muted-foreground text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  <Input
                    type="text"
                    placeholder="Registration Number"
                    value={registrationNumber}
                    onChange={e => setRegistrationNumber(e.target.value)}
                    required
                    className="w-full min-w-0 flex-1 rounded-xl bg-muted border border-border placeholder-muted-foreground text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  <Input
                    type="text"
                    placeholder="Degree College"
                    value={degreeCollege}
                    onChange={e => setDegreeCollege(e.target.value)}
                    required
                    className="w-full min-w-0 flex-1 rounded-xl bg-muted border border-border placeholder-muted-foreground text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full min-w-0 flex-1 rounded-xl bg-muted border border-border placeholder-muted-foreground text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="w-full min-w-0 flex-1 rounded-xl bg-muted border border-border placeholder-muted-foreground text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                  {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm px-2">{error}</motion.div>}
                  <Button type="submit" className="w-full min-w-0 flex-1 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold py-3 text-lg transition-all shadow-lg">Sign Up</Button>

                </motion.form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
