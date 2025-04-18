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
      <header className="flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <img src="/placeholder-logo.svg?height=40&width=40" alt="CampusConnext Logo" className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">CampusConnext</span>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative">
        <LandingHero onLogin={handleLogin} onSignup={handleSignup} />
      </main>
    </div>
  )
}
