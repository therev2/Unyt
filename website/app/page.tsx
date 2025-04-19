"use client"
import { useCallback } from "react"
import { LandingHero } from "@/components/landing-hero"

export default function LandingPage() {
  const handleLogin = useCallback(() => {
    window.location.href = "/login";
  }, []);
  const handleSignup = useCallback(() => {
    window.location.href = "/signup";
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <img src="/logo-unyt.svg" alt="Unyt Logo" className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">Unyt</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#about" className="text-muted-foreground hover:text-primary font-medium transition-colors">About Us</a>
          <a href="#contact" className="text-muted-foreground hover:text-primary font-medium transition-colors">Contact Us</a>
          <a href="/signup" className="px-4 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-colors">Register</a>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative">
        <LandingHero onLogin={handleLogin} onSignup={handleSignup} />
      </main>
    </div>
  )
}
