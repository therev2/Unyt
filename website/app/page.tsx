"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <img src="/placeholder-logo.svg?height=40&width=40" alt="CampusConnext Logo" className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">CampusConnext</span>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to CampusConnext</CardTitle>
            <CardDescription>
              Bridging Colleges, Building Communities
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Button className="w-full" variant="default" onClick={() => window.location.href = '/login'}>
              Login
            </Button>
            <Button className="w-full" variant="outline" onClick={() => window.location.href = '/signup'}>
              Sign Up
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
