import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div className="font-semibold">CampusConnext Dashboard</div>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome to CampusConnext</h1>
              <p className="text-muted-foreground mt-2">Bridging Colleges, Building Communities</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>College Homepage</CardTitle>
                  <CardDescription>View your college's notices, events, and polls</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-40 rounded-md bg-muted flex items-center justify-center">
                    College Content Preview
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Visit College Page</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Global Event Feed</CardTitle>
                  <CardDescription>Discover events from all colleges</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-40 rounded-md bg-muted flex items-center justify-center">Events Preview</div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Explore Events</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quizzes & Battles</CardTitle>
                  <CardDescription>Challenge your knowledge and compete</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-40 rounded-md bg-muted flex items-center justify-center">Quizzes Preview</div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Start a Quiz</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
