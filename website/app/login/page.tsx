"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (!email || !password) {
        setError("Please enter both email and password.");
        return;
      }
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/college");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col items-center mb-8"
        >
          <img src="/logo-unyt.svg" alt="Unyt Logo" className="h-16 w-16 mb-4" />
          <span className="text-3xl font-bold tracking-tight text-[#6366f1]">Unyt</span>
          <span className="mt-2 text-base text-gray-300">Connect with your campus community</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <Card className="w-full max-w-sm rounded-2xl shadow-xl bg-[#161e2e] border border-[#232a3b] py-8 px-6">
            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12A4 4 0 118 12a4 4 0 018 0zM12 14v2m0 4h.01' /></svg>
              </span>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
                required
                className="pl-12 h-12 bg-muted border border-border placeholder-muted-foreground text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m0 0a4 4 0 01-4-4h8a4 4 0 01-4 4zm0 0v-2m-6 4h12' /></svg>
              </span>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="pl-12 pr-12 h-12 bg-muted border border-border placeholder-muted-foreground text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label="Show password"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.382-6.625M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.25 5.625A9.956 9.956 0 0012 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.382-6.625" /></svg>
                )}
              </button>
            </div>
            <div className="flex items-center justify-end -mt-3">
              <a href="#" className="text-sm text-primary hover:underline">Forgot Password?</a>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground mt-1">Log In</Button>
            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-border" />
              <span className="mx-2 text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <button
  type="button"
  className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-white text-border font-semibold border border-border hover:bg-gray-100 transition"
  onClick={async () => {
    setError("");
    try {
      const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const { auth, db } = await import("@/lib/firebase");
      const { doc, getDoc, setDoc } = await import("firebase/firestore");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Check if user exists in Firestore
      const studentRef = doc(db, "Students", user.uid);
      const studentSnap = await getDoc(studentRef);
      if (!studentSnap.exists()) {
        await setDoc(studentRef, {
          uid: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          photoURL: user.photoURL || ""
        });
      }
      router.push("/college");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    }
  }}
>
  <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M21.35 11.1h-9.18v2.92h5.26c-.23 1.25-1.45 3.67-5.26 3.67-3.17 0-5.76-2.62-5.76-5.84s2.59-5.84 5.76-5.84c1.81 0 3.03.77 3.73 1.43l2.55-2.48C16.36 3.3 14.4 2.3 12 2.3 6.48 2.3 2 6.7 2 12.1s4.48 9.8 10 9.8c5.16 0 9.18-3.77 9.18-9.1 0-.62-.07-1.09-.16-1.6z"/><path fill="#34A853" d="M3.54 7.76l2.52 1.85C7.13 7.15 9.36 5.7 12 5.7c1.81 0 3.03.77 3.73 1.43l2.55-2.48C16.36 3.3 14.4 2.3 12 2.3c-3.9 0-7.1 2.84-8.46 6.46z"/><path fill="#4A90E2" d="M12 21.9c2.4 0 4.36-.8 5.8-2.16l-2.67-2.18c-.74.52-1.7.92-3.13.92-2.42 0-4.47-1.6-5.19-3.77l-2.52 1.95C4.9 20.16 8.18 21.9 12 21.9z"/><path fill="#FBBC05" d="M21.35 11.1h-9.18v2.92h5.26c-.23 1.25-1.45 3.67-5.26 3.67-3.17 0-5.76-2.62-5.76-5.84s2.59-5.84 5.76-5.84c1.81 0 3.03.77 3.73 1.43l2.55-2.48C16.36 3.3 14.4 2.3 12 2.3 6.48 2.3 2 6.7 2 12.1s4.48 9.8 10 9.8c5.16 0 9.18-3.77 9.18-9.1 0-.62-.07-1.09-.16-1.6z"/></svg>
  Continue with Google
</button>
            
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <a href="/signup" className="text-[#6366f1] font-semibold hover:underline">Sign Up</a>
          </div>
        </Card>
        </motion.div>
      </main>
    </div>
  );
}
