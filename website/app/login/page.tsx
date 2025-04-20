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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-.659 1.591l-7.09 7.09a2.25 2.25 0 0 1-3.182 0l-7.09-7.09A2.25 2.25 0 0 1 2.25 6.993V6.75"/></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.5a4.5 4.5 0 0 0-9 0v3m-1.5 0A1.5 1.5 0 0 0 4.5 12v7.5A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5V12a1.5 1.5 0 0 0-1.5-1.5m-13.5 0h15"/></svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12S5.25 6.75 12 6.75 21.75 12 21.75 12s-3 5.25-9.75 5.25S2.25 12 2.25 12z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c0 .943.217 1.84.604 2.647m2.007 3.1A10.45 10.45 0 0 0 12 17.25c3.978 0 7.428-2.227 9.146-5.25a10.46 10.46 0 0 0-4.03-4.522M15 12a3 3 0 11-6 0 3 3 0 016 0zm-7.362 7.362L20.485 4.515" /></svg>
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
              className="w-full h-12 flex items-center justify-center gap-2 rounded-lg font-semibold border border-border transition
                bg-[#23272f] hover:bg-[#16191f] text-white shadow-md"
              style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}
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
              <svg className="h-5 w-5" viewBox="0 0 24 24"><g><path fill="#4285F4" d="M21.805 10.023h-9.765v3.955h5.59c-.241 1.244-1.458 3.649-5.59 3.649-3.367 0-6.102-2.785-6.102-6.15 0-3.366 2.735-6.15 6.102-6.15 1.922 0 3.216.819 3.958 1.527l2.701-2.633C17.187 2.86 14.779 1.7 12 1.7c-5.06 0-9.18 4.12-9.18 9.2 0 5.08 4.12 9.2 9.18 9.2 5.08 0 8.44-3.57 8.44-8.6 0-.58-.063-1.02-.145-1.477z"/><path fill="#34A853" d="M3.545 7.68l2.701 1.982C7.3 7.14 9.47 5.7 12 5.7c1.922 0 3.216.819 3.958 1.527l2.701-2.633C17.187 2.86 14.779 1.7 12 1.7c-3.91 0-7.17 2.76-8.455 6.68z"/><path fill="#FBBC05" d="M12 21.9c2.779 0 5.187-.92 7.078-2.5l-2.928-2.277c-.788.527-1.797.918-3.15.918-2.44 0-4.507-1.65-5.23-3.867l-2.725 2.098C4.83 20.22 8.09 21.9 12 21.9z"/><path fill="#EA4335" d="M21.805 10.023h-9.765v3.955h5.59c-.241 1.244-1.458 3.649-5.59 3.649-3.367 0-6.102-2.785-6.102-6.15 0-3.366 2.735-6.15 6.102-6.15 1.922 0 3.216.819 3.958 1.527l2.701-2.633C17.187 2.86 14.779 1.7 12 1.7c-5.06 0-9.18 4.12-9.18 9.2 0 5.08 4.12 9.2 9.18 9.2 5.08 0 8.44-3.57 8.44-8.6 0-.58-.063-1.02-.145-1.477z"/></g></svg>
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
